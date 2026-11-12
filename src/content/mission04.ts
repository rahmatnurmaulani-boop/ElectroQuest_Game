export const INDUCTION = {
  title: 'Laboratorium Induksi',
  floorY: 304,
  terminalX: 100,
  terminalRange: 48,
  benchX: 280,
  benchY: 304,
  sphereX: 280,
  sphereY: 220,
  standY: 304,
  sourceSliderY: 220,
  sourceFarX: 170,
  sourceNearX: 236, // close to sphere without contact (sphere at 280, radius 16, wand length 32)
  groundSwitchX: 340,
  groundSwitchY: 240,
  earthSymbolX: 340,
  earthSymbolY: 280,
  sensorX: 430,
  sensorY: 304,
  exitX: 580
} as const;

export const INDUCTION_REQUIRED = [
  'm4-bg-lab',
  'm4-rear-props',
  'm4-floor-left',
  'm4-floor-middle',
  'm4-floor-right',
  'm4-bench',
  'm4-ceiling-lamp',
  'm4-demo-sphere',
  'm4-demo-stand',
  'm4-source-slider',
  'm4-slider-grip',
  'm4-source-wand-neg',
  'm4-source-wand-pos',
  'm4-source-wand-zero',
  'm4-ground-switch-open',
  'm4-ground-switch-closed',
  'm4-earth-symbol',
  'm4-charge-sensor',
  'm4-door-closed',
  'm4-door-open',
  'm4-terminal',
  'm4-dist-frame',
  'm4-sphere-neutral',
  'm4-sphere-polar-neg',
  'm4-sphere-polar-pos',
  'm4-sphere-pos-net',
  'm4-sphere-neg-net',
  'm4-icon-approach',
  'm4-icon-retract',
  'm4-icon-ground-on',
  'm4-icon-ground-off',
  'm4-icon-measure',
  'm4-icon-sensor',
  'm4-icon-reset',
  'm4-icon-help',
  'm4-scan',
  'm4-electron-flow',
  'm4-sensor-pass',
  'raka-idle',
  'raka-walk',
  'ion-idle'
];

export interface InductionQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const INDUCTION_PREDICTIONS: InductionQuestion[] = [
  {
    id: 'pred_grounding_purpose',
    question: 'Untuk mengisi bola logam netral dengan muatan induksi, apa fungsi kabel pembumian (grounding)?',
    options: [
      'Menyediakan jalur bagi elektron mengalir ke bumi atau dari bumi akibat tolakan/tarikan medan sumber.',
      'Mengalirkan proton dari dalam tanah langsung ke inti bola logam.',
      'Menghubungkan bola logam ke baterai bertegangan tinggi di dalam tanah.'
    ],
    correct: 0,
    explanation: 'Bumi adalah reservoir elektron yang sangat besar. Grounding memungkinkan elektron mengalir masuk atau keluar saat dipengaruhi medan listrik luar.'
  },
  {
    id: 'pred_sequence_order',
    question: 'Kapan sakelar grounding harus diputus agar bola logam mempertahankan muatan induksinya?',
    options: [
      'Putuskan grounding saat batang sumber muatan MASIH BERADA DI DEKAT bola.',
      'Jauhkan batang sumber terlebih dahulu, baru kemudian putuskan grounding.',
      'Waktu pemutusan grounding tidak berpengaruh sama sekali.'
    ],
    correct: 0,
    explanation: 'Jika sumber dijauhkan sebelum grounding diputus, elektron akan mengalir kembali menetralkan bola sehingga bola kembali netral. Grounding wajib diputus saat medan sumber masih menahan muatan!'
  }
];

export const INDUCTION_QUESTIONS: InductionQuestion[] = [
  {
    id: 'concept_induction_vs_polarization',
    question: 'Apa perbedaan mendasar antara polarisasi sementara dengan pengisian muatan secara induksi?',
    options: [
      'Polarisasi hanya meredistribusi elektron sementara (muatan total tetap nol), sedangkan induksi dengan grounding memindahkan elektron ke/dari bumi sehingga menghasilkan muatan bersih.',
      'Polarisasi hanya terjadi pada isolator, sedangkan induksi hanya terjadi pada gas bertekanan tinggi.',
      'Tidak ada perbedaan, keduanya menghasilkan muatan netto yang sama persis.'
    ],
    correct: 0,
    explanation: 'Pada polarisasi tanpa grounding, tidak ada elektron yang masuk atau keluar (muatan total tetap 0). Induksi memanfaatkan grounding untuk mentransfer elektron sehingga menghasilkan muatan bersih permanen.'
  },
  {
    id: 'role_of_earth',
    question: 'Apa peran bumi (ground) dalam eksperimen pengisian induksi elektrostatik?',
    options: [
      'Sebagai reservoir elektron netral yang sangat besar yang dapat menerima atau memasok elektron tanpa mengubah potensialnya secara signifikan.',
      'Sebagai generator listrik aktif yang memompa muatan positif ke dalam bola logam.',
      'Sebagai isolator sempurna yang memblokir semua medan listrik luar.'
    ],
    correct: 0,
    explanation: 'Bumi memiliki kapasitas muatan yang hampir tak terbatas sehingga bertindak sebagai reservoir elektron ideal.'
  },
  {
    id: 'sign_inversion',
    question: 'Mengapa pengisian muatan melalui induksi SELALU menghasilkan muatan akhir yang BERLAWANAN tanda dengan muatan batang sumber?',
    options: [
      'Karena medan sumber menolak elektron sejenis ke bumi (sumber negatif -> bola positif) atau menarik elektron dari bumi (sumber positif -> bola negatif).',
      'Karena batang sumber menyedot energi dari sensor pintu.',
      'Karena bumi selalu membalik tanda muatan proton secara kimiawi.'
    ],
    correct: 0,
    explanation: 'Batang negatif menolak elektron bola ke tanah, menyisakan kelebihan muatan positif. Batang positif menarik elektron dari tanah ke bola, menghasilkan kelebihan muatan negatif.'
  },
  {
    id: 'premature_retract',
    question: 'Apa akibatnya jika pemain menjauhkan batang sumber sebelum memutuskan sakelar grounding?',
    options: [
      'Gaya tolak/tarik luar hilang, elektron kembali mengalir menyeimbangkan muatan bola, dan bola kembali menjadi netral (q = 0).',
      'Bola logam akan meledak karena kelebihan tegangan.',
      'Bola logam menjadi bermuatan dua kali lipat lebih kuat.'
    ],
    correct: 0,
    explanation: 'Selama grounding terhubung, bola mempertahankan potensial nol terhadap bumi. Tanpa medan luar, elektron segera mengalir kembali menetralkan bola.'
  }
];
