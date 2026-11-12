import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const cache=new Map();
export async function loadTS(file){
  function source(filename){filename=path.resolve(filename);if(cache.has(filename))return cache.get(filename);let js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;js=js.replace(/from\s+(['"])(\.[^'"]+)\1/g,(_,quote,relative)=>{let target=path.resolve(path.dirname(filename),relative);if(!path.extname(target))target+='.ts';return `from ${quote}${source(target)}${quote}`});const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');cache.set(filename,url);return url}
  return import(source(file));
}
