import { exec } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { EventEmitter } from "events";
import { loadWordlist } from "./utils/wordlistLoader.js";

const BAR_LENGTH = 40;

class ProgressEmitter extends EventEmitter {}
const progress = new ProgressEmitter();

progress.on("start", (total) => {
  console.log(`Starting ${total} lookups…`);
});

progress.on("progress", ({ word, index, total }) => {
  const done = index + 1;
  const pct = Math.round((done / total) * 100);
  const filledBars = Math.round((pct / 100) * BAR_LENGTH);
  const emptyBars = BAR_LENGTH - filledBars;
  const bar = "=".repeat(filledBars) + "-".repeat(emptyBars);
  console.log(`[${done}/${total}] ${bar}[${pct}%] ${word}✅`);
});

progress.on("authFailure", (word) => {
  console.error(`Authentication failed at "${word}". Stopping process.❌`);
});

progress.on("done", () => {
  console.log("All lookups complete.");
});

function runKbbiCli(word) {
  return new Promise((resolve) => {
    exec(`npx @doedja/kbbi-js "${word}" --json`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error looking up "${word}":`, stderr.trim());
        return resolve(null);
      }
      try {
        resolve({ word, result: JSON.parse(stdout) });
      } catch {
        console.error(`Invalid JSON for "${word}"`);
        resolve(null);
      }
    });
  });
}

function randomDelay(min = 100, max = 900) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const wordlist = await loadWordlist("src/constants/TEST.txt");
  const isMinify = true;
  const total = wordlist.length;

  progress.emit("start", total);

  for (let i = 0; i < total; i++) {
    const word = wordlist[i];
    const entry = await runKbbiCli(word);

    if (!entry || !entry.result) {
      progress.emit("progress", { word, index: i, total });
      await randomDelay();
      continue;
    }

    if (entry.result.authenticated === false) {
      progress.emit("authFailure", word);
      break;
    }

    const letter = word.trim()[0].toUpperCase();
    const dir = join("result", letter);
    mkdirSync(dir, { recursive: true });

    writeFileSync(
      join(dir, `${word}.json`),
      isMinify
        ? JSON.stringify(entry.result)
        : JSON.stringify(entry.result, null, 2),
      "utf-8"
    );

    progress.emit("progress", { word, index: i, total });
    
    // random delay between 100ms and 900ms
    await randomDelay();
  }

  progress.emit("done");
})();
