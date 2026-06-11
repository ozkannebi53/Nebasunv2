import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import * as Haptics from "expo-haptics";

const GUILD_MEMBERS = [
  { id: "1", name: "AkrepUstası",  level: 25, contribution: 1200, emoji: "🦂" },
  { id: "2", name: "KelimeKralı",  level: 18, contribution: 890,  emoji: "👑" },
  { id: "3", name: "SözSavaşçısı", level: 12, contribution: 540,  emoji: "⚔️" },
  { id: "4", name: "DilUstadı",    level: 9,  contribution: 320,  emoji: "📚" },
  { id: "5", name: "TürkçeKral",   level: 7,  contribution: 180,  emoji: "🏆" },
];

const GUILD_BOSSES = [
  { id: "b1", name: "Dev Akrep",    hp: 10000, maxHp: 10000, emoji: "🦂", reward: "500 Altın" },
  { id: "b2", name: "Ejderha",      hp: 0,     maxHp: 25000, emoji: "🐉", reward: "Nadir Sandık", locked: true },
  { id: "b3", name: "Kum Solucanı", hp: 0,     maxHp: 50000, emoji: "🪱", reward: "Efsane Akrep",  locked: true },
];

export default function GuildScreen() {
  const { state } = useGame();
  const [tab, setTab] = useState<"info" | "bosses" | "tasks">("info");

  const guildLevel = 7;
  const guildXp = 3400;
  const guildXpMax = 5000;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Lonca</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Seviye {guildLevel}</Text>
        </View>
      </View>

      {/* Guild XP */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(guildXp / guildXpMax) * 100}%` as any }]} />
        </View>
        <Text style={styles.xpLabel}>{guildXp}/{guildXpMax} Lonca XP</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["info", "bosses", "tasks"] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "info" ? "Üyeler" : t === "bosses" ? "Bosslar" : "Görevler"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "info" && (
        <FlatList
          data={GUILD_MEMBERS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item, index }) => (
            <View style={styles.memberCard}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.memberEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberSub}>Seviye {item.level}</Text>
              </View>
              <View style={styles.contribBadge}>
                <Text style={styles.contribText}>🪙 {item.contribution}</Text>
              </View>
            </View>
          )}
        />
      )}

      {tab === "bosses" && (
        <FlatList
          data={GUILD_BOSSES}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.bossCard, (item as any).locked && { opacity: 0.5 }]}>
              <Text style={styles.bossEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.bossName}>{item.name}</Text>
                <View style={styles.hpBar}>
                  <View style={[styles.hpFill, { width: `${(item.hp / item.maxHp) * 100}%` as any }]} />
                </View>
                <Text style={styles.bossHp}>{item.hp.toLocaleString()}/{item.maxHp.toLocaleString()} HP</Text>
                <Text style={styles.bossReward}>🎁 {item.reward}</Text>
              </View>
              {!(item as any).locked && (
                <TouchableOpacity
                  style={styles.attackBtn}
                  onPress={() => {
                    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Alert.alert("⚔️ Saldır!", `${item.name}'a saldırıyorsun!`);
                  }}
                >
                  <Text style={styles.attackBtnText}>⚔️</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {tab === "tasks" && (
        <View style={{ padding: 16, gap: 10 }}>
          {[
            { title: "Günlük: 50 Kelime Bul",   progress: 23, target: 50, reward: "🪙 100", type: "Günlük"  },
            { title: "Haftalık: 5 Düello Kazan", progress: 2,  target: 5,  reward: "💎 20",  type: "Haftalık"},
            { title: "Sezonluk: 10 Şehir Bitir", progress: 1,  target: 10, reward: "🦂 Nadir Akrep", type: "Sezonluk"},
          ].map((task, i) => (
            <View key={i} style={styles.taskCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskType}>{task.type}</Text>
              </View>
              <View style={styles.taskBar}>
                <View style={[styles.taskFill, { width: `${(task.progress / task.target) * 100}%` as any }]} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={styles.taskProgress}>{task.progress}/{task.target}</Text>
                <Text style={styles.taskReward}>{task.reward}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 22 },
  levelBadge: { backgroundColor: "#5A2EFF22", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#5A2EFF" },
  levelText: { color: "#5A2EFF", fontWeight: "700", fontSize: 12 },
  xpContainer: { paddingHorizontal: 16, marginBottom: 8 },
  xpBar: { height: 8, backgroundColor: "#1E2F6E", borderRadius: 4, overflow: "hidden" },
  xpFill: { height: "100%", backgroundColor: "#5A2EFF", borderRadius: 4 },
  xpLabel: { color: "#8899BB", fontSize: 11, marginTop: 4 },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginBottom: 4, backgroundColor: "#0F1E52", borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#5A2EFF" },
  tabText: { color: "#8899BB", fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#FFFFFF" },
  memberCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  rank: { color: "#8899BB", fontWeight: "700", fontSize: 14, width: 24 },
  memberEmoji: { fontSize: 28 },
  memberName: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  memberSub: { color: "#8899BB", fontSize: 12, marginTop: 2 },
  contribBadge: { backgroundColor: "#FFD70022", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  contribText: { color: "#FFD700", fontWeight: "700", fontSize: 12 },
  bossCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F1E52", borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  bossEmoji: { fontSize: 40 },
  bossName: { color: "#FFFFFF", fontWeight: "800", fontSize: 15, marginBottom: 6 },
  hpBar: { height: 8, backgroundColor: "#1E2F6E", borderRadius: 4, overflow: "hidden", marginBottom: 4 },
  hpFill: { height: "100%", backgroundColor: "#EF4444", borderRadius: 4 },
  bossHp: { color: "#EF4444", fontSize: 11, fontWeight: "600" },
  bossReward: { color: "#FFD700", fontSize: 12, marginTop: 4 },
  attackBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center",
  },
  attackBtnText: { fontSize: 20 },
  taskCard: {
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  taskTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 13, flex: 1 },
  taskType: { color: "#8899BB", fontSize: 11 },
  taskBar: { height: 6, backgroundColor: "#1E2F6E", borderRadius: 3, overflow: "hidden" },
  taskFill: { height: "100%", backgroundColor: "#22C55E", borderRadius: 3 },
  taskProgress: { color: "#8899BB", fontSize: 11 },
  taskReward: { color: "#FFD700", fontSize: 12, fontWeight: "600" },
});
