# Aset Misi 3 — Gudang Polarisasi

## Hasil

Enam aset baru dibuat dan langsung dipasang: satu ilustrasi image_gen transparan dan lima PNG geometri prosedural. Paket berisi48 PNG:42 dipakai dalam arena/panel/hasil dan6 versi lama dipertahankan untuk kompatibilitas/galeri. Aset arsip bukan placeholder. Tidak ada aset baru yang hanya tersimpan tanpa pengguna. Raka, Ion, lingkungan utama dan UI bersama tetap dipakai kembali.

Master baru: assets-source/mission-03/m3-storage-master.png. Prompt lengkap: assets-source/mission-03/PROMPTS.md. Produksi: scripts/assets/mission-03.mjs. Metadata dimensi/frame/FPS/anchor/alpha/nine-slice: assets-source/mission-03/production.json dan manifest dokumen/runtime.

## Pemasangan

- m3-storage-layer: rak sisi640×360, depth2/alpha0.85 di warehouseArena; latar lama diredupkan agar kertas/alat jelas.
- m3-insulator-stage dan m3-conductor-stage:96×64, rasio3:2 pada pembesaran skematis. Tanda/nilai muatan dirender HTML dinamis; enam pasang dipol dan delapan inti/elektron selalu seimbang. Tanda sumber membalik orientasi; inti konduktor tetap. Sumber0 tidak ditampilkan sebagai terpolarisasi. Tidak ada klaim citra mikroskop sesungguhnya.
- m3-icon-clearance:24×24 pada petunjuk tanpa kontak dalam panel skematis.
- m3-tray-ready:128×12, hanya tampak setelah kait baki tertutup; pile kertas lama juga diaktifkan ketika ada kertas terkumpul.
- m3-source-wand-long:20×82, origin(0.5,0), top168/bottom250 sesuai titik fisika. Label dipindah ke atas rel. Model fisika tidak diubah.
- Efek attract/success tiga frame sekali dan dibersihkan saat reset/shutdown. Kurangi efek meniadakan dua kilatan itu. Panah pendek dekat kertas menunjukkan arah gaya; tidak ada garis aliran elektron dari sumber ke benda netral.

## Menjalankan dan memeriksa

Jalankan npm.cmd run dev; pilih Misi3 setelah penyelesaian Misi2. TerminalE → isi prediksi di dialog khusus → simpan untuk membuka panel penyelidikan secara otomatis → Lihat Mikroskop Distribusi Muatan. Atur sumber+3/−3/0 dan periksa skema. Selesaikan pengumpulan dan kunci baki untuk melihat indikator baru. Progres dan unlock tidak diubah untuk sekadar preview.

Rebuild: npm.cmd run assets:mission03. Validasi: npm.cmd run assets:mission03:validate. Build: npm.cmd run build. Browser: npm.cmd test -- tests/mission03.spec.js tests/mission03-assets.spec.js. assets:build kini mempertahankan paket Misi3/Misi4 yang sudah tersedia.

Pemeriksaan aktual:48 metadata/PNG/alpha lulus; seluruh264 PNG0 missing;72 hash aset awal tetap;39 unit lulus. TypeScript/build lulus, warning chunk Phaser1.32MB tetap ada. Tes browser terkait memeriksa alur sampai hasil/Beranda, dimensi desktop/ponsel, keseimbangan tanda dan inti yang tetap ketika sumber dibalik. Bukti docs/mission-03-assets-evidence. Desktop arena dan skema serta panel ponsel dibuka untuk inspeksi visual. Belum perangkat fisik/Safari/Firefox; tidak mengklaim regresi semua misi dijalankan ulang. Tidak push/deploy.

## Inventaris

| Aset | Lokasi file | Ukuran / frame | Penggunaan | Status |
|---|---|---|---|---|
| m3-bg-wall | public/assets/mission-03/environment/m3-bg-wall.png | 640×360; 1f/0fps | Generated warehouse backdrop layer | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-shelves | public/assets/mission-03/environment/m3-shelves.png | 640×360; 1f/0fps | Warehouse industrial shelving layer | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-rear | public/assets/mission-03/environment/m3-rear.png | 640×360; 1f/0fps | Warehouse rear conduit and overhead lamps | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-floor-left | public/assets/mission-03/environment/m3-floor-left.png | 32×32; 1f/0fps | Modular warehouse floor tile left | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-floor-middle | public/assets/mission-03/environment/m3-floor-middle.png | 32×32; 1f/0fps | Modular warehouse floor tile middle | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-floor-right | public/assets/mission-03/environment/m3-floor-right.png | 32×32; 1f/0fps | Modular warehouse floor tile right | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-crate-stack | public/assets/mission-03/environment/m3-crate-stack.png | 48×48; 1f/0fps | Decorative stacked warehouse storage crates | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-lamp | public/assets/mission-03/environment/m3-lamp.png | 32×64; 1f/0fps | Overhead warehouse industrial work light | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-tray | public/assets/mission-03/puzzle/m3-tray.png | 128×24; 1f/0fps | Paper collection tray with mechanical retaining lips | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-tray-latch-open | public/assets/mission-03/puzzle/m3-tray-latch-open.png | 24×24; 1f/0fps | Mechanical tray latch (open) | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-tray-latch-closed | public/assets/mission-03/puzzle/m3-tray-latch-closed.png | 24×24; 1f/0fps | Mechanical tray latch (closed) | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-paper-1 | public/assets/mission-03/puzzle/m3-paper-1.png | 16×16; 1f/0fps | Paper shred variation 1 | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-paper-2 | public/assets/mission-03/puzzle/m3-paper-2.png | 16×16; 1f/0fps | Paper shred variation 2 | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-paper-3 | public/assets/mission-03/puzzle/m3-paper-3.png | 16×16; 1f/0fps | Paper shred variation 3 | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-paper-4 | public/assets/mission-03/puzzle/m3-paper-4.png | 16×16; 1f/0fps | Paper shred variation 4 | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-paper-pile | public/assets/mission-03/puzzle/m3-paper-pile.png | 32×16; 1f/0fps | Small collected pile of paper shreds | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-demo-stand | public/assets/mission-03/puzzle/m3-demo-stand.png | 16×40; 1f/0fps | Insulating stand for demo metal sphere | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-demo-sphere | public/assets/mission-03/puzzle/m3-demo-sphere.png | 32×32; 1f/0fps | Demonstration conducting metal sphere | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-source-carriage | public/assets/mission-03/puzzle/m3-source-carriage.png | 48×20; 1f/0fps | Carriage supporting the charged polarization source | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-source-wand | public/assets/mission-03/puzzle/m3-source-wand.png | 20×52; 1f/0fps | Charged wand head with insulating handle | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-rail-left | public/assets/mission-03/puzzle/m3-rail-left.png | 32×12; 1f/0fps | Overhead track rail left | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-rail-middle | public/assets/mission-03/puzzle/m3-rail-middle.png | 32×12; 1f/0fps | Overhead track rail middle | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-rail-right | public/assets/mission-03/puzzle/m3-rail-right.png | 32×12; 1f/0fps | Overhead track rail right | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-slider-grip | public/assets/mission-03/puzzle/m3-slider-grip.png | 24×24; 1f/0fps | Wand slider handle grip | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-terminal | public/assets/mission-03/puzzle/m3-terminal.png | 40×64; 1f/0fps | Warehouse terminal for polarization experiment | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-exit-closed | public/assets/mission-03/puzzle/m3-exit-closed.png | 48×96; 1f/0fps | Warehouse exit shutter door (closed) | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-exit-open | public/assets/mission-03/puzzle/m3-exit-open.png | 48×96; 1f/0fps | Warehouse exit shutter door (open) | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-zoom-frame | public/assets/mission-03/ui/m3-zoom-frame.png | 32×32; 1f/0fps | Microscopic charge inspection panel frame | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-dipole-neutral | public/assets/mission-03/ui/m3-dipole-neutral.png | 48×32; 1f/0fps | Insulator (paper) unpolarized bound dipoles | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-dipole-polarized | public/assets/mission-03/ui/m3-dipole-polarized.png | 48×32; 1f/0fps | Insulator (paper) polarized aligned dipoles | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-metal-neutral | public/assets/mission-03/ui/m3-metal-neutral.png | 48×32; 1f/0fps | Metal conductor uniform electron sea | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-metal-polarized | public/assets/mission-03/ui/m3-metal-polarized.png | 48×32; 1f/0fps | Metal conductor redistributed free electrons | Arsip/galeri; tidak dipakai oleh diagram/alat terbaru |
| m3-icon-observe | public/assets/mission-03/ui/m3-icon-observe.png | 24×24; 1f/0fps | Mission 3 icon observe | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-icon-polarize | public/assets/mission-03/ui/m3-icon-polarize.png | 24×24; 1f/0fps | Mission 3 icon polarize | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-icon-collect | public/assets/mission-03/ui/m3-icon-collect.png | 24×24; 1f/0fps | Mission 3 icon collect | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-icon-reset | public/assets/mission-03/ui/m3-icon-reset.png | 24×24; 1f/0fps | Mission 3 icon reset | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-icon-help | public/assets/mission-03/ui/m3-icon-help.png | 24×24; 1f/0fps | Mission 3 icon help | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-icon-wand | public/assets/mission-03/ui/m3-icon-wand.png | 24×24; 1f/0fps | Mission 3 icon wand | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-scan | public/assets/mission-03/vfx/m3-scan.png | 64×64; 1f/0fps | Polarization scan field pulse | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-attract-pulse | public/assets/mission-03/vfx/m3-attract-pulse.png | 24×24; 3f/10fps | Attraction field pulse animation | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-success-flash | public/assets/mission-03/vfx/m3-success-flash.png | 24×24; 3f/10fps | Paper collection completion flash effect | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-completion-art | public/assets/mission-03/ui/m3-completion-art.png | 640×240; 1f/0fps | Pixel-art celebration scene for Mission 3 completion page | Dipakai kembali; dimensi/pemuatan diperiksa |
| m3-storage-layer | public/assets/mission-03/environment/m3-storage-layer.png | 640×360; 1f/0fps | Transparent side racks behind arena, center remains quiet | Baru; final, terpasang, alpha/dimensi lulus |
| m3-insulator-stage | public/assets/mission-03/ui/m3-insulator-stage.png | 96×64; 1f/0fps | Microscope neutral/polarized diagram base; all charge signs/positions generated by application | Baru; final, terpasang, alpha/dimensi lulus |
| m3-conductor-stage | public/assets/mission-03/ui/m3-conductor-stage.png | 96×64; 1f/0fps | Microscope neutral/polarized diagram base; all charge signs/positions generated by application | Baru; final, terpasang, alpha/dimensi lulus |
| m3-icon-clearance | public/assets/mission-03/ui/m3-icon-clearance.png | 24×24; 1f/0fps | Non-contact clearance reminder icon | Baru; final, terpasang, alpha/dimensi lulus |
| m3-tray-ready | public/assets/mission-03/vfx/m3-tray-ready.png | 128×12; 1f/0fps | Collection tray locked status overlay; only visible when tray latch closed | Baru; final, terpasang, alpha/dimensi lulus |
| m3-source-wand-long | public/assets/mission-03/puzzle/m3-source-wand-long.png | 20×82; 1f/0fps | Wand aligned with physics tip: top168, bottom250, insulated handle and separate active head | Baru; final, terpasang, alpha/dimensi lulus |
