import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

// Her bölüm için 4 kelime ve 4 harf
const LEVEL_DATA = {
  1: {
    words: ["KALE", "ELMA", "MELE", "ALEM"],
    letters: ["K", "A", "L", "E", "M"],
  },
  2: {
    words: ["MASA", "ASMA", "SAMA", "MASA"],
    letters: ["M", "A", "S", "A"],
  },
  3: {
    words: ["DERE", "ERDE", "REDE", "EDER"],
    letters: ["D", "E", "R", "E"],
  },
  4: {
    words: ["KEDI", "DIKE", "EDIK", "KIDE"],
    letters: ["K", "E", "D", "I"],
  },
};

interface GameState {
  currentLevel: number;
  foundWords: string[];
  selectedIndices: number[];
  score: number;
  currentCity: string;
  currentDistrict: string;
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = (params.city as string) || "İstanbul";
  const districtName = (params.district as string) || "Fatih";

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    foundWords: [],
    selectedIndices: [],
    score: 0,
    currentCity: cityName,
    currentDistrict: districtName,
  });

  const [showMeaning, setShowMeaning] = useState(false);
  const [meaning, setMeaning] = useState("");

  const currentLevelData = LEVEL_DATA[gameState.currentLevel as keyof typeof LEVEL_DATA] || LEVEL_DATA[1];
  const letters = currentLevelData.letters;
  const targetWords = currentLevelData.words;

  // Harf seçimi
  const handleLetterPress = (index: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setGameState(prev => ({
      ...prev,
      selectedIndices: [...prev.selectedIndices, index],
    }));
  };

  // Dokunma serbest bırakıldığında
  const handleTouchEnd = () => {
    if (gameState.selectedIndices.length === 0) return;

    // Seçili harfleri birleştir
    const selectedWord = gameState.selectedIndices
      .map(i => letters[i])
      .join("")
      .toUpperCase();

    // Kelimeyi doğrula
    if (targetWords.includes(selectedWord) && !gameState.foundWords.includes(selectedWord)) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setMeaning(`✓ ${selectedWord} bulundu!`);
      setShowMeaning(true);

      const newFoundWords = [...gameState.foundWords, selectedWord];
      setGameState(prev => ({
        ...prev,
        foundWords: newFoundWords,
        score: prev.score + selectedWord.length * 10,
        selectedIndices: [],
      }));

      // Tüm kelimeler bulundu mu?
      if (newFoundWords.length === targetWords.length) {
        setTimeout(() => {
          setMeaning("🎉 Bölüm tamamlandı!");
          setTimeout(() => {
            if (gameState.currentLevel < 4) {
              setGameState(prev => ({
                ...prev,
                currentLevel: prev.currentLevel + 1,
                foundWords: [],
                selectedIndices: [],
              }));
            } else {
              setMeaning("🏆 Oyun tamamlandı!");
            }
            setShowMeaning(false);
          }, 1500);
        }, 500);
      } else {
        setTimeout(() => setShowMeaning(false), 1500);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setMeaning("✗ Kelime bulunamadı");
      setShowMeaning(true);
      setGameState(prev => ({
        ...prev,
        selectedIndices: [],
      }));
      setTimeout(() => setShowMeaning(false), 1000);
    }
  };

  // Seçili harflerin konumlarını hesapla (çizgiler için)
  const getSelectedLetterPositions = () => {
    const positions: Array<{ x: number; y: number }> = [];
    const radius = 80;
    const centerX = width / 2;
    const centerY = height * 0.62;

    gameState.selectedIndices.forEach((index) => {
      const angle = (index / letters.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    });

    return positions;
  };

  return (
    <ImageBackground source={{ uri: BACKGROUND_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerCity}>{gameState.currentCity}</Text>
            <Text style={styles.headerDistrict}>Bölüm {gameState.currentLevel}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{gameState.score}</Text>
          </View>
        </View>

        {/* Kutucuklar (Boş başlangıçta, doğru kelime bulunca doldurulacak) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
          {targetWords.map((word, idx) => (
            <View key={idx} style={styles.wordBox}>
              <Text style={styles.wordBoxText}>
                {gameState.foundWords.includes(word) ? word : "????"}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Kelime Anlamı (Popup) */}
        {showMeaning && (
          <View style={styles.meaningPopup}>
            <Text style={styles.meaningText}>{meaning}</Text>
          </View>
        )}

        {/* Seçili Harfler Gösterimi */}
        {gameState.selectedIndices.length > 0 && (
          <View style={styles.selectedWordsBox}>
            <Text style={styles.selectedWordsText}>
              {gameState.selectedIndices.map(i => letters[i]).join("")}
            </Text>
          </View>
        )}

        {/* Harf Çemberi - Harfler gösterilecek */}
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            {/* Seçili harfler arasında çizgiler */}
            {gameState.selectedIndices.length > 1 && (
              <View style={styles.linesContainer}>
                {getSelectedLetterPositions().map((pos, idx) => {
                  if (idx === 0) return null;
                  const prevPos = getSelectedLetterPositions()[idx - 1];
                  const angle = Math.atan2(pos.y - prevPos.y, pos.x - prevPos.x);
                  const distance = Math.sqrt(
                    Math.pow(pos.x - prevPos.x, 2) + Math.pow(pos.y - prevPos.y, 2)
                  );

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.line,
                        {
                          width: distance,
                          left: prevPos.x,
                          top: prevPos.y,
                          transform: [{ rotate: `${(angle * 180) / Math.PI}deg` }],
                        },
                      ]}
                    />
                  );
                })}
              </View>
            )}

            {/* Harfler (gösterilecek) */}
            {letters.map((letter, index) => {
              const angle = (index / letters.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 80;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              const isSelected = gameState.selectedIndices.includes(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.letterCircle,
                    {
                      transform: [{ translateX: x }, { translateY: y }],
                      backgroundColor: isSelected ? "#5A2EFF" : "#FFFFFF",
                      borderColor: isSelected ? "#5A2EFF" : "#E5E7EB",
                    },
                  ]}
                  onPress={() => handleLetterPress(index)}
                  onPressOut={handleTouchEnd}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.letterText, { color: isSelected ? "#FFFFFF" : "#0F1E52" }]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Kontrol Butonları */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setGameState(prev => ({ ...prev, selectedIndices: [] }))}
          >
            <Text style={styles.buttonText}>Temizle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleTouchEnd}
            disabled={gameState.selectedIndices.length === 0}
          >
            <Text style={styles.buttonText}>Kontrol Et</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(30, 47, 110, 0.5)",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerCity: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  headerDistrict: {
    color: "#8899BB",
    fontSize: 12,
  },
  scoreBox: {
    backgroundColor: "#5A2EFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  // Kutucuklar
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wordBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  wordBoxText: {
    color: "#0F1E52",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },

  // Kelime Anlamı
  meaningPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -30 }],
    width: 200,
    backgroundColor: "#0F1E52",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#5A2EFF",
    zIndex: 100,
  },
  meaningText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  // Seçili Harfler
  selectedWordsBox: {
    alignSelf: "center",
    backgroundColor: "#5A2EFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 12,
  },
  selectedWordsText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  // Harf Çemberi
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  linesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  line: {
    height: 3,
    backgroundColor: "#5A2EFF",
    position: "absolute",
    transformOrigin: "0 50%",
  },
  letterCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  letterText: {
    fontWeight: "700",
    fontSize: 18,
  },

  // Kontrol Butonları
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
