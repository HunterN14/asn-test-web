# ASN Prep — Admin Panel

Aplikasi latihan tes ASN dengan tampilan gaya admin dashboard, dibangun dengan
Vite + React + Tailwind CSS.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Untuk build produksi:

```bash
npm run build
npm run preview
```

## Fitur

- **Dashboard** — ringkasan skor terbaik, jumlah sesi, dan soal per kategori
- **Bank Soal** — tabel soal dengan pencarian, filter kategori, dan panel tambah/ubah soal
- **Passing Grade** — ambang kelulusan yang bisa diatur per kategori
- **Impor / Ekspor** — cadangkan atau pindahkan bank soal sebagai file JSON
- **Latihan** — sesi per soal dengan timer dan pembahasan jawaban berbasis AI, termasuk mode "latih soal yang pernah salah"
- **Ujian Penuh** — simulasi ujian dengan timer total, peta nomor soal, dan penilaian lulus/tidak per kategori (5 poin/jawaban benar, mengikuti sistem SKD)
- **Riwayat** — daftar seluruh sesi yang pernah dikerjakan

Semua data (soal, skor, riwayat) disimpan di `localStorage` browser — tidak ada
backend. Gunakan halaman **Impor/Ekspor** untuk memindahkan data ke perangkat lain.

## Pembahasan Jawaban AI

Buka halaman **Pengaturan** dan pilih penyedia AI:

**Ollama (lokal, default)** — dipanggil langsung dari browser ke Ollama di
komputermu (`http://localhost:11434`), tanpa API key dan tanpa data keluar.

1. Pastikan model sudah ada: `ollama pull llama3.1:8b` (cek dengan `ollama list`).
2. Izinkan CORS supaya browser boleh mengakses Ollama dari alamat Vite:
   `OLLAMA_ORIGINS=http://localhost:5173 ollama serve`
   (Windows: set environment variable `OLLAMA_ORIGINS`, lalu restart Ollama.)
3. Di Pengaturan isi nama model persis seperti di `ollama list`, klik **Tes koneksi**, lalu **Simpan**.

**Anthropic API** — alternatif memakai API key milikmu sendiri (disimpan lokal).

Tanpa AI yang terkonfigurasi, hanya tombol pembahasan yang menampilkan pesan;
sisa aplikasi tetap berfungsi normal.

## Struktur folder

```
src/
  components/    # komponen UI & form yang dipakai ulang
  context/       # state global (soal, skor, riwayat) + persistensi localStorage
  hooks/         # hook timer countdown
  lib/           # helper localStorage, klien Ollama & Anthropic
  pages/         # satu file per halaman/rute
```
