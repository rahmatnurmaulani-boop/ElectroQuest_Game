# Misi 2: Jembatan Coulomb

## Status terkini — misi dapat dimainkan

Masuk melalui Beranda → **Pilih misi → Misi 2** setelah hasil Misi 1 tersedia. Scene `bridge-mission` menjalankan urutan Masalah → Observasi → Prediksi → Penyelidikan → Solusi → Penjelasan → Refleksi → Hasil. Prediksi salah tetap boleh lanjut; jawaban pertama dan revisi tersimpan. Pengamatan adalah snapshot, perbandingan terkontrol memeriksa variabel yang berubah. Bantuan dan pengunci otomatis tidak mengurangi hasil. Refleksi bebas opsional, tidak dinilai otomatis.

`/?preview=mission-02` tetap merupakan preview aset lama dengan gerak linear, berbeda dari misi penuh. Keterangan preview pada bagian riwayat di bawah hanya berlaku untuk URL tersebut.

Sumber berada di kiri. Platform awal x320, bola platform x348, sumber68–208, r awal140px dan preset280px. Docking380–408; pengunci memosisikan dek ke392 dan membentangkan pijakan dengan collider kontinu192–448, y304. Motor rusak terpisah ikut dek. Raka mulai80 dan mencapai pintu pada x≥582 setelah docking. Jatuh kembali ke80 tanpa penalti.

### Aset tambahan untuk gameplay

Empat PNG geometris orisinal dibuat melalui skrip produksi, 32×32, alpha sungguhan, anchor(0.5,1), satu frame, tanpa teks/angka. Langsung dimuat sebagai aset wajib misi penuh. Kini paket Misi 2 berisi46 PNG final; tidak ada placeholder. Sumber `scripts/assets/mission-02.mjs`, metadata `assets-source/mission-02/production.json`; tiga master ilustrasi tetap dipertahankan. Tidak memakai layanan berbayar tambahan.

| Aset | Lokasi file | Penggunaan di scene | Status pemeriksaan |
|---|---|---|---|
| m2-docking-left | public/assets/mission-02/puzzle/m2-docking-left.png | Ujung kiri pijakan; muncul setelah pengunci | Final, terpasang; alpha/dimensi lulus |
| m2-docking-middle | public/assets/mission-02/puzzle/m2-docking-middle.png | Enam segmen sambungan tengah | Final, terpasang; alpha/dimensi lulus |
| m2-docking-right | public/assets/mission-02/puzzle/m2-docking-right.png | Ujung kanan sambungan ke dermaga | Final, terpasang; alpha/dimensi lulus |
| m2-motor-broken | public/assets/mission-02/puzzle/m2-motor-broken.png | Motor rusak terpisah mengikuti dek | Final, terpasang; alpha/dimensi lulus |

### Model, solusi dan penyimpanan

Model murni `src/physics/coulomb.ts`: K100000, massa1, redaman0.6/detik, batas26px/detik, langkah1/120detik, akumulasi≤0.1detik. Muatan bola±4, reservoir±8, total0; ambil elektron menaikkan muatan bola1 dan menurunkan reservoir1. Preset melakukan transaksi yang sama, tidak menulis muatan diam-diam. r adalah pusat-ke-pusat, minimum48px untuk guard singularitas; geometri pengaturan menyediakan140–280px. Tidak ada konversi SI: px dunia, detik permainan, satuan muatan/massa/gaya permainan. Sumber tetap karena dudukan menahan gaya reaksi; pasangan gaya sama besar berlawanan arah. Saat bergerak r dan F dihitung ulang. Netral memberi gaya nol pada model; polarisasi tidak disimulasikan. Pengunci adalah rem mekanis, bukan kesetimbangan listrik. Waktu tempuh bukan ukuran langsung gaya.

Solusi teruji: qS=+2,qP=+2,reservoir−4,sumber208,r awal140. Uji dengan pengunci otomatis → docking392. Penyelidikan: simpan dasar(2,2,140), jarak(2,2,280), muatan(2,4,140); bandingkan1→2(0.25) dan1→3(2.0). Kembalikan preset dasar sebelum Uji. Jalan ke pintu kanan, jawab penjelasan, refleksi boleh kosong.

Progres Misi 1 tidak diubah formatnya. Penyelesaian lama dikenali dari checkpoint RESULTS dan ditandai terpisah agar unlock bertahan saat mengulang Misi 1. Misi 2 memakai `electroquest.mission2.v1`, validasi model/transaksi/pengamatan/hasil. Saat RUNNING tidak menulis checkpoint; reload memulihkan konfigurasi sebelum Uji. Reset mempertahankan prediksi/pengamatan; Ulang Misi 2 meminta konfirmasi dan mengganti hanya sesi Misi 2. Pengaturan bersama tetap digunakan.

### Uji manual misi penuh

1. Selesaikan Misi 1, kembali ke Beranda, pilih Misi 2. Lanjutkan dialog Ion dan dekati terminal dengan A/D; tekan E.
2. Simpan prediksi, buat tiga pengamatan preset di atas, bandingkan1→2 dan1→3. Pasangan2→3 harus ditolak sebagai eksperimen terkontrol karena mengubah muatan serta jarak.
3. Rancang solusi, pilih preset dasar, aktifkan kunci otomatis dan Uji. Coba Pause di tengah; Lanjutkan tidak boleh meloncat. Pengunci manual hanya aktif di zona.
4. Setelah docking, lihat sambungan tiga bagian dan motor rusak. Jalan terus ke pintu kanan; collider harus menahan kaki di y304 sepanjang jembatan.
5. Kirim penjelasan salah lalu perbaiki; hasil harus mempertahankan jawaban pertama, pengamatan dan refleksi. Reload dan Lanjutkan Misi 2 memulihkan hasil.
6. Coba reset selama/sesudah simulasi, sentuh tahan/cancel, resize dan keluar-masuk misi. Misi 1 tetap dapat dilanjutkan.

## Riwayat preview aset (dipertahankan sebagai catatan)

## Status dan akses

Aset final terpasang pada scene Phaser `mission-02`; ini **preview pengembang**, belum misi pembelajaran lengkap. Jalankan `npm.cmd run dev`, lalu buka URL terminal dengan `/?preview=mission-02`. Tidak ada unlock permanen, penilaian, trigger selesai atau penulisan progres belajar. Kembali ke Beranda menghapus parameter preview dan tetap dapat melanjutkan Misi 1. Pengaturan bersama tetap berfungsi, tetapi penghapusan progres dinonaktifkan dalam preview.

Cerita: jalur di luar laboratorium terputus; motor platform rusak. Bola konduktor pada dudukan isolator dapat dipengaruhi sumber bermuatan pada rel pengaturan. Tahap berikutnya mengembangkan arah gaya, pengaruh besar muatan dan hubungan kuadrat jarak.

## Implementasi

- `src/content/mission02.ts`: konfigurasi awal, kebutuhan aset dan diagram observasi tanpa solver.
- `src/entities/bridgeArena.ts`: susunan lapisan, tile modular, benda terpisah, anotasi dinamis dan collider platform.
- `src/scenes/BridgePreviewScene.ts`: Arcade Physics khusus scene ini; gerak Raka, pengikut Ion, pause, kontrol demo dan pembersihan. Misi 1 mempertahankan model fisikanya sendiri.
- `src/ui/BridgePanel.ts`: terminal HTML, pilihan bola, slider posisi, tanda muatan, kunci, demo, scan dan reset. Fokus keyboard terkurung di dialog; gerak dihentikan saat dialog terbuka. Tombol Uji gaya sengaja nonaktif dan berlabel tahap berikutnya.
- `BootScene`: pemuatan manifest dan validasi aset wajib sesuai scene. Path gagal menampilkan kesalahan dan retry.

Arena 640 × 360, tile 32 px, permukaan lantai y=304. Dermaga kiri x=0–192, kanan x=448–640. Platform lebar112, posisi awal pusat248 dan tujuan392. Bola platform berpusat x=platform+28, y=244. Sumber awal560, dapat digeser496–608. Raka mulai80, terminal136, penanda keluar608. Raka/Ion/animasi/UI dipakai kembali. Pencerminan Raka juga mencerminkan sisi Charge Glove sebagaimana Misi 1.

Platform, roda, isolator, bola, tanda dan pengunci mengikuti satu posisi; collider 112 × 16 mengikuti dek. Raka yang berdiri ikut dibawa. Demo bergerak linear 144 px (1,8 detik; 0,5 detik Kurangi efek), **bukan hasil perhitungan gaya**. Jatuh dari celah mengembalikan Raka ke awal tanpa hasil belajar. Sumber memiliki pegangan visual; manipulasi sentuh memakai slider terminal, belum drag langsung di canvas.

Panah amber hanya menyatakan arah, panjangnya tetap, bukan skala besar gaya. Garis cyan mengukur pusat-ke-pusat. Simbol +/−, q1/q2, r, F, posisi awal dan tujuan dirender kode, tidak dipanggang ke PNG. Ring scan berakhir, kilatan latch tiga frame sekali saat terkunci di zona, tanpa aliran listrik kontinu. Partikel elektron bersama ditampilkan sebagai legenda aset siap pakai; **transfer elektron Misi 2 belum terhubung**.

## Batas model untuk tahap berikutnya

Bola dianggap pendekatan muatan titik. r diukur antar pusat, bukan tepi bola. Pada muatan tetap, r dua kali menghasilkan F seperempat; menggandakan salah satu muatan menggandakan F pada r tetap. Diagram menampilkan F/F0 tanpa Newton dengan referensi |q1q2|=4 dan r0=284 px dunia. Perbandingan statis dibaca hanya ketika platform terkunci. Slider pengaturan mendefinisikan konfigurasi baru; saat gerak, r serta besar gaya dapat berubah dan pembacaan statis disembunyikan. Waktu tempuh bukan ukuran langsung gaya. Belum ada pemetaan satuan SI, distribusi muatan/polarisasi, integrator Coulomb, tumbukan bola, desain percobaan/penilaian atau progres Misi 2. Jarak nol dijaga finite dalam fungsi diagram; bukan kondisi fisik yang didukung arena.

## Produksi dan pemeriksaan

42 PNG baru: 3 ilustrasi image_gen dan 39 geometri prosedural, final untuk tahap aset; tidak ada placeholder visual atau file baru yang hanya disimpan tanpa pengguna. Sumber master dan production.json di `assets-source/mission-02/`; skrip `scripts/assets/mission-02.mjs`. Rebuild: `npm.cmd run assets:mission02`; validasi: `npm.cmd run assets:mission02:validate`. `assets:build` juga mempertahankan paket ini. Manifest menyimpan dimensi, anchor, frame, FPS, nine-slice, sumber, alpha dan penggunaan. Tile/dek/rail/terminal persegi penuh sengaja opak; cutout memiliki alpha sungguhan. Bingkai data memakai nine-slice8. Latch flash 3 frame24×24, FPS10, tidak berulang.

Screenshot browser disimpan di `docs/mission-02-evidence/`. Desktop1440×900, portrait390×844, terminal dan docking dibuka untuk inspeksi visual; rasio/overflow juga diuji pada844×390,320×740,3840×2160. Pada portrait arena tetap utuh dengan letterbox; label canvas mengecil, data angka tersedia pada panel HTML yang dapat digulir internal. Landscape disarankan untuk observasi. Belum diuji perangkat fisik atau Safari/Firefox.

## Uji manual

Hasil aktual 12 November 2026: TypeScript/build lulus;28 tes unit lulus;44 tes regresi Chromium lulus (4 menit). Sesudah perbaikan efek latch dan ring scan, build final serta4 tes khusus `mission02.spec.js`/`bridge-touch.spec.js` lulus (23,3 detik). Cakupan tambahan: multitouch CDP, touchCancel, input tidak tertinggal setelah modal, panel844/390/320px, fullscreen, reentry dan byte checkpoint Misi 1 tetap. Assertion rider mengambil baseline setelah modal menghentikan gerak agar tidak menghitung satu frame berjalan sebelumnya.174 PNG tervalidasi,42 metadata/alpha baru sinkron;72 hash PNG awal identik. Generator42 aset dijalankan ulang dari master workspace dan validasi tetap lulus. Warning ukuran chunk Phaser1,26MB tetap ada; bukan build gagal.

1. Buka preview; pastikan Raka, Ion, dua bola, dek, celah dan tujuan terlihat. A/D atau panah berjalan; dek awal dapat dinaiki dari kiri.
2. Dekati terminal dan tekan E. Di luar jangkauan E tidak membuka panel. Tutup dengan Escape; input tidak tertahan.
3. Pilih bola, ubah q1/q2, geser sumber. Tanda, panah dan r mengikuti konfigurasi. Muatan sejenis menolak, berbeda menarik, netral tanpa panah. Perbandingan awal1; q1=4 menjadi2 pada jarak awal.
4. Buka kunci: pembacaan statis disembunyikan. Geser platform atau jalankan Geser demo ke zona. Untuk menguji Raka ikut bergerak, naiki dek lalu buka Kontrol preview dari HUD dan jalankan demo.
5. Pause saat demo: posisi berhenti; Lanjutkan meneruskan; setelah docking dek terkunci dan efek singkat muncul. Berjalan ke dermaga kanan.
6. Coba scan, reset, keyboard, tombol sentuh tahan/lepas/cancel, pengaturan Kurangi efek, resize dan fullscreen. Panel tidak membuat halaman bergulir.
7. Kembali ke Beranda, buka preview beberapa kali, lanjutkan progres Misi 1. Tidak ada objek ganda atau checkpoint Misi 1 yang terganti.

## Tabel aset

Seluruh path relatif terhadap root proyek. Status “lulus” mencakup decode PNG, metadata/alpha sesuai fungsi dan pemuatan browser pada scene; status kondisional disebut pada penggunaan.

| Aset | Lokasi file | Penggunaan di scene | Status pemeriksaan |
|---|---|---|---|
| m2-sky (640×360) | public/assets/mission-02/environment/m2-sky.png | Generated independent background layer | Final, terpasang; lulus |
| m2-city (640×360) | public/assets/mission-02/environment/m2-city.png | Generated independent background layer | Final, terpasang; lulus |
| m2-rear (640×360) | public/assets/mission-02/environment/m2-rear.png | Generated independent background layer | Final, terpasang; lulus |
| m2-floor-left (32×32) | public/assets/mission-02/environment/m2-floor-left.png | Modular pier floor, top surface at tile origin | Final, terpasang; lulus |
| m2-floor-middle (32×32) | public/assets/mission-02/environment/m2-floor-middle.png | Modular pier floor, top surface at tile origin | Final, terpasang; lulus |
| m2-floor-right (32×32) | public/assets/mission-02/environment/m2-floor-right.png | Modular pier floor, top surface at tile origin | Final, terpasang; lulus |
| m2-gap-left (32×64) | public/assets/mission-02/environment/m2-gap-left.png | Exposed pier/gap edge | Final, terpasang; lulus |
| m2-gap-right (32×64) | public/assets/mission-02/environment/m2-gap-right.png | Exposed pier/gap edge | Final, terpasang; lulus |
| m2-support (32×64) | public/assets/mission-02/environment/m2-support.png | Pier support | Final, terpasang; lulus |
| m2-fence (64×48) | public/assets/mission-02/environment/m2-fence.png | Rear guardrail segment | Final, terpasang; lulus |
| m2-lamp (32×64) | public/assets/mission-02/environment/m2-lamp.png | Pier lamp | Final, terpasang; lulus |
| m2-utility (48×48) | public/assets/mission-02/environment/m2-utility.png | Utility box | Final, terpasang; lulus |
| m2-cable (64×16) | public/assets/mission-02/environment/m2-cable.png | Decorative cable | Final, terpasang; lulus |
| m2-platform (112×24) | public/assets/mission-02/puzzle/m2-platform.png | Independent deck; collider follows this position | Final, terpasang; lulus |
| m2-wheels (112×16) | public/assets/mission-02/puzzle/m2-wheels.png | Independent rail wheels | Final, terpasang; lulus |
| m2-ball-platform (32×32) | public/assets/mission-02/puzzle/m2-ball-platform.png | Bare conductor sphere; signs and values rendered in code | Final, terpasang; lulus |
| m2-ball-source (32×32) | public/assets/mission-02/puzzle/m2-ball-source.png | Bare conductor sphere; signs and values rendered in code | Final, terpasang; lulus |
| m2-isolator (16×40) | public/assets/mission-02/puzzle/m2-isolator.png | Shared insulating stand, reused under both balls | Final, terpasang; lulus |
| m2-carriage (48×16) | public/assets/mission-02/puzzle/m2-carriage.png | Source position carriage | Final, terpasang; lulus |
| m2-grip (24×24) | public/assets/mission-02/puzzle/m2-grip.png | Source touch grip | Final, terpasang; lulus |
| m2-rail-left (32×12) | public/assets/mission-02/puzzle/m2-rail-left.png | Modular platform/source rail | Final, terpasang; lulus |
| m2-rail-middle (32×12) | public/assets/mission-02/puzzle/m2-rail-middle.png | Modular platform/source rail | Final, terpasang; lulus |
| m2-rail-right (32×12) | public/assets/mission-02/puzzle/m2-rail-right.png | Modular platform/source rail | Final, terpasang; lulus |
| m2-goal (128×12) | public/assets/mission-02/puzzle/m2-goal.png | Target zone marker, separate state overlay | Final, terpasang; lulus |
| m2-goal-active (128×12) | public/assets/mission-02/puzzle/m2-goal-active.png | Target zone marker, separate state overlay | Final, terpasang; lulus |
| m2-lock-closed (24×32) | public/assets/mission-02/puzzle/m2-lock-closed.png | Platform latch visual state | Final, terpasang; lulus |
| m2-lock-open (24×32) | public/assets/mission-02/puzzle/m2-lock-open.png | Platform latch visual state | Final, terpasang; lulus |
| m2-terminal (40×64) | public/assets/mission-02/puzzle/m2-terminal.png | Configuration terminal | Final, terpasang; lulus |
| m2-exit (48×96) | public/assets/mission-02/puzzle/m2-exit.png | Visual exit marker, no mission completion trigger | Final, terpasang; lulus |
| m2-object-selected (48×48) | public/assets/mission-02/puzzle/m2-object-selected.png | Separate object selection overlay | Final, terpasang; lulus |
| m2-icon-charge (24×24) | public/assets/mission-02/ui/m2-icon-charge.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-distance (24×24) | public/assets/mission-02/ui/m2-icon-distance.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-force (24×24) | public/assets/mission-02/ui/m2-icon-force.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-ruler (24×24) | public/assets/mission-02/ui/m2-icon-ruler.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-compare (24×24) | public/assets/mission-02/ui/m2-icon-compare.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-test (24×24) | public/assets/mission-02/ui/m2-icon-test.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-reset (24×24) | public/assets/mission-02/ui/m2-icon-reset.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-icon-lock (24×24) | public/assets/mission-02/ui/m2-icon-lock.png | Observation/preview control icon | Final, terpasang; lulus |
| m2-data-frame (32×32) | public/assets/mission-02/ui/m2-data-frame.png | HTML data/selected panel frame | Final, terpasang; lulus |
| m2-data-selected (32×32) | public/assets/mission-02/ui/m2-data-selected.png | HTML data/selected panel frame | Final, terpasang; lulus |
| m2-scan (64×64) | public/assets/mission-02/vfx/m2-scan.png | Finite scanning overlay | Final, terpasang; lulus |
| m2-latch-flash (24×24, 3 frame @ 10 FPS) | public/assets/mission-02/vfx/m2-latch-flash.png | Short docking latch effect | Final, terpasang; lulus |
| m2-docking-left (32×32) | public/assets/mission-02/puzzle/m2-docking-left.png | Deployable docking walkway with matching continuous floor collider in playable Mission 2 | Final, terpasang; lulus |
| m2-docking-middle (32×32) | public/assets/mission-02/puzzle/m2-docking-middle.png | Deployable docking walkway with matching continuous floor collider in playable Mission 2 | Final, terpasang; lulus |
| m2-docking-right (32×32) | public/assets/mission-02/puzzle/m2-docking-right.png | Deployable docking walkway with matching continuous floor collider in playable Mission 2 | Final, terpasang; lulus |
| m2-motor-broken (32×32) | public/assets/mission-02/puzzle/m2-motor-broken.png | Broken motor mounted separately on moving deck; no baked text or charge symbol | Final, terpasang; lulus |
