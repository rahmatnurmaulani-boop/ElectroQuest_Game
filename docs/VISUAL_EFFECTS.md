# Efek visual ElectroQuest

Sumber bersama: `src/entities/WorldEffects.ts` dan `src/vfx.css`.

Efek baru digambar prosedural melalui Graphics Phaser: cahaya lampu bertingkat, delapan titik suasana, debu langkah, sudut penanda terminal, penanda tujuan dan kilau keberhasilan singkat. Dua objek Graphics per scene, maksimum40 partikel sementara, tanpa texture eksternal atau unduhan tambahan. Partikel ini dekorasi, bukan elektron/muatan; tidak ada diagram gaya baru. Aset elektron, scan, kait, polarisasi, kilau hasil dan landing yang sudah sesuai dipertahankan.

Ketiga misi memakai sistem yang sama. Keberhasilan berasal dari OPENED/DOCKED/CLEARED, bukan timer dekoratif. Pemulihan checkpoint tidak memicu ledakan keberhasilan palsu. Efek mengikuti delta permainan dan berhenti ketika permainan dijeda. Kurangi efek menghapus partikel serta gerak dekoratif, tetap menyisakan penanda statis. Shutdown menghancurkan Graphics; tidak ada listener global/timer tambahan.

Transisi dialog hanya mengubah opacity selama140ms. Transform/posisi dimiliki layout arena. Regresi sebelumnya disebabkan animasi transform yang menimpa translate pemusatan dialog, membuat pengarahan berada di luar layar dan mengunci gerakan secara sah sampai dialog ditutup. Perbaikannya menjaga transform asli, tanpa menghapus aturan pause/input.

Uji manual: jalankan `npm.cmd run dev`, mulai Misi1, klik Lanjut, berjalan dengan A/D, dekati terminal; periksa penanda dan debu. Buka pause, Pengaturan, aktifkan Kurangi efek, lalu Lanjutkan. Uji terminal dan gerbang; lanjutkan Misi2 sampai docking dan Misi3 sampai baki terbuka. Periksa window pada fullscreen, desktop, landscape dan portrait, scroll internal serta ulang buka/tutup. Progres asli tidak perlu dihapus.

Hasil pemeriksaan akhir dicatat di docs/PROGRESS.md. Belum benchmark FPS pada perangkat fisik atau verifikasi Safari/Firefox. Build tetap memiliki warning ukuran chunk Phaser.
