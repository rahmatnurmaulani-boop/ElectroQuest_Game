# QA konsol UI — 12 November 2026

## Hasil yang benar-benar dijalankan

- TypeScript dan build produksi lulus. Warning chunk Phaser sekitar1.32MB/353KB gzip tetap ada.
-39 tes unit lulus. Tidak mengubah formula muatan/gaya, transaksi elektron atau kunci penilaian.
-62 aset UI baru lulus validasi actual PNG, alpha0/partial, frame/FPS, slice, sumber dan sinkronisasi manifest.325 PNG total lulus,0 missing.72 hash PNG game awal tetap identik.
- Regresi penuh56 tes:55 lulus, satu kegagalan membuktikan bug handler ulang misi setelah konfirmasi dibatalkan. Bug diperbaiki, bukan dilewati. Sesudah itu15 tes browser jalur terkait lulus (2,4 menit): console-actions, console-ui, coulomb-flow, mission03, learning, title-screen. Alur hasil Misi1/2/3 benar-benar dimainkan; hasil/observasi/revisi/refleksi dan checkpoint dipertahankan. Tidak mengklaim56 tes dijalankan ulang sekaligus sesudah perbaikan tersebut.
- Putaran awal menemukan ekspektasi tes lama untuk warna/judul/petunjuk, galeri menghitung emblem dua kali, dan halaman landing desktop terlalu tinggi. Ekspektasi diperbarui ke token/nama aktual; galeri dideduplikasi; batas viewport diperbaiki. Artefak kegagalan lama tidak diklaim sebagai hasil final.
- CSS/handler bersifat idempotent. Tes reentry memeriksa satu canvas/objek dan dialog tidak berlipat; pointercancel, kehilangan fokus, pause/continue, keyboard dan emulasi CDP touch tetap diuji oleh regresi.
- Browser memantau pageerror dan response≥400 pada alur normal. Uji manifest/aset wajib gagal dan retry dipertahankan. Ilustrasi hasil yang sengaja404 menampilkan status tanpa menghapus ringkasan/data/tombol. Galeri tidak menulis progres.
- Aksi Batal/terima ulang Misi2/3 mempertahankan data misi lain, fokus kembali dan tombol tetap dapat dipakai lagi. Reset/ulang/hapus/fresh game memakai modal aplikasi. Footer Misi2/3 memeriksa write aktual, bukan teks tetap optimistis.

Pemeriksaan build final: 8/8 tes browser lulus (46,8 detik), mencakup console-actions, console-ui dan alur penuh mission03. Sebelumnya 7/7 tes khusus checkpoint gagal saat simulasi, blur di tengah konfirmasi, replay, galeri dan panel bersama juga lulus. Alur aktual Misi1→Misi2 hingga hasil/reload lulus lagi (28,2 detik). TypeScript/build terakhir dan validasi62 aset lulus. Tangkapan hasil portrait Misi1/2/3 telah dibuka; isi panjang menggunakan scroll internal arena, sehingga landscape lebih nyaman.

Pembaruan responsif portrait: dialog gameplay kini menggunakan area viewport ponsel, bukan tinggi arena 16:9 yang ter-letterbox. `immersive.spec.js` memeriksa posisi dan lebar dialog pada 390×844 dan 320×740, ukuran target tombol, serta tidak adanya overflow halaman. Arena dan kontrol tetap mengikuti rasio/tata letak yang sama.

## Inspeksi visual

Uji navigasi final: 1/1 lulus (27,4 detik). Dari hasil Misi2, tombol Pilih misi benar-benar membuka picker landing; menutup picker dan reload tetap mempertahankan hasil, revisi, refleksi dan progres Misi1.

Screenshot `docs/console-ui-evidence`: landing1440/1024/768/390/320, pause1/2/3, confirmation, gallery, result1/result3. Gambar desktop/ponsel dan pause ketiga misi sudah dibuka; hasil Misi2 juga tersimpan oleh coulomb-flow di docs/mission-02-playable-evidence/results.png. Kartu nilai panjang diperbaiki; border12px tidak berubah saat panel membesar. Art640×280 mempertahankan rasio asli, bukan diregangkan.

Panel panjang bergulir di dalam dialog. Portrait mempertahankan seluruh arena dan menyediakan tinggi viewport untuk panel; landscape lebih nyaman untuk membaca arena serta panel berdampingan. Kontrol minimal48 CSSpx, radio/checkbox/select tetap semantik, outline fokus terlihat. Sistem memakai font OS/fallback; tidak ada font eksternal yang perlu diunduh.

## Checker desain umum

Skill design-taste-frontend dipakai sebagai referensi desain dan checker lokal. Satu path CSS relatif pada bootstrap ditemukan dan diperbaiki menjadi URL absolut. Quick check terakhir masih mengeluarkan14 FAIL aturan website pemasaran: CTA tidak dihitung karena berada pada nav menu, nav vertikal disarankan menjadi baris, gambar pixel640×360 dianggap foto yang diperbesar, kebutuhan “moment”/section tambahan, aturan .wrap/tepi diorama absolut, padding pelat judul dan batas footer24px. Ini tidak dipalsukan menjadi PASS, tidak mengedit kit checker dan tidak menyembunyikan halaman dari checker.

Instruksi khusus pengguna mempertahankan menu game, pixel art tajam yang diskalakan dan landing dengan ilustrasi lingkungan, sehingga tidak diganti menjadi struktur situs pemasaran atau foto. Pengecekan aplikasi mengukur batas viewport/rasio/scroll, target/fokus dan seluruh fungsi secara langsung melalui Playwright. Artefak checker berada di .taste-skill/gate dan gate.json.

## Batas verifikasi

Chromium desktop dan emulasi sentuh; belum perangkat fisik/Safari/Firefox atau uji kelas siswa. Tidak ada benchmark perangkat sangat lambat. Dropdown OS native tidak diubah menjadi widget custom; kontrol/label/fokus tetap HTML asli. Galeri v1 dipertahankan sebagai arsip development, bukan window aplikasi produksi. Tidak ada placeholder baru atau ilustrasi yang belum terpasang. Tidak push/deploy.
