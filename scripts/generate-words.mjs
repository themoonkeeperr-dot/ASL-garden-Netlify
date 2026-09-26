#!/usr/bin/env node

/**
 * Convert a Hugging Face ASL dictionary CSV into the small JSON shape used by
 * the client. The column aliases cover the common versions of the datasets
 * listed in the ASL Garden project brief.
 *
 * Usage:
 *   pnpm --filter @workspace/asl-garden generate:words -- ./path/to/words.csv
 *   pnpm --filter @workspace/asl-garden generate:words -- ./words.csv ./data/words.json
 */

import { readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2).filter((argument) => argument !== '--');
const inputPath = args[0];
const outputPath = args[1] ?? resolve(root, 'data/words.json');

if (!inputPath) {
  console.error('Usage: generate:words -- <dataset.csv> [output.json]');
  process.exit(1);
}

const aliases = {
  word: ['word', 'gloss', 'label', 'text', 'sign'],
  definition: ['definition', 'description', 'meaning'],
  tip: ['tip', 'instruction', 'instructions', 'notes'],
  mediaUrl: ['video_url', 'video', 'video_path', 'image_url', 'image', 'url'],
  category: ['category', 'topic', 'group'],
  difficulty: ['difficulty', 'level'],
};

function parseCsv(source) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function findValue(record, names) {
  for (const name of names) {
    const value = record[name];
    if (value) return value;
  }
  return '';
}

const csv = await readFile(resolve(process.cwd(), inputPath), 'utf8');
const [header, ...rows] = parseCsv(csv);
if (!header?.length) {
  throw new Error(`No CSV header found in ${basename(inputPath)}`);
}

const records = rows
  .map((values) => Object.fromEntries(header.map((key, index) => [key.toLowerCase().trim(), values[index] ?? ''])))
  .map((record) => {
    const word = findValue(record, aliases.word);
    if (!word) return null;
    const mediaUrl = findValue(record, aliases.mediaUrl);
    return {
      id: slugify(word),
      word,
      category: findValue(record, aliases.category) || 'Everyday',
      difficulty: findValue(record, aliases.difficulty) || 'Sprout',
      definition: findValue(record, aliases.definition) || `A useful sign to add to your growing vocabulary.`,
      tip: findValue(record, aliases.tip) || 'Practice the movement slowly, then try it in a sentence.',
      ...(mediaUrl ? { mediaUrl, mediaType: mediaUrl.match(/\.(mp4|webm|mov)(\?|$)/i) ? 'video' : 'image' } : {}),
      color: ['blue', 'pink', 'yellow'][Math.abs(slugify(word).length) % 3],
    };
  })
  .filter(Boolean);

const unique = [...new Map(records.map((record) => [record.id, record])).values()];
await writeFile(resolve(process.cwd(), outputPath), `${JSON.stringify(unique, null, 2)}\n`);
console.log(`Wrote ${unique.length} words to ${outputPath}`);