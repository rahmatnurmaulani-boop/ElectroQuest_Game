import {ARENA,WORLD} from '../content/mission';
export interface GroundBody {x:number;y:number;vy:number;grounded:boolean}
/** Swept horizontal collision avoids tunnelling even when a frame is long. */
export function moveBody(body:GroundBody,axis:number,seconds:number,gateOpen=false,doorOpen=true):boolean {
  const dt=Math.max(0,seconds),old=body.x;
  let next=Math.max(32,Math.min(WORLD.width-32,old+axis*ARENA.speed*dt));
  const half=ARENA.bodyHalfWidth;
  if(!doorOpen)next=Math.min(next,ARENA.door.x-half);
  if(!gateOpen&&body.y>ARENA.gate.top&&body.y-64<ARENA.gate.bottom){
    if(old+half<=ARENA.gate.left&&next+half>ARENA.gate.left)next=ARENA.gate.left-half;
    if(old-half>=ARENA.gate.right&&next-half<ARENA.gate.right)next=ARENA.gate.right+half;
  }
  body.x=next;body.vy+=ARENA.gravity*dt;body.y+=body.vy*dt;
  body.grounded=body.y>=ARENA.floorY;
  if(body.grounded){body.y=ARENA.floorY;body.vy=0}
  return Math.abs(body.x-old)>.001;
}
