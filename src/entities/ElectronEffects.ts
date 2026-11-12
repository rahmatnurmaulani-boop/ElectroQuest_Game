import type Phaser from 'phaser';
export class ElectronEffects {
  private particles:{image:Phaser.GameObjects.Image;from:{x:number;y:number};to:{x:number;y:number};age:number}[]=[];
  private visible=true;
  private reduced=false;
  setReduced(value:boolean){this.reduced=value;this.clear()}
  constructor(private scene:Phaser.Scene){}
  emit(from:{x:number;y:number},to:{x:number;y:number}){if(this.particles.length>=(this.reduced?2:8))this.particles.shift()!.image.destroy();this.particles.push({image:this.scene.add.image(from.x,from.y,'electron').setDepth(25).setVisible(this.visible),from,to,age:0})}
  setVisible(value:boolean){this.visible=value;this.particles.forEach(p=>p.image.setVisible(value))}
  update(dt:number){this.particles=this.particles.filter(p=>{p.age+=dt;const t=Math.min(1,p.age/(this.reduced?.25:.6));p.image.setPosition(p.from.x+(p.to.x-p.from.x)*t,p.from.y+(p.to.y-p.from.y)*t-(this.reduced?0:Math.sin(t*Math.PI)*24));if(t>=1){p.image.destroy();return false}return true})}
  clear(){for(const p of this.particles)p.image.destroy();this.particles=[]}
  get count(){return this.particles.length}
}
