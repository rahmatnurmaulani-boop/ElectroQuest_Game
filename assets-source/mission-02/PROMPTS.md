# Misi 2 — sumber ilustrasi

Dibuat baru pada tugas Misi 2 dengan alat bawaan image_gen. Tidak memakai gambar percakapan lama atau layanan eksternal. Master PNG asli disimpan di folder ini; runtime 640 × 360 dinormalisasi nearest-neighbor oleh scripts/assets/mission-02.mjs. Ikon dan mekanisme merupakan geometri orisinal dalam skrip tersebut.

Arahan bersama: pixel art 16-bit ElectroQuest; malam kota sains; navy, biru keunguan, abu-abu kebiruan, cyan dan amber; cahaya dari kiri atas; objek interaktif tidak digambar ke lapisan latar; tanpa teks, angka atau simbol muatan. Tiga keluaran terpisah:

- `m2-sky-master.png`: langit malam lebar, bulan di kiri atas, awan pixel tipis, tengah lapang untuk eksperimen. Latar opak.
- `m2-city-master.png`: skyline kota jauh, menara di sisi kiri/kanan, tengah tenang. Latar transparan, tidak ada platform, rel atau bola interaktif.
- `m2-rear-master.png`: struktur belakang koridor jembatan kota, pilar dan balok pada sisi, detail mekanis sekunder. Transparan; tidak ada lantai pijakan, platform, bola, terminal atau tanda eksperimen.

Catatan: ringkasan arahan produksi, bukan salinan verbatim semua prompt alat. Transparansi runtime diperiksa dari kanal alpha PNG, bukan pola checkerboard. Sky dan tile berbentuk persegi penuh sengaja opak.
