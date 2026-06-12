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
    letters: ["A", "D", "A", "M"],
    targetWords: [
      { word: "ADA", row: 0, col: 0, direction: "horizontal" },
      { word: "DAM", row: 0, col: 1, direction: "vertical" },
      { word: "ADA", row: 2, col: 0, direction: "horizontal" },
    ],
  },
  {
    id: 2,
    cityId: "istanbul",
    letters: ["K", "A", "L", "E"],
    targetWords: [
      { word: "KALE", row: 0, col: 1, direction: "vertical" },
      { word: "LAKE", row: 2, col: 0, direction: "horizontal" },
      { word: "ELA", row: 3, col: 1, direction: "horizontal" },
    ],
  },
  {
    id: 3,
    cityId: "istanbul",
    letters: ["S", "A", "R", "A", "Y"],
    targetWords: [
      { word: "SARAY", row: 0, col: 2, direction: "vertical" },
      { word: "ASA", row: 1, col: 1, direction: "horizontal" },
      { word: "YARA", row: 4, col: 0, direction: "horizontal" },
      { word: "AYAR", row: 0, col: 4, direction: "vertical" },
    ],
  },
  {
    id: 4,
    cityId: "istanbul",
    letters: ["B", "O", "Ğ", "A", "Z"],
    targetWords: [
      { word: "BOĞAZ", row: 2, col: 0, direction: "horizontal" },
      { word: "BAĞ", row: 2, col: 0, direction: "vertical" },
      { word: "SAĞ", row: 0, col: 2, direction: "vertical" },
      { word: "BOZ", row: 2, col: 4, direction: "vertical" },
    ],
  },
  {
    id: 5,
    cityId: "istanbul",
    letters: ["K", "U", "L", "E"],
    targetWords: [
      { word: "KULE", row: 0, col: 1, direction: "vertical" },
      { word: "ELUK", row: 3, col: 0, direction: "horizontal" },
      { word: "KEL", row: 0, col: 1, direction: "horizontal" },
    ],
  },
];
