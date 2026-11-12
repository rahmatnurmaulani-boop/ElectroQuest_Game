# Asal audio — Tahap 7

Musik dan efek suara dibuat secara prosedural, tanpa rekaman, sampel stok, unduhan, atau API generasi berbayar. Musik delapan bar dirender lokal dari notasi asli di `src/audio/score.ts`; setiap tema memakai tempo, melodi, pad, bass, dan aksen ritmis sendiri. Musik dan efek diputar melalui satu `AudioContext` milik `AudioBus`.

| Efek | Sumber sintesis | Pemicu |
|---|---|---|
| Klik UI | Sine 520 Hz | Klik tombol/summary |
| Langkah | Triangle 100 Hz, pendek | Saat Raka benar-benar berjalan, dibatasi 0,25 detik global (0,28 detik di Misi 2) |
| Pemindaian | Sine 300/600/900 Hz | Membuka terminal atau memeriksa panel |
| Transfer elektron | Sine 780/1100 Hz | Transaksi sah saja |
| Gerbang bergerak | Triangle 90/105 Hz | Pulsa minimal 0,35 detik selama simulasi |
| Kait terkunci | Sine 180/360 Hz | Transisi mekanis ke OPENED |
| Kertas terkumpul | Sine 880/1175/1568 Hz | Serpihan masuk baki, dibatasi 0,14 detik |
| Misi selesai | Sine 523/659/784/1047 Hz | Halaman hasil final, bukan sekadar pengumpulan berhasil |
| Percobaan terhenti | Sine 160/130 Hz | Platform berhenti tanpa docking |

Suara memakai envelope gain pendek, bukan loop audio tanpa batas. Maksimum 16 oscillator aktif; setiap oscillator dihentikan dan diputus setelah selesai. Pemicu langkah/gerbang dibatasi waktu permainan, bukan setiap frame. Pause, blur, reset, perubahan pengaturan dan shutdown menghentikan suara aktif. Klik UI pada menu pause masih dapat terdengar sebagai respons antarmuka.

Skor musik: landing 88 BPM tenang; Misi 1 92 BPM eksploratif; Misi 2 100 BPM lebih berenergi; Misi 3 84 BPM lebih fokus. Masing-masing memiliki pulse ritmis halus tersendiri, dengan loop 18–23 detik dan transisi lembut.

AudioContext baru dibuat setelah pointerdown/keydown pengguna. State suspended dicoba resume melalui interaksi pengguna; kegagalan constructor/resume/play ditangani tanpa menghentikan permainan. Phaser audio bawaan tetap dinonaktifkan agar tidak ada mixer kedua. Satu AudioBus dipakai sepanjang aplikasi; listener dapat dibuang pada HMR dan suara misi dibersihkan saat scene ditinggalkan.

Volume efektif `master × effects × 0,12` membatasi puncak envelope. Mute atau salah satu volume 0 mencegah penjadwalan suara. Pengaturan suara tidak menentukan hasil puzzle dan tidak mengganti petunjuk visual/teks.

Pemeriksaan Chromium menggunakan graph Web Audio native yang diinstrumentasi untuk memastikan context belum dibuat sebelum gesture, resume dipanggil saat suspended, oscillator dijadwalkan, mute menahan penjadwalan, dan gain mengikuti volume (0,2 × 0,3 × 0,12 = 0,0072). Kegagalan AudioContext juga disimulasikan. Ini pemeriksaan API/penjadwalan, bukan penilaian kualitas suara melalui speaker/headphone atau bukti audio pada TV fisik.
