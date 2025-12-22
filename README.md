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

## 🤝 Contributing & Feedback

Found a missing word or have a suggestion? PRs and issues are always welcome – let’s make KBBI even better together! 💬🙌

---

## 🏷️ License

Open-source and free to use. Let your ideas fly! ✈️

---

Made with ⏰ by [mlengse](https://github.com/mlengse)
Forked by [mlengse](https://github.com/mlengse)
