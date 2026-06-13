import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGame } from "@/lib/game-context";

const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

export default function ProfileScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [showShop, setShowShop] = useState(false);

  const handleBuyHints = () => {
    if (state.gems >= 50) {
      dispatch({ type: "BUY_HINTS", gemsSpent: 50 });
      setShowShop(false);
    }
  };

  // Güvenli veri erişimi
  const quests = state.quests || [];
  const leaguePoints = state.leaguePoints || 0;
  const leagueRank = 1000; // Varsayılan değer

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer
        containerClassName="bg-transparent"
        edges={["top", "left", "right"]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PROFİL</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Player Card */}
          <View style={styles.playerCard}>
            <Text style={styles.playerAvatar}>🦂</Text>
            <Text style={styles.playerName}>{state.name || "Akrep Savaşçısı"}</Text>
            <Text style={styles.playerLevel}>Seviye {state.level}</Text>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${Math.min((state.xp / state.xpToNext) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {state.xp} / {state.xpToNext} XP
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statTitle}>Altın</Text>
              <Text style={styles.statValue}>{state.gold}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💎</Text>
              <Text style={styles.statTitle}>Elmas</Text>
              <Text style={styles.statValue}>{state.gems}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💡</Text>
              <Text style={styles.statTitle}>İpucu</Text>
              <Text style={styles.statValue}>{state.hints || 0}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statTitle}>Lig Puanı</Text>
              <Text style={styles.statValue}>{leaguePoints}</Text>
            </View>
          </View>

          {/* Quests Section */}
          {quests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Görevler</Text>
              {quests.map((quest) => (
                <View key={quest.id} style={styles.questCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    <View style={styles.questProgressBar}>
                      <View
                        style={[
                          styles.questProgressFill,
                          {
                            width: `${Math.min((quest.progress / quest.target) * 100, 100)}%`,
                            backgroundColor: quest.completed ? "#22C55E" : "#00C8FF",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.questProgress}>
                      {quest.progress} / {quest.target}
                    </Text>
                  </View>
                  <View style={styles.rewardContainer}>
                    {quest.reward.gold && <Text style={styles.questReward}>{quest.reward.gold}💰</Text>}
                    {quest.reward.xp && <Text style={styles.questReward}>{quest.reward.xp}✨</Text>}
                    {quest.reward.gems && <Text style={styles.questReward}>{quest.reward.gems}💎</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* League Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Haftalık Lig</Text>
            <View style={styles.leagueCard}>
              <View style={styles.leagueRank}>
                <Text style={styles.leagueRankNumber}>#{leagueRank}</Text>
                <Text style={styles.leagueRankLabel}>Sıralama</Text>
              </View>
              <View style={styles.leaguePoints}>
                <Text style={styles.leaguePointsNumber}>{leaguePoints}</Text>
                <Text style={styles.leaguePointsLabel}>Puan</Text>
              </View>
              <Text style={styles.leagueReset}>Hafta Sonu Sıfırlanır</Text>
            </View>
          </View>

          {/* Shop Button */}
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => setShowShop(true)}
          >
            <Text style={styles.shopButtonIcon}>🛍️</Text>
            <Text style={styles.shopButtonText}>Mağazayı Aç</Text>
          </TouchableOpacity>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Ayarlar</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Ses</Text>
              <IconSymbol name="speaker.wave.2.fill" size={20} color="#00C8FF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Bildirimler</Text>
              <IconSymbol name="bell.fill" size={20} color="#00C8FF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Hakkında</Text>
              <IconSymbol name="info.circle.fill" size={20} color="#00C8FF" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Shop Modal */}
        <Modal visible={showShop} transparent animationType="slide">
          <View style={styles.shopOverlay}>
            <View style={styles.shopContent}>
              <View style={styles.shopHeader}>
                <Text style={styles.shopTitle}>🛍️ MAĞAZA</Text>
                <TouchableOpacity onPress={() => setShowShop(false)}>
                  <IconSymbol name="xmark" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.shopItem}>
                <View>
                  <Text style={styles.shopItemTitle}>10 İpucu</Text>
                  <Text style={styles.shopItemDesc}>Oyunda kullanmak için</Text>
                </View>
                <TouchableOpacity
                  style={styles.shopItemButton}
                  onPress={handleBuyHints}
                >
                  <Text style={styles.shopItemPrice}>50 💎</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.shopItem}>
                <View>
                  <Text style={styles.shopItemTitle}>500 Altın</Text>
                  <Text style={styles.shopItemDesc}>Ödülleri hızlandır</Text>
                </View>
                <TouchableOpacity style={styles.shopItemButton}>
                  <Text style={styles.shopItemPrice}>9.99 $</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.shopItem}>
                <View>
                  <Text style={styles.shopItemTitle}>100 Elmas</Text>
                  <Text style={styles.shopItemDesc}>Premium paket</Text>
                </View>
                <TouchableOpacity style={styles.shopItemButton}>
                  <Text style={styles.shopItemPrice}>19.99 $</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 0, 255, 0.2)",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    color: "#FF00FF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  playerCard: {
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FF00FF",
  },
  playerAvatar: { fontSize: 64, marginBottom: 12 },
  playerName: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  playerLevel: {
    color: "#00C8FF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  xpBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  xpFill: { height: "100%", backgroundColor: "#00C8FF" },
  xpText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(0, 200, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.3)",
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statTitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: "#00C8FF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: "#FF00FF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: 1,
  },
  questCard: {
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  questTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  questProgressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  questProgressFill: { height: "100%" },
  questProgress: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
    marginTop: 4,
  },
  rewardContainer: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  questReward: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "900",
  },
  leagueCard: {
    backgroundColor: "rgba(255, 0, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#FF00FF",
    alignItems: "center",
  },
  leagueRank: { alignItems: "center", marginBottom: 12 },
  leagueRankNumber: {
    color: "#FF00FF",
    fontSize: 28,
    fontWeight: "900",
  },
  leagueRankLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  leaguePoints: { alignItems: "center", marginBottom: 12 },
  leaguePointsNumber: {
    color: "#00C8FF",
    fontSize: 28,
    fontWeight: "900",
  },
  leaguePointsLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  leagueReset: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontStyle: "italic",
  },
  shopButton: {
    backgroundColor: "#FF00FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  shopButtonIcon: { fontSize: 20, marginRight: 8 },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  shopOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  shopContent: {
    backgroundColor: "rgba(15, 30, 82, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  shopTitle: {
    color: "#FF00FF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 200, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.3)",
  },
  shopItemTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  shopItemDesc: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  shopItemButton: {
    backgroundColor: "#FF00FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopItemPrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "900",
  },
});
