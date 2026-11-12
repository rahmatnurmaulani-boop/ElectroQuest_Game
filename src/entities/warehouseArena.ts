import Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {WAREHOUSE as W} from '../content/mission03';
import {ensureAnimation} from './Raka';
import type {PolarizationModel} from '../physics/polarization';

export function createWarehouseArena(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  _live = false
) {
  const place = (key: string, x: number, y: number, depth = 3) => {
    const a = manifest.assets.find(asset => asset.key === key)!;
    return scene.add
      .image(x, y, key)
      .setOrigin(a.anchor.x, a.anchor.y)
      .setDepth(depth)
      .setName(key);
  };

  // Background layers
  place('m3-bg-wall', 320, 360, 0).setTint(0x60738b);
  place('m3-shelves', 320, 360, 1).setAlpha(0.18);
  place('m3-storage-layer',320,360,2).setAlpha(.85);
  place('m3-rear', 320, 360, 2).setAlpha(0.5);

  // Floor
  const floor = scene.physics.add.staticGroup();
  for (let i = 0; i < 20; i++) {
    const edge = i === 0 ? 'left' : i === 19 ? 'right' : 'middle';
    place(`m3-floor-${edge}`, i * 32 + 16, 336, 4);
  }
  const floorZone = scene.add.zone(320, W.floorY + 16, 640, 32);
  floor.add(floorZone);

  // Decorative crates & lamp
  place('m3-crate-stack', 50, 304, 4);
  place('m3-lamp', 340, 64, 3);
  place('m3-lamp', 160, 64, 3);

  // Overhead rails for source carriage (Y = 168)
  for (let i = 0; i < 12; i++) {
    const edge = i === 0 ? 'left' : i === 11 ? 'right' : 'middle';
    place(`m3-rail-${edge}`, 144 + i * 32 + 16, 168, 5);
  }

  // Collection tray and latches
  const tray = place('m3-tray', W.trayX, W.floorY, 5);
  const trayLatch = place('m3-tray-latch-open', W.trayX, W.floorY - 14, 6);
  const trayReady=place('m3-tray-ready',W.trayX,W.floorY+3,7).setVisible(false);
  const collectedPile=place('m3-paper-pile',W.trayX+28,W.floorY-5,7).setVisible(false);
  scene.add
    .text(W.trayX, W.floorY + 14, 'Baki Pengumpulan', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#39ddeb',
      backgroundColor: '#111e35'
    })
    .setOrigin(0.5, 0)
    .setDepth(15);

  // Exit door (initially closed)
  const exitDoor = place('m3-exit-closed', W.exitX, 304, 4);

  // Exit barrier static collider to block player until corridor cleared
  const exitBlocker = scene.add.zone(W.exitX - 16, 260, 24, 96);
  scene.physics.add.existing(exitBlocker, true);
  const blockerBody = exitBlocker.body as Phaser.Physics.Arcade.StaticBody;

  // Terminal
  place('m3-terminal', W.terminalX, 304, 6);

  // Demo sphere on stand
  place('m3-demo-stand', 80, 304, 5);
  const demoSphere = place('m3-demo-sphere', 80, 264, 7);
  const demoLabel = scene.add
    .text(80, 290, 'Logam Demo', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#9aafc3',
      backgroundColor: '#111e35'
    })
    .setOrigin(0.5, 0)
    .setDepth(15);

  // Mobile charge wand & carriage
  const carriage = place('m3-source-carriage', 340, 168, 8);
  const wand = place('m3-source-wand-long', 340, 168, 9);
  const grip = place('m3-slider-grip', 340, 160, 10);

  // Paper shreds
  const paperSprites: Phaser.GameObjects.Image[] = [];
  for (let i = 1; i <= W.paperCount; i++) {
    const v = ((i - 1) % 4) + 1;
    const sprite = place(`m3-paper-${v}`, 240 + i * 32, 312, 10);
    paperSprites.push(sprite);
  }

  // Scan wave effect
  const scan = place('m3-scan', 340, 248, 14).setVisible(false);

  // Animations: attract pulse & success flash
  ensureAnimation(scene, manifest, 'm3-attract-pulse');
  ensureAnimation(scene, manifest, 'm3-success-flash');
  const attractPulse = scene.add.sprite(340, 248, 'm3-attract-pulse').setVisible(false).setDepth(15);
  attractPulse.on('animationcomplete',()=>attractPulse.setVisible(false));let wasAttracted=false;
  const successFlash = scene.add.sprite(W.trayX, W.floorY - 14, 'm3-success-flash').setVisible(false).setDepth(16);
  successFlash.on('animationcomplete',()=>successFlash.setVisible(false));
  let wasClosed=false;

  // Measure/visual graphics overlay
  const overlay = scene.add.graphics().setDepth(12);

  // Text labels
  const wandLabel = scene.add
    .text(340, 208, 'Q: -3', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#39ddeb',
      backgroundColor: '#111e35',
      padding: { x: 3, y: 1 }
    })
    .setOrigin(0.5, 0)
    .setDepth(16);

  const statusLabel = scene.add
    .text(320, 18, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#edf5fa',
      backgroundColor: '#111e35',
      padding: { x: 4, y: 2 }
    })
    .setOrigin(0.5, 0)
    .setDepth(16);

  function render(model: PolarizationModel,reduced=false) {
    // Update carriage and wand position
    carriage.x = model.sourceX;
    wand.x = model.sourceX;
    grip.x = model.sourceX;
    const wandTipX = model.sourceX;
    const wandTipY = model.sourceY; // ~248
    const attracting=model.papers.some(p=>p.state==='attracted');if(attracting&&!wasAttracted&&!reduced)attractPulse.setPosition(wandTipX,wandTipY).setVisible(true).play('m3-attract-pulse');wasAttracted=attracting;

    // Wand charge label
    const q = model.sourceCharge;
    wandLabel.setPosition(wandTipX, 138);
    wandLabel.setText(q === 0 ? 'Wand: Netral (q=0)' : `Wand: ${q > 0 ? '+' : ''}${q}`);
    wandLabel.setColor(q > 0 ? '#ffbc55' : q < 0 ? '#39ddeb' : '#edf5fa');

    // Update paper positions & states
    for (let i = 0; i < model.papers.length; i++) {
      const p = model.papers[i];
      const sp = paperSprites[i];
      sp.setPosition(p.x, p.y);
      sp.setRotation(p.rotation);
      if (p.state === 'collected') {
        sp.setAlpha(0.9);
      } else if (p.state === 'attracted') {
        sp.setAlpha(1.0);
      } else {
        sp.setAlpha(0.85);
      }
    }

    // Update tray latch
    trayLatch.setTexture(model.trayLatchClosed ? 'm3-tray-latch-closed' : 'm3-tray-latch-open');
    trayReady.setVisible(model.trayLatchClosed);collectedPile.setVisible(model.collectedCount>0);
    if(model.trayLatchClosed&&!wasClosed&&!reduced)successFlash.setVisible(true).play('m3-success-flash');wasClosed=model.trayLatchClosed;

    // Update exit door and blocker
    const isCleared = model.phase === 'CLEARED';
    exitDoor.setTexture(isCleared ? 'm3-exit-open' : 'm3-exit-closed');
    blockerBody.enable = !isCleared;

    // Status header
    statusLabel.setPosition(320,104).setText(`Kertas: ${model.collectedCount}/${model.papers.length} · tanpa kontak`);

    // Graphics overlay (attraction lines & polarization indicators)
    overlay.clear();

    if (q !== 0) {
      for (const p of model.papers) {
        if (p.state === 'attracted') {
          // Draw dashed electric field attraction ray
          overlay.lineStyle(1, q > 0 ? 0xffbc55 : 0x39ddeb, 0.5);
          const dx=wandTipX-p.x,dy=wandTipY-p.y,d=Math.hypot(dx,dy)||1,ex=p.x+dx/d*10,ey=p.y+dy/d*10;
          overlay.lineBetween(p.x,p.y,ex,ey).lineBetween(ex,ey,ex-dx/d*4-dy/d*3,ey-dy/d*4+dx/d*3).lineBetween(ex,ey,ex-dx/d*4+dy/d*3,ey-dy/d*4-dx/d*3);
        }
      }

      // Demo sphere polarization visual (conduction electrons)
      if (model.demoSphere.polarization > 0.05) {
        const sign = model.demoSphere.dipoleSign;
        overlay.lineStyle(1, sign > 0 ? 0x39ddeb : 0xffbc55, model.demoSphere.polarization);
        // Draw polarized arc on demo sphere surface facing or opposing wand
        const dir = Math.sign(wandTipX - model.demoSphere.x);
        overlay.strokeCircle(model.demoSphere.x + dir * 6, model.demoSphere.y, 4);
      }
    }

    return {
      sourceX: model.sourceX,
      collectedCount: model.collectedCount,
      totalPapers: model.papers.length,
      isCleared
    };
  }

  const clearEffects = () => {
    scan.setVisible(false);
    if(attractPulse.anims)attractPulse.stop();attractPulse.setVisible(false);
    if(successFlash.anims)successFlash.stop();successFlash.setVisible(false);
    overlay.clear();
  };

  return {
    floor,
    exitBlocker,
    render,
    scan,
    attractPulse,
    successFlash,
    demoSphere,
    demoLabel,
    tray,
    exitDoor,
    clearEffects
  };
}
