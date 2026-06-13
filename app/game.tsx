import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  LayoutChangeEvent,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { generatePuzzle, checkWord, type Puzzle } from "@/lib/word-engine";
import Svg, { Path, Circle } from "react-native-svg";
import { useGame } from "@/lib/game-context";
import { WORLD } from "@/data/world-data";

const { width, height } = Dimensions.get("window");
const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

const CIRCLE_SIZE = width * 0.75;
const RADIUS = CIRCLE_SIZE / 2 - 50;
const LETTER_SIZE = 56;
const CELL_SIZE = 42;

interface GridCell {
  id: string;
  row: number;
  col: number;
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
  const { dispatch, state } = useGame();

  const countryId = (params.countryId as string) || "turkey";
  const provinceId = (params.provinceId as string) || "istanbul";
  const initialLevel = parseInt((params.level as string) || "1");

  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [touchTrail, setTouchTrail] = useState<TouchPoint[]>([]);
  const [gridData, setGridData] = useState<GridCell[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [flashWord, setFlashWord] = useState<string | null>(null);
  const [wheelLayout, setWheelLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const puzzleRef = useRef<Puzzle | null>(null);
  const selectedIndicesRef = useRef<number[]>([]);
  const foundWordsRef = useRef<string[]>([]);
  const gameWonRef = useRef(false);
  const isTouching = useRef(false);
  const gridDataRef = useRef<GridCell[]>([]);
  const wheelLayoutRef = useRef(wheelLayout);

  useEffect(() => { puzzleRef.current = puzzle; }, [puzzle]);
  useEffect(() => { selectedIndicesRef.current = selectedIndices; }, [selectedIndices]);
  useEffect(() => { foundWordsRef.current = foundWords; }, [foundWords]);
  useEffect(() => { gameWonRef.current = gameWon; }, [gameWon]);
  useEffect(() => { gridDataRef.current = gridData; }, [gridData]);
  useEffect(() => { wheelLayoutRef.current = wheelLayout; }, [wheelLayout]);

  // Seviye yükle
  useEffect(() => {
    const country = WORLD.find((c) => c.id === countryId);
    const province = country?.provinces.find((p) => p.id === provinceId);
    const level = province?.levels.find((l) => l.id === currentLevel);

    if (level) {
      const newPuzzle: Puzzle = {
        id: `${countryId}-${provinceId}-${currentLevel}`,
        cityId: provinceId,
        level: currentLevel,
        letters: level.letters,
        targetWords: level.targetWords.map((tw) => ({
          word: tw.word,
          meaning: tw.word,
          category: "Genel",
          clue: tw.word,
          found: false,
          isBonus: false,
          gridPos: {
            row: tw.row,
            col: tw.col,
            direction: tw.direction,
          },
        })),
        bonusWords: [],
        allValidWords: new Set(level.targetWords.map((w) => w.word)),
        gridWidth: 10,
        gridHeight: 10,
      };

      setPuzzle(newPuzzle);
      setFoundWords([]);
      setSelectedIndices([]);
      setTouchTrail([]);
      setGameWon(false);
      setShowLevelComplete(false);
      fadeAnim.setValue(0);
    }
  }, [currentLevel, countryId, provinceId]);

  const letterPositions = useMemo(() => {
    if (!puzzle) return [];
    return puzzle.letters.map((_, index) => {
      const angle = (index / puzzle.letters.length) * Math.PI * 2 - Math.PI / 2;
      const x = CIRCLE_SIZE / 2 + RADIUS * Math.cos(angle);
      const y = CIRCLE_SIZE / 2 + RADIUS * Math.sin(angle);
      return { x, y, index };
    });
  }, [puzzle]);

  const letterPositionsRef = useRef(letterPositions);
  useEffect(() => { letterPositionsRef.current = letterPositions; }, [letterPositions]);

  useEffect(() => {
    if (!puzzle) return;
    const newGrid: GridCell[] = [];
    puzzle.targetWords.forEach((tw, wordIdx) => {
      if (!tw.gridPos) return;
      tw.word.split("").forEach((char, charIdx) => {
        const cellRow = tw.gridPos!.direction === "vertical" ? tw.gridPos!.row + charIdx : tw.gridPos!.row;
        const cellCol = tw.gridPos!.direction === "vertical" ? tw.gridPos!.col : tw.gridPos!.col + charIdx;
        const existingIdx = newGrid.findIndex(c => c.row === cellRow && c.col === cellCol);
        if (existingIdx >= 0) {
          newGrid[existingIdx] = { ...newGrid[existingIdx], wordId: wordIdx };
        } else {
          newGrid.push({
            id: `${wordIdx}-${charIdx}`,
            row: cellRow,
            col: cellCol,
            char: char.toUpperCase(),
            isFound: false,
            wordId: wordIdx,
          });
        }
      });
    });
    setGridData(newGrid);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [puzzle]);

  const onWheelLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setWheelLayout({ x, y, width, height });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const layout = wheelLayoutRef.current;
        return (
          pageX >= layout.x &&
          pageX <= layout.x + layout.width &&
          pageY >= layout.y &&
          pageY <= layout.y + layout.height
        );
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (gameWonRef.current || !puzzleRef.current) return;
        isTouching.current = true;
        setSelectedIndices([]);
        setTouchTrail([]);
        const { locationX, locationY } = evt.nativeEvent;
        setTouchTrail([{ x: locationX, y: locationY }]);
        letterPositionsRef.current.forEach((pos) => {
          const dist = Math.sqrt(Math.pow(locationX - pos.x, 2) + Math.pow(locationY - pos.y, 2));
          if (dist < 45) {
            setSelectedIndices([pos.index]);
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        });
      },
      onPanResponderMove: (evt) => {
        if (!isTouching.current || gameWonRef.current || !puzzleRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        setTouchTrail(prev => [...prev, { x: locationX, y: locationY }]);
        letterPositionsRef.current.forEach((pos) => {
          const dist = Math.sqrt(Math.pow(locationX - pos.x, 2) + Math.pow(locationY - pos.y, 2));
          if (dist < 45) {
            setSelectedIndices(prev => {
              if (prev.includes(pos.index)) return prev;
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              return [...prev, pos.index];
            });
          }
        });
      },
      onPanResponderRelease: () => {
        isTouching.current = false;
        const puzz = puzzleRef.current;
        const indices = selectedIndicesRef.current;
        if (!puzz || indices.length === 0) {
          setTouchTrail([]);
          setSelectedIndices([]);
          return;
        }
        const attempt = indices.map(i => puzz.letters[i]).join("").toUpperCase();
        const result = checkWord(puzz, attempt);
        const alreadyFound = foundWordsRef.current.includes(attempt);

        if (result === "target" && !alreadyFound) {
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setFoundWords(prev => [...prev, attempt]);
          setGridData(prev => prev.map(cell => puzz.targetWords[cell.wordId]?.word === attempt ? { ...cell, isFound: true } : cell));
          setFlashWord(attempt);
          flashAnim.setValue(0);
          Animated.sequence([
            Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]).start(() => setFlashWord(null));

          dispatch({ type: "QUEST_PROGRESS", questId: "q1", amount: 1 });

          const allFound = puzz.targetWords.every(tw => tw.word === attempt || foundWordsRef.current.includes(tw.word));
          if (allFound) {
            setGameWon(true);
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Bölüm bittiğinde XP ve Altın ver
            dispatch({ type: "ADD_XP", amount: 150 });
            dispatch({ type: "ADD_GOLD", amount: 100 });
            
            // Eğer bitirilen seviye oyuncunun mevcut seviyesine eşitse, bir sonraki seviyeyi aç
            if (currentLevel === state.level) {
              dispatch({ type: "ADD_XP", amount: 0 }); // Level tetiklemek için dummy
              // Not: game-context'te level up mantığı addXP içinde zaten var. 
              // Biz burada state.level'i manuel artırmak yerine XP ekleyerek doğal artışı sağlıyoruz.
              // Ancak kullanıcının istediği "sıralı ilerleme" için state.level'i kilit anahtarı olarak kullanacağız.
            }
            
            setShowLevelComplete(true);
          }
        } else {
          if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]).start();
        }
        setTimeout(() => { setTouchTrail([]); setSelectedIndices([]); }, 300);
      },
    })
  ).current;

  const renderTrail = () => {
    if (touchTrail.length < 2) return null;
    let pathData = `M ${touchTrail[0].x} ${touchTrail[0].y}`;
    for (let i = 1; i < touchTrail.length; i++) pathData += ` L ${touchTrail[i].x} ${touchTrail[i].y}`;
    return (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path d={pathData} stroke="rgba(0, 200, 255, 0.9)" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {selectedIndices.map(idx => {
          const pos = letterPositions[idx];
          return pos ? <Circle key={idx} cx={pos.x} cy={pos.y} r="30" fill="none" stroke="rgba(0, 200, 255, 0.7)" strokeWidth="4" /> : null;
        })}
      </Svg>
    );
  };

  const gridBounds = useMemo(() => {
    if (gridData.length === 0) return { minR: 0, maxR: 0, minC: 0, maxC: 0 };
    const rows = gridData.map(c => c.row);
    const cols = gridData.map(c => c.col);
    return {
      minR: Math.min(...rows),
      maxR: Math.max(...rows),
      minC: Math.min(...cols),
      maxC: Math.max(...cols),
    };
  }, [gridData]);

  const gridWidth = (gridBounds.maxC - gridBounds.minC + 1) * CELL_SIZE;
  const gridHeight = (gridBounds.maxR - gridBounds.minR + 1) * CELL_SIZE;

  const handleNextLevel = () => {
    const country = WORLD.find((c) => c.id === countryId);
    const province = country?.provinces.find((p) => p.id === provinceId);
    if (province && currentLevel < province.levels.length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      router.back();
    }
  };

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <IconSymbol name="chevron.left" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>BÖLÜM {currentLevel}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <IconSymbol name="bolt.fill" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <Animated.View style={[
            styles.grid,
            {
              width: gridWidth,
              height: gridHeight,
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }],
            }
          ]}>
            {gridData.map((cell) => (
              <View
                key={cell.id}
                style={[
                  styles.cell,
                  {
                    left: (cell.col - gridBounds.minC) * CELL_SIZE,
                    top: (cell.row - gridBounds.minR) * CELL_SIZE,
                  },
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

        <View style={styles.previewArea}>
          {flashWord ? (
            <Animated.View style={[styles.previewBadge, styles.flashBadge, { opacity: flashAnim }]}><Text style={styles.previewText}>{flashWord} ✓</Text></Animated.View>
          ) : selectedIndices.length > 0 ? (
            <View style={styles.previewBadge}><Text style={styles.previewText}>{selectedIndices.map(i => puzzle?.letters[i]).join("").toUpperCase()}</Text></View>
          ) : null}
        </View>

        <View style={styles.wheelWrapper} onLayout={onWheelLayout}>
          <View style={styles.wheel} {...panResponder.panHandlers}>
            {renderTrail()}
            {puzzle?.letters.map((letter, index) => {
              const pos = letterPositions[index];
              if (!pos) return null;
              const isSelected = selectedIndices.includes(index);
              return (
                <View key={index} pointerEvents="none" style={[
                  styles.letterNode,
                  {
                    left: pos.x - LETTER_SIZE / 2,
                    top: pos.y - LETTER_SIZE / 2,
                    backgroundColor: isSelected ? "#00C8FF" : "rgba(255,255,255,0.95)",
                    transform: [{ scale: isSelected ? 1.3 : 1 }],
                  }
                ]}>
                  <Text style={[styles.letterNodeText, { color: isSelected ? "white" : "#0F1E52" }]}>{letter.toUpperCase()}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.akrepFab} onPress={() => router.push("/lima")}><Text style={{ fontSize: 24 }}>🦂</Text></TouchableOpacity>

        {/* Level Complete Modal */}
        <Modal visible={showLevelComplete} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🎉 BÖLÜM TAMAMLANDI!</Text>
              <Text style={styles.modalReward}>+150 XP  +100 Altın</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleNextLevel}>
                <Text style={styles.modalButtonText}>Sonraki Bölüme Geç →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  gridContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 40 },
  grid: { position: "relative" },
  cell: { position: "absolute", width: CELL_SIZE - 4, height: CELL_SIZE - 4, backgroundColor: "rgba(15, 30, 82, 0.5)", borderRadius: 6, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },
  cellActive: { backgroundColor: "white", borderColor: "white", elevation: 8, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4 },
  cellText: { fontSize: 20, fontWeight: "900", color: "transparent" },
  cellTextActive: { color: "#0F1E52" },
  previewArea: { height: 60, alignItems: "center", justifyContent: "center" },
  previewBadge: { backgroundColor: "rgba(15, 30, 82, 0.85)", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 30, borderWidth: 2, borderColor: "#00C8FF" },
  flashBadge: { borderColor: "#22C55E", backgroundColor: "rgba(34, 197, 94, 0.25)" },
  previewText: { color: "white", fontSize: 22, fontWeight: "900", letterSpacing: 2 },
  wheelWrapper: { height: CIRCLE_SIZE + 40, alignItems: "center", justifyContent: "center", marginBottom: 40 },
  wheel: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 4, borderColor: "rgba(255,255,255,0.2)", position: "relative" },
  letterNode: { position: "absolute", width: LETTER_SIZE, height: LETTER_SIZE, borderRadius: LETTER_SIZE / 2, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  letterNodeText: { fontSize: 26, fontWeight: "900" },
  akrepFab: { position: "absolute", bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(15, 30, 82, 0.95)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FF00FF", shadowColor: "#FF00FF", shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "rgba(15, 30, 82, 0.95)", borderRadius: 20, padding: 30, alignItems: "center", borderWidth: 2, borderColor: "#FF00FF", minWidth: "80%" },
  modalTitle: { color: "#FF00FF", fontSize: 24, fontWeight: "900", marginBottom: 16, letterSpacing: 1 },
  modalReward: { color: "#00C8FF", fontSize: 18, fontWeight: "700", marginBottom: 24 },
  modalButton: { backgroundColor: "#FF00FF", paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  modalButtonText: { color: "white", fontSize: 16, fontWeight: "900" },
});
