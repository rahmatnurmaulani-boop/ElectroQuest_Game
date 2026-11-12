import Phaser from 'phaser';
import {WORLD} from './content/mission';
import type {AssetManifest} from './content/manifest';
import {BridgePreviewScene} from './scenes/BridgePreviewScene';
import {Mission02Scene} from './scenes/Mission02Scene';
import {Mission03Scene} from './scenes/Mission03Scene';
import {BootScene, type BootOptions} from './scenes/BootScene';
import {MissionScene} from './scenes/MissionScene';
import type {AppUI} from './ui/AppUI';

export interface GameOptions extends BootOptions {
  home: () => void;
  retry: () => void;
}

export function createGame(
  manifest: AssetManifest,
  ui: AppUI,
  options: GameOptions
): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: ui.host,
    width: WORLD.width,
    height: WORLD.height,
    backgroundColor: '#111e35',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    antialiasGL: false,
    banner: false,
    audio: { noAudio: true },
    input: { keyboard: false, mouse: false, touch: false, gamepad: false },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WORLD.width,
      height: WORLD.height
    },
    scene: [
      new BootScene(manifest, ui, options),
      new BridgePreviewScene(manifest, ui),
      new Mission02Scene(manifest, ui),
      new Mission03Scene(manifest, ui),
      new MissionScene(manifest, ui)
    ]
  });

  ui.bind({
    start: () => {},
    resume: () => {},
    menu: () => {
      game.scene.stop('mission');
      game.scene.stop('mission-02');
      game.scene.stop('bridge-mission');
      game.scene.stop('mission-03');
      game.scene.stop('boot');
      options.home();
    },
    retry: options.retry
  });

  const observer = new ResizeObserver(() => {
    game.scale.getParentBounds();
    game.scale.refresh();
  });
  observer.observe(ui.host);
  game.events.once(Phaser.Core.Events.DESTROY, () => observer.disconnect());

  return game;
}
