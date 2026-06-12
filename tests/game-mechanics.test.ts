import { describe, it, expect } from "vitest";
import { generatePuzzle, checkWord } from "../lib/word-engine";
import { getRandomWord, isValidWord, getWordMeaning, shuffleWord } from "../lib/turkish-words";

describe("Nebasun Word Engine", () => {
  describe("Puzzle Logic", () => {
    it("should generate a valid puzzle", () => {
      const puzzle = generatePuzzle("istanbul", 1);
      expect(puzzle).toBeDefined();
      expect(puzzle.letters.length).toBeGreaterThan(0);
      expect(puzzle.targetWords.length).toBeGreaterThan(0);
    });

    it("should validate correct target words", () => {
      const puzzle = generatePuzzle("istanbul", 1);
      const targetWord = puzzle.targetWords[0].word;
      expect(checkWord(puzzle, targetWord)).toBe("target");
    });

    it("should return invalid for non-existent words", () => {
      const puzzle = generatePuzzle("istanbul", 1);
      expect(checkWord(puzzle, "XYZABC123")).toBe("invalid");
    });
  });

  describe("Turkish Words (Legacy Wrapper)", () => {
    it("should return valid words", () => {
      const word = getRandomWord(3);
      console.log("Testing word:", word, "Length:", word.length);
      expect(word.length).toBe(3);
      const valid = isValidWord(word);
      console.log("Is valid:", valid);
      expect(valid).toBe(true);
    });

    it("should return meanings", () => {
      const word = "KALEM";
      const meaning = getWordMeaning(word);
      expect(meaning).not.toBe("Kelime anlamı bulunamadı.");
    });

    it("should shuffle words correctly", () => {
      const word = "MASA";
      const shuffled = shuffleWord(word);
      expect(shuffled.length).toBe(4);
      expect(shuffled.sort().join("")).toBe(word.split("").sort().join(""));
    });
  });
});
