import type Phaser from 'phaser';

type Point={x:number;y:number};
export type WorldEffectState={player:Point;walking:boolean;near:boolean;ready:boolean;terminal:Point;goal:Point};
type Mote=Point&{vx:number;vy:number;age:number;life:number;color:number};
/** Decorative pixels only: never charge carriers, forces, collisions or saved state. */
export class WorldEffects {
  private back:Phaser.GameObjects.Graphics;
  private front:Phaser.GameObjects.Graphics;
  private motes:Mote[]=[];
  private time=0;
  private step=0;
  private ready:boolean|undefined;
  private reduced=false;
  private destroyed=false;
  constructor(scene:Phaser.Scene,private lamps:Point[]){
    this.back=scene.add.graphics().setDepth(3).setName('vfx-environment');
    this.front=scene.add.graphics().setDepth(21).setName('vfx-feedback');
    scene.events.once('shutdown',()=>this.destroy());
  }
  setReduced(value:boolean){this.reduced=value;if(value)this.clear()}
  clear(){this.motes=[];if(!this.destroyed){this.front.clear();this.back.clear()}}
  private burst(p:Point){
    if(this.reduced)return;
    for(let i=0;i<16;i++){
      const a=i*Math.PI*2/16;
      this.motes.push({...p,vx:Math.cos(a)*24,vy:Math.sin(a)*18-12,age:0,life:.55,color:i%2?0xffbc55:0x80e9ef});
    }
    this.motes=this.motes.slice(-40);
  }
  update(dt:number,s:WorldEffectState){
    this.time+=dt;this.back.clear();this.front.clear();
    if(this.ready!==undefined&&!this.ready&&s.ready)this.burst(s.goal);
    this.ready=s.ready;
    // Stepped bands preserve pixel edges. No fullscreen flash or camera shake.
    for(const p of this.lamps){
      const alpha=this.reduced?.045:.045+Math.sin(this.time*1.6+p.x)*.008;
      this.back.fillStyle(0xffbc55,alpha).fillRect(p.x-16,p.y,32,12).fillRect(p.x-24,p.y+12,48,16).fillRect(p.x-32,p.y+28,64,20);
    }
    if(!this.reduced){
      for(let i=0;i<8;i++){
        const x=Math.floor((i*79+this.time*(i%2?2:-2)+640)%640),y=Math.floor(78+(i*31)%170+Math.sin(this.time*.5+i)*4);
        this.back.fillStyle(0xb2d4df,.16).fillRect(x,y,1,1);
      }
      this.step-=dt;
      if(s.walking&&this.step<=0){this.step=.19;this.motes.push({x:s.player.x,y:s.player.y-2,vx:-7,vy:-8,age:0,life:.3,color:0x91a8ba})}
    }
    if(s.near){
      const {x,y}=s.terminal,o=this.reduced?0:Math.floor(Math.sin(this.time*3)*2);
      this.front.lineStyle(1,0x80e9ef,.85);
      for(const side of [-1,1]){const a=x+side*(20+o);this.front.lineBetween(a,y-42,a,y-34).lineBetween(a,y-42,a-side*5,y-42)}
    }
    if(s.ready){
      const {x,y}=s.goal;
      this.front.fillStyle(0xffbc55,this.reduced?.7:.6+Math.sin(this.time*2)*.15);
      for(const offset of [-10,0,10])this.front.fillRect(x+offset-2,y+5,4,2);
    }
    this.motes=this.motes.filter(p=>{
      p.age+=dt;if(p.age>=p.life)return false;p.x+=p.vx*dt;p.y+=p.vy*dt;
      this.front.fillStyle(p.color,(1-p.age/p.life)*.65).fillRect(Math.floor(p.x),Math.floor(p.y),2,1);return true;
    });
  }
  get diagnostics(){return {time:this.time,particles:this.motes.length,reduced:this.reduced,ready:this.ready??false}}
  private destroy(){if(this.destroyed)return;this.destroyed=true;this.motes=[];this.back.destroy();this.front.destroy()}
}
