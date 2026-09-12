# KBBI CDN Dataset

Unofficial JSON dataset of *Kamus Besar Bahasa Indonesia* (KBBI) served via jsDelivr CDN.

> **Disclaimer:** This project is not affiliated with, endorsed by, or connected to Badan Pengembangan dan Pembinaan Bahasa (Badan Bahasa) or Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen). The dictionary content belongs to its respective owners. This repository only packages publicly accessible data for developer convenience.

## Quick Start

Fetch any word as JSON directly from the CDN:

```
https://cdn.jsdelivr.net/gh/Naandalist/kbbi-harvester-cdn@v1.0.0/word-details/P/pintar.json
```

### JavaScript

```javascript
const res = await fetch('https://cdn.jsdelivr.net/gh/Naandalist/kbbi-harvester-cdn@v1.0.0/word-details/P/pintar.json');
const data = await res.json();
console.log(data);
```

### cURL

```bash
curl https://cdn.jsdelivr.net/gh/Naandalist/kbbi-harvester-cdn@v1.0.0/word-details/P/pintar.json
```

> **Version pinning:** URLs above use `@v1.0.0` for stability. Replace with `@main` for latest, or pin to a specific tag. See [CHANGELOG.md](CHANGELOG.md) for available versions.

## Folder Structure

```
word-details/          Word definition JSON files, organized by first letter
  A/                   Words starting with A
  B/                   Words starting with B
  ...
  Z/                   Words starting with Z
wordlist/              Plain-text word lists (one word per line) by first letter
word-category/         Grammatical category, language, and subject domain data
```

## Path Rules

- Folder names use the **uppercase first letter** of the word (e.g. `P/pintar.json`)
- Filenames match the `word` field verbatim with `.json` appended
- Spaces in multi-word entries are encoded as `%20` in URLs
- Unicode characters are left as-is; jsDelivr and browsers handle encoding
- All paths are case-sensitive

### Word-to-Path Conversion

| Word | Path |
|------|------|
| `pintar` | `word-details/P/pintar.json` |
| `a tempo` | `word-details/A/a%20tempo.json` |
| `a.k.b.` | `word-details/A/a.k.b..json` |
| `Amerika Serikat` | `word-details/A/Amerika%20Serikat.json` |

## JSON Schema

Each word file follows this structure:

```json
{
  "word": "pintar",
  "entries": [
    {
      "id": "63778",
      "nama": "pin.tar",
      "nomor": "",
      "makna": [
        {
          "nomor": "1",
          "kelasKata": [
            {
              "kode": "a",
              "nama": "Adjektiva",
              "tipe": "kelas_kata"
            }
          ],
          "definisi": "pandai; cakap",
          "contoh": [
            {
              "nomor": 2,
              "teks": "ia termasuk anak yang -- di kelasnya"
            }
          ],
          "terkait": {
            "kataTurunan": [],
            "gabunganKata": [],
            "peribahasa": [],
            "idiom": [],
            "peribahasa_dan_makna": []
          }
        }
      ]
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `word` | The headword |
| `entries` | Array of entry objects (one per numbered sense group) |
| `entries[].makna` | Array of meanings with definitions, examples, and grammatical labels |
| `kelasKata` | Grammatical categories (`kode` = code, `nama` = name, `tipe` = classification) |
| `contoh` | Usage examples; `--` marks where the headword appears |
| `terkait` | Related items: `kataTurunan`, `gabunganKata`, `peribahasa`, `idiom`, `peribahasa_dan_makna` |

> **Note:** The structure above is the *maximum* shape. Actual data varies per word, so always code defensively against missing fields.

## Data Variability

Every word file follows the schema above, but fields are **not guaranteed to be populated**. The dataset reflects what KBBI actually contains: some words are simple cross-references, others have dozens of meanings and examples.

### What varies

| Aspect | Range | Notes |
|--------|-------|-------|
| Entries per file | 1–11 | Most files have 1 entry; some words have multiple numbered senses |
| Meanings per entry | 1–21 | Most have 1 meaning; common words like "rambang" can have 10+ |
| `contoh` (examples) | 0–8 per meaning | ~80% of meanings have no examples |
| `kelasKata` (word class) | 0–multiple | Some cross-references have an empty array |
| `terkait` (related) | Always present | Keys are always present but usually empty |

### Concrete examples

**Simple word** (`rangsum`) - 1 entry, 1 meaning, no examples, cross-reference definition:
```json
{
  "word": "rangsum",
  "entries": [{
    "id": "67423",
    "nama": "rang.sum",
    "makna": [{
      "nomor": "1",
      "kelasKata": [],
      "definisi": "→ ransum",
      "contoh": []
    }]
  }]
}
```

**Word with examples** (`rames`) - has `contoh` with `--` marking where the headword appears:
```json
{
  "contoh": [{ "nomor": 2, "teks": "nasi --" }]
}
```

**Multi-entry word** (`rembes`) - multiple numbered entries for distinct senses.

### Handling in code

Always check for field existence before accessing:

```javascript
const meanings = data.entries?.[0]?.makna ?? [];
const examples = meanings.flatMap(m => m.contoh ?? []);
const wordClass = meanings[0]?.kelasKata?.[0]?.nama ?? "unknown";
```

## Offline Use

For apps that need the full dataset without CDN requests:

- **`index.json`** - flat JSON array of all 112,596 word keys (fast lookup/filter)

## Related Projects

- [kbbi-app](https://github.com/Naandalist/kbbi-app) - Web application for browsing KBBI entries
- [webland-kbbi](https://github.com/Naandalist/webland-kbbi) - KBBI web interface

## License

MIT License - covers repository packaging and tooling only. Dictionary content rights remain with the original source (Badan Bahasa).
