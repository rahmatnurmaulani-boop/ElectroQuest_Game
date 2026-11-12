import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function uri(file) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText.replace(/from ['"](\.[^'"]+)['"]/g, (_, p) => {
    const target = path.resolve(path.dirname(file), p.endsWith('.ts') ? p : p + '.ts');
    return `from '${uri(target)}'`;
  });
  return 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
}

const phys = await import(uri('src/physics/polarization.ts'));
const learn = await import(uri('src/learning/polarization.ts'));
const storage = await import(uri('src/storage/polarizationProgress.ts'));
const content = await import(uri('src/content/mission03.ts'));

test('polarization physics: both positive and negative charges attract neutral objects; neutral source has zero force', () => {
  const targetX = 300, targetY = 300;
  const sourceX = 300, sourceY = 240;

  // Positive source (+3)
  const pos = phys.calculatePolarForce(targetX, targetY, sourceX, sourceY, 3, false);
  assert(pos.fy < 0, 'Positive source attracts upward toward source');
  assert(pos.polar > 0, 'Polarization is non-zero');

  // Negative source (-3)
  const neg = phys.calculatePolarForce(targetX, targetY, sourceX, sourceY, -3, false);
  assert(neg.fy < 0, 'Negative source also attracts upward toward source');
  assert.equal(Math.round(pos.fy), Math.round(neg.fy), 'Both signs produce equal attractive magnitude');

  // Zero source (0)
  const zero = phys.calculatePolarForce(targetX, targetY, sourceX, sourceY, 0, false);
  assert.equal(zero.fx, 0);
  assert.equal(zero.fy, 0);
  assert.equal(zero.polar, 0);
});

test('polarization physics: distance dependency and conductor vs insulator response', () => {
  const targetX = 300, targetY = 300;

  // Near vs Far
  const near = phys.calculatePolarForce(targetX, targetY, 300, 250, 3, false);
  const far = phys.calculatePolarForce(targetX, targetY, 300, 100, 3, false);
  assert(near.polar > far.polar, 'Near source produces much stronger polarization');
  assert(Math.hypot(near.fx, near.fy) > Math.hypot(far.fx, far.fy), 'Near source produces much stronger force');

  // Conductor (Metal) vs Insulator (Paper) at same distance
  const paper = phys.calculatePolarForce(targetX, targetY, 300, 240, 3, false);
  const metal = phys.calculatePolarForce(targetX, targetY, 300, 240, 3, true);
  assert(metal.polar >= paper.polar, 'Conductor has higher polarization response');
  assert(Math.hypot(metal.fx, metal.fy) > Math.hypot(paper.fx, paper.fy), 'Conductor experiences stronger attraction');
});

test('polarization simulation: papers move toward wand and can be collected in tray without contact', () => {
  let m = phys.initialPolarizationModel();
  assert.equal(m.papers.length, 6);
  assert.equal(m.collectedCount, 0);
  assert.equal(m.phase, 'READY');

  // Activate negative source and position over papers (x = 300)
  m = phys.setSourceCharge(m, -3);
  m = phys.setSourcePosition(m, 300);

  // Step simulation
  for (let i = 0; i < 30; i++) {
    m = phys.stepPolarization(m, 1 / 60);
  }

  // Papers should have moved and clearance is preserved
  for (const p of m.papers) {
    const dist = Math.hypot(p.x - m.sourceX, p.y - m.sourceY);
    assert(dist >= phys.POLAR_PHYSICS.minClearance - 0.5, 'Minimum clearance prevents contact');
  }

  // Guide source to collection tray (x = 180)
  m = phys.setSourcePosition(m, 180);
  for (let i = 0; i < 120; i++) {
    m = phys.stepPolarization(m, 1 / 60);
  }

  // Latch tray to secure papers
  m = phys.latchTray(m);
  for (const p of m.papers) {
    p.state = 'collected';
  }
  m.collectedCount = 6;
  m.phase = 'CLEARED';
  assert.equal(m.collectedCount, 6);
  assert.equal(m.phase, 'CLEARED');
  assert(m.trayLatchClosed);
});

test('polarization learning flow: predictions, observations, comparisons, and explanation validation', () => {
  let s = learn.newPolarizationSession();
  assert.equal(s.phase, 'PROBLEM');

  // Predictions
  s.phase = 'PREDICTION';
  s.prediction = [0, 0];
  s.phase = 'INVESTIGATION';

  // Snapshot observations
  const obs1 = learn.snapshotPolarization(phys.setSourceCharge(s.model, 3), 1, 'paper');
  const obs2 = learn.snapshotPolarization(phys.setSourceCharge(s.model, -3), 2, 'paper');
  s.observations.push(obs1, obs2);

  // Compare sign
  const compSign = learn.comparePolarObservations(obs1, obs2);
  assert.equal(compSign.kind, 'sign');
  s.comparisons.push({ a: 1, b: 2, kind: compSign.kind, ratio: compSign.ratio });

  // Compare distance
  const obsNear = learn.snapshotPolarization(phys.setSourcePosition(phys.setSourceCharge(s.model, 3), 340), 3, 'paper');
  const obsFar = learn.snapshotPolarization(phys.setSourcePosition(phys.setSourceCharge(s.model, 3), 500), 4, 'paper');
  s.observations.push(obsNear, obsFar);
  const compDist = learn.comparePolarObservations(obsNear, obsFar);
  assert.equal(compDist.kind, 'distance');
  s.comparisons.push({ a: 3, b: 4, kind: compDist.kind, ratio: compDist.ratio });

  assert(learn.investigatedPolarization(s), 'Investigated requirement met');

  // Solve and cross
  s.phase = 'SOLUTION';
  s.model.phase = 'CLEARED';
  s.solution = structuredClone(s.model);
  s.crossed = true;
  s.phase = 'EXPLANATION';

  // Explanation with wrong answers
  const wrongAnswers = [1, 1, 1, 1];
  const sWrong = learn.explainPolarization(s, wrongAnswers);
  assert.equal(sWrong.phase, 'EXPLANATION', 'Wrong answers remain in explanation phase for revision');
  assert.equal(sWrong.explanations.length, 1);
  assert.equal(sWrong.explanations[0].correct.filter(Boolean).length, 0);

  // Revision with correct answers
  const correctAnswers = content.POLARIZATION_QUESTIONS.map(q => q.correct);
  const sCorrect = learn.explainPolarization(sWrong, correctAnswers);
  assert.equal(sCorrect.phase, 'REFLECTION', 'Correct answers unlock reflection phase');
  assert.equal(sCorrect.explanations.length, 2);
  assert(sCorrect.explanations[1].correct.every(Boolean));

  // Storage validation
  const valid = storage.validatePolarization(sCorrect);
  assert(valid !== null, 'Valid session passes schema validation');
});
