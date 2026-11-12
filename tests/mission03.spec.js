import { test, expect } from '@playwright/test';

const state = p => p.locator('#game').evaluate(el => JSON.parse(el.dataset.polarization));
const saved = p => p.evaluate(() => JSON.parse(localStorage.getItem('electroquest.mission3.v1')));

async function enterMission3(p) {
  await p.addInitScript(() => {
    localStorage.setItem('electroquest.mission1.completed.v1', 'true');
    localStorage.setItem('electroquest.mission2.completed.v1', 'true');
    window.__audioProbe = { frequencies: [] };
    const createOscillator = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      const oscillator = createOscillator.apply(this, args);
      const setValueAtTime = oscillator.frequency.setValueAtTime.bind(oscillator.frequency);
      oscillator.frequency.setValueAtTime = (value, time) => {
        window.__audioProbe.frequencies.push(value);
        return setValueAtTime(value, time);
      };
      return oscillator;
    };
  });
  await p.goto('/');
  await p.getByRole('button', { name: 'Pilih misi', exact: true }).click();
  await expect(p.locator('[data-third]')).toBeEnabled();
  await p.locator('[data-third]').click();
  await expect(p.locator('#game')).toHaveAttribute('data-polarization', /.+/);
}

test('Mission 3: Full polarization flow from landing to results', async ({ page }) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {
    if (r.status() >= 400) errors.push(r.url());
  });

  await enterMission3(page);
  const st0 = await state(page);
  expect(st0.phase).toBe('PROBLEM');

  // Advance from Problem dialog
  await page.getByRole('button', { name: 'Lanjut ke Observasi', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('OBSERVATION');

  // Move Raka toward terminal (X = 120)
  await page.keyboard.down('KeyD');
  await expect.poll(async () => (await state(page)).playerX).toBeGreaterThan(115);
  await page.keyboard.up('KeyD');

  // Interact with terminal
  await page.keyboard.press('KeyE');
  await expect(page.locator('.warehouse-lesson')).toBeVisible();
  await page.getByRole('button', { name: 'Lanjut ke Prediksi', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('PREDICTION');
  await expect(page.locator('.warehouse-prediction[open]')).toBeVisible();
  await expect(page.locator('.warehouse-lesson[open]')).toHaveCount(0);
  await expect(page.locator('[name=pred_0] option').nth(1)).toHaveCSS('color', 'rgb(237, 247, 251)');
  await expect(page.locator('[name=pred_0] option').nth(1)).toHaveCSS('background-color', 'rgb(14, 25, 44)');
  for (const viewport of [{ width: 865, height: 700 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const layout = await page.locator('.warehouse-prediction').evaluate(dialog => {
      const label = dialog.querySelector('label');
      const select = label.querySelector('select');
      const labelBox = label.getBoundingClientRect();
      const selectBox = select.getBoundingClientRect();
      return {
        display: getComputedStyle(label).display,
        selectLeft: selectBox.left,
        selectRight: selectBox.right,
        labelLeft: labelBox.left,
        labelRight: labelBox.right,
        scrollWidth: dialog.scrollWidth,
        clientWidth: dialog.clientWidth
      };
    });
    expect(layout.display).toBe('grid');
    expect(layout.selectLeft).toBeGreaterThanOrEqual(layout.labelLeft);
    expect(layout.selectRight).toBeLessThanOrEqual(layout.labelRight);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    await page.screenshot({path:`docs/console-ui-evidence/prediction-3-${viewport.width}.png`});
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  // Fill predictions
  await page.locator('[name=pred_0]').selectOption('0');
  await page.locator('[name=pred_1]').selectOption('0');
  await page.getByRole('button', { name: 'Simpan Prediksi Awal', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('INVESTIGATION');
  await expect(page.locator('.warehouse-prediction[open]')).toHaveCount(0);
  await expect(page.locator('.warehouse-lesson[open]')).toBeVisible();

  // Check microscope view
  await page.getByRole('button', { name: 'Lihat Mikroskop Distribusi Muatan', exact: true }).click();
  await expect(page.locator('.microscope-view')).toBeVisible();
  await page.getByRole('button', { name: 'Kembali ke pembelajaran', exact: true }).click();

  // Experiment & take snapshots:
  // 1. Positive source (+3)
  await page.getByRole('button', { name: 'Atur Sumber Positif (+3)', exact: true }).click();
  await page.getByRole('button', { name: 'Simpan Pengamatan Kertas (Isolator)', exact: true }).click();

  // 2. Negative source (-3)
  await page.getByRole('button', { name: 'Atur Sumber Negatif (-3)', exact: true }).click();
  await page.getByRole('button', { name: 'Simpan Pengamatan Kertas (Isolator)', exact: true }).click();

  // 3. Far distance (x = 500)
  await page.getByRole('button', { name: 'Posisikan Jauh di Kanan (x = 500)', exact: true }).click();
  await page.getByRole('button', { name: 'Simpan Pengamatan Kertas (Isolator)', exact: true }).click();

  // 4. Metal demo sphere
  await page.getByRole('button', { name: 'Simpan Pengamatan Logam Demo (Konduktor)', exact: true }).click();

  // Comparisons:
  // Compare 1 vs 2 (sign)
  await page.getByLabel('Pengamatan 1', { exact: true }).selectOption('1');
  await page.getByLabel('Pengamatan 2', { exact: true }).selectOption('2');
  await page.getByRole('button', { name: 'Bandingkan Kedua Pengamatan', exact: true }).click();

  // Compare 2 vs 3 (distance)
  await page.getByLabel('Pengamatan 1', { exact: true }).selectOption('2');
  await page.getByLabel('Pengamatan 2', { exact: true }).selectOption('3');
  await page.getByRole('button', { name: 'Bandingkan Kedua Pengamatan', exact: true }).click();

  // Compare 2 vs 4 (material)
  await page.getByLabel('Pengamatan 1', { exact: true }).selectOption('2');
  await page.getByLabel('Pengamatan 2', { exact: true }).selectOption('4');
  await page.getByRole('button', { name: 'Bandingkan Kedua Pengamatan', exact: true }).click();

  // Proceed to Solution phase
  await expect(page.getByRole('button', { name: 'Lanjut ke Solusi Pembersihan', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Lanjut ke Solusi Pembersihan', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('SOLUTION');

  // In solution phase: collect papers to tray
  await page.getByRole('button', { name: 'Posisikan di Tengah Kertas (x = 340)', exact: true }).click();
  await page.getByRole('button', { name: 'Pandu Serpihan Menuju Baki (Geser ke x=180)', exact: true }).click();

  // Wait for guide animation & latching to complete
  await expect.poll(async () => (await state(page)).modelPhase, { timeout: 15000 }).toBe('CLEARED');
  await expect.poll(async () => page.evaluate(() => window.__audioProbe.frequencies.includes(880))).toBe(true);
  expect((await state(page)).collectedCount).toBe(6);
  await page.screenshot({path:'docs/mission-03-assets-evidence/tray-locked.png'});

  // Walk Raka to the exit door (X > 570)
  await page.keyboard.down('KeyD');
  await expect.poll(async () => (await state(page)).playerX, { timeout: 15000 }).toBeGreaterThan(570);
  await page.keyboard.up('KeyD');

  // Reaching exit opens Explanation phase
  await expect.poll(async () => (await state(page)).phase).toBe('EXPLANATION');
  await expect(page.locator('.warehouse-lesson')).toBeVisible();

  // Submit explanation: initially wrong
  for (const id of ['concept_neutral', 'both_signs', 'insulator_vs_conductor', 'separation_effect']) {
    await page.locator(`[name=${id}]`).selectOption('1');
  }
  await page.getByRole('button', { name: 'Kirim Penjelasan', exact: true }).click();
  await expect(page.locator('.concept-note[role=status]')).toContainText('Periksa umpan balik');
  expect((await state(page)).phase).toBe('EXPLANATION');

  // Revise with correct answers
  for (const id of ['concept_neutral', 'both_signs', 'insulator_vs_conductor', 'separation_effect']) {
    await page.locator(`[name=${id}]`).selectOption('0');
  }
  await page.getByRole('button', { name: 'Kirim Penjelasan', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('REFLECTION');

  // Submit reflection
  await page.locator('textarea[name=reflection]').fill('Benda netral dapat ditarik karena adanya polarisasi muatan tanpa transfer elektron.');
  await page.getByRole('button', { name: 'Kirim & Tampilkan Hasil', exact: true }).click();
  await expect.poll(async () => (await state(page)).phase).toBe('RESULTS');
  await expect.poll(async () => page.evaluate(() => window.__audioProbe.frequencies.includes(1047))).toBe(true);

  // Verify saved data
  const data = await saved(page);
  expect(data.phase).toBe('RESULTS');
  expect(data.prediction).toEqual([0, 0]);
  expect(data.explanations.length).toBe(2);
  expect(data.reflection).toContain('polarisasi');
  expect(await page.evaluate(() => localStorage.getItem('electroquest.mission3.completed.v1'))).toBe('true');
  await expect(page.locator('.mission3-completion')).toContainText('Selamat, Raka!');
  await page.screenshot({path:'docs/console-ui-evidence/result-3.png'});
  await expect.poll(async () => page.locator('.mission3-completion-art img').evaluate(img => img.naturalWidth)).toBe(640);
  await expect(page.getByRole('button', { name: 'Kembali ke Beranda', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Lihat catatan pengamatan', exact: true }).click();
  await expect(page.locator('.warehouse-lesson')).toContainText('Pengamatan & Perbandingan Polarisasi');
  await page.getByRole('button', { name: 'Kembali ke ucapan selamat', exact: true }).click();
  await expect(page.locator('.mission3-completion')).toBeVisible();
  for (const viewport of [{ width: 865, height: 700 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const layout = await page.locator('.warehouse-lesson').evaluate(dialog => {
      const art = dialog.querySelector('.mission3-completion-art img').getBoundingClientRect();
      const dialogBox = dialog.getBoundingClientRect();
      return {
        artLeft: art.left,
        artRight: art.right,
        dialogLeft: dialogBox.left,
        dialogRight: dialogBox.right,
        scrollWidth: dialog.scrollWidth,
        clientWidth: dialog.clientWidth
      };
    });
    expect(layout.artLeft).toBeGreaterThanOrEqual(layout.dialogLeft);
    expect(layout.artRight).toBeLessThanOrEqual(layout.dialogRight);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    await page.screenshot({path:`docs/console-ui-evidence/result-3-${viewport.width}.png`});
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: 'Kembali ke Beranda', exact: true }).click();
  expect(errors).toEqual([]);
  await expect(page.locator('body')).toHaveAttribute('data-screen', 'landing');

  expect(errors).toEqual([]);
});
