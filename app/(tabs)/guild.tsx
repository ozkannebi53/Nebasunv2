import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, ImageBackground } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import * as Haptics from "expo-haptics";

const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

const GUILD_MEMBERS = [
  { id: "1", name: "AkrepUstası",  level: 25, contribution: 1200, emoji: "🦂" },
  { id: "2", name: "KelimeKralı",  level: 18, contribution: 890,  emoji: "👑" },
  { id: "3", name: "SözSavaşçısı", level: 12, contribution: 540,  emoji: "⚔️" },
  { id: "4", name: "DilUstadı",    level: 9,  contribution: 320,  emoji: "📚" },
  { id: "5", name: "TürkçeKral",   level: 7,  contribution: 180,  emoji: "🏆" },
];

export default function GuildScreen() {
  const { state } = useGame();
  const [tab, setTab] = useState<"members" | "tasks">("members");

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛡️ Lonca</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Seviye 7</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, tab === "members" && styles.tabActive]} 
            onPress={() => setTab("members")}
          >
            <Text style={[styles.tabText, tab === "members" && styles.tabTextActive]}>Üyeler</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, tab === "tasks" && styles.tabActive]} 
            onPress={() => setTab("tasks")}
          >
            <Text style={[styles.tabText, tab === "tasks" && styles.tabTextActive]}>Görevler</Text>
          </TouchableOpacity>
        </View>

        {tab === "members" ? (
          <FlatList
            data={GUILD_MEMBERS}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>Seviye {item.level}</Text>
                </View>
                <View style={styles.contrib}>
                  <Text style={styles.contribText}>🪙 {item.contribution}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{ padding: 16, gap: 12 }}>
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Haftalık Hedef: 1000 Kelime</Text>
                <View style={styles.barBg}><View style={[styles.barFill, { width: "45%" }]} /></View>
                <Text style={styles.sub}>450 / 1000 Kelime</Text>
              </View>
            </View>
            <Text style={styles.infoText}>Lonca savaşları yakında aktif edilecek! 🦂</Text>
          </View>
        )}
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "900" },
  levelBadge: { backgroundColor: "rgba(90, 46, 255, 0.3)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#5A2EFF" },
  levelText: { color: "white", fontWeight: "700", fontSize: 12 },
  tabs: { flexDirection: "row", marginHorizontal: 20, backgroundColor: "rgba(15, 30, 82, 0.8)", borderRadius: 15, padding: 5 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12 },
  tabActive: { backgroundColor: "#5A2EFF" },
  tabText: { color: "rgba(255,255,255,0.5)", fontWeight: "700" },
  tabTextActive: { color: "white" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(15, 30, 82, 0.7)", borderRadius: 18, padding: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  rank: { color: "rgba(255,255,255,0.4)", fontWeight: "900", width: 30 },
  emoji: { fontSize: 28 },
  name: { color: "white", fontWeight: "800", fontSize: 15 },
  sub: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 },
  contrib: { backgroundColor: "rgba(255, 215, 0, 0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  contribText: { color: "#FFD700", fontWeight: "800", fontSize: 12 },
  barBg: { height: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, marginVertical: 8, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#5A2EFF" },
  infoText: { color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 20, fontStyle: "italic" }
});
