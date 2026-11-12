import {readBridge} from './bridgeProgress';
import type {PolarizationModel} from '../physics/polarization';
import {
  investigatedPolarization,
  type PolarizationSession
} from '../learning/polarization';
import {POLARIZATION_QUESTIONS} from '../content/mission03';

export const POLAR_KEY = 'electroquest.mission3.v1';
export const M2_COMPLETED_KEY = 'electroquest.mission2.completed.v1';

let memorySession: PolarizationSession | null = null;

export function polarizationUnlocked(): boolean {
  try {
    const m2 = readBridge();
    return (
      m2?.phase === 'RESULTS' ||
      localStorage.getItem(M2_COMPLETED_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function validPolarModel(m: PolarizationModel): boolean {
  if (
    !m ||
    !['READY', 'ACTIVE', 'CLEARED'].includes(m.phase) ||
    !Number.isFinite(m.sourceX) ||
    m.sourceX < 140 ||
    m.sourceX > 530 ||
    ![-3, 0, 3].includes(m.sourceCharge) ||
    !Array.isArray(m.papers) ||
    m.papers.length !== 6 ||
    typeof m.collectedCount !== 'number' ||
    m.collectedCount < 0 ||
    m.collectedCount > 6 ||
    typeof m.trayLatchClosed !== 'boolean' ||
    !m.demoSphere ||
    m.demoSphere.charge !== 0 ||
    typeof m.message !== 'string'
  ) {
    return false;
  }
  return true;
}

export function validatePolarization(value: unknown): PolarizationSession | null {
  try {
    const s = value as PolarizationSession;
    if (
      !s ||
      s.version !== 1 ||
      ![
        'PROBLEM',
        'OBSERVATION',
        'PREDICTION',
        'INVESTIGATION',
        'SOLUTION',
        'EXPLANATION',
        'REFLECTION',
        'RESULTS'
      ].includes(s.phase) ||
      !validPolarModel(s.model) ||
      !Array.isArray(s.observations) ||
      s.observations.length > 100 ||
      !Array.isArray(s.comparisons) ||
      s.comparisons.length > 100 ||
      !Array.isArray(s.explanations) ||
      s.explanations.length > 100 ||
      !Array.isArray(s.attempts) ||
      s.attempts.length > 100 ||
      typeof s.reflection !== 'string' ||
      s.reflection.length > 2000 ||
      !Number.isInteger(s.hints) ||
      s.hints < 0 ||
      s.hints > 3 ||
      typeof s.crossed !== 'boolean' ||
      !Number.isFinite(s.playerX) ||
      s.playerX < 32 ||
      s.playerX > 608
    ) {
      return null;
    }

    if (
      s.prediction !== null &&
      (!Array.isArray(s.prediction) ||
        s.prediction.length !== 2 ||
        s.prediction.some(n => !Number.isInteger(n) || n < 0 || n > 2))
    ) {
      return null;
    }

    if (
      ['INVESTIGATION', 'SOLUTION', 'EXPLANATION', 'REFLECTION', 'RESULTS'].includes(s.phase) &&
      !s.prediction
    ) {
      return null;
    }

    if (['SOLUTION', 'EXPLANATION', 'REFLECTION', 'RESULTS'].includes(s.phase) && !investigatedPolarization(s)) {
      return null;
    }

    if (
      (s.crossed || ['EXPLANATION', 'REFLECTION', 'RESULTS'].includes(s.phase)) &&
      (!s.solution || s.model.phase !== 'CLEARED')
    ) {
      return null;
    }

    for (const e of s.explanations) {
      if (
        !e ||
        !Array.isArray(e.answers) ||
        e.answers.length !== POLARIZATION_QUESTIONS.length ||
        e.answers.some(n => !Number.isInteger(n) || n < 0 || n > 2) ||
        !equal(e.correct, e.answers.map((n, i) => n === POLARIZATION_QUESTIONS[i].correct))
      ) {
        return null;
      }
    }

    if (['REFLECTION', 'RESULTS'].includes(s.phase) && !s.explanations.at(-1)?.correct.every(Boolean)) {
      return null;
    }

    return structuredClone(s);
  } catch {
    return null;
  }
}

export function readPolarization(): PolarizationSession | null {
  try {
    const raw = localStorage.getItem(POLAR_KEY);
    return raw && raw.length < 2000000 ? validatePolarization(JSON.parse(raw)) : null;
  } catch {
    return memorySession ? structuredClone(memorySession) : null;
  }
}

export function savePolarization(s: PolarizationSession): boolean {
  const valid = validatePolarization(s);
  if (!valid) return false;
  memorySession = valid;
  try {
    localStorage.setItem(POLAR_KEY, JSON.stringify(valid));
    if (s.phase === 'RESULTS') {
      localStorage.setItem('electroquest.mission3.completed.v1', 'true');
    }
    return true;
  } catch {
    return false;
  }
}

export function removePolarization(): void {
  memorySession = null;
  try {
    localStorage.removeItem(POLAR_KEY);
  } catch {}
}
