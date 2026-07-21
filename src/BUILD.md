# Build Lab · Solo — source

Tool rekomendasi emblem/spell/item MLBB yang adaptif ke comp lawan.
Live: https://mlbb.mzonetour.com/build/ (GitHub Pages, repo `yanuarardaraja/mlbb-draft`, branch `main`, file `build/index.html`).

## PATCH BASELINE: 2.1.90 (Season 41 "Scarlet Embers", Juli 2026)
Perbarui baris ini tiap kali tool di-update ke patch baru — jadi acuan "cek ada yang lebih baru dari ini".

## Cara rebuild
File `build/index.html` = gabungan urut dari file-file di folder `src/` ini:

```
cat head.html data_ref.js data_heroes_a.js data_heroes_b.js engine.js icons.js ui.js tail.html > index.html
```

Lalu upload `index.html` ke `build/index.html` di repo (via GitHub web upload / commit).

## Cara test (wajib sebelum deploy)
```
node test.js
```
Harus print "✅ SEMUA TEST LULUS". Test ini cek: 133 hero lengkap datanya, semua item/emblem/spell/talent/blessing valid & punya icon, tiap kombinasi hero×lane×comp keluar 6 item unik, boots di slot 1, spell utama≠alt, plus skenario counter (anti-tank, anti-heal, anti-burst, anti-dive, CC→Purify, jungle blessing Behemoth/Ice/Flame).

## Peta file
- `head.html` — HTML + CSS + <head> (judul, meta, patch label ada di sini)
- `data_ref.js` — EMBLEMS, TALENTS, SPELLS, BLESSINGS (jungle), ROAM, ITEMS. **Mayoritas update patch ada di sini** (nama/efek item, blessing, spell)
- `data_heroes_a.js` / `data_heroes_b.js` — 133 hero (role, lane, tipe damage, tag ancaman, emblem/spell/core default). Hero baru ditambah di sini
- `engine.js` — logika threat profile + pemilihan emblem/talent/spell/boots/item situasional
- `icons.js` — mapping icon asli (MLBB Wiki, via Special:FilePath) + fallback SVG vektor
- `ui.js` — render UI + interaksi
- `tail.html` — penutup
- `test.js` — validasi (jalanin dari folder src/)

## Aturan main saat update patch
1. Ubah data di file yang relevan (biasanya `data_ref.js` buat item/blessing/spell; `data_heroes_*.js` buat hero baru/rework).
2. Update PATCH BASELINE di atas + patch label di `head.html` (cari "patch 2.1.90") + catatan di footer `head.html`.
3. `node test.js` sampai lulus.
4. Rebuild, upload `build/index.html`.
5. Verifikasi di live (buka /build/, cek hero contoh).
6. Kabari Yanuar ringkas: apa yang berubah. JANGAN deploy diam-diam kalau ada yang belum yakin — prinsipnya: data kosong > data ngasal.
