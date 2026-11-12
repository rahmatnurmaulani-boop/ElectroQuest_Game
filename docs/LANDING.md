# Layar judul ElectroQuest

**Pembaruan terkini:** seluruh ilustrasi dan UI landing telah diganti dengan 26 aset baru dari nol (enam imagegen dan 20 prosedural). Halaman sekarang hanya merujuk paket `lp-*`. Potret/lingkungan lama tidak dipakai ulang pada landing terbaru; gameplay tetap dipertahankan. Lihat [LANDING_ASSETS_V2.md](LANDING_ASSETS_V2.md) untuk sumber, tabel pemasangan dan hasil tes final. Uraian empat aset/reuse di bawah merupakan riwayat versi sebelumnya.

Landing kini berupa satu komposisi layar judul, menggantikan halaman pemasaran panjang sebelumnya. Jenis gaming; suara mengikuti brief petualangan edukatif dalam bahasa Indonesia. Judul, label, subjudul, pengantar dan menu merupakan HTML. Palet navy/cyan/amber mengikuti aset proyek; font sistem lokal menjaga keterbacaan tanpa CDN. Komposisi foto/section panjang dari skill diganti oleh layar judul sesuai instruksi pengguna. Tidak ada statistik, testimoni, level tambahan atau klaim hasil belajar yang dibuat-buat.

## Komposisi dan menu

- Desktop: teks/menu di kiri dan laboratorium berlapis di kanan, tanpa elemen penting terpotong. Ponsel: judul/menu di atas, Raka/Ion dan lingkungan di bawah; scroll vertikal diizinkan saat tinggi tidak cukup. Tidak ada scroll horizontal.
- Menu: Mulai Petualangan, atau Lanjutkan dan Mulai Baru bila readProgress menghasilkan checkpoint valid; Cara Bermain, Tentang Misi dan Pengaturan membuka native dialog dengan fokus terkelola, Escape dan Tutup.
- Seluruh tombol masuk menggunakan satu fungsi. Mulai Baru meminta konfirmasi dan baru menggantikan checkpoint setelah misi baru berhasil dibuat. Tombol segera nonaktif selama transisi; menu Mulai kedua tidak ada.
- Loader nyata menampilkan progress Phaser. Gagal memuat menyediakan Coba lagi dan Kembali. Kembali juga tersedia selama pemuatan. Token percobaan mencegah fetch/loader lama membangun game sesudah pembatalan.
- Pengaturan menggunakan mountSettings dan penyimpanan yang sama dengan pause. Beranda → Game → Beranda mempertahankan progres. Tidak ada Phaser/RAF atau simulasi di belakang layar judul.

## Aset yang dipasang

| Aset | Path hasil | Pengguna | Sumber/status |
|---|---|---|---|
| Emblem geometris ElectroQuest | public/assets/landing/eq-emblem.png | Identitas di samping label | Prosedural final, 48×48 RGBA |
| Cahaya lampu | public/assets/landing/landing-lamp-light.png | Lampu laboratorium berdenyut | Prosedural final, 64×64 RGBA |
| Sorotan Charge Glove | public/assets/landing/landing-glove-light.png | Cahaya cyan lokal di tangan Raka | Prosedural final, 64×64 RGBA |
| Ikon Lanjutkan | public/assets/landing/icon-continue.png | Tombol checkpoint valid | Prosedural final, 24×24 RGBA |
| Langit, kota, laboratorium, lantai, lampu, plant, crate | public/assets/environment/*.png | Lapisan latar dan depan | Aset proyek final digunakan kembali |
| Raka idle dan Ion idle | public/assets/characters/{raka-idle,ion-idle}.png | Karakter utama | Sheet 4 frame, 6 FPS sesuai manifest |
| Bingkai gerbang, rel, panel dan terminal | public/assets/puzzle/*.png | Diorama laboratorium | Aset proyek final digunakan kembali |
| Bingkai tombol/status dan panel, ikon main/bantuan/info/pengaturan/suara/kembali | public/assets/ui/*.png | Menu, overlay dan pengaturan | Aset UI final digunakan kembali |

Sumber tambahan dipertahankan terpisah di `scripts/assets/landing.mjs` dan `assets-source/landing-production.json`. `npm.cmd run assets:landing` hanya membangun empat tambahan ini. Manifest dokumen/runtime memuat path, ukuran, source, final/status dan alpha. Empat PNG mempunyai piksel alpha nol sungguhan; tidak ada checkerboard yang dibakar ke gambar, teks, menu atau angka muatan di dalam gambar. Validasi: `npm.cmd run assets:landing:validate`.

Tidak ada aset placeholder atau ilustrasi yang belum tersedia. Alat image generation tersedia tetapi tidak diperlukan: karakter/lingkungan proyek sudah layak, dan tambahan berupa emblem geometris serta tekstur cahaya prosedural. Tidak ada layanan berbayar tambahan. Semua 72 PNG awal tetap sama berdasarkan hash. Galeri `/gallery.html` mencakup kategori landing; `/ui-gallery.html` tetap menampilkan komponen bersama.

## Gerakan dan siklus hidup

Raka dan Ion memakai frame sheet sebenarnya, bukan mengklaim gambar statis sebagai perubahan pose. Sprite mendapat ukuran/frame/FPS dari manifest. Gerakan melayang Ion merupakan efek posisi terpisah dari animasi sheet. Lampu memakai denyut ringan; tiga partikel dekoratif masing-masing dibatasi dua siklus enam detik (delay maksimal dua detik), bukan emitter tanpa batas. Tidak menggambar arah elektron/gaya pada landing.

Jeda animasi, tab tersembunyi, Kurangi efek dan prefers-reduced-motion menghentikan dekorasi. Menu tetap berfungsi tanpa gerakan. AbortController membersihkan listener; DOM animasi dibuang saat masuk game dan audio dihentikan. Audio tidak otomatis dimulai sebelum gesture pengguna. Skin mengakses URL manifest absolut sehingga path tetap valid pada build dan subdirektori.

## Pemeriksaan

- TypeScript/build lulus. Warning chunk Phaser sekitar 1,25 MB / 334 KB gzip tetap ada; engine dimuat dinamis setelah masuk.
- Unit: 26 lulus. Validasi: 106 PNG, 0 missing; empat tambahan landing mempunyai dimensi/alpha/source/manifest valid; 72 hash PNG awal tidak berubah.
- Chromium awal: 37 lulus dari 39; dua temuan diperbaiki (folder landing belum masuk kategori galeri, serta tes kembali dari subpanel pause yang belum menekan Kembali ke pause). Pengulangan final foundation/title: 11 lulus dalam 41,8 detik, termasuk kedua kasus tersebut. Semua 39 kasus sudah tercakup, tanpa mengklaim satu run suite final 39/39.
- Suite Chromium menguji gameplay, belajar, checkpoint, audio, touch, fullscreen serta UI. Pengulangan terarah foundation/title memeriksa semua overlay, navigasi fokus, mulai/lanjut/mulai baru dan pembatalan, kegagalan/retry, galeri, loader batal tanpa game ganda, serta pengaturan yang sama dengan game.
- Ukuran: 320×740, 390×844, 844×390, 1440×900, 1920×1080 dan 3840×2160. Memeriksa tombol minimal 48 CSS px, karakter/judul dalam batas horizontal, tidak ada overflow horizontal, desktop satu viewport dan scrolling pada layar pendek. Screenshot final desktop, ponsel serta overlay misi dibuka dan ditinjau di docs/title-screen-evidence.

**GATE: ERROR** — checker skill tidak membaca main/section/h1 dari shell Vite, consistency tidak dapat berjalan pada 1440/390, dan layout check timeout. Sesuai instruksi tool, gate tidak diulang atau diklaim PASS. Uji aplikasi dengan Chromium dilakukan terpisah. Tidak ada waiver atas hasil yang tidak berjalan, audit perf penuh atau klaim pemeriksaan browser lain.

Belum uji ponsel/TV fisik atau Safari/Firefox. Tidak push/deploy. Preview: `npm.cmd run dev`, atau `npm.cmd run build` lalu `npm.cmd run preview`; buka URL Local yang dicetak terminal. Langkah manual ada di README.
