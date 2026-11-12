# Tahap 4 — Arena, gerakan karakter, dan interaksi dasar

## Implementasi

Arena tetap 640 × 360, lantai y=328. Bukaan laboratorium dipertahankan pada x=256–384. Bingkai, dua rel, panel kiri/kanan, kait tertutup, terminal dan pintu tujuan memakai PNG terpisah. Dekorasi dipindahkan dari jalur terminal dan digambar di belakang aktor. Pintu tujuan berada di (578,328), tetapi belum dapat dicapai melewati gerbang terkunci.

Raka mulai di (80,328), berjalan 100 px/detik dengan A/D, panah kiri/kanan, atau tombol sentuh. Gerakan horizontal memakai delta dalam detik, tabrakan swept terhadap penghalang, batas arena dan tabrakan lantai sederhana dalam modul physics/movement.ts. Tidak mengaktifkan Arcade/Matter atau solver muatan untuk tahap ini. Frame lambat dibatasi 100 ms agar resume tidak menimbulkan lonjakan posisi. Tidak ada lompatan.

Animasi dibuat dari metadata manifest: idle Raka 4 frame/6 FPS, walk 8 frame/12 FPS, Ion 4 frame/6 FPS. Anchor Raka selalu (0.5,0.9375), posisi y=328; pergantian animasi tidak mengubah titik kaki. Gerak tertahan gerbang menghasilkan idle. Ketika ke kiri, seluruh sprite memakai flipX: Charge Glove ikut tercermin ke sisi tampilan sebaliknya. Versi ini tidak membuat pose kiri yang mempertahankan tangan anatomis; tidak ada aset yang digenerasi ulang.

Ion mengikuti memakai interpolasi eksponensial berbasis waktu dan bob sinus kecil (3 px). Jalurnya berada di atas kepala dan ditahan di sisi kiri terminal agar tidak menutupi marker E. Waktu gerak Ion berasal dari akumulasi delta scene, bukan Date.now atau timer browser.

## Interaksi dan input

ARENA dan INITIAL_GATE di src/content/mission.ts menjadi konfigurasi posisi/jangkauan serta satu sumber kondisi awal: panel kiri + positif/amber dan kanan − negatif/cyan. Simbol pada arena dan readout dialog membaca objek yang sama. Terminal di (208,328), jangkauan horizontal 48 px dan syarat berada di lantai. Status ini diperiksa saat permintaan interaksi dikonsumsi, bukan hanya ketika tombol ditampilkan.

Di jangkauan, terminal digarisbawahi highlight cyan dan marker E; HTML menampilkan **E — Periksa terminal**. Tombol interaksi nonaktif dari luar jangkauan. E adalah kejadian satu kali: repeat keyboard diabaikan; menahannya dari luar jangkauan tidak membuka panel setelah berjalan mendekat. Dialog native HTML menyajikan nama/fungsi terminal, keadaan awal panel dan kait terkunci. Tidak ada transfer elektron, pergerakan panel atau perhitungan gaya.

Saat dialog terbuka, input dibersihkan/dinonaktifkan dan scene dijeda. Fokus berpindah ke Tutup, Tab terkurung oleh dialog native, Escape menutup, lalu fokus kembali ke tombol interaksi. Animasi, gerakan Raka dan posisi/waktu Ion berhenti bersama. Pause dialog dan background memiliki alasan terpisah sehingga fokus kembali tidak membuka kontrol selama dialog masih terbuka.

MissionInput adalah satu sumber status untuk keyboard dan banyak pointer. Pointer dimiliki tombol asal sejak pointerdown, dengan capture dan fallback pelepasan pada document. pointerup, pointercancel, lostpointercapture, blur, visibilitychange dan resize membersihkan input. Tombol arah saja memakai touch-action:none; halaman tetap mendukung gulir/zoom. Tombol sentuh berada di luar canvas, di bawah arena. Pada ponsel arena/kontrol didahulukan sebelum panel teks.

Semua listener per misi memakai AbortController. Shutdown menghapus input, melepaskan capture, membuang dialog dan kontrol DOM; objek scene otomatis dihancurkan Phaser. Tiga definisi animasi global digunakan ulang berdasarkan key. Tidak ada timer browser atau listener tambahan yang menumpuk pada restart. DOM data-mission pada host menyajikan snapshot hanya baca untuk pemeriksaan browser; tidak ada API yang mengubah status permainan melalui window.

## Pemeriksaan aktual

- TypeScript strict dan build produksi: lulus.
- Unit: 3 lulus. Jarak satu detik sama pada 30/60/120 FPS; gerbang tidak dapat ditembus dari dua arah bahkan pada langkah waktu panjang; batas kiri/kanan dan lantai menahan tubuh.
- Chromium: 15 kasus lulus (9 regresi fondasi + 6 kasus tahap ini). Pengujian menggunakan build produksi dan server khusus yang dihentikan setelah tes.
- Browser menguji gerak A/D/panah, animasi/fps/frame/anchor aktual, batas kiri, gerbang, input di luar jangkauan, E ditahan, fokus dialog/Tab/Escape/Tutup, gerak sesudah tutup, pause waktu dan posisi Ion, pointer release di luar tombol, cancel/lost capture, resize saat input ditahan, blur/focus dan restart tiga kali.
- Sentuhan browser memakai konteks hasTouch dan Input.dispatchTouchEvent Chromium (CDP), termasuk tahan arah, pelepasan, tap interaksi/Tutup dan touchCancel. Ini emulasi event sentuh, bukan bukti perangkat fisik.
- Tes regresi memeriksa 640 × 360 / rasio 16:9 / pixelated pada 1440×900, 1024×768, 768×1024, 390×844 dan 320×740, tanpa scroll horizontal; galeri 72 PNG tetap tersedia.
- Aset wajib diperluas untuk gerakan/gerbang, termasuk raka-walk. Kegagalan berkas itu diuji dan menonaktifkan Mulai.
- SHA-256 seluruh 72 PNG sama persis dengan baseline awal tahap ini (stage-4-asset-baseline.json). Validasi aset tetap lulus; tidak ada perubahan gambar/manifest.

Screenshot yang benar-benar dibuka dan diperiksa: stage-4-evidence/gate.png, inspection.png, mobile-arena.png dan mobile-inspection.png. Raka, Ion dan penanda terbaca, dialog memuat kedua tanda dan warna, tombol berada di luar arena. Pemeriksaan visual ponsel menemukan skip link transform terbawa dalam screenshot compositor; aturan posisi disederhanakan agar tersembunyi di luar viewport dan tetap muncul ketika fokus keyboard. Bukti akhir diambil ulang setelah perbaikan.

Dua kegagalan awal berasal dari harness pengujian: tap memerlukan konteks hasTouch, dan role selector mengabaikan dialog yang tertutup saat menghitung elemen. Keduanya diperbaiki; hasil akhir bukan retry yang mengabaikan kegagalan. Pengujian blur/cancel/lost capture mencakup event sintetis; jangan menyamakannya dengan semua perilaku perangkat.

## Batas yang tersisa

Walk masih memiliki sedikit variasi gambar antarpose/foot sliding dari sumber generasi, seperti dicatat ASSET_QA. Titik anchor tidak bergeser. Pada ponsel kecil ukuran karakter mengikuti pengecilan arena; panel pemeriksaan tetap berupa teks HTML yang dapat diperbesar. Belum diuji pada TV/ponsel fisik, Safari/Firefox, atau perangkat dengan FPS sangat rendah. Peringatan chunk Phaser sekitar 1,21 MB / 323 KB gzip masih ada. Gerbang sengaja tetap terkunci dan sisi kanan arena belum terjangkau pada jalur awal. Tidak ada backend, level baru, lompatan, puzzle, atau model fisika gerbang.

Jalankan `npm.cmd run dev`, lalu ikuti uji manual di README. Pemeriksaan: `npm.cmd run check`, `npm.cmd run test:unit`, `npm.cmd run build`, `npm.cmd test`, `npm.cmd run assets:validate`. Skill phaser-gamedev dan playwright-testing dipakai. Tidak ada push/deploy.
