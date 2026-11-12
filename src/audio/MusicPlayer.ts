import {renderScore,type MusicTheme} from './score';
import {readSettings} from '../ui/settings';
/** One looping source, cached PCM scores; context is owned by AudioBus. */
export class MusicPlayer {
 theme:MusicTheme|null=null;paused=false;background=false;
 private source:AudioBufferSourceNode|null=null;private gain:GainNode|null=null;
 private buffers=new Map<MusicTheme,AudioBuffer>();private offset=0;private started=0;
 constructor(private context:()=>AudioContext|null){}
 setTheme(theme:MusicTheme|null){if(theme!==this.theme){this.halt();this.offset=0;this.theme=theme;this.paused=false}this.sync()}
 halt(){if(this.source){this.offset=(this.offset+this.context()!.currentTime-this.started)%this.source.buffer!.duration;try{this.source.stop()}catch{}this.source.disconnect();this.source=null}this.gain?.disconnect();this.gain=null}
 sync(){const ctx=this.context(),s=readSettings();if(!ctx||ctx.state!=='running'||!this.theme||this.paused||this.background||document.hidden||s.mute||!s.master||!s.music){this.halt();return}
  if(this.gain){this.gain.gain.setTargetAtTime(s.master*s.music*.35,ctx.currentTime,.08);return}
  try{let buffer=this.buffers.get(this.theme);if(!buffer){const score=renderScore(this.theme);buffer=ctx.createBuffer(1,score.samples.length,score.sampleRate);buffer.copyToChannel(score.samples,0);this.buffers.set(this.theme,buffer)}const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(s.master*s.music*.35,ctx.currentTime+.2);this.source=source;this.gain=gain;this.started=ctx.currentTime;source.start(0,this.offset%buffer.duration)}catch{this.halt()}
 }
 destroy(){this.halt();this.buffers.clear();this.theme=null;this.offset=0}
 get diagnostics(){return {theme:this.theme,playing:!!this.source,paused:this.paused,offset:this.offset,gain:this.gain?.gain.value??0}}
}
