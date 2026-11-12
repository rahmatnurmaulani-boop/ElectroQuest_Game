export type MusicTheme='landing'|'mission1'|'mission2'|'mission3';
/** Original eight-bar scores; no external recording, sample or borrowed melody. */
export const SCORES:Record<MusicTheme,{bpm:number;roots:number[];motif:number[];pulse:number[]}>= {
 landing:{bpm:88,roots:[48,53,57,55,48,53,50,55],motif:[0,7,12,14,12,7,4,7],pulse:[2]},
 mission1:{bpm:92,roots:[45,53,48,55,45,53,50,52],motif:[0,7,10,7,12,10,7,3],pulse:[1,3]},
 mission2:{bpm:100,roots:[50,46,53,48,50,46,43,45],motif:[0,7,12,7,15,12,10,7],pulse:[0,2]},
 mission3:{bpm:84,roots:[52,48,55,50,52,48,45,47],motif:[12,7,0,7,14,10,7,3],pulse:[3]}
};
export function renderScore(theme:MusicTheme,sampleRate=22050){
 const score=SCORES[theme],beat=60/score.bpm,samples=new Float32Array(Math.ceil(32*beat*sampleRate));
 const note=(midi:number,start:number,length:number,amp:number,kind:'bell'|'bass'|'pad'|'tick')=>{
  const frequency=440*2**((midi-69)/12),count=Math.floor(length*sampleRate),offset=Math.floor(start*sampleRate);
  for(let i=0;i<count&&offset+i<samples.length;i++){
   const t=i/sampleRate,env=Math.min(1,t/.025)*Math.min(1,(length-t)/.08),phase=2*Math.PI*frequency*t;
   const wave=kind==='bell'?(Math.sin(phase)+.18*Math.sin(phase*2))*Math.exp(-t*5):kind==='bass'?2/Math.PI*Math.asin(Math.sin(phase)):kind==='tick'?Math.sin(phase)*Math.exp(-t*36):Math.sin(phase)+.12*Math.sin(phase*3);
   samples[offset+i]+=wave*amp*Math.max(0,env);
  }
 };
 score.roots.forEach((root,bar)=>{const start=bar*4*beat;note(root-12,start,beat*3.8,.13,'bass');for(const interval of [0,7,12])note(root+interval,start,beat*3.85,.035,'pad');score.motif.forEach((interval,i)=>note(root+12+interval,start+i*.5*beat,beat*.43,.105,'bell'));score.pulse.forEach(i=>note(root+24,start+i*beat,beat*.12,.022,'tick'))});
 return {samples,sampleRate,duration:samples.length/sampleRate};
}
