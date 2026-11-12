import fs from 'node:fs';
import path from 'node:path';
import { PNG } from '../vendor/pngjs/lib/png.js';

process.chdir(path.resolve(import.meta.dirname, '../..'));
const source = 'assets-source/mission-04';
fs.mkdirSync(source, { recursive: true });
const records = [];

const C = {
  navy: [17, 30, 53],
  dark: [37, 57, 82],
  gray: [82, 103, 128],
  light: [154, 175, 195],
  white: [237, 245, 250],
  cyan: [57, 221, 235],
  amber: [255, 188, 85],
  red: [235, 80, 80],
  green: [107, 186, 154],
  yellow: [250, 230, 110],
  metal: [180, 195, 210],
  metalDark: [110, 130, 150],
  metalBright: [225, 240, 255],
  copper: [215, 125, 75],
  glass: [130, 210, 225],
  glassGlow: [190, 245, 255]
};

function canvas(w, h) {
  const p = new PNG({ width: w, height: h });
  p.data.fill(0);
  return p;
}

function rect(p, x, y, w, h, c, a = 255) {
  const col = C[c] || c;
  for (let j = Math.max(0, y); j < Math.min(p.height, y + h); j++) {
    for (let i = Math.max(0, x); i < Math.min(p.width, x + w); i++) {
      p.data.set([...col, a], (j * p.width + i) * 4);
    }
  }
}

function circle(p, cx, cy, r, c, a = 255) {
  const col = C[c] || c;
  const r2 = r * r;
  for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(p.height - 1, Math.ceil(cy + r)); y++) {
    for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(p.width - 1, Math.ceil(cx + r)); x++) {
      const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d2 <= r2) {
        p.data.set([...col, a], (y * p.width + x) * 4);
      }
    }
  }
}

function line(p, x, y, x2, y2, c = 'light', t = 2) {
  const n = Math.max(Math.abs(x2 - x), Math.abs(y2 - y));
  for (let i = 0; i <= n; i++) {
    rect(p, Math.round(x + ((x2 - x) * i) / (n || 1)), Math.round(y + ((y2 - y) * i) / (n || 1)), t, t, c);
  }
}

function box(p, x, y, w, h, c = 'gray') {
  rect(p, x, y, w, h, 'navy');
  rect(p, x + 2, y + 2, w - 4, h - 4, c);
  rect(p, x + 2, y + 2, w - 4, 2, 'light');
  rect(p, x + 2, y + h - 4, w - 4, 2, 'dark');
}

function save(key, group, p, usage, extra = {}) {
  const file = `assets/mission-04/${group}/${key}.png`;
  fs.mkdirSync(path.dirname('public/' + file), { recursive: true });
  fs.writeFileSync('public/' + file, PNG.sync.write(p));
  let clear = 0;
  for (let i = 3; i < p.data.length; i += 4) if (!p.data[i]) clear++;
  records.push({
    key,
    path: file,
    width: p.width,
    height: p.height,
    frameWidth: extra.frameWidth || p.width,
    frameHeight: extra.frameHeight || p.height,
    frames: extra.frames || 1,
    fps: extra.fps || 0,
    loop: extra.loop !== undefined ? extra.loop : false,
    anchor: extra.anchor || { x: 0.5, y: 1 },
    source: 'scripts/assets/mission-04.mjs',
    status: 'procedural',
    final: true,
    usage,
    alpha: { transparentPixels: clear },
    provenance: 'Original geometric modular pixel artwork for Mission 4 Induction Lab; state & charge signs rendered in code.',
    ...extra
  });
}

// -------------------------------------------------------------
// 1. ENVIRONMENT (640x360 backdrop, rear props, floor, bench, lamp)
// -------------------------------------------------------------
{
  // m4-bg-lab: cleanroom laboratory backdrop
  const bg = canvas(640, 360);
  // Deep navy tech gradient
  for (let y = 0; y < 360; y++) {
    const f = y / 360;
    const r = Math.round(15 + f * 18);
    const g = Math.round(24 + f * 26);
    const b = Math.round(42 + f * 34);
    rect(bg, 0, y, 640, 1, [r, g, b]);
  }
  // Architectural wall panel grid lines
  for (let x = 0; x < 640; x += 64) {
    line(bg, x, 0, x, 304, [28, 44, 68], 1);
  }
  for (let y = 0; y < 304; y += 48) {
    line(bg, 0, y, 640, y, [28, 44, 68], 1);
  }
  // Horizontal datum line
  rect(bg, 0, 140, 640, 4, [37, 57, 82]);
  rect(bg, 0, 141, 640, 2, [57, 221, 235], 80);
  save('m4-bg-lab', 'environment', bg, 'Induction cleanroom laboratory backdrop', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-rear-props: laboratory rear equipment (oscilloscopes, high voltage console)
  const rear = canvas(640, 360);
  // Equipment rack 1 at x=60..140
  box(rear, 60, 180, 80, 124, 'dark');
  rect(rear, 70, 195, 60, 35, 'navy');
  line(rear, 75, 212, 125, 212, 'cyan', 1);
  // Sine-wave on monitor
  for (let i = 0; i < 48; i++) {
    const wy = Math.round(212 + Math.sin(i * 0.4) * 10);
    rect(rear, 76 + i, wy, 2, 2, 'cyan');
  }
  // Dials & LEDs
  for (let i = 0; i < 4; i++) {
    circle(rear, 78 + i * 14, 250, 4, 'light');
    circle(rear, 78 + i * 14, 266, 2, i % 2 === 0 ? 'green' : 'amber');
  }

  // Equipment rack 2 at x=440..500
  box(rear, 440, 190, 64, 114, 'dark');
  rect(rear, 448, 204, 48, 40, 'navy');
  // High voltage warning symbol in monitor
  rect(rear, 468, 214, 8, 18, 'yellow');
  rect(rear, 470, 234, 4, 4, 'yellow');

  save('m4-rear-props', 'environment', rear, 'Induction laboratory scientific equipment backdrop', { anchor: { x: 0.5, y: 1 } });
}

{
  // Modular cleanroom floors (32x32)
  for (const edge of ['left', 'middle', 'right']) {
    const f = canvas(32, 32);
    rect(f, 0, 0, 32, 32, 'dark');
    rect(f, 0, 0, 32, 4, 'gray');
    rect(f, 0, 0, 32, 2, 'light');
    rect(f, 0, 4, 32, 28, 'navy');
    // Inner floor tile pattern
    rect(f, 2, 6, 28, 24, [24, 38, 62]);
    rect(f, 4, 8, 24, 2, 'dark');
    if (edge === 'left') rect(f, 0, 0, 4, 32, 'light');
    if (edge === 'right') rect(f, 28, 0, 4, 32, 'dark');
    save(`m4-floor-${edge}`, 'environment', f, `Modular cleanroom floor tile ${edge}`, { anchor: { x: 0.5, y: 1 } });
  }
}

{
  // m4-bench: 192x56 scientific experimentation bench
  const b = canvas(192, 56);
  // Legs
  box(b, 16, 16, 16, 40, 'dark');
  box(b, 160, 16, 16, 40, 'dark');
  // Crossbar
  box(b, 24, 36, 144, 8, 'dark');
  // Heavy tabletop with dielectric rubber pad
  box(b, 0, 0, 192, 16, 'gray');
  rect(b, 8, 2, 176, 4, 'cyan', 160);
  rect(b, 8, 6, 176, 6, [24, 40, 60]);
  save('m4-bench', 'environment', b, 'Experimentation laboratory workbench table', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-ceiling-lamp: 32x24 ceiling fixture
  const l = canvas(32, 24);
  rect(l, 8, 0, 16, 6, 'dark');
  rect(l, 4, 6, 24, 8, 'gray');
  rect(l, 6, 14, 20, 6, 'white');
  rect(l, 4, 20, 24, 4, 'cyan', 120);
  save('m4-ceiling-lamp', 'environment', l, 'Overhead cleanroom fluorescent lamp', { anchor: { x: 0.5, y: 0 } });
}

// -------------------------------------------------------------
// 2. CORE INTERACTIVE OBJECTS (Sphere, Stand, Rods, Slider, Wires, Switch, Ground, Sensor, Door, Terminal)
// -------------------------------------------------------------
{
  // m4-demo-sphere: 32x32 polished metal sphere
  const s = canvas(32, 32);
  circle(s, 16, 16, 15, 'navy');
  circle(s, 16, 16, 14, 'metalDark');
  circle(s, 15, 15, 12, 'metal');
  circle(s, 13, 13, 9, 'metalBright');
  circle(s, 10, 10, 4, 'white');
  save('m4-demo-sphere', 'puzzle', s, 'Conducting metal sphere for electrostatic induction', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // m4-demo-stand: 32x64 transparent insulating acrylic/glass stand with weighted base
  const st = canvas(32, 64);
  // Sphere mount cup at top
  box(st, 8, 0, 16, 8, 'dark');
  // Insulating glass column
  rect(st, 12, 8, 8, 44, 'navy');
  rect(st, 13, 8, 6, 44, 'glass');
  rect(st, 14, 8, 2, 44, 'glassGlow', 220);
  rect(st, 17, 8, 1, 44, 'white', 180);
  // Weighted base at bottom
  box(st, 2, 52, 28, 12, 'dark');
  rect(st, 4, 54, 24, 3, 'light');
  save('m4-demo-stand', 'puzzle', st, 'High-resistance dielectric insulator stand', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-source-slider: 180x16 horizontal slider guide rail
  const sl = canvas(180, 16);
  box(sl, 0, 4, 180, 8, 'dark');
  line(sl, 4, 8, 176, 8, 'light', 2);
  // Distance tick marks
  for (let x = 16; x < 180; x += 20) {
    rect(sl, x, 6, 2, 4, 'cyan');
  }
  save('m4-source-slider', 'puzzle', sl, 'Precision slider rail for induction source rod', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // m4-slider-grip: 16x20 slider carriage grip
  const g = canvas(16, 20);
  box(g, 2, 2, 12, 16, 'dark');
  rect(g, 4, 4, 8, 12, 'gray');
  rect(g, 6, 6, 4, 8, 'light');
  save('m4-slider-grip', 'puzzle', g, 'Slider positioning knob handle', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // Source rods: negative, positive, and neutral (64x24)
  for (const [sign, col] of [['neg', 'cyan'], ['pos', 'amber'], ['zero', 'gray']]) {
    const r = canvas(64, 24);
    // Insulated handle at right (x=40..64)
    box(r, 40, 6, 24, 12, 'dark');
    rect(r, 44, 8, 16, 8, [50, 40, 35]); // wood/rubber grip
    // Cylindrical rod body at left (x=0..40)
    box(r, 0, 7, 40, 10, 'navy');
    rect(r, 2, 9, 36, 6, col);
    rect(r, 2, 9, 36, 2, 'white', 160);
    // Charge indicator emitter tip at left edge (x=0..4)
    circle(r, 3, 12, 4, col);
    circle(r, 3, 12, 2, 'white');
    save(`m4-source-wand-${sign}`, 'puzzle', r, `Induction charged source rod (${sign})`, { anchor: { x: 0.5, y: 0.5 } });
  }
}

{
  // m4-ground-switch-open: 28x28 knife switch open
  const swOpen = canvas(28, 28);
  // Base
  box(swOpen, 2, 20, 24, 8, 'dark');
  circle(swOpen, 6, 20, 3, 'copper');
  circle(swOpen, 22, 20, 3, 'copper');
  // Open contact blade at angle 45 deg
  line(swOpen, 6, 20, 18, 6, 'copper', 3);
  circle(swOpen, 18, 6, 3, 'light');
  save('m4-ground-switch-open', 'puzzle', swOpen, 'Grounding knife switch in OPEN (disconnected) state', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-ground-switch-closed: 28x28 knife switch closed
  const swClosed = canvas(28, 28);
  box(swClosed, 2, 20, 24, 8, 'dark');
  circle(swClosed, 6, 20, 3, 'copper');
  circle(swClosed, 22, 20, 3, 'copper');
  // Closed horizontal blade
  line(swClosed, 6, 18, 22, 18, 'copper', 3);
  line(swClosed, 6, 18, 22, 18, 'cyan', 1); // current glow
  save('m4-ground-switch-closed', 'puzzle', swClosed, 'Grounding knife switch in CLOSED (grounded) state', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-earth-symbol: 24x24 standard ground symbol
  const e = canvas(24, 24);
  line(e, 12, 0, 12, 8, 'copper', 2);
  line(e, 2, 8, 22, 8, 'copper', 3);
  line(e, 6, 13, 18, 13, 'copper', 3);
  line(e, 9, 18, 15, 18, 'copper', 3);
  save('m4-earth-symbol', 'puzzle', e, 'Standard earth ground reference symbol', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // m4-charge-sensor: 48x72 active electrometer door controller station
  const cs = canvas(48, 72);
  box(cs, 0, 16, 48, 56, 'dark');
  // Digital display meter window
  rect(cs, 6, 22, 36, 22, 'navy');
  rect(cs, 8, 24, 32, 18, [15, 25, 40]);
  line(cs, 10, 33, 38, 33, 'gray', 1);
  // Status indicator lights
  circle(cs, 12, 54, 4, 'green');
  circle(cs, 24, 54, 4, 'amber');
  circle(cs, 36, 54, 4, 'red');
  // Top antenna sensing probe
  box(cs, 18, 0, 12, 16, 'gray');
  circle(cs, 24, 4, 5, 'cyan');
  save('m4-charge-sensor', 'puzzle', cs, 'Active electrometer door sensor station', { anchor: { x: 0.5, y: 1 } });
}

{
  // Doors: closed and open (64x96)
  const dClosed = canvas(64, 96);
  box(dClosed, 0, 0, 64, 96, 'dark');
  // Reinforced door panels
  box(dClosed, 6, 8, 52, 36, 'gray');
  box(dClosed, 6, 48, 52, 40, 'gray');
  // Motor mechanism and locked status light
  rect(dClosed, 26, 2, 12, 4, 'navy');
  circle(dClosed, 32, 44, 4, 'red');
  save('m4-door-closed', 'environment', dClosed, 'Sealed laboratory exit door (locked)', { anchor: { x: 0.5, y: 1 } });

  const dOpen = canvas(64, 96);
  box(dOpen, 0, 0, 64, 96, 'navy');
  // Illuminated interior corridor
  rect(dOpen, 8, 4, 48, 92, [45, 85, 120]);
  rect(dOpen, 12, 8, 40, 88, 'cyan', 120);
  rect(dOpen, 16, 12, 32, 84, 'white', 80);
  // Retracted door slabs at edges
  rect(dOpen, 0, 0, 8, 96, 'gray');
  rect(dOpen, 56, 0, 8, 96, 'gray');
  circle(dOpen, 32, 8, 4, 'green');
  save('m4-door-open', 'environment', dOpen, 'Retracted laboratory exit door (open and accessible)', { anchor: { x: 0.5, y: 1 } });
}

{
  // m4-terminal: 32x48 induction control console
  const t = canvas(32, 48);
  box(t, 0, 12, 32, 36, 'dark');
  rect(t, 4, 16, 24, 18, 'navy');
  rect(t, 6, 18, 20, 14, [25, 45, 75]);
  // Terminal keyboard / controls
  rect(t, 4, 38, 24, 6, 'gray');
  for (let i = 0; i < 4; i++) circle(t, 7 + i * 6, 41, 1, 'cyan');
  save('m4-terminal', 'puzzle', t, 'Induction experiment control terminal console', { anchor: { x: 0.5, y: 1 } });
}

// -------------------------------------------------------------
// 3. CHARGE DISTRIBUTION VISUALS (Microscope Panels, Sphere States)
// -------------------------------------------------------------
{
  // m4-dist-frame: 96x96 microscopic analysis frame
  const f = canvas(96, 96);
  box(f, 0, 0, 96, 96, 'dark');
  rect(f, 4, 4, 88, 88, 'navy');
  rect(f, 6, 6, 84, 84, [15, 26, 45]);
  save('m4-dist-frame', 'ui', f, 'Microscopic charge redistribution inspector frame', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // Sphere microscopic distribution states (80x80)
  // 1. Neutral (uniform balanced electrons and ions)
  const spNeu = canvas(80, 80);
  circle(spNeu, 40, 40, 36, 'metalDark');
  circle(spNeu, 40, 40, 34, 'navy');
  // Uniform distributed +/- symbols
  const syms = [
    [26, 26, 'amber', '+'], [54, 26, 'cyan', '-'],
    [40, 34, 'amber', '+'], [28, 46, 'cyan', '-'],
    [52, 46, 'amber', '+'], [40, 56, 'cyan', '-']
  ];
  for (const [x, y, col, type] of syms) {
    if (type === '+') {
      rect(spNeu, x - 3, y - 1, 6, 2, col);
      rect(spNeu, x - 1, y - 3, 2, 6, col);
    } else {
      rect(spNeu, x - 3, y - 1, 6, 2, col);
    }
  }
  save('m4-sphere-neutral', 'ui', spNeu, 'Metal sphere neutral uniform charge distribution', { anchor: { x: 0.5, y: 0.5 } });

  // 2. Polarized by negative source at left (electrons repelled to right side)
  const spPolNeg = canvas(80, 80);
  circle(spPolNeg, 40, 40, 36, 'metalDark');
  circle(spPolNeg, 40, 40, 34, 'navy');
  // Positive (+) ions exposed on left side (x=16..36)
  for (const [x, y] of [[24, 28], [22, 40], [26, 52], [34, 34], [34, 46]]) {
    rect(spPolNeg, x - 3, y - 1, 6, 2, 'amber');
    rect(spPolNeg, x - 1, y - 3, 2, 6, 'amber');
  }
  // Free electrons (-) accumulated on right side (x=46..64)
  for (const [x, y] of [[52, 26], [58, 36], [54, 44], [60, 48], [50, 54]]) {
    rect(spPolNeg, x - 3, y - 1, 6, 2, 'cyan');
  }
  save('m4-sphere-polar-neg', 'ui', spPolNeg, 'Sphere polarized: electrons repelled to right by negative source', { anchor: { x: 0.5, y: 0.5 } });

  // 3. Polarized by positive source at left (electrons attracted to left side)
  const spPolPos = canvas(80, 80);
  circle(spPolPos, 40, 40, 36, 'metalDark');
  circle(spPolPos, 40, 40, 34, 'navy');
  // Free electrons (-) attracted to left side (x=16..36)
  for (const [x, y] of [[22, 28], [20, 40], [24, 52], [32, 34], [32, 46]]) {
    rect(spPolPos, x - 3, y - 1, 6, 2, 'cyan');
  }
  // Positive (+) deficit on right side (x=46..64)
  for (const [x, y] of [[54, 26], [60, 36], [56, 44], [62, 48], [52, 54]]) {
    rect(spPolPos, x - 3, y - 1, 6, 2, 'amber');
    rect(spPolPos, x - 1, y - 3, 2, 6, 'amber');
  }
  save('m4-sphere-polar-pos', 'ui', spPolPos, 'Sphere polarized: electrons attracted to left by positive source', { anchor: { x: 0.5, y: 0.5 } });

  // 4. Net positive charged sphere (electron deficit across whole sphere)
  const spPosNet = canvas(80, 80);
  circle(spPosNet, 40, 40, 36, 'amber');
  circle(spPosNet, 40, 40, 34, 'navy');
  for (const [x, y] of [[26, 28], [54, 28], [40, 40], [26, 52], [54, 52], [40, 24], [40, 56]]) {
    rect(spPosNet, x - 3, y - 1, 6, 2, 'amber');
    rect(spPosNet, x - 1, y - 3, 2, 6, 'amber');
  }
  save('m4-sphere-pos-net', 'ui', spPosNet, 'Conducting sphere retaining net positive charge', { anchor: { x: 0.5, y: 0.5 } });

  // 5. Net negative charged sphere (excess electrons across whole sphere)
  const spNegNet = canvas(80, 80);
  circle(spNegNet, 40, 40, 36, 'cyan');
  circle(spNegNet, 40, 40, 34, 'navy');
  for (const [x, y] of [[26, 28], [54, 28], [40, 40], [26, 52], [54, 52], [40, 24], [40, 56]]) {
    rect(spNegNet, x - 3, y - 1, 6, 2, 'cyan');
  }
  save('m4-sphere-neg-net', 'ui', spNegNet, 'Conducting sphere retaining net negative charge', { anchor: { x: 0.5, y: 0.5 } });
}

// -------------------------------------------------------------
// 4. UI ACTION ICONS (24x24)
// -------------------------------------------------------------
{
  const icons = [
    ['m4-icon-approach', 'cyan', p => {
      // Arrow pointing right toward circle
      line(p, 3, 12, 13, 12, 'cyan', 2);
      line(p, 10, 8, 14, 12, 'cyan', 2);
      line(p, 10, 16, 14, 12, 'cyan', 2);
      circle(p, 19, 12, 4, 'metal');
    }],
    ['m4-icon-retract', 'cyan', p => {
      // Arrow pointing left away from circle
      line(p, 14, 12, 4, 12, 'cyan', 2);
      line(p, 7, 8, 3, 12, 'cyan', 2);
      line(p, 7, 16, 3, 12, 'cyan', 2);
      circle(p, 19, 12, 4, 'metal');
    }],
    ['m4-icon-ground-on', 'copper', p => {
      line(p, 4, 12, 20, 12, 'copper', 2);
      line(p, 12, 12, 12, 17, 'copper', 2);
      line(p, 8, 17, 16, 17, 'copper', 2);
      line(p, 10, 20, 14, 20, 'copper', 2);
    }],
    ['m4-icon-ground-off', 'gray', p => {
      line(p, 4, 16, 12, 8, 'copper', 2);
      line(p, 12, 16, 20, 16, 'copper', 2);
      line(p, 16, 16, 16, 20, 'gray', 2);
    }],
    ['m4-icon-measure', 'white', p => {
      box(p, 2, 4, 20, 16, 'dark');
      line(p, 6, 16, 18, 16, 'light', 1);
      line(p, 12, 16, 16, 8, 'amber', 2); // needle
    }],
    ['m4-icon-sensor', 'green', p => {
      box(p, 3, 3, 18, 18, 'dark');
      // checkmark
      line(p, 6, 12, 10, 16, 'green', 2);
      line(p, 10, 16, 17, 8, 'green', 2);
    }],
    ['m4-icon-reset', 'amber', p => {
      // circular reload arrow
      line(p, 6, 12, 18, 12, 'amber', 2);
      line(p, 14, 8, 18, 12, 'amber', 2);
      line(p, 14, 16, 18, 12, 'amber', 2);
    }],
    ['m4-icon-help', 'white', p => {
      line(p, 8, 6, 16, 6, 'white', 2);
      line(p, 16, 6, 16, 11, 'white', 2);
      line(p, 12, 11, 16, 11, 'white', 2);
      line(p, 12, 11, 12, 15, 'white', 2);
      rect(p, 11, 18, 2, 2, 'white');
    }]
  ];

  for (const [key, _accent, draw] of icons) {
    const ic = canvas(24, 24);
    box(ic, 0, 0, 24, 24, 'dark');
    draw(ic);
    save(key, 'ui', ic, `Induction action icon: ${key}`, { anchor: { x: 0.5, y: 0.5 } });
  }
}

// -------------------------------------------------------------
// 5. VFX & ANIMATIONS (Scan wave, electron flow, sensor flash)
// -------------------------------------------------------------
{
  // m4-scan: 32x32 scan wave ring
  const sc = canvas(32, 32);
  circle(sc, 16, 16, 14, 'cyan', 180);
  circle(sc, 16, 16, 12, [0, 0, 0], 0);
  save('m4-scan', 'vfx', sc, 'Induction electrometer pulse scan effect', { anchor: { x: 0.5, y: 0.5 } });
}

{
  // m4-electron-flow: 3 frames (32x16 each, total 96x16, 8 FPS)
  const ef = canvas(96, 16);
  for (let f = 0; f < 3; f++) {
    const ox = f * 32;
    // Ground wire line
    rect(ef, ox, 7, 32, 2, 'copper');
    // Moving cyan electrons with trail
    for (let i = 0; i < 2; i++) {
      const px = ox + ((f * 10 + i * 16) % 32);
      circle(ef, px, 8, 3, 'cyan');
      circle(ef, px, 8, 1, 'white');
    }
  }
  save('m4-electron-flow', 'vfx', ef, 'Electron flow along grounding wire animation', {
    frameWidth: 32,
    frameHeight: 16,
    frames: 3,
    fps: 8,
    loop: true,
    anchor: { x: 0.5, y: 0.5 }
  });
}

{
  // m4-sensor-pass: 3 frames (32x32 each, total 96x32, 8 FPS)
  const sp = canvas(96, 32);
  for (let f = 0; f < 3; f++) {
    const ox = f * 32;
    circle(sp, ox + 16, 16, 6 + f * 4, 'green', 220 - f * 60);
    circle(sp, ox + 16, 16, 4, 'white');
  }
  save('m4-sensor-pass', 'vfx', sp, 'Sensor verification success indicator animation', {
    frameWidth: 32,
    frameHeight: 32,
    frames: 3,
    fps: 8,
    loop: false,
    anchor: { x: 0.5, y: 0.5 }
  });
}

// -------------------------------------------------------------
// Synchronize and write manifest & production record
// -------------------------------------------------------------
const manifest = JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json', 'utf8'));
manifest.assets = manifest.assets.filter(a => !records.some(r => r.key === a.key)).concat(records);
fs.writeFileSync('docs/ASSET_MANIFEST.json', JSON.stringify(manifest, null, 2));
fs.copyFileSync('docs/ASSET_MANIFEST.json', 'public/asset-manifest.json');
fs.writeFileSync(`${source}/production.json`, JSON.stringify({ source: 'scripts/assets/mission-04.mjs', assets: records }, null, 2));

console.log(`Mission 04: ${records.length} final separate assets generated; ${manifest.assets.length} total manifest entries.`);
