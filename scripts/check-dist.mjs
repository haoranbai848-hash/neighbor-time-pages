import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dist=path.resolve(import.meta.dirname,'../dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert(html.includes('lang="zh-CN"'));
for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)) assert(fs.existsSync(path.join(dist,match[1])),`Missing asset ${match[1]}`);
for(const file of ['_redirects','_headers','LICENSE.txt','source-code.zip','THIRD_PARTY_NOTICES.txt','images/neighborhood-community-people.png']) assert(fs.existsSync(path.join(dist,file)),`Missing ${file}`);
assert.equal(fs.readFileSync(path.join(dist,'_redirects'),'utf8').trim(),'/* /index.html 200');
assert(!fs.existsSync(path.join(dist,'404.html')),'Keep the Pages SPA fallback');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(dist);
for(const f of files) {assert(fs.statSync(f).size<25*1024*1024,`Pages asset limit: ${f}`);assert(!/\.(map|key|pem|sql|dump)$/.test(f),`Unexpected sensitive/build file ${f}`);}
const css=files.filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync(f,'utf8')).join('\n');
for(const m of css.matchAll(/url\((?:["']?)([^)"']+)/g)) if(!m[1].startsWith('data:')) assert(fs.existsSync(path.resolve(dist,'assets',m[1])),`Missing CSS resource ${m[1]}`);
console.log(`Production package check passed: ${files.length} files, SPA refresh fallback, local assets, license and source download; all files <25 MiB.`);
