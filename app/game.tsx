import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Animated, Platform, ScrollView, Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGame } from "@/lib/game-context";
import { generatePuzzle, checkWord, getLimaResponse, type Puzzle, type PuzzleWord } from "@/lib/word-engine";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const CIRCLE_RADIUS = Math.min(width * 0.35, 140);
const LETTER_CIRCLE_SIZE = 56;

// ─── Harf Çemberi (Yeni Tasarım) ──────────────────────────────────────────
interface LetterNode {
  index: number;
  letter: string;
  angle: number;
  x: number;
  y: number;
  selected: boolean;
}

function LetterCircleNew({
  letters,
  selected,
  onSelect,
  onClear,
  cityName,
}: {
  letters: string[];
  selected: number[];
  onSelect: (i: number) => void;
  onClear: () => void;
  cityName: string;
}) {
  const count = letters.length;
  const centerX = width / 2;
  const centerY = CIRCLE_RADIUS + 80;

  const nodes: LetterNode[] = letters.map((letter, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + CIRCLE_RADIUS * Math.cos(angle);
    const y = centerY + CIRCLE_RADIUS * Math.sin(angle);
    return {
      index: i,
      letter,
      angle,
      x,
      y,
      selected: selected.includes(i),
    };
  });

  return (
    <View style={styles.circleContainer}>
      {/* Daire arka planı */}
      <View style={[styles.circleBg, { left: centerX - CIRCLE_RADIUS - 20, top: centerY - CIRCLE_RADIUS - 20 }]} />

      {/* Şehir adı (merkez) */}
      <View style={[styles.cityNameBadge, { left: centerX - 50, top: centerY - 20 }]}>
        <Text style={styles.cityNameText}>{cityName.toUpperCase()}</Text>
      </View>

      {/* Seçili harfler sayısı badge */}
      {selected.length > 0 && (
        <View style={[styles.countBadge, { right: 20, top: centerY - CIRCLE_RADIUS - 10 }]}>
          <Text style={styles.countText}>{selected.length}</Text>
        </View>
      )}

      {/* Harf düğümleri */}
      {nodes.map(node => (
        <TouchableOpacity
          key={node.index}
          style={[
            styles.letterNode,
            {
              left: node.x - LETTER_CIRCLE_SIZE / 2,
              top: node.y - LETTER_CIRCLE_SIZE / 2,
              width: LETTER_CIRCLE_SIZE,
              height: LETTER_CIRCLE_SIZE,
              borderRadius: LETTER_CIRCLE_SIZE / 2,
              backgroundColor: node.selected ? "#5A2EFF" : "#1E2F6E",
              borderColor: node.selected ? "#7B5FFF" : "#334155",
            },
          ]}
          onPress={() => onSelect(node.index)}
          activeOpacity={0.8}
        >
          <Text style={[styles.letterNodeText, node.selected && { color: "#FFFFFF" }]}>
            {node.letter}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Temizle butonu (merkez) */}
      <TouchableOpacity
        style={[styles.clearBtn, { left: centerX - 26, top: centerY - 26 }]}
        onPress={onClear}
        activeOpacity={0.8}
      >
        <IconSymbol name="xmark" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Crossword Grid ───────────────────────────────────────────────────────
function CrosswordGrid({ words }: { words: PuzzleWord[] }) {
  return (
    <View style={styles.gridContainer}>
      {words.map((w, wi) => (
        <View key={wi} style={styles.wordRow}>
          {w.word.split("").map((ch, ci) => (
            <View key={ci} style={[styles.gridCell, w.found && styles.gridCellFound]}>
              <Text style={[styles.gridCellText, w.found && styles.gridCellTextFound]}>
                {w.found ? ch : ""}
              </Text>
            </View>
          ))}
          {w.found && (
            <Text style={styles.wordMeaning} numberOfLines={1}>
              {" — " + w.meaning.slice(0, 25)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Ana Oyun Ekranı ──────────────────────────────────────────────────────
export default function GameScreen() {
  const router = useRouter();
  const { cityId = "istanbul", level = "1" } = useLocalSearchParams<{ cityId: string; level: string }>();
  const { state, dispatch } = useGame();

  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle(cityId, parseInt(level)));
  const [selected, setSelected] = useState<number[]>([]);
  const [limaMsg, setLimaMsg] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const currentWord = selected.map(i => puzzle.letters[i]).join("");
  const foundCount = puzzle.targetWords.filter(w => w.found).length;
  const totalCount = puzzle.targetWords.length;
  const progress = totalCount > 0 ? foundCount / totalCount : 0;

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = useCallback((idx: number) => {
    if (selected.includes(idx)) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => [...prev, idx]);
  }, [selected]);

  const handleClear = useCallback(() => {
    setSelected([]);
    setLimaMsg("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected.length < 2) return;
    const word = selected.map(i => puzzle.letters[i]).join("");
    const result = checkWord(puzzle, word);

    if (result === "target") {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const xpGain = word.length * 10;
      const goldGain = word.length * 5;
      dispatch({ type: "ADD_XP", amount: xpGain });
      dispatch({ type: "ADD_GOLD", amount: goldGain });
      dispatch({ type: "COMBO_INC" });
      setLimaMsg(`✓ Doğru! "${word}" — ${getLimaResponse(word).slice(0, 40)}`);
      setPuzzle(prev => ({
        ...prev,
        targetWords: prev.targetWords.map(w => w.word === word ? { ...w, found: true } : w),
      }));
      setSelected([]);

      const remaining = puzzle.targetWords.filter(w => w.word !== word && !w.found).length;
      if (remaining === 0) {
        setTimeout(() => {
          dispatch({ type: "COMPLETE_CITY", cityId, stars: 3 });
          Alert.alert("🎉 Tebrikler!", `${cityId.toUpperCase()} bölümünü tamamladın!\n+${xpGain} XP  +${goldGain} Altın`, [
            { text: "Devam Et", onPress: () => router.back() },
          ]);
        }, 500);
      }
    } else if (result === "bonus") {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: "ADD_GOLD", amount: 15 });
      dispatch({ type: "COMBO_INC" });
      setLimaMsg(`💰 Gizli kelime: ${word}! +15 Altın`);
      setPuzzle(prev => ({
        ...prev,
        bonusWords: prev.bonusWords.map(w => w.word === word ? { ...w, found: true } : w),
      }));
      setSelected([]);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      doShake();
      dispatch({ type: "COMBO_RESET" });
      setLimaMsg(`✗ "${word}" geçerli bir kelime değil.`);
      setSelected([]);
    }
  }, [selected, puzzle, cityId, dispatch, router]);

  return (
    <ScreenContainer containerClassName="bg-gradient-to-b from-blue-600 to-blue-900" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="arrow.left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>{cityId.charAt(0).toUpperCase() + cityId.slice(1)}</Text>
            <Text style={styles.headerSub}>Seviye {level}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statText}>🪙 {state.gold}</Text>
            <Text style={styles.statText}>⚡ {state.energy}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>{foundCount}/{totalCount} kelime</Text>

        {/* Crossword Grid */}
        <CrosswordGrid words={puzzle.targetWords} />

        {/* Lima Message */}
        {limaMsg !== "" && (
          <View style={styles.limaBox}>
            <Text style={styles.limaEmoji}>🦂</Text>
            <Text style={styles.limaText} numberOfLines={2}>{limaMsg}</Text>
          </View>
        )}

        {/* Current Word Preview */}
        <View style={styles.wordPreview}>
          <Text style={styles.wordPreviewText}>{currentWord || "Harf seç…"}</Text>
        </View>

        {/* Letter Circle */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <LetterCircleNew
            letters={puzzle.letters}
            selected={selected}
            onSelect={handleSelect}
            onClear={handleClear}
            cityName={cityId}
          />
        </Animated.View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, selected.length < 2 && { opacity: 0.4 }]}
          onPress={handleSubmit}
          disabled={selected.length < 2}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>✓ ONAYLA</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  headerSub: { color: "#8899BB", fontSize: 12 },
  statRow: { flexDirection: "row", gap: 12 },
  statText: { color: "#FFD700", fontWeight: "700", fontSize: 13 },
  progressBar: { height: 4, backgroundColor: "#1E2F6E", marginHorizontal: 0 },
  progressFill: { height: "100%", backgroundColor: "#5A2EFF" },
  progressLabel: { color: "#8899BB", fontSize: 11, textAlign: "center", marginTop: 4, marginBottom: 8 },
  gridContainer: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  wordRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 3 },
  gridCell: {
    width: 32, height: 36, borderBottomWidth: 2, borderBottomColor: "#5A2EFF",
    alignItems: "center", justifyContent: "flex-end", paddingBottom: 2,
  },
  gridCellFound: { borderBottomColor: "#22C55E", backgroundColor: "#22C55E11", borderRadius: 4 },
  gridCellText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  gridCellTextFound: { color: "#22C55E" },
  wordMeaning: { color: "#8899BB", fontSize: 10, flex: 1, marginLeft: 4 },
  limaBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: "#0F1E5244", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "#5A2EFF44",
  },
  limaEmoji: { fontSize: 20 },
  limaText: { flex: 1, color: "#FFFFFF", fontSize: 12, lineHeight: 16 },
  wordPreview: {
    alignItems: "center", marginVertical: 12,
    minHeight: 32,
  },
  wordPreviewText: { color: "#FFD700", fontSize: 20, fontWeight: "800", letterSpacing: 3 },
  circleContainer: {
    width: width - 40,
    height: CIRCLE_RADIUS * 2 + 160,
    alignSelf: "center",
    marginVertical: 12,
    position: "relative",
  },
  circleBg: {
    position: "absolute",
    width: CIRCLE_RADIUS * 2 + 40,
    height: CIRCLE_RADIUS * 2 + 40,
    borderRadius: CIRCLE_RADIUS + 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cityNameBadge: {
    position: "absolute",
    backgroundColor: "#0F1E52",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#5A2EFF",
  },
  cityNameText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  countBadge: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E2F6E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5A2EFF",
  },
  countText: { color: "#5A2EFF", fontWeight: "800", fontSize: 16 },
  letterNode: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#5A2EFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  letterNodeText: { color: "#8899BB", fontWeight: "800", fontSize: 18 },
  clearBtn: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E2F6E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5A2EFF44",
  },
  submitBtn: {
    marginHorizontal: 40, marginTop: 16, marginBottom: 20,
    backgroundColor: "#5A2EFF", borderRadius: 30, paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
  },
  submitText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 2 },
});
