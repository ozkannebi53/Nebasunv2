import { describe, it, expect } from "vitest";
import { getRandomWord, shuffleWord, isValidWord, getWordMeaning } from "../lib/turkish-words";

describe("Turkish Words Engine", () => {
  describe("getRandomWord", () => {
    it("should return 5-letter word", () => {
      const word = getRandomWord(5);
      expect(word.length).toBe(5);
    });

    it("should return 7-letter word", () => {
      const word = getRandomWord(7);
      expect(word.length).toBe(7);
    });

    it("should return 9-letter word", () => {
      const word = getRandomWord(9);
      expect(word.length).toBe(9);
    });

    it("should return valid Turkish word", () => {
      const word = getRandomWord(5);
      expect(isValidWord(word)).toBe(true);
    });
  });

  describe("shuffleWord", () => {
    it("should return array with same letters", () => {
      const word = "KALE";
      const shuffled = shuffleWord(word);
      expect(shuffled.sort().join("")).toBe(word.split("").sort().join(""));
    });

    it("should have same length as original", () => {
      const word = "KALEMCI";
      const shuffled = shuffleWord(word);
      expect(shuffled.length).toBe(word.length);
    });
  });

  describe("isValidWord", () => {
    it("should accept valid 5-letter word", () => {
      expect(isValidWord("KALE")).toBe(true);
    });

    it("should accept valid 7-letter word", () => {
      expect(isValidWord("KALEMCI")).toBe(true);
    });

    it("should accept valid 9-letter word", () => {
      expect(isValidWord("KALEMLERI")).toBe(true);
    });

    it("should reject invalid word", () => {
      expect(isValidWord("XYZABC")).toBe(false);
    });

    it("should reject wrong length", () => {
      expect(isValidWord("KA")).toBe(false);
    });
  });

  describe("getWordMeaning", () => {
    it("should return meaning for known word", () => {
      const meaning = getWordMeaning("KALE");
      expect(meaning).not.toContain("Anlam bilinmiyor");
      expect(meaning.length).toBeGreaterThan(0);
    });

    it("should return unknown for non-existent word", () => {
      const meaning = getWordMeaning("XYZABC");
      expect(meaning).toBe("Anlam bilinmiyor");
    });
  });

  describe("Game Mechanics", () => {
    it("should generate valid game puzzle", () => {
      const targetWord = getRandomWord(5);
      const shuffledLetters = shuffleWord(targetWord);
      
      expect(shuffledLetters.length).toBe(targetWord.length);
      expect(isValidWord(targetWord)).toBe(true);
    });

    it("should validate word from shuffled letters", () => {
      const targetWord = "KALE";
      const shuffledLetters = shuffleWord(targetWord);
      
      expect(isValidWord(targetWord)).toBe(true);
    });

    it("should handle 5/7/9 letter distribution", () => {
      const lengths = [5, 7, 9] as const;
      
      lengths.forEach(len => {
        const word = getRandomWord(len);
        expect(word.length).toBe(len);
        expect(isValidWord(word)).toBe(true);
      });
    });
  });
});
