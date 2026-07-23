# 📚 KBBI MCP Server

**MCP (Model Context Protocol) server** untuk Kamus Besar Bahasa Indonesia — akses 112K+ entri kamus dari AI agents untuk **training stemmer & pemenggalan kata**.

> Data KBBI bisa diakses langsung oleh Claude Desktop, Cursor, Gemini CLI, dan AI agent lainnya via protocol MCP.

---

## 🚀 Quick Start

### 1. Install
```bash
git clone --depth 1 https://github.com/mlengse/kbbi-harvester-cdn.git kbbi-mcp-server
cd kbbi-mcp-server
npm install
npm run build
```

### 2. Konfigurasi AI Client

**Claude Desktop** — tambahkan ke `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "kbbi": {
      "command": "node",
      "args": ["/path/to/kbbi-mcp-server/build/index.js"]
    }
  }
}
```

**Cursor** — tambahkan ke `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "kbbi": {
      "command": "node",
      "args": ["/path/to/kbbi-mcp-server/build/index.js"]
    }
  }
}
```

**Gemini CLI** — tambahkan ke `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "kbbi": {
      "command": "node",
      "args": ["/path/to/kbbi-mcp-server/build/index.js"]
    }
  }
}
```

### 3. Test dengan MCP Inspector
```bash
npm run inspect
```

---

## 🔧 Tools yang Tersedia

### Stemmer Training (5 tools)

| Tool | Deskripsi | Contoh |
|------|-----------|--------|
| `cari_kata_dasar` | Cari kata dasar dari kata berimbuhan | `membantu` → `bantu` |
| `daftar_kata_turunan` | Daftar kata turunan dari kata dasar | `pintar` → `[kepintaran, memintarkan, ...]` |
| `ekspor_stem_mapping` | Bulk export kata + rootWord per huruf | Huruf `M` → semua mapping |
| `analisis_imbuhan` | Analisis prefiks & sufiks | `membantu` → `prefiks: mem, sufiks: -` |
| `daftar_kata_dasar_kbbi` | Kata tanpa rootWord (= kata dasar) per huruf | Huruf `P` → semua kata dasar |

### Pemenggalan Kata Training (4 tools)

| Tool | Deskripsi | Contoh |
|------|-----------|--------|
| `pemenggalan_kata` | Pemenggalan suku kata dari KBBI | `pintar` → `pin.tar` |
| `ekspor_training_dic` | Export format .dic untuk Orthos/patgen | Huruf `P` → `pin-tar\npan-dai\n...` |
| `validasi_pemenggalan` | Bandingkan engine vs KBBI | `pintar`, `pin-tar` → ✅ valid |
| `statistik_pola_suku` | Statistik pola suku kata (KV, KVK, dll) | Huruf `A` → distribusi pola |

### General Dictionary (6 tools)

| Tool | Deskripsi |
|------|-----------|
| `cari_kata` | Definisi lengkap dari KBBI |
| `cari_kata_awalan` | Autocomplete berdasarkan awalan |
| `kelas_kata` | Kelas kata (nomina, verba, dll) |
| `contoh_kalimat` | Contoh penggunaan dalam kalimat |
| `peribahasa` | Peribahasa yang mengandung kata |
| `daftar_kategori` | Kategori KBBI (kelas kata, bahasa, bidang) |

---

## 📄 Resources

| Resource | URI | Deskripsi |
|----------|-----|-----------|
| Aturan Pemenggalan | `kbbi://aturan/pemenggalan-kata` | Aturan EYD V lengkap |
| Aturan Imbuhan | `kbbi://aturan/imbuhan` | Referensi prefiks & sufiks |
| Statistik | `kbbi://statistik` | Distribusi kata per huruf |
| Kelas Kata | `kbbi://kategori/kelas-kata` | 25 kelas kata + deskripsi |
| Bahasa Asal | `kbbi://kategori/bahasa` | 17 bahasa asal kata |
| Bidang Subjek | `kbbi://kategori/bidang-subjek` | 30 bidang ilmu |
| Detail Kata | `kbbi://kata/{word}` | Detail per kata (template) |

---

## 💬 Prompts (Training Workflows)

| Prompt | Deskripsi |
|--------|-----------|
| `siapkan_data_training_pemenggalan` | Export .dic, statistik pola suku, validasi sampel |
| `siapkan_data_training_stemmer` | Export stem mapping, identifikasi kata dasar, distribusi imbuhan |
| `analisis_edge_cases` | Cari kata sulit: `berani` (ber- bukan prefiks), cluster konsonan |
| `validasi_engine` | Workflow validasi akurasi stemmer/pemenggalan |
| `bandingkan_kata` | Bandingkan morfologi & pemenggalan dua kata |

---

## 🗂️ Data

- 📁 `word-details/` — 112K+ file JSON dengan definisi, pemenggalan suku kata, `rootWord`, kata turunan
- 📁 `wordlist/` — Daftar kata per huruf (A–Z)
- 📁 `word-category/` — Kategori: kelas kata, bahasa asal, bidang subjek
- 📁 `word-with-peribahasa/` — Kata yang memiliki peribahasa
- 📁 `orthos/` — Referensi Liang Thesis & Patgen2 Tutorial
- 📄 `pemenggalan_kata.md` — Aturan pemenggalan kata EYD V

### Struktur Data Kunci

```json
// Kata berimbuhan (membantu.json)
{
  "word": "membantu",
  "entries": [{
    "nama": "mem.ban.tu",      // pemenggalan suku kata
    "rootWord": "bantu",       // ← kata dasar (KUNCI untuk stemmer)
    "makna": [{ "definisi": "memberi sokongan..." }]
  }]
}

// Kata dasar (pintar.json)
{
  "word": "pintar",
  "entries": [{
    "nama": "pin.tar",
    "terkait": { "kataTurunan": ["kepintaran", "memintarkan", "terpintar"] }
  }]
}
```

---

## 🌐 CDN Access (Alternatif)

Data juga bisa diakses langsung via CDN tanpa MCP:
```
https://cdn.jsdelivr.net/gh/mlengse/kbbi-harvester-cdn@main/word-details/P/pintar.json
```

---

## 🖥️ HTTP Transport

Untuk akses remote, jalankan dengan flag `--http`:
```bash
node build/index.js --http
# → KBBI MCP Server (HTTP) listening on port 3000
# → Endpoint: http://localhost:3000/mcp
```

Port bisa dikonfigurasi via environment variable `PORT`.

---

## 🖥️ Windows Compatibility

Repo ini berisi **112K+ files**. Jika di Windows:

1. **Enable long paths**:
   ```powershell
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```
2. **Configure Git**: `git config --system core.longpaths true`
3. **Exclude folder dari Windows Defender** real-time scanning
4. **Shallow clone**: `git clone --depth 1`

---

## 🏷️ License

- **Source Code**: GNU General Public License v3.0 (GPLv3) — Copyright (c) 2026 [mLengse](mailto:[medtosys@gmail.com]).
- **Original Dictionary Data**: ISC License — Copyright (c) 2025 Listiananda Apriliawan.

---

Dikembangkan untuk keperluan training NLP/Stemmer.  
Data KBBI original di-harvest dengan ⏰ oleh [mlengse](https://github.com/mlengse).
