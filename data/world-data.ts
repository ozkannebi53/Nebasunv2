export interface GameLevel {
  id: number;
  word: string;
  letters: string[];
  targetWords: {
    word: string;
    row: number;
    col: number;
    direction: "horizontal" | "vertical";
  }[];
}

export interface Province {
  id: string;
  name: string;
  levels: GameLevel[];
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  provinces: Province[];
}

// ─── TÜRKİYE ───────────────────────────────────────────────────────────────────

const turkeyProvinces: Province[] = [
  {
    id: "istanbul",
    name: "İstanbul",
    levels: [
      {
        id: 1,
        word: "AKREP",
        letters: ["A", "K", "R", "E", "P"],
        targetWords: [
          { word: "AKREP", row: 0, col: 0, direction: "horizontal" },
          { word: "KARE", row: 0, col: 1, direction: "vertical" },
          { word: "PAK", row: 0, col: 4, direction: "vertical" },
        ],
      },
      {
        id: 2,
        word: "BOĞAZ",
        letters: ["B", "O", "Ğ", "A", "Z"],
        targetWords: [
          { word: "BOĞAZ", row: 0, col: 0, direction: "horizontal" },
          { word: "BAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "SAĞ", row: 0, col: 2, direction: "vertical" },
        ],
      },
      {
        id: 3,
        word: "GALATA",
        letters: ["G", "A", "L", "A", "T"],
        targetWords: [
          { word: "GALATA", row: 0, col: 0, direction: "horizontal" },
          { word: "TAG", row: 0, col: 4, direction: "vertical" },
          { word: "ALA", row: 1, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 4,
        word: "TAKSIM",
        letters: ["T", "A", "K", "S", "İ", "M"],
        targetWords: [
          { word: "TAKSIM", row: 0, col: 0, direction: "horizontal" },
          { word: "KİS", row: 0, col: 2, direction: "vertical" },
          { word: "MAS", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 5,
        word: "KULE",
        letters: ["K", "U", "L", "E"],
        targetWords: [
          { word: "KULE", row: 0, col: 0, direction: "horizontal" },
          { word: "ELUK", row: 2, col: 0, direction: "horizontal" },
          { word: "KEL", row: 0, col: 1, direction: "vertical" },
        ],
      },
      {
        id: 6,
        word: "SARAY",
        letters: ["S", "A", "R", "A", "Y"],
        targetWords: [
          { word: "SARAY", row: 0, col: 0, direction: "horizontal" },
          { word: "ASA", row: 1, col: 1, direction: "horizontal" },
          { word: "YARA", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "MARMARA",
        letters: ["M", "A", "R", "M", "A", "R", "A"],
        targetWords: [
          { word: "MARMARA", row: 0, col: 0, direction: "horizontal" },
          { word: "RAM", row: 0, col: 2, direction: "vertical" },
          { word: "ARA", row: 2, col: 4, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "UZAY",
        letters: ["U", "Z", "A", "Y"],
        targetWords: [
          { word: "UZAY", row: 0, col: 0, direction: "horizontal" },
          { word: "YAZ", row: 0, col: 3, direction: "vertical" },
          { word: "AY", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "ZEKA",
        letters: ["Z", "E", "K", "A"],
        targetWords: [
          { word: "ZEKA", row: 0, col: 0, direction: "horizontal" },
          { word: "KAZ", row: 0, col: 2, direction: "vertical" },
          { word: "KEZ", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 10,
        word: "DOĞA",
        letters: ["D", "O", "Ğ", "A"],
        targetWords: [
          { word: "DOĞA", row: 0, col: 0, direction: "horizontal" },
          { word: "DAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "AĞA", row: 1, col: 0, direction: "horizontal" },
        ],
      },
    ],
  },
  {
    id: "ankara",
    name: "Ankara",
    levels: [
      {
        id: 1,
        word: "BAŞKENT",
        letters: ["B", "A", "Ş", "K", "E", "N", "T"],
        targetWords: [
          { word: "BAŞKENT", row: 0, col: 0, direction: "horizontal" },
          { word: "KEN", row: 0, col: 3, direction: "vertical" },
          { word: "TAN", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 2,
        word: "ANITKABIR",
        letters: ["A", "N", "I", "T", "K", "A", "B", "I", "R"],
        targetWords: [
          { word: "ANIT", row: 0, col: 0, direction: "horizontal" },
          { word: "KAB", row: 0, col: 4, direction: "vertical" },
          { word: "BIR", row: 2, col: 6, direction: "horizontal" },
        ],
      },
      {
        id: 3,
        word: "ULUS",
        letters: ["U", "L", "U", "S"],
        targetWords: [
          { word: "ULUS", row: 0, col: 0, direction: "horizontal" },
          { word: "SUL", row: 0, col: 3, direction: "vertical" },
          { word: "LUS", row: 1, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 4,
        word: "ÇANKIRI",
        letters: ["Ç", "A", "N", "K", "I", "R", "I"],
        targetWords: [
          { word: "ÇANKIRI", row: 0, col: 0, direction: "horizontal" },
          { word: "KIR", row: 0, col: 3, direction: "vertical" },
          { word: "RAN", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 5,
        word: "KALE",
        letters: ["K", "A", "L", "E"],
        targetWords: [
          { word: "KALE", row: 0, col: 0, direction: "horizontal" },
          { word: "LAKE", row: 0, col: 1, direction: "vertical" },
          { word: "ELA", row: 2, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 6,
        word: "TÜMEN",
        letters: ["T", "Ü", "M", "E", "N"],
        targetWords: [
          { word: "TÜMEN", row: 0, col: 0, direction: "horizontal" },
          { word: "MEN", row: 0, col: 2, direction: "vertical" },
          { word: "ENT", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "HATAY",
        letters: ["H", "A", "T", "A", "Y"],
        targetWords: [
          { word: "HATAY", row: 0, col: 0, direction: "horizontal" },
          { word: "HATA", row: 0, col: 0, direction: "vertical" },
          { word: "TAY", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "KODLA",
        letters: ["K", "O", "D", "L", "A"],
        targetWords: [
          { word: "KODLA", row: 0, col: 0, direction: "horizontal" },
          { word: "ODAK", row: 0, col: 1, direction: "vertical" },
          { word: "KOD", row: 2, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "KOYUN",
        letters: ["K", "O", "Y", "U", "N"],
        targetWords: [
          { word: "KOYUN", row: 0, col: 0, direction: "horizontal" },
          { word: "OYUN", row: 0, col: 1, direction: "vertical" },
          { word: "YOK", row: 1, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 10,
        word: "ROKET",
        letters: ["R", "O", "K", "E", "T"],
        targetWords: [
          { word: "ROKET", row: 0, col: 0, direction: "horizontal" },
          { word: "KOR", row: 0, col: 2, direction: "vertical" },
          { word: "TEK", row: 0, col: 4, direction: "vertical" },
        ],
      },
    ],
  },
  {
    id: "izmir",
    name: "İzmir",
    levels: [
      {
        id: 1,
        word: "ALSANCAK",
        letters: ["A", "L", "S", "A", "N", "C", "A", "K"],
        targetWords: [
          { word: "ALSANCAK", row: 0, col: 0, direction: "horizontal" },
          { word: "SAC", row: 0, col: 2, direction: "vertical" },
          { word: "CAK", row: 2, col: 5, direction: "horizontal" },
        ],
      },
      {
        id: 2,
        word: "KONAK",
        letters: ["K", "O", "N", "A", "K"],
        targetWords: [
          { word: "KONAK", row: 0, col: 0, direction: "horizontal" },
          { word: "NAK", row: 0, col: 2, direction: "vertical" },
          { word: "AKO", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 3,
        word: "KÜLTÜR",
        letters: ["K", "Ü", "L", "T", "Ü", "R"],
        targetWords: [
          { word: "KÜLTÜR", row: 0, col: 0, direction: "horizontal" },
          { word: "TÜR", row: 0, col: 3, direction: "vertical" },
          { word: "RÜL", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 4,
        word: "EKRAN",
        letters: ["E", "K", "R", "A", "N"],
        targetWords: [
          { word: "EKRAN", row: 0, col: 0, direction: "horizontal" },
          { word: "KAR", row: 0, col: 1, direction: "vertical" },
          { word: "NAR", row: 0, col: 4, direction: "vertical" },
        ],
      },
      {
        id: 5,
        word: "BİLGİ",
        letters: ["B", "İ", "L", "G", "İ"],
        targetWords: [
          { word: "BİLGİ", row: 0, col: 0, direction: "horizontal" },
          { word: "LİG", row: 0, col: 2, direction: "vertical" },
          { word: "İL", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 6,
        word: "MOTOR",
        letters: ["M", "O", "T", "O", "R"],
        targetWords: [
          { word: "MOTOR", row: 0, col: 0, direction: "horizontal" },
          { word: "ROT", row: 0, col: 4, direction: "vertical" },
          { word: "MOR", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "GECE",
        letters: ["G", "E", "C", "E"],
        targetWords: [
          { word: "GECE", row: 0, col: 0, direction: "horizontal" },
          { word: "GEÇ", row: 0, col: 0, direction: "vertical" },
          { word: "ECE", row: 1, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "DÜNYA",
        letters: ["D", "Ü", "N", "Y", "A"],
        targetWords: [
          { word: "DÜNYA", row: 0, col: 0, direction: "horizontal" },
          { word: "YAD", row: 0, col: 3, direction: "vertical" },
          { word: "AY", row: 1, col: 3, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "ELMA",
        letters: ["E", "L", "M", "A"],
        targetWords: [
          { word: "ELMA", row: 0, col: 0, direction: "horizontal" },
          { word: "ALEM", row: 0, col: 3, direction: "vertical" },
          { word: "LAM", row: 1, col: 3, direction: "horizontal" },
        ],
      },
      {
        id: 10,
        word: "KİTAP",
        letters: ["K", "İ", "T", "A", "P"],
        targetWords: [
          { word: "KİTAP", row: 0, col: 0, direction: "horizontal" },
          { word: "PATİK", row: 0, col: 4, direction: "vertical" },
          { word: "AİT", row: 2, col: 2, direction: "horizontal" },
        ],
      },
    ],
  },
];

// ─── SURİYE ────────────────────────────────────────────────────────────────────

const syriaProvinces: Province[] = [
  {
    id: "damascus",
    name: "Şam",
    levels: [
      {
        id: 1,
        word: "ÇİZGİ",
        letters: ["Ç", "İ", "Z", "G", "İ"],
        targetWords: [
          { word: "ÇİZGİ", row: 0, col: 0, direction: "horizontal" },
          { word: "GİZ", row: 0, col: 3, direction: "vertical" },
          { word: "İZ", row: 1, col: 3, direction: "horizontal" },
        ],
      },
      {
        id: 2,
        word: "MÜZİK",
        letters: ["M", "Ü", "Z", "İ", "K"],
        targetWords: [
          { word: "MÜZİK", row: 0, col: 0, direction: "horizontal" },
          { word: "KİM", row: 0, col: 4, direction: "vertical" },
          { word: "İZ", row: 1, col: 4, direction: "horizontal" },
        ],
      },
      {
        id: 3,
        word: "SESLİ",
        letters: ["S", "E", "S", "L", "İ"],
        targetWords: [
          { word: "SESLİ", row: 0, col: 0, direction: "horizontal" },
          { word: "SEL", row: 0, col: 2, direction: "vertical" },
          { word: "LİSE", row: 2, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 4,
        word: "SİBER",
        letters: ["S", "İ", "B", "E", "R"],
        targetWords: [
          { word: "SİBER", row: 0, col: 0, direction: "horizontal" },
          { word: "BİR", row: 0, col: 2, direction: "vertical" },
          { word: "RES", row: 2, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 5,
        word: "KALE",
        letters: ["K", "A", "L", "E"],
        targetWords: [
          { word: "KALE", row: 0, col: 0, direction: "horizontal" },
          { word: "LAKE", row: 0, col: 1, direction: "vertical" },
          { word: "ELA", row: 2, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 6,
        word: "UZAY",
        letters: ["U", "Z", "A", "Y"],
        targetWords: [
          { word: "UZAY", row: 0, col: 0, direction: "horizontal" },
          { word: "YAZ", row: 0, col: 3, direction: "vertical" },
          { word: "AY", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "ZEKA",
        letters: ["Z", "E", "K", "A"],
        targetWords: [
          { word: "ZEKA", row: 0, col: 0, direction: "horizontal" },
          { word: "KAZ", row: 0, col: 2, direction: "vertical" },
          { word: "KEZ", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "DOĞA",
        letters: ["D", "O", "Ğ", "A"],
        targetWords: [
          { word: "DOĞA", row: 0, col: 0, direction: "horizontal" },
          { word: "DAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "AĞA", row: 1, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "AKREP",
        letters: ["A", "K", "R", "E", "P"],
        targetWords: [
          { word: "AKREP", row: 0, col: 0, direction: "horizontal" },
          { word: "KARE", row: 0, col: 1, direction: "vertical" },
          { word: "PAK", row: 0, col: 4, direction: "vertical" },
        ],
      },
      {
        id: 10,
        word: "BOĞAZ",
        letters: ["B", "O", "Ğ", "A", "Z"],
        targetWords: [
          { word: "BOĞAZ", row: 0, col: 0, direction: "horizontal" },
          { word: "BAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "SAĞ", row: 0, col: 2, direction: "vertical" },
        ],
      },
    ],
  },
];

// ─── İRAN ──────────────────────────────────────────────────────────────────────

const iranProvinces: Province[] = [
  {
    id: "tehran",
    name: "Tahran",
    levels: [
      {
        id: 1,
        word: "GALATA",
        letters: ["G", "A", "L", "A", "T"],
        targetWords: [
          { word: "GALATA", row: 0, col: 0, direction: "horizontal" },
          { word: "TAG", row: 0, col: 4, direction: "vertical" },
          { word: "ALA", row: 1, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 2,
        word: "TAKSIM",
        letters: ["T", "A", "K", "S", "İ", "M"],
        targetWords: [
          { word: "TAKSIM", row: 0, col: 0, direction: "horizontal" },
          { word: "KİS", row: 0, col: 2, direction: "vertical" },
          { word: "MAS", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 3,
        word: "KULE",
        letters: ["K", "U", "L", "E"],
        targetWords: [
          { word: "KULE", row: 0, col: 0, direction: "horizontal" },
          { word: "ELUK", row: 2, col: 0, direction: "horizontal" },
          { word: "KEL", row: 0, col: 1, direction: "vertical" },
        ],
      },
      {
        id: 4,
        word: "SARAY",
        letters: ["S", "A", "R", "A", "Y"],
        targetWords: [
          { word: "SARAY", row: 0, col: 0, direction: "horizontal" },
          { word: "ASA", row: 1, col: 1, direction: "horizontal" },
          { word: "YARA", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 5,
        word: "MARMARA",
        letters: ["M", "A", "R", "M", "A", "R", "A"],
        targetWords: [
          { word: "MARMARA", row: 0, col: 0, direction: "horizontal" },
          { word: "RAM", row: 0, col: 2, direction: "vertical" },
          { word: "ARA", row: 2, col: 4, direction: "horizontal" },
        ],
      },
      {
        id: 6,
        word: "UZAY",
        letters: ["U", "Z", "A", "Y"],
        targetWords: [
          { word: "UZAY", row: 0, col: 0, direction: "horizontal" },
          { word: "YAZ", row: 0, col: 3, direction: "vertical" },
          { word: "AY", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "ZEKA",
        letters: ["Z", "E", "K", "A"],
        targetWords: [
          { word: "ZEKA", row: 0, col: 0, direction: "horizontal" },
          { word: "KAZ", row: 0, col: 2, direction: "vertical" },
          { word: "KEZ", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "DOĞA",
        letters: ["D", "O", "Ğ", "A"],
        targetWords: [
          { word: "DOĞA", row: 0, col: 0, direction: "horizontal" },
          { word: "DAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "AĞA", row: 1, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "AKREP",
        letters: ["A", "K", "R", "E", "P"],
        targetWords: [
          { word: "AKREP", row: 0, col: 0, direction: "horizontal" },
          { word: "KARE", row: 0, col: 1, direction: "vertical" },
          { word: "PAK", row: 0, col: 4, direction: "vertical" },
        ],
      },
      {
        id: 10,
        word: "BOĞAZ",
        letters: ["B", "O", "Ğ", "A", "Z"],
        targetWords: [
          { word: "BOĞAZ", row: 0, col: 0, direction: "horizontal" },
          { word: "BAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "SAĞ", row: 0, col: 2, direction: "vertical" },
        ],
      },
    ],
  },
];

// ─── IRAK ──────────────────────────────────────────────────────────────────────

const iraqProvinces: Province[] = [
  {
    id: "baghdad",
    name: "Bağdat",
    levels: [
      {
        id: 1,
        word: "CİHAZ",
        letters: ["C", "İ", "H", "A", "Z"],
        targetWords: [
          { word: "CİHAZ", row: 0, col: 0, direction: "horizontal" },
          { word: "HAC", row: 0, col: 2, direction: "vertical" },
          { word: "CAZ", row: 2, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 2,
        word: "MÜZİK",
        letters: ["M", "Ü", "Z", "İ", "K"],
        targetWords: [
          { word: "MÜZİK", row: 0, col: 0, direction: "horizontal" },
          { word: "KİM", row: 0, col: 4, direction: "vertical" },
          { word: "İZ", row: 1, col: 4, direction: "horizontal" },
        ],
      },
      {
        id: 3,
        word: "SESLİ",
        letters: ["S", "E", "S", "L", "İ"],
        targetWords: [
          { word: "SESLİ", row: 0, col: 0, direction: "horizontal" },
          { word: "SEL", row: 0, col: 2, direction: "vertical" },
          { word: "LİSE", row: 2, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 4,
        word: "SİBER",
        letters: ["S", "İ", "B", "E", "R"],
        targetWords: [
          { word: "SİBER", row: 0, col: 0, direction: "horizontal" },
          { word: "BİR", row: 0, col: 2, direction: "vertical" },
          { word: "RES", row: 2, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 5,
        word: "KALE",
        letters: ["K", "A", "L", "E"],
        targetWords: [
          { word: "KALE", row: 0, col: 0, direction: "horizontal" },
          { word: "LAKE", row: 0, col: 1, direction: "vertical" },
          { word: "ELA", row: 2, col: 1, direction: "horizontal" },
        ],
      },
      {
        id: 6,
        word: "UZAY",
        letters: ["U", "Z", "A", "Y"],
        targetWords: [
          { word: "UZAY", row: 0, col: 0, direction: "horizontal" },
          { word: "YAZ", row: 0, col: 3, direction: "vertical" },
          { word: "AY", row: 1, col: 2, direction: "horizontal" },
        ],
      },
      {
        id: 7,
        word: "ZEKA",
        letters: ["Z", "E", "K", "A"],
        targetWords: [
          { word: "ZEKA", row: 0, col: 0, direction: "horizontal" },
          { word: "KAZ", row: 0, col: 2, direction: "vertical" },
          { word: "KEZ", row: 2, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 8,
        word: "DOĞA",
        letters: ["D", "O", "Ğ", "A"],
        targetWords: [
          { word: "DOĞA", row: 0, col: 0, direction: "horizontal" },
          { word: "DAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "AĞA", row: 1, col: 0, direction: "horizontal" },
        ],
      },
      {
        id: 9,
        word: "AKREP",
        letters: ["A", "K", "R", "E", "P"],
        targetWords: [
          { word: "AKREP", row: 0, col: 0, direction: "horizontal" },
          { word: "KARE", row: 0, col: 1, direction: "vertical" },
          { word: "PAK", row: 0, col: 4, direction: "vertical" },
        ],
      },
      {
        id: 10,
        word: "BOĞAZ",
        letters: ["B", "O", "Ğ", "A", "Z"],
        targetWords: [
          { word: "BOĞAZ", row: 0, col: 0, direction: "horizontal" },
          { word: "BAĞ", row: 0, col: 0, direction: "vertical" },
          { word: "SAĞ", row: 0, col: 2, direction: "vertical" },
        ],
      },
    ],
  },
];

// ─── WORLD EXPORT ──────────────────────────────────────────────────────────────

export const WORLD: Country[] = [
  {
    id: "turkey",
    name: "TÜRKİYE",
    flag: "🇹🇷",
    provinces: turkeyProvinces,
  },
  {
    id: "syria",
    name: "SURİYE",
    flag: "🇸🇾",
    provinces: syriaProvinces,
  },
  {
    id: "iran",
    name: "İRAN",
    flag: "🇮🇷",
    provinces: iranProvinces,
  },
  {
    id: "iraq",
    name: "IRAK",
    flag: "🇮🇶",
    provinces: iraqProvinces,
  },
];
