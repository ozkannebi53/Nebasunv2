export interface StaticLevel {
  id: number;
  cityId: string;
  letters: string[];
  targetWords: {
    word: string;
    row: number;
    col: number;
    direction: "horizontal" | "vertical";
  }[];
}

export const LEVELS: StaticLevel[] = [
  {
    id: 1,
    cityId: "istanbul",
    letters: ["A", "K", "R", "E", "P"],
    targetWords: [
      { word: "AKREP", row: 0, col: 0, direction: "horizontal" },
      { word: "KARE", row: 0, col: 1, direction: "vertical" },
      { word: "PAK", row: 0, col: 4, direction: "vertical" },
    ],
  },
  {
    id: 2,
    cityId: "istanbul",
    letters: ["U", "Z", "A", "Y"],
    targetWords: [
      { word: "UZAY", row: 0, col: 0, direction: "horizontal" },
      { word: "YAZ", row: 0, col: 3, direction: "vertical" },
      { word: "AY", row: 1, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 3,
    cityId: "istanbul",
    letters: ["H", "A", "T", "A", "Y"],
    targetWords: [
      { word: "HATAY", row: 0, col: 0, direction: "horizontal" },
      { word: "HATA", row: 0, col: 0, direction: "vertical" },
      { word: "TAY", row: 2, col: 0, direction: "horizontal" },
    ],
  },
  {
    id: 4,
    cityId: "istanbul",
    letters: ["K", "O", "D", "L", "A"],
    targetWords: [
      { word: "KODLA", row: 0, col: 0, direction: "horizontal" },
      { word: "ODAK", row: 0, col: 1, direction: "vertical" },
      { word: "KOD", row: 3, col: 1, direction: "horizontal" },
    ],
  },
  {
    id: 5,
    cityId: "istanbul",
    letters: ["O", "Y", "U", "N", "K"],
    targetWords: [
      { word: "KOYUN", row: 0, col: 0, direction: "horizontal" },
      { word: "OYUN", row: 0, col: 1, direction: "vertical" },
      { word: "YOK", row: 1, col: 1, direction: "horizontal" },
    ],
  },
  {
    id: 6,
    cityId: "istanbul",
    letters: ["R", "O", "K", "E", "T"],
    targetWords: [
      { word: "ROKET", row: 0, col: 0, direction: "horizontal" },
      { word: "KOR", row: 0, col: 2, direction: "vertical" },
      { word: "TEK", row: 0, col: 4, direction: "vertical" },
    ],
  },
  {
    id: 7,
    cityId: "istanbul",
    letters: ["E", "K", "R", "A", "N"],
    targetWords: [
      { word: "EKRAN", row: 0, col: 0, direction: "horizontal" },
      { word: "KAR", row: 0, col: 1, direction: "vertical" },
      { word: "NAR", row: 0, col: 4, direction: "vertical" },
    ],
  },
  {
    id: 8,
    cityId: "istanbul",
    letters: ["B", "İ", "L", "G", "İ"],
    targetWords: [
      { word: "BİLGİ", row: 0, col: 0, direction: "horizontal" },
      { word: "LİG", row: 0, col: 2, direction: "vertical" },
      { word: "İL", row: 1, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 9,
    cityId: "istanbul",
    letters: ["M", "O", "T", "O", "R"],
    targetWords: [
      { word: "MOTOR", row: 0, col: 0, direction: "horizontal" },
      { word: "ROT", row: 0, col: 4, direction: "vertical" },
      { word: "MOR", row: 1, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 10,
    cityId: "istanbul",
    letters: ["G", "E", "C", "E"],
    targetWords: [
      { word: "GECE", row: 0, col: 0, direction: "horizontal" },
      { word: "GEÇ", row: 0, col: 0, direction: "vertical" },
      { word: "ECE", row: 1, col: 0, direction: "horizontal" },
    ],
  },
  {
    id: 11,
    cityId: "istanbul",
    letters: ["D", "Ü", "N", "Y", "A"],
    targetWords: [
      { word: "DÜNYA", row: 0, col: 0, direction: "horizontal" },
      { word: "YAD", row: 0, col: 3, direction: "vertical" },
      { word: "AY", row: 1, col: 3, direction: "horizontal" },
    ],
  },
  {
    id: 12,
    cityId: "istanbul",
    letters: ["E", "L", "M", "A"],
    targetWords: [
      { word: "ELMA", row: 0, col: 0, direction: "horizontal" },
      { word: "ALEM", row: 0, col: 3, direction: "vertical" },
      { word: "LAM", row: 1, col: 3, direction: "horizontal" },
    ],
  },
  {
    id: 13,
    cityId: "istanbul",
    letters: ["K", "İ", "T", "A", "P"],
    targetWords: [
      { word: "KİTAP", row: 0, col: 0, direction: "horizontal" },
      { word: "PATİK", row: 0, col: 4, direction: "vertical" },
      { word: "AİT", row: 2, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 14,
    cityId: "istanbul",
    letters: ["Ç", "İ", "Z", "G", "İ"],
    targetWords: [
      { word: "ÇİZGİ", row: 0, col: 0, direction: "horizontal" },
      { word: "GİZ", row: 0, col: 3, direction: "vertical" },
      { word: "İZ", row: 1, col: 3, direction: "horizontal" },
    ],
  },
  {
    id: 15,
    cityId: "istanbul",
    letters: ["Z", "E", "K", "A"],
    targetWords: [
      { word: "ZEKA", row: 0, col: 0, direction: "horizontal" },
      { word: "KAZ", row: 0, col: 2, direction: "vertical" },
      { word: "KEZ", row: 2, col: 0, direction: "horizontal" },
    ],
  },
  {
    id: 16,
    cityId: "istanbul",
    letters: ["D", "O", "Ğ", "A"],
    targetWords: [
      { word: "DOĞA", row: 0, col: 0, direction: "horizontal" },
      { word: "DAĞ", row: 0, col: 0, direction: "vertical" },
      { word: "AĞA", row: 1, col: 0, direction: "horizontal" },
    ],
  },
  {
    id: 17,
    cityId: "istanbul",
    letters: ["C", "İ", "H", "A", "Z"],
    targetWords: [
      { word: "CİHAZ", row: 0, col: 0, direction: "horizontal" },
      { word: "HAC", row: 0, col: 2, direction: "vertical" },
      { word: "CAZ", row: 2, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 18,
    cityId: "istanbul",
    letters: ["M", "Ü", "Z", "İ", "K"],
    targetWords: [
      { word: "MÜZİK", row: 0, col: 0, direction: "horizontal" },
      { word: "KİM", row: 0, col: 4, direction: "vertical" },
      { word: "İZ", row: 1, col: 4, direction: "horizontal" },
    ],
  },
  {
    id: 19,
    cityId: "istanbul",
    letters: ["S", "E", "S", "L", "İ"],
    targetWords: [
      { word: "SESLİ", row: 0, col: 0, direction: "horizontal" },
      { word: "SEL", row: 0, col: 2, direction: "vertical" },
      { word: "LİSE", row: 2, col: 2, direction: "horizontal" },
    ],
  },
  {
    id: 20,
    cityId: "istanbul",
    letters: ["S", "İ", "B", "E", "R"],
    targetWords: [
      { word: "SİBER", row: 0, col: 0, direction: "horizontal" },
      { word: "BİR", row: 0, col: 2, direction: "vertical" },
      { word: "RES", row: 2, col: 2, direction: "horizontal" },
    ],
  },
];
