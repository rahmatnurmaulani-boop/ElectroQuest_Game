import {
  initialInductionModel,
  measureInductionCharge,
  type InductionModel
} from '../physics/induction';
import {INDUCTION_QUESTIONS} from '../content/mission04';

export type InductionPhase =
  | 'PROBLEM'
  | 'OBSERVATION'
  | 'PREDICTION'
  | 'INVESTIGATION'
  | 'SOLUTION'
  | 'EXPLANATION'
  | 'REFLECTION'
  | 'RESULTS';

export interface InductionObservation {
  id: number;
  challenge: 1 | 2;
  sourceSign: number;
  sourcePos: 'FAR' | 'NEAR';
  groundConnected: boolean;
  sphereCharge: number;
  distribution: string;
  note: string;
}

export interface InductionExplanation {
  answers: number[];
  correct: boolean[];
}

export interface InductionSession {
  version: 1;
  phase: InductionPhase;
  model: InductionModel;
  prediction: [number, number] | null;
  observations: InductionObservation[];
  comparisons: { a: number; b: number; kind: string; label: string }[];
  explanations: InductionExplanation[];
  reflection: string;
  hints: number;
  solution: { challenge1: InductionModel | null; challenge2: InductionModel | null };
  crossed: boolean;
  playerX: number;
  sequenceLogs: { action: string; state: string }[];
}

export function newInductionSession(): InductionSession {
  return {
    version: 1,
    phase: 'PROBLEM',
    model: initialInductionModel(1),
    prediction: null,
    observations: [],
    comparisons: [],
    explanations: [],
    reflection: '',
    hints: 0,
    solution: { challenge1: null, challenge2: null },
    crossed: false,
    playerX: 80,
    sequenceLogs: []
  };
}

export function snapshotInduction(
  model: InductionModel,
  id: number
): InductionObservation {
  const measured = measureInductionCharge(model);
  return {
    id,
    challenge: model.challenge,
    sourceSign: model.sourceSign,
    sourcePos: model.sourcePos,
    groundConnected: model.groundConnected,
    sphereCharge: measured.measuredCharge ?? model.sphereCharge,
    distribution: model.distribution,
    note: model.message
  };
}

export function logAction(
  s: InductionSession,
  action: string
): InductionSession {
  const entry = {
    action,
    state: `q=${s.model.sphereCharge} pos=${s.model.sourcePos} gnd=${s.model.groundConnected}`
  };
  return {
    ...s,
    sequenceLogs: [...s.sequenceLogs.slice(-49), entry] // keep last 50
  };
}

export function investigatedInduction(s: InductionSession): boolean {
  return s.observations.length >= 2 && s.comparisons.length >= 1;
}

export function bothChallengesSolved(s: InductionSession): boolean {
  return s.solution.challenge1 !== null && s.solution.challenge2 !== null;
}

export function explainInduction(
  s: InductionSession,
  answers: number[]
): InductionSession {
  if (answers.some(a => a < 0)) return s; // incomplete
  const correct = answers.map((a, i) => a === INDUCTION_QUESTIONS[i].correct);
  const explanation: InductionExplanation = { answers, correct };
  const next = {
    ...s,
    explanations: [...s.explanations, explanation]
  };
  if (correct.every(Boolean)) {
    next.phase = 'REFLECTION';
  }
  return next;
}
