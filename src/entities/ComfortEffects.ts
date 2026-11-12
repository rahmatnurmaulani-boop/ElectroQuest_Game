import type Phaser from 'phaser';
import {ARENA} from '../content/mission';
/** One reusable scanner and six pooled decorative sparks; no charge semantics. */
export class ComfortEffects {
  private scanAge=1;
  private successAge=1;
  private reduced=false;
  private scan:Phaser.GameObjects.Graphics;
  private sparks:Phaser.GameObjects.Image[];
  constructor(scene:Phaser.Scene){this.scan=scene.add.graphics().setDepth(8);this.sparks=Array.from({length:6},(_,i)=>scene.add.image(240+i*32,165,'spark',0).setDepth(22).setVisible(false))}
  setReduced(value:boolean){this.reduced=value;if(value)this.clear()}
  scanning(){if(!this.reduced)this.scanAge=0}
  success(){if(!this.reduced)this.successAge=0}
  update(dt:number){this.scanAge+=dt;this.successAge+=dt;this.scan.clear();if(this.scanAge<.5){this.scan.lineStyle(1,0x39ddeb).lineBetween(ARENA.terminal.x-18,264+this.scanAge*120,ARENA.terminal.x+18,264+this.scanAge*120)}this.sparks.forEach((s,i)=>{const live=this.successAge<.3;s.setVisible(live);if(live)s.setFrame(Math.min(4,Math.floor(this.successAge*16))).setY(165-Math.sin(i+this.successAge*4)*8)})}
  clear(){this.scanAge=1;this.successAge=1;this.scan.clear();this.sparks.forEach(s=>s.setVisible(false))}
}
