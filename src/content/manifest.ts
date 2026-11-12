import {WORLD} from './mission';
export interface AssetEntry {key:string;path:string|null;width:number;height:number;frameWidth:number;frameHeight:number;frames:number;fps:number;loop:boolean;anchor:{x:number;y:number};status:'generated'|'procedural'|'placeholder'|'missing';source:string|null;provenance:string}
export interface AssetManifest {schemaVersion:1;baseCoordinates:{width:number;height:number;tile:number};assets:AssetEntry[]}
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null;
const positive=(v:unknown):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>0;
export function parseManifest(value:unknown):AssetManifest {
  if(!record(value)||value.schemaVersion!==1||!Array.isArray(value.assets)||!value.assets.length||!record(value.baseCoordinates))throw Error('Format manifest aset tidak didukung.');
  const world=value.baseCoordinates;
  if(world.width!==WORLD.width||world.height!==WORLD.height||world.tile!==WORLD.tile)throw Error('Koordinat manifest harus 640 × 360 dengan tile 32 px.');
  const keys=new Set<string>();
  for(const entry of value.assets){
    if(!record(entry)||typeof entry.key!=='string'||!entry.key||keys.has(entry.key)||entry.key.startsWith('__'))throw Error('Key manifest kosong, duplikat, atau memakai nama khusus.');
    keys.add(entry.key);
    if(!positive(entry.width)||!positive(entry.height)||!positive(entry.frameWidth)||!positive(entry.frameHeight)||!positive(entry.frames)||entry.width!==entry.frameWidth*entry.frames||entry.height!==entry.frameHeight)throw Error(`Dimensi sheet ${entry.key} tidak sesuai.`);
    if(!['generated','procedural','placeholder','missing'].includes(String(entry.status))||typeof entry.fps!=='number'||!Number.isFinite(entry.fps)||entry.fps<0||typeof entry.loop!=='boolean'||!record(entry.anchor)||typeof entry.anchor.x!=='number'||typeof entry.anchor.y!=='number'||!Number.isFinite(entry.anchor.x)||!Number.isFinite(entry.anchor.y)||entry.anchor.x<0||entry.anchor.x>1||entry.anchor.y<0||entry.anchor.y>1)throw Error(`Metadata ${entry.key} tidak valid.`);
    if(entry.path!==null&&(typeof entry.path!=='string'||!/^assets\/[a-zA-Z0-9_/-]+\.png$/.test(entry.path)||entry.path.includes('..')))throw Error(`Path ${entry.key} tidak valid.`);
  }
  return value as unknown as AssetManifest;
}
export function assetURL(path:string):string{return `${import.meta.env.BASE_URL}${path}`}
export async function fetchManifest():Promise<AssetManifest>{
  const response=await fetch(assetURL('asset-manifest.json'),{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error(`Manifest tidak dapat dimuat (HTTP ${response.status}).`);
  return parseManifest(await response.json());
}
