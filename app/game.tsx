import React, { useState, useEffect, useRef, useMemo } from "react";
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
  PanResponder,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";
import Svg, { Path, Circle, Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Animasyonlu doğa arka planı
const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

const CIRCLE_SIZE = 280;
const LETTER_CIRCLE_SIZE = 56;
const RADIUS = 100;

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cityId = (params.cityId as string) || "istanbul";
  const initialLevel = parseInt((params.level as string) || "1");

  const [level, setLevel] = useState(initialLevel);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentTouchPos, setCurrentTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  
  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Harf koordinatlarını hesapla
  const letterPositions = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.letters.map((_, index) => {
      const angle = (index / puzzle.letters.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: CIRCLE_SIZE / 2 + RADIUS * Math.cos(angle),
        y: CIRCLE_SIZE / 2 + RADIUS * Math.sin(angle),
      };
    });
  }, [puzzle]);

  useEffect(() => {
    const newPuzzle = generatePuzzle(cityId, level);
    setPuzzle(newPuzzle);
    setFoundWords([]);
    setSelectedIndices([]);
    
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [level, cityId]);

  // Titreme animasyonu (Hatalı kelime için)
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY);
        setCurrentTouchPos({ x: locationX, y: locationY });
      },
      onPanResponderRelease: () => {
        handleTouchEnd();
        setCurrentTouchPos(null);
      },
    })
  ).current;

  const handleTouch = (x: number, y: number) => {
    letterPositions.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < 30 && !selectedIndices.includes(index)) {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedIndices(prev => [...prev, index]);
      }
    });
  };

  const handleTouchEnd = () => {
    if (selectedIndices.length === 0) return;

    const attempt = selectedIndices.map(i => puzzle!.letters[i]).join("");
    const result = checkWord(puzzle!, attempt);

    if (result === "target" && !foundWords.includes(attempt)) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFoundWords(prev => [...prev, attempt]);
      setScore(prev => prev + attempt.length * 10);
      setSelectedIndices([]);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setSelectedIndices([]);
    }
  };

  if (!puzzle) return null;

  // Şerit Path'ini oluştur
  const renderPath = () => {
    if (selectedIndices.length === 0) return null;
    
    let d = "";
    selectedIndices.forEach((idx, i) => {
      const pos = letterPositions[idx];
      if (i === 0) d += `M ${pos.x} ${pos.y}`;
      else d += ` L ${pos.x} ${pos.y}`;
    });

    return (
      <Svg style={StyleSheet.absoluteFill}>
        <Path
          d={d}
          stroke="#FF00FF" // Pembe şerit
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        {currentTouchPos && selectedIndices.length > 0 && (
          <Line
            x1={letterPositions[selectedIndices[selectedIndices.length - 1]].x}
            y1={letterPositions[selectedIndices[selectedIndices.length - 1]].y}
            x2={currentTouchPos.x}
            y2={currentTouchPos.y}
            stroke="#FF00FF"
            strokeWidth="8"
            opacity="0.4"
          />
        )}
      </Svg>
    );
  };

  return (
    <ImageBackground source={{ uri: BACKGROUND_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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
          <Animated.View style={[
            styles.wordsGrid, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }
          ]}>
            {puzzle.targetWords.map((wordObj, idx) => (
              <View key={idx} style={styles.wordRow}>
                {wordObj.word.split("").map((char, charIdx) => (
                  <View key={charIdx} style={[styles.letterBox, foundWords.includes(wordObj.word) && styles.letterBoxFound]}>
                    <Text style={styles.letterBoxText}>
                      {foundWords.includes(wordObj.word) ? char.toUpperCase() : ""}
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
            {selectedIndices.map(i => puzzle.letters[i]).join("").toUpperCase()}
          </Text>
        </View>

        {/* Harf Çemberi ve Şerit */}
        <View style={styles.circleContainer}>
          <View style={styles.circle} {...panResponder.panHandlers}>
            {renderPath()}
            {puzzle.letters.map((letter, index) => {
              const pos = letterPositions[index];
              const isSelected = selectedIndices.includes(index);

              return (
                <View
                  key={index}
                  style={[
                    styles.letterCircle,
                    {
                      left: pos.x - LETTER_CIRCLE_SIZE / 2,
                      top: pos.y - LETTER_CIRCLE_SIZE / 2,
                      backgroundColor: isSelected ? "#FF00FF" : "rgba(255,255,255,0.95)",
                    },
                  ]}
                >
                  <Text style={[styles.letterText, { color: isSelected ? "#FFFFFF" : "#0F1E52" }]}>
                    {letter.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Alt Butonlar */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setSelectedIndices([])}>
            <IconSymbol name="arrow.counterclockwise" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/lima")}>
            <Text style={{ fontSize: 24 }}>🦂</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerInfo: { alignItems: "center" },
  levelText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  scoreText: { color: "#FFD700", fontSize: 12, fontWeight: "700", marginTop: 2 },
  settingsBtn: { width: 40, height: 40, alignItems: "flex-end", justifyContent: "center" },
  
  wordsContainer: { paddingVertical: 20, alignItems: "center" },
  wordsGrid: { gap: 12 },
  wordRow: { flexDirection: "row", gap: 6, justifyContent: "center" },
  letterBox: {
    width: 44, height: 44,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterBoxFound: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF", elevation: 5 },
  letterBoxText: { color: "#0F1E52", fontSize: 24, fontWeight: "900" },

  currentWordContainer: { height: 50, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  currentWordText: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", letterSpacing: 6, textShadowColor: "#000", textShadowRadius: 15 },

  circleContainer: { height: 320, justifyContent: "center", alignItems: "center" },
  circle: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  letterCircle: {
    position: "absolute",
    width: LETTER_CIRCLE_SIZE, height: LETTER_CIRCLE_SIZE,
    borderRadius: LETTER_CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  letterText: { fontSize: 28, fontWeight: "900" },

  footerActions: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 40, paddingBottom: 30 },
  actionBtn: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(15, 30, 82, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 0, 255, 0.4)",
  }
});
