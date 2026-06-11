import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import * as Haptics from "expo-haptics";

type QuestTab = "daily" | "weekly" | "monthly";

export default function QuestsScreen() {
  const { state } = useGame();
  const [tab, setTab] = useState<QuestTab>("daily");

  const filtered = state.quests.filter(q => q.type === tab);

  const ACHIEVEMENTS_UNLOCKED = state.achievements.filter(a => a.unlocked).length;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Görevler</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {state.streak} Gün Seri</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["daily", "weekly", "monthly"] as QuestTab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => {
              setTab(t);
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "daily" ? "Günlük" : t === "weekly" ? "Haftalık" : "Aylık"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quests */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => {
          const pct = Math.min((item.progress / item.target) * 100, 100);
          return (
            <View style={[styles.questCard, item.completed && styles.questCardDone]}>
              <View style={styles.questHeader}>
                <Text style={styles.questTitle}>{item.title}</Text>
                {item.completed && <Text style={styles.doneTag}>✓ Tamamlandı</Text>}
              </View>
              <Text style={styles.questDesc}>{item.description}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${pct}%` as any }, item.completed && { backgroundColor: "#22C55E" }]} />
              </View>
              <View style={styles.questFooter}>
                <Text style={styles.questProgress}>{item.progress}/{item.target}</Text>
                <View style={styles.rewardRow}>
                  {item.reward.gold  && <Text style={styles.rewardGold}>🪙 {item.reward.gold}</Text>}
                  {item.reward.xp    && <Text style={styles.rewardXp}>⭐ {item.reward.xp} XP</Text>}
                  {item.reward.gems  && <Text style={styles.rewardGems}>💎 {item.reward.gems}</Text>}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Bu kategoride görev yok.</Text>
          </View>
        }
      />

      {/* Achievements Section */}
      <View style={styles.achievSection}>
        <Text style={styles.achievTitle}>🏆 Başarımlar ({ACHIEVEMENTS_UNLOCKED}/{state.achievements.length})</Text>
        <FlatList
          data={state.achievements}
          keyExtractor={a => a.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={[styles.achievCard, !item.unlocked && { opacity: 0.4 }]}>
              <Text style={styles.achievIcon}>{item.icon}</Text>
              <Text style={styles.achievName} numberOfLines={2}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 22 },
  streakBadge: { backgroundColor: "#FF8A0022", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#FF8A00" },
  streakText: { color: "#FF8A00", fontWeight: "700", fontSize: 12 },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginBottom: 4, backgroundColor: "#0F1E52", borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#5A2EFF" },
  tabText: { color: "#8899BB", fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#FFFFFF" },
  questCard: {
    backgroundColor: "#0F1E52", borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  questCardDone: { borderColor: "#22C55E44" },
  questHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  questTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, flex: 1 },
  doneTag: { color: "#22C55E", fontSize: 11, fontWeight: "700" },
  questDesc: { color: "#8899BB", fontSize: 12, marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: "#1E2F6E", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", backgroundColor: "#5A2EFF", borderRadius: 3 },
  questFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  questProgress: { color: "#8899BB", fontSize: 11 },
  rewardRow: { flexDirection: "row", gap: 8 },
  rewardGold: { color: "#FFD700", fontSize: 12, fontWeight: "600" },
  rewardXp: { color: "#22C55E", fontSize: 12, fontWeight: "600" },
  rewardGems: { color: "#00BFFF", fontSize: 12, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: 30 },
  emptyText: { color: "#8899BB", fontSize: 14 },
  achievSection: { paddingBottom: 100 },
  achievTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginHorizontal: 16, marginBottom: 10, marginTop: 8 },
  achievCard: {
    width: 80, backgroundColor: "#0F1E52", borderRadius: 14, padding: 10,
    alignItems: "center", borderWidth: 1, borderColor: "#1E2F6E",
  },
  achievIcon: { fontSize: 28, marginBottom: 4 },
  achievName: { color: "#FFFFFF", fontSize: 10, fontWeight: "600", textAlign: "center" },
});
