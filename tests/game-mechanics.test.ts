import { describe, it, expect } from "vitest";
import { getRandomWord, shuffleWord, isValidWord, getWordMeaning, generateRandomWordSet } from "../lib/turkish-words";

describe("Turkish Words Engine", () => {
  describe("getRandomWord", () => {
    it("should return 3-letter word", () => {
      const word = getRandomWord(3);
      expect(word.length).toBe(3);
    });

    it("should return 4-letter word", () => {
      const word = getRandomWord(4);
      expect(word.length).toBe(4);
    });

    it("should return 5-letter word", () => {
      const word = getRandomWord(5);
      expect(word.length).toBe(5);
    });

    it("should return 6-letter word", () => {
      const word = getRandomWord(6);
      expect(word.length).toBe(6);
    });

    it("should return random length word when not specified", () => {
      const word = getRandomWord();
      expect([3, 4, 5, 6]).toContain(word.length);
    });

    it("should return valid Turkish word", () => {
      const word = getRandomWord(3);
      expect(isValidWord(word)).toBe(true);
    });
  });

  describe("shuffleWord", () => {
    it("should return array with same letters", () => {
      const word = "ADAM";
      const shuffled = shuffleWord(word);
      expect(shuffled.sort().join("")).toBe(word.split("").sort().join(""));
    });

    it("should have same length as original", () => {
      const word = "ABACI";
      const shuffled = shuffleWord(word);
      expect(shuffled.length).toBe(word.length);
    });
  });

  describe("isValidWord", () => {
    it("should accept valid 3-letter word", () => {
      expect(isValidWord("ABA")).toBe(true);
    });

    it("should accept valid 4-letter word", () => {
      expect(isValidWord("ADAM")).toBe(true);
    });

    it("should accept valid 5-letter word", () => {
      expect(isValidWord("ABACI")).toBe(true);
    });

    it("should accept valid 6-letter word", () => {
      expect(isValidWord("ABAJUR")).toBe(true);
    });

    it("should reject invalid word", () => {
      expect(isValidWord("XYZABC")).toBe(false);
    });

    it("should reject wrong length", () => {
      expect(isValidWord("AB")).toBe(false);
    });
  });

  describe("getWordMeaning", () => {
    it("should return meaning for known word", () => {
      const meaning = getWordMeaning("ABA");
      expect(meaning).not.toContain("Anlam bilinmiyor");
      expect(meaning.length).toBeGreaterThan(0);
    });

    it("should return unknown for non-existent word", () => {
      const meaning = getWordMeaning("XYZABC");
      expect(meaning).toBe("Anlam bilinmiyor");
    });
  });

  describe("generateRandomWordSet", () => {
    it("should generate random word set", () => {
      const words = generateRandomWordSet(10);
      expect(words.length).toBe(10);
    });

    it("should return valid words", () => {
      const words = generateRandomWordSet(5);
      words.forEach(word => {
        expect(isValidWord(word)).toBe(true);
      });
    });

    it("should handle default count", () => {
      const words = generateRandomWordSet();
      expect(words.length).toBe(10);
    });
  });

  describe("Game Mechanics", () => {
    it("should generate valid game puzzle", () => {
      const targetWord = getRandomWord();
      const shuffledLetters = shuffleWord(targetWord);
      
      expect(shuffledLetters.length).toBe(targetWord.length);
      expect(isValidWord(targetWord)).toBe(true);
    });

    it("should validate word from shuffled letters", () => {
      const targetWord = "ADAM";
      const shuffledLetters = shuffleWord(targetWord);
      
      expect(isValidWord(targetWord)).toBe(true);
    });

    it("should handle 3/4/5/6 letter distribution", () => {
      const lengths = [3, 4, 5, 6] as const;
      
      lengths.forEach(len => {
        const word = getRandomWord(len);
        expect(word.length).toBe(len);
        expect(isValidWord(word)).toBe(true);
      });
    });
  });
});
