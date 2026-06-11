import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { getRandomWord, shuffleWord, isValidWord, getWordMeaning } from "@/lib/turkish-words";
import { getDistrictsByCity } from "@/lib/districts";

const { width, height } = Dimensions.get("window");

interface SelectedLetter {
  index: number;
  x: number;
  y: number;
}

export default function GameScreen() {
  const router = useRouter();
  const [district, setDistrict] = useState("İstanbul");
  const [wordLength, setWordLength] = useState<3 | 4 | 5 | 6>(5);
  const [targetWord, setTargetWord] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {}, // Hareket takibi
      onPanResponderRelease: () => {
        // Dokunma serbest bırakıldığında kontrol et
        if (selectedIndices.length > 0) {
          checkWord();
        }
      },
    })
  ).current;

  // Oyun başlat
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const lengths = [3, 4, 5, 6] as const;
    const len = lengths[Math.floor(Math.random() * lengths.length)];
    setWordLength(len);

    const word = getRandomWord(len);
    setTargetWord(word);
    setShuffledLetters(shuffleWord(word));
    setSelectedIndices([]);
    setFoundWords([]);
    setMessage("");
  };

  const handleLetterPress = (index: number) => {
    if (selectedIndices.includes(index)) {
      // Aynı harfe tekrar basıldığında seçimden çıkar
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      // Harfi seçime ekle
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const checkWord = () => {
    if (selectedIndices.length === 0) return;

    const selectedWord = selectedIndices.map(i => shuffledLetters[i]).join("").toUpperCase();

    if (isValidWord(selectedWord) && !foundWords.includes(selectedWord)) {
      // Kelime bulundu
      setFoundWords([...foundWords, selectedWord]);
      setMessage(`✓ ${selectedWord} bulundu!`);
      setMessageType("success");
      setSelectedIndices([]);

      // Tüm kelimeler bulundu mu?
      if (foundWords.length + 1 >= Math.ceil(wordLength / 2)) {
        setTimeout(() => {
          setMessage("🎉 Bölüm tamamlandı!");
          setTimeout(() => {
            initializeGame();
          }, 1500);
        }, 500);
      }
    } else if (selectedWord.length > 0) {
      // Kelime bulunamadı
      setMessage("✗ Kelime bulunamadı");
      setMessageType("error");
      setSelectedIndices([]);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const handleLetterLongPress = (index: number) => {
    // Uzun basış: harfi seçim listesine ekle
    if (!selectedIndices.includes(index)) {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-blue-500 to-blue-600 p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Başlık */}
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl text-white">←</Text>
          </Pressable>
          <Text className="text-lg font-bold text-white">{district} - Bölüm</Text>
          <View className="w-6" />
        </View>

        {/* Bulunan Kelimeler (Crossword Grid) */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <View className="flex-wrap flex-row gap-2">
            {foundWords.length > 0 ? (
              foundWords.map((word, idx) => (
                <View
                  key={idx}
                  className="bg-teal-700 rounded-lg px-3 py-2"
                >
                  <Text className="text-white font-bold text-sm">{word}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-400 text-sm">Kelime bulmaya başla...</Text>
            )}
          </View>
        </View>

        {/* Mesaj */}
        {message && (
          <View
            className={`rounded-lg p-3 mb-4 ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <Text className="text-white font-semibold text-center">{message}</Text>
          </View>
        )}

        {/* Harf Çemberi */}
        <View className="flex-1 items-center justify-center">
          <View
            className="w-64 h-64 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Harfler Çemberi */}
            <View className="w-full h-full items-center justify-center relative">
              {shuffledLetters.map((letter, index) => {
                const angle = (index / shuffledLetters.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const isSelected = selectedIndices.includes(index);

                return (
                  <Pressable
                    key={index}
                    onPress={() => handleLetterPress(index)}
                    onLongPress={() => handleLetterLongPress(index)}
                    style={{
                      position: "absolute",
                      left: 128 + x - 24,
                      top: 128 + y - 24,
                    }}
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      isSelected ? "bg-teal-700" : "bg-teal-600"
                    }`}
                  >
                    <Text
                      className={`text-2xl font-bold ${
                        isSelected ? "text-white" : "text-white"
                      }`}
                    >
                      {letter}
                    </Text>
                  </Pressable>
                );
              })}

              {/* Seçilen Harfler Arasında Çizgi */}
              {selectedIndices.length > 1 && (
                <View className="absolute w-full h-full">
                  {selectedIndices.map((idx, i) => {
                    if (i === 0) return null;

                    const prevIdx = selectedIndices[i - 1];
                    const angle1 = (prevIdx / shuffledLetters.length) * Math.PI * 2 - Math.PI / 2;
                    const angle2 = (idx / shuffledLetters.length) * Math.PI * 2 - Math.PI / 2;
                    const radius = 100;

                    const x1 = Math.cos(angle1) * radius + 128;
                    const y1 = Math.sin(angle1) * radius + 128;
                    const x2 = Math.cos(angle2) * radius + 128;
                    const y2 = Math.sin(angle2) * radius + 128;

                    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const lineAngle = Math.atan2(y2 - y1, x2 - x1);

                    return (
                      <View
                        key={`line-${i}`}
                        style={{
                          position: "absolute",
                          left: x1,
                          top: y1,
                          width: lineLength,
                          height: 3,
                          backgroundColor: "#0f766e",
                          transform: [{ rotate: `${lineAngle}rad` }],
                          transformOrigin: "0 50%",
                        }}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {/* Seçili Harfler Gösterimi */}
          {selectedIndices.length > 0 && (
            <View className="mt-6 bg-teal-700 rounded-lg px-6 py-3">
              <Text className="text-white font-bold text-lg">
                {selectedIndices.map(i => shuffledLetters[i]).join("")}
              </Text>
            </View>
          )}
        </View>

        {/* Kontrol Butonları */}
        <View className="flex-row gap-3 mt-6">
          <Pressable
            onPress={() => setSelectedIndices([])}
            className="flex-1 bg-red-500 rounded-lg p-3"
          >
            <Text className="text-white font-bold text-center">Temizle</Text>
          </Pressable>
          <Pressable
            onPress={checkWord}
            className="flex-1 bg-green-500 rounded-lg p-3"
          >
            <Text className="text-white font-bold text-center">Kontrol Et</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
