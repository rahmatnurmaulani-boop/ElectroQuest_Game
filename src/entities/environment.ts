import type Phaser from 'phaser';
import type {AssetEntry} from '../content/manifest';
import {WORLD} from '../content/mission';
/** Static scenery only. Coordinates refer to manifest anchors, never stretched art. */
export function createEnvironment(scene:Phaser.Scene,assets:AssetEntry[]):void {
  const entries=new Map(assets.map(a=>[a.key,a]));
  const place=(key:string,x:number,y:number)=>{
    const asset=entries.get(key);
    if(!asset||!scene.textures.exists(key))return;
    scene.add.image(x,y,key).setOrigin(asset.anchor.x,asset.anchor.y);
  };
  place('sky',320,360);place('city',320,360);place('lab-facade',320,360);
  for(let x=0;x<WORLD.width;x+=WORLD.tile)place(x===0?'floor-left':x===608?'floor-right':'floor-middle',x+16,360);
  // Decorations are behind actors; clear the terminal approach and destination.
  place('lamp',48,328);place('sign',458,328);place('crate',500,328);place('plant',538,328);
}
