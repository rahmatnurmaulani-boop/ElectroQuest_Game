# Sistem konsol ElectroQuest

## Hasil dan struktur

62 aset final baru, langsung terhubung ke aplikasi:10 bingkai nine-slice;24 status tombol(4 varian×6 status);18 ikon;7 ornamen/emblem/loader;3 ilustrasi hasil berbeda. Sumber scripts/assets/console-ui.mjs; master/prompt/production.json di assets-source/console-ui; ekspor public/assets/ui/shared, landing, results. Tidak ada placeholder baru. Warna navy/steel/cyan/amber mengikuti game. Screenshot referensi tidak dipakai sebagai gambar final, dan tidak ada lingkaran merah di aset.

Komponen bersama:

- ConsoleUI.ts: instalasi path manifest dan satu observer terbatas childList untuk window dinamis. Tidak mengamati atribut diagnostik canvas yang berubah tiap frame. Ikon/dekorasi idempotent; tidak memasang ulang handler gameplay. Gambar yang gagal dimuat tidak menghilangkan label/data/tombol.
- console-ui.css: token palet, padding16px(12px ponsel), teks16px(15px ponsel), ikon24px, slice12px, aksi minimum48px, animasi120ms. High Contrast dan Teks lebih besar dipertahankan. Input tetap native semantic; outline fokus amber/putih, bentuk checked/pressed/disabled berbeda. Tabel/scrollbar/popup/notifikasi dalam keluarga yang sama.
- MissionResult.ts: satu struktur hasil untuk Misi1–3. Statistik dan ringkasan diberikan oleh session aktual; tidak ada angka default yang mengaku sebagai bukti pemain. Label “jawaban konsep benar” menggantikan “konsep dipahami”. Ilustrasi bukan diagram fisika. Gambar Misi1 tanpa tanda muatan permanen, sehingga sesuai kedua solusi±.
- PausePanel.ts: satu konsol vertikal, subwindow pengaturan/bantuan/dialog, footer checkpoint dari status write aktual. Misi2/3 kini mengatakan belum tersimpan ketika write gagal. Misi1 memeriksa checkpoint sebelum pause.
- ConfirmDialog.ts + gameDialogs.ts: konfirmasi aplikasi berbasis native HTML dialog(top layer/inert), focus trap, Escape/Batal, pemulihan fokus dan satu konfirmasi pending. Konfirmasi memberi alasan pause terpisah. Dialog induk tetap terbuka namun inert; menutup konfirmasi tidak menghapus alasan pause lain. Cleanup membatalkan konfirmasi sebelum mengganti scene. Tidak ada popup window.confirm game yang tersisa.

Skin v1 dilepas dari main entry. ui-layout.css mempertahankan tata letak/input tanpa border-image lama. ui-skin.css hanya dipakai galeri arsip. Deklarasi raster landing lama yang tidak dipakai dibuang. Aset lama yang masih layak dan gambar dunia tetap tersedia; tidak membuat ulang Raka/Ion atau mengubah rumus/transaksi fisika.

## Ukuran modular

Panel48×48 dengan slice12 pada semua sisi; sudut selalu12 CSSpx. Padding isi16, minimum panel128×64, portrait48×48. Tombol72×40(ikon48×40), slice12, area sentuh kode≥48×48. State normal/hover/focus/pressed/disabled/selected punya ekspor berbeda; fokus memakai corner marks dan outline tambahan, disabled memakai notch diagonal, selected memakai tab sisi. Label tidak dipanggang ke PNG. Art hasil640×280, aspect asli dipertahankan dengan transparansi; objek tidak diregangkan. Header/modal bergulir internal; aksi tetap dapat dicapai. Landing desktop dibatasi viewport; panel lokal boleh scroll ketika tinggi pendek/checkpoint menambah tombol. Ponsel landing menumpuk menu dan ilustrasi; gameplay tetap satu arena 16:9 dengan letterbox, sedangkan dialog pada portrait memakai ruang viewport agar form dan aksi tidak terjepit setinggi arena.

## Checklist window aktual

| Window | Pemicu | Komponen/aset | Misi/halaman | Keyboard/sentuh | Pemeriksaan |
|---|---|---|---|---|---|
| Judul/menu | Beranda | ConsoleUI, main/title/emblem/buttons | Landing | Tab/Enter; target48px | Browser+visual |
| Cara bermain | Tombol menu/pause | Shared modal/header | Landing,1–3 | Fokus/Escape; tap | Browser |
| Tentang misi | Tombol landing | Shared modal/stat | Landing | Fokus/Escape | Browser |
| Pengaturan | Menu/pause | Modal,input,toggle,slider,sound icons | Landing,1–3 | Keyboard/range/checkbox; tap | Browser |
| Pilih misi | Menu/hasil | Modal/list/buttons,disabled | Landing,1–3 | Tab/Enter; target48px | Browser |
| Mulai Baru | Checkpoint tersedia | ConfirmDialog warning | Landing | Batal/Enter/Escape | Browser |
| Ulang misi | Hasil/pembelajaran/menu | ConfirmDialog warning |1–3 | Fokus dan cancel | Migrasi diterapkan; alur ulang Misi1 diuji |
| Hapus progres | Pengaturan yang mengizinkan | ConfirmDialog warning | Landing,1 | Batal/terima; fokus kembali | Browser; settings tetap |
| Pause | Pause/Escape/blur | PausePanel,footer/icons |1–3 | Tab/resume; sentuh | Browser+visual ketiga misi |
| Reset konfirmasi | Reset dari pause | ConfirmDialog warning |1–3 | Escape/Batal; induk tetap pause | Browser |
| Dialog Ion/Raka | Awal/bacaan/refleksi | Portrait/header/modal |1–3 | Fokus; input arena berhenti | Browser |
| Observasi objek | E dekat terminal | Shared panel/stat |1–3 | E/range guard; tap | Browser |
| Terminal eksperimen | Terminal aktif | Modal,buttons,input/stat |1–3 | Keyboard+touch | Browser |
| Prediksi | Sesudah observasi | Modal,radio/checkbox/select |1–3 | Tab/validation; tap | Browser |
| Observasi/perbandingan | Simpan/bandingkan | Stat/table/select |2–3 | Angka/select/tombol | Browser |
| Skema distribusi muatan | Mikroskop | Shared modal; aset Misi3 sesuai |3 | Fokus/Escape | Browser; tanda model dipertahankan |
| Petunjuk bertingkat | Bantuan | Hint frame/icon/text |1–3 | Aktivasi keyboard/tombol | Browser |
| Feedback eksperimen | Hasil model | Hint/live/status panel |1–3 | Status semantik | Browser |
| Penjelasan/revisi | Keberhasilan mekanis+belajar | Modal/options/feedback |1–3 | Input semantik | Browser |
| Refleksi | Penjelasan sesuai | Modal/textarea |1–3 | Ketik, arena berhenti | Browser |
| Hasil selesai | Refleksi dikirim | MissionResult,art,badge,stats |1–3 | Summary/actions; scroll internal | Alur penuh browser+visual |
| Catatan/ringkasan | Tombol hasil/summary | Modal/table/stat/details |1–3 | Tab/Enter/details | Browser |
| Loading | Masuk misi | Shared frame,loader,back | Semua | Kembali/keyboard | Browser |
| Gagal memuat/error | Manifest/aset gagal | Warning panel/retry | Semua | Retry/Kembali | Browser |
| Fullscreen ditolak | API tidak tersedia/ditolak | Status/notification |1–3 | Tombol berlabel | Browser |
| Preview developer | URL preview | Sistem UI yang sama | Preview2/3 | Kontrol/fokus | Regresi terkait |
| Galeri konsol | console-gallery.html | Semua varian/frame/input/art | Developer | Tidak menyentuh progres | Browser |

Tidak membuat fitur baru untuk window yang tidak ada. Tidak ada tab/tooltip khusus yang sebelumnya tersedia untuk dimigrasikan. Dropdown native dan validasi HTML tetap semantik; bentuk visualnya dibawa ke sistem bersama. Konfirmasi induk+anak yang sengaja ditumpuk adalah satu-satunya overlay ganda yang diizinkan; inert browser mencegah klik/input ke induk.

## Preview dan uji manual

`npm.cmd run dev`, buka URL terminal. Galeri baru:/console-gallery.html. Galeri aset mentah:/gallery.html. Alur game nyata tetap dari landing dan unlock/progres sebelumnya; galeri tidak menulis progres atau menandai misi selesai.

1. Landing: coba seluruh menu, disabled misi terkunci, checkpoint Lanjutkan dan Mulai Baru(Batal/terima).
2. Pada setiap misi: buka pause, pengaturan, Cara bermain, baca tujuan, konfirmasi reset(Batal), lalu Lanjutkan. Blur dan konfirmasi tidak boleh menghapus pause lain.
3. Selesaikan alur belajar tiap misi; lihat art/statistik/ringkasan/observasi, ulang atau Beranda. Bandingkan statistik dengan data session.
4. Coba Tab/Escape/Enter, checkbox/radio/select/angka/slider, kontrol sentuh tahan/cancel, resize320/390/768/1024/1440 dan pengaturan Kurangi efek/Teks besar/Kontras.
5. Blok penyimpanan: footer tidak boleh mengaku tersimpan. Simulasikan aset/manifest gagal: label, data dan retry tetap dapat dipakai.

Pemeriksaan: npm.cmd run check; npm.cmd run assets:console:validate; npm.cmd run test:unit; npm.cmd run build; npm.cmd test. Catatan hasil aktual ada di PROGRESS.md. Browser utama Chromium/emulasi sentuh; perangkat fisik, Firefox dan Safari belum diverifikasi. Warning ukuran chunk Phaser masih ada. Tidak push/deploy.

## Inventaris aset

| Aset | Lokasi file | Komponen pengguna | Misi/halaman | Status pemeriksaan |
|---|---|---|---|---|
| eq-panel-main | public/assets/ui/shared/eq-panel-main.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-modal | public/assets/ui/shared/eq-panel-modal.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-result | public/assets/ui/shared/eq-panel-result.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-stat | public/assets/ui/shared/eq-panel-stat.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-title | public/assets/ui/shared/eq-panel-title.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-footer | public/assets/ui/shared/eq-panel-footer.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-hint | public/assets/ui/shared/eq-panel-hint.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-warning | public/assets/ui/shared/eq-panel-warning.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-input | public/assets/ui/shared/eq-panel-input.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-panel-portrait | public/assets/ui/shared/eq-panel-portrait.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-normal | public/assets/ui/shared/eq-button-primary-normal.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-hover | public/assets/ui/shared/eq-button-primary-hover.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-focus | public/assets/ui/shared/eq-button-primary-focus.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-pressed | public/assets/ui/shared/eq-button-primary-pressed.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-disabled | public/assets/ui/shared/eq-button-primary-disabled.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-primary-selected | public/assets/ui/shared/eq-button-primary-selected.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-normal | public/assets/ui/shared/eq-button-secondary-normal.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-hover | public/assets/ui/shared/eq-button-secondary-hover.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-focus | public/assets/ui/shared/eq-button-secondary-focus.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-pressed | public/assets/ui/shared/eq-button-secondary-pressed.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-disabled | public/assets/ui/shared/eq-button-secondary-disabled.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-secondary-selected | public/assets/ui/shared/eq-button-secondary-selected.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-normal | public/assets/ui/shared/eq-button-warning-normal.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-hover | public/assets/ui/shared/eq-button-warning-hover.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-focus | public/assets/ui/shared/eq-button-warning-focus.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-pressed | public/assets/ui/shared/eq-button-warning-pressed.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-disabled | public/assets/ui/shared/eq-button-warning-disabled.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-warning-selected | public/assets/ui/shared/eq-button-warning-selected.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-normal | public/assets/ui/shared/eq-button-icon-normal.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-hover | public/assets/ui/shared/eq-button-icon-hover.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-focus | public/assets/ui/shared/eq-button-icon-focus.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-pressed | public/assets/ui/shared/eq-button-icon-pressed.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-disabled | public/assets/ui/shared/eq-button-icon-disabled.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-button-icon-selected | public/assets/ui/shared/eq-button-icon-selected.png | GameButton via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-play | public/assets/ui/shared/eq-icon-play.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-continue | public/assets/ui/shared/eq-icon-continue.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-help | public/assets/ui/shared/eq-icon-help.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-info | public/assets/ui/shared/eq-icon-info.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-settings | public/assets/ui/shared/eq-icon-settings.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-missions | public/assets/ui/shared/eq-icon-missions.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-home | public/assets/ui/shared/eq-icon-home.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-reset | public/assets/ui/shared/eq-icon-reset.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-replay | public/assets/ui/shared/eq-icon-replay.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-notes | public/assets/ui/shared/eq-icon-notes.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-results | public/assets/ui/shared/eq-icon-results.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-reread | public/assets/ui/shared/eq-icon-reread.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-close | public/assets/ui/shared/eq-icon-close.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-sound-on | public/assets/ui/shared/eq-icon-sound-on.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-sound-off | public/assets/ui/shared/eq-icon-sound-off.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-pause | public/assets/ui/shared/eq-icon-pause.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-fullscreen | public/assets/ui/shared/eq-icon-fullscreen.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-icon-warning | public/assets/ui/shared/eq-icon-warning.png | GameIcon via ConsoleUI | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-emblem | public/assets/ui/landing/eq-emblem.png | LandingPage | Landing | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-badge | public/assets/ui/shared/eq-badge.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-pointer | public/assets/ui/shared/eq-pointer.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-indicator | public/assets/ui/shared/eq-indicator.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-divider | public/assets/ui/shared/eq-divider.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-success | public/assets/ui/shared/eq-success.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-loader | public/assets/ui/shared/eq-loader.png | ConsoleUI/GamePanel/StatPanel | Landing, Misi1–3 dan window dinamis | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-result-art-1 | public/assets/ui/results/eq-result-art-1.png | MissionResult | Misi 1 | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-result-art-2 | public/assets/ui/results/eq-result-art-2.png | MissionResult | Misi 2 | Final, terpasang; alpha/dimensi/frame/slice lulus |
| eq-result-art-3 | public/assets/ui/results/eq-result-art-3.png | MissionResult | Misi 3 | Final, terpasang; alpha/dimensi/frame/slice lulus |
