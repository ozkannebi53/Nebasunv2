import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ScrollView, Alert, Platform, TextInput,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import { getLeagueColor, getRarityColor } from "@/lib/game-store";
import type { Scorpion } from "@/lib/game-store";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const { state, dispatch } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [tab, setTab] = useState<"stats" | "scorpions" | "passport">("stats");

  const activeScorpion = state.scorpions.find(s => s.id === state.activeScorpion);
  const completedCities = state.cities.filter(c => c.completed).length;
  const unlockedScorpions = state.scorpions.filter(s => s.unlocked).length;

  const handleSaveName = () => {
    if (nameInput.trim().length >= 2) {
      dispatch({ type: "SET_NAME", name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleSelectScorpion = (s: Scorpion) => {
    if (!s.unlocked) {
      Alert.alert("🔒 Kilitli", `${s.name} henüz kilitsiz değil.`);
      return;
    }
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch({ type: "SET_ACTIVE_SCORPION", id: s.id });
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>{activeScorpion?.emoji ?? "🦂"}</Text>
            <View style={[styles.leagueRing, { borderColor: getLeagueColor(state.league) }]} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  maxLength={20}
                />
                <TouchableOpacity onPress={handleSaveName} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)} activeOpacity={0.7}>
                <Text style={styles.playerName}>{state.name} ✏️</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.leagueLabel, { color: getLeagueColor(state.league) }]}>
              {state.league} Ligi
            </Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${Math.round((state.xp / state.xpToNext) * 100)}%` as any }]} />
            </View>
            <Text style={styles.xpText}>Seviye {state.level} · {state.xp}/{state.xpToNext} XP</Text>
          </View>
        </View>

        {/* Resource Row */}
        <View style={styles.resourceRow}>
          <ResourceCard icon="🪙" label="Altın" value={state.gold.toLocaleString()} color="#FFD700" />
          <ResourceCard icon="💎" label="Elmas" value={state.gems.toString()} color="#00BFFF" />
          <ResourceCard icon="🔥" label="Seri" value={`${state.streak} gün`} color="#FF8A00" />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(["stats", "scorpions", "passport"] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === "stats" ? "İstatistik" : t === "scorpions" ? "Akrepler" : "Pasaport"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "stats" && (
          <View style={styles.statsGrid}>
            <StatItem icon="📝" label="Toplam Kelime" value={state.totalWordsFound.toString()} />
            <StatItem icon="🏙️" label="Tamamlanan Şehir" value={completedCities.toString()} />
            <StatItem icon="🦂" label="Akrep Koleksiyonu" value={`${unlockedScorpions}/${state.scorpions.length}`} />
            <StatItem icon="🏆" label="Maksimum Kombo" value={state.maxCombo.toString()} />
            <StatItem icon="⚡" label="Enerji" value={`${state.energy}/${state.maxEnergy}`} />
            <StatItem icon="🎯" label="Başarımlar" value={`${state.achievements.filter(a => a.unlocked).length}/${state.achievements.length}`} />
          </View>
        )}

        {tab === "scorpions" && (
          <FlatList
            data={state.scorpions}
            keyExtractor={s => s.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 10, paddingHorizontal: 16 }}
            contentContainerStyle={{ gap: 10, paddingTop: 4 }}
            renderItem={({ item }) => {
              const isActive = item.id === state.activeScorpion;
              const rarityColor = getRarityColor(item.rarity);
              return (
                <TouchableOpacity
                  style={[
                    styles.scorpionCard,
                    { borderColor: item.unlocked ? rarityColor + "66" : "#1E2F6E" },
                    isActive && { borderColor: rarityColor, borderWidth: 2 },
                    !item.unlocked && { opacity: 0.5 },
                  ]}
                  onPress={() => handleSelectScorpion(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.scorpionEmoji}>{item.emoji}</Text>
                  <Text style={styles.scorpionName}>{item.name}</Text>
                  <Text style={[styles.rarityTag, { color: rarityColor }]}>{item.rarity}</Text>
                  {isActive && <View style={styles.activeDot} />}
                  {!item.unlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={{ fontSize: 20 }}>🔒</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}

        {tab === "passport" && (
          <View style={{ padding: 16, gap: 10 }}>
            <Text style={styles.passportTitle}>🌍 Pasaport Koleksiyonu</Text>
            <Text style={styles.passportSub}>Tamamladığın her ülkede pasaport damgası kazanırsın.</Text>
            {["Türkiye", "Azerbaycan", "İran", "Irak", "Suriye", "Mısır", "Yunanistan", "İtalya", "Fransa", "İspanya", "Japonya", "Çin"].map(country => {
              const cities = state.cities.filter(c => c.country === country);
              const done = cities.every(c => c.completed) && cities.length > 0;
              return (
                <View key={country} style={[styles.passportCard, done && styles.passportCardDone]}>
                  <Text style={styles.passportFlag}>{done ? "🛂" : "🔒"}</Text>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.passportCountry}>{country}</Text>
                    <Text style={styles.passportProgress}>
                      {cities.filter(c => c.completed).length}/{cities.length} şehir
                    </Text>
                  </View>
                  {done && <Text style={styles.stampText}>✈️ Damgalandı</Text>}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function ResourceCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.resourceCard, { borderColor: color + "44" }]}>
      <Text style={styles.resourceIcon}>{icon}</Text>
      <Text style={[styles.resourceValue, { color }]}>{value}</Text>
      <Text style={styles.resourceLabel}>{label}</Text>
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "#0F1E52", borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  avatarContainer: { position: "relative", width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 36 },
  leagueRing: {
    position: "absolute", width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, top: 0, left: 0,
  },
  playerName: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, marginBottom: 2 },
  leagueLabel: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  xpBar: { height: 6, backgroundColor: "#1E2F6E", borderRadius: 3, overflow: "hidden", marginBottom: 2 },
  xpFill: { height: "100%", backgroundColor: "#5A2EFF", borderRadius: 3 },
  xpText: { color: "#8899BB", fontSize: 11 },
  nameEditRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  nameInput: {
    flex: 1, backgroundColor: "#0B163F", borderWidth: 1, borderColor: "#5A2EFF",
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    color: "#FFFFFF", fontSize: 14,
  },
  saveBtn: { backgroundColor: "#22C55E", borderRadius: 8, padding: 6 },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700" },
  resourceRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 12 },
  resourceCard: {
    flex: 1, backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    alignItems: "center", borderWidth: 1,
  },
  resourceIcon: { fontSize: 20 },
  resourceValue: { fontWeight: "800", fontSize: 15, marginTop: 4 },
  resourceLabel: { color: "#8899BB", fontSize: 11, marginTop: 2 },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginTop: 14, marginBottom: 4, backgroundColor: "#0F1E52", borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#5A2EFF" },
  tabText: { color: "#8899BB", fontWeight: "600", fontSize: 12 },
  tabTextActive: { color: "#FFFFFF" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  statItem: {
    width: "30%", flex: 1, backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    alignItems: "center", borderWidth: 1, borderColor: "#1E2F6E",
  },
  statIcon: { fontSize: 22 },
  statValue: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, marginTop: 4 },
  statLabel: { color: "#8899BB", fontSize: 10, marginTop: 2, textAlign: "center" },
  scorpionCard: {
    flex: 1, backgroundColor: "#0F1E52", borderRadius: 16, padding: 14,
    alignItems: "center", borderWidth: 1, overflow: "hidden",
  },
  scorpionEmoji: { fontSize: 36, marginBottom: 6 },
  scorpionName: { color: "#FFFFFF", fontWeight: "700", fontSize: 12, textAlign: "center" },
  rarityTag: { fontSize: 10, fontWeight: "700", marginTop: 2 },
  activeDot: {
    position: "absolute", top: 8, right: 8,
    width: 10, height: 10, borderRadius: 5, backgroundColor: "#22C55E",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000066",
    alignItems: "center", justifyContent: "center",
  },
  passportTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  passportSub: { color: "#8899BB", fontSize: 12, marginBottom: 4 },
  passportCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  passportCardDone: { borderColor: "#22C55E44" },
  passportFlag: { fontSize: 28 },
  passportCountry: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  passportProgress: { color: "#8899BB", fontSize: 12, marginTop: 2 },
  stampText: { color: "#22C55E", fontSize: 11, fontWeight: "700" },
});
