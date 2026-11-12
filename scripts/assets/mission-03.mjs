import fs from 'node:fs';
import path from 'node:path';
import { PNG } from '../vendor/pngjs/lib/png.js';

process.chdir(path.resolve(import.meta.dirname, '../..'));
const source = 'assets-source/mission-03';
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
  paper: [245, 245, 235],
  paperDark: [210, 210, 195]
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

function line(p, x, y, x2, y2, c = 'light', t = 2) {
  const n = Math.max(Math.abs(x2 - x), Math.abs(y2 - y));
  for (let i = 0; i <= n; i++) {
    rect(p, Math.round(x + (x2 - x) * i / (n || 1)), Math.round(y + (y2 - y) * i / (n || 1)), t, t, c);
  }
}

function box(p, x, y, w, h, c = 'gray') {
  rect(p, x, y, w, h, 'navy');
  rect(p, x + 2, y + 2, w - 4, h - 4, c);
  rect(p, x + 2, y + 2, w - 4, 2, 'light');
  rect(p, x + 2, y + h - 4, w - 4, 2, 'dark');
}

function save(key, group, p, usage, extra = {}) {
  const file = `assets/mission-03/${group}/${key}.png`;
  fs.mkdirSync(path.dirname('public/' + file), { recursive: true });
  fs.writeFileSync('public/' + file, PNG.sync.write(p));
  let clear = 0;
  for (let i = 3; i < p.data.length; i += 4) if (!p.data[i]) clear++;
  records.push({
    key,
    path: file,
    width: p.width,
    height: p.height,
    frameWidth: p.width,
    frameHeight: p.height,
    frames: 1,
    fps: 0,
    loop: false,
    anchor: { x: 0.5, y: 1 },
    source: 'scripts/assets/mission-03.mjs',
    status: 'procedural',
    final: true,
    usage,
    alpha: { transparentPixels: clear },
    provenance: 'Original geometric modular pixel artwork for Mission 3 Polarization Warehouse; signs/numbers rendered in code.',
    ...extra
  });
}

// 1. Warehouse background from master raster
const masterPath = `${source}/m3-warehouse-master.png`;
if (fs.existsSync(masterPath)) {
  const raw = PNG.sync.read(fs.readFileSync(masterPath));
  const bg = canvas(640, 360);
  for (let y = 0; y < 360; y++) {
    for (let x = 0; x < 640; x++) {
      const sx = Math.min(raw.width - 1, Math.floor((x + 0.5) * raw.width / 640));
      const sy = Math.min(raw.height - 1, Math.floor((y + 0.5) * raw.height / 360));
      const i = (sy * raw.width + sx) * 4;
      bg.data.set(raw.data.subarray(i, i + 4), (y * 640 + x) * 4);
    }
  }
  save('m3-bg-wall', 'environment', bg, 'Generated warehouse backdrop layer', {
    source: masterPath,
    status: 'generated',
    provenance: 'Built-in image_gen in this task; master normalized to 640x360 nearest-neighbor.'
  });
} else {
  const bg = canvas(640, 360);
  rect(bg, 0, 0, 640, 360, 'navy');
  for (let y = 0; y < 300; y += 24) {
    line(bg, 0, y, 640, y, 'dark', 1);
  }
  save('m3-bg-wall', 'environment', bg, 'Fallback warehouse wall backdrop');
}

// 2. Shelves and industrial rear layers
let p = canvas(640, 360);
// Shelf uprights and horizontal racks
for (const x of [60, 160, 260, 480, 560]) {
  rect(p, x, 60, 8, 260, 'dark');
  rect(p, x + 2, 60, 4, 260, 'gray');
}
for (const y of [110, 170, 230, 280]) {
  rect(p, 40, y, 260, 6, 'dark');
  rect(p, 40, y + 1, 260, 2, 'light');
  rect(p, 460, y, 140, 6, 'dark');
  rect(p, 460, y + 1, 140, 2, 'light');
}
// Crates on shelves
for (const [cx, cy, cw, ch] of [[75, 78, 30, 32], [115, 82, 36, 28], [175, 138, 40, 32], [80, 198, 45, 32], [500, 138, 38, 32], [505, 198, 40, 32]]) {
  box(p, cx, cy, cw, ch, 'gray');
  rect(p, cx + 4, cy + 4, cw - 8, ch - 8, 'dark');
}
save('m3-shelves', 'environment', p, 'Warehouse industrial shelving layer');

// 3. Overhead rear decor (pipes, conduit, hanging lamps)
p = canvas(640, 360);
rect(p, 0, 32, 640, 6, 'dark');
rect(p, 0, 34, 640, 2, 'light');
for (const lx of [120, 320, 520]) {
  line(p, lx, 38, lx, 65, 'gray', 2);
  rect(p, lx - 10, 65, 20, 8, 'dark');
  rect(p, lx - 8, 73, 16, 4, 'yellow', 180);
}
save('m3-rear', 'environment', p, 'Warehouse rear conduit and overhead lamps');

// 4. Modular floor tiles
for (const edge of ['left', 'middle', 'right']) {
  p = canvas(32, 32);
  box(p, 0, 0, 32, 32, 'dark');
  rect(p, 0, 0, 32, 4, 'light');
  rect(p, 4, 8, 24, 2, 'gray');
  rect(p, 0, 28, 32, 4, 'navy');
  if (edge === 'left') rect(p, 0, 0, 4, 32, 'amber');
  if (edge === 'right') rect(p, 28, 0, 4, 32, 'amber');
  save(`m3-floor-${edge}`, 'environment', p, `Modular warehouse floor tile ${edge}`);
}

// 5. Stack of warehouse crates
p = canvas(48, 48);
box(p, 0, 16, 32, 32, 'gray');
line(p, 2, 18, 30, 46, 'dark', 2);
line(p, 30, 18, 2, 46, 'dark', 2);
box(p, 20, 0, 28, 24, 'dark');
line(p, 22, 2, 46, 22, 'gray', 2);
save('m3-crate-stack', 'environment', p, 'Decorative stacked warehouse storage crates');

// 6. Wall industrial lamp
p = canvas(32, 64);
rect(p, 14, 0, 4, 40, 'gray');
box(p, 6, 40, 20, 12, 'dark');
rect(p, 10, 52, 12, 6, 'amber', 220);
save('m3-lamp', 'environment', p, 'Overhead warehouse industrial work light');

// 7. Paper Collection Tray & Mechanical Latches
p = canvas(128, 24);
box(p, 0, 4, 128, 20, 'dark');
rect(p, 2, 6, 124, 4, 'cyan');
rect(p, 0, 0, 8, 24, 'light'); // Left retaining lip
rect(p, 120, 0, 8, 24, 'light'); // Right retaining lip
for (let x = 16; x < 120; x += 16) {
  rect(p, x, 14, 8, 2, 'navy');
}
save('m3-tray', 'puzzle', p, 'Paper collection tray with mechanical retaining lips');

for (const state of ['open', 'closed']) {
  p = canvas(24, 24);
  box(p, 2, 2, 20, 20, 'dark');
  if (state === 'closed') {
    rect(p, 6, 10, 12, 4, 'amber');
    rect(p, 10, 6, 4, 12, 'amber');
  } else {
    rect(p, 6, 6, 12, 4, 'green');
    line(p, 6, 14, 18, 14, 'green', 2);
  }
  save(`m3-tray-latch-${state}`, 'puzzle', p, `Mechanical tray latch (${state})`);
}

// 8. Variations of Paper Shreds (Insulator debris)
const paperColors = ['paper', 'white', 'paperDark'];
for (let i = 1; i <= 4; i++) {
  p = canvas(16, 16);
  if (i === 1) {
    // Angular shred
    rect(p, 3, 4, 8, 6, paperColors[0]);
    rect(p, 7, 7, 6, 5, paperColors[1]);
    line(p, 4, 5, 10, 9, 'gray', 1);
  } else if (i === 2) {
    // Curved/folded shred
    rect(p, 4, 3, 9, 7, paperColors[1]);
    rect(p, 2, 7, 5, 6, paperColors[2]);
    line(p, 5, 4, 11, 8, 'light', 1);
  } else if (i === 3) {
    // Slanted long shred
    rect(p, 2, 5, 11, 4, paperColors[0]);
    rect(p, 6, 8, 7, 4, paperColors[2]);
    line(p, 3, 6, 12, 9, 'gray', 1);
  } else {
    // Irregular triangular shred
    rect(p, 5, 2, 6, 10, paperColors[1]);
    rect(p, 2, 7, 6, 6, paperColors[0]);
    line(p, 6, 4, 8, 11, 'dark', 1);
  }
  save(`m3-paper-${i}`, 'puzzle', p, `Paper shred variation ${i}`, { anchor: { x: 0.5, y: 0.5 } });
}

p = canvas(32, 16);
for (const [x, y, w, h] of [[2, 6, 10, 8], [9, 3, 12, 9], [18, 5, 12, 7]]) {
  rect(p, x, y, w, h, 'paper');
  rect(p, x + 1, y + 1, w - 2, h - 2, 'white');
}
save('m3-paper-pile', 'puzzle', p, 'Small collected pile of paper shreds');

// 9. Demonstration Metal Sphere on Insulator Stand
p = canvas(16, 40);
box(p, 4, 0, 8, 40, 'dark');
for (let y = 4; y < 32; y += 7) {
  rect(p, 0, y, 16, 4, 'light');
  rect(p, 2, y + 3, 12, 2, 'gray');
}
save('m3-demo-stand', 'puzzle', p, 'Insulating stand for demo metal sphere');

p = canvas(32, 32);
for (let y = 0; y < 32; y++) {
  for (let x = 0; x < 32; x++) {
    const d = Math.hypot(x - 15.5, y - 15.5);
    if (d < 15) {
      rect(p, x, y, 1, 1, d > 12 ? 'navy' : x + y < 24 ? 'light' : x + y < 38 ? 'gray' : 'dark');
    }
  }
}
rect(p, 8, 7, 6, 3, 'white');
save('m3-demo-sphere', 'puzzle', p, 'Demonstration conducting metal sphere', { anchor: { x: 0.5, y: 0.5 } });

// 10. Mobile Charge Wand & Overhead Carriage
p = canvas(48, 20);
box(p, 4, 2, 40, 16, 'dark');
rect(p, 8, 4, 32, 3, 'cyan');
rect(p, 16, 12, 16, 6, 'navy');
box(p, 8, 0, 8, 4, 'light');
box(p, 32, 0, 8, 4, 'light');
save('m3-source-carriage', 'puzzle', p, 'Carriage supporting the charged polarization source');

p = canvas(20, 52);
// Insulating rod top
rect(p, 8, 0, 4, 24, 'amber');
rect(p, 6, 4, 8, 4, 'dark');
// Active charged wand head
box(p, 2, 24, 16, 26, 'navy');
rect(p, 4, 26, 12, 22, 'cyan');
rect(p, 6, 28, 8, 18, 'white');
save('m3-source-wand', 'puzzle', p, 'Charged wand head with insulating handle', { anchor: { x: 0.5, y: 0 } });

// Overhead track rails
for (const edge of ['left', 'middle', 'right']) {
  p = canvas(32, 12);
  box(p, 0, 0, 32, 12, 'dark');
  rect(p, 0, 2, 32, 2, 'light');
  rect(p, 0, 7, 32, 3, 'gray');
  if (edge === 'left') rect(p, 0, 0, 4, 12, 'amber');
  if (edge === 'right') rect(p, 28, 0, 4, 12, 'amber');
  save(`m3-rail-${edge}`, 'puzzle', p, `Overhead track rail ${edge}`);
}

p = canvas(24, 24);
box(p, 2, 2, 20, 20, 'dark');
for (const x of [7, 11, 15]) rect(p, x, 6, 2, 12, 'cyan');
save('m3-slider-grip', 'puzzle', p, 'Wand slider handle grip', { anchor: { x: 0.5, y: 0.5 } });

// 11. Control Terminal & Warehouse Exit Shutter Door
p = canvas(40, 64);
box(p, 0, 0, 40, 64, 'dark');
box(p, 4, 6, 32, 28, 'navy');
rect(p, 8, 10, 24, 3, 'cyan');
rect(p, 8, 16, 20, 2, 'light');
rect(p, 8, 42, 10, 10, 'amber');
rect(p, 22, 42, 10, 10, 'cyan');
save('m3-terminal', 'puzzle', p, 'Warehouse terminal for polarization experiment');

for (const state of ['closed', 'open']) {
  p = canvas(48, 96);
  box(p, 2, 0, 44, 96, 'dark');
  if (state === 'closed') {
    for (let y = 12; y < 88; y += 8) {
      rect(p, 6, y, 36, 4, 'navy');
      rect(p, 6, y, 36, 1, 'light');
    }
    line(p, 16, 32, 32, 48, 'amber', 3);
    line(p, 32, 48, 16, 64, 'amber', 3);
  } else {
    // Open shutter with glowing cyan passage
    rect(p, 6, 12, 36, 80, 'navy');
    rect(p, 12, 18, 24, 74, 'cyan', 180);
    rect(p, 6, 12, 36, 14, 'dark'); // Rolled-up slats
    line(p, 18, 50, 30, 50, 'white', 2);
    line(p, 24, 44, 30, 50, 'white', 2);
    line(p, 24, 56, 30, 50, 'white', 2);
  }
  save(`m3-exit-${state}`, 'puzzle', p, `Warehouse exit shutter door (${state})`);
}

// 12. Microscopic Charge Distribution Views (Conductor vs Insulator)
p = canvas(32, 32);
box(p, 1, 1, 30, 30, 'navy');
rect(p, 3, 3, 26, 2, 'cyan');
rect(p, 3, 27, 26, 2, 'gray');
save('m3-zoom-frame', 'ui', p, 'Microscopic charge inspection panel frame', {
  nineSlice: { top: 8, right: 8, bottom: 8, left: 8 }
});

// Insulator Paper: Dipoles (Bound charges)
// Neutral: random or symmetric zero dipole moment
p = canvas(48, 32);
box(p, 0, 0, 48, 32, 'navy');
// 6 molecular dipoles
const dipolePositions = [
  [8, 8], [24, 8], [40, 8],
  [8, 24], [24, 24], [40, 24]
];
for (const [x, y] of dipolePositions) {
  rect(p, x - 4, y - 4, 4, 8, 'amber'); // +
  rect(p, x, y - 4, 4, 8, 'cyan'); // -
}
save('m3-dipole-neutral', 'ui', p, 'Insulator (paper) unpolarized bound dipoles');

// Polarized: Dipoles aligned with field (e.g., negative source on left pushes - right, pulls + left)
p = canvas(48, 32);
box(p, 0, 0, 48, 32, 'navy');
for (const [x, y] of dipolePositions) {
  rect(p, x - 5, y - 4, 5, 8, 'amber'); // + induced close to source
  rect(p, x, y - 4, 5, 8, 'cyan'); // - induced farther away
  line(p, x - 5, y, x + 5, y, 'white', 1);
}
save('m3-dipole-polarized', 'ui', p, 'Insulator (paper) polarized aligned dipoles');

// Metal Conductor: Free conduction electrons
// Neutral: uniform electron sea around positive atomic cores
p = canvas(48, 32);
box(p, 0, 0, 48, 32, 'navy');
for (let x = 8; x < 48; x += 12) {
  for (let y = 8; y < 32; y += 12) {
    rect(p, x, y, 4, 4, 'amber'); // positive core
    rect(p, x + 2, y + 2, 2, 2, 'cyan'); // free electron sea
  }
}
save('m3-metal-neutral', 'ui', p, 'Metal conductor uniform electron sea');

// Polarized metal: electrons shifted completely across conductor
p = canvas(48, 32);
box(p, 0, 0, 48, 32, 'navy');
for (let x = 8; x < 48; x += 12) {
  for (let y = 8; y < 32; y += 12) {
    rect(p, x, y, 4, 4, 'amber'); // fixed positive lattice cores
  }
}
// Conduction electrons accumulated on right surface
for (let y = 4; y < 28; y += 4) {
  rect(p, 42, y, 3, 3, 'cyan');
  rect(p, 36, y + 1, 2, 2, 'cyan');
}
save('m3-metal-polarized', 'ui', p, 'Metal conductor redistributed free electrons');

// 13. UI Icons (24x24)
for (const name of ['observe', 'polarize', 'collect', 'reset', 'help', 'wand']) {
  p = canvas(24, 24);
  if (name === 'observe') {
    // Eye / lens
    line(p, 3, 12, 12, 5, 'cyan');
    line(p, 12, 5, 21, 12, 'cyan');
    line(p, 3, 12, 12, 19, 'cyan');
    line(p, 12, 19, 21, 12, 'cyan');
    rect(p, 10, 10, 4, 4, 'amber');
  } else if (name === 'polarize') {
    // Two opposite charge halves
    rect(p, 4, 6, 8, 12, 'amber');
    rect(p, 12, 6, 8, 12, 'cyan');
    line(p, 12, 4, 12, 20, 'white', 1);
  } else if (name === 'collect') {
    // Tray with downward arrow
    box(p, 3, 14, 18, 6, 'dark');
    line(p, 12, 3, 12, 12, 'cyan', 2);
    line(p, 8, 8, 12, 12, 'cyan', 2);
    line(p, 16, 8, 12, 12, 'cyan', 2);
  } else if (name === 'reset') {
    line(p, 5, 5, 18, 5);
    line(p, 18, 5, 18, 19);
    line(p, 18, 19, 5, 19);
    line(p, 5, 19, 5, 9, 'cyan');
    line(p, 5, 5, 9, 2, 'amber');
  } else if (name === 'help') {
    line(p, 7, 7, 16, 7, 'cyan');
    line(p, 16, 7, 16, 12, 'cyan');
    line(p, 12, 12, 12, 15, 'cyan');
    rect(p, 11, 18, 3, 3, 'amber');
  } else if (name === 'wand') {
    line(p, 4, 20, 14, 10, 'amber', 3);
    rect(p, 14, 4, 6, 6, 'cyan');
  }
  save(`m3-icon-${name}`, 'ui', p, `Mission 3 icon ${name}`, { anchor: { x: 0.5, y: 0.5 } });
}

// 14. VFX: Scan Circle, Attraction Field, Success Flash
p = canvas(64, 64);
for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 64; x++) {
    const d = Math.hypot(x - 31.5, y - 31.5);
    if (d > 26 && d < 29) rect(p, x, y, 1, 1, 'cyan', 180);
    if (d > 16 && d < 18) rect(p, x, y, 1, 1, 'amber', 140);
  }
}
save('m3-scan', 'vfx', p, 'Polarization scan field pulse', { anchor: { x: 0.5, y: 0.5 } });

p = canvas(72, 24);
for (let f = 0; f < 3; f++) {
  for (const [x, y] of [
    [12 - 3 - f * 3, 12],
    [12 + 3 + f * 3, 12],
    [12, 12 - 3 - f * 3],
    [12, 12 + 3 + f * 3]
  ]) {
    rect(p, f * 24 + x, y, 2, 2, f === 2 ? 'white' : 'cyan');
  }
}
save('m3-attract-pulse', 'vfx', p, 'Attraction field pulse animation', {
  frameWidth: 24,
  frames: 3,
  fps: 10,
  loop: false,
  anchor: { x: 0.5, y: 0.5 }
});

p = canvas(72, 24);
for (let f = 0; f < 3; f++) {
  for (const [x, y] of [
    [12 - 4 - f * 2, 12],
    [12 + 4 + f * 2, 12],
    [12, 12 - 4 - f * 2],
    [12, 12 + 4 + f * 2]
  ]) {
    rect(p, f * 24 + x, y, 3, 3, f === 2 ? 'green' : 'amber');
  }
}
save('m3-success-flash', 'vfx', p, 'Paper collection completion flash effect', {
  frameWidth: 24,
  frames: 3,
  fps: 10,
  loop: false,
  anchor: { x: 0.5, y: 0.5 }
});

// 15. Celebration artwork for the Mission 3 completion page
p = canvas(640, 240);
for (const x of [44, 76, 564, 596]) {
  rect(p, x, 38, 6, 148, 'dark');
  rect(p, x + 2, 38, 2, 148, 'gray');
}
for (const y of [62, 92, 122]) {
  rect(p, 32, y, 174, 4, 'dark');
  rect(p, 32, y + 1, 174, 1, 'light');
  rect(p, 446, y, 162, 4, 'dark');
  rect(p, 446, y + 1, 162, 1, 'light');
}
box(p, 438, 28, 132, 160, 'gray');
rect(p, 448, 40, 112, 136, 'navy');
rect(p, 458, 50, 92, 116, 'cyan', 72);
rect(p, 470, 62, 68, 104, 'navy');
rect(p, 476, 68, 56, 98, 'cyan', 96);
for (let i = 0; i < 5; i++) rect(p, 410 - i * 7, 86 + i * 15, 28 + i * 7, 3, 'cyan', 100);
rect(p, 32, 188, 576, 6, 'gray');
rect(p, 32, 188, 576, 2, 'light');
for (let x = 48; x < 608; x += 32) rect(p, x, 202, 20, 3, 'dark');
box(p, 72, 158, 156, 34, 'dark');
rect(p, 76, 160, 148, 4, 'cyan');
for (const [x, y, w, h] of [[88, 150, 12, 8], [112, 146, 14, 12], [138, 150, 16, 8], [166, 144, 12, 14], [190, 149, 14, 9]]) {
  rect(p, x, y, w, h, 'paper');
  rect(p, x + 2, y + 2, Math.max(2, w - 4), 2, 'white');
}
rect(p, 292, 120, 26, 24, 'paper');
rect(p, 288, 116, 34, 10, 'dark');
rect(p, 292, 126, 6, 4, 'amber');
rect(p, 310, 126, 4, 4, 'navy');
rect(p, 288, 144, 34, 30, 'cyan');
rect(p, 294, 148, 22, 16, 'white');
line(p, 290, 148, 278, 134, 'paper', 4);
line(p, 320, 148, 332, 134, 'paper', 4);
rect(p, 292, 174, 10, 18, 'dark');
rect(p, 310, 174, 10, 18, 'dark');
for (let y = 0; y < 24; y++) {
  for (let x = 0; x < 24; x++) {
    const d = Math.hypot(x - 11.5, y - 11.5);
    if (d < 11) rect(p, 340 + x, 126 + y, 1, 1, d > 8 ? 'white' : 'cyan');
  }
}
rect(p, 346, 133, 3, 3, 'navy');
rect(p, 355, 133, 3, 3, 'navy');
rect(p, 348, 142, 8, 2, 'white');
box(p, 298, 48, 40, 40, 'amber');
rect(p, 312, 56, 12, 24, 'yellow');
rect(p, 306, 62, 24, 12, 'yellow');
rect(p, 304, 88, 10, 14, 'amber');
rect(p, 322, 88, 10, 14, 'amber');
for (const [x, y, c] of [[254, 94, 'cyan'], [378, 104, 'amber'], [254, 130, 'amber'], [382, 148, 'cyan'], [272, 68, 'yellow'], [366, 62, 'cyan'], [402, 52, 'amber']]) {
  rect(p, x, y, 5, 5, c);
  rect(p, x + 2, y - 4, 1, 13, c);
}
save('m3-completion-art', 'ui', p, 'Pixel-art celebration scene for Mission 3 completion page', {
  anchor: { x: 0.5, y: 0.5 },
  provenance: 'Original procedural pixel artwork generated in scripts/assets/mission-03.mjs for the Mission 3 congratulatory page.'
});

// Update manifest
// New independent rear rack illustration; production master retained in workspace.
const storageMaster=`${source}/m3-storage-master.png`;
if(fs.existsSync(storageMaster)){
 const raw=PNG.sync.read(fs.readFileSync(storageMaster));p=canvas(640,360);
 for(let y=0;y<360;y++)for(let x=0;x<640;x++){const i=(Math.min(raw.height-1,Math.floor((y+.5)*raw.height/360))*raw.width+Math.min(raw.width-1,Math.floor((x+.5)*raw.width/640)))*4;p.data.set(raw.data.subarray(i,i+4),(y*640+x)*4)}
 save('m3-storage-layer','environment',p,'Transparent side racks behind arena, center remains quiet',{source:storageMaster,status:'generated',provenance:'Original built-in image_gen output for this task, alpha preserved and nearest-neighbor normalized.'});
}
for(const type of ['insulator','conductor']){
 p=canvas(96,64);box(p,1,1,94,62,'navy');rect(p,3,3,90,2,'cyan');
 if(type==='insulator'){for(const x of [4,34,64])for(const y of [7,33]){rect(p,x,y,28,22,'dark');rect(p,x+2,y+2,24,18,'navy')}}
 else {for(let y=8;y<56;y++)for(let x=6;x<90;x++)if(((x-48)/42)**2+((y-32)/24)**2<=1)rect(p,x,y,1,1,x+y<65?'gray':'dark')}
 save('m3-'+type+'-stage','ui',p,'Microscope neutral/polarized diagram base; all charge signs/positions generated by application',{anchor:{x:.5,y:.5}});
}
p=canvas(24,24);rect(p,2,2,5,20,'cyan');rect(p,17,2,5,20,'light');for(const y of [3,9,15])rect(p,11,y,2,3,'amber');save('m3-icon-clearance','ui',p,'Non-contact clearance reminder icon',{anchor:{x:.5,y:.5}});
p=canvas(128,12);for(let x=0;x<128;x+=16)rect(p,x+2,4,10,3,'cyan',180);rect(p,1,1,3,10,'light');rect(p,124,1,3,10,'light');save('m3-tray-ready','vfx',p,'Collection tray locked status overlay; only visible when tray latch closed');
p=canvas(20,82);rect(p,8,0,4,56,'amber');for(let y=5;y<52;y+=10)rect(p,6,y,8,4,'dark');box(p,2,56,16,26,'navy');rect(p,4,58,12,22,'cyan');rect(p,6,60,8,18,'white');save('m3-source-wand-long','puzzle',p,'Wand aligned with physics tip: top168, bottom250, insulated handle and separate active head',{anchor:{x:.5,y:0}});
const manifest = JSON.parse(fs.readFileSync('docs/ASSET_MANIFEST.json', 'utf8'));
manifest.assets = manifest.assets.filter(a => !records.some(r => r.key === a.key)).concat(records);
fs.writeFileSync('docs/ASSET_MANIFEST.json', JSON.stringify(manifest, null, 2));
fs.copyFileSync('docs/ASSET_MANIFEST.json', 'public/asset-manifest.json');
fs.writeFileSync(`${source}/production.json`, JSON.stringify({ source: 'scripts/assets/mission-03.mjs', assets: records }, null, 2));

console.log(`Mission 03: ${records.length} final separate assets generated; ${manifest.assets.length} total manifest entries.`);
