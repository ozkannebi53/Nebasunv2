import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import { getLeagueColor } from "@/lib/game-store";
import * as Haptics from "expo-haptics";

const MODES = [
  { id: "1v1",  label: "1v1",  desc: "Klasik düello",      icon: "⚔️",  duration: 90  },
  { id: "2v2",  label: "2v2",  desc: "Takım düellosu",     icon: "🛡️",  duration: 120 },
  { id: "4v4",  label: "4v4",  desc: "Büyük savaş",        icon: "🔥",  duration: 180 },
];

const MOCK_OPPONENTS = [
  { id: "1", name: "KelimeUstası",  level: 15, league: "Altın",  emoji: "🦅", wins: 142 },
  { id: "2", name: "AkrePSavaşçı", level: 8,  league: "Gümüş", emoji: "🐺", wins: 67  },
  { id: "3", name: "TürkçeKral",   level: 22, league: "Elmas",  emoji: "👑", wins: 310 },
  { id: "4", name: "SözUstadı",    level: 5,  league: "Bronz",  emoji: "🎯", wins: 23  },
];

export default function PvPScreen() {
  const { state } = useGame();
  const [selectedMode, setSelectedMode] = useState("1v1");
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      Alert.alert("🎮 Rakip Bulundu!", "KelimeUstası ile eşleştin!\nHazır mısın?", [
        { text: "İptal", style: "cancel" },
        { text: "SAVAŞ!", onPress: () => {} },
      ]);
    }, 2000);
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚔️ PvP Arena</Text>
        <View style={styles.leagueBadge}>
          <Text style={[styles.leagueText, { color: getLeagueColor(state.league) }]}>
            {state.league}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon="🏆" label="Puan" value={state.leaguePoints.toString()} color="#FFD700" />
        <StatCard icon="⚡" label="Enerji" value={`${state.energy}/${state.maxEnergy}`} color="#FF8A00" />
        <StatCard icon="💎" label="Elmas" value={state.gems.toString()} color="#00BFFF" />
      </View>

      {/* Mode Selection */}
      <Text style={styles.sectionTitle}>Mod Seç</Text>
      <View style={styles.modesRow}>
        {MODES.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.modeCard, selectedMode === m.id && styles.modeCardActive]}
            onPress={() => {
              setSelectedMode(m.id);
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.modeIcon}>{m.icon}</Text>
            <Text style={[styles.modeLabel, selectedMode === m.id && { color: "#FFFFFF" }]}>{m.label}</Text>
            <Text style={styles.modeDuration}>{m.duration}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Find Match Button */}
      <TouchableOpacity
        style={[styles.searchBtn, searching && { backgroundColor: "#FF8A00" }]}
        onPress={handleSearch}
        disabled={searching}
        activeOpacity={0.85}
      >
        <Text style={styles.searchBtnText}>
          {searching ? "🔍 Rakip Aranıyor…" : "⚔️ DÜELLO BAŞLAT"}
        </Text>
      </TouchableOpacity>

      {/* Leaderboard */}
      <Text style={styles.sectionTitle}>Yakın Rakipler</Text>
      <FlatList
        data={MOCK_OPPONENTS}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.opponentCard}>
            <Text style={styles.opponentEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.opponentName}>{item.name}</Text>
              <Text style={styles.opponentSub}>Seviye {item.level} · {item.wins} galibiyet</Text>
            </View>
            <Text style={[styles.opponentLeague, { color: getLeagueColor(item.league as any) }]}>
              {item.league}
            </Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: color + "44" }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 22 },
  leagueBadge: { backgroundColor: "#0F1E52", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  leagueText: { fontWeight: "700", fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    alignItems: "center", borderWidth: 1,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontWeight: "800", fontSize: 16, marginTop: 4 },
  statLabel: { color: "#8899BB", fontSize: 11, marginTop: 2 },
  sectionTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 16, marginHorizontal: 16, marginTop: 16, marginBottom: 10 },
  modesRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16 },
  modeCard: {
    flex: 1, backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    alignItems: "center", borderWidth: 1, borderColor: "#1E2F6E",
  },
  modeCardActive: { backgroundColor: "#5A2EFF", borderColor: "#7B5FFF" },
  modeIcon: { fontSize: 24, marginBottom: 4 },
  modeLabel: { color: "#8899BB", fontWeight: "700", fontSize: 14 },
  modeDuration: { color: "#8899BB", fontSize: 11, marginTop: 2 },
  searchBtn: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: "#5A2EFF",
    borderRadius: 18, paddingVertical: 16, alignItems: "center",
    shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  searchBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  opponentCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  opponentEmoji: { fontSize: 28 },
  opponentName: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  opponentSub: { color: "#8899BB", fontSize: 12, marginTop: 2 },
  opponentLeague: { fontWeight: "700", fontSize: 12 },
});
