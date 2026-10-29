import fs from 'node:fs';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { walk } from './check-security.mjs';
const root=path.resolve(import.meta.dirname,'..');
// ZIP with UTF-8 filenames. The source is served with each build to retain AGPL access.
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=bytes=>{let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;};
const entries=walk(root).filter(file=>{
  const rel=path.relative(root,file).replaceAll('\\','/');
  return /^(src|public|scripts|tests)\//.test(rel)||['package.json','package-lock.json','vite.config.js','index.html','.gitignore','.node-version','LICENSE','NOTICE.md','README.md','DEPLOY.md','preview.cmd','preview-production.cmd'].includes(rel)||/^docs\/[^/]+\.md$/.test(rel);
});
const local=[],central=[]; let offset=0;
for(const file of entries.sort()) {
  const name=Buffer.from(path.relative(root,file).replaceAll('\\','/'));
  const source=fs.readFileSync(file),data=deflateRawSync(source),crc=crc32(source);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(0x21,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(source.length,22);h.writeUInt16LE(name.length,26);
  local.push(h,name,data);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(0x21,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(source.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+data.length;
}
const centralBytes=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(centralBytes.length,12);end.writeUInt32LE(offset,16);
fs.writeFileSync(path.join(root,'dist/source-code.zip'),Buffer.concat([...local,centralBytes,end]));
const licenses=['react','react-dom','bootstrap'].map(name=>`${name}\n${fs.readFileSync(path.join(root,'node_modules',name,'LICENSE'),'utf8')}`).join('\n\n----------------\n\n');
fs.writeFileSync(path.join(root,'dist/THIRD_PARTY_NOTICES.txt'),licenses);
console.log(`Packaged ${entries.length} source files and dependency license notices.`);
