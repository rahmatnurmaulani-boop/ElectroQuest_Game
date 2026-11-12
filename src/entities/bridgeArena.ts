import Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {BRIDGE as B,bridgeObservation} from '../content/mission02';
import {ensureAnimation} from './Raka';
export function createBridgeArena(scene:Phaser.Scene,manifest:AssetManifest,live=false){
 const place=(key:string,x:number,y:number,depth=3)=>{const a=manifest.assets.find(a=>a.key===key)!;return scene.add.image(x,y,key).setOrigin(a.anchor.x,a.anchor.y).setDepth(depth).setName(key)};
 place('m2-sky',320,360,0);place('m2-city',320,360,1).setAlpha(.55);place('m2-rear',320,360,2).setAlpha(.3);
 const floor=scene.physics.add.staticGroup();
 for(const start of [0,448]){for(let i=0;i<6;i++)place('m2-floor-'+(i===0?'left':i===5?'right':'middle'),start+i*32+16,336,4);const zone=scene.add.zone(start+96,B.floorY+16,192,32);floor.add(zone);}
 place('m2-gap-right',184,360,3);place('m2-gap-left',456,360,3);for(const x of [160,480])place('m2-support',x,360,3);
 for(const x of [32,96,512,576])place('m2-fence',x,304,3);
 place('m2-lamp',36,304,4);place('m2-utility',86,304,4);place('m2-cable',72,260,3);place('m2-cable',568,292,3);
 const rail=(start:number,count:number,y:number)=>{for(let i=0;i<count;i++)place('m2-rail-'+(i===0?'left':i===count-1?'right':'middle'),start+i*32+16,y,5)};
 rail(192,8,340);rail(live?48:480,live?6:5,318);
 place('m2-terminal',B.terminalX,304,6);place('m2-exit',608,304,4);
 const goal=place('m2-goal',392,306,7),goalActive=place('m2-goal-active',392,306,8).setVisible(false);
 scene.add.text(392,342,'Zona tujuan',{fontFamily:'monospace',fontSize:'11px',color:'#ffbc55',backgroundColor:'#111e35'}).setOrigin(.5,0).setDepth(15);
 const start=scene.add.graphics().setDepth(6);start.lineStyle(1,0x9aafc3,.6).strokeRect(live?264:192,304,112,24);scene.add.text(live?320:248,342,'Awal',{fontFamily:'monospace',fontSize:'10px',color:'#b5c5d6',backgroundColor:'#111e35'}).setOrigin(.5,0).setDepth(15);
 const deck=place('m2-platform',B.platformStart,328,7),wheels=place('m2-wheels',B.platformStart,338,6),motor=live?place('m2-motor-broken',B.platformStart-12,304,8):null;
 const stand1=place('m2-isolator',B.platformStart+B.ballOffset,304,6),ball1=place('m2-ball-platform',B.platformStart+B.ballOffset,B.ballY,8);
 const carriage=place('m2-carriage',B.sourceStart,316,6),grip=place('m2-grip',B.sourceStart,310,8),stand2=place('m2-isolator',B.sourceStart,304,6),ball2=place('m2-ball-source',B.sourceStart,B.ballY,8);
 const latch=place('m2-lock-closed',B.platformStart-38,304,8),selected=place('m2-object-selected',B.sourceStart,B.ballY,14),scan=place('m2-scan',B.sourceStart,B.ballY,15).setVisible(false);
 const platform=scene.add.zone(B.platformStart,B.floorY+8,B.platformWidth,16);scene.physics.add.existing(platform);const collider=platform.body as Phaser.Physics.Arcade.Body;collider.setAllowGravity(false).setImmovable(true);
 const measure=scene.add.graphics().setDepth(16);const text=(size=12)=>scene.add.text(0,0,'',{fontFamily:'monospace',fontSize:size+'px',color:'#edf5fa',backgroundColor:'#111e35',padding:{x:2,y:2}}).setOrigin(.5).setDepth(17);
 const q1Label=text(),q2Label=text(),rLabel=text(11),force1=text(10),force2=text(10);const signs=[text(16),text(16)];
 ensureAnimation(scene,manifest,'m2-latch-flash');const flash=scene.add.sprite(0,0,'m2-latch-flash').setVisible(false).setDepth(18);flash.on('animationcomplete',()=>flash.setVisible(false));
 let docked=false;
 function render(x:number,sourceX:number,q1:number,q2:number,locked:boolean,selection:'platform'|'source'){
  deck.x=x;wheels.x=x;platform.x=x;collider.updateFromGameObject();stand1.x=ball1.x=x+B.ballOffset;carriage.x=grip.x=stand2.x=ball2.x=sourceX;latch.x=x-38;latch.setTexture(locked?'m2-lock-closed':'m2-lock-open');selected.setPosition(selection==='platform'?ball1.x:ball2.x,B.ballY);
  if(motor)motor.x=x-12;
  const atGoal=Math.abs(x-B.platformGoal)<1;goalActive.setVisible(atGoal);goal.setVisible(!atGoal);if(atGoal&&locked&&!docked){flash.setPosition(latch.x,284).setVisible(true).play('m2-latch-flash')}docked=atGoal&&locked;
  const obs=bridgeObservation(q1,q2,ball1.x,ball2.x);measure.clear();measure.lineStyle(1,0x9aafc3,.8).lineBetween(ball1.x,244,ball1.x,201).lineBetween(ball2.x,244,ball2.x,201);measure.lineStyle(2,0x39ddeb).lineBetween(ball1.x,204,ball2.x,204).lineBetween(ball1.x,200,ball1.x,208).lineBetween(ball2.x,200,ball2.x,208);rLabel.setPosition((ball1.x+ball2.x)/2,191).setText(`r = ${obs.distance.toFixed(0)} px`);
  for(const[i,q,ball]of [[0,q1,ball1],[1,q2,ball2]] as const){signs[i].setPosition(ball.x,244).setText(q>0?'+':q<0?'−':'0').setColor(q>0?'#ffbc55':q<0?'#39ddeb':'#edf5fa');(i?q2Label:q1Label).setPosition(ball.x,278).setText(`q${i+1}=${q>0?'+':''}${q}`).setColor(q>0?'#ffbc55':q<0?'#39ddeb':'#edf5fa')}
  for(const[ball,dir,label]of [[ball1,obs.direction,force1],[ball2,obs.sourceDirection,force2]] as const){label.setPosition(ball.x,151).setText(dir?'F (arah)':'F = 0');if(dir){const end=ball.x+dir*30;measure.lineStyle(2,0xffbc55).beginPath().moveTo(ball.x,168).lineTo(end,168).lineTo(end-dir*6,163).moveTo(end,168).lineTo(end-dir*6,173).strokePath()}}
  return obs;
 }
 const clearEffects=()=>{if(flash.active){flash.stop();flash.setVisible(false)}if(scan.active)scan.setVisible(false)};
 return {floor,platform,collider,render,scan,selected,ball1,ball2,deck,clearEffects};
}
