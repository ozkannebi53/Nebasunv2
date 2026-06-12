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
import Svg, { Path, Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const BACKGROUND_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

// Referans fotoğraflara göre boyutlar
const CIRCLE_SIZE = width * 0.75; // Çember genişliği
const RADIUS = CIRCLE_SIZE * 0.38; // Harflerin dizileceği yarıçap
const LETTER_SIZE = 54; // Harf dairesi boyutu

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
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Çemberin ekran üzerindeki konumunu ölçmek için ref
  const circleRef = useRef<View>(null);
  const [circleLayout, setCircleLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

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

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleTouch = (x: number, y: number) => {
    letterPositions.forEach((pos, index) => {
      // Dokunmatik hassasiyetini artırmak için mesafeyi 35'e çıkardım
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < 35 && !selectedIndices.includes(index)) {
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
        const attempt = selectedIndices.map(i => puzzle!.letters[i]).join("");
        const result = checkWord(puzzle!, attempt);

        if (result === "target" && !foundWords.includes(attempt)) {
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setFoundWords(prev => [...prev, attempt]);
          setScore(prev => prev + attempt.length * 10);
        } else if (selectedIndices.length > 0) {
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          shake();
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
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        {currentTouchPos && selectedIndices.length > 0 && (
          <Line
            x1={letterPositions[selectedIndices[selectedIndices.length - 1]].x}
            y1={letterPositions[selectedIndices[selectedIndices.length - 1]].y}
            x2={currentTouchPos.x}
            y2={currentTouchPos.y}
            stroke="#FF00FF"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.5"
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

        {/* Harf Çemberi */}
        <View style={styles.circleContainer}>
          <View 
            style={styles.circle} 
            {...panResponder.panHandlers}
            onLayout={(e) => setCircleLayout(e.nativeEvent.layout)}
          >
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
                      backgroundColor: isSelected ? "#FF00FF" : "rgba(255,255,255,0.95)",
                      transform: [{ scale: isSelected ? 1.2 : 1 }],
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
    width: 42, height: 42,
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

  circleContainer: { height: CIRCLE_SIZE + 40, justifyContent: "center", alignItems: "center" },
  circle: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  letterCircle: {
    position: "absolute",
    width: LETTER_SIZE, height: LETTER_SIZE,
    borderRadius: LETTER_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  letterText: { fontSize: 26, fontWeight: "900" },

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
