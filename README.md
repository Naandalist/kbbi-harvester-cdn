# 📚✨ KBBI Harvester CDN 

Welcome to the **KBBI Harvester CDN** – lightning-fast, open-source Content Delivery Network for Kamus Besar Bahasa Indonesia (KBBI) word data!  

Fetch Indonesian dictionary entries instantly for your apps, bots, or projects. No setup needed – just link and go! 🔗⚡

---

## 🚦 How to Use

Get KBBI word details as JSON files directly via CDN.  
Just plug the URL into your code:

```
https://cdn.jsdelivr.net/gh/mlengse/kbbi-harvester-cdn@main/word-details/P/pintar.json
```

Swap out `P/pintar.json` for any word you want to fetch!

---

## 🗂️ Folder Structure

- 📁 `word-details/`  
  All the juicy word details, alphabetized for your convenience!

- 📁 `wordlist/`  
  Quick lists of all available words – perfect for lookups and suggestions.

- 📁 `orthos/`  
  Referensi aturan dan teori pemenggalan kata (termasuk Liang Thesis dan Patgen2 Tutorial).

- 📄 `pemenggalan_kata.md`  
  Aturan pemenggalan kata bahasa Indonesia (Indonesian hyphenation rules).

---

## 🛠️ Quick Start Guide

1. 🔎 Look up the word you want in the `wordlist` folder.
2. 📂 Find the corresponding JSON file in `word-details/{First Letter}/{word}.json`  
   (Spaces in words? Use `%20`! For example, `a tempo` → `a%20tempo.json`)
3. 🌐 Use the magic CDN URL:  
   ```
   https://cdn.jsdelivr.net/gh/mlengse/kbbi-harvester-cdn@main/word-details/{First Letter}/{word}.json
   ```

---

## 🌟 Example

Want the definition for “pintar”?  
Just hit:

```
https://cdn.jsdelivr.net/gh/mlengse/kbbi-harvester-cdn@main/word-details/P/pintar.json
```

---
## 🖥️ Windows Compatibility

This repo contains **112K+ files**. If you're on Windows:

1. **Enable long paths** in Windows (required for paths > 260 chars):
   - Run in PowerShell (Admin): `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`
   - Or enable via Group Policy: *Computer Configuration > Administrative Templates > System > Filesystem > Enable Win32 long paths*
2. **Configure Git** to use long paths:
   ```
   git config --system core.longpaths true
   ```
3. **Exclude the clone folder from Windows Defender** real-time scanning to speed up checkout significantly.
4. Use a **shallow clone** to reduce download size:
   ```
   git clone --depth 1 https://github.com/mlengse/kbbi-harvester-cdn.git
   ```

---
## 🤝 Contributing & Feedback

Found a missing word or have a suggestion? PRs and issues are always welcome – let’s make KBBI even better together! 💬🙌

---

## 🏷️ License

Open-source and free to use. Let your ideas fly! ✈️

---

Made with ⏰ by [mlengse](https://github.com/mlengse)
