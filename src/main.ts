import './vfx.css';
import {startConsoleUI} from './ui/ConsoleUI';
import {cancelGameConfirmation} from './ui/ConfirmDialog';
import './styles.css';
import './puzzle.css';
import './learning.css';
import './comfort.css';
import './landing.css';
import './immersive.css';
import './ui-layout.css';
import './bridge.css';
import './console-ui.css';
import {installUISkin} from './ui/UISkin';
import {installLandingSkin, decorateLanding} from './ui/LandingSkin';
import {AppUI} from './ui/AppUI';
import {LandingPage} from './ui/LandingPage';
import {fetchManifest} from './content/manifest';
import {bridgeUnlocked} from './storage/bridgeProgress';
import {polarizationUnlocked} from './storage/polarizationProgress';
import {readProgress} from './storage/progress';
import {audio} from './audio/AudioBus';
import {installControlHints} from './ui/controlHints';

audio.install();
const removeControlHints = installControlHints();

let currentMission = 1;
let previewParam = new URLSearchParams(location.search).get('preview');

const root = document.querySelector<HTMLElement>('#app')!;
const removeConsoleUI=startConsoleUI(root);
let landing: LandingPage | undefined,
  ui: AppUI | undefined,
  game: import('phaser').Game | undefined,
  attempt = 0;

function cleanup() {
  audio.setMusic(null);
  cancelGameConfirmation();
  attempt++;
  landing?.destroy();
  landing = undefined;
  game?.scene.stop('mission');
  game?.scene.stop('mission-02');
  game?.scene.stop('bridge-mission');
  game?.scene.stop('mission-03');
  game?.scene.stop('boot');
  game?.destroy(true);
  game = undefined;
  ui?.destroy();
  ui = undefined;
}

function home() {
  currentMission = 1;
  previewParam = null;
  const url = new URL(location.href);
  if (url.searchParams.has('preview')) {
    url.searchParams.delete('preview');
    history.replaceState(null, '', url);
  }
  cleanup();
  landing = new LandingPage(root, enter);
  document.querySelector('.skip')?.setAttribute('href', '#main-content');
  scrollTo(0, 0);
}

async function enter(fresh = false, mission = 1) {
  if (mission === 2 && !bridgeUnlocked()) mission = 1;
  if (mission === 3 && !polarizationUnlocked()) mission = 1;
  currentMission = mission;

  cleanup();
  const current = attempt;
  const checkpoint = fresh || previewParam ? null : readProgress().checkpoint;
  ui = new AppUI(root);
  const activeUI = ui;
  const retry = () =>
    void enter(document.body.dataset.screen === 'mission' ? false : fresh, currentMission);
  ui.bind({ start: () => {}, resume: () => {}, menu: home, retry, enterMission: mission => void enter(false, mission) });
  document.querySelector('.skip')?.setAttribute('href', '#panel');
  scrollTo(0, 0);

  try {
    if (!document.createElement('canvas').getContext('2d')) {
      throw Error('Browser ini tidak mendukung Canvas 2D.');
    }
    const manifest = await fetchManifest();
    if (current !== attempt) return;
    installUISkin(manifest);
    installLandingSkin(manifest);
    decorateLanding(root.querySelector('#panel')!);
    const { createGame } = await import('./game');
    if (current !== attempt) return;
    game = createGame(manifest, activeUI, {
      checkpoint,
      preview: previewParam,
      missionNumber: currentMission,
      home,
      retry,
      enterMission: mission => void enter(false, mission)
    });
  } catch (error) {
    if (current === attempt) {
      activeUI.fatal(error instanceof Error ? error.message : 'Aplikasi belum dapat dibuka.');
    }
  }
}

if (previewParam) void enter(false, previewParam === 'mission-03' ? 3 : 2);
else home();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanup();
    audio.destroy();
    removeControlHints();removeConsoleUI();
  });
}
