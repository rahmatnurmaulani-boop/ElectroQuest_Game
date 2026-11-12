# Paket landing baru dari nol

Seluruh aset yang terlihat pada landing sekarang memakai paket `lp-*` baru di `public/assets/landing/`. Tidak mengambil gambar dari percakapan terdahulu atau memakai ulang ilustrasi proyek untuk landing ini. Gameplay tetap memakai aset/model yang sudah berfungsi. Berkas lama dipertahankan untuk gameplay dan riwayat, bukan sebagai placeholder halaman baru.

Enam ilustrasi dibuat melalui alat bawaan **image_gen** pada tugas ini. Ion hanya memakai Raka yang baru dihasilkan pada tugas yang sama sebagai referensi gaya. Dua puluh bingkai/ikon/efek dibuat secara prosedural dari nol. Tidak memakai CLI image API, API key atau layanan berbayar tambahan.

## Sumber dan produksi

- Master imagegen: `assets-source/landing-v2/lp-*-master.png` (enam PNG asli, tidak ditimpa).
- Prompt lengkap dan metode: `assets-source/landing-v2/PROMPTS.md`.
- Normalisasi: `scripts/assets/import-landing.mjs`, skala seragam nearest-neighbor dan alpha asli dipertahankan. Tidak melukis ulang, menghapus latar melalui threshold, atau mengubah proporsi tubuh.
- Bingkai, ikon dan efek: `scripts/assets/landing-v2.mjs`.
- Metadata produksi: `assets-source/landing-v2/production.json`; manifest dokumen/runtime sinkron.
- Rebuild dari master yang tersimpan: `npm.cmd run assets:landing:v2`.
- Validasi: `npm.cmd run assets:landing:v2:validate`.

Raka dan Ion berupa ilustrasi **statis**, bukan animasi idle atau pose berganti. Gerakan melayang Ion dibuat lewat CSS. Tidak mengklaim transformasi posisi sebagai animasi karakter dengan frame pose berbeda. Bagian tubuh utuh diperiksa melalui alpha bounds. Langit sengaja opak; lima cutout/lapisan ilustrasi lain dan seluruh UI/efek memiliki alpha nol sungguhan.

## Inventaris pemasangan

Semua path berikut relatif terhadap `public/assets/landing/`. Status **Lulus** berarti final, terpasang pada komponen sebenarnya, file PNG/metadata/alpha valid dan dapat didekode di Chromium. Status bukan sekadar hasil galeri.

| Aset | Lokasi file | Komponen pengguna | Status pemeriksaan |
|---|---|---|---|
| Langit malam | lp-sky.png | Latar penuh layar judul | Lulus; opak sesuai fungsi |
| Kota jauh | lp-city.png | Lapisan di belakang laboratorium | Lulus; transparan |
| Laboratorium | lp-lab.png | Lapisan tengah diorama | Lulus; transparan |
| Lantai/dekorasi depan | lp-floor.png | Lantai, peti, pot, conduit | Lulus; transparan |
| Raka | lp-raka.png | Karakter utama di kanan, kaki sejajar lantai | Lulus; 160×240, siluet utuh |
| Ion | lp-ion.png | Pendamping melayang terpisah | Lulus; 96×96, siluet utuh |
| Bingkai judul | lp-title-frame.png | Judul HTML ELECTROQUEST | Lulus; nine-slice 8 px |
| Bingkai informasi | lp-panel-frame.png | Cara Bermain, Tentang Misi, Pengaturan | Lulus; nine-slice 8 px |
| Tombol normal | lp-button-normal.png | Menu dan Kembali pada loader | Lulus |
| Tombol fokus/hover | lp-button-focus.png | Menu/overlay terfokus atau hover | Lulus |
| Tombol ditekan | lp-button-pressed.png | Pointer/keyboard active | Lulus |
| Tombol nonaktif | lp-button-disabled.png | Tombol masuk selama transisi | Lulus |
| Ikon main | lp-icon-play.png | Mulai Petualangan | Lulus |
| Ikon lanjutkan | lp-icon-continue.png | Lanjutkan dengan checkpoint valid | Lulus |
| Ikon bantuan | lp-icon-help.png | Cara Bermain, Jeda animasi | Lulus |
| Ikon pengaturan | lp-icon-settings.png | Pengaturan | Lulus |
| Ikon suara | lp-icon-sound.png | Coba suara dalam Pengaturan | Lulus |
| Ikon kembali | lp-icon-back.png | Kembali dari pemuatan | Lulus |
| Ikon tutup | lp-icon-close.png | Tutup overlay, hapus progres | Lulus |
| Ikon informasi | lp-icon-info.png | Tentang Misi, Mulai Baru | Lulus |
| Emblem baru | lp-emblem.png | Ornamen identitas | Lulus |
| Cahaya lampu | lp-lamp-glow.png | Lampu amber pada fasad | Lulus |
| Sorotan glove | lp-glove-glow.png | Charge Glove cyan | Lulus |
| Partikel | lp-particle.png | Tiga partikel, masa hidup terbatas | Lulus |
| Bayangan kontak | lp-raka-shadow.png | Kontak kaki Raka dengan lantai | Lulus |
| Indikator loader | lp-loader.png | Loader aktual; empat frame 16×16/6 FPS | Lulus |

Tidak ada placeholder, aset yang belum terpasang, atau ilustrasi yang belum tersedia. Teks, judul, label dan data merupakan HTML. Tidak ada satu gambar besar berisi UI. Semua gambar landing menggunakan `assets/landing/lp-*`; tes memeriksa hal ini secara langsung.

## Integrasi

`LandingSkin.ts` memasang URL manifest absolut serta ikon baru. Skin khusus landing menjaga bingkai/ikon gameplay tetap sama. Nine-slice mempertahankan sudut dan border ketika judul/panel berubah ukuran. Empat status tombol terikat ke pseudo-state/disabled asli; fokus tetap memakai outline yang jelas. Indikator animasi tidak menggantikan progress nyata Phaser.

Langit, kota, lab dan lantai berlapis. Raka statis dengan skala proporsional; bayangan dan sorotan glove ditempatkan terpisah. Ion melayang ringan; lampu berdenyut; tiga partikel dibatasi dua siklus enam detik. Kurangi efek, media query, tab tersembunyi dan Jeda animasi menghentikan dekorasi. DOM/listener/audio dibersihkan saat masuk game, tanpa engine/simulasi di belakang landing.

Mulai/Lanjutkan, konfirmasi Mulai Baru, overlay, pengaturan bersama, loader gagal/retry/Kembali dan checkpoint tetap memakai fungsi aplikasi yang sama. Tampilan permainan satu layar, fisika dan pencatatan belajar tidak diubah.

## Hasil pemeriksaan

- TypeScript/build lulus. Chunk Phaser tetap sekitar 1,25 MB / 334 KB gzip, dimuat setelah masuk game.
- 26 unit fisika, gerakan, alur belajar dan checkpoint lulus.
- Suite Chromium: 41 tes lulus (3,5 menit). Sesudah koreksi visual skala Raka, pengulangan final foundation/title/landing-art: 13 lulus (47,3 detik).
- 132 PNG: 0 missing. Validasi khusus 26 aset baru memeriksa alpha, ukuran, siluet karakter, nine-slice, source dan kesamaan manifest. 72 hash PNG gameplay awal tidak berubah.
- Browser mendekode semua URL gambar CSS `lp-*`, memeriksa sumber semua img landing, posisi kaki terhadap lantai, normal/fokus/ditekan/nonaktif, loader, menu, resume dan keluar-masuk game.
- Desktop, landscape/portrait ponsel dan TV diemulasi hingga 3840×2160; tidak ada overflow horizontal atau karakter penting terpotong. Screenshot final 1440×900, 390×844, 844×390 serta loader dibuka dan ditinjau di `docs/landing-v2-evidence`.
- Belum uji perangkat fisik atau Safari/Firefox. Tidak mengklaim pengujian pendengaran speaker atau audit performa penuh. Tidak push/deploy.

## Preview/manual

`npm.cmd run dev` lalu buka URL Local. Preview produksi: `npm.cmd run build` kemudian `npm.cmd run preview`. Uji Mulai, Cara Bermain, Tentang Misi dan Pengaturan; Escape mengembalikan fokus. Pause → Kembali ke Beranda menampilkan Lanjutkan dan Mulai Baru. Batalkan konfirmasi Mulai Baru untuk mempertahankan checkpoint. Coba Jeda animasi/Kurangi efek dan ubah ukuran layar. Galeri `/gallery.html` hanya alat pemeriksaan tambahan; seluruh paket sudah dipakai pada halaman sebenarnya.
