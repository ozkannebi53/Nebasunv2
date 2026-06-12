import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
  Animated,
  PanResponder,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";
import Svg, { Path, Line } from "react-native-svg";
import { useGame } from "@/lib/game-context";

const { width, height } = Dimensions.get("window");
const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

const CIRCLE_SIZE = width * 0.75;
const RADIUS = (CIRCLE_SIZE / 2) - 40;
const LETTER_SIZE = 56;
const GRID_SIZE = 44; 

interface GridCell {
  id: string;
  x: number;
  y: number;
  char: string;
  isFound: boolean;
  wordId: number;
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { dispatch } = useGame();
  
  const cityId = (params.cityId as string) || "istanbul";
  const initialLevel = parseInt((params.level as string) || "1");

  const [level, setLevel] = useState(initialLevel);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentTouchPos, setCurrentTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [gridData, setGridData] = useState<GridCell[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    if (!puzzle) return;
    
    const newGrid: GridCell[] = [];
    let startY = 40;
    
    puzzle.targetWords.forEach((tw, wordIdx) => {
      const wordLen = tw.word.length;
      const totalWidth = wordLen * (GRID_SIZE + 6);
      const startX = (width - totalWidth) / 2;
      
      tw.word.split("").forEach((char, charIdx) => {
        newGrid.push({
          id: `${wordIdx}-${charIdx}`,
          x: startX + charIdx * (GRID_SIZE + 6),
          y: startY,
          char: char.toUpperCase(),
          isFound: false,
          wordId: wordIdx
        });
      });
      startY += GRID_SIZE + 15;
    });
    
    setGridData(newGrid);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [puzzle]);

  useEffect(() => {
    const newPuzzle = generatePuzzle(cityId, level);
    setPuzzle(newPuzzle);
    setFoundWords([]);
    setSelectedIndices([]);
    fadeAnim.setValue(0);
  }, [level, cityId]);

  const handleTouch = (x: number, y: number) => {
    if (!puzzle) return;
    letterPositions.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < 35 && !selectedIndices.includes(index)) {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          const attempt = selectedIndices.map(i => puzzle.letters[i]).join("").toUpperCase();
          const result = checkWord(puzzle, attempt);
          
          if (result === "target" && !foundWords.includes(attempt)) {
            onTargetFound(attempt);
          } else if (result === "bonus" && !foundWords.includes(attempt)) {
            onBonusFound(attempt);
          } else {
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            shake();
          }
        }
        setSelectedIndices([]);
        setCurrentTouchPos(null);
      },
    })
  ).current;

  const onTargetFound = (word: string) => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFoundWords(prev => [...prev, word]);
    
    // Görev ilerlemesi
    dispatch({ type: "QUEST_PROGRESS", questId: "q1", amount: 1 });
    
    // Kelimeyi ızgarada aç
    setGridData(prev => prev.map(cell => 
      puzzle?.targetWords[cell.wordId].word === word ? { ...cell, isFound: true } : cell
    ));

    // Seviye bitiş kontrolü
    const allFound = puzzle?.targetWords.every(tw => tw.word === word || foundWords.includes(tw.word));
    if (allFound) {
      setTimeout(() => {
        dispatch({ type: "ADD_XP", amount: 150 });
        dispatch({ type: "ADD_GOLD", amount: 100 });
        dispatch({ type: "COMPLETE_CITY", cityId, stars: 3 });
        setLevel(prev => prev + 1);
      }, 1200);
    }
  };

  const onBonusFound = (word: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setFoundWords(prev => [...prev, word]);
    dispatch({ type: "ADD_GOLD", amount: 20 });
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

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
          strokeWidth="12"
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
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.4"
          />
        )}
      </Svg>
    );
  };

  if (!puzzle) return null;

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <IconSymbol name="chevron.left" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>BÖLÜM {level}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <IconSymbol name="bolt.fill" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Bulmaca Izgarası */}
        <View style={styles.gridArea}>
          <Animated.View style={[styles.grid, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
            {gridData.map((cell) => (
              <View 
                key={cell.id} 
                style={[
                  styles.cell, 
                  { left: cell.x, top: cell.y },
                  cell.isFound && styles.cellActive
                ]}
              >
                <Text style={[styles.cellText, cell.isFound && styles.cellTextActive]}>
                  {cell.isFound ? cell.char : ""}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Seçili Kelime Önizleme */}
        <View style={styles.previewArea}>
          {selectedIndices.length > 0 && (
            <View style={styles.previewBadge}>
              <Text style={styles.previewText}>
                {selectedIndices.map(i => puzzle.letters[i]).join("").toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Alt Panel: Harf Çemberi */}
        <View style={styles.bottomPanel}>
          <View style={styles.wheelWrapper}>
            <View style={styles.wheel} {...panResponder.panHandlers}>
              {renderPath()}
              {puzzle.letters.map((letter, index) => {
                const pos = letterPositions[index];
                const isSelected = selectedIndices.includes(index);
                return (
                  <View
                    key={index}
                    pointerEvents="none"
                    style={[
                      styles.letterNode,
                      {
                        left: pos.x - LETTER_SIZE / 2,
                        top: pos.y - LETTER_SIZE / 2,
                        backgroundColor: isSelected ? "#FF00FF" : "rgba(255,255,255,0.95)",
                        transform: [{ scale: isSelected ? 1.25 : 1 }],
                      },
                    ]}
                  >
                    <Text style={[styles.letterNodeText, { color: isSelected ? "white" : "#0F1E52" }]}>
                      {letter.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          
          {/* Akrep Zeka Butonu */}
          <TouchableOpacity style={styles.akrepFab} onPress={() => router.push("/lima")}>
            <Text style={{ fontSize: 28 }}>🦂</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  iconBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  levelBadge: { backgroundColor: "rgba(15, 30, 82, 0.6)", paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  levelText: { color: "white", fontSize: 18, fontWeight: "900", letterSpacing: 1 },
  
  gridArea: { flex: 1, marginTop: 20 },
  grid: { flex: 1, position: "relative" },
  cell: {
    position: "absolute",
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: "rgba(15, 30, 82, 0.5)",
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  cellActive: {
    backgroundColor: "white",
    borderColor: "white",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cellText: { fontSize: 26, fontWeight: "900", color: "transparent" },
  cellTextActive: { color: "#0F1E52" },
  
  previewArea: { height: 60, alignItems: "center", justifyContent: "center" },
  previewBadge: { backgroundColor: "rgba(15, 30, 82, 0.85)", paddingHorizontal: 25, paddingVertical: 10, borderRadius: 30, borderWidth: 2, borderColor: "#FF00FF" },
  previewText: { color: "white", fontSize: 32, fontWeight: "900", letterSpacing: 6 },
  
  bottomPanel: { height: CIRCLE_SIZE + 80, alignItems: "center", justifyContent: "center" },
  wheelWrapper: { width: CIRCLE_SIZE, height: CIRCLE_SIZE },
  wheel: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 4, borderColor: "rgba(255,255,255,0.15)",
  },
  letterNode: {
    position: "absolute",
    width: LETTER_SIZE, height: LETTER_SIZE,
    borderRadius: LETTER_SIZE / 2,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  letterNodeText: { fontSize: 28, fontWeight: "900" },
  
  akrepFab: {
    position: "absolute", bottom: 30, right: 30,
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "rgba(15, 30, 82, 0.95)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#FF00FF",
    shadowColor: "#FF00FF", shadowOpacity: 0.6, shadowRadius: 12, elevation: 12,
  }
});
