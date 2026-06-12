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
  LayoutAnimation,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";
import Svg, { Path, Circle } from "react-native-svg";
import { useGame } from "@/lib/game-context";

const { width, height } = Dimensions.get("window");
const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

const CIRCLE_SIZE = width * 0.75;
const RADIUS = (CIRCLE_SIZE / 2) - 50;
const LETTER_SIZE = 56;
const GRID_SIZE = 44;
const WHEEL_OFFSET_Y = height * 0.65;

interface GridCell {
  id: string;
  x: number;
  y: number;
  char: string;
  isFound: boolean;
  wordId: number;
}

interface TouchPoint {
  x: number;
  y: number;
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
  const [touchTrail, setTouchTrail] = useState<TouchPoint[]>([]);
  const [gridData, setGridData] = useState<GridCell[]>([]);
  const [gameWon, setGameWon] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const wheelRef = useRef<View>(null);
  const isTouching = useRef(false);

  const letterPositions = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.letters.map((_, index) => {
      const angle = (index / puzzle.letters.length) * Math.PI * 2 - Math.PI / 2;
      const x = CIRCLE_SIZE / 2 + RADIUS * Math.cos(angle);
      const y = CIRCLE_SIZE / 2 + RADIUS * Math.sin(angle);
      return { x, y, index };
    });
  }, [puzzle]);

  // Initialize grid
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
          wordId: wordIdx,
        });
      });
      startY += GRID_SIZE + 15;
    });

    setGridData(newGrid);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [puzzle]);

  // Load puzzle
  useEffect(() => {
    const newPuzzle = generatePuzzle(cityId, level);
    setPuzzle(newPuzzle);
    setFoundWords([]);
    setSelectedIndices([]);
    setTouchTrail([]);
    setGameWon(false);
    fadeAnim.setValue(0);
  }, [level, cityId]);

  // PanResponder for touch tracking
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (gameWon || !puzzle) return;
        isTouching.current = true;
        setSelectedIndices([]);
        setTouchTrail([]);

        const { locationX, locationY } = evt.nativeEvent;
        checkLetterAtPosition(locationX, locationY, true);
      },
      onPanResponderMove: (evt) => {
        if (!isTouching.current || gameWon || !puzzle) return;

        const { locationX, locationY } = evt.nativeEvent;

        // Add to trail
        setTouchTrail((prev) => [...prev, { x: locationX, y: locationY }]);

        // Check if touching any letter
        checkLetterAtPosition(locationX, locationY, false);
      },
      onPanResponderRelease: () => {
        isTouching.current = false;

        if (!puzzle || selectedIndices.length === 0) {
          setTouchTrail([]);
          setSelectedIndices([]);
          return;
        }

        const attempt = selectedIndices.map((i) => puzzle.letters[i]).join("").toUpperCase();
        const result = checkWord(puzzle, attempt);

        if (result === "target" && !foundWords.includes(attempt)) {
          onTargetFound(attempt);
        } else if (result === "bonus" && !foundWords.includes(attempt)) {
          onBonusFound(attempt);
        } else {
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          shake();
        }

        setTimeout(() => {
          setTouchTrail([]);
          setSelectedIndices([]);
        }, 300);
      },
    })
  ).current;

  const checkLetterAtPosition = (x: number, y: number, isStart: boolean) => {
    if (!puzzle) return;

    letterPositions.forEach((pos) => {
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));

      if (dist < 45) {
        setSelectedIndices((prev) => {
          // Prevent adding same letter twice in a row
          if (prev.length > 0 && prev[prev.length - 1] === pos.index) {
            return prev;
          }

          // Prevent going back to previous letter
          if (prev.length > 1 && prev[prev.length - 2] === pos.index) {
            return prev;
          }

          if (!prev.includes(pos.index)) {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            return [...prev, pos.index];
          }
          return prev;
        });
      }
    });
  };

  const onTargetFound = (word: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setFoundWords((prev) => [...prev, word]);
    dispatch({ type: "QUEST_PROGRESS", questId: "q1", amount: 1 });

    // Mark grid cells
    setGridData((prev) =>
      prev.map((cell) =>
        puzzle?.targetWords[cell.wordId].word === word
          ? { ...cell, isFound: true }
          : cell
      )
    );

    // Check if level complete
    const allFound = puzzle?.targetWords.every(
      (tw) => tw.word === word || foundWords.includes(tw.word)
    );

    if (allFound) {
      setGameWon(true);
      setTimeout(() => {
        dispatch({ type: "ADD_XP", amount: 150 });
        dispatch({ type: "ADD_GOLD", amount: 100 });
        dispatch({ type: "COMPLETE_CITY", cityId, stars: 3 });
        setLevel((prev) => prev + 1);
      }, 1200);
    }
  };

  const onBonusFound = (word: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setFoundWords((prev) => [...prev, word]);
    dispatch({ type: "ADD_GOLD", amount: 20 });
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const renderTrail = () => {
    if (touchTrail.length < 2) return null;

    let pathData = `M ${touchTrail[0].x} ${touchTrail[0].y}`;
    for (let i = 1; i < touchTrail.length; i++) {
      pathData += ` L ${touchTrail[i].x} ${touchTrail[i].y}`;
    }

    return (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={pathData}
          stroke="rgba(0, 200, 255, 0.9)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {selectedIndices.map((idx) => {
          const pos = letterPositions[idx];
          return (
            <Circle
              key={`circle-${idx}`}
              cx={pos.x}
              cy={pos.y}
              r="30"
              fill="none"
              stroke="rgba(0, 200, 255, 0.7)"
              strokeWidth="4"
            />
          );
        })}
      </Svg>
    );
  };

  if (!puzzle) return null;

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Header */}
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

        {/* Grid */}
        <View style={styles.gridArea}>
          <Animated.View style={[styles.grid, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
            {gridData.map((cell) => (
              <View
                key={cell.id}
                style={[
                  styles.cell,
                  { left: cell.x, top: cell.y },
                  cell.isFound && styles.cellActive,
                ]}
              >
                <Text style={[styles.cellText, cell.isFound && styles.cellTextActive]}>
                  {cell.isFound ? cell.char : ""}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Preview */}
        <View style={styles.previewArea}>
          {selectedIndices.length > 0 && (
            <View style={styles.previewBadge}>
              <Text style={styles.previewText}>
                {selectedIndices.map((i) => puzzle.letters[i]).join("").toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Wheel Container */}
        <View
          ref={wheelRef}
          style={styles.wheelContainer}
          {...panResponder.panHandlers}
        >
          <View style={styles.wheel}>
            {renderTrail()}

            {puzzle.letters.map((letter, index) => {
              const pos = letterPositions[index];
              const isSelected = selectedIndices.includes(index);

              return (
                <View
                  key={`letter-${index}`}
                  pointerEvents="none"
                  style={[
                    styles.letterNode,
                    {
                      left: pos.x - LETTER_SIZE / 2,
                      top: pos.y - LETTER_SIZE / 2,
                      backgroundColor: isSelected ? "#00C8FF" : "rgba(255,255,255,0.95)",
                      borderColor: isSelected ? "#00C8FF" : "rgba(255,255,255,0.3)",
                      borderWidth: 2,
                      transform: [{ scale: isSelected ? 1.35 : 1 }],
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

        {/* Akrep Zeka Button */}
        <TouchableOpacity style={styles.akrepFab} onPress={() => router.push("/lima")}>
          <Text style={{ fontSize: 28 }}>🦂</Text>
        </TouchableOpacity>
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
  iconBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  levelBadge: {
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  levelText: { color: "white", fontSize: 18, fontWeight: "900", letterSpacing: 1 },

  gridArea: { flex: 0.4, marginTop: 20 },
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

  previewArea: { height: 50, alignItems: "center", justifyContent: "center" },
  previewBadge: {
    backgroundColor: "rgba(15, 30, 82, 0.85)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#00C8FF",
  },
  previewText: { color: "white", fontSize: 28, fontWeight: "900", letterSpacing: 4 },

  wheelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wheel: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.15)",
    position: "relative",
  },
  letterNode: {
    position: "absolute",
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    borderRadius: LETTER_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  letterNodeText: { fontSize: 28, fontWeight: "900" },

  akrepFab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(15, 30, 82, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF00FF",
    shadowColor: "#FF00FF",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
});
