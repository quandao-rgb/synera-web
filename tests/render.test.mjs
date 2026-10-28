import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { once } from 'node:events';
import { createRenderServer } from '../backend/server/render.mjs';

let server,folder,base;
before(async()=>{
  folder=await mkdtemp(join(tmpdir(),'synera-render-test-'));
  const clientDir=join(folder,'client');await mkdir(join(clientDir,'assets'),{recursive:true});
  await writeFile(join(clientDir,'index.html'),'<!doctype html><html lang="vi"><title>SYNERA</title><div id="root"></div></html>');
  await writeFile(join(clientDir,'assets','app.js'),'console.log("safe client")');
  await writeFile(join(clientDir,'assets','hero.mp4'),Buffer.from('0123456789abcdef'));
  server=await createRenderServer({clientDir,dataDir:join(folder,'data'),secureCookies:false});
  server.listen(0,'127.0.0.1');await once(server,'listening');base='http://127.0.0.1:'+server.address().port;
});
after(async()=>{
  server.closeAllConnections();await new Promise(r=>server.close(r));
  const checked=resolve(folder);assert.ok(checked.startsWith(resolve(tmpdir())+sep+'synera-render-test-'));
  await rm(checked,{recursive:true,force:true});
});
async function request(path,{cookie,action,payload={},version=0,origin=base,raw,headers={}}={}){
  const hasBody=action!==undefined||raw!==undefined;
  const res=await fetch(base+path,{method:hasBody?'POST':'GET',headers:{...headers,...(cookie?{Cookie:cookie}:{}),...(hasBody?{Origin:origin,'Content-Type':'application/json'}:{})},body:hasBody?(raw??JSON.stringify({action,payload,version})):undefined});
  const text=await res.text();return {status:res.status,headers:res.headers,body:res.headers.get('content-type')?.includes('application/json')?JSON.parse(text):text};
}
async function bootstrap(){const r=await request('/api/demo');assert.equal(r.status,200);return {...r,cookie:r.headers.get('set-cookie').split(';')[0]};}
function assertNoMoney(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){assert.ok(!['price','total','cod','discount','declaredValue','finance','debt','carrierHolding','received'].includes(k),k);assertNoMoney(v);}}

test('Render serves the app, assets and health, never source or local records',async()=>{
  assert.equal((await request('/')).status,200);
  assert.equal((await request('/assets/app.js')).status,200);
  assert.equal((await request('/healthz')).body.status,'ok');
  for(const path of ['/server/domain.mjs','/backend/server/domain.mjs','/frontend/app/interface.jsx','/shared/app-routes.mjs','/package.json','/.data/state.json','/assets/../server/domain.mjs'])assert.equal((await request(path)).status,404,path);
});
test('Hero video is served as MP4 with byte ranges and a body-free HEAD response',async()=>{
  const full=await fetch(base+'/assets/hero.mp4');
  assert.equal(full.status,200);assert.equal(full.headers.get('content-type'),'video/mp4');
  assert.equal(full.headers.get('accept-ranges'),'bytes');assert.equal(await full.text(),'0123456789abcdef');
  for(const [range,expected,contentRange] of [['bytes=0-3','0123','bytes 0-3/16'],['bytes=12-','cdef','bytes 12-15/16'],['bytes=-4','cdef','bytes 12-15/16'],['bytes=14-99','ef','bytes 14-15/16']]){
    const part=await fetch(base+'/assets/hero.mp4',{headers:{Range:range}});
    assert.equal(part.status,206,range);assert.equal(part.headers.get('content-range'),contentRange);
    assert.equal(Number(part.headers.get('content-length')),expected.length);assert.equal(await part.text(),expected);
  }
  const head=await fetch(base+'/assets/hero.mp4',{method:'HEAD',headers:{Range:'bytes=0-3'}});
  assert.equal(head.status,200);assert.equal(head.headers.get('content-length'),'16');assert.equal(await head.text(),'');
  for(const range of ['bytes=16-','bytes=9-2','bytes=-0']){
    const invalid=await fetch(base+'/assets/hero.mp4',{headers:{Range:range}});
    assert.equal(invalid.status,416);assert.equal(invalid.headers.get('content-range'),'bytes */16');
    assert.equal(await invalid.text(),'');
  }
});

test('Visitors receive independent opaque HttpOnly demo sessions',async()=>{
  const a=await bootstrap(),b=await bootstrap();assert.notEqual(a.cookie,b.cookie);
  assert.match(a.headers.get('set-cookie'),/HttpOnly/);assert.match(a.headers.get('set-cookie'),/SameSite=Lax/);
  const changed=await request('/api/demo',{cookie:a.cookie,action:'role',payload:{role:'warehouse'}});assert.equal(changed.status,200);assertNoMoney(changed.body);
  assert.ok(!changed.body.customers);assert.ok(!changed.body.carriers);assert.ok(!changed.body.audit);
  assert.equal((await request('/api/demo',{cookie:b.cookie})).body.role,'owner');
  const denied=await request('/api/demo',{cookie:a.cookie,action:'purchase',payload:{id:'SP01',qty:2},version:changed.body.version});assert.equal(denied.status,403);
  const fake=await request('/api/demo',{cookie:'synera_demo='+'a'.repeat(64),headers:{'oai-authenticated-user-id':'spoof','oai-authenticated-user-email':'spoof@example.invalid'}});assert.equal(fake.status,200);assert.notEqual(fake.headers.get('set-cookie').split(';')[0],'synera_demo='+'a'.repeat(64));
});
test('Writes require session, Origin, a valid body and the current version',async()=>{
  const a=await bootstrap();
  assert.equal((await request('/api/demo',{action:'role',payload:{role:'owner'}})).status,401);
  assert.equal((await request('/api/demo',{cookie:a.cookie,action:'role',payload:{role:'owner'},origin:'https://foreign.invalid'})).status,403);
  assert.equal((await request('/api/demo',{cookie:a.cookie,raw:'{broken'})).status,400);
  assert.equal((await request('/api/demo',{cookie:a.cookie,raw:JSON.stringify({action:'role',version:0,payload:null})})).status,400);
  const concurrent=await Promise.all([request('/api/demo',{cookie:a.cookie,action:'role',payload:{role:'owner'}}),request('/api/demo',{cookie:a.cookie,action:'role',payload:{role:'warehouse'}})]);
  assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
  assert.equal((await request('/api/demo',{cookie:a.cookie})).body.version,1);
});
test('Tracking is scoped to the demo session and contains only recipient data',async()=>{
  const a=await bootstrap();const token=a.body.orders.find(o=>o.id==='DH1025').trackingToken;
  const t=await request('/api/demo?tracking='+token,{cookie:a.cookie});assert.equal(t.status,200);assertNoMoney(t.body);assert.ok(t.body.phone.includes('••••'));assert.ok(!t.body.address);
  assert.equal((await request('/api/demo?tracking=invalid',{cookie:a.cookie})).status,404);
  assert.equal((await request('/api/demo?tracking='+token)).status,401);
});

test('Dedicated login route supports direct navigation and refresh without exposing arbitrary source paths',async()=>{
  for(const route of ['/login','/login/','/login?from=landing']) {
    const page=await request(route); assert.equal(page.status,200,route);
    assert.match(page.headers.get('content-type'),/text\/html/);
    assert.equal(page.headers.get('cache-control'),'no-store');
    assert.equal(page.body,(await request('/')).body);
  }
  const head=await fetch(base+'/login',{method:'HEAD'}); assert.equal(head.status,200); assert.equal(await head.text(),'');
  for(const route of ['/login/backend/server/render.mjs','/login.js','/unknown-page']) assert.equal((await request(route)).status,404,route);
  const signIn=await fetch(base+'/signin-with-chatgpt',{redirect:'manual'}); assert.equal(signIn.status,302); assert.equal(signIn.headers.get('location'),'/login');
});
