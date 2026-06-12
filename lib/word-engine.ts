import { LEVELS } from "../data/levels";

// ─── Türkçe Kelime Havuzu (Bonus Kelimeler İçin) ───────────────────────────────

export interface WordEntry {
  word: string;
  meaning: string;
  category: string;
}

export const WORD_DATABASE: WordEntry[] = [
  { word: "ADA", meaning: "Dört tarafı sularla çevrili kara parçası.", category: "Coğrafya" },
  { word: "DAM", meaning: "Bir yapının üstünü örten bölüm.", category: "Mimari" },
  { word: "AMA", meaning: "Lakin, fakat.", category: "Bağlaç" },
  { word: "KALE", meaning: "Savunma amaçlı yapı.", category: "Tarih" },
  { word: "LAKE", meaning: "Parlak cila.", category: "Eşya" },
  { word: "ELA", meaning: "Sarıya çalan kestane rengi.", category: "Renk" },
  { word: "SARAY", meaning: "Hükümdar ikametgahı.", category: "Tarih" },
  { word: "ASA", meaning: "Elde taşınan kalın değnek.", category: "Eşya" },
  { word: "YARA", meaning: "Vücuttaki doku bozulması.", category: "Sağlık" },
  { word: "AYAR", meaning: "Ölçü, düzen.", category: "Genel" },
  { word: "BOĞAZ", meaning: "İki denizi bağlayan su yolu.", category: "Coğrafya" },
  { word: "BAĞ", row: 0, col: 0, meaning: "İlişki veya üzüm bahçesi.", category: "Genel" },
  { word: "BOZ", meaning: "Griye yakın renk.", category: "Renk" },
  { word: "KULE", meaning: "Yüksek dar yapı.", category: "Mimari" },
  { word: "KEL", meaning: "Saçı olmayan.", category: "Genel" },
];

// ─── Puzzle Generator ─────────────────────────────────────────────────────────

export interface GridPosition {
  row: number;
  col: number;
  direction: "horizontal" | "vertical";
}

export interface PuzzleWord {
  word: string;
  meaning: string;
  category: string;
  clue: string;
  found: boolean;
  isBonus: boolean;
  gridPos?: GridPosition;
}

export interface Puzzle {
  id: string;
  cityId: string;
  level: number;
  letters: string[];
  targetWords: PuzzleWord[];
  bonusWords: PuzzleWord[];
  allValidWords: Set<string>;
  gridWidth: number;
  gridHeight: number;
}

/**
 * WOW Tarzı: Statik Seviyeden Veri Çeker
 */
export function generatePuzzle(cityId: string, level: number): Puzzle {
  // Seviyeyi bul (eğer yoksa başa dön veya sonuncuyu ver)
  const staticLevel = LEVELS.find((l) => l.id === level) || LEVELS[0];

  const targetWords: PuzzleWord[] = staticLevel.targetWords.map((tw) => {
    const info = WORD_DATABASE.find((w) => w.word === tw.word);
    return {
      word: tw.word,
      meaning: info?.meaning || "",
      category: info?.category || "",
      clue: info?.meaning || "",
      found: false,
      isBonus: false,
      gridPos: {
        row: tw.row,
        col: tw.col,
        direction: tw.direction,
      },
    };
  });

  // Harf havuzundan bonus kelimeleri bul
  const letterCount: Record<string, number> = {};
  staticLevel.letters.forEach((l) => {
    letterCount[l] = (letterCount[l] ?? 0) + 1;
  });

  const bonusWords: PuzzleWord[] = WORD_DATABASE.filter((entry) => {
    // Hedef kelimelerde varsa atla
    if (targetWords.find((tw) => tw.word === entry.word)) return false;

    const needed: Record<string, number> = {};
    entry.word.split("").forEach((c) => {
      needed[c] = (needed[c] ?? 0) + 1;
    });

    return Object.entries(needed).every(([c, n]) => (letterCount[c] ?? 0) >= n);
  }).map((w) => ({
    word: w.word,
    meaning: w.meaning,
    category: w.category,
    clue: w.meaning,
    found: false,
    isBonus: true,
  }));

  const allValidWords = new Set<string>([
    ...targetWords.map((w) => w.word),
    ...bonusWords.map((w) => w.word),
  ]);

  return {
    id: `${cityId}-${level}`,
    cityId,
    level,
    letters: staticLevel.letters,
    targetWords,
    bonusWords,
    allValidWords,
    gridWidth: 10,
    gridHeight: 10,
  };
}

export function checkWord(puzzle: Puzzle, attempt: string): "target" | "bonus" | "invalid" {
  const upper = attempt.toUpperCase().replace(/i/g, "İ");
  if (puzzle.targetWords.find((w) => w.word === upper)) return "target";
  if (puzzle.bonusWords.find((w) => w.word === upper)) return "bonus";
  return "invalid";
}

export function getLimaResponse(word: string): string {
  const entry = WORD_DATABASE.find((w) => w.word === word.toUpperCase());
  if (!entry) return `"${word}" kelimesini buldun! 🦂`;
  return `✨ **${entry.word}** — ${entry.meaning}`;
}
