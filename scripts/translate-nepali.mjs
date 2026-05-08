import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "../src/data/kanji.json");

async function translate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map((chunk) => chunk[0]).join("");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const kanji = JSON.parse(readFileSync(dataPath, "utf-8"));

  // Collect all unique English meanings
  const uniqueMeanings = new Set();
  for (const entry of kanji) {
    uniqueMeanings.add(entry.meaning);
    for (const v of entry.vocab) {
      uniqueMeanings.add(v.meaning);
    }
  }

  const total = uniqueMeanings.size;
  console.log(`Translating ${total} unique meanings to Nepali...`);

  // Translate each unique meaning once
  const translations = {};
  let done = 0;
  for (const meaning of uniqueMeanings) {
    try {
      translations[meaning] = await translate(meaning);
    } catch (err) {
      console.warn(`  Failed: "${meaning}" — keeping English`);
      translations[meaning] = meaning;
    }
    done++;
    if (done % 50 === 0) console.log(`  ${done} / ${total}`);
    await sleep(80);
  }

  // Apply translations back to every entry
  for (const entry of kanji) {
    entry.meaning_ne = translations[entry.meaning] ?? entry.meaning;
    for (const v of entry.vocab) {
      v.meaning_ne = translations[v.meaning] ?? v.meaning;
    }
  }

  writeFileSync(dataPath, JSON.stringify(kanji, null, 2), "utf-8");
  console.log("Done! kanji.json updated with Nepali meanings.");
}

main().catch(console.error);
