import Phaser from 'phaser';
import {assetURL, type AssetManifest} from '../content/manifest';
import {REQUIRED_MISSION} from '../content/mission';
import {BRIDGE_REQUIRED,BRIDGE_PLAYABLE_EXTRA} from '../content/mission02';
import {WAREHOUSE_REQUIRED} from '../content/mission03';
import type {AppUI} from '../ui/AppUI';
import type {Checkpoint} from '../storage/progress';

export interface BootOptions {
  checkpoint?: Checkpoint | null;
  preview?: string | null;
  missionNumber?: number;
}

export class BootScene extends Phaser.Scene {
  private failed = new Set<string>();

  constructor(
    private manifest: AssetManifest,
    private ui: AppUI,
    private options: BootOptions = {}
  ) {
    super('boot');
  }

  preload() {
    this.load.setCORS('anonymous');
    this.load.on(Phaser.Loader.Events.PROGRESS, this.onProgress, this);
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, this.onError, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.load.off(Phaser.Loader.Events.PROGRESS, this.onProgress, this);
      this.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, this.onError, this);
    });

    for (const a of this.manifest.assets) {
      if (!a.path || a.status === 'missing' || a.status === 'placeholder') {
        this.failed.add(a.key);
        continue;
      }
      if (a.frames > 1) {
        this.load.spritesheet(a.key, assetURL(a.path), {
          frameWidth: a.frameWidth,
          frameHeight: a.frameHeight,
          startFrame: 0,
          endFrame: a.frames - 1,
          margin: 0,
          spacing: 0
        });
      } else {
        this.load.image(a.key, assetURL(a.path));
      }
    }
  }

  private onProgress(value: number) {
    this.ui.progressTo(value);
  }

  private onError(file: Phaser.Loader.File) {
    this.failed.add(file.key);
  }

  create() {
    const preview = this.options.preview;
    const mission = this.options.missionNumber ?? (preview === 'mission-02' ? 2 : preview === 'mission-03' ? 3 : 1);

    const required =
      preview === 'mission-03' || mission === 3
        ? WAREHOUSE_REQUIRED
        : preview === 'mission-02' || mission === 2
        ? preview === 'mission-02' ? BRIDGE_REQUIRED : [...BRIDGE_REQUIRED,...BRIDGE_PLAYABLE_EXTRA]
        : REQUIRED_MISSION;

    for (const a of this.manifest.assets) {
      if (!this.textures.exists(a.key)) {
        this.failed.add(a.key);
        continue;
      }
      const texture = this.textures.get(a.key);
      const image = texture.getSourceImage() as HTMLImageElement;
      if (
        image.width !== a.width ||
        image.height !== a.height ||
        (a.frames > 1 && texture.getFrameNames().length !== a.frames)
      ) {
        this.failed.add(a.key);
        this.textures.remove(a.key);
      } else {
        texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    for (const key of required) {
      if (!this.manifest.assets.some(a => a.key === key)) this.failed.add(key);
    }

    const loaded = this.manifest.assets.filter(a => !this.failed.has(a.key)).length;
    this.ui.setReport({ total: this.manifest.assets.length, loaded, failed: [...this.failed] });

    if (required.some(key => this.failed.has(key))) {
      this.ui.fatal(
        'Aset wajib misi gagal dimuat. Progres tersimpan tetap aman. Coba lagi untuk memuat ulang.'
      );
      return;
    }

    let targetScene = 'mission';
    if (preview === 'mission-02') targetScene = 'mission-02';
    else if (preview === 'mission-03' || mission === 3) targetScene = 'mission-03';
    else if (mission === 2) targetScene = 'bridge-mission';

    this.scene.start(targetScene, { checkpoint: this.options.checkpoint });
  }
}
