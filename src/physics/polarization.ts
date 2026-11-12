/**
 * Model Fisika Polarisasi Dielektrik dan Induksi Konduktor
 *
 * Model ini merupakan penyederhanaan pembelajaran (didactic simplification):
 * - Objek netral (q_net = 0) memiliki jumlah proton dan elektron yang seimbang.
 * - Medan tak-seragam dari sumber bermuatan Q menginduksi momen dipol p = alpha * E.
 * - Gaya elektrostatik netto pada dipol terinduksi:
 *     F = (p . grad) E ~ 2 * k * alpha * (Q^2) / r^5
 * - Karena F sebanding dengan Q^2, sumber muatan positif (+Q) maupun negatif (-Q)
 *   sama-sama menghasilkan gaya tarik menarik pada benda netral!
 * - Orientasi dipol:
 *   Sumber positif menarik elektron (kutub negatif mendekat, kutub positif menjauh).
 *   Sumber negatif menolak elektron (kutub positif mendekat, kutub negatif menjauh).
 * - Pada isolator (kertas): elektron terikat pada molekul, polarisasi berupa pergeseran
 *   dan orientasi dipol molekuler tanpa arus elektron bebas.
 * - Pada konduktor (logam): elektron konduksi bebas bergerak ke batas permukaan logam.
 * - Polarisasi tanpa transfer kontak TIDAK mengubah muatan bersih benda (tetap nol).
 */

export interface PaperShred {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  variation: number; // 1..4
  state: 'floor' | 'attracted' | 'in_tray' | 'collected';
}

export interface PolarizationModel {
  sourceCharge: number; // e.g. -3, 0, +3
  sourceX: number; // 150..520
  sourceY: number; // Wand head Y position (~250)
  papers: PaperShred[];
  collectedCount: number;
  trayLatchClosed: boolean;
  demoSphere: {
    x: number;
    y: number;
    charge: number; // always 0 net
    polarization: number; // 0..1
    dipoleSign: number; // +1 or -1 orientation
  };
  phase: 'READY' | 'ACTIVE' | 'CLEARED';
  message: string;
}

export const POLAR_PHYSICS = {
  h: 1 / 60,
  maxVelocity: 160,
  damping: 0.88,
  gravity: 200,
  floorY: 304,
  paperFloorY: 312,
  trayXMin: 110,
  trayXMax: 250,
  trayTargetX: 180,
  trayTargetY: 308,
  minClearance: 28,
  attractThreshold: 160,
  alphaPaper: 1.0,
  alphaMetal: 3.5,
  kPolar: 12000000 // scaling factor for didactic visualization in game units
} as const;

export function initialPaperShreds(): PaperShred[] {
  const initialPositions = [
    { x: 260, y: 312, rot: -0.2, v: 1 },
    { x: 295, y: 312, rot: 0.3, v: 2 },
    { x: 330, y: 312, rot: -0.1, v: 3 },
    { x: 370, y: 312, rot: 0.4, v: 4 },
    { x: 405, y: 312, rot: -0.3, v: 1 },
    { x: 440, y: 312, rot: 0.2, v: 2 }
  ];
  return initialPositions.map((pos, idx) => ({
    id: idx + 1,
    x: pos.x,
    y: pos.y,
    vx: 0,
    vy: 0,
    rotation: pos.rot,
    variation: pos.v,
    state: 'floor'
  }));
}

export function initialPolarizationModel(): PolarizationModel {
  return {
    sourceCharge: -3,
    sourceX: 340,
    sourceY: 248,
    papers: initialPaperShreds(),
    collectedCount: 0,
    trayLatchClosed: false,
    demoSphere: {
      x: 100,
      y: 264,
      charge: 0,
      polarization: 0,
      dipoleSign: 0
    },
    phase: 'READY',
    message: 'Alat polarisasi siap. Atur posisi sumber muatan di atas serpihan kertas.'
  };
}

/**
 * Menghitung gaya polarisasi efektif pada partikel netral
 * Mengembalikan vektor gaya [fx, fy] dan nilai polarisasi (0..1)
 */
export function calculatePolarForce(
  targetX: number,
  targetY: number,
  sourceX: number,
  sourceY: number,
  qSource: number,
  isConductor = false
): { fx: number; fy: number; polar: number; distance: number } {
  if (qSource === 0) return { fx: 0, fy: 0, polar: 0, distance: 999 };

  const dx = sourceX - targetX;
  const dy = sourceY - targetY;
  const distance = Math.max(POLAR_PHYSICS.minClearance, Math.hypot(dx, dy));

  const alpha = isConductor ? POLAR_PHYSICS.alphaMetal : POLAR_PHYSICS.alphaPaper;
  // Polarization degree P ~ alpha * |Q| / r^2
  const polar = Math.min(1.0, (alpha * Math.abs(qSource) * 900) / (distance * distance));

  // Force magnitude ~ 2 * k * alpha * Q^2 / r^4
  // Directed toward the source [dx / distance, dy / distance]
  const forceMag = Math.min(
    280,
    (POLAR_PHYSICS.kPolar * alpha * (qSource * qSource)) / Math.pow(distance, 4)
  );

  const fx = forceMag * (dx / distance);
  const fy = forceMag * (dy / distance);

  return { fx, fy, polar, distance };
}

/**
 * Melakukan 1 timestep integrasi fisika gerak serpihan kertas
 */
export function stepPolarization(model: PolarizationModel, dt: number): PolarizationModel {
  const next = structuredClone(model);
  let newlyCollected = 0;

  // Demo sphere polarization update
  const spherePhys = calculatePolarForce(
    next.demoSphere.x,
    next.demoSphere.y,
    next.sourceX,
    next.sourceY,
    next.sourceCharge,
    true
  );
  next.demoSphere.polarization = spherePhys.polar;
  next.demoSphere.dipoleSign = next.sourceCharge === 0 ? 0 : Math.sign(next.sourceCharge);

  for (const paper of next.papers) {
    if (paper.state === 'collected') continue;

    const { fx, fy, distance } = calculatePolarForce(
      paper.x,
      paper.y,
      next.sourceX,
      next.sourceY,
      next.sourceCharge,
      false
    );

    if (distance < POLAR_PHYSICS.attractThreshold && next.sourceCharge !== 0) {
      paper.state = 'attracted';
      // Apply attractive force toward wand head
      const followDx = next.sourceX - paper.x;
      const followDy = (next.sourceY + POLAR_PHYSICS.minClearance + 2) - paper.y;
      paper.vx += (followDx * 45 + fx) * dt;
      paper.vy += (followDy * 45 + fy) * dt;
    } else {
      // Natural gravity pull toward floor
      paper.vy += POLAR_PHYSICS.gravity * dt;
      if (paper.y >= POLAR_PHYSICS.paperFloorY - 2) {
        paper.state = 'floor';
      }
    }

    // Damping
    paper.vx *= POLAR_PHYSICS.damping;
    paper.vy *= POLAR_PHYSICS.damping;

    // Clamp speed
    const speed = Math.hypot(paper.vx, paper.vy);
    if (speed > POLAR_PHYSICS.maxVelocity) {
      paper.vx = (paper.vx / speed) * POLAR_PHYSICS.maxVelocity;
      paper.vy = (paper.vy / speed) * POLAR_PHYSICS.maxVelocity;
    }

    // Integrate position
    paper.x += paper.vx * dt;
    paper.y += paper.vy * dt;

    // Floor collision
    if (paper.y > POLAR_PHYSICS.paperFloorY) {
      paper.y = POLAR_PHYSICS.paperFloorY;
      paper.vy = 0;
      paper.vx *= 0.7; // floor friction
    }

    // Minimum clearance under wand so it never touches
    if (Math.hypot(paper.x - next.sourceX, paper.y - next.sourceY) < POLAR_PHYSICS.minClearance) {
      const angle = Math.atan2(paper.y - next.sourceY, paper.x - next.sourceX);
      paper.x = next.sourceX + Math.cos(angle) * POLAR_PHYSICS.minClearance;
      paper.y = next.sourceY + Math.sin(angle) * POLAR_PHYSICS.minClearance;
    }

    // Check if paper entered collection tray zone
    if (
      paper.x >= POLAR_PHYSICS.trayXMin &&
      paper.x <= POLAR_PHYSICS.trayXMax &&
      paper.y >= POLAR_PHYSICS.paperFloorY - 14
    ) {
      paper.state = 'collected';
      paper.x = POLAR_PHYSICS.trayTargetX + (paper.id - 3.5) * 8;
      paper.y = POLAR_PHYSICS.trayTargetY;
      paper.vx = 0;
      paper.vy = 0;
      newlyCollected++;
    }
  }

  next.collectedCount = next.papers.filter(p => p.state === 'collected').length;
  if (next.collectedCount === next.papers.length) {
    next.phase = 'CLEARED';
    next.trayLatchClosed = true;
    next.message = 'Seluruh serpihan kertas telah terkumpul di baki! Jalur gudang kini bersih.';
  } else if (newlyCollected > 0) {
    next.message = `${next.collectedCount} dari ${next.papers.length} serpihan kertas terkumpul di baki.`;
  }

  return next;
}

/**
 * Memindahkan posisi sumber muatan pada track rel
 */
export function setSourcePosition(model: PolarizationModel, newX: number): PolarizationModel {
  const clampedX = Math.max(150, Math.min(520, newX));
  return { ...model, sourceX: clampedX };
}

/**
 * Mengubah tanda muatan sumber (-3, 0, +3)
 */
export function setSourceCharge(model: PolarizationModel, charge: number): PolarizationModel {
  const q = charge > 0 ? 3 : charge < 0 ? -3 : 0;
  return {
    ...model,
    sourceCharge: q,
    message: q === 0
      ? 'Sumber dinonaktifkan (q = 0). Polarisasi pada benda netral hilang.'
      : `Sumber bermuatan ${q > 0 ? '+3' : '-3'} aktif. Menginduksi polarisasi pada benda di sekitarnya.`
  };
}

/**
 * Mengumpulkan secara mekanis serpihan yang sudah berada di sekitar baki
 */
export function latchTray(model: PolarizationModel): PolarizationModel {
  const next = structuredClone(model);
  next.trayLatchClosed = true;
  for (const p of next.papers) {
    if (p.x >= POLAR_PHYSICS.trayXMin && p.x <= POLAR_PHYSICS.trayXMax) {
      p.state = 'collected';
      p.y = POLAR_PHYSICS.trayTargetY;
      p.vx = 0;
      p.vy = 0;
    }
  }
  next.collectedCount = next.papers.filter(p => p.state === 'collected').length;
  if (next.collectedCount === next.papers.length) {
    next.phase = 'CLEARED';
    next.message = 'Penahan baki mengunci seluruh serpihan kertas! Jalur terbuka.';
  }
  return next;
}
