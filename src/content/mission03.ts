export const WAREHOUSE = {
  title: 'Gudang Polarisasi',
  floorY: 304,
  corridorLeft: 220,
  corridorRight: 460,
  terminalX: 120,
  terminalRange: 48,
  trayX: 180, // Collection tray center X
  trayY: 304,
  trayWidth: 128,
  sourceMinX: 150,
  sourceMaxX: 520,
  sourceY: 170, // carriage Y
  wandLength: 80,
  wandHeadY: 250, // tip of wand hangs down
  minClearance: 28, // minimum distance so wand never touches paper directly
  paperCount: 6,
  exitX: 580
} as const;

export const WAREHOUSE_REQUIRED = [
  'm3-storage-layer', 'm3-insulator-stage', 'm3-conductor-stage', 'm3-icon-clearance', 'm3-tray-ready', 'm3-source-wand-long',
  'm3-bg-wall',
  'm3-shelves',
  'm3-rear',
  'm3-floor-left',
  'm3-floor-middle',
  'm3-floor-right',
  'm3-crate-stack',
  'm3-lamp',
  'm3-tray',
  'm3-tray-latch-open',
  'm3-tray-latch-closed',
  'm3-paper-1',
  'm3-paper-2',
  'm3-paper-3',
  'm3-paper-4',
  'm3-paper-pile',
  'm3-demo-stand',
  'm3-demo-sphere',
  'm3-source-carriage',
  'm3-source-wand',
  'm3-rail-left',
  'm3-rail-middle',
  'm3-rail-right',
  'm3-slider-grip',
  'm3-terminal',
  'm3-exit-closed',
  'm3-exit-open',
  'm3-zoom-frame',
  'm3-dipole-neutral',
  'm3-dipole-polarized',
  'm3-metal-neutral',
  'm3-metal-polarized',
  'm3-icon-observe',
  'm3-icon-polarize',
  'm3-icon-collect',
  'm3-icon-reset',
  'm3-icon-help',
  'm3-icon-wand',
  'm3-scan',
  'm3-attract-pulse',
  'm3-success-flash',
  'm3-completion-art',
  'raka-idle',
  'raka-walk',
  'ion-idle'
];

export interface WarehouseQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const POLARIZATION_PREDICTIONS: WarehouseQuestion[] = [
  {
    id: 'attract_neutral',
    question: 'Apakah serpihan kertas yang mula-mula bermuatan netral (q = 0) dapat ditarik oleh batang bermuatan?',
    options: [
      'Ya, benda netral dapat ditarik oleh benda bermuatan karena terjadi pemisahan muatan (polarisasi).',
      'Tidak, hukum Coulomb menyatakan gaya hanya ada jika kedua benda sama-sama memiliki muatan bersih bukan nol.',
      'Hanya bisa jika batang bermuatan positif saja; muatan negatif akan menolak benda netral.'
    ],
    correct: 0,
    explanation: 'Benda netral dapat ditarik karena medan listrik sumber menginduksi pemisahan muatan (polarisasi). Sisi berlawanan tanda lebih dekat sehingga gaya tarik mengungguli gaya tolak.'
  },
  {
    id: 'net_charge',
    question: 'Ketika kertas netral tertarik ke arah batang tanpa pernah menyentuh batang tersebut, apakah kertas memperoleh muatan bersih?',
    options: [
      'Muatan bersih kertas tetap nol (netral); yang terjadi hanyalah pergeseran distribusi muatan terikat.',
      'Kertas menjadi bermuatan positif bersih karena elektronnya ditarik keluar ke udara.',
      'Kertas menjadi bermuatan negatif bersih karena batang memancarkan elektron tanpa kontak.'
    ],
    correct: 0,
    explanation: 'Polarisasi tanpa kontak fisik tidak menyebabkan transfer elektron. Jumlah proton dan elektron kertas tetap sama persis, sehingga muatan totalnya tetap nol.'
  }
];

export const POLARIZATION_QUESTIONS: WarehouseQuestion[] = [
  {
    id: 'concept_neutral',
    question: 'Apa arti keadaan "netral" pada serpihan kertas sebelum didekati sumber bermuatan?',
    options: [
      'Jumlah total muatan positif sama persis dengan jumlah muatan negatif di dalam atom-atomnya.',
      'Kertas sama sekali tidak mengandung elektron maupun proton di dalamnya.',
      'Kertas memiliki medan listrik tak terbatas yang menolak semua partikel di sekitarnya.'
    ],
    correct: 0,
    explanation: 'Benda netral tetap memiliki miliaran elektron dan proton, namun muatan positif dan negatifnya seimbang sempurna sehingga muatan bersihnya nol.'
  },
  {
    id: 'both_signs',
    question: 'Mengapa batang bermuatan positif MAUPUN negatif sama-sama dapat menarik serpihan kertas netral?',
    options: [
      'Karena kutub induksi yang berlawanan tanda selalu berada di sisi yang lebih dekat dengan batang, sehingga gaya tarik selalu lebih kuat daripada gaya tolak.',
      'Karena gravitasi kertas bertambah ketika ada medan listrik di sekitarnya.',
      'Karena batang positif memancarkan proton dan batang negatif memancarkan elektron ke kertas.'
    ],
    correct: 0,
    explanation: 'Muatan berlawanan ditarik mendekat (jarak lebih pendek -> gaya tarik lebih kuat), sedangkan muatan sejenis didorong menjauh (jarak lebih besar -> gaya tolak lebih lemah). Akibatnya gaya netto selalu berupa tarikan.'
  },
  {
    id: 'insulator_vs_conductor',
    question: 'Apa perbedaan mikroskopis polarisasi pada kertas (isolator) dibandingkan pada bola logam (konduktor)?',
    options: [
      'Pada isolator terjadi orientasi dipol muatan terikat pada molekul, sedangkan pada konduktor elektron bebas mengalir melintasi logam.',
      'Pada isolator elektron bebas bergerak ke seluruh permukaan, sedangkan pada konduktor elektron terkunci diam.',
      'Tidak ada perbedaan mikroskopis sama sekali antara konduktor dan isolator.'
    ],
    correct: 0,
    explanation: 'Pada isolator seperti kertas, elektron terikat kuat pada atom/molekul sehingga hanya terjadi peregangan/orientasi dipol. Pada konduktor logam, elektron valensi bebas berpindah melintasi seluruh volume benda.'
  },
  {
    id: 'separation_effect',
    question: 'Apa yang terjadi pada polarisasi serpihan kertas ketika batang bermuatan dijauhkan kembali?',
    options: [
      'Distribusi muatan kembali simetris/acak dan efek polarisasi berkurang hingga hilang.',
      'Kertas akan meledak karena kehilangan gaya penyeimbang.',
      'Kertas tetap mempertahankan kutub muatannya selamanya seperti magnet permanen.'
    ],
    correct: 0,
    explanation: 'Ketika sumber medan dijauhkan, gaya luar yang memisahkan muatan hilang, sehingga energi termal dan gaya internal atom mengembalikan distribusi muatan ke keadaan netral simetris semula.'
  }
];
