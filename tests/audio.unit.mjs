import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
const js=ts.transpileModule(fs.readFileSync('src/audio/score.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {SCORES,renderScore}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('four original music loops are finite, audible, have headroom and silent seams',()=>{
 const fingerprints=[];
 for(const theme of Object.keys(SCORES)){const {samples,duration,sampleRate}=renderScore(theme);let peak=0,energy=0;for(const value of samples){assert(Number.isFinite(value));peak=Math.max(peak,Math.abs(value));energy+=value*value}assert(peak>.05&&peak<.8);assert(Math.sqrt(energy/samples.length)>.01);assert(duration>18&&duration<24);assert.equal(sampleRate,22050);assert.equal(samples[0],0);assert(Math.abs(samples.at(-1))<1e-5);fingerprints.push(samples.slice(1000,1100).join(','))}assert.equal(new Set(fingerprints).size,4);
});
