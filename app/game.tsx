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

const { width } = Dimensions.get("window");
const LETTER_SIZE = Math.min(52, (width - 80) / 7);

// ─── Letter Circle ────────────────────────────────────────────────────────────
function LetterCircle({
  letters, selected, onSelect, onClear,
}: {
  letters: string[];
  selected: number[];
  onSelect: (i: number) => void;
  onClear: () => void;
}) {
  const count = letters.length;
  const radius = (width - 120) / 2.4;
  const cx = (width - 80) / 2;
  const cy = radius + 10;

  return (
    <View style={{ width: width - 80, height: radius * 2 + 30, alignSelf: "center" }}>
      {letters.map((letter, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radius * Math.cos(angle) - LETTER_SIZE / 2;
        const y = cy + radius * Math.sin(angle) - LETTER_SIZE / 2;
        const isSelected = selected.includes(i);
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.letterBtn,
              { left: x, top: y, width: LETTER_SIZE, height: LETTER_SIZE, borderRadius: LETTER_SIZE / 2 },
              isSelected && styles.letterBtnSelected,
            ]}
            onPress={() => onSelect(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>{letter}</Text>
          </TouchableOpacity>
        );
      })}
      {/* Center clear button */}
      <TouchableOpacity
        style={[styles.clearBtn, { left: cx - 26, top: cy - 26 }]}
        onPress={onClear}
        activeOpacity={0.8}
      >
        <IconSymbol name="xmark" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Word Slots ───────────────────────────────────────────────────────────────
function WordSlots({ words }: { words: PuzzleWord[] }) {
  return (
    <View style={styles.slotsContainer}>
      {words.map((w, wi) => (
        <View key={wi} style={styles.wordRow}>
          {w.word.split("").map((ch, ci) => (
            <View key={ci} style={[styles.slot, w.found && styles.slotFound]}>
              <Text style={[styles.slotText, w.found && styles.slotTextFound]}>
                {w.found ? ch : ""}
              </Text>
            </View>
          ))}
          {w.found && (
            <Text style={styles.wordMeaning} numberOfLines={1}> — {w.meaning.slice(0, 30)}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Combo Banner ─────────────────────────────────────────────────────────────
function ComboBanner({ combo }: { combo: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (combo > 0) {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [combo]);

  if (combo < 2) return null;
  const label = combo >= 10 ? `🔥 ${combo}x COMBO — BÜYÜK PATLAMA!` :
                combo >= 5  ? `⚡ ${combo}x COMBO — ATEŞ HALKASI!` :
                              `✨ ${combo}x COMBO!`;
  const color = combo >= 10 ? "#FF4500" : combo >= 5 ? "#FF8A00" : "#5A2EFF";

  return (
    <Animated.View style={[styles.comboBanner, { backgroundColor: color + "CC", opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
      <Text style={styles.comboText}>{label}</Text>
    </Animated.View>
  );
}

// ─── Main Game Screen ─────────────────────────────────────────────────────────
export default function GameScreen() {
  const router = useRouter();
  const { cityId = "istanbul", level = "1" } = useLocalSearchParams<{ cityId: string; level: string }>();
  const { state, dispatch } = useGame();

  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle(cityId, parseInt(level)));
  const [selected, setSelected] = useState<number[]>([]);
  const [lastWord, setLastWord] = useState("");
  const [limaMsg, setLimaMsg] = useState("");
  const [shake, setShake] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const currentWord = selected.map(i => puzzle.letters[i]).join("");
  const foundCount = puzzle.targetWords.filter(w => w.found).length;
  const totalCount = puzzle.targetWords.length;
  const progress = totalCount > 0 ? foundCount / totalCount : 0;

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const doFlash = (color: string) => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const handleSelect = useCallback((idx: number) => {
    if (selected.includes(idx)) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => [...prev, idx]);
  }, [selected]);

  const handleClear = useCallback(() => {
    setSelected([]);
    setLastWord("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected.length < 2) return;
    const word = selected.map(i => puzzle.letters[i]).join("");
    const result = checkWord(puzzle, word);

    if (result === "target") {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      doFlash("#22C55E");
      const xpGain = word.length * 10;
      const goldGain = word.length * 5;
      dispatch({ type: "ADD_XP", amount: xpGain });
      dispatch({ type: "ADD_GOLD", amount: goldGain });
      dispatch({ type: "COMBO_INC" });
      const limaText = getLimaResponse(word);
      setLimaMsg(limaText);
      setPuzzle(prev => ({
        ...prev,
        targetWords: prev.targetWords.map(w => w.word === word ? { ...w, found: true } : w),
      }));
      setLastWord(word);
      setSelected([]);

      // Check completion
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
      doFlash("#FFD700");
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
      setLimaMsg(`"${word}" geçerli bir kelime değil.`);
      setSelected([]);
    }
  }, [selected, puzzle, cityId, dispatch, router]);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
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

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>
      <Text style={styles.progressLabel}>{foundCount}/{totalCount} kelime</Text>

      {/* Combo Banner */}
      <ComboBanner combo={state.combo} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Word Slots */}
        <WordSlots words={puzzle.targetWords} />

        {/* Lima Message */}
        {limaMsg !== "" && (
          <View style={styles.limaBox}>
            <Text style={styles.limaEmoji}>🦂</Text>
            <Text style={styles.limaText} numberOfLines={3}>{limaMsg}</Text>
          </View>
        )}

        {/* Current word preview */}
        <View style={styles.wordPreview}>
          <Text style={styles.wordPreviewText}>{currentWord || "Harf seç…"}</Text>
        </View>

        {/* Letter Circle */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <LetterCircle
            letters={puzzle.letters}
            selected={selected}
            onSelect={handleSelect}
            onClear={handleClear}
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

        {/* Bonus words found */}
        {puzzle.bonusWords.some(w => w.found) && (
          <View style={styles.bonusSection}>
            <Text style={styles.bonusTitle}>💰 Gizli Kelimeler</Text>
            {puzzle.bonusWords.filter(w => w.found).map((w, i) => (
              <Text key={i} style={styles.bonusWord}>{w.word} — {w.meaning.slice(0, 40)}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#0F1E52",
  },
  backBtn: { padding: 4 },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  headerSub: { color: "#8899BB", fontSize: 12 },
  statRow: { flexDirection: "row", gap: 12 },
  statText: { color: "#FFD700", fontWeight: "700", fontSize: 13 },
  progressBar: { height: 4, backgroundColor: "#1E2F6E", marginHorizontal: 0 },
  progressFill: { height: "100%", backgroundColor: "#5A2EFF" },
  progressLabel: { color: "#8899BB", fontSize: 11, textAlign: "center", marginTop: 4, marginBottom: 4 },
  comboBanner: {
    marginHorizontal: 16, borderRadius: 12, padding: 10,
    alignItems: "center", marginBottom: 4,
  },
  comboText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  slotsContainer: { paddingHorizontal: 16, gap: 10, marginTop: 8 },
  wordRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 },
  slot: {
    width: 28, height: 32, borderBottomWidth: 2, borderBottomColor: "#5A2EFF",
    alignItems: "center", justifyContent: "flex-end", paddingBottom: 2,
  },
  slotFound: { borderBottomColor: "#22C55E", backgroundColor: "#22C55E11", borderRadius: 4 },
  slotText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  slotTextFound: { color: "#22C55E" },
  wordMeaning: { color: "#8899BB", fontSize: 11, flex: 1 },
  limaBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    marginHorizontal: 16, marginTop: 10,
    backgroundColor: "#0F1E52", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "#5A2EFF44",
  },
  limaEmoji: { fontSize: 22 },
  limaText: { flex: 1, color: "#FFFFFF", fontSize: 13, lineHeight: 18 },
  wordPreview: {
    alignItems: "center", marginTop: 16, marginBottom: 4,
    minHeight: 36,
  },
  wordPreviewText: { color: "#FFD700", fontSize: 22, fontWeight: "800", letterSpacing: 4 },
  letterBtn: {
    position: "absolute",
    backgroundColor: "#0F1E52",
    borderWidth: 2, borderColor: "#1E2F6E",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#5A2EFF", shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  letterBtnSelected: { backgroundColor: "#5A2EFF", borderColor: "#7B5FFF" },
  letterText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 },
  letterTextSelected: { color: "#FFFFFF" },
  clearBtn: {
    position: "absolute",
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#1E2F6E",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#5A2EFF44",
  },
  submitBtn: {
    marginHorizontal: 40, marginTop: 16,
    backgroundColor: "#5A2EFF", borderRadius: 30, paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
  },
  submitText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 2 },
  bonusSection: { marginHorizontal: 16, marginTop: 16, gap: 4 },
  bonusTitle: { color: "#FFD700", fontWeight: "700", fontSize: 13, marginBottom: 4 },
  bonusWord: { color: "#8899BB", fontSize: 12 },
});
