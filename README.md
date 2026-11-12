# ElectroQuest — Penjaga Kota Muatan

Seluruh window kini memakai konsol pixel art bersama: landing, pause/pengaturan, terminal, prediksi, observasi, feedback, penjelasan, refleksi, konfirmasi serta hasil Misi1–3. Tiga ilustrasi hasil baru dipakai oleh satu MissionResult; data tetap berasal dari session. Galeri komponen/status baru:**`/console-gallery.html`**, tanpa mengubah progres. Panduan/tabel aset:[docs/UI_CONSOLE_SYSTEM.md](docs/UI_CONSOLE_SYSTEM.md); QA:[docs/UI_CONSOLE_QA.md](docs/UI_CONSOLE_QA.md).

Produksi UI:`npm.cmd run assets:console`; validasi:`npm.cmd run assets:console:validate`. Jalankan:`npm.cmd run dev`; build:`npm.cmd run build`; unit:`npm.cmd run test:unit`; browser:`npm.cmd test`. Konfirmasi game kini modal aplikasi, bukan popup browser.

Aset Misi3 dilengkapi dengan rak transparan, skema polarisasi dinamis, indikator baki dan batang yang sejajar titik fisika. Rebuild `npm.cmd run assets:mission03`; validasi `npm.cmd run assets:mission03:validate`. Inventaris48 PNG dan batas pemeriksaan:[docs/MISSION_03_ASSETS.md](docs/MISSION_03_ASSETS.md).

Misi 2 **Jembatan Coulomb** dapat dimainkan dari **Pilih misi** setelah menyelesaikan Misi 1. Pengamatan/perbandingan, solusi fisika, docking, penyeberangan, penjelasan, refleksi dan hasil memiliki checkpoint terpisah.46 aset Misi 2 sudah dipasang, termasuk motor rusak dan sambungan docking baru. Instruksi/solusi:[docs/MISSION_02.md](docs/MISSION_02.md); panduan guru:[docs/PANDUAN_GURU.md](docs/PANDUAN_GURU.md); pemeriksaan:[docs/MISSION_02_QA.md](docs/MISSION_02_QA.md).

Jalankan `npm.cmd run dev` dan buka URL terminal. Build:`npm.cmd run build`; TypeScript:`npm.cmd run check`; unit:`npm.cmd run test:unit`; aset:`npm.cmd run assets:mission02:validate`. Produksi ulang:`npm.cmd run assets:mission02`. URL `/?preview=mission-02` tetap preview demonstrasi lama, bukan alur belajar misi penuh.

ElectroQuest dibuka dengan layar judul pixel art satu komposisi. Menu utama menyediakan Mulai Petualangan, Lanjutkan jika checkpoint valid, Cara Bermain, Tentang Misi dan Pengaturan melalui overlay. Pada layar pendek/ponsel, halaman boleh digulir. Saat bermain, hanya arena 640 × 360 dengan rasio 16:9 yang ditampilkan. Gameplay, alur belajar, pengaturan dan checkpoint tetap digunakan.

## Antarmuka game dan galeri UI

- Tekan **Lanjut** pada dialog Ion, dekati terminal dengan A/D atau panah, lalu tekan E. Di terminal, periksa kedua panel dan pilih **Buat prediksi**. Setelah prediksi disimpan, buka terminal kembali untuk bereksperimen.
- Prediksi, penjelasan, refleksi dan hasil memakai overlay di dalam arena; panel panjang bergulir secara internal. Kontrol gerak disembunyikan dan input karakter berhenti selama dialog terbuka.
- Escape membuka pause dari arena atau dialog belajar, dan menutup terminal. Pause menyediakan Lanjutkan, Pengaturan, Cara bermain, Baca kembali tujuan/dialog, Kembali ke Beranda dan Reset eksperimen. Selesai membaca hasil, **Kembali ke arena** mengizinkan berjalan lagi.
- Pada sentuh, tahan tombol arah kiri bawah; gunakan interaksi kanan bawah. Pengaturan dapat menyembunyikan kontrol sentuh. Tampilan portrait mempertahankan seluruh arena, sehingga panel menggunakan scroll internal yang lebih pendek.
- Galeri komponen dan status: **`/ui-gallery.html`**. Galeri aset mentah lama tetap tersedia di `/gallery.html`.
- Buat ulang hanya tambahan UI: `npm.cmd run assets:ui`. Validasi: `npm.cmd run assets:ui:validate`. Sumber produksi: `scripts/assets/ui.mjs`; metadata produksi: `assets-source/ui-production.json`. `assets:build` juga menyertakan generator UI.

Inventaris pemasangan dan batas pemeriksaan: [docs/UI_ASSETS.md](docs/UI_ASSETS.md). Uji khusus: `npm.cmd test -- tests/immersive.spec.js tests/ui-assets.spec.js` setelah build.

## Uji manual beranda

1. Buka aplikasi: judul, menu dan diorama Raka/Ion tampil dalam satu komposisi. Gunakan Tab/Enter untuk membuka **Cara Bermain** dan **Tentang Misi**; Escape/Tutup kembali ke tombol pemicu.
2. Buka **Pengaturan**. Coba Mute, volume, Kurangi efek dan Teks lebih besar. Escape menutup pengaturan. Audio tidak dimulai sebelum interaksi pengguna. **Jeda animasi** menghentikan gerakan dekorasi.
3. Tekan **Mulai Petualangan**. Perhatikan progres loader sebenarnya. **Kembali** membatalkan pemuatan dan membuka layar judul. Setelah masuk game, berjalan dengan A/D atau panah; dekati terminal dan tekan E.
4. Pause → **Kembali ke Beranda**. Tombol utama menjadi **Lanjutkan**, dengan **Mulai Baru** sebagai pilihan terpisah. Lanjutkan memulihkan posisi serta alur belajar tersimpan.
5. Pilih **Mulai Baru**, batalkan: progres tetap ada. Konfirmasi: sesi baru menggantikan checkpoint setelah pemuatan berhasil. Preferensi tetap tersimpan.
6. Untuk mencoba kegagalan, blokir request sky.png di DevTools, lalu mulai misi. Pesan gagal dan tombol **Coba lagi** muncul; buka blokir dan coba lagi. Checkpoint lama tetap aman saat pemuatan gagal.

Preview produksi: `npm.cmd run build`, lalu `npm.cmd run preview`; buka URL Local yang dicetak terminal. Vite memakai port berikutnya jika port awal sibuk. Bukti dan batas pemeriksaan: [docs/LANDING.md](docs/LANDING.md).

Aset landing terbaru dibuat dari nol: enam ilustrasi imagegen dan 20 UI/efek prosedural. Rebuild dari master tersimpan: `npm.cmd run assets:landing:v2`; validasi: `npm.cmd run assets:landing:v2:validate`. Master/prompt ada di `assets-source/landing-v2/`, hasil di `public/assets/landing/lp-*.png`. Raka/Ion merupakan pose statis; hanya Ion melayang melalui kode. Inventaris, pemasangan dan bukti pemeriksaan: [docs/LANDING_ASSETS_V2.md](docs/LANDING_ASSETS_V2.md). Generator landing lama dipertahankan sebagai riwayat, bukan sumber ilustrasi halaman terbaru.

## Menjalankan

Gunakan Node.js 22.12+ atau 24+. Dari PowerShell:

```powershell
cd 'F:\Kerjaan\Bestpractice\Game Interaktif\ElectroQuest'
npm.cmd ci
npm.cmd run dev
```

Jika dependensi sudah terpasang, langsung jalankan perintah dev. Buka URL **Local** yang tercetak, biasanya http://127.0.0.1:5173. Vite memilih port berikutnya jika sibuk. Hentikan server dengan Ctrl+C. Tidak ada CDN atau akun layanan yang diperlukan aplikasi.

## Memeriksa dan membangun

```powershell
npm.cmd run check
npm.cmd run assets:validate
npm.cmd run test:unit
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

`check` menjalankan TypeScript strict tanpa emit. `build` memeriksa TypeScript lalu menghasilkan dist/. `test` menjalankan Chromium terhadap hasil build di port khusus 4181; jalankan build setelah perubahan kode sebelum test. Jika Chromium belum tersedia, jalankan `npx.cmd playwright install chromium` sekali. Preview produksi biasanya memakai http://127.0.0.1:4177; gunakan URL terminal jika port berubah. Dependensi terkunci dalam package-lock.json.

## Struktur

- `src/scenes/`: BootScene, MenuScene, MissionScene dan siklus perpindahannya.
- `src/content/`: tipe/validasi manifest, koordinat dunia, konten misi.
- `src/content/learning.ts`: dialog, pertanyaan, opsi, kunci, petunjuk dan feedback.
- `src/learning/session.ts`: state machine belajar dan snapshot riwayat, terpisah dari model fisika.
- `src/storage/progress.ts`: validasi dan checkpoint lokal aman; `src/audio/AudioBus.ts`: tujuh efek Web Audio asli melalui kode, tanpa berkas musik.
- `src/entities/`: lingkungan, gerbang terpisah, animasi Raka dan Ion memakai manifest.
- `src/physics/`: model murni transfer atomik, muatan, gaya dan simulasi gerbang; gerakan Raka/lantai/batas arena terpisah.
- `src/input/`: satu status keyboard/pointer, kepemilikan pointer dan pembersihan listener.
- `src/ui/`: panel HTML, navigasi, pengaturan dan penyimpanan browser.
- `src/game.ts`: konfigurasi Phaser, FIT 640 × 360, nearest-neighbor dan resize.
- `public/assets/`: 72 PNG hasil tahap aset; tidak digenerasi ulang.
- `tests/`: pemeriksaan browser untuk navigasi, responsivitas, dan kegagalan pemuatan.

Boot membaca public/asset-manifest.json, memvalidasi metadata, lalu memuat seluruh aset. Spritesheet menggunakan ukuran frame yang tercatat, termasuk frame Raka 64 × 96; tidak menebak ukuran persegi. Ukuran gambar dan jumlah frame diperiksa lagi setelah pemuatan. Aset gagal dilaporkan dengan key dan tombol muat ulang. Kegagalan aset misi wajib (lingkungan, karakter, gerbang, terminal) menonaktifkan Mulai; kegagalan aset opsional tetap memberi peringatan. Manifest gagal/invalid menampilkan halaman pemulihan. Pengaturan teks/kontras disimpan lokal; jika penyimpanan diblokir, pilihan tetap diterapkan pada sesi aktif.

## Galeri dan sumber aset

Galeri lama tetap tersedia di **/gallery.html** melalui Vite atau hasil build. Server galeri mandiri tetap dapat dijalankan dengan `npm.cmd run assets:dev`, biasanya port 4175 dengan fallback otomatis. Server ini hanya menyajikan galeri, bukan aplikasi TypeScript.

Manifest sumber: docs/ASSET_MANIFEST.json. Provenance/prompt asli: assets-source/generated/GENERATION.md. Art direction dan QA: docs/ART_DIRECTION.md, docs/ASSET_QA.md. Hanya bila sengaja mengekspor ulang sumber, jalankan `assets:import` lalu `assets:build`; tidak diperlukan untuk menjalankan aplikasi. pngjs 7.0.0 untuk skrip aset tersimpan di scripts/vendor dengan LICENSE aslinya.

Pemeriksaan lengkap animasi galeri: jalankan server Vite, lalu `node scripts/assets/browser-check.mjs`. Jika port berubah, atur `PREVIEW_URL` ke URL lengkap galeri. Skrip memakai Playwright lokal proyek ini.

## Uji kenyamanan dan pemulihan Tahap 7

1. Buka Pengaturan: coba teks besar, kontras, tampil/sembunyikan kontrol sentuh dan Kurangi efek. Nilai awal efek mengikuti prefers-reduced-motion bila belum ada pilihan tersimpan.
2. Coba Volume utama, Volume efek, Mute dan Coba suara. Audio baru aktif setelah interaksi pengguna. Musik belum tersedia; kontrolnya dinonaktifkan. Informasi puzzle tetap ada ketika mute.
3. Mulai misi, tahan arah lalu Pause. Gerak dan efek berhenti. Buka Pengaturan dari menu pause, kembali ke pause, lalu Lanjutkan. Ganti tab saat simulasi: kembali ke tab harus tetap pause sampai Lanjutkan ditekan.
4. Gunakan Fullscreen dan keluar lagi. Bila browser menolak/tidak mendukung, pesan muncul dan permainan tetap dapat digunakan. Periksa 1280×720, 1920×1080, 3840×2160, 844×390 dan portrait; gulir untuk materi belajar yang panjang. Ini bukan bukti kompatibilitas TV fisik.
5. Dengan sentuhan, tahan arah memakai satu jari dan periksa terminal dengan jari lain. Dua arah bersamaan harus diam. Lepaskan di luar tombol atau batalkan sentuhan; tidak boleh ada gerak tersangkut.
6. Selesaikan observasi dan prediksi, lalu ubah muatan. Reload dan pilih Lanjutkan di menu: muatan/transfer tidak boleh digandakan. Reload saat simulasi harus kembali ke konfigurasi aman sebelum Uji. Setelah gerbang terbuka, reload tidak boleh menandai misi selesai sebelum penjelasan/refleksi.
7. Kirim penjelasan pertama, revisi dan refleksi hingga hasil. Reload, pilih Lanjutkan, lalu periksa data tersebut masih ada. Ketik A/D/E di refleksi: Raka tidak boleh bergerak atau membuka terminal.
8. Ulang misi menghapus progres tetapi mempertahankan preferensi. Hapus progres di Pengaturan harus meminta konfirmasi, menghapus checkpoint/prediksi/riwayat/jawaban/refleksi, menutup sesi aktif ke menu, dan mempertahankan suara/tampilan.
9. Melalui DevTools, ubah data `electroquest.progress.v1` menjadi JSON rusak atau versi lain: Lanjutkan tidak ditawarkan, tetapi Mulai tetap bekerja. Jika browser memblokir localStorage, sesi tetap dapat dimainkan dan status menjelaskan progres belum tersimpan.

Progres memakai `electroquest.progress.v1`; pengaturan terpisah memakai `electroquest.settings.v2` (dengan pembacaan preferensi tampilan lama v1). Checkpoint hanya pada perubahan penting/stabil, bukan setiap frame. Simulasi RUNNING tidak dipulihkan. Draft yang belum dikirim belum menjadi checkpoint. Browser dapat menghapus data lokalnya; tidak ada sinkronisasi daring.

Rincian pemulihan, pengujian dan batas perangkat: [STAGE_7.md](docs/STAGE_7.md). Asal audio: [AUDIO_PROVENANCE.md](docs/AUDIO_PROVENANCE.md).

## Uji alur pembelajaran

1. Jalankan `npm.cmd run dev`, buka URL terminal dan pilih Mulai. Baca masalah dari Ion, coba Baca kembali, lalu Lanjut.
2. Berjalan dengan A/D atau panah; pada sentuhan tahan tombol arah. Dekati terminal kiri gerbang dan tekan E atau Periksa terminal. Periksa panel kiri dan kanan. Nilainya berasal dari model: +3/−3/0. Ambil/Kirim/Uji harus nonaktif sebelum prediksi.
3. Tutup terminal, pilih Buat prediksi. Pilih satu atau beberapa pengaturan dan satu alasan, lalu Simpan prediksi. Jawaban salah tetap boleh eksperimen dan tidak langsung dibocorkan kuncinya.
4. Buka terminal lagi. Untuk solusi positif pilih kanan, Ambil elektron 6 kali (+3/+3/−6), lalu Uji gerbang. Untuk solusi negatif, setelah reset pilih kiri dan Kirim 6 kali (−3/−3/+6). Total tetap 0. Mode observasi mengatur overlay tanda/nilai, panah gaya dan elektron; data terminal tetap tersedia.
5. Coba Bantuan beberapa kali setelah menutup modal. Petunjuk harus berurutan, tidak muncul sendiri dan tidak mengurangi nilai. Tinjau/revisi prediksi boleh mengubah pendapat, tetapi prediksi pertama tetap tersimpan.
6. Coba Uji dari keadaan awal +3/−3: ada tarikan dan belum terbuka. Reset eksperimen harus mempertahankan prediksi dan riwayat. Reset saat simulasi harus mencatat Dibatalkan, bukan kegagalan konsep.
7. Setelah solusi berhasil, gerbang terbuka dan dapat dilewati, tetapi fase belajar baru Penjelasan. Kirim jawaban salah untuk melihat feedback, lalu revisi. Gerbang tetap terbuka dan puzzle tidak perlu diulang. Jawaban pertama serta revisi disimpan terpisah.
8. Isi refleksi atau biarkan kosong, lalu Lihat hasil. Periksa prediksi awal, muatan saat berhasil, pemahaman per konsep, perubahan jawaban, jumlah percobaan/bantuan, dan refleksi. Makna teks bebas tidak dinilai otomatis.
9. Buka Lihat riwayat dan Baca kesimpulan konsep. Ulang misi harus menghapus seluruh sesi, sedangkan Reset eksperimen hanya mengembalikan eksperimen. Kembali ke menu lalu Mulai harus kembali ke orientasi tanpa objek/listener ganda.
10. Gunakan Tab/Enter, Tutup/Escape pada terminal, serta tombol sentuh. Input tidak boleh tertinggal setelah ganti tab, resize atau dialog. Setelah ganti tab pilih Lanjutkan. Ketika fokus berada pada input/checkbox, gunakan tombol Periksa terminal; E tidak mengambil alih input formulir.
11. Ubah ukuran ke desktop/ponsel: arena tetap 16:9, teks terbaca, modal dapat digulir dan halaman tidak melebar horizontal. Buka /gallery.html untuk memeriksa galeri lama.

Sesi aktif tetap memakai `schemaVersion: 1`, kini disimpan ke checkpoint berversi pada titik aman. Kembali ke menu mempertahankan checkpoint untuk Lanjutkan; Mulai membuat sesi baru. Data progres tidak berisi identitas dan tidak dikirim ke server.

Model fisika: docs/PHYSICS_MODEL.md. Alur belajar/data dan batas pemeriksaan: docs/LEARNING_FLOW.md. Status terkini: docs/PROGRESS.md. Seluruh 72 aset dipakai kembali; batas visual pencerminan Charge Glove/foot sliding tetap dicatat. Tidak ada push atau deployment.

# Preview pengembang Misi 2

Jalankan `npm.cmd run dev`, lalu buka URL yang dicetak terminal dengan `/?preview=mission-02` (biasanya `http://127.0.0.1:5173/?preview=mission-02`). Ini komposisi aset Jembatan Coulomb, belum solver atau penilaian; tidak membuka misi permanen atau menimpa progres Misi 1.

A/D atau panah untuk berjalan, E di dekat terminal. Gunakan **Kontrol preview** untuk konfigurasi dari posisi lain. Buka kunci lalu **Geser demo ke zona** untuk memeriksa platform/collider bergerak; gerak linear ini bukan simulasi Coulomb. Pause dan Kembali ke Beranda tersedia. Data muatan/jarak tersedia dalam panel HTML pada layar kecil; landscape disarankan.

Produksi aset: `npm.cmd run assets:mission02`. Validasi: `npm.cmd run assets:mission02:validate`. Pemeriksaan: `npm.cmd run check`, `npm.cmd run test:unit`, `npm.cmd run build`, `npm.cmd test -- tests/mission02.spec.js`. Rancangan, tabel seluruh aset, batas model dan uji manual ada di [docs/MISSION_02.md](docs/MISSION_02.md).

