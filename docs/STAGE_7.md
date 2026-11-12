# Tahap 7 — Kontrol, audio, dan kenyamanan bermain

## Kontrol dan tampilan

Arena tetap 640 × 360, Scale.FIT dan nearest-neighbor. Teks HTML tidak ikut diskalakan dengan canvas. Layout desktop memakai panel di samping arena, portrait menempatkan arena/kontrol di atas panel. Ada anjuran landscape tanpa memblokir portrait/menu. Pada landscape, ukuran arena dibatasi ruang vertikal agar kontrol utama tetap dekat; materi belajar dan catatan panjang tetap dapat digulir.

Ukuran viewport yang diuji: 1280×720, 1920×1080, 3840×2160, 844×390, dan portrait 390×844. Screenshot di stage-7-evidence bersifat full-page; tinggi file bisa lebih besar dari viewport karena halaman dapat digulir. Tidak ada klaim bahwa seluruh teks belajar harus berada pada satu layar. Fokus ring dan tanda +/− tetap ada. Tombol arah sekurangnya 48 CSS px; checkbox/range memiliki label yang dapat diklik dan ruang yang cukup.

Petunjuk mengikuti input terakhir yang benar-benar digunakan (keyboard, pointer atau sentuh), dengan petunjuk alternatif tetap tersedia. Pengguna dapat menampilkan/menyembunyikan kontrol sentuh melalui Pengaturan. Deteksi touchscreen bukan satu-satunya penentu. Kiri + kanan menghasilkan diam. Setiap pointer dimiliki tombol awalnya, dengan capture dan fallback release pada document. Interaksi memakai pointerdown sehingga sentuhan kedua dapat memeriksa terminal saat jari lain masih menahan arah; click detail 0 tetap untuk keyboard/teknologi bantu dan tidak menduplikasi transaksi pointer.

pointerup, pointercancel, lostpointercapture, resize, blur, dialog/pause dan shutdown membersihkan input. Hanya tombol arah menggunakan touch-action:none. Scroll dan zoom halaman tetap tersedia. Shortcut tidak berjalan pada input/select/textarea/contenteditable; mengetik refleksi tidak menggerakkan Raka. Siklus Tab eksplisit di dialog mencegah fokus keluar ke chrome browser secara tidak sengaja; perpindahan fokus nyata seperti Alt+Tab tetap menjeda permainan.

## Pause dan fullscreen

Pause menyediakan Lanjutkan, Pengaturan dan Kembali ke menu. Pengaturan ditampilkan di dialog pause yang sama; tidak menumpuk modal. Jika background pause terjadi saat terminal terbuka, terminal ditutup dan menu pause menjadi satu-satunya modal terbuka. Menutup terminal hanya menghapus alasan dialog, tidak alasan user/background. Escape pada pause kembali ke menu pause, bukan melanjutkan diam-diam.

Scene berhenti untuk pause user/background: posisi, waktu permainan, solver, partikel, scanner dan sparks tidak berjalan. Audio misi dihentikan. Focus/visibility yang kembali tidak otomatis melanjutkan; pemain harus menekan Lanjutkan. Accumulator dibersihkan sehingga tidak ada catch-up setelah jeda. Dialog eksperimen tetap mengikuti aturan Tahap 5: aktor dibekukan, efek transaksi sah dapat berjalan, Uji dimulai setelah dialog ditutup.

Fullscreen memakai requestFullscreen/exitFullscreen pada tindakan pengguna. Status API yang tidak didukung atau ditolak dijelaskan melalui teks, dan permainan tetap dapat dimainkan. Perubahan fullscreen/resize memperbarui geometri dan membersihkan gestur yang sedang ditahan.

## Efek dan audio

Efek elektron tetap hanya menggambarkan transaksi sah. Maksimum 8 partikel per lapisan, masa hidup 0,6 detik; Kurangi efek membatasinya menjadi 2, lintasan lurus dan 0,25 detik. Tanda muatan, readout, panah gaya dan feedback tidak dihilangkan oleh pengurangan efek. Mode observasi terpisah tetap dapat menyembunyikan overlay sesuai pilihan siswa.

Scanner memakai satu Graphics yang digunakan ulang. Perayaan memakai enam sprite spark yang sudah dimuat dari manifest, dipakai ulang dan disembunyikan setelah sekitar 0,3 detik. Sparks amber dekoratif berbeda dari elektron cyan dengan tanda minus. Tidak membuat tekstur/elemen baru setiap frame. Reset/shutdown membersihkan semuanya. Kurangi efek menonaktifkan scanner/perayaan dan bob Ion; nilai awal mengikuti prefers-reduced-motion jika belum ada pilihan tersimpan. Ion juga dapat mengikuti Raka di sisi kanan setelah gerbang dilewati.

Tujuh jenis efek suara dibuat lewat Web Audio; tidak ada musik. Rincian asal, frekuensi, volume dan batas pemeriksaan ada di AUDIO_PROVENANCE.md. Tidak ada layanan berbayar atau sumber musik tanpa provenance.

## Penyimpanan dan pemulihan

Preferensi memakai `electroquest.settings.v2` dengan wrapper version 2. Teks/kontras dari versi v1 dibaca sebagai migrasi. Nilai volume divalidasi, dan kegagalan storage tetap menerapkan preferensi pada memori sesi. Kurangi efek mengikuti media query hanya sebagai default; pilihan tersimpan diutamakan.

Progres memakai `electroquest.progress.v1`, wrapper version 1. Data mencakup sesi belajar lengkap, model gerbang stabil, posisi pemain dan mode observasi. Tersimpan pada perubahan penting, inspeksi, transfer, jawaban, reset, pause atau meninggalkan scene, bukan setiap frame. Posisi bukan rekaman frame demi frame; draft jawaban/refleksi yang belum dikirim belum menjadi checkpoint.

Sebelum Uji, checkpoint CONFIGURING disimpan dengan muatan/urutan transfer yang sudah sah, tanpa percobaan RUNNING. Selama simulasi tidak ditimpa. Reload di tengah simulasi kembali ke checkpoint sebelum Uji; percobaan bergerak yang belum selesai tidak dipulihkan atau digandakan. Uji berikutnya membuat satu ID baru dari checkpoint tersebut. Reset eksplisit saat simulasi tetap mencatat CANCELLED sesuai Tahap 6.

OPENED dapat dipulihkan secara stabil dengan kecepatan nol, tetapi fase belajar tetap EXPLANATION jika penjelasan belum selesai. RESULTS hanya valid bila ada percobaan berhasil, penjelasan terstruktur yang sesuai dan refleksi yang sudah dikirim (boleh kosong). Jawaban pertama/revisi dan refleksi dipertahankan. Lanjutkan di menu hanya tersedia bila checkpoint valid dan aset misi siap. Mulai membuat sesi baru; Ulang misi menghapus progres lama dan membuat orientasi baru tanpa menghapus preferensi.

Validator memeriksa versi, bentuk/nilai, kekekalan muatan, fase, posisi/kecepatan/pengunci, urutan transfer yang dapat direplay secara konsisten, ID/hasil percobaan, keterkaitan keberhasilan, kunci jawaban terstruktur dan refleksi. Tidak menerima fase bergerak, RUNNING, NaN/Infinity, riwayat palsu yang tidak konsisten, atau penyelesaian hanya karena gerbang pernah terbuka. Pembatasan ukuran 2 juta karakter, jumlah riwayat dan panjang teks membatasi data yang dapat dibaca; data terlalu besar tidak ditulis sebagai checkpoint baru. Ini validasi lokal, bukan sistem anti-cheat atau bukti autentik penilaian.

JSON rusak/versi tidak cocok menampilkan pesan dan tidak menyediakan Lanjutkan. Storage ditolak/kuota gagal tidak menghentikan permainan; status checkpoint menjelaskan bahwa sesi belum tersimpan. Hapus progres menjelaskan cakupan dan meminta konfirmasi browser, menghapus hanya key progres lalu menutup sesi aktif ke menu. Epoch penyimpanan mencegah shutdown menulis kembali progres yang baru dihapus. Preferensi tetap ada. Tidak memakai identitas atau mengirim progres ke server.

## Pemeriksaan aktual

- TypeScript strict dan build produksi berhasil. Peringatan chunk Phaser sekitar 1,24 MB / 333 KB gzip tetap ada.
- 26 unit: seluruh tes fisika/gerakan/pembelajaran lama ditambah validasi checkpoint, larangan memulihkan RUNNING, bukti hasil belajar, data korup dan storage gagal.
- Pemeriksaan browser mencakup ukuran viewport di atas, rasio/pixelated/overflow/ukuran tombol, dua pointer CDP, kiri+kanan, capture/cancel/release, pause saat simulasi, pengaturan tidak menghapus pause, focus kembali menunggu Lanjutkan, mengetik refleksi, fullscreen native berhasil serta kegagalan disimulasikan, mute/volume dan AudioContext, reload sebelum/sesudah keberhasilan, revisi/refleksi/hasil pulih, penghapusan terkonfirmasi, storage rusak/ditolak dan regresi keluar-masuk scene. Hasil akhir di PROGRESS.md.
- Screenshot resolusi yang benar-benar dibuka mencakup 844×390 dan 3840×2160; gambar lain diperiksa dalam pemeriksaan akhir. Ini Chromium headless dengan emulasi sentuh/resolusi, bukan TV fisik.

Pada putaran awal, tes CDP menggunakan pelepasan sebagian titik yang tidak cocok dengan semantik harness; tes dipisah menjadi gestur jelas. Dukungan interaksi pointer kedua diperbaiki lewat pointerdown. Dua Tab pada akhir modal sempat membawa fokus ke chrome browser, sehingga background pause benar terpicu; siklus fokus dialog diperbaiki, bukan mengabaikan blur. Selector regresi dipersempit ke dialog eksperimen karena kini ada dialog pause yang tertutup. Tidak ada kegagalan yang disembunyikan lewat retry.

Belum diuji pada TV/ponsel fisik, driver multitouch tertentu, Firefox/Safari, speaker/headphone atau kondisi perangkat sangat lambat. Tidak ada klaim kompatibilitas semua TV, hasil uji pendengaran, atau benchmark FPS/latensi. Audio musik belum tersedia. Preferensi/progres dapat hilang jika browser menghapus data lokal. Model polarisasi dan batas visual aset tetap dari tahap sebelumnya. Tidak ada level/backend/akun, push atau deployment baru.
