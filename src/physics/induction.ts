/**
 * Model Fisika Induksi Elektrostatik dan Pembumian (Grounding)
 *
 * Model ini merupakan penyederhanaan pembelajaran (didactic state model):
 * - Konduktor bola logam memiliki elektron bebas.
 * - Tanpa grounding: mendekatkan sumber hanya menghasilkan redistribusi (polarisasi)
 *   muatan sementara; muatan total bola tetap persis nol.
 * - Dengan grounding: elektron dapat berpindah antara konduktor bola dan reservoir bumi.
 * - Reservoir bumi dicatat secara eksplisit untuk menjaga kekekalan muatan total:
 *     q_bola + q_bumi = 0
 * - Batang sumber tidak mengalami transfer kontak (muatan sumber tetap konstan).
 * - Pemutusan grounding saat sumber dekat menjebak muatan bersih pada bola.
 * - Menjauhkan sumber sebelum grounding diputus menyebabkan bola kembali netral.
 */

export interface InductionModel {
  sourceSign: 3 | -3;
  sourcePos: 'FAR' | 'NEAR';
  groundConnected: boolean;
  sphereCharge: number; // e.g. 0, +2, -2
  earthCharge: number; // tracks electron exchange with earth reservoir
  distribution: 'UNIFORM' | 'POLARIZED_AWAY' | 'POLARIZED_TOWARD';
  lastElectronTransfer: 'NONE' | 'SPHERE_TO_EARTH' | 'EARTH_TO_SPHERE';
  challenge: 1 | 2;
  challenge1Solved: boolean;
  challenge2Solved: boolean;
  measuredCharge: number | null;
  sensorStatus: 'IDLE' | 'ACCEPTED' | 'REJECTED';
  doorOpen: boolean;
  message: string;
}

export function initialInductionModel(challenge: 1 | 2 = 1): InductionModel {
  return {
    sourceSign: challenge === 1 ? -3 : 3,
    sourcePos: 'FAR',
    groundConnected: false,
    sphereCharge: 0,
    earthCharge: 0,
    distribution: 'UNIFORM',
    lastElectronTransfer: 'NONE',
    challenge,
    challenge1Solved: false,
    challenge2Solved: false,
    measuredCharge: null,
    sensorStatus: 'IDLE',
    doorOpen: false,
    message: challenge === 1
      ? 'Tantangan 1: Buat bola bermuatan POSITIF menggunakan induksi untuk mengaktifkan sensor.'
      : 'Tantangan 2: Buat bola bermuatan NEGATIF menggunakan induksi untuk mengaktifkan sensor.'
  };
}

export function setInductionSource(
  model: InductionModel,
  sign: 3 | -3
): InductionModel {
  if (model.sourcePos === 'NEAR') {
    return {
      ...model,
      message: 'Jauhkan batang sumber terlebih dahulu sebelum mengganti modul muatan.'
    };
  }
  return {
    ...model,
    sourceSign: sign,
    message: `Modul batang sumber bermuatan ${sign > 0 ? '+3' : '-3'} dipasang pada penggeser.`
  };
}

export function approachInductionSource(model: InductionModel): InductionModel {
  const next = structuredClone(model);
  next.sourcePos = 'NEAR';
  next.measuredCharge = null;

  if (next.groundConnected) {
    // If ground was already connected, electrons immediately flow to/from earth
    if (next.sourceSign === -3) {
      next.sphereCharge = 2;
      next.earthCharge = -2;
      next.lastElectronTransfer = 'SPHERE_TO_EARTH';
      next.distribution = 'UNIFORM';
      next.message = 'Sumber negatif didekatkan: elektron bola tertolak dan mengalir ke bumi melalui grounding!';
    } else {
      next.sphereCharge = -2;
      next.earthCharge = 2;
      next.lastElectronTransfer = 'EARTH_TO_SPHERE';
      next.distribution = 'UNIFORM';
      next.message = 'Sumber positif didekatkan: elektron dari bumi ditarik masuk ke dalam bola melalui grounding!';
    }
  } else {
    // Ground not connected: temporary polarization only (net charge remains 0)
    if (next.sourceSign === -3) {
      next.distribution = 'POLARIZED_AWAY';
      next.message = 'Sumber negatif didekatkan: elektron bola bergeser menjauhi sumber (sisi kanan). Muatan total bola tetap nol.';
    } else {
      next.distribution = 'POLARIZED_TOWARD';
      next.message = 'Sumber positif didekatkan: elektron bola ditarik mendekati sumber (sisi kiri). Muatan total bola tetap nol.';
    }
    next.lastElectronTransfer = 'NONE';
  }

  return next;
}

export function retractInductionSource(model: InductionModel): InductionModel {
  const next = structuredClone(model);
  next.sourcePos = 'FAR';
  next.measuredCharge = null;

  if (next.groundConnected) {
    // Premature retract: external field disappears while still grounded!
    // Electrons equalize with ground; sphere returns to neutral (0).
    const prevCharge = next.sphereCharge;
    next.sphereCharge = 0;
    next.earthCharge = 0;
    next.distribution = 'UNIFORM';
    if (prevCharge > 0) {
      next.lastElectronTransfer = 'EARTH_TO_SPHERE';
      next.message = 'Sumber dijauhkan saat grounding masih terhubung: elektron dari bumi mengalir kembali menetralkan bola (q = 0).';
    } else if (prevCharge < 0) {
      next.lastElectronTransfer = 'SPHERE_TO_EARTH';
      next.message = 'Sumber dijauhkan saat grounding masih terhubung: kelebihan elektron mengalir ke bumi menetralkan bola (q = 0).';
    } else {
      next.lastElectronTransfer = 'NONE';
      next.message = 'Sumber dijauhkan saat grounding terhubung: bola tetap netral (q = 0).';
    }
  } else {
    // Ground disconnected: trapped charge remains!
    next.distribution = 'UNIFORM';
    next.lastElectronTransfer = 'NONE';
    if (next.sphereCharge !== 0) {
      next.message = `Sumber dijauhkan: grounding sudah diputus sehingga muatan bersih ${
        next.sphereCharge > 0 ? '+' : ''
      }${next.sphereCharge} tersimpan permanen pada bola!`;
    } else {
      next.message = 'Sumber dijauhkan: polarisasi sementara hilang, elektron kembali simetris, bola tetap netral (q = 0).';
    }
  }

  return next;
}

export function connectInductionGround(model: InductionModel): InductionModel {
  const next = structuredClone(model);
  next.groundConnected = true;
  next.measuredCharge = null;

  if (next.sourcePos === 'NEAR') {
    if (next.sourceSign === -3) {
      next.sphereCharge = 2;
      next.earthCharge = -2;
      next.lastElectronTransfer = 'SPHERE_TO_EARTH';
      next.distribution = 'UNIFORM';
      next.message = 'Sakelar grounding ditutup: elektron yang tertolak oleh medan sumber negatif mengalir ke bumi!';
    } else {
      next.sphereCharge = -2;
      next.earthCharge = 2;
      next.lastElectronTransfer = 'EARTH_TO_SPHERE';
      next.distribution = 'UNIFORM';
      next.message = 'Sakelar grounding ditutup: medan sumber positif menarik elektron dari bumi mengalir masuk ke bola!';
    }
  } else {
    // Connecting ground with source far away drains any residual charge
    if (next.sphereCharge > 0) {
      next.lastElectronTransfer = 'EARTH_TO_SPHERE';
      next.message = 'Grounding dihubungkan tanpa medan luar: elektron bumi mengalir menetralkan bola.';
    } else if (next.sphereCharge < 0) {
      next.lastElectronTransfer = 'SPHERE_TO_EARTH';
      next.message = 'Grounding dihubungkan tanpa medan luar: elektron bola mengalir ke bumi.';
    } else {
      next.lastElectronTransfer = 'NONE';
      next.message = 'Sakelar grounding terhubung ke bumi.';
    }
    next.sphereCharge = 0;
    next.earthCharge = 0;
    next.distribution = 'UNIFORM';
  }

  return next;
}

export function disconnectInductionGround(model: InductionModel): InductionModel {
  const next = structuredClone(model);
  next.groundConnected = false;
  next.lastElectronTransfer = 'NONE';
  next.message = next.sourcePos === 'NEAR'
    ? 'Sakelar grounding diputus! Muatan pada bola kini terisolasi dari bumi.'
    : 'Sakelar grounding diputus (terbuka).';
  return next;
}

export function measureInductionCharge(model: InductionModel): InductionModel {
  return {
    ...model,
    measuredCharge: model.sphereCharge,
    message: `Elektrometer mengukur muatan bersih bola: ${
      model.sphereCharge > 0 ? '+' : ''
    }${model.sphereCharge} satuan muatan.`
  };
}

export function testInductionSensor(model: InductionModel): InductionModel {
  const next = structuredClone(model);

  if (next.sourcePos === 'NEAR') {
    next.sensorStatus = 'REJECTED';
    next.message = 'Sensor ditolak: jauhkan batang sumber terlebih dahulu agar medan luar tidak mengganggu sensor!';
    return next;
  }

  if (next.groundConnected) {
    next.sensorStatus = 'REJECTED';
    next.message = 'Sensor ditolak: putuskan sakelar grounding terlebih dahulu!';
    return next;
  }

  if (next.challenge === 1) {
    if (next.sphereCharge > 0) {
      next.challenge1Solved = true;
      next.sensorStatus = 'ACCEPTED';
      next.message = 'Sensor mendeteksi bola bermuatan positif (+2)! Tantangan 1 berhasil. Lanjut ke Tantangan 2.';
    } else {
      next.sensorStatus = 'REJECTED';
      next.message = `Sensor memerlukan muatan positif (+2). Muatan bola saat ini: ${next.sphereCharge}.`;
    }
  } else {
    // Challenge 2
    if (next.sphereCharge < 0) {
      next.challenge2Solved = true;
      next.sensorStatus = 'ACCEPTED';
      next.doorOpen = true;
      next.message = 'Sensor mendeteksi bola bermuatan negatif (-2)! Tantangan 2 berhasil. Pintu laboratorium terbuka!';
    } else {
      next.sensorStatus = 'REJECTED';
      next.message = `Sensor memerlukan muatan negatif (-2). Muatan bola saat ini: ${next.sphereCharge}.`;
    }
  }

  return next;
}

export function resetInductionBench(model: InductionModel): InductionModel {
  return {
    ...model,
    sourcePos: 'FAR',
    groundConnected: false,
    sphereCharge: 0,
    earthCharge: 0,
    distribution: 'UNIFORM',
    lastElectronTransfer: 'NONE',
    measuredCharge: null,
    sensorStatus: 'IDLE',
    message: 'Meja eksperimen direset ke kondisi netral. Bukti tantangan yang telah diselesaikan tetap aman.'
  };
}

export function switchInductionChallenge(
  model: InductionModel,
  targetChallenge: 1 | 2
): InductionModel {
  const reset = resetInductionBench(model);
  return {
    ...reset,
    challenge: targetChallenge,
    sourceSign: targetChallenge === 1 ? -3 : 3,
    message: targetChallenge === 1
      ? 'Tantangan 1: Buat bola bermuatan POSITIF menggunakan induksi.'
      : 'Tantangan 2: Buat bola bermuatan NEGATIF menggunakan induksi.'
  };
}
