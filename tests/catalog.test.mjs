import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {once} from 'node:events';
import {createDemo,act,project,stock,DomainError} from '../backend/server/domain.mjs';
import {createRenderServer} from '../backend/server/render.mjs';

const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jT1kAAAAASUVORK5CYII=';
const product=()=>({name:'Trà mới',sku:'NEW-001',category:'Đồ uống',physical:30,price:120000,weight:4.5,length:30,width:25,height:20,liquid:true,image});
const customer=()=>({name:'Cửa hàng mới',contact:'Nguyễn An',phone:'+84987654321',address:'20 đường Hoa Mai',zone:'Vùng nội thành',note:'Gọi trước khi giao'});
test('New catalog entries preserve all existing records and use new, server-generated identifiers',()=>{
 const original=createDemo();const before=structuredClone(original);
 const withProduct=act(original,'product-create',{...product(),id:'SP01',reserved:99,incoming:100,quarantine:10});
 assert.deepEqual(original,before);
 assert.deepEqual(withProduct.products.slice(0,-1),original.products);
 assert.deepEqual(withProduct.orders,original.orders);
 const p=withProduct.products.at(-1);assert.equal(p.id,'SP07');assert.equal(p.image,image);
 assert.equal(p.quarantine,0);assert.equal(p.incoming,0);assert.equal(p.demand,0);assert.equal(p.safety,0);
 assert.deepEqual(stock(withProduct,p),{reserved:0,available:30,suggested:0});
 const next=act(withProduct,'customer-create',{...customer(),id:'KH01',debt:99,purchases:10,cycle:7});
 const c=next.customers.at(-1);assert.equal(c.id,'KH07');assert.equal(c.phone,'0987654321');
 assert.equal(c.debt,0);assert.equal(c.purchases,0);assert.equal(c.cycle,null);assert.equal(c.lastDays,null);
 assert.equal(next.audit.length,original.audit.length+2);
 assert.deepEqual(next.orders,original.orders);
});
test('Product creation validates every numeric boundary, required identity and duplicate SKU without mutation',()=>{
 const initial=createDemo();
 const cases=[{name:''},{sku:'td-350'},{sku:'bad sku'},{physical:-1},{physical:.5},{price:0},{price:1.5},{weight:0},{length:0},{width:Infinity},{height:301},{liquid:'true'},{category:''}];
 for(const patch of cases){const before=structuredClone(initial);assert.throws(()=>act(initial,'product-create',{...product(),...patch}),DomainError,JSON.stringify(patch));assert.deepEqual(initial,before);}
 assert.throws(()=>act(initial,'product-create',null),DomainError);
 assert.throws(()=>act(initial,'product-create',{...product(),physical:'30'}),DomainError);
});
test('Product images accept supported inline raster formats, rejecting remote URLs, SVG, mismatched bytes and oversized data',()=>{
 for(const value of ['https://example.com/image.jpg','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,SGVsbG8=','data:image/png;base64,'+'A'.repeat(71000)]){
  assert.throws(()=>act(createDemo(),'product-create',{...product(),image:value}),DomainError);
 }
 const next=act(createDemo(),'product-create',{...product(),image:''});assert.equal(next.products.at(-1).image,undefined);
});
test('Customer creation requires real identity, normalized phone and supported destination; rejects duplicates',()=>{
 for(const patch of [{name:''},{contact:''},{phone:'0901234567'},{phone:'abc0901234567'},{address:'a'},{zone:'Unknown'},{note:'x'.repeat(301)}]){
  assert.throws(()=>act(createDemo(),'customer-create',{...customer(),...patch}),DomainError);
 }
 const s=act(createDemo(),'customer-create',{...customer(),phone:'098 765 4321'});
 assert.equal(s.customers.at(-1).phone,'0987654321');
 assert.equal(act(createDemo(),'customer-create',{...customer(),note:'Lầu 1\nGọi trước'}).customers.at(-1).note,'Lầu 1\nGọi trước');
 assert.throws(()=>act(s,'customer-create',customer()),e=>e instanceof DomainError&&e.status===409);
});
test('Warehouse cannot create catalog entries or receive financial fields of a new product',()=>{
 let s=act(createDemo(),'product-create',product());s=act(s,'role',{role:'warehouse'});
 for(const action of ['product-create','customer-create'])assert.throws(()=>act(s,action,action==='product-create'?product():customer()),e=>e.status===403);
 const projected=project(s);assert.equal(projected.customers,undefined);
 const p=projected.products.at(-1);assert.equal(p.image,image);for(const field of ['price','demand','safety'])assert.equal(p[field],undefined);
});
test('Created customer and product participate in the existing order and reservation flow',()=>{
 let s=act(createDemo(),'product-create',product());s=act(s,'customer-create',customer());
 const p=s.products.at(-1),c=s.customers.at(-1);
 s=act(s,'order',{customerId:c.id,lines:[{productId:p.id,qty:2}]});
 assert.equal(s.orders[0].status,'packing');assert.equal(s.orders[0].total,240000);
 assert.equal(stock(s,s.products.at(-1)).available,28);
 const quoted=act(s,'quote',{orderId:s.orders[0].id});assert.ok(quoted.quotes.length);
});
test('Catalog API retains version conflicts, account isolation, warehouse authorization and persistence after restart',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'synera-catalog-test-'));let server,base;
 const start=async()=>{server=await createRenderServer({dataDir:folder,secureCookies:false});server.listen(0,'127.0.0.1');await once(server,'listening');base='http://127.0.0.1:'+server.address().port;};
 const stop=async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));};
 const request=async(path,{cookie,body}={})=>{const response=await fetch(base+path,{method:body?'POST':'GET',headers:{...(cookie?{Cookie:cookie}:{}),...(body?{Origin:base,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});return{status:response.status,headers:response.headers,data:await response.json()};};
 try{
  await start();
  const register=async email=>{const r=await request('/api/auth/register',{body:{name:'Catalog QA',email,password:'CatalogRegression-2026!',confirmPassword:'CatalogRegression-2026!'}});assert.equal(r.status,201);return r.headers.get('set-cookie').split(';')[0];};
  const cookie=await register('catalog-one@example.test');const other=await register('catalog-two@example.test');
  let r=await request('/api/demo',{cookie,body:{action:'customer-create',version:0,payload:customer()}});assert.equal(r.status,200);assert.equal(r.data.version,1);
  r=await request('/api/demo',{cookie,body:{action:'product-create',version:0,payload:product()}});assert.equal(r.status,409);
  r=await request('/api/demo',{cookie,body:{action:'product-create',version:1,payload:product()}});assert.equal(r.status,200);assert.equal(r.data.products.at(-1).image,image);
  assert.equal((await request('/api/demo',{cookie:other})).data.products.length,6);
  await stop();await start();
  r=await request('/api/demo',{cookie});assert.equal(r.status,200);assert.equal(r.data.products.length,7);assert.equal(r.data.customers.length,7);assert.equal(r.data.version,2);
  r=await request('/api/demo',{cookie,body:{action:'role',version:2,payload:{role:'warehouse'}}});assert.equal(r.status,200);assert.equal(r.data.customers,undefined);assert.equal(r.data.products.at(-1).price,undefined);
  r=await request('/api/demo',{cookie,body:{action:'product-create',version:3,payload:product()}});assert.equal(r.status,403);
 }finally{
  if(server?.listening)await stop();
  const target=resolve(folder);assert.ok(target.startsWith(resolve(tmpdir())+sep+'synera-catalog-test-'));
  await rm(target,{recursive:true,force:true});
 }
});
