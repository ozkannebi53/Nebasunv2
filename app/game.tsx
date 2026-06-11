import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getRandomWord, isValidWord, getWordMeaning } from "@/lib/turkish-words";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

interface GameState {
  word: string;
  selectedIndices: number[];
  foundWords: string[];
  score: number;
  currentDistrict: string;
  currentCity: string;
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityName = (params.city as string) || "İstanbul";
  const districtName = (params.district as string) || "Fatih";

  const [gameState, setGameState] = useState<GameState>({
    word: "",
    selectedIndices: [],
    foundWords: [],
    score: 0,
    currentDistrict: districtName,
    currentCity: cityName,
  });

  const [letters, setLetters] = useState<string[]>([]);
  const [showMeaning, setShowMeaning] = useState(false);
  const [meaning, setMeaning] = useState("");

  // Oyun başlat
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Rastgele kelime seç (3-6 harf)
    const lengths = [3, 4, 5, 6] as const;
    const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
    const randomWord = getRandomWord(randomLength);

    // Harf çemberi için harfler (rastgele sırada)
    const wordLetters = randomWord.split("");
    const shuffledLetters = [...wordLetters].sort(() => Math.random() - 0.5);

    setLetters(shuffledLetters);
    setGameState(prev => ({
      ...prev,
      word: randomWord,
      selectedIndices: [],
    }));
  };

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
    if (isValidWord(selectedWord) && !gameState.foundWords.includes(selectedWord)) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const wordMeaning = getWordMeaning(selectedWord);
      setMeaning(wordMeaning);
      setShowMeaning(true);

      setGameState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, selectedWord],
        score: prev.score + selectedWord.length * 10,
        selectedIndices: [],
      }));

      setTimeout(() => {
        setShowMeaning(false);
        initializeGame();
      }, 2000);
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setGameState(prev => ({
        ...prev,
        selectedIndices: [],
      }));
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
            <Text style={styles.headerDistrict}>{gameState.currentDistrict}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{gameState.score}</Text>
          </View>
        </View>

        {/* Boş Kareler (Crossword Grid) - Referans fotoğrafta olduğu gibi */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.gridCell} />
            ))}
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
          </View>
          <View style={styles.gridRow}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.gridCell} />
            ))}
          </View>
        </View>

        {/* Bulunan Kelimeler */}
        {gameState.foundWords.length > 0 && (
          <View style={styles.foundWordsContainer}>
            <Text style={styles.foundWordsLabel}>Bulunan: {gameState.foundWords.length}</Text>
            <View style={styles.foundWordsList}>
              {gameState.foundWords.map((word, idx) => (
                <View key={idx} style={styles.foundWordBadge}>
                  <Text style={styles.foundWordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Kelime Anlamı (Popup) */}
        {showMeaning && (
          <View style={styles.meaningPopup}>
            <Text style={styles.meaningTitle}>Kelime Anlamı</Text>
            <Text style={styles.meaningText}>{meaning}</Text>
          </View>
        )}

        {/* Harf Çemberi - Referans fotoğrafta olduğu gibi boş daireler */}
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

            {/* Boş Daireler (Harfler gösterilmeyecek - referans fotoğrafta olduğu gibi) */}
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
                  {/* Tamamen boş - hiçbir harf gösterilmeyecek */}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Yeni Oyun Butonu */}
        <TouchableOpacity style={styles.newGameBtn} onPress={initializeGame}>
          <Text style={styles.newGameBtnText}>Yeni Oyun</Text>
        </TouchableOpacity>
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

  // Grid
  gridContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  gridCell: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },

  // Bulunan Kelimeler
  foundWordsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  foundWordsLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 6,
  },
  foundWordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  foundWordBadge: {
    backgroundColor: "#5A2EFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foundWordText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },

  // Kelime Anlamı
  meaningPopup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -75 }],
    width: 300,
    backgroundColor: "#0F1E52",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#5A2EFF",
    zIndex: 100,
  },
  meaningTitle: {
    color: "#5A2EFF",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
  },
  meaningText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 20,
  },

  // Harf Çemberi
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
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

  // Yeni Oyun Butonu
  newGameBtn: {
    alignSelf: "center",
    backgroundColor: "#5A2EFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 20,
  },
  newGameBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
