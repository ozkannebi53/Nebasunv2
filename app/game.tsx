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
  PanResponder,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";
import Svg, { Path, Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

// Referans fotoğraflardaki gibi modern boyutlar
const CIRCLE_SIZE = width * 0.78; 
const RADIUS = (CIRCLE_SIZE / 2) - 45; 
const LETTER_SIZE = 64; 

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
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<View>(null);

  // Harf konumlarını çemberin merkezine göre hesapla
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
    try {
      const newPuzzle = generatePuzzle(cityId, level);
      setPuzzle(newPuzzle);
      setFoundWords([]);
      setSelectedIndices([]);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (e) {
      console.error("Puzzle Generation Error:", e);
    }
  }, [level, cityId]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleTouch = (x: number, y: number) => {
    if (!puzzle) return;
    letterPositions.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      // 50 birimlik çok hassas ve geniş algılama alanı
      if (dist < 50 && !selectedIndices.includes(index)) {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedIndices(prev => [...prev, index]);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY);
        setCurrentTouchPos({ x: locationX, y: locationY });
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouch(locationX, locationY);
        setCurrentTouchPos({ x: locationX, y: locationY });
      },
      onPanResponderRelease: () => {
        if (puzzle && selectedIndices.length > 0) {
          const attempt = selectedIndices.map(i => puzzle.letters[i]).join("");
          try {
            // Çökme Koruması: checkWord'e gitmeden önce her şeyin varlığını kontrol et
            const result = checkWord(puzzle, attempt);
            if (result === "target" && !foundWords.includes(attempt)) {
              if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setFoundWords(prev => [...prev, attempt]);
              setScore(prev => prev + attempt.length * 10);
            } else {
              if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              shake();
            }
          } catch (e) {
            console.error("CheckWord Exception:", e);
          }
        }
        setSelectedIndices([]);
        setCurrentTouchPos(null);
      },
    })
  ).current;

  if (!puzzle) return null;

  const renderPath = () => {
    if (selectedIndices.length === 0) return null;
    let d = "";
    selectedIndices.forEach((idx, i) => {
      const pos = letterPositions[idx];
      if (i === 0) d += `M ${pos.x} ${pos.y}`;
      else d += ` L ${pos.x} ${pos.y}`;
    });

    return (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={d}
          stroke="#FF00FF"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {currentTouchPos && selectedIndices.length > 0 && (
          <Line
            x1={letterPositions[selectedIndices[selectedIndices.length - 1]].x}
            y1={letterPositions[selectedIndices[selectedIndices.length - 1]].y}
            x2={currentTouchPos.x}
            y2={currentTouchPos.y}
            stroke="#FF00FF"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.6"
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
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Kelime Kutucukları */}
        <ScrollView contentContainerStyle={styles.wordsContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.wordsGrid, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
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

        {/* Harf Çemberi */}
        <View style={styles.circleContainer}>
          <View style={styles.circle} {...panResponder.panHandlers} ref={circleRef}>
            {renderPath()}
            {puzzle.letters.map((letter, index) => {
              const pos = letterPositions[index];
              const isSelected = selectedIndices.includes(index);
              return (
                <View
                  key={index}
                  pointerEvents="none"
                  style={[
                    styles.letterCircle,
                    {
                      left: pos.x - LETTER_SIZE / 2,
                      top: pos.y - LETTER_SIZE / 2,
                      backgroundColor: isSelected ? "#FF00FF" : "rgba(255,255,255,0.98)",
                      transform: [{ scale: isSelected ? 1.15 : 1 }],
                      borderColor: isSelected ? "#FFFFFF" : "rgba(15, 30, 82, 0.1)",
                      borderWidth: isSelected ? 3 : 0,
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
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/lima")}>
            <Text style={{ fontSize: 26 }}>🦂</Text>
            <Text style={styles.actionBtnLabel}>AKREP ZEKA</Text>
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
  levelText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", letterSpacing: 3, textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 10 },
  
  wordsContainer: { paddingVertical: 20, alignItems: "center" },
  wordsGrid: { gap: 14 },
  wordRow: { flexDirection: "row", gap: 8, justifyContent: "center" },
  letterBox: {
    width: 46, height: 46,
    backgroundColor: "rgba(15, 30, 82, 0.45)",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterBoxFound: { backgroundColor: "#FFFFFF", borderColor: "#FFFFFF", elevation: 8, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 5 },
  letterBoxText: { color: "#0F1E52", fontSize: 28, fontWeight: "900" },

  currentWordContainer: { height: 70, justifyContent: "center", alignItems: "center" },
  currentWordText: { color: "#FFFFFF", fontSize: 40, fontWeight: "900", letterSpacing: 6, textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 15 },

  circleContainer: { height: CIRCLE_SIZE + 30, justifyContent: "center", alignItems: "center" },
  circle: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  letterCircle: {
    position: "absolute",
    width: LETTER_SIZE, height: LETTER_SIZE,
    borderRadius: LETTER_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  letterText: { fontSize: 30, fontWeight: "900" },

  footerActions: { alignItems: "center", paddingBottom: 50 },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 30, 82, 0.85)",
    paddingHorizontal: 25, paddingVertical: 14,
    borderRadius: 35, alignItems: "center",
    borderWidth: 2, borderColor: "#FF00FF",
    shadowColor: "#FF00FF", shadowOpacity: 0.5, shadowRadius: 15, elevation: 12,
  },
  actionBtnLabel: { color: "#FFFFFF", fontWeight: "900", fontSize: 16, marginLeft: 12, letterSpacing: 2 }
});
