import Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {ARENA} from '../content/mission';
import {moveBody,type GroundBody} from '../physics';
export function ensureAnimation(scene:Phaser.Scene,manifest:AssetManifest,key:string){
  const asset=manifest.assets.find(a=>a.key===key)!;
  if(!scene.anims.exists(key))scene.anims.create({key,frames:scene.anims.generateFrameNumbers(key,{start:0,end:asset.frames-1}),frameRate:asset.fps,repeat:asset.loop?-1:0});
  return asset;
}
export class Raka {
  readonly sprite:Phaser.GameObjects.Sprite;
  readonly body:GroundBody={...ARENA.spawn,vy:0,grounded:true};
  private anchors=new Map<string,{x:number;y:number}>();
  private usingTool=false;
  constructor(scene:Phaser.Scene,manifest:AssetManifest){
    for(const key of ['raka-idle','raka-walk','raka-tool'])this.anchors.set(key,ensureAnimation(scene,manifest,key).anchor);
    this.sprite=scene.add.sprite(this.body.x,this.body.y,'raka-idle').setName('raka').setDepth(10);this.animate('raka-idle');
    this.sprite.on('animationcomplete',(animation:Phaser.Animations.Animation)=>{if(animation.key==='raka-tool'){this.usingTool=false;this.animate('raka-idle')}});
  }
  update(axis:number,seconds:number,gateOpen=false,doorOpen=true){const moving=moveBody(this.body,axis,seconds,gateOpen,doorOpen);if(axis)this.sprite.setFlipX(axis<0);if(moving||!this.usingTool)this.animate(moving?'raka-walk':'raka-idle');this.sprite.setPosition(this.body.x,this.body.y)}
  useTool(){this.usingTool=true;this.sprite.anims.resume();this.sprite.play('raka-tool',false)}
  stop(){this.usingTool=false;this.animate('raka-idle')}
  private animate(key:string){const anchor=this.anchors.get(key)!;this.sprite.setOrigin(anchor.x,anchor.y);this.sprite.play(key,true)}
}
