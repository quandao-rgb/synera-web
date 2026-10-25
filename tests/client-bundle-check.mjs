import { readFileSync,readdirSync } from 'node:fs';
import { join } from 'node:path';
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const hits=walk('dist/client').filter(f=>f.endsWith('.js')&&/0901234567|demo-an-nhien-1028|2592000/.test(readFileSync(f,'utf8')));
if(hits.length)throw Error('Private demo records found in client bundle');
console.log('Client bundle: no private sample records found.');
