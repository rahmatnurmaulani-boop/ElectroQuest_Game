import {missionResult} from './MissionResult';
import {polarizationMicroscope} from './polarizationDiagram';
import {
  type PolarizationSession,
  investigatedPolarization
} from '../learning/polarization';
import {
  POLARIZATION_PREDICTIONS,
  POLARIZATION_QUESTIONS
} from '../content/mission03';
import {mountGameDialog, focusDialog} from './gameDialogs';
import {trapDialogTab} from './dialogFocus';
import {decorateUI, speaker, icon} from './UISkin';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));

export class WarehouseLessonPanel {
  readonly controls = document.createElement('div');
  private dialog = document.createElement('dialog');
  private predictionDialog = document.createElement('dialog');
  private abort = new AbortController();
  private live = document.createElement('div');
  private mode: 'lesson' | 'observations' | 'microscope' = 'lesson';
  private viewKey='';

  constructor(
    private action: (name: string, data: FormData | null) => void,
    private modal: (value: boolean) => void
  ) {
    // Touch & interaction controls
    this.controls.className = 'mission-controls warehouse-controls';
    this.controls.innerHTML =
      '<p id="interaction-prompt" role="status"></p>' +
      '<div class="touch-controls" role="group" aria-label="Kontrol Raka">' +
      '<button data-direction="-1" aria-label="Berjalan ke kiri" aria-pressed="false">Kiri</button>' +
      '<button data-direction="1" aria-label="Berjalan ke kanan" aria-pressed="false">Kanan</button>' +
      '<button data-interact disabled>Periksa terminal</button>' +
      '</div>';
    document.querySelector('.game-stage')!.append(this.controls);
    decorateUI(this.controls);

    // Live HUD overlay
    this.live.className = 'bridge-live warehouse-live';
    this.live.innerHTML =
      '<p role="status" data-polar-status></p>' +
      '<button data-live-latch>Kunci baki pengumpulan</button>' +
      '<button data-live-reset>Reset eksperimen</button>';
    document.querySelector('.game-stage')!.append(this.live);
    this.live
      .querySelector('[data-live-latch]')!
      .addEventListener('click', () => action('latch', null), { signal: this.abort.signal });
    this.live
      .querySelector('[data-live-reset]')!
      .addEventListener('click', () => action('reset', null), { signal: this.abort.signal });

    // Dialog setup
    this.dialog.className = 'inspection bridge-terminal warehouse-lesson';
    this.dialog.setAttribute('aria-label', 'Pembelajaran Gudang Polarisasi');
    mountGameDialog(this.dialog);
    this.predictionDialog.className = 'inspection bridge-terminal warehouse-prediction';
    this.predictionDialog.setAttribute('aria-label', 'Prediksi Gudang Polarisasi');
    mountGameDialog(this.predictionDialog);
    for (const dialog of [this.dialog, this.predictionDialog]) {
      dialog.addEventListener('cancel', e => {
        e.preventDefault();
        this.close();
      }, { signal: this.abort.signal });

      dialog.addEventListener('keydown', e => {
        trapDialogTab(dialog, e);
        if (e.repeat && (e.key === 'Enter' || e.key === ' ')) e.preventDefault();
      }, { signal: this.abort.signal });

      dialog.addEventListener('click', e => {
        const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
        if (!b || b.disabled) return;
        const a = b.dataset.action!;
        if (a === 'close') {
          this.close();
          return;
        }
        if (a === 'observations') {
          this.mode = 'observations';
          this.action('render', null);
          return;
        }
        if (a === 'microscope') {
          this.mode = 'microscope';
          this.action('render', null);
          return;
        }
        this.action(a, new FormData(dialog.querySelector('form')!));
      }, { signal: this.abort.signal });
    }
  }

  get isOpen() {
    return this.dialog.open || this.predictionDialog.open;
  }

  open(
    s: PolarizationSession,
    mode: 'lesson' | 'observations' | 'microscope' = 'lesson',
    feedback = ''
  ) {
    this.mode = mode;
    const wasOpen = this.dialog.open || this.predictionDialog.open;
    this.render(s, feedback);
    const target = this.targetDialog(s);
    if (!target.open) {
      if (!wasOpen) this.modal(true);
      target.showModal();
    }
    target.scrollTop = 0;
    focusDialog(target);
  }

  close() {
    if (!this.dialog.open && !this.predictionDialog.open) return;
    if (this.dialog.open) this.dialog.close();
    if (this.predictionDialog.open) this.predictionDialog.close();
    this.modal(false);
    document.querySelector<HTMLElement>('.game-stage')?.focus({ preventScroll: true });
  }

  nearby(near: boolean) {
    this.controls.querySelector<HTMLButtonElement>('[data-interact]')!.disabled = !near;
    const p = this.controls.querySelector<HTMLElement>('#interaction-prompt')!;
    p.textContent = near ? 'E — Periksa' : '';
    p.dataset.nearby = String(near);
    p.style.left = '18.75%';
  }

  update(s: PolarizationSession) {
    const running = s.phase === 'SOLUTION' && s.model.phase !== 'CLEARED';
    this.live.hidden = !running;
    this.live.querySelector('[data-polar-status]')!.textContent =
      `Kertas: ${s.model.collectedCount}/${s.model.papers.length} · ${s.model.message}`;

    const objMap: Record<string, string> = {
      PROBLEM: 'Dengarkan masalah dari Ion di gudang.',
      OBSERVATION: 'Dekati terminal dan amati serpihan kertas netral.',
      PREDICTION: 'Jawab dua prediksi awal tentang tarikan netral.',
      INVESTIGATION: 'Bandingkan tanda sumber, jarak, dan jenis bahan.',
      SOLUTION: s.model.phase === 'CLEARED'
        ? 'Jalur gudang bersih! Antar Raka ke pintu keluar di kanan.'
        : 'Arahkan serpihan kertas ke baki pengumpulan dengan sumber bermuatan.',
      EXPLANATION: 'Jelaskan konsep polarisasi berdasarkan bukti.',
      REFLECTION: 'Isi refleksi pembelajaran opsional.',
      RESULTS: 'Misi 3 selesai.'
    };
    const objEl = document.querySelector('#active-objective');
    if (objEl) objEl.textContent = objMap[s.phase] ?? '';
  }

  private targetDialog(s: PolarizationSession) {
    return this.mode === 'lesson' && s.phase === 'PREDICTION'
      ? this.predictionDialog
      : this.dialog;
  }

  render(s: PolarizationSession, feedback = '') {
    const key=this.mode+':'+s.phase,changed=key!==this.viewKey;this.viewKey=key;const target=this.targetDialog(s),opened=this.dialog.open?this.dialog:this.predictionDialog.open?this.predictionDialog:null;const oldAction=(document.activeElement as HTMLElement|null)?.getAttribute('data-action');
    const active = document.activeElement as HTMLInputElement | null;
    const name = active?.name;
    const value = active?.value;
    const scroll = target.scrollTop;

    const button = (a: string, t: string, disabled = false) =>
      `<button type="button" data-action="${a}" ${disabled ? 'disabled' : ''}>${t}</button>`;

    const select = (name: string, text: string, options: readonly string[]) =>
      `<label>${text}<select name="${name}" aria-label="${text}"><option value="">Pilih jawaban</option>${options
        .map((t, i) => `<option value="${i}">${t}</option>`)
        .join('')}</select></label>`;

    const table = `<div class="bridge-table"><table><caption>Snapshot Pengamatan Polarisasi</caption><thead><tr><th>ID</th><th>Sumber Q</th><th>Bahan</th><th>Jarak r (px)</th><th>Polarisasi P</th><th>|F| gaya</th><th>Muatan Netto</th></tr></thead><tbody>${s.observations
      .map(
        o =>
          `<tr><td>${o.id}</td><td>${o.sourceCharge > 0 ? '+' : ''}${o.sourceCharge}</td><td>${
            o.targetType === 'paper' ? 'Kertas (Isolator)' : 'Logam (Konduktor)'
          }</td><td>${o.distance}</td><td>${o.polarization}</td><td>${o.force}</td><td>${o.netCharge} (Netral)</td></tr>`
      )
      .join('')}</tbody></table></div>`;

    let title = 'Gudang Polarisasi';
    let body = '';

    if (this.mode === 'observations') {
      title = 'Pengamatan & Perbandingan Polarisasi';
      body =
        table +
        `<ul>${s.comparisons
          .map(
            c =>
              `<li>#${c.a} → #${c.b}: ${
                c.kind === 'sign'
                  ? 'Tanda muatan (+ vs -)'
                  : c.kind === 'distance'
                  ? 'Jarak sumber (dekat vs jauh)'
                  : 'Bahan (konduktor vs isolator)'
              }, Rasio gaya = ${c.ratio}</li>`
          )
          .join('')}</ul>` +
        button('lesson', s.phase === 'RESULTS' ? 'Kembali ke ucapan selamat' : 'Kembali ke pembelajaran');
    } else if (this.mode === 'microscope') {
      title = 'Distribusi Muatan · Pembesaran Skematis';
      body=polarizationMicroscope(s.model.sourceCharge)+button('lesson','Kembali ke pembelajaran');
    } else if (s.phase === 'PROBLEM') {
      title = 'Ion · Koridor Gudang Tertutup Kertas';
      body =
        '<p>Koridor gudang tertutup serpihan kertas isolator yang menghalangi jalan Raka ke pintu keluar.</p>' +
        '<p>Raka memiliki alat penggeser sumber muatan di atas rel. Gunakan gejala polarisasi untuk menarik serpihan kertas tanpa menyentuhnya, lalu kumpulkan ke baki pengumpulan berpengunci mekanis.</p>' +
        button('observe', 'Lanjut ke Observasi');
    } else if (s.phase === 'OBSERVATION') {
      title = 'Observasi Benda Netral';
      body =
        '<p>Serpihan kertas di lantai dan bola demo di dudukan awalnya berada dalam kondisi netral (q_net = 0).</p>' +
        '<p>Artinya, jumlah proton (+) dan elektron (-) di dalamnya seimbang sempurna. Batang sumber muatan di atas rel dapat digeser mendekat atau menjauh.</p>' +
        button('predict', 'Lanjut ke Prediksi');
    } else if (s.phase === 'PREDICTION') {
      title = 'Prediksi Awal Polarisasi';
      body =
        POLARIZATION_PREDICTIONS.map((q, i) =>
          select(`pred_${i}`, q.question, q.options)
        ).join('') +
        '<p>Prediksi awal disimpan dan tidak dinilai penalti jika salah. Eksperimen akan menguji prediksimu.</p>' +
        button('prediction', 'Simpan Prediksi Awal');
    } else if (s.phase === 'INVESTIGATION' || s.phase === 'SOLUTION') {
      title = s.phase === 'INVESTIGATION' ? 'Penyelidikan Polarisasi' : 'Solusi Pembersihan Gudang';
      const m = s.model;
      body =
        `<div class="bridge-data">` +
        `<p>Posisi Sumber: x = ${m.sourceX} px · Muatan Sumber: ${
          m.sourceCharge > 0 ? '+3' : m.sourceCharge < 0 ? '-3' : '0 (Netral)'
        }</p>` +
        `<p>Kertas Terkumpul: ${m.collectedCount}/${m.papers.length} · Penahan Baki: ${
          m.trayLatchClosed ? 'Terkunci' : 'Terbuka'
        }</p>` +
        `<p>Model dipol efektif: F_polar = 2*k*alpha*(Q^2)/r^5 (Penyederhanaan pembelajaran).</p>` +
        `</div>` +
        `<fieldset><legend>Pengaturan Sumber Muatan</legend>` +
        button('charge-pos', 'Atur Sumber Positif (+3)', m.sourceCharge === 3) +
        button('charge-neg', 'Atur Sumber Negatif (-3)', m.sourceCharge === -3) +
        button('charge-zero', 'Matikan Sumber (q = 0)', m.sourceCharge === 0) +
        `<label>Posisi Sumber X (px)` +
        `<input name="sourceX" aria-label="Posisi Sumber X" type="range" min="150" max="520" step="5" value="${m.sourceX}">` +
        `</label>` +
        button('apply-x', 'Terapkan Posisi') +
        `</fieldset>` +
        `<p>Pintasan Posisi Rel:</p>` +
        button('pos-tray', 'Posisikan di atas Baki (x = 180)') +
        button('pos-center', 'Posisikan di Tengah Kertas (x = 340)') +
        button('pos-far', 'Posisikan Jauh di Kanan (x = 500)') +
        button('microscope', 'Lihat Mikroskop Distribusi Muatan');

      if (s.phase === 'INVESTIGATION') {
        body +=
          `<fieldset><legend>Ambil Snapshot Pengamatan</legend>` +
          button('snap-paper', 'Simpan Pengamatan Kertas (Isolator)') +
          button('snap-metal', 'Simpan Pengamatan Logam Demo (Konduktor)') +
          `</fieldset>` +
          table;

        if (s.observations.length >= 2) {
          const opts = s.observations
            .map(o => `<option value="${o.id}">#${o.id} (${o.targetType === 'paper' ? 'Kertas' : 'Logam'}, Q=${o.sourceCharge})</option>`)
            .join('');
          body +=
            `<label>Pengamatan 1<select name="a" aria-label="Pengamatan 1">${opts}</select></label>` +
            `<label>Pengamatan 2<select name="b" aria-label="Pengamatan 2">${opts}</select></label>` +
            button('compare', 'Bandingkan Kedua Pengamatan') +
            `<p>Status Penyelidikan: ${
              investigatedPolarization(s)
                ? 'Terpenuhi (minimal 2 perbandingan terbukti).'
                : `Belum cukup (${s.comparisons.length}/2 perbandingan terbukti).`
            }</p>` +
            button('solution', 'Lanjut ke Solusi Pembersihan', !investigatedPolarization(s));
        }
      } else {
        // SOLUTION phase
        body +=
          `<fieldset><legend>Tindakan Pembersihan Jalur</legend>` +
          button('guide-tray', 'Pandu Serpihan Menuju Baki (Geser ke x=180)') +
          button('latch', 'Kunci Penahan Baki Pengumpulan') +
          `</fieldset>` +
          `<p>Setelah seluruh serpihan terkumpul di baki dan penahan terkunci, pintu keluar akan terbuka. Raka dapat berjalan melintasi koridor ke pintu keluar.</p>`;
      }

      body +=
        button('scan', 'Pindai Medan Polarisasi') +
        button('reset', 'Reset Eksperimen') +
        button('hint', 'Petunjuk Bertingkat') +
        `<p>Bantuan digunakan: ${s.hints}/3 (informasi belajar, tanpa pengurangan nilai).</p>`;
    } else if (s.phase === 'EXPLANATION') {
      title = 'Penjelasan Konsep Polarisasi';
      const last = s.explanations.at(-1);
      body =
        POLARIZATION_QUESTIONS.map(
          (q, i) =>
            select(q.id, q.question, q.options) +
            (last
              ? `<p class="concept-note">${
                  last.correct[i] ? '✓ Jawaban tepat.' : '✗ Periksa kembali.'
                } ${q.explanation}</p>`
              : '')
        ).join('') +
        button('explain', 'Kirim Penjelasan') +
        button('observations', 'Lihat Catatan Pengamatan');
    } else if (s.phase === 'REFLECTION') {
      title = 'Refleksi Pembelajaran (Opsional)';
      body =
        '<p>Penjelasan konsep telah berhasil diverifikasi sesuai bukti eksperimen!</p>' +
        '<p>Tuliskan kesimpulan atau hal baru yang kamu pelajari tentang listrik statis dan polarisasi (opsional, tidak dinilai otomatis):</p>' +
        `<label><textarea name="reflection" maxlength="2000">${escape(s.reflection)}</textarea></label>` +
        button('results', 'Kirim & Tampilkan Hasil');
    } else {
      title = 'Misi 3 selesai';
      const correct = s.explanations.at(-1)?.correct.filter(Boolean).length ?? 0;
      body=missionResult({mission:3,title:'Selamat, Raka!',description:'Koridor gudang terbuka dan serpihan netral terkumpul di baki, tanpa transfer muatan melalui kontak.',stats:[{value:s.model.collectedCount+'/'+s.model.papers.length,label:'Serpihan terkumpul'},{value:s.comparisons.length,label:'Perbandingan dicatat'},{value:correct+'/'+POLARIZATION_QUESTIONS.length,label:'Jawaban konsep benar'}],summary:`<h3>Prediksi awal</h3><ul>${POLARIZATION_PREDICTIONS.map((p, i) => `<li>${p.question}: <em>${escape(p.options[s.prediction?.[i] ?? 0])}</em></li>`).join('')}</ul>` +
        table +
        `<p><strong>Perbandingan:</strong> ${s.comparisons.map(c => `#${c.a}→#${c.b} (${c.kind}, rasio ${c.ratio})`).join('; ')}</p>` +
        `<ol>${s.explanations.map((e, i) => `<li>${i === 0 ? 'Percobaan pertama' : `Revisi ke-${i}`}: ${e.correct.filter(Boolean).length}/${POLARIZATION_QUESTIONS.length} benar</li>`).join('')}</ol>` +
        `<p><strong>Refleksi:</strong> ${escape(s.reflection) || 'Dilewati.'}</p>` +
        `<p>Bantuan digunakan: ${s.hints} · Total reset eksperimen: ${s.attempts.length}.</p>`,actions:button('observations','Lihat catatan pengamatan')+button('replay','Ulang Misi 3')+button('missions','Pilih misi')+button('home','Kembali ke Beranda')});
    }

    target.innerHTML =
      `<h2 tabindex="-1">${title}</h2>` +
      `<form onsubmit="return false">` +
      (feedback ? `<p class="concept-note" role="status">${escape(feedback)}</p>` : '') +
      body +
      (s.phase === 'RESULTS' && this.mode === 'lesson' ? '' : `<div>${button('close', 'Tutup')}</div>`) +
      `</form>`;
    target.classList.toggle('mission3-complete', s.phase === 'RESULTS' && this.mode === 'lesson');

    decorateUI(target);
    if (s.phase === 'PROBLEM') speaker(target, 'Ion');

    for (const b of target.querySelectorAll('button[data-action]')) {
      const a = b.getAttribute('data-action')!;
      const key =
        a === 'observe'
          ? 'm3-icon-observe'
          : a === 'predict' || a === 'prediction'
          ? 'm3-icon-polarize'
          : a === 'compare'
          ? 'm2-icon-compare'
          : a === 'guide-tray' || a === 'latch'
          ? 'm3-icon-collect'
          : a === 'reset'
          ? 'm3-icon-reset'
          : a === 'hint'
          ? 'm3-icon-help'
          : a.startsWith('charge')
          ? 'm3-icon-wand'
          : null;
      if (key) icon(b, key);
    }

    if (opened && opened !== target) {
      opened.close();
      opened.replaceChildren();
      target.showModal();
    }
    target.scrollTop = scroll;
    if (name) {
      const el = target.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`);
      if (el) {
        el.value = value ?? '';
        el.focus({ preventScroll: true });
      }
    }
    if(changed)target.scrollTop=0;else if(oldAction){const b=target.querySelector<HTMLButtonElement>(`button[data-action="${oldAction}"]`);if(b&&!b.disabled)b.focus({preventScroll:true})}if(target.open&&!target.contains(document.activeElement))focusDialog(target);
    this.update(s);
  }

  destroy() {
    this.abort.abort();
    this.dialog.close();
    this.predictionDialog.close();
    this.dialog.remove();
    this.predictionDialog.remove();
    this.controls.remove();
    this.live.remove();
  }
}
