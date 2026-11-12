import {MusicPlayer} from './MusicPlayer';
import type {MusicTheme} from './score';
import {readSettings} from '../ui/settings';
type Cue='click'|'step'|'scan'|'transfer'|'gate'|'latch'|'collect'|'complete'|'reset'|'blocked';
const tones:Record<Cue,number[]>={click:[520],step:[100],scan:[300,600,900],transfer:[780,1100],gate:[90,105],latch:[180,360],collect:[880,1175,1568],complete:[523,659,784,1047],reset:[660,440,330],blocked:[160,130]};
export class AudioBus {
  private context:AudioContext|null=null;
  private active=new Set<OscillatorNode>();
  private last=new Map<Cue,number>();
  private activated=false;
  private gesture=false;
  private listeners:AbortController|null=null;
  private music=new MusicPlayer(()=>this.context);
  setMusic(theme:MusicTheme|null){this.music.setTheme(theme)}
  pauseMusic(paused:boolean){this.music.paused=paused;this.music.sync()}
  status='Suara menunggu interaksi pengguna.';
  install(){if(this.listeners)return;this.listeners=new AbortController();const options={signal:this.listeners.signal};const activate=()=>{this.gesture=true;void this.unlock()};document.addEventListener('pointerdown',activate,{...options,capture:true});document.addEventListener('keydown',activate,{...options,capture:true});document.addEventListener('click',e=>{if((e.target as Element)?.closest('button,summary'))this.play('click')},options);window.addEventListener('electroquest-settings',()=>{this.stop();this.music.sync()},options);window.addEventListener('blur',()=>{this.stop();this.music.background=true;this.music.sync()},options);window.addEventListener('focus',()=>{this.music.background=false;this.music.sync()},options);document.addEventListener('visibilitychange',()=>{this.stop();this.music.background=document.hidden;this.music.sync()},options)}
  async unlock(){if(!this.gesture)return false;try{if(!this.context)this.context=new AudioContext();if(this.context.state==='suspended')await this.context.resume();this.activated=this.context.state==='running';this.status=this.activated?'Musik dan efek suara siap.':'Audio ditangguhkan browser; coba interaksi lagi.';this.music.sync();return this.activated}catch{this.status='Audio tidak tersedia; permainan tetap dapat dimainkan.';return false}}
  play(cue:Cue){const s=readSettings(),ctx=this.context;if(!this.activated||!ctx||ctx.state!=='running'||this.music.background||document.hidden||s.mute||!s.master||!s.effects)return;const now=ctx.currentTime,min=cue==='step'?.25:cue==='gate'?.35:cue==='collect'?.14:.06;if(now-(this.last.get(cue)??-Infinity)<min||this.active.size>=16)return;this.last.set(cue,now);try{tones[cue].forEach((frequency,i)=>{if(this.active.size>=16)return;const osc=ctx.createOscillator(),gain=ctx.createGain(),start=now+i*.065,duration=cue==='gate'?.13:cue==='step'?.055:cue==='collect'?.08:.1;osc.type=cue==='gate'||cue==='step'?'triangle':'sine';osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,s.master*s.effects*.12),start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain);gain.connect(ctx.destination);this.active.add(osc);osc.onended=()=>{this.active.delete(osc);osc.disconnect();gain.disconnect()};osc.start(start);osc.stop(start+duration+.01)})}catch{this.status='Efek suara gagal diputar; gunakan informasi visual.';this.stop()}}
  stop(){for(const osc of this.active){try{osc.stop()}catch{/* already ended */}}this.active.clear();this.last.clear()}
  destroy(){this.listeners?.abort();this.listeners=null;this.stop();this.music.destroy();void this.context?.close().catch(()=>{});this.context=null;this.activated=false}
  get diagnostics(){return {activated:this.activated,state:this.context?.state??'not-created',active:this.active.size,status:this.status,music:this.music.diagnostics}}
}
export const audio=new AudioBus();
