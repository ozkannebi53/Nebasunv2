import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";

const { width, height } = Dimensions.get("window");

// Animasyonlu doğa arka planı referans URL
const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityId = (params.cityId as string) || "istanbul";
  const initialLevel = parseInt((params.level as string) || "1");

  const [level, setLevel] = useState(initialLevel);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  
  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Yeni puzzle oluştur
    const newPuzzle = generatePuzzle(cityId, level);
    setPuzzle(newPuzzle);
    setFoundWords([]);
    setSelectedIndices([]);
    
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [level, cityId]);

  if (!puzzle) return null;

  const handleLetterPress = (index: number) => {
    if (selectedIndices.includes(index)) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setSelectedIndices(prev => [...prev, index]);
  };

  const handleTouchEnd = () => {
    if (selectedIndices.length === 0) return;

    const attempt = selectedIndices.map(i => puzzle.letters[i]).join("");
    const result = checkWord(puzzle, attempt);

    if (result === "target" && !foundWords.includes(attempt)) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const newFoundWords = [...foundWords, attempt];
      setFoundWords(newFoundWords);
      setScore(prev => prev + attempt.length * 10);
      setSelectedIndices([]);

      if (newFoundWords.length === puzzle.targetWords.length) {
        Alert.alert("Tebrikler!", "Bölüm Tamamlandı!", [
          { text: "Sonraki Bölüm", onPress: () => setLevel(prev => prev + 1) }
        ]);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setSelectedIndices([]);
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      "Çıkış",
      "Oyundan çıkmak istediğinize emin misiniz?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: () => router.back() }
      ]
    );
  };

  return (
    <ImageBackground source={{ uri: BACKGROUND_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.levelText}>BÖLÜM {level}</Text>
            <Text style={styles.scoreText}>SKOR: {score}</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <IconSymbol name="gearshape.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Kelime Kutucukları */}
        <ScrollView contentContainerStyle={styles.wordsContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.wordsGrid, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {puzzle.targetWords.map((wordObj, idx) => (
              <View key={idx} style={styles.wordRow}>
                {wordObj.word.split("").map((char, charIdx) => (
                  <View key={charIdx} style={[styles.letterBox, foundWords.includes(wordObj.word) && styles.letterBoxFound]}>
                    <Text style={styles.letterBoxText}>
                      {foundWords.includes(wordObj.word) ? char : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </Animated.View>
        </ScrollView>

        {/* Seçili Harf Gösterimi */}
        <View style={styles.currentWordContainer}>
          <Text style={styles.currentWordText}>
            {selectedIndices.map(i => puzzle.letters[i]).join("")}
          </Text>
        </View>

        {/* Harf Çemberi */}
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            {puzzle.letters.map((letter, index) => {
              const angle = (index / puzzle.letters.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 90;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              const isSelected = selectedIndices.includes(index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.letterCircle,
                    {
                      transform: [{ translateX: x }, { translateY: y }],
                      backgroundColor: isSelected ? "#5A2EFF" : "rgba(255,255,255,0.9)",
                    },
                  ]}
                  onPressIn={() => handleLetterPress(index)}
                  onPressOut={handleTouchEnd}
                >
                  <Text style={[styles.letterText, { color: isSelected ? "#FFFFFF" : "#0F1E52" }]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Alt Butonlar */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setSelectedIndices([])}>
            <IconSymbol name="arrow.counterclockwise" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("İpucu", "Henüz ipucu yok!")}>
            <IconSymbol name="lightbulb.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerInfo: { alignItems: "center" },
  levelText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  scoreText: { color: "#FFD700", fontSize: 12, fontWeight: "700", marginTop: 2 },
  settingsBtn: { width: 40, height: 40, alignItems: "flex-end", justifyContent: "center" },
  
  wordsContainer: { paddingVertical: 20, alignItems: "center" },
  wordsGrid: { gap: 10 },
  wordRow: { flexDirection: "row", gap: 5, justifyContent: "center" },
  letterBox: {
    width: 40, height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterBoxFound: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  letterBoxText: { color: "#0F1E52", fontSize: 20, fontWeight: "900" },

  currentWordContainer: { height: 40, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  currentWordText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", letterSpacing: 4, textShadowColor: "#000", textShadowRadius: 10 },

  circleContainer: { height: 280, justifyContent: "center", alignItems: "center" },
  circle: {
    width: 220, height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterCircle: {
    position: "absolute",
    width: 54, height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  letterText: { fontSize: 24, fontWeight: "900" },

  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  actionBtn: {
    width: 50, height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(90, 46, 255, 0.4)",
  }
});
