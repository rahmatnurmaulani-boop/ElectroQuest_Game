# Model fisika — Gerbang Muatan, Tahap 5

## Tambahan terkini: Jembatan Coulomb

Implementasi murni: src/physics/coulomb.ts. Satuan permainan: posisi piksel dunia, waktu detik permainan, muatan/massa/gaya berskala permainan, tanpa satuan SI atau Newton.

`Fplatform = 100000 × qS × qP / max(48, |xPusatPlatform − xSumber|)² × sign(xPusatPlatform − xSumber)`; `Fsumber = −Fplatform`. Sumber diam karena dudukan menahan gaya reaksi. Bola dianggap muatan titik. Netral memberi gaya model nol, tetapi polarisasi belum disimulasikan sehingga tidak digeneralisasi menjadi semua benda netral bebas gaya.

Massa1; redaman0.6/detik; semi-implicit Euler pada h=1/120detik: `v'=clamp((v+F/m*h)*exp(-0.6h),-26,26)`, `x'=x+v'h`. Langkah tetap, akumulasi per frame≤0.1detik; pause mengosongkan accumulator. r/F dihitung ulang setiap langkah. Batas rel pusat320–408 dan jarak aman48 mencegah singularitas/kontak bola. Pengaturan sumber68–208 dengan pusat bola awal348 menyediakan r140 dan280. Muatan bola−4..4, reservoir−8..8, total0; setiap elektron mengambil1 dari reservoir ke bola (atau sebaliknya) dicatat atomik. Reservoir netral tetap memiliki elektron. Preset menggunakan transaksi yang sama. Reset eksplisit mengembalikan konfigurasi awal.

Docking380–408; pengunci dapat aktif hanya di zona dan menjepit posisi392 dengan v0. Ini rem mekanis, bukan keseimbangan listrik. Pengunci otomatis tersedia tanpa penalti. Setelah docking, sambungan visual serta collider lantai192–448 pada y304 aktif bersamaan. Platform saja atau muatan sejenis saja tidak menyelesaikan misi: bukti penyelidikan, penyeberangan Raka dan penjelasan juga diperlukan. Uji netral/tarikan berhenti aman; timeout24detik, bukan penilaian waktu siswa. Waktu tempuh bukan ukuran langsung gaya.

Solusi teruji qS=+2,qP=+2,reservoir−4,sumber208,r awal140; auto-lock mencapai docking392. Perbandingan statis pada r280 memberi F/4; qP4 pada r140 memberi2F. Muatan/posisi sumber terkunci saat simulasi. Dua tes browser alur penuh dan39 unit pada proyek terkini lulus; rincian QA berada di MISSION_02_QA.md.

Catatan integrasi Tahap 6: rumus, parameter, batas, transfer, dan kondisi mekanis di dokumen ini dipertahankan. State belajar di `src/learning/session.ts` terpisah dari fase gerbang. Transfer/Uji kini baru diizinkan setelah observasi dan prediksi awal disimpan. Selesainya gerbang tidak otomatis menyelesaikan misi; penjelasan dan refleksi mengikuti alur di LEARNING_FLOW.md. Reset fisika tetap sama, dengan catatan percobaan aktif sebagai CANCELLED pada model belajar.

## Ruang lingkup dan satuan

Ini adalah pendekatan gaya terpusat untuk gameplay, bukan simulasi akurat distribusi muatan pada dua panel logam. Pengaruh Charge Glove terhadap gaya panel, distribusi permukaan, medan sekitar, dan polarisasi tidak dimodelkan. Posisi menggunakan piksel dunia 640 × 360, waktu detik permainan; gaya dan massa memakai satuan skala permainan. Tidak ada nilai Newton yang ditampilkan dan tidak ada konversi ke SI yang diasumsikan.

Angka muatan adalah satuan muatan bersih permainan, bukan jumlah seluruh elektron di benda. Alat dengan muatan bersih 0 tetap mengandung elektron dan boleh mengirim elektron. Satu konfigurasi pusat `PUZZLE` di src/content/mission.ts menentukan awal kiri +3, kanan −3, alat 0, total 0; batas setiap objek −8 sampai +8. Model murni di src/physics/charges.ts tidak mengimpor Phaser atau DOM.

## Transfer atomik

Untuk satu elektron dari A ke B, `qA' = qA + 1` dan `qB' = qB − 1`. Ambil memakai sumber panel dan penerima alat; Kirim memakai sumber alat dan penerima panel. Kedua nilai calon diperiksa sebelum membuat state baru. Jika salah satu melewati batas, state lama dikembalikan tanpa perubahan parsial. Semua objek lain dipertahankan; jumlah kiri + kanan + alat tetap 0. UI memberikan alasan penolakan dan tidak memunculkan partikel untuk transaksi ditolak.

Klik/tap atau aktivasi keyboard menghasilkan satu permintaan transaksi. Keydown repeat Enter/Space dicegah pada dialog. Tidak ada timer, animasi, partikel atau animationcomplete yang mengubah muatan. Listener per dialog dipasang sekali dan dibuang melalui AbortController pada shutdown.

Contoh solusi yang telah diuji:

| Tindakan dari keadaan awal | Kiri | Kanan | Alat | Total |
|---|---:|---:|---:|---:|
| Ambil 6 elektron dari panel kanan | +3 | +3 | −6 | 0 |
| Kirim 6 elektron ke panel kiri | −3 | −3 | +6 | 0 |

## Gaya dan integrasi

Dengan pusat panel `xL`, `xR`, jarak `r = max(48, abs(xR − xL))`:

`Fkanan = 180000 × qL × qR / r²`, `Fkiri = −Fkanan`.

Muatan sejenis bukan nol memberi gaya keluar; berbeda jenis memberi gaya ke dalam. Kedua gaya selalu sama besar dan berlawanan arah. Jika salah satu panel netral, kedua gaya model bernilai nol. UI menjelaskan secara eksplisit:

> Model misi ini belum menyimulasikan polarisasi. Dalam keadaan nyata, benda netral dapat tertarik oleh benda bermuatan.

Massa masing-masing 1,5 satuan permainan; redaman 1,5 per detik; batas kecepatan 64 px/detik. Integrasi semi-implicit Euler pada langkah tetap `h = 1/120 detik`:

`v' = clamp((v + F/m × h) × exp(−1.5h), −64, +64)`

`x' = x + v' × h`

Accumulator per frame dibatasi 0,1 detik. Waktu berlebih dibuang untuk menghindari lompatan sesudah frame panjang. Blur/halaman tersembunyi menjeda scene; accumulator dibersihkan saat pause/resume. Tidak ada catch-up berdasarkan jam dinding. Posisi y panel tetap sepanjang rel horizontal.

Pusat awal kiri 288 dan kanan 352; lebar panel 64. Batas rel kiri 224–288, kanan 352–416. Posisi dibatasi dan kecepatan dinolkan ketika menyentuh batas. Pemisahan pusat minimum 64 mencegah tumpang tindih, termasuk guard kontak eksplisit. Karena awalnya kedua panel berdampingan pada batas tertutup, tarikan tampak sebagai panah ke dalam dan tekanan pada batas, bukan panel saling menembus. Panah menampilkan arah dan besar relatif terbatas 42 px, bukan nilai gaya dalam Newton.

Kedua solusi ±3/±3 mencapai kedua batas terbuka dalam kurang dari 5 detik waktu permainan (assertion unit). Gaya rendah diberi kesempatan hingga 8 detik. Netral/tarikan yang tertahan berakhir setelah sekitar 1,2 detik dengan penjelasan sesuai model.

## Mesin status dan pengunci

- `CONFIGURING`: panel ditahan, collider gerbang tertutup, transfer diizinkan di terminal. Posisi tidak berubah akibat transfer.
- `SIMULATING`: Uji gerbang melepas pengunci dan menutup modal. Transfer dan pembukaan terminal dinonaktifkan; Reset eksperimen di luar modal tetap tersedia. Raka dapat bergerak tetapi collider gerbang masih menahan jalur.
- `OPENED`: hanya setelah kedua panel mencapai 224/416 dan model mencatat perpindahan keluar akibat tolakan. Muatan sejenis saja tidak cukup. Kecepatan dinolkan; dua kait menahan panel stabil; collider penghalang dilepas dan Raka dapat lewat.
- `UNSUCCESSFUL`: hasil netral, tarikan atau batas waktu tanpa mencapai kedua batas. Gerakan berhenti, mekanisme kembali menahan dan collider tetap tertutup. Reset mengizinkan percobaan berikutnya tanpa hukuman.

Reset membangun state awal baru: muatan, posisi, kecepatan, elapsed, penanda tolakan, fase dan pengunci; accumulator, panah serta semua partikel dibersihkan. Collider mengikuti fase sehingga kembali tertutup. Jika Raka sudah berada di/celah atau di sisi lain gerbang, ia dikembalikan ke posisi awal untuk menghindari muncul di dalam collider baru. Bila masih di sisi aman kiri, posisinya dipertahankan agar mudah bereksperimen ulang. Reset aman dari dialog, selama simulasi, setelah kegagalan dan setelah keberhasilan.

## Presentasi dan waktu

Label +/−, nilai dan warna dibaca dari state model yang sama untuk panel arena dan readout HTML. Muatan alat tampil sebagai muatan bersih. Partikel elektron mengikuti sumber → penerima transaksi, bukan arah gaya. Efek arena serta jalur visual di modal masing-masing dibatasi 8 partikel, durasi 0,6 detik; posisi diperbarui dari delta scene dan dibersihkan saat selesai/reset/shutdown. Partikel tidak menentukan hasil transaksi.

Animasi raka-tool memakai 6 frame/10 FPS sekali putar dari manifest. Modal membekukan gerakan Raka/Ion dan waktu eksplorasi; loop visual scene tetap hidup agar animasi alat dan elektron yang sah dapat terlihat. Blur tetap menjeda seluruh scene, termasuk efek. Modal native menjaga fokus; Tutup/Escape mengembalikan kontrol. Penutupan modal saat Uji tidak memicu transaksi tambahan.

## Verifikasi aktual

- `npm.cmd run test:unit`: 13 lulus (10 model muatan/gaya + 3 gerakan sebelumnya). Mencakup dua arah transfer, alat netral mengirim, 200 transaksi, batas sumber/penerima, kegagalan atomik, kekekalan, arah dan besar relatif gaya, netral, jarak sangat kecil, dua solusi mekanis, kontak, syarat berhasil dan reset.
- `npm.cmd run check` dan `npm.cmd run build`: lulus. Chunk Phaser sekitar 1,22 MB / 326 KB gzip masih menghasilkan peringatan yang tidak disembunyikan.
- `npm.cmd test`: 20 lulus (58,9 detik), termasuk 15 regresi serta lima alur puzzle: kedua solusi, passage/collider, reset selama/sesudah simulasi, konfigurasi tanpa gerakan, tarikan/netral, penolakan batas, held Enter, background pause, sentuhan dan restart.
- `npm.cmd run assets:validate`: 72 PNG lulus. SHA-256 tetap sama dengan baseline Tahap 4; manifest sumber dan runtime identik.
- Screenshot configuring.png, opened.png dan mobile.png di docs/stage-5-evidence benar-benar dibuka untuk inspeksi visual. Dialog ponsel memakai scroll internal; kontrol bawah tetap dapat dijangkau. Partikel terlihat pada jalur panel → alat, tanda/nilai terbaca, panel terbuka terpisah dan dikaitkan.

Satu fixture unit awal memakai arah transfer yang justru menjauh dari batas alat; fixture diperbaiki agar menguji pelanggaran yang benar. Tidak ada perubahan aturan untuk meloloskan tes. Belum diuji pada ponsel/TV fisik, Firefox/Safari atau perangkat sangat lambat; touch adalah emulasi Chromium dan blur diuji dengan event sintetis. Aset dan batas visual pencerminan Charge Glove/foot sliding dari Tahap 4 tetap berlaku. Tidak ada prediksi, skor, penilaian atau refleksi Tahap 6.
