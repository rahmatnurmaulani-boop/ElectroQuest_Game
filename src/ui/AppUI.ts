import {decorateUI} from './UISkin';
import {MISSION} from '../content/mission';
import {readSettings,applySettings} from './settings';
export interface LoadReport {total:number;loaded:number;failed:string[]}
type Actions={start:()=>void;resume:()=>void;menu:()=>void;retry:()=>void};
export class AppUI {
  readonly host:HTMLElement;
  private panel:HTMLElement;
  private status:HTMLElement;
  private progress:HTMLProgressElement;
  private alerts:HTMLElement;
  private listeners=new AbortController();
  private stageObserver:ResizeObserver;
  private report:LoadReport={total:0,loaded:0,failed:[]};
  private actions:Actions={start:()=>{},resume:()=>{},menu:()=>{},retry:()=>location.reload()};
  constructor(root:HTMLElement){
    root.innerHTML=`<header class="topbar"><a class="brand" href="./" aria-label="ElectroQuest, beranda"><span class="brand-symbol" aria-hidden="true">E<span>Q</span></span><span>ElectroQuest<small>Penjaga Kota Muatan</small></span></a><a class="gallery-link" href="./gallery.html">Galeri aset <span aria-hidden="true">↗</span></a></header><main class="app-layout"><section id="panel" class="panel" tabindex="-1" aria-label="Panel utama"></section><section class="world-column" aria-label="Lingkungan laboratorium"><div class="world-heading"><span>LABORATORIUM KOTA</span><span id="scene-label">Memuat</span></div><div class="world-frame"><div id="game" role="img" aria-label="Arena pixel art laboratorium, koordinat 640 kali 360"></div></div><div class="load-line"><p id="load-status" role="status">Membaca manifest aset…</p><progress id="load-progress" max="1" value="0" aria-label="Pemuatan aset"></progress></div><div id="asset-alerts"></div></section></main><footer><span>Petualangan sains · Misi 01</span><span>Kontrol & audio / Tahap 7</span></footer>`;
    this.host=root.querySelector('#game')!;this.panel=root.querySelector('#panel')!;this.status=root.querySelector('#load-status')!;this.progress=root.querySelector('#load-progress')!;this.alerts=root.querySelector('#asset-alerts')!;
    const stage=root.querySelector<HTMLElement>('.world-frame')!;
    stage.classList.add('game-stage');stage.tabIndex=-1;stage.setAttribute('aria-label','Area permainan ElectroQuest');
    const measure=()=>{const r=stage.getBoundingClientRect();for(const [key,value]of Object.entries({x:r.x,y:r.y,w:r.width,h:r.height}))stage.style.setProperty(`--stage-${key}`,`${value}px`)};
    this.stageObserver=new ResizeObserver(measure);this.stageObserver.observe(stage);
    window.addEventListener('resize',measure,{signal:this.listeners.signal});
    root.querySelector('.brand')!.addEventListener('click',event=>{event.preventDefault();this.actions.menu()},{signal:this.listeners.signal});
    applySettings(readSettings());this.loading();
    window.addEventListener('electroquest-progress-cleared',()=>this.actions.menu(),{signal:this.listeners.signal});
  }
  bind(actions:Actions){this.actions=actions}
  destroy(){this.listeners.abort();this.stageObserver.disconnect()}
  private show(markup:string,screen:string,focus=true,sceneLabel='Misi 01'){this.panel.innerHTML=markup;document.body.dataset.screen=screen;document.querySelector('#scene-label')!.textContent=screen==='mission'?sceneLabel:screen==='loading'?'Memuat':'Menu utama';if(focus)this.panel.focus();this.panel.querySelector<HTMLButtonElement>('[data-action="back"]')?.addEventListener('click',()=>this.actions.menu())}
  loading(){this.show('<span class="landing-load-indicator" role="img" aria-label="Memuat aset"></span><p class="eyebrow">MENGHUBUNGKAN LABORATORIUM</p><h1>Menyiapkan petualangan.</h1><p class="intro">Memuat lingkungan dan perlengkapan Raka serta Ion.</p><button data-action="back">Kembali</button>','loading',false)}
  progressTo(value:number){this.progress.value=value;this.status.textContent=`Memuat aset… ${Math.round(value*100)}%`}
  setReport(report:LoadReport){this.report=report;this.progress.value=1;this.status.textContent=`${report.loaded} dari ${report.total} aset siap`;this.alerts.replaceChildren();if(report.failed.length){const box=document.createElement('div');box.className='error-panel';box.setAttribute('role','alert');const p=document.createElement('p');p.textContent=`${report.failed.length} aset gagal dimuat. Periksa koneksi atau berkas lokal.`;const list=document.createElement('p');list.className='failed-keys';list.textContent=report.failed.join(', ');const retry=document.createElement('button');retry.textContent='Coba muat ulang';retry.onclick=()=>this.actions.retry();box.append(p,list,retry);this.alerts.append(box)}}
  menu(){this.actions.menu()}
  get loadReport(){return this.report}
  retry(){this.actions.retry()}
  mission(title=`Misi 01 · ${MISSION.title}`,objective='Dengarkan pengarahan Ion.',sceneLabel='Misi 01'){this.show(`<h1>${title}</h1><p id="active-objective" aria-live="polite">${objective}</p>`,'mission',false,sceneLabel);this.panel.className='game-hud';document.querySelector('.game-stage')!.append(this.panel)}
  previewMission(){this.show('<h1>Misi 02 · Jembatan Coulomb</h1><p id="active-objective">Preview aset · puzzle/penilaian belum tersedia.</p>','mission',false,'Preview Misi 02');this.panel.className='game-hud';const stage=document.querySelector('.game-stage')!;stage.classList.add('bridge-preview');stage.append(this.panel)}
  fatal(message:string){this.show('<p class="eyebrow">PEMUATAN TERHENTI</p><h1>Laboratorium belum siap.</h1><p id="fatal-message" class="intro"></p><button id="retry" class="primary">Coba lagi</button><button data-action="back">Kembali</button>','error');this.panel.querySelector('#fatal-message')!.textContent=message;this.panel.querySelector('#retry')!.addEventListener('click',()=>this.actions.retry());decorateUI(this.panel);this.status.textContent='Aplikasi belum dapat dimulai.';this.progress.value=0}
}
