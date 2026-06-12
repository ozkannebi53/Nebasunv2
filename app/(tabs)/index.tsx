import React, { useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, Platform, ImageBackground,
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
const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

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
    </View>
  );
}

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
      {isLocked && (
        <View style={styles.lockOverlay}>
          <IconSymbol name="lock.fill" size={24} color="#FFFFFF88" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function AdventureScreen() {
  const router = useRouter();
  const { state } = useGame();

  const handleCityPress = useCallback((city: City, index: number) => {
    if (index > 0 && !city.completed) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (router as any).push({ pathname: "/game", params: { cityId: city.id, level: "1" } });
  }, [router]);

  const turkeyCities = state.cities.filter(c => c.country === "Türkiye");

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Header />

          {/* AKREP ZEKA Gemini Card */}
          <TouchableOpacity
            style={styles.akrepCard}
            onPress={() => (router as any).push("/lima")}
            activeOpacity={0.85}
          >
            <View style={styles.akrepContent}>
              <View style={styles.akrepIconBg}>
                <Text style={styles.akrepEmoji}>🦂</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.akrepTitle}>AKREP ZEKA</Text>
                <Text style={styles.akrepSub}>Gemini 1.5 Flash ile sınırsız sohbet!</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FF00FF" />
            </View>
          </TouchableOpacity>

          {/* Play Button */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => (router as any).push({ pathname: "/game", params: { cityId: state.currentCity, level: "1" } })}
            activeOpacity={0.85}
          >
            <Text style={styles.playBtnText}>OYUNA BAŞLA</Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bölgeler</Text>
          </View>

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
        </ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "rgba(15, 30, 82, 0.75)",
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(90, 46, 255, 0.2)",
    borderWidth: 2, borderColor: "#5A2EFF",
    alignItems: "center", justifyContent: "center",
  },
  avatarEmoji: { fontSize: 24 },
  playerName: { color: "#FFFFFF", fontWeight: "900", fontSize: 16, marginBottom: 4 },
  xpBar: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden", marginBottom: 4 },
  xpFill: { height: "100%", backgroundColor: "#5A2EFF" },
  levelText: { color: "#8899BB", fontSize: 10, fontWeight: "700" },
  leagueBadge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  leagueText: { fontSize: 10, fontWeight: "900" },
  
  akrepCard: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderRadius: 24, padding: 16,
    borderWidth: 1.5, borderColor: "rgba(255, 0, 255, 0.3)",
    shadowColor: "#FF00FF", shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
  },
  akrepContent: { flexDirection: "row", alignItems: "center" },
  akrepIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255, 0, 255, 0.1)", alignItems: "center", justifyContent: "center" },
  akrepEmoji: { fontSize: 32 },
  akrepTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 18, letterSpacing: 1 },
  akrepSub: { color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 2 },

  playBtn: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "#FF00FF", borderRadius: 20, paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#FF00FF", shadowOpacity: 0.4, shadowRadius: 15, elevation: 8,
  },
  playBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 2 },

  sectionHeader: { marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  sectionTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: 1 },

  cityCard: {
    width: CARD_W, backgroundColor: "rgba(15, 30, 82, 0.65)",
    borderRadius: 24, padding: 16,
    alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  cityCardLocked: { opacity: 0.6 },
  cityEmoji: { fontSize: 44, marginBottom: 8 },
  cityName: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  cityCountry: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center",
  },
});
