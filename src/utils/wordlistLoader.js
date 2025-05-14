import { readFile } from 'fs/promises';
import { join } from 'path';



export async function loadWordlist(filename) {
  const data = await readFile(join(process.cwd(), filename), 'utf-8');
  return data
    .split(/\r?\n/)           
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
