import type Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {ARENA} from '../content/mission';
import {ensureAnimation,type Raka} from './Raka';
export class Ion {
  readonly sprite:Phaser.GameObjects.Sprite;
  private baseY=ARENA.floorY-106;
  constructor(scene:Phaser.Scene,manifest:AssetManifest,raka:Raka){const a=ensureAnimation(scene,manifest,'ion-idle');this.sprite=scene.add.sprite(raka.body.x+48,this.baseY,'ion-idle').setOrigin(a.anchor.x,a.anchor.y).setDepth(11).setName('ion').play('ion-idle')}
  update(raka:Raka,seconds:number,gameTime:number,reduced=false){
    // Stay on the left of the terminal, above and away from Raka's face.
    const x=Math.max(28,Math.min(raka.body.x>ARENA.terminal.x+100?608:ARENA.terminal.x-52,raka.body.x+48));
    const factor=1-Math.exp(-6*seconds);
    this.sprite.x+=(x-this.sprite.x)*factor;
    this.baseY+=(raka.body.y-106-this.baseY)*factor;
    this.sprite.y=this.baseY+(reduced?0:Math.sin(gameTime*2.5)*3);
  }
}
