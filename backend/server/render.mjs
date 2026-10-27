import { createServer } from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, stat, readdir } from 'node:fs/promises';
import { resolve, join, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDemo, act, project, publicTracking, DomainError } from './domain.mjs';
import { createAccountAuth } from './account-auth.mjs';
import { APP_HOME_URL } from '../../shared/app-routes.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const COOKIE = 'synera_demo';
const TTL = 7 * 86400;
const ID_PATTERN = /^[a-f0-9]{64}$/;
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const SECURITY = {
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'same-origin',
  'X-Frame-Options':'DENY',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

export async function createRenderServer({
  clientDir = join(ROOT,'dist-render/client'),
  dataDir = process.env.SYNERA_DATA_DIR || join(ROOT,'.data'),
  publicOrigin = process.env.RENDER_EXTERNAL_URL || process.env.SYNERA_PUBLIC_ORIGIN || '',
  secureCookies = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production',
  maxSessions = 1000,
} = {}) {
  clientDir = resolve(clientDir); dataDir = resolve(dataDir);
  await mkdir(dataDir,{recursive:true,mode:0o700});
  const locks = new Map();
  let accountStore;
  const accounts = () => accountStore ||= createAccountAuth({ filename: join(dataDir, 'accounts.sqlite'), secureCookies });
  const json = (res,status,value) => {
    res.writeHead(status,{...SECURITY,'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store'});
    res.end(JSON.stringify(value));
  };
  const fileFor = id => join(dataDir,id+'.json');
  async function writeState(id,state) {
    const temporary=join(dataDir,id+'.'+randomUUID()+'.tmp');
    await writeFile(temporary,JSON.stringify({expiresAt:Date.now()+TTL*1000,state}),{mode:0o600});
    await rename(temporary,fileFor(id));
  }
  async function readState(id) {
    if(!ID_PATTERN.test(id||''))return null;
    try {
      const value=JSON.parse(await readFile(fileFor(id),'utf8'));
      return value.expiresAt>Date.now()?value.state:null;
    } catch(e) { if(e.code==='ENOENT')return null;throw e; }
  }
  async function locked(id,operation) {
    const previous=locks.get(id)||Promise.resolve();
    const work=previous.then(operation);
    const tail=work.then(()=>{},()=>{}); locks.set(id,tail);
    try{return await work;}finally{if(locks.get(id)===tail)locks.delete(id);}
  }
  function sessionId(req) {
    const matches=(req.headers.cookie||'').split(';').map(p=>p.trim()).filter(p=>p.startsWith(COOKIE+'='));
    return matches.length===1?matches[0].slice(COOKIE.length+1):'';
  }
  async function session(req,res,create=false) {
    if (accounts().hasCookie(req)) {
      const authenticated = accounts().session(req);
      if (!authenticated) throw new DomainError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',401);
      return { id: 'account:' + authenticated.user.id, accountId: authenticated.user.id, state: accounts().readWorkspace(authenticated.user.id) };
    }
    let id=sessionId(req),state=await readState(id);
    if(!state&&create){
      const files=await readdir(dataDir);
      if(files.filter(f=>/^[a-f0-9]{64}\.json$/.test(f)).length>=maxSessions)throw new DomainError('Bản demo đã đạt giới hạn phiên. Vui lòng thử lại sau.',503);
      // Unknown or tampered cookies never choose the new server-side identifier.
      id=randomBytes(32).toString('hex');state=createDemo();await writeState(id,state);
      res.setHeader('Set-Cookie',`${COOKIE}=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TTL}${secureCookies?'; Secure':''}`);
    }
    if(!state)throw new DomainError('Phiên demo đã hết hạn. Tải lại trang để tạo phiên mới.',401);
    return {id,state};
  }
  const projection=state=>({...project(state),runtime:'render',storage:'ephemeral'});
  async function body(req,limit=100000) {
    let length=0;const chunks=[];
    for await(const chunk of req){length+=chunk.length;if(length>limit)throw new DomainError('Yêu cầu quá lớn.',413);chunks.push(chunk);}
    try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new DomainError('Nội dung JSON không hợp lệ.',400);}
  }
  async function api(req,res,url) {
    if(req.method==='GET') {
      const token=url.searchParams.get('tracking');
      const {state}=await session(req,res,!token);
      return json(res,200,token?publicTracking(state,token):projection(state));
    }
    if(req.method!=='POST'){res.setHeader('Allow','GET, POST');throw new DomainError('Phương thức không được hỗ trợ.',405);}
    const value=await body(req);
    const expected=publicOrigin?new URL(publicOrigin).origin:new URL('http://'+req.headers.host).origin;
    if(req.headers.origin!==expected)throw new DomainError('Nguồn yêu cầu không hợp lệ.',403);
    if(!value||typeof value!=='object'||Array.isArray(value)||typeof value.action!=='string'||!Number.isSafeInteger(value.version)||value.payload!==undefined&&(!value.payload||typeof value.payload!=='object'||Array.isArray(value.payload)))throw new DomainError('Yêu cầu không hợp lệ.',400);
    const {id,accountId}=await session(req,res);
    return locked(id,async()=>{
      const state=accountId?accounts().readWorkspace(accountId):await readState(id);
      if(!state)throw new DomainError('Phiên demo đã hết hạn. Tải lại trang để tạo phiên mới.',401);
      if(value.version!==state.version)throw new DomainError('Dữ liệu đã đổi ở cửa sổ khác. Tải lại rồi thử tiếp.',409);
      const next=act(state,value.action,value.payload||{});
      if(value.action==='quote')return json(res,200,next);
      next.version=state.version+1;
      if(accountId)accounts().writeWorkspace(accountId,next,state.version);else await writeState(id,next);
      return json(res,200,projection(next));
    });
  }
  async function accountApi(req,res,url) {
    if(url.pathname==='/api/auth/session' && req.method==='GET') {
      const authenticated=accounts().session(req);
      return json(res,200,{authenticated:!!authenticated,user:authenticated?.user||null,homeRoute:APP_HOME_URL,runtime:'node'});
    }
    if(!['/api/auth/login','/api/auth/register','/api/auth/logout'].includes(url.pathname))throw new DomainError('Không tìm thấy chức năng xác thực.',404);
    if(req.method!=='POST'){res.setHeader('Allow','POST');throw new DomainError('Phương thức không được hỗ trợ.',405);}
    const expected=publicOrigin?new URL(publicOrigin).origin:new URL('http://'+req.headers.host).origin;
    if(req.headers.origin!==expected)throw new DomainError('Nguồn yêu cầu không hợp lệ.',403);
    if(!req.headers['content-type']?.startsWith('application/json'))throw new DomainError('Biểu mẫu cần gửi JSON.',415);
    const value=await body(req,16384);
    if(url.pathname==='/api/auth/logout'){
      res.setHeader('Set-Cookie',accounts().logout(req));
      return json(res,200,{authenticated:false,user:null,homeRoute:APP_HOME_URL});
    }
    const result=await accounts()[url.pathname.endsWith('/register')?'register':'login'](value,req.socket.remoteAddress||'unknown');
    accounts().logout(req);
    res.setHeader('Set-Cookie',result.setCookie);
    return json(res,url.pathname.endsWith('/register')?201:200,{authenticated:true,user:result.user,homeRoute:APP_HOME_URL});
  }
  async function staticFile(req,res,url) {
    if(!['GET','HEAD'].includes(req.method))throw new DomainError('Phương thức không được hỗ trợ.',405);
    let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{throw new DomainError('Đường dẫn không hợp lệ.',400);}
    if(pathname==='/'||pathname==='/index.html')pathname='/index.html';
    else if(!pathname.startsWith('/assets/')&&!['/favicon.svg','/favicon-synera.svg'].includes(pathname))throw new DomainError('Không tìm thấy trang.',404);
    const full=resolve(clientDir,'.'+pathname);
    if(!full.startsWith(clientDir+sep)||pathname.includes('\0')||pathname.includes('\\'))throw new DomainError('Không tìm thấy trang.',404);
    let bytes;try{const info=await stat(full);if(!info.isFile())throw new DomainError('Không tìm thấy trang.',404);bytes=await readFile(full);}catch(e){if(e.code==='ENOENT'||e.code==='ENOTDIR')throw new DomainError('Không tìm thấy trang.',404);throw e;}
    res.writeHead(200,{...SECURITY,'Content-Type':MIME[extname(full)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-store'});
    res.end(req.method==='HEAD'?undefined:bytes);
  }
  const server=createServer(async(req,res)=>{
    try {
      const url=new URL(req.url,'http://localhost');
      if(url.pathname==='/healthz'&&req.method==='GET')return json(res,200,{status:'ok',service:'synera',mode:'demo'});
      if(url.pathname.startsWith('/api/auth/'))return await accountApi(req,res,url);
      if(url.pathname==='/signin-with-chatgpt'&&req.method==='GET'){res.writeHead(302,{...SECURITY,Location:'/?auth=login','Cache-Control':'no-store'});res.end();return;}
      if(url.pathname==='/api/demo')return await api(req,res,url);
      await staticFile(req,res,url);
    } catch(e) {
      if(res.headersSent){res.destroy();return;}
      const status=e instanceof DomainError?e.status:500;
      if(status===500)console.error('SYNERA request failed:',e.name||'Error');
      json(res,status,{error:e instanceof DomainError?e.message:'Chưa xử lý được yêu cầu. Vui lòng thử lại.'});
    }
  });
  server.on('close',()=>accountStore?.close());
  return server;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const server=await createRenderServer();
  const port=Number(process.env.PORT||10000);
  server.listen(port,'0.0.0.0',()=>console.log(`SYNERA demo listening on port ${port}`));
  process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
  process.on('SIGINT',()=>server.close(()=>process.exit(0)));
}
