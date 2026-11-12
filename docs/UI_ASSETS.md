# UI satu layar ElectroQuest

Aset tambahan final berjumlah 30 PNG, terpisah di `public/assets/ui/`. Tidak ada placeholder atau aset tambahan yang hanya disimpan tanpa pemasangan. Seluruh PNG lama dipakai kembali sesuai fungsi; potret Raka dan Ion yang layak tidak dibuat ulang. Alat image generation tersedia, tetapi tidak diperlukan untuk tambahan geometris ini. Tidak menggunakan layanan berbayar atau sumber gambar luar.

Sumber yang dapat diperbaiki: `scripts/assets/ui.mjs`. Produksi dapat diulang lewat `npm.cmd run assets:ui`, tanpa menjalankan ulang generator karakter/lingkungan. Metadata ukuran, frame, FPS, status, sumber, alpha dan nine-slice ada di manifest dokumen/runtime serta `assets-source/ui-production.json`.

## Pemasangan

`UISkin.ts` memasang URL manifest absolut dan menghias komponen bersama. URL absolut penting karena custom property CSS dengan URL relatif dapat diinterpretasikan terhadap lokasi stylesheet hasil build. Bingkai memakai `border-image` nine-slice, tidak berupa gambar layar penuh. Sudut tetap 8 px; tombol lama/selected tetap 6 px. Teks, label E, nilai muatan, pilihan dan jawaban merupakan HTML dinamis. Ikon dekoratif memakai alt kosong, sedangkan tombol tetap memiliki label teks/ARIA. Area sentuh minimal 44 × 44 px ditetapkan oleh CSS, tidak oleh dimensi ikon.

| Nama aset | Lokasi file (relatif proyek) | Komponen/scene pengguna | Status pemeriksaan |
|---|---|---|---|
| ui-hud-frame | public/assets/ui/ui-hud-frame.png | HUD misi/tujuan, petunjuk E | Final, terpasang; alpha/metadata valid |
| ui-dialog-info | public/assets/ui/ui-dialog-info.png | Dialog Ion, prediksi, penjelasan, refleksi, area potret | Final, terpasang; alpha/metadata valid |
| ui-dialog-hint | public/assets/ui/ui-dialog-hint.png | Petunjuk konsep, peringatan, feedback | Final, terpasang; alpha/metadata valid |
| ui-dialog-success | public/assets/ui/ui-dialog-success.png | Hasil, feedback gerbang terbuka | Final, terpasang; alpha/metadata valid |
| ui-terminal-frame | public/assets/ui/ui-terminal-frame.png | Panel eksperimen/observasi terminal | Final, terpasang; alpha/metadata valid |
| ui-menu-frame | public/assets/ui/ui-menu-frame.png | Pause, pengaturan, cara bermain, baca kembali | Final, terpasang; alpha/metadata valid |
| ui-choice-selected | public/assets/ui/ui-choice-selected.png | Pilihan jawaban dan select panel terfokus | Final, terpasang; alpha/metadata valid |
| button-selected | public/assets/ui/button-selected.png | Tombol panel sudah diperiksa | Final, terpasang; alpha/metadata valid |
| ui-touch-normal | public/assets/ui/ui-touch-normal.png | Kontrol arah/interaksi normal | Final, terpasang; alpha parsial valid |
| ui-touch-focus | public/assets/ui/ui-touch-focus.png | Kontrol sentuh hover/fokus | Final, terpasang; alpha parsial valid |
| ui-touch-pressed | public/assets/ui/ui-touch-pressed.png | Kontrol sentuh ditahan | Final, terpasang; alpha parsial valid |
| ui-touch-disabled | public/assets/ui/ui-touch-disabled.png | Interaksi di luar jangkauan/nonaktif | Final, terpasang; alpha parsial valid |
| ui-divider | public/assets/ui/ui-divider.png | Pemisah bagian hasil belajar | Final, terpasang; alpha/metadata valid |
| ui-answer-off | public/assets/ui/ui-answer-off.png | Checkbox/radio belum dipilih | Final, terpasang; alpha/metadata valid |
| ui-answer-on | public/assets/ui/ui-answer-on.png | Checkbox/radio dipilih | Final, terpasang; alpha/metadata valid |
| ui-next | public/assets/ui/ui-next.png | Tombol Lanjut pada dialog Ion | Final, terpasang; sheet 64×16, 4 frame 16×16, 4 FPS |
| icon-pause | public/assets/ui/icon-pause.png | HUD Pause, Menu pause dalam dialog | Final, terpasang; alpha/metadata valid |
| icon-settings | public/assets/ui/icon-settings.png | Menu Pengaturan | Final, terpasang; alpha/metadata valid |
| icon-help | public/assets/ui/icon-help.png | Cara bermain, Baca kembali, Bantuan | Final, terpasang; alpha/metadata valid |
| icon-back | public/assets/ui/icon-back.png | Kembali ke Beranda/pause, Tutup terminal | Final, terpasang; alpha/metadata valid |
| icon-info | public/assets/ui/icon-info.png | Prediksi, catatan konsep, feedback transfer | Final, terpasang; alpha/metadata valid |
| icon-warning | public/assets/ui/icon-warning.png | Transfer ditolak, batas model, aset opsional gagal | Final, terpasang; alpha/metadata valid |
| icon-take | public/assets/ui/icon-take.png | Ambil elektron | Final, terpasang; alpha/metadata valid |
| icon-send | public/assets/ui/icon-send.png | Kirim elektron | Final, terpasang; alpha/metadata valid |
| icon-test | public/assets/ui/icon-test.png | Uji gerbang | Final, terpasang; alpha/metadata valid |
| icon-glove | public/assets/ui/icon-glove.png | Penanda Charge Glove di terminal | Final, terpasang; alpha/metadata valid |
| icon-panel-left | public/assets/ui/icon-panel-left.png | Penanda/periksa panel kiri | Final, terpasang; alpha/metadata valid |
| icon-panel-right | public/assets/ui/icon-panel-right.png | Penanda/periksa panel kanan | Final, terpasang; alpha/metadata valid |
| icon-success | public/assets/ui/icon-success.png | Judul hasil belajar | Final, terpasang; alpha/metadata valid |
| icon-retry | public/assets/ui/icon-retry.png | Ulang misi, coba lagi/coba muat ulang | Final, terpasang; alpha/metadata valid |

Aset lama terpasang kembali: `button-{normal,focus,pressed,disabled}.png`, `icon-{left,right,interaction,fullscreen,sound,reset}.png` di `public/assets/ui/`; `ion-portrait.png` dan `raka-portrait.png` di `public/assets/characters/`. Potret tidak disalin ke folder lain. Semua aset raster tambahan memiliki alpha sungguhan; checkerboard hanya latar CSS galeri untuk pemeriksaan, bukan piksel di PNG.

## Arena dan siklus hidup

Hanya halaman mission memakai viewport dinamis dan safe area. Arena ditata sebesar mungkin dalam rasio 16:9; canvas tetap 640 × 360/pixelated. HUD, kontrol dan dialog berada dalam `.game-stage`. Native dialog memberi fokus/inert; posisi top-layer dibatasi memakai ukuran/koordinat arena yang diperbarui ResizeObserver. Scroll halaman dikunci; panel panjang dapat bergulir internal.

Pengarahan di bawah arena; observasi/eksperimen di terminal; prediksi/penjelasan/refleksi/hasil di modal. Nilai dan pencatatan model tidak diubah. Input dibersihkan saat membuka panel, resize, blur dan keluar scene. Pause membaca kembali tujuan tanpa mengganti fase belajar. Kembali ke Beranda menyimpan checkpoint stabil. Animasi lanjut memakai CSS dari metadata; berhenti bersama elemen ketika panel ditutup dan berhenti pada Kurangi efek/prefers-reduced-motion. Tidak menambahkan timer, RAF, engine atau listener global untuk skin.

## Pemeriksaan dan batasan

Hasil akhir: TypeScript/build lulus; 26 tes unit lulus; validasi 102 PNG (0 missing), 30 record UI, alpha, nine-slice dan 72 hash PNG asli lulus. Pada suite penuh Chromium, 35 tes regresi lulus; dua tes UI mendeteksi bingkai HUD galeri tertimpa selector generik dan pengujian fokus yang belum mengirim input keyboard. Setelah perbaikan terarah, kedua tes UI lulus (10,3 detik). Jadi 37 kasus lulus pada rangkaian terakhir, bukan klaim satu run suite 37/37. Tidak membangun ulang dist ketika server pengujian aktif pada pemeriksaan akhir.

Validasi PNG memeriksa dimensi, alpha nol/parsial, batas nine-slice, manifest sinkron dan hash PNG lama. Build/TypeScript serta unit fisika/gerakan/belajar/checkpoint dijalankan. Browser memeriksa batas arena/overlay dan scrollbar pada 320×740, 390×844, 844×390, 1440×900, 1920×1080 dan 3840×2160; menguji alur lengkap, fokus, touch, pause/fullscreen, pengaturan, kegagalan aset/retry dan resume.

Galeri `/ui-gallery.html` memakai modul skin yang sama, menampilkan semua PNG UI, potret, panel kecil/besar/resizable, tombol normal/fokus/ditekan/dipilih/nonaktif dan kontrol transparan. Pengujian tambahan mendekode gambar CSS sesungguhnya agar style URL saja tidak dianggap berhasil. Bukti berada di `docs/immersive-evidence/`; screenshot game dan galeri ditinjau secara visual.

Belum diuji pada ponsel/TV fisik atau browser selain Chromium. Pada portrait, seluruh arena tetap terlihat, sehingga dialog memiliki tinggi scroll internal lebih pendek; landscape memberi ruang baca lebih luas. Warning chunk Phaser sekitar 1,25 MB tetap ada; engine dimuat setelah masuk dari beranda. Tidak ada push/deploy.
