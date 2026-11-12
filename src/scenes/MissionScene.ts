import {WorldEffects} from '../entities/WorldEffects';
import {confirmGame,deferWhileConfirming} from '../ui/ConfirmDialog';
import Phaser from 'phaser';
import {assetURL,type AssetManifest} from '../content/manifest';
import {createEnvironment} from '../entities/environment';
import type {AppUI} from '../ui/AppUI';
import {Raka} from '../entities/Raka';
import {Ion} from '../entities/Ion';
import {createGate} from '../entities/gate';
import {MissionInput} from '../input/MissionInput';
import {MissionPanel} from '../ui/MissionPanel';
import {ARENA,PUZZLE} from '../content/mission';
import {createExperiment,beginSimulation,transferElectron,stepExperiment,type Experiment,type Panel,type ChargeObject} from '../physics/charges';
import {ElectronEffects} from '../entities/ElectronEffects';
import {LESSON} from '../content/learning';
import {LearningPanel} from '../ui/LearningPanel';
import {createLearning,orient,observe,predict,savePrediction,addTransfer,startAttempt,finishAttempt,resetLearningExperiment,requestHint,explain,reflect,type LearningSession,type Prediction,type Answers} from '../learning/session';
import {PausePanel} from '../ui/PausePanel';
import {audio} from '../audio/AudioBus';
import {readSettings} from '../ui/settings';
import {makeCheckpoint,writeProgress,PROGRESS_KEY,progressEpoch,type Checkpoint} from '../storage/progress';
import {ComfortEffects} from '../entities/ComfortEffects';
import {refreshControlHint} from '../ui/controlHints';
export class MissionScene extends Phaser.Scene {
 private worldFX!:WorldEffects;
  private raka!:Raka;
  private ion!:Ion;
  private inputState!:MissionInput;
  private panel!:MissionPanel;
  private gate!:ReturnType<typeof createGate>;
  private elapsed=0;
  private pauses=new Set<string>();
  private near=false;
  private experiment:Experiment=createExperiment();
  private accumulator=0;
  private effects!:ElectronEffects;
  private learning:LearningSession=createLearning();
  private lessonUI!:LearningPanel;
  private observationMode=true;
  private pauseUI!:PausePanel;
  private comfort!:ComfortEffects;
  private preferences=readSettings();
  private runtime=new AbortController();
  private checkpointReady=false;
  private checkpointEpoch=0;
  private saveStatus='';
  private nextStep=0;
  private nextGate=0;
  private advancing=false;
  constructor(private manifest:AssetManifest,private ui:AppUI){super('mission')}
  create(data?:{checkpoint?:Checkpoint|null}){
    this.checkpointReady=false;this.checkpointEpoch=progressEpoch();this.runtime=new AbortController();this.nextStep=0;this.nextGate=0;this.saveStatus='';this.advancing=false;
    this.elapsed=0;this.pauses.clear();this.near=false;
    this.experiment=createExperiment();this.accumulator=0;
    this.learning=createLearning();this.observationMode=true;
    if(data?.checkpoint){this.experiment=structuredClone(data.checkpoint.experiment);this.learning=structuredClone(data.checkpoint.learning);this.observationMode=data.checkpoint.observationMode}
    createEnvironment(this,this.manifest.assets);this.gate=createGate(this,this.manifest);
    this.raka=new Raka(this,this.manifest);if(data?.checkpoint){this.raka.body.x=data.checkpoint.player.x;this.raka.sprite.x=this.raka.body.x}this.ion=new Ion(this,this.manifest,this.raka);this.ui.mission();
    this.worldFX=new WorldEffects(this,[{x:96,y:100},{x:480,y:100}]);audio.setMusic('mission1');this.comfort=new ComfortEffects(this);
    this.effects=new ElectronEffects(this);
    this.panel=new MissionPanel(open=>this.setPause('dialog',open),{transfer:(panel,action)=>this.transfer(panel,action),test:()=>this.runExperiment(),reset:()=>this.resetExperiment(),observe:panel=>this.recordObservation(panel),observation:value=>{this.observationMode=value;this.effects.setVisible(value);this.gate.render(this.experiment,value);this.saveStable();this.publish()}},assetURL(this.manifest.assets.find(a=>a.key==='electron')!.path!));
    this.inputState=new MissionInput(this.panel.controls,hidden=>{if(hidden)this.showPause('background')});
    this.pauseUI=new PausePanel({resume:()=>{this.pauses.delete('background');this.setPause('user',false);this.panel.setPaused(false);this.lessonUI.resume();void audio.unlock()},menu:()=>this.ui.menu(),status:()=>this.saveStatus,reset:()=>this.resetExperiment(),report:()=>this.ui.loadReport,retry:()=>this.ui.retry()});
    this.pauseUI.pauseButton.addEventListener('click',()=>this.showPause('user'),{signal:this.runtime.signal});
    this.lessonUI=new LearningPanel({next:()=>this.updateLearning(orient(this.learning)),predict:()=>this.updateLearning(predict(this.learning)),observe:panel=>this.recordObservation(panel),save:(p,revision)=>this.recordPrediction(p,revision),hint:()=>this.updateLearning(requestHint(this.learning)),explain:answers=>this.recordExplanation(answers),reflect:(comparison,next)=>this.updateLearning(reflect(this.learning,comparison,next)),restart:async()=>{if(await confirmGame('Ulang Misi 1? Sesi Misi 1 diganti; progres misi lain dan pengaturan tetap.')){this.checkpointReady=false;try{localStorage.removeItem(PROGRESS_KEY)}catch{}this.scene.restart({checkpoint:null})}},menu:()=>this.ui.menu(),nextMission:()=>{this.saveStable();this.ui.enterMission(2)},pause:()=>this.showPause('user'),modal:open=>this.setPause('lesson',open),beforeModal:()=>this.panel.close()},this.panel.lessonHost);
    this.updateLearning(this.learning);
    window.addEventListener('electroquest-confirmation',e=>this.setPause('confirmation',(e as CustomEvent<boolean>).detail),{signal:this.runtime.signal});
    window.addEventListener('electroquest-settings',()=>this.applyPreferences(),{signal:this.runtime.signal});this.applyPreferences();
    const mode=this.panel.observationInput;mode.checked=this.observationMode;mode.dispatchEvent(new Event('change'));
    window.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.repeat&&!document.querySelector('.game-stage dialog[open]')){event.preventDefault();this.showPause('user')}},{signal:this.runtime.signal});
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.saveStable();this.runtime.abort();this.inputState.destroy();audio.stop();this.worldFX.clear();this.comfort.clear();this.effects.clear();this.pauseUI.destroy();this.panel.destroy();this.lessonUI.destroy();delete this.ui.host.dataset.mission;this.pauses.clear()});
    this.checkpointReady=true;this.saveStable();
    this.refresh();
    this.publish();
  }
  private applyPreferences(){this.preferences=readSettings();this.worldFX.setReduced(this.preferences.reducedEffects);refreshControlHint();this.inputState.clear();this.effects.setReduced(this.preferences.reducedEffects);this.panel.setReduced(this.preferences.reducedEffects);this.comfort.setReduced(this.preferences.reducedEffects);this.ion.sprite.anims.timeScale=this.preferences.reducedEffects?0:1}
  private saveStable(){if(!this.checkpointReady||this.checkpointEpoch!==progressEpoch()||this.experiment.phase==='SIMULATING'||this.learning.activeAttempt!==null)return;const checkpoint=makeCheckpoint(this.learning,this.experiment,this.raka.body.x,this.observationMode);if(!checkpoint){this.saveStatus='Checkpoint ini belum dapat disimpan.'}else this.saveStatus=writeProgress(checkpoint)?'Checkpoint aman tersimpan di perangkat ini.':'Progres belum tersimpan; permainan tetap berjalan pada sesi ini.';let status=document.querySelector<HTMLElement>('.checkpoint-status');if(!status){status=document.createElement('p');status.className='checkpoint-status';this.panel.controls.append(status)}status.textContent=this.saveStatus}
  private showPause(reason:string){if(deferWhileConfirming(this,()=>this.showPause(reason))){this.setPause('background',true);return}this.saveStable();this.setPause(reason,true);if(this.panel.isOpen)this.panel.close();this.lessonUI?.suspend();this.panel.setPaused(reason==='background');this.pauseUI.show()}
  private setPause(reason:string,value:boolean){
    if(value)this.pauses.add(reason);else this.pauses.delete(reason);
    this.inputState.setEnabled(this.pauses.size===0);this.raka.stop();this.accumulator=0;
    if(this.pauses.size){this.raka.sprite.anims.pause();this.ion.sprite.anims.pause()}else{this.raka.sprite.anims.resume();this.ion.sprite.anims.resume()}
    // The dialog freezes actors, but accepted-transfer visuals can still animate.
    if([...this.pauses].some(r=>r!=='dialog'))this.scene.pause();else this.scene.resume();
    audio.pauseMusic(this.pauses.size>0);if(this.pauses.size)audio.stop();this.saveStable();
    this.publish();
  }
  update(_time:number,delta:number){
    // Ignore background catch-up, keep movement and follower independent of FPS.
    const seconds=Math.min(delta,100)/1000;
    this.effects.update(seconds);this.panel.updateEffects(seconds);
    this.comfort.update(seconds);if(!this.pauses.size)this.worldFX.update(seconds,{player:{x:this.raka.body.x,y:this.raka.body.y},walking:this.inputState.axis!==0,near:this.near,ready:this.experiment.phase==='OPENED',terminal:{x:208,y:328},goal:{x:320,y:310}});
    if(!this.pauses.has('dialog')){this.elapsed+=seconds;this.raka.update(this.inputState.axis,seconds,this.experiment.phase==='OPENED',this.learning.phase==='RESULTS');this.ion.update(this.raka,seconds,this.elapsed,this.preferences.reducedEffects);if(this.raka.sprite.anims.currentAnim?.key==='raka-walk'&&this.elapsed>=this.nextStep){audio.play('step');this.nextStep=this.elapsed+.28}}
    if(this.experiment.phase==='SIMULATING'){
      this.accumulator=Math.min(PUZZLE.maxAccumulation,this.accumulator+seconds);
      while(this.accumulator>=PUZZLE.fixedStep){this.experiment=stepExperiment(this.experiment);this.accumulator-=PUZZLE.fixedStep}
      if(this.elapsed>=this.nextGate){audio.play('gate');this.nextGate=this.elapsed+.35}
      if(this.experiment.phase!=='SIMULATING'){if(this.experiment.phase==='OPENED'){audio.play('latch');this.comfort.success()}this.updateLearning(finishAttempt(this.learning,this.experiment))}
      this.refresh();
    }
    this.near=Math.abs(this.raka.body.x-ARENA.terminal.x)<=ARENA.terminal.range&&Math.abs(this.raka.body.y-ARENA.floorY)<1;
    const atExit=Math.abs(this.raka.body.x-ARENA.door.x)<=ARENA.door.range&&Math.abs(this.raka.body.y-ARENA.floorY)<1;
    const exitReady=this.learning.phase==='RESULTS';
    this.gate.setExitOpen(exitReady);this.gate.setNearby(this.near);this.panel.setNearby(this.near||atExit,this.near?'terminal':atExit?exitReady?'exit-open':'exit-locked':'none');
    if(this.inputState.consumeInteraction()){
      if(this.near&&this.experiment.phase!=='SIMULATING'){if(this.learning.phase==='OBSERVATION')this.recordObservation('terminal');else this.panel.open();audio.play('scan');this.comfort.scanning()}
      else if(atExit&&exitReady&&!this.advancing){this.advancing=true;this.inputState.clear();audio.stop();this.scene.start('bridge-mission')}
    }
    this.panel.render(this.experiment);
    this.publish();
  }
  private refresh(){this.gate.render(this.experiment,this.observationMode);this.gate.setExitOpen(this.learning.phase==='RESULTS');this.panel.render(this.experiment)}
  private updateLearning(session:LearningSession){const completed=this.learning.phase!=='RESULTS'&&session.phase==='RESULTS';this.learning=session;this.lessonUI.render(session);this.panel.setLearning(session);this.gate.setExitOpen(session.phase==='RESULTS');this.panel.render(this.experiment);if(completed){audio.play('complete');this.comfort.success()}this.saveStable();this.publish()}
  private recordObservation(object:'terminal'|Panel){this.updateLearning(observe(this.learning,object,this.experiment));if(object!=='terminal'){audio.play('scan');this.comfort.scanning()}}
  private recordPrediction(prediction:Prediction,revision:boolean){if(revision?this.learning.phase!=='EXPERIMENT':this.learning.phase!=='PREDICTION')return;const next=savePrediction(this.learning,prediction);if(next===this.learning)return;this.updateLearning(next);this.panel.open(true)}
  private recordExplanation(answers:Answers){this.updateLearning(explain(this.learning,answers))}
  private transfer(panel:Panel,action:'take'|'send'){
    if(this.learning.phase!=='EXPERIMENT'||!this.learning.initialPrediction||!this.panel.isOpen)return;
    const before={...this.experiment.charges};
    const result=transferElectron(this.experiment,panel,action);this.panel.feedback(result.message);
    if(!result.accepted||!this.panel.isOpen){audio.play('blocked');return;}
    this.experiment=result.state;this.raka.useTool();
    audio.play('transfer');
    this.updateLearning(addTransfer(this.learning,{panel,action,source:result.source,target:result.target,before,after:this.experiment.charges}));
    this.panel.feedback(`${result.message} ${action==='send'?LESSON.feedback.received:LESSON.feedback.lost}`);
    const position=(key:ChargeObject)=>key==='glove'?{x:this.raka.body.x+10,y:this.raka.body.y-44}:{x:this.experiment[key],y:224};
    this.effects.emit(position(result.source),position(result.target));this.panel.showElectron(result.source,result.target);this.refresh();this.publish();
  }
  private runExperiment(){if(!this.panel.isOpen||this.experiment.phase!=='CONFIGURING')return;const next=startAttempt(this.learning,this.experiment);if(next===this.learning)return;this.saveStable();this.updateLearning(next);this.experiment=beginSimulation(this.experiment);this.accumulator=0;this.effects.clear();this.panel.clearEffects();this.panel.close();this.refresh();this.publish()}
  private resetExperiment(){
    this.learning=resetLearningExperiment(this.learning);
    audio.stop();audio.play('reset');this.comfort.clear();
    this.experiment=createExperiment();this.accumulator=0;this.inputState.clear();this.effects.clear();this.panel.clearEffects();this.raka.stop();
    // Avoid materializing the restored barrier around an actor in/beyond its gap.
    if(this.raka.body.x>ARENA.gate.left-ARENA.bodyHalfWidth){this.raka.body.x=ARENA.spawn.x;this.raka.body.y=ARENA.spawn.y;this.raka.body.vy=0;this.raka.update(0,0)}
    if(this.pauses.size)this.raka.sprite.anims.pause();
    this.updateLearning(this.learning);this.refresh();this.publish();
  }
  /** Read-only DOM diagnostics for browser verification; no mutating game globals. */
  private publish(){this.ui.host.dataset.mission=JSON.stringify({x:this.raka.body.x,y:this.raka.body.y,ionX:this.ion.sprite.x,ionY:this.ion.sprite.y,gameTime:this.elapsed,animation:this.raka.sprite.anims.currentAnim?.key,animationFPS:this.raka.sprite.anims.currentAnim?.frameRate,animationFrames:this.raka.sprite.anims.currentAnim?.frames.length,frame:this.raka.sprite.frame.name,anchor:{x:this.raka.sprite.originX,y:this.raka.sprite.originY},facing:this.raka.sprite.flipX?'left':'right',nearby:this.near,paused:this.pauses.size>0,axis:this.inputState?.axis??0,objects:this.children.length,experiment:this.experiment,vfx:this.worldFX.diagnostics,particles:this.effects.count,gateOpen:this.experiment.phase==='OPENED',learning:this.learning,observationMode:this.observationMode,pauseReasons:[...this.pauses],audio:audio.diagnostics,saveStatus:this.saveStatus})}
}
