/**
 * Turkish Word Utilities (Legacy support)
 * Re-mapped to use WORD_DATABASE from word-engine for consistency
 */
import { WORD_DATABASE } from "./word-engine";

export function getRandomWord(length?: number): string {
  const pool = length 
    ? WORD_DATABASE.filter(w => w.word.length === length)
    : WORD_DATABASE;
  
  if (pool.length === 0) {
    return length === 3 ? "ADA" : "AKREP";
  }
  const entry = pool[Math.floor(Math.random() * pool.length)];
  return entry.word.toUpperCase();
}

export function isValidWord(word: string): boolean {
  const upper = word.toUpperCase().replace(/i/g, "İ");
  return WORD_DATABASE.some(w => w.word.toUpperCase() === upper);
}

export function getWordMeaning(word: string): string {
  const upper = word.toUpperCase().replace(/i/g, "İ");
  const entry = WORD_DATABASE.find(w => w.word.toUpperCase() === upper);
  return entry ? entry.meaning : "Kelime anlamı bulunamadı.";
}

export function shuffleWord(word: string): string[] {
  const a = word.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateRandomWordSet(count: number = 10): string[] {
  const allWords = WORD_DATABASE.map(w => w.word);
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
