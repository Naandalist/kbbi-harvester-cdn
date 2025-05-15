import { exec } from 'child_process';
import {
  mkdirSync,
  writeFileSync,
  appendFileSync,
  readFileSync
} from 'fs';
import { join } from 'path';
import { EventEmitter } from 'events';
import { loadWordlist } from './utils/wordlistLoader.js';

const BAR_LENGTH    = 10;
const FAILED_FILE   = 'src/constants/FAILED.txt';
const WORDLIST_FILE = 'src/constants/TEST.txt';
const isMinify      = true;

class ProgressEmitter extends EventEmitter {}
const progress = new ProgressEmitter();

progress.on('start', total => {
  console.log(`Starting ${total} lookups…`);
});
progress.on('progress', ({ word, index, total, flag = '✅' }) => {
  const done       = index + 1;
  const pct        = Math.round((done / total) * 100);
  const filledBars = Math.round((pct / 100) * BAR_LENGTH);
  const emptyBars  = BAR_LENGTH - filledBars;
  const bar        = '='.repeat(filledBars) + ' '.repeat(emptyBars);
  console.log(`${flag}[${done}/${total}] ${bar}[${pct}%] ${word}`);
});
progress.on('authFailure', word => {
  console.error(`Authentication failed at "${word}". Stopping process.❌`);
});
progress.on('done', () => {
  console.log('Pass complete.');
});

function runKbbiCli(word) {
  return new Promise(resolve => {
    exec(`npx @doedja/kbbi-js "${word}" --json --visible`, (err, stdout, stderr) => {
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

function randomDelay(min = 100, max = 2500) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(res => setTimeout(res, ms));
}

(async () => {
  // 1) Clear FAILED.txt once at the very start
  writeFileSync(FAILED_FILE, '', 'utf-8');

  let pass = 1;
  while (true) {
    // 2) Load whatever remains in TEST.txt
    const wordlist = await loadWordlist(WORDLIST_FILE);
    const total    = wordlist.length;

    if (total === 0) {
      console.log('No more words to process. Exiting.');
      break;
    }

    console.log(`\n=== Pass #${pass}, ${total} words remaining ===`);
    progress.emit('start', total);

    for (let i = 0; i < total; i++) {
      const word  = wordlist[i];
      const entry = await runKbbiCli(word);

      if (!entry || !entry.result) {
        progress.emit('progress', { word, index: i, total, flag: '❓' });
        await randomDelay();
        continue;
      }
      if (entry.result.authenticated === false) {
        progress.emit('authFailure', word);
        return;
      }

      // no entries → mark failed but keep the word for retry
      if (entry.result.entries.length === 0) {
        // appendFileSync(FAILED_FILE, `${word}\n`, 'utf-8');
        progress.emit('progress', { word, index: i, total, flag: '❌' });
        await randomDelay(1000, 5000);
        continue;
      }

      // success → write new JSON and remove from TXT file
      const letter = word.trim()[0].toUpperCase();
      const dir    = join('result', letter);
      mkdirSync(dir, { recursive: true });

      writeFileSync(
        join(dir, `${word}.json`),
        isMinify
          ? JSON.stringify(entry.result)
          : JSON.stringify(entry.result, null, 2),
        'utf-8'
      );

      // remove the processed word from TEST.txt
      const disk    = readFileSync(WORDLIST_FILE, 'utf-8');
      const filtered = disk
        .split(/\r?\n/)
        .filter(w => w.trim() && w !== word);
      writeFileSync(WORDLIST_FILE, filtered.join('\n'), 'utf-8');

      progress.emit('progress', { word, index: i, total, flag: '✅' });
      await randomDelay();
    }

    progress.emit('done');
    pass++;
  }
})();
