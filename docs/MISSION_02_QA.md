# QA Misi 2 — 12 November 2026

## Pemeriksaan aktual

- `npm.cmd run check` melalui build: lulus. `npm.cmd run build`: lulus; warning chunk Phaser sekitar1.32MB masih ada.
- `npm.cmd run test:unit`:39 lulus pada proyek terkini. Termasuk model Coulomb, kekekalan/limit/transaksi atomik, pembalikan tanda, reaksi sama besar, r2→F/4,2q→2F, finite minimum r, solusi docking, perbandingan terkontrol, snapshot, syarat penjelasan dan validasi checkpoint.
- `npm.cmd test -- tests/coulomb-flow.spec.js tests/mission02.spec.js tests/bridge-touch.spec.js`:8 lulus (1,5 menit), pada build yang sudah memasang motor serta sambungan baru. Mencakup alur nyata landing→Misi 1 selesai→Misi 2 sampai hasil/reload; jalan keluar Misi 1; prediksi salah; penjelasan salah/revisi; investigasi salah dua variabel ditolak; checkpoint sebelum simulasi; docking otomatis/manual; penyeberangan collider; reset; sentuh CDP dan cancel; resize; pause; reentry; aset wajib gagal/retry di preview. Alur penuh memantau error JS dan response≥400:tidak ditemukan.
- Validasi46 PNG Misi 2: lulus (decode, dimensi, alpha, frame/FPS, nine-slice,sumber,manifest sinkron). Validasi keseluruhan258 PNG:0 missing.30 UI bersama lulus dan72 hash PNG awal tidak berubah.
- Screenshot docked terbaru benar-benar dibuka: motor ada di dek, sambungan kiri/tengah/kanan terbentang, pijakan dapat dilalui sampai pintu (assertion browser). Sebelumnya desktop penyelidikan/hasil dan panel portrait juga dibuka. Bukti `docs/mission-02-playable-evidence/` dan `docs/mission-02-evidence/`.

## Batas verifikasi

Browser Chromium headless dan emulasi sentuh; belum perangkat fisik, Firefox/Safari, atau uji kelas siswa. Portrait mempertahankan arena penuh sehingga label canvas kecil; angka dan teks utama juga tersedia pada panel HTML dengan scroll internal. Warning ukuran chunk tidak disembunyikan. Tes keseluruhan semua misi tidak dijalankan ulang pada perubahan empat aset terakhir; delapan tes terkait serta39 unit yang tercantum di atas benar-benar dijalankan. Tidak push/deploy.

## Aset dan produksi

Tidak membuat ulang42 aset Misi 2 yang sudah layak. Dibuat4 PNG geometris32×32: m2-docking-left/middle/right dan m2-motor-broken. Tidak ada placeholder baru; semuanya digunakan oleh bridge-mission. Produksi skrip sumber dapat diulang tanpa layanan eksternal. Tiga master ilustrasi image_gen sebelumnya tetap tersimpan. Tabel46 aset dan lokasi ada di MISSION_02.md.
