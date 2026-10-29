import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
export function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?( ['node_modules','dist','.git','.wrangler'].includes(e.name)?[]:walk(path.join(dir,e.name)) ):[path.join(dir,e.name)]); }
const badNames=/(?:^|\/)(?:\.env(?:\..*)?|\.npmrc|master\.key|credentials[^/]*|id_rsa|id_ed25519|[^/]+\.(?:pem|key|p12|pfx|sql|dump|sqlite3?|db))$/i;
const signatures=[new RegExp('-----BEGIN '+'(?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),new RegExp('gh'+'[pousr]_[A-Za-z0-9]{30,}'),new RegExp('AK'+'IA[A-Z0-9]{16}'),new RegExp('sk'+'-(?:proj-)?[A-Za-z0-9_-]{32,}'),/(?:postgres(?:ql)?:\/\/)[^\s"'<>]+/i,/(?:password|secret_key_base|api_key|api_token)\s*[:=]\s*["'][^"']{8,}["']/i];
const failures=[];
for(const file of walk(root)) {
  const rel=path.relative(root,file).replaceAll('\\','/');
  if(badNames.test(rel)) failures.push(`${rel}: prohibited sensitive filename`);
  if(/\.(?:jsx?|mjs|json|md|html|css|scss|txt|yml|yaml|cmd)$/.test(rel)) {
    const text=fs.readFileSync(file,'utf8');
    if(signatures.some(rx=>rx.test(text))) failures.push(`${rel}: possible credential signature`);
  }
}
if(failures.length) { console.error(failures.join('\n'));process.exit(1); }
console.log('Sensitive-file and common credential signature scan passed (project source only).');
