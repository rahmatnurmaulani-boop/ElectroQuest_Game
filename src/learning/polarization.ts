import {
  initialPolarizationModel,
  calculatePolarForce,
  type PolarizationModel
} from '../physics/polarization';
import {
  POLARIZATION_QUESTIONS
} from '../content/mission03';

export type PolarizationPhase =
  | 'PROBLEM'
  | 'OBSERVATION'
  | 'PREDICTION'
  | 'INVESTIGATION'
  | 'SOLUTION'
  | 'EXPLANATION'
  | 'REFLECTION'
  | 'RESULTS';

export interface PolarObservation {
  id: number;
  sourceCharge: number;
  targetType: 'paper' | 'metal';
  distance: number;
  polarization: number;
  force: number;
  netCharge: number; // always 0
}

export interface PolarExplanation {
  answers: number[];
  correct: boolean[];
}

export interface PolarizationSession {
  version: 1;
  phase: PolarizationPhase;
  model: PolarizationModel;
  prediction: number[] | null;
  observations: PolarObservation[];
  comparisons: { a: number; b: number; kind: 'sign' | 'distance' | 'material'; ratio: number }[];
  explanations: PolarExplanation[];
  reflection: string;
  hints: number;
  attempts: { initial: PolarizationModel; final: PolarizationModel }[];
  solution: PolarizationModel | null;
  crossed: boolean;
  playerX: number;
}

export const newPolarizationSession = (): PolarizationSession => ({
  version: 1,
  phase: 'PROBLEM',
  model: initialPolarizationModel(),
  prediction: null,
  observations: [],
  comparisons: [],
  explanations: [],
  reflection: '',
  hints: 0,
  attempts: [],
  solution: null,
  crossed: false,
  playerX: 80
});

export function snapshotPolarization(
  m: PolarizationModel,
  id: number,
  targetType: 'paper' | 'metal' = 'paper'
): PolarObservation {
  const isMetal = targetType === 'metal';
  const targetX = isMetal ? m.demoSphere.x : 340;
  const targetY = isMetal ? m.demoSphere.y : 312;

  const phys = calculatePolarForce(
    targetX,
    targetY,
    m.sourceX,
    m.sourceY,
    m.sourceCharge,
    isMetal
  );

  return {
    id,
    sourceCharge: m.sourceCharge,
    targetType,
    distance: Math.round(phys.distance),
    polarization: Number(phys.polar.toFixed(2)),
    force: Number(Math.hypot(phys.fx, phys.fy).toFixed(1)),
    netCharge: 0
  };
}

export function comparePolarObservations(
  a: PolarObservation,
  b: PolarObservation
): { kind: 'sign' | 'distance' | 'material' | null; ratio: number; message: string } {
  const ratio = a.force > 0 ? b.force / a.force : 0;

  // Comparison 1: Sign (+3 vs -3) at same distance and target
  if (
    a.targetType === b.targetType &&
    Math.abs(a.distance - b.distance) < 8 &&
    a.sourceCharge * b.sourceCharge < 0
  ) {
    return {
      kind: 'sign',
      ratio: Number(ratio.toFixed(2)),
      message: `Perbandingan tanda sumber (+ vs -): Kedua tanda sama-sama menarik kertas netral! Orientasi dipol terbalik, tetapi muatan total benda tetap nol.`
    };
  }

  // Comparison 2: Distance (near vs far) with same sign and target
  if (
    a.targetType === b.targetType &&
    a.sourceCharge === b.sourceCharge &&
    a.sourceCharge !== 0 &&
    Math.abs(a.distance - b.distance) >= 50
  ) {
    const nearer = a.distance < b.distance ? a : b;
    const farther = a.distance < b.distance ? b : a;
    const distRatio = farther.force / nearer.force;
    return {
      kind: 'distance',
      ratio: Number(distRatio.toFixed(3)),
      message: `Perbandingan jarak sumber: Saat sumber didekatkan, gaya tarik dan derajat polarisasi meningkat tajam; saat dijauhkan, polarisasi berkurang hingga mendekati nol.`
    };
  }

  // Comparison 3: Material (Metal sphere vs Paper shred) at similar distance
  if (
    a.targetType !== b.targetType &&
    a.sourceCharge === b.sourceCharge &&
    a.sourceCharge !== 0 &&
    Math.abs(a.distance - b.distance) < 20
  ) {
    return {
      kind: 'material',
      ratio: Number(ratio.toFixed(2)),
      message: `Perbandingan konduktor vs isolator: Logam memiliki elektron konduksi bebas yang bergeser ke permukaan (polarisasi lebih kuat), sedangkan kertas hanya mengalami pergeseran dipol terikat.`
    };
  }

  return {
    kind: null,
    ratio: 1,
    message: 'Simpan dan bandingkan dua pengamatan dengan memvariasikan satu variabel (tanda muatan sumber, jarak, atau jenis bahan).'
  };
}

export const investigatedPolarization = (s: PolarizationSession): boolean => {
  // Player must have validated at least two comparisons
  return s.comparisons.length >= 2;
};

export function explainPolarization(
  s: PolarizationSession,
  answers: number[]
): PolarizationSession {
  if (
    s.phase !== 'EXPLANATION' ||
    answers.length !== POLARIZATION_QUESTIONS.length ||
    answers.some(n => !Number.isInteger(n) || n < 0 || n > 2) ||
    !s.solution ||
    !s.crossed
  ) {
    return s;
  }

  const correct = answers.map((n, i) => n === POLARIZATION_QUESTIONS[i].correct);
  const isAllCorrect = correct.every(Boolean);

  return {
    ...s,
    explanations: [...s.explanations, { answers: [...answers], correct }],
    phase: isAllCorrect ? 'REFLECTION' : 'EXPLANATION'
  };
}
