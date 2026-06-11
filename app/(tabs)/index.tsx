import React, { useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import { getLeagueColor } from "@/lib/game-store";
import type { City } from "@/lib/game-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_W = (width - 48) / 2;

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  const { state } = useGame();
  const leagueColor = getLeagueColor(state.league);
  const xpPct = Math.round((state.xp / state.xpToNext) * 100);

  return (
    <View style={styles.header}>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🦂</Text>
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.playerName}>{state.name}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xpPct}%` as any }]} />
          </View>
          <Text style={styles.levelText}>Seviye {state.level} · {state.xp}/{state.xpToNext} XP</Text>
        </View>
        <View style={[styles.leagueBadge, { borderColor: leagueColor }]}>
          <Text style={[styles.leagueText, { color: leagueColor }]}>{state.league}</Text>
        </View>
      </View>
      <View style={styles.resourceRow}>
        <ResourceChip icon="⚡" value={state.energy} max={state.maxEnergy} color="#FF8A00" />
        <ResourceChip icon="🪙" value={state.gold} color="#FFD700" />
        <ResourceChip icon="💎" value={state.gems} color="#00BFFF" />
      </View>
    </View>
  );
}

function ResourceChip({ icon, value, max, color }: { icon: string; value: number; max?: number; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color + "44" }]}>
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={[styles.chipValue, { color }]}>
        {max !== undefined ? `${value}/${max}` : value.toLocaleString()}
      </Text>
    </View>
  );
}

// ─── City Card ───────────────────────────────────────────────────────────────
function CityCard({ city, index, onPress }: { city: City; index: number; onPress: () => void }) {
  const isLocked = index > 0 && !city.completed;
  return (
    <TouchableOpacity
      style={[styles.cityCard, isLocked && styles.cityCardLocked]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.cityEmoji}>{city.emoji}</Text>
      <Text style={styles.cityName}>{city.name}</Text>
      <Text style={styles.cityCountry}>{city.country}</Text>
      <View style={styles.starsRow}>
        {[0, 1, 2].map(i => (
          <Text key={i} style={{ fontSize: 14, opacity: i < city.stars ? 1 : 0.3 }}>⭐</Text>
        ))}
      </View>
      {isLocked && (
        <View style={styles.lockOverlay}>
          <IconSymbol name="lock.fill" size={28} color="#FFFFFF88" />
        </View>
      )}
      {city.completed && (
        <View style={styles.completedBadge}>
          <Text style={{ color: "#22C55E", fontSize: 10, fontWeight: "700" }}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      <Text style={styles.sectionSubText}>{subtitle}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function AdventureScreen() {
  const router = useRouter();
  const { state } = useGame();

  const handleCityPress = useCallback((city: City, index: number) => {
    if (index > 0 && !city.completed) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Use string cast to bypass strict typed routes for dynamic screens
    (router as any).push({ pathname: "/game", params: { cityId: city.id, level: "1" } });
  }, [router]);

  const turkeyCities = state.cities.filter(c => c.country === "Türkiye");
  const worldCities  = state.cities.filter(c => c.country !== "Türkiye");

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Header />

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            (router as any).push({ pathname: "/game", params: { cityId: state.currentCity, level: "1" } });
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>▶  DEVAM ET</Text>
          <Text style={styles.continueBtnSub}>{state.cities.find(c => c.id === state.currentCity)?.name ?? "İstanbul"}</Text>
        </TouchableOpacity>

        {/* Lima Quick Access */}
        <TouchableOpacity
          style={styles.limaCard}
          onPress={() => (router as any).push("/lima")}
          activeOpacity={0.85}
        >
          <Text style={styles.limaEmoji}>🦂</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.limaTitle}>Lima ile Konuş</Text>
            <Text style={styles.limaSub}>Kelime anlamları, ipuçları ve daha fazlası…</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#5A2EFF" />
        </TouchableOpacity>

        {/* Turkey Map */}
        <SectionTitle title="🇹🇷 Türkiye" subtitle={`${turkeyCities.filter(c => c.completed).length}/${turkeyCities.length} şehir`} />
        <FlatList
          data={turkeyCities}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <CityCard city={item} index={index} onPress={() => handleCityPress(item, index)} />
          )}
        />

        {/* World Map */}
        <SectionTitle title="🌍 Dünya" subtitle={`${worldCities.filter(c => c.completed).length}/${worldCities.length} şehir`} />
        <FlatList
          data={worldCities}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <CityCard city={item} index={index} onPress={() => handleCityPress(item, index)} />
          )}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0F1E52",
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: "#1E2F6E",
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#5A2EFF22",
    borderWidth: 2, borderColor: "#5A2EFF",
    alignItems: "center", justifyContent: "center",
  },
  avatarEmoji: { fontSize: 26 },
  playerName: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginBottom: 4 },
  xpBar: { height: 6, backgroundColor: "#1E2F6E", borderRadius: 3, overflow: "hidden", marginBottom: 2 },
  xpFill: { height: "100%", backgroundColor: "#5A2EFF", borderRadius: 3 },
  levelText: { color: "#8899BB", fontSize: 11 },
  leagueBadge: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  leagueText: { fontSize: 11, fontWeight: "700" },
  resourceRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#0B163F", borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  chipIcon: { fontSize: 14 },
  chipValue: { fontSize: 13, fontWeight: "700" },
  continueBtn: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "#5A2EFF", borderRadius: 18, paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  continueBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", letterSpacing: 1 },
  continueBtnSub: { color: "#FFFFFF99", fontSize: 12, marginTop: 2 },
  limaCard: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: "#0F1E52", borderRadius: 16,
    flexDirection: "row", alignItems: "center",
    padding: 14, borderWidth: 1, borderColor: "#5A2EFF44",
  },
  limaEmoji: { fontSize: 32 },
  limaTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  limaSub: { color: "#8899BB", fontSize: 12, marginTop: 2 },
  sectionTitle: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginHorizontal: 16, marginTop: 24, marginBottom: 12,
  },
  sectionTitleText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  sectionSubText: { color: "#8899BB", fontSize: 12 },
  cityCard: {
    width: CARD_W, backgroundColor: "#0F1E52",
    borderRadius: 16, padding: 14,
    alignItems: "center", borderWidth: 1, borderColor: "#1E2F6E",
    overflow: "hidden",
  },
  cityCardLocked: { opacity: 0.55 },
  cityEmoji: { fontSize: 36, marginBottom: 6 },
  cityName: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, textAlign: "center" },
  cityCountry: { color: "#8899BB", fontSize: 11, marginTop: 2 },
  starsRow: { flexDirection: "row", gap: 2, marginTop: 6 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000066",
    alignItems: "center", justifyContent: "center",
  },
  completedBadge: {
    position: "absolute", top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#22C55E22", borderWidth: 1, borderColor: "#22C55E",
    alignItems: "center", justifyContent: "center",
  },
});
