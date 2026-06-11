import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Animated, Platform, ScrollView, Alert, Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGame } from "@/lib/game-context";
import { getRandomWord, shuffleWord, isValidWord, getWordMeaning } from "@/lib/turkish-words";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const CIRCLE_RADIUS = Math.min(width * 0.35, 140);
const LETTER_CIRCLE_SIZE = 56;

// ─── Harf Çemberi (Çizgili) ──────────────────────────────────────────────
interface LetterNode {
  index: number;
  letter: string;
  angle: number;
  x: number;
  y: number;
}

function LetterCircleWithLines({
  letters,
  selected,
  onSelectStart,
  onSelectMove,
  onSelectEnd,
  cityName,
}: {
  letters: string[];
  selected: number[];
  onSelectStart: (idx: number) => void;
  onSelectMove: (idx: number) => void;
  onSelectEnd: () => void;
  cityName: string;
}) {
  const count = letters.length;
  const centerX = width / 2;
  const centerY = CIRCLE_RADIUS + 80;

  const nodes: LetterNode[] = useMemo(
    () =>
      letters.map((letter, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + CIRCLE_RADIUS * Math.cos(angle);
        const y = centerY + CIRCLE_RADIUS * Math.sin(angle);
        return { index: i, letter, angle, x, y };
      }),
    [letters, count]
  );

  // Seçili harfler arasında çizgi çiz
  const selectedNodes = selected.map(i => nodes[i]);

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

      {/* Çizgiler (seçili harfler arasında) */}
      {selectedNodes.length > 1 &&
        selectedNodes.map((node, i) => {
          if (i === 0) return null;
          const prevNode = selectedNodes[i - 1];
          const dx = node.x - prevNode.x;
          const dy = node.y - prevNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`line-${i}`}
              style={[
                styles.connectionLine,
                {
                  left: prevNode.x,
                  top: prevNode.y,
                  width: distance,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          );
        })}

      {/* Harf düğümleri */}
      {nodes.map(node => (
        <Pressable
          key={node.index}
          style={[
            styles.letterNode,
            {
              left: node.x - LETTER_CIRCLE_SIZE / 2,
              top: node.y - LETTER_CIRCLE_SIZE / 2,
              width: LETTER_CIRCLE_SIZE,
              height: LETTER_CIRCLE_SIZE,
              borderRadius: LETTER_CIRCLE_SIZE / 2,
              backgroundColor: selected.includes(node.index) ? "#5A2EFF" : "#1E2F6E",
              borderColor: selected.includes(node.index) ? "#7B5FFF" : "#334155",
            },
          ]}
          onPressIn={() => onSelectStart(node.index)}
          onPress={() => onSelectMove(node.index)}
        >
          <Text style={[styles.letterNodeText, selected.includes(node.index) && { color: "#FFFFFF" }]}>
            {node.letter}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Ana Oyun Ekranı ──────────────────────────────────────────────────────
export default function GameScreen() {
  const router = useRouter();
  const { cityId = "istanbul", level = "1" } = useLocalSearchParams<{ cityId: string; level: string }>();
  const { state, dispatch } = useGame();

  // Kelime seç (5, 7, 9 harfli rastgele)
  const wordLength = useMemo(() => {
    const lengths = [3, 4, 5, 6] as const;
    return lengths[Math.floor(Math.random() * lengths.length)];
  }, []) as 3 | 4 | 5 | 6;

  const targetWord = useMemo(() => getRandomWord(wordLength), [wordLength]);
  const shuffledLetters = useMemo(() => shuffleWord(targetWord), [targetWord]);

  const [selected, setSelected] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const currentWord = selected.map(i => shuffledLetters[i]).join("");

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSelectStart = useCallback((idx: number) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected([idx]);
    setMessage("");
  }, []);

  const handleSelectMove = useCallback((idx: number) => {
    setSelected(prev => {
      if (prev.includes(idx)) return prev;
      return [...prev, idx];
    });
  }, []);

  const handleSelectEnd = useCallback(() => {
    if (selected.length < 2) {
      setSelected([]);
      return;
    }

    const word = currentWord;

    if (isValidWord(word)) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const xpGain = word.length * 10;
      const goldGain = word.length * 5;
      dispatch({ type: "ADD_XP", amount: xpGain });
      dispatch({ type: "ADD_GOLD", amount: goldGain });
      dispatch({ type: "COMBO_INC" });
      setFoundWords(prev => [...prev, word]);
      setMessage(`✓ Doğru! "${word}" — ${getWordMeaning(word)}`);
      setMessageType("success");
      setSelected([]);

      if (word === targetWord) {
        setTimeout(() => {
          dispatch({ type: "COMPLETE_CITY", cityId, stars: 3 });
          Alert.alert("🎉 Tebrikler!", `"${targetWord}" kelimesini buldun!\n+${xpGain} XP  +${goldGain} Altın`, [
            { text: "Devam Et", onPress: () => router.back() },
          ]);
        }, 500);
      }
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      doShake();
      dispatch({ type: "COMBO_RESET" });
      setMessage(`✗ "${word}" geçerli bir kelime değil.`);
      setMessageType("error");
      setSelected([]);
    }
  }, [selected, currentWord, targetWord, cityId, dispatch, router]);

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
            <Text style={styles.headerSub}>Hedef: {targetWord}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statText}>🪙 {state.gold}</Text>
            <Text style={styles.statText}>⚡ {state.energy}</Text>
          </View>
        </View>

        {/* Hedef Kelime */}
        <View style={styles.targetBox}>
          <Text style={styles.targetLabel}>Bulunacak Kelime ({targetWord.length} harf)</Text>
          <View style={styles.targetLetters}>
            {targetWord.split("").map((ch, i) => (
              <View key={i} style={styles.targetLetter}>
                <Text style={styles.targetLetterText}>{foundWords.includes(targetWord) ? ch : "?"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mesaj */}
        {message !== "" && (
          <View style={[styles.messageBox, messageType === "error" && styles.messageBoxError]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        {/* Geçerli Kelime Önizlemesi */}
        <View style={styles.wordPreview}>
          <Text style={styles.wordPreviewLabel}>Seçili:</Text>
          <Text style={styles.wordPreviewText}>{currentWord || "—"}</Text>
        </View>

        {/* Harf Çemberi (Çizgili) */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <LetterCircleWithLines
            letters={shuffledLetters}
            selected={selected}
            onSelectStart={handleSelectStart}
            onSelectMove={handleSelectMove}
            onSelectEnd={handleSelectEnd}
            cityName={cityId}
          />
        </Animated.View>

        {/* Bulunan Kelimeler */}
        {foundWords.length > 0 && (
          <View style={styles.foundWordsBox}>
            <Text style={styles.foundWordsLabel}>Bulunan Kelimeler ({foundWords.length})</Text>
            <View style={styles.foundWordsList}>
              {foundWords.map((w, i) => (
                <View key={i} style={styles.foundWordItem}>
                  <Text style={styles.foundWordText}>{w}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  targetBox: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  targetLabel: { color: "#8899BB", fontSize: 11, fontWeight: "600", marginBottom: 8 },
  targetLetters: { flexDirection: "row", gap: 6 },
  targetLetter: {
    width: 32, height: 36, borderRadius: 6,
    backgroundColor: "#0B163F", borderWidth: 1, borderColor: "#5A2EFF44",
    alignItems: "center", justifyContent: "center",
  },
  targetLetterText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  messageBox: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: "#0F1E5244", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "#22C55E44",
  },
  messageBoxError: { borderColor: "#EF444444", backgroundColor: "#EF444411" },
  messageText: { color: "#FFFFFF", fontSize: 12, lineHeight: 16 },
  wordPreview: {
    alignItems: "center", marginVertical: 12,
  },
  wordPreviewLabel: { color: "#8899BB", fontSize: 11, fontWeight: "600", marginBottom: 4 },
  wordPreviewText: { color: "#FFD700", fontSize: 20, fontWeight: "800", letterSpacing: 2 },
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
  connectionLine: {
    position: "absolute",
    height: 3,
    backgroundColor: "#5A2EFF",
    borderRadius: 2,
    transformOrigin: "0 50%",
  },
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
  foundWordsBox: {
    marginHorizontal: 16, marginTop: 16, marginBottom: 20,
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  foundWordsLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, marginBottom: 8 },
  foundWordsList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  foundWordItem: {
    backgroundColor: "#5A2EFF", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  foundWordText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
});
