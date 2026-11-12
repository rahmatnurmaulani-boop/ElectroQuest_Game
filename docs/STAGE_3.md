# Tahap 3 — Fondasi Aplikasi

## Hasil

Fondasi lokal Vite + TypeScript strict + Phaser memakai aset ElectroQuest yang sudah tersedia. Menu dan panel memakai HTML/CSS agar teks tidak berubah menjadi piksel saat arena diskalakan. Dunia Phaser tetap 640 × 360 dengan Scale.FIT, CENTER_BOTH, pixelArt, roundPixels, antialias nonaktif dan filter tekstur NEAREST. ResizeObserver memperbarui skala setelah ukuran host berubah; host mempertahankan rasio 16:9. Panel tersusun vertikal pada ponsel dan halaman tetap dapat digulir/di-zoom.

BootScene memuat 72 entri manifest, menggunakan load.image atau load.spritesheet menurut jumlah frame. Setiap sheet diukur dari manifest dan dibandingkan dengan berkas aktual sesudah load. Tidak ada frame baru atau animasi gameplay yang dibuat. MenuScene dan MissionScene merakit sky, city, fasad, lantai dan empat prop memakai anchor manifest. Area gerbang tetap kosong untuk tahap puzzle.

Transisi Mulai menghentikan menu sebelum memulai misi. Kembali menghentikan misi/menu lama dan memulai ulang menu. Phaser menggunakan satu canvas, input game nonaktif pada tahap statis, dan tidak mengaktifkan sistem fisika. Panel Petunjuk/Pengaturan tetap berada pada menu. Tombol HTML memiliki focus ring, ukuran target minimal 50 px, serta dukungan aktivasi native keyboard/sentuhan.

## Pemulihan pemuatan

- Manifest di-fetch dengan batas 15 detik; HTTP gagal, JSON salah atau metadata invalid menampilkan pesan dan tombol Coba lagi.
- Berkas PNG gagal dicatat menurut key, tidak diam-diam diganti placeholder. Status menunjukkan jumlah yang berhasil.
- Lingkungan wajib tidak lengkap: Mulai nonaktif sampai reload berhasil. Aset nonlingkungan yang gagal tetap dilaporkan tanpa menghalangi pemeriksaan lingkungan.
- Gambar yang ukuran aslinya tidak cocok dengan manifest dilepas dari texture cache dan dianggap gagal.
- Browser tanpa Canvas 2D menerima pesan yang dapat dibaca. Phaser AUTO menyediakan fallback Canvas bila WebGL tidak tersedia.
- Teks besar dan kontras tinggi langsung diterapkan. localStorage yang tidak tersedia tidak merusak panel; pesan menjelaskan penyimpanan hanya untuk sesi.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
|---|---|
| Validasi 72 PNG sebelum perubahan | Lulus; tidak ada missing |
| TypeScript strict, npm.cmd run check | Lulus |
| Build Vite produksi, npm.cmd run build | Lulus |
| Chromium, npm.cmd test | 9 lulus, 10,2 detik |
| Menu / Petunjuk / Pengaturan / refresh / misi / kembali 3 kali | Lulus; satu canvas |
| Arena dasar 640 × 360, rasio 16:9 dan pixelated | Lulus pada 1440×900, 1024×768, 768×1024, 390×844, 320×740 |
| Overflow halaman pada ukuran tersebut, teks besar di 320 px | Tidak ada overflow horizontal |
| PNG wajib/opsional gagal, retry pemulihan | Lulus melalui route interception |
| Manifest 503, key duplikat, sky dihapus dari manifest | Lulus melalui route interception |
| Metadata dimensi sky salah | Ditolak sesudah load, Mulai nonaktif |
| WebGL tidak tersedia / Canvas tidak tersedia | Fallback Canvas / pesan gagal sesuai kondisi |
| Galeri aset lama | 72 PNG, kontrol tersedia |

Test memakai build produksi pada port 4181 dan menutup server pengujiannya. Pada percobaan pertama di sandbox, seluruh kasus lulus tetapi teardown proses Windows tertahan; pengulangan dengan izin proses yang sesuai selesai normal (9 passed, exit 0). Tidak ada kegagalan uji yang disembunyikan. Bukti screenshot: stage-3-evidence/menu.png, mission.png, mobile.png. Menu desktop dan misi ponsel dibuka untuk pemeriksaan visual; bukan hanya disimpan oleh skrip.

## Keterbatasan

Chunk Phaser sekitar 1,20 MB sebelum gzip / 320 KB gzip menghasilkan peringatan Vite. Library sudah dipisah dengan dynamic import, tetapi ukuran library belum dioptimalkan. Tidak ada klaim performa perangkat kelas rendah. Belum ada pengujian fisik TV/ponsel, browser Firefox/Safari, offline service worker, gameplay gerakan/puzzle, atau simulasi muatan. Catatan pemolesan animasi di ASSET_QA tetap berlaku.

Implementasi mengikuti skill phaser-gamedev dan playwright-testing serta alur Sites lokal saja. Tidak ada hosting, push, deployment, atau regenerasi aset. Langkah uji manual dan perintah lengkap tersedia di README.
