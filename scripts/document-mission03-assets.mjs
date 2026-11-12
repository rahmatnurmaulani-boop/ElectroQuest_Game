import fs from 'node:fs';
const {assets}=JSON.parse(fs.readFileSync('assets-source/mission-03/production.json'));
const added=new Set(['m3-storage-layer','m3-insulator-stage','m3-conductor-stage','m3-icon-clearance','m3-tray-ready','m3-source-wand-long']);
const archived=new Set(['m3-source-wand','m3-dipole-neutral','m3-dipole-polarized','m3-metal-neutral','m3-metal-polarized','m3-zoom-frame']);
fs.writeFileSync('docs/MISSION_03_ASSETS.md',`# Aset Misi 3 — Gudang Polarisasi

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

Jalankan npm.cmd run dev; pilih Misi3 setelah penyelesaian Misi2. TerminalE → prediksi → Lihat Mikroskop Distribusi Muatan. Atur sumber+3/−3/0 dan periksa skema. Selesaikan pengumpulan dan kunci baki untuk melihat indikator baru. Progres dan unlock tidak diubah untuk sekadar preview.

Rebuild: npm.cmd run assets:mission03. Validasi: npm.cmd run assets:mission03:validate. Build: npm.cmd run build. Browser: npm.cmd test -- tests/mission03.spec.js tests/mission03-assets.spec.js. assets:build kini mempertahankan paket Misi3/Misi4 yang sudah tersedia.

Pemeriksaan aktual:48 metadata/PNG/alpha lulus; seluruh264 PNG0 missing;72 hash aset awal tetap;39 unit lulus. TypeScript/build lulus, warning chunk Phaser1.32MB tetap ada. Tes browser terkait memeriksa alur sampai hasil/Beranda, dimensi desktop/ponsel, keseimbangan tanda dan inti yang tetap ketika sumber dibalik. Bukti docs/mission-03-assets-evidence. Desktop arena dan skema serta panel ponsel dibuka untuk inspeksi visual. Belum perangkat fisik/Safari/Firefox; tidak mengklaim regresi semua misi dijalankan ulang. Tidak push/deploy.

## Inventaris

| Aset | Lokasi file | Ukuran / frame | Penggunaan | Status |
|---|---|---|---|---|
${assets.map(a=>`| ${a.key} | public/${a.path} | ${a.frameWidth}×${a.frameHeight}; ${a.frames}f/${a.fps}fps | ${a.usage} | ${added.has(a.key)?'Baru; final, terpasang, alpha/dimensi lulus':archived.has(a.key)?'Arsip/galeri; tidak dipakai oleh diagram/alat terbaru':'Dipakai kembali; dimensi/pemuatan diperiksa'} |`).join('\n')}
`);
