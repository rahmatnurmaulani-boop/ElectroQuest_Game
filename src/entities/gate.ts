import type Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {ARENA} from '../content/mission';
import {describeCharge,panelForce,type Experiment} from '../physics/charges';
export function createGate(scene:Phaser.Scene,manifest:AssetManifest){
  const place=(key:string,x:number,y:number,depth=3)=>{const a=manifest.assets.find(a=>a.key===key)!;return scene.add.image(x,y,key).setOrigin(a.anchor.x,a.anchor.y).setDepth(depth).setName(key)};
  const door=place('destination-door',ARENA.door.x,ARENA.door.y,1);
  place('gate-frame',320,328);place('rail',320,112,4).setDisplaySize(288,16);place('rail',320,328,4).setDisplaySize(288,16);
  const left=place('panel-left',288,312),right=place('panel-right',352,312),latch=place('latch-closed',320,178,5);
  const catches=[place('latch-closed',224,178,5).setVisible(false),place('latch-closed',416,178,5).setVisible(false)];
  const terminal=place('terminal',ARENA.terminal.x,ARENA.terminal.y,4);
  const labels=[288,352].map(x=>scene.add.text(x,227,'',{fontFamily:'monospace',fontSize:'22px',fontStyle:'bold'}).setOrigin(.5).setDepth(5));
  const arrows=scene.add.graphics().setDepth(7);
  const highlight=scene.add.graphics().setDepth(6).setVisible(false);highlight.lineStyle(2,0x39ddeb).strokeRect(ARENA.terminal.x-23,ARENA.terminal.y-67,46,69);
  // The accessible HTML interaction hint shares the arena's coordinates.
  return {terminal,setExitOpen:(open:boolean)=>door.setTint(open?0xffffff:0x77859a),setNearby:(near:boolean)=>{highlight.setVisible(near)},render:(state:Experiment,observation=true)=>{
    left.x=state.left;right.x=state.right;
    labels.forEach((label,i)=>{const q=describeCharge(i===0?state.charges.left:state.charges.right);label.setVisible(observation).setText(q.text).setColor(q.color).setX(i===0?state.left:state.right)});
    latch.setVisible(state.phase!=='OPENED').setTexture(state.locked?'latch-closed':'latch-open');catches.forEach(c=>c.setVisible(state.phase==='OPENED'));
    arrows.clear();
    if(state.phase==='SIMULATING'&&observation){
      const force=panelForce(state.charges.left,state.charges.right,state.right-state.left);
      for(const [x,f]of [[state.left,force.left],[state.right,force.right]]){if(!f)continue;const end=x+Math.sign(f)*Math.min(42,12+Math.abs(f)*.1);arrows.lineStyle(2,0xffbc55).beginPath().moveTo(x,148).lineTo(end,148).lineTo(end-Math.sign(f)*6,142).moveTo(end,148).lineTo(end-Math.sign(f)*6,154).strokePath()}
    }
  }};
}
