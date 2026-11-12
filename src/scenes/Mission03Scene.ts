import {WorldEffects} from '../entities/WorldEffects';
import {openMissionPicker} from '../ui/navigation';
import {confirmGame,deferWhileConfirming} from '../ui/ConfirmDialog';
import Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import type {AppUI} from '../ui/AppUI';
import {createWarehouseArena} from '../entities/warehouseArena';
import {Raka} from '../entities/Raka';
import {Ion} from '../entities/Ion';
import {MissionInput} from '../input/MissionInput';
import {WarehouseLessonPanel} from '../ui/WarehouseLessonPanel';
import {PausePanel} from '../ui/PausePanel';
import {readSettings} from '../ui/settings';
import {audio} from '../audio/AudioBus';
import {icon} from '../ui/UISkin';
import {
  initialPolarizationModel,
  stepPolarization,
  setSourceCharge,
  setSourcePosition,
  latchTray
} from '../physics/polarization';
import {
  newPolarizationSession,
  snapshotPolarization,
  comparePolarObservations,
  investigatedPolarization,
  explainPolarization,
  type PolarizationSession
} from '../learning/polarization';
import {
  readPolarization,
  savePolarization,
  removePolarization
} from '../storage/polarizationProgress';
import {WAREHOUSE as W, POLARIZATION_QUESTIONS} from '../content/mission03';

export class Mission03Scene extends Phaser.Scene {
 private worldFX!:WorldEffects;
  private s!: PolarizationSession;
  private arena!: ReturnType<typeof createWarehouseArena>;
  private raka!: Raka;
  private ion!: Ion;
  private inputState!: MissionInput;
  private panel!: WarehouseLessonPanel;
  private pauseUI!: PausePanel;
  private abort = new AbortController();
  private reasons = new Set<string>();
  private accumulator = 0;
  private elapsed = 0;
  private saveTime = 0;
  private lessonButton!: HTMLButtonElement;
  private reduced = false;
  private feedback = '';
  private guideTween?: Phaser.Tweens.Tween;

  constructor(private manifest: AssetManifest, private ui: AppUI) {
    super({
      key: 'mission-03',
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 700 }, debug: false }
      }
    });
  }

  create() {
    this.s = readPolarization() ?? newPolarizationSession();
    this.abort = new AbortController();
    this.accumulator = 0;
    this.elapsed = 0;
    this.saveTime = 0;
    this.reasons.clear();
    this.ui.mission('Misi 03 · Gudang Polarisasi','Dengarkan pengarahan Ion.','Misi 03');

    const stageEl = document.querySelector('.game-stage');
    stageEl?.classList.add('warehouse-full');

    // Create arena environment
    this.arena = createWarehouseArena(this, this.manifest, true);this.worldFX=new WorldEffects(this,[{x:160,y:70},{x:340,y:70}]);

    audio.setMusic('mission3');
    // Create player (Raka)
    this.raka = new Raka(this, this.manifest);
    this.raka.sprite.setPosition(this.s.playerX, 304);
    this.physics.add.existing(this.raka.sprite);
    const b = this.body;
    b.setSize(24, 64).setOffset(20, 26).setCollideWorldBounds(true);
    this.physics.world.setBounds(0, -128, 640, 728);

    // Colliders
    this.physics.add.collider(this.raka.sprite, this.arena.floor);
    this.physics.add.collider(this.raka.sprite, this.arena.exitBlocker);

    // Create companion (Ion)
    this.ion = new Ion(this, this.manifest, this.raka);
    this.ion.sprite.setPosition(Math.max(28, this.s.playerX - 40), 198);

    // UI Panel
    this.panel = new WarehouseLessonPanel(
      (a, d) => this.act(a, d),
      open => this.pause('dialog', open)
    );
    this.inputState = new MissionInput(this.panel.controls, hidden => {
      if (hidden) this.showPause();
    });

    // Pause UI
    this.pauseUI = new PausePanel({
      resume: () => {this.reasons.delete('background');this.pause('user', false)},
      menu: () => {
        this.persist();
        this.ui.menu();
      },
      status: () => this.ui.host.dataset.polarSave==='saved'?'Checkpoint aman Misi 3 tersimpan.':'Progres belum tersimpan; tersedia pada sesi ini.',
      reset: () => this.reset(),
      report: () => this.ui.loadReport,
      retry: () => this.ui.retry(),
      resetLabel: 'Reset eksperimen',
      preview: {
        help:
          '<p>A/D atau panah: berjalan. E: terminal dalam jangkauan. Gunakan alat bermuatan untuk menarik kertas netral ke baki.</p>' +
          '<p>Kedua tanda muatan dapat menarik benda netral melalui polarisasi. Jaga agar tidak menyentuh langsung.</p>',
        dialog:
          'Jalur koridor tertutup serpihan kertas isolator. Batang bermuatan menginduksi pemisahan muatan sehingga kertas tertarik ke arahnya.',
        goal: 'Bandingkan polarisasi, kumpulkan kertas ke baki, dan jelaskan konsepnya.'
      }
    });
    this.pauseUI.pauseButton.addEventListener('click', () => this.showPause(), {
      signal: this.abort.signal
    });

    // Mission notes button in toolbar
    this.lessonButton = document.createElement('button');
    this.lessonButton.textContent = 'Catatan misi';
    this.lessonButton.setAttribute('aria-label', 'Catatan misi');
    icon(this.lessonButton,'m3-icon-observe');
    document.querySelector('.mission-toolbar')?.append(this.lessonButton);
    this.lessonButton.addEventListener(
      'click',
      () => this.panel.open(this.s, 'lesson', this.feedback),
      { signal: this.abort.signal }
    );

    // Window keyboard & settings listeners
    window.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Escape' && !e.repeat && !document.querySelector('.game-stage dialog[open]')) {
          e.preventDefault();
          this.showPause();
        }
      },
      { signal: this.abort.signal }
    );
    window.addEventListener('electroquest-confirmation',e=>this.pause('confirmation',(e as CustomEvent<boolean>).detail),{signal:this.abort.signal});
    window.addEventListener('electroquest-settings', () => this.preferences(), {
      signal: this.abort.signal
    });

    this.preferences();
    this.render();
    this.persist();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.abort.abort();
      this.guideTween?.stop();
      this.clearEffects();
      this.inputState.destroy();
      this.panel.destroy();
      this.pauseUI.destroy();
      audio.stop();
      delete this.ui.host.dataset.polarization;
      document.querySelector('.game-stage')?.classList.remove('warehouse-full');
      this.reasons.clear();
    });

    if (['PROBLEM', 'PREDICTION', 'EXPLANATION', 'REFLECTION', 'RESULTS'].includes(this.s.phase)) {
      this.panel.open(this.s);
    }
  }

  private get body() {
    return this.raka.sprite.body as Phaser.Physics.Arcade.Body;
  }

  private preferences() {
    this.reduced = readSettings().reducedEffects;this.worldFX.setReduced(this.reduced);
    this.inputState.clear();
    this.ion.sprite.anims.timeScale = this.reduced ? 0 : 1;
  }

  private pause(reason: string, on: boolean) {
    if (on) this.reasons.add(reason);
    else this.reasons.delete(reason);
    audio.pauseMusic(this.reasons.size>0);this.accumulator = 0;
    this.body.setVelocityX(0);
    this.inputState?.setEnabled(!this.reasons.size);
    if (this.reasons.size) {
      this.raka.sprite.anims.pause();
      this.ion.sprite.anims.pause();
      this.scene.pause();
      audio.stop();
    } else {
      this.raka.sprite.anims.resume();
      this.ion.sprite.anims.resume();
      this.scene.resume();
    }
    this.publish();
  }

  private showPause() {if(deferWhileConfirming(this,()=>this.showPause())){this.pause('background',true);return}
    this.pause('user', true);
    this.panel.close();
    this.persist();
    this.pauseUI.show();
  }

  private persist() {
    this.s.playerX = Math.max(32, Math.min(608, this.raka.sprite.x));
    const ok = savePolarization(this.s);
    this.ui.host.dataset.polarSave = ok ? 'saved' : 'session-only';
  }

  private clearEffects() {this.worldFX.clear();
    this.arena?.clearEffects();
  }

  private reset() {audio.play('reset');
    this.guideTween?.stop();
    this.s.model = initialPolarizationModel();
    this.s.solution = null;
    this.s.crossed = false;
    if (['EXPLANATION', 'REFLECTION', 'RESULTS'].includes(this.s.phase)) {
      this.s.phase = 'SOLUTION';
    }
    this.accumulator = 0;
    this.clearEffects();
    this.body.reset(80, 304);
    this.feedback = 'Eksperimen direset. Prediksi dan riwayat pengamatan tetap dipertahankan.';
    this.render();
    this.persist();
    if (this.panel.isOpen) this.panel.open(this.s, 'lesson', this.feedback);
  }

  private async act(action: string, data: FormData | null) {
    const m = this.s.model;
    const number = (key: string) => Number(data?.get(key));
    this.feedback = '';

    if (action === 'observe' && this.s.phase === 'PROBLEM') {
      this.s.phase = 'OBSERVATION';
      this.panel.close();
    } else if (action === 'predict' && this.s.phase === 'OBSERVATION') {
      if (Math.abs(this.raka.sprite.x - W.terminalX) > W.terminalRange) {
        this.feedback = 'Dekati dan periksa terminal terlebih dahulu.';
      } else {
        this.s.phase = 'PREDICTION';
      }
    } else if (action === 'prediction' && this.s.phase === 'PREDICTION') {
      const p0 = data?.get('pred_0');
      const p1 = data?.get('pred_1');
      if (p0 === '' || p1 === '' || p0 === null || p1 === null) {
        this.feedback = 'Jawab kedua prediksi awal terlebih dahulu.';
      } else {
        this.s.prediction = [Number(p0), Number(p1)];
        this.s.phase = 'INVESTIGATION';
        this.feedback = 'Prediksi awal tersimpan. Mulai investigasi variabel polarisasi!';
      }
    } else if (action === 'lesson') {
      this.panel.open(this.s);
      return;
    } else if (action === 'render') {
      this.panel.render(this.s, this.feedback);
      return;
    } else if (action === 'missions') {
      this.persist();openMissionPicker(()=>this.ui.menu());return;
    } else if (action === 'home') {
      this.persist();
      this.ui.menu();
      return;
    } else if (action === 'replay') {
      if (await confirmGame('Ulang Misi 3? Progres Misi 3 direset; Misi 1 & 2 tetap aman.')) {
        removePolarization();
        this.s = newPolarizationSession();
        this.body.reset(80, 304);
        this.clearEffects();
      }
    } else if (action === 'hint') {
      this.s.hints = Math.min(3, this.s.hints + 1);
      this.feedback = [
        '',
        'Bandingkan muatan +3 dan -3 pada jarak yang sama: keduanya menghasilkan tarikan!',
        'Bandingkan posisi sumber dekat (x=340) dengan posisi jauh (x=500): polarisasi berkurang drastis saat menjauh.',
        'Untuk membersihkan jalur: atur sumber bermuatan, geser ke atas serpihan kertas, lalu pandu ke baki pengumpulan (x=180).'
      ][this.s.hints];
    } else if (action === 'scan') {
      this.panel.close();
      this.arena.scan.setPosition(m.sourceX, m.sourceY).setAlpha(0.8).setVisible(true);
      this.tweens.killTweensOf(this.arena.scan);
      this.tweens.add({
        targets: this.arena.scan,
        alpha: 0,
        scale: 1.5,
        duration: this.reduced ? 150 : 650,
        onComplete: () => {
          this.arena.scan.setVisible(false).setScale(1);
        }
      });
      audio.play('scan');
    } else if (action === 'reset') {
      this.reset();
      return;
    } else if (action === 'charge-pos') {
      this.s.model = setSourceCharge(m, 3);
      audio.play('transfer');
    } else if (action === 'charge-neg') {
      this.s.model = setSourceCharge(m, -3);
      audio.play('transfer');
    } else if (action === 'charge-zero') {
      this.s.model = setSourceCharge(m, 0);
    } else if (action === 'apply-x') {
      const x = number('sourceX');
      if (Number.isFinite(x)) {
        this.s.model = setSourcePosition(m, x);
      }
    } else if (action === 'pos-tray') {
      this.s.model = setSourcePosition(m, 180);
    } else if (action === 'pos-center') {
      this.s.model = setSourcePosition(m, 340);
    } else if (action === 'pos-far') {
      this.s.model = setSourcePosition(m, 500);
    } else if (action === 'snap-paper' && this.s.phase === 'INVESTIGATION') {
      if (this.s.observations.length < 100) {
        this.s.observations.push(snapshotPolarization(m, this.s.observations.length + 1, 'paper'));
        this.feedback = 'Pengamatan serpihan kertas berhasil disimpan ke catatan.';
      }
    } else if (action === 'snap-metal' && this.s.phase === 'INVESTIGATION') {
      if (this.s.observations.length < 100) {
        this.s.observations.push(snapshotPolarization(m, this.s.observations.length + 1, 'metal'));
        this.feedback = 'Pengamatan bola logam demo berhasil disimpan ke catatan.';
      }
    } else if (action === 'compare' && this.s.phase === 'INVESTIGATION') {
      const a = this.s.observations[number('a') - 1];
      const b = this.s.observations[number('b') - 1];
      if (a && b) {
        const c = comparePolarObservations(a, b);
        this.feedback = c.message;
        if (c.kind && !this.s.comparisons.some(x => x.a === a.id && x.b === b.id)) {
          this.s.comparisons.push({ a: a.id, b: b.id, kind: c.kind, ratio: c.ratio });
        }
      } else {
        this.feedback = 'Simpan dan pilih dua pengamatan terlebih dahulu.';
      }
    } else if (action === 'solution' && investigatedPolarization(this.s)) {
      this.s.phase = 'SOLUTION';
      this.feedback = 'Fase solusi aktif: kumpulkan seluruh serpihan kertas ke baki.';
    } else if (action === 'guide-tray' && this.s.phase === 'SOLUTION') {
      this.panel.close();
      if (this.s.model.sourceCharge === 0) {
        this.s.model = setSourceCharge(this.s.model, -3);
      }
      audio.play('scan');
      const proxy = { x: this.s.model.sourceX };
      this.guideTween = this.tweens.add({
        targets: proxy,
        x: W.trayX,
        duration: this.reduced ? 400 : 1500,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          this.s.model = setSourcePosition(this.s.model, proxy.x);
        },
        onComplete: () => {
          const collectedBefore = this.s.model.collectedCount;
          for (const p of this.s.model.papers) {
            if (Math.abs(p.x - W.trayX) <= 60) {
              p.state = 'collected';
            }
          }
          this.s.model = latchTray(this.s.model);
          if (this.s.model.collectedCount > collectedBefore) audio.play('collect');
          audio.play('latch');
          if (this.s.model.phase === 'CLEARED') {
            audio.play('gate');
            this.arena.successFlash
              .setPosition(W.trayX, W.floorY - 14)
              .setVisible(true)
              .play('m3-success-flash');
          }
          this.render();
          this.persist();
        }
      });
    } else if (action === 'latch') {
      const collectedBefore = this.s.model.collectedCount;
      for (const p of this.s.model.papers) {
        if (Math.abs(p.x - W.trayX) <= 60) {
          p.state = 'collected';
        }
      }
      this.s.model = latchTray(this.s.model);
      if (this.s.model.collectedCount > collectedBefore) audio.play('collect');
      audio.play('latch');
      if (this.s.model.phase === 'CLEARED') {
        audio.play('gate');
        this.s.solution = structuredClone(this.s.model);
        this.feedback = this.s.model.message;
      }
    } else if (action === 'explain') {
      const answers = POLARIZATION_QUESTIONS.map(q =>
        data?.get(q.id) === '' ? -1 : number(q.id)
      );
      const next = explainPolarization(this.s, answers);
      if (next === this.s) {
        this.feedback = 'Pilih jawaban pada seluruh pertanyaan penjelasan.';
      } else {
        this.s = next;
        this.feedback =
          this.s.phase === 'EXPLANATION'
            ? 'Periksa umpan balik pada jawabanmu.'
            : 'Penjelasan telah sesuai dengan prinsip fisika!';
      }
    } else if (action === 'results' && this.s.phase === 'REFLECTION') {
      this.s.reflection = String(data?.get('reflection') ?? '').slice(0, 2000);
      this.s.phase = 'RESULTS';
      audio.play('complete');
      this.persist();
    }

    this.render();
    if (this.panel.isOpen) this.panel.render(this.s, this.feedback);
    this.persist();
  }

  private render() {
    this.arena.render(this.s.model,this.reduced);
    this.panel?.update(this.s);
    if (this.lessonButton) {
      this.lessonButton.disabled = false;
    }
    this.publish();
  }

  update(_t: number, delta: number) {
    const dt = Math.min(delta, 100) / 1000;
    this.elapsed += dt;

    // Step physics for paper shreds
    this.accumulator = Math.min(0.1, this.accumulator + dt);
    const collectedBefore = this.s.model.collectedCount;
    while (this.accumulator >= 1 / 60) {
      this.s.model = stepPolarization(this.s.model, 1 / 60);
      this.accumulator -= 1 / 60;
    }
    if (this.s.model.collectedCount > collectedBefore) audio.play('collect');

    // Player movement
    const b = this.body;
    const axis = this.inputState.axis;if(axis&&Math.floor(this.elapsed/.28)!==Math.floor((this.elapsed-dt)/.28))audio.play('step');
    b.setVelocityX(axis * 100);
    if (axis) this.raka.sprite.setFlipX(axis < 0);
    const key = axis ? 'raka-walk' : 'raka-idle';
    const a = this.manifest.assets.find(asset => asset.key === key)!;
    this.raka.sprite.setOrigin(a.anchor.x, a.anchor.y).play(key, true);

    // Companion movement
    const f = 1 - Math.exp(-6 * dt);
    this.ion.sprite.x += (Math.max(28, Math.min(608, this.raka.sprite.x - 40)) - this.ion.sprite.x) * f;
    this.ion.sprite.y +=
      (this.raka.sprite.y - 106 + (this.reduced ? 0 : Math.sin(this.elapsed * 2.5) * 3) - this.ion.sprite.y) * f;

    // Proximity to terminal (X = 120)
    const nearTerminal =
      Math.abs(this.raka.sprite.x - W.terminalX) <= W.terminalRange &&
      Math.abs(b.bottom - 304) < 3;
    this.worldFX.update(dt,{player:{x:this.raka.sprite.x,y:this.body.bottom},walking:axis!==0&&this.body.blocked.down,near:nearTerminal,ready:this.s.model.phase==='CLEARED',terminal:{x:W.terminalX,y:304},goal:{x:W.trayX,y:304}});this.panel.nearby(nearTerminal);
    if (this.inputState.consumeInteraction() && nearTerminal) {
      this.panel.open(this.s);
    }

    // Check if player traversed cleared corridor to exit
    if (
      this.s.phase === 'SOLUTION' &&
      this.s.model.phase === 'CLEARED' &&
      this.raka.sprite.x >= W.exitX - 10 &&
      Math.abs(b.bottom - 304) < 4
    ) {
      this.s.crossed = true;
      this.s.solution = structuredClone(this.s.model);
      this.s.phase = 'EXPLANATION';
      this.persist();
      this.panel.open(this.s);
    }

    this.render();
    this.saveTime += dt;
    if (this.saveTime > 0.5) {
      this.saveTime = 0;
      this.persist();
    }
  }

  private publish() {
    if (!this.s || !this.raka) return;
    this.ui.host.dataset.polarization = JSON.stringify({
      phase: this.s.phase,
      vfx:this.worldFX.diagnostics,modelPhase: this.s.model.phase,
      sourceX: this.s.model.sourceX,
      sourceCharge: this.s.model.sourceCharge,
      collectedCount: this.s.model.collectedCount,
      totalPapers: this.s.model.papers.length,
      playerX: this.raka.sprite.x,
      crossed: this.s.crossed,
      observations: this.s.observations.length,
      comparisons: this.s.comparisons.length
    });
  }
}
