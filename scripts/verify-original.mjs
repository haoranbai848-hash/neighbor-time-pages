import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/original-file-hashes.json'),'utf8'));
const changed=Object.entries(baseline).filter(([file,hash])=>{const f=path.resolve(root,'..',file);return !fs.existsSync(f)||createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==hash;});
if(changed.length) {console.error('Original files changed:',changed.map(([file])=>file));process.exit(1);}
console.log(`Verified ${Object.keys(baseline).length} original Rails files unchanged from pre-migration fingerprints.`);
