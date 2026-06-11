import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, TextInput, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useGame } from "@/lib/game-context";
import { getLeagueColor } from "@/lib/game-store";
import { createPvPSession, addPlayerToSession, generateCode1v1, generateCode2v2, validateCode } from "@/lib/pvp-code";
import * as Haptics from "expo-haptics";

type PvPMode = "1v1" | "2v2";

interface PvPSession {
  code: string;
  mode: PvPMode;
  players: Array<{ deviceId: string; playerName: string; isReady: boolean }>;
}

export default function PvPScreen() {
  const { state } = useGame();
  const [tab, setTab] = useState<"lobby" | "join">("lobby");
  const [selectedMode, setSelectedMode] = useState<PvPMode>("1v1");
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [codeInput, setCodeInput] = useState("");
  const [playerNameInput, setPlayerNameInput] = useState(state.name);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleCreateSession = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const session = createPvPSession(selectedMode, "device_" + Math.random().toString(36).substring(7), state.name);
    setCurrentSession(session);
    setShowCodeModal(true);
  };

  const handleJoinSession = () => {
    if (!validateCode(codeInput, selectedMode)) {
      Alert.alert("❌ Hata", `Geçersiz kod. ${selectedMode === "1v1" ? "4" : "6"} haneli kod girin.`);
      return;
    }
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Gerçek uygulamada, burada sunucuya bağlanılıp oturum alınır
    Alert.alert("✓ Başarılı", `Kod "${codeInput}" ile oyuna katıldınız!`);
    setCodeInput("");
  };

  const copyToClipboard = (text: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("📋 Kopyalandı", `Kod "${text}" panoya kopyalandı!`);
  };

  if (currentSession) {
    return (
      <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentSession(null)} style={styles.backBtn}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>⚔️ PvP Oturumu</Text>
        </View>

        <View style={styles.sessionCard}>
          <Text style={styles.sessionMode}>{currentSession.mode.toUpperCase()} MODU</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Kod:</Text>
            <Text style={styles.code}>{currentSession?.code}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(currentSession?.code || "")}>
              <Text style={styles.copyBtnText}>📋 Kopyala</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.playersLabel}>Oyuncular ({currentSession.players.length}/{currentSession.mode === "1v1" ? 2 : 4})</Text>
          <FlatList
            data={currentSession.players}
            keyExtractor={p => p.deviceId}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <View style={styles.playerItem}>
                <Text style={styles.playerName}>{item.playerName}</Text>
                <View style={[styles.readyBadge, item.isReady && styles.readyBadgeActive]}>
                  <Text style={styles.readyText}>{item.isReady ? "✓ Hazır" : "⏳ Bekleniyor"}</Text>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.readyBtn} onPress={() => Alert.alert("✓", "Hazır olduğunuzu işaretledik!")}>
            <Text style={styles.readyBtnText}>✓ HAZIR</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

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

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "lobby" && styles.tabActive]}
          onPress={() => setTab("lobby")}
        >
          <Text style={[styles.tabText, tab === "lobby" && styles.tabTextActive]}>Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "join" && styles.tabActive]}
          onPress={() => setTab("join")}
        >
          <Text style={[styles.tabText, tab === "join" && styles.tabTextActive]}>Katıl</Text>
        </TouchableOpacity>
      </View>

      {tab === "lobby" ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Mod Seç</Text>
          <View style={styles.modesRow}>
            {(["1v1", "2v2"] as const).map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.modeCard, selectedMode === m && styles.modeCardActive]}
                onPress={() => {
                  setSelectedMode(m);
                  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modeIcon}>{m === "1v1" ? "⚔️" : "🛡️"}</Text>
                <Text style={[styles.modeLabel, selectedMode === m && { color: "#FFFFFF" }]}>{m}</Text>
                <Text style={styles.modeSub}>{m === "1v1" ? "2 cihaz" : "4 cihaz"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.createBtn} onPress={handleCreateSession} activeOpacity={0.85}>
            <Text style={styles.createBtnText}>🎮 OTURUM OLUŞTUR</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Nasıl Oynanır?</Text>
            <Text style={styles.infoText}>
              1. Mod seç ve oturum oluştur{"\n"}
              2. Kodu arkadaşına gönder{"\n"}
              3. Arkadaş kodu girerek katılır{"\n"}
              4. Kelime oyununda yarışın!
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Koda Katıl</Text>

          <Text style={styles.label}>Mod</Text>
          <View style={styles.modesRow}>
            {(["1v1", "2v2"] as const).map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.modeCard, selectedMode === m && styles.modeCardActive]}
                onPress={() => setSelectedMode(m)}
                activeOpacity={0.8}
              >
                <Text style={styles.modeIcon}>{m === "1v1" ? "⚔️" : "🛡️"}</Text>
                <Text style={[styles.modeLabel, selectedMode === m && { color: "#FFFFFF" }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Kod</Text>
          <TextInput
            style={styles.codeInput}
            value={codeInput}
            onChangeText={setCodeInput}
            placeholder={selectedMode === "1v1" ? "XXXX" : "XXXXXX"}
            placeholderTextColor="#8899BB"
            autoCapitalize="characters"
            maxLength={selectedMode === "1v1" ? 4 : 6}
          />

          <TouchableOpacity style={styles.joinBtn} onPress={handleJoinSession} activeOpacity={0.85}>
            <Text style={styles.joinBtnText}>✓ KATIL</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Code Modal */}
      <Modal visible={showCodeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowCodeModal(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>🎮 Oturum Oluşturuldu!</Text>
            <Text style={styles.modalSubtitle}>Arkadaşına bu kodu gönder:</Text>

            <View style={styles.modalCodeBox}>
              <Text style={styles.modalCode}>{currentSession?.code || ""}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalCopyBtn}
              onPress={() => copyToClipboard(currentSession?.code || "")}
            >
              <Text style={styles.modalCopyBtnText}>📋 Kopyala</Text>
            </TouchableOpacity>

            <Text style={styles.modalInfo}>Bekleniyor... ({currentSession?.players?.length || 0}/{currentSession?.mode === "1v1" ? 2 : 4})</Text>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  backText: { color: "#5A2EFF", fontWeight: "700", fontSize: 14 },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 22, flex: 1, textAlign: "center" },
  leagueBadge: { backgroundColor: "#0F1E52", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  leagueText: { fontWeight: "700", fontSize: 12 },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginBottom: 4, backgroundColor: "#0F1E52", borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#5A2EFF" },
  tabText: { color: "#8899BB", fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#FFFFFF" },
  content: { padding: 16, gap: 12 },
  sectionTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 16, marginBottom: 4 },
  label: { color: "#8899BB", fontWeight: "600", fontSize: 13, marginTop: 8 },
  modesRow: { flexDirection: "row", gap: 10 },
  modeCard: {
    flex: 1, backgroundColor: "#0F1E52", borderRadius: 14, padding: 12,
    alignItems: "center", borderWidth: 1, borderColor: "#1E2F6E",
  },
  modeCardActive: { backgroundColor: "#5A2EFF", borderColor: "#7B5FFF" },
  modeIcon: { fontSize: 24, marginBottom: 4 },
  modeLabel: { color: "#8899BB", fontWeight: "700", fontSize: 14 },
  modeSub: { color: "#8899BB", fontSize: 11, marginTop: 2 },
  createBtn: {
    backgroundColor: "#5A2EFF", borderRadius: 18, paddingVertical: 16, alignItems: "center",
    marginTop: 12, shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  createBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  joinBtn: {
    backgroundColor: "#5A2EFF", borderRadius: 18, paddingVertical: 16, alignItems: "center",
    marginTop: 12, shadowColor: "#5A2EFF", shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  joinBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  infoBox: {
    backgroundColor: "#0F1E52", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#1E2F6E", marginTop: 12,
  },
  infoTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, marginBottom: 6 },
  infoText: { color: "#8899BB", fontSize: 12, lineHeight: 18 },
  codeInput: {
    backgroundColor: "#0B163F", borderWidth: 1, borderColor: "#1E2F6E",
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    color: "#FFFFFF", fontSize: 18, fontWeight: "700", letterSpacing: 4, textAlign: "center",
  },
  sessionCard: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: "#0F1E52",
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E2F6E",
  },
  sessionMode: { color: "#5A2EFF", fontWeight: "800", fontSize: 14, marginBottom: 12 },
  codeBox: {
    backgroundColor: "#0B163F", borderRadius: 12, padding: 12,
    alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "#5A2EFF44",
  },
  codeLabel: { color: "#8899BB", fontSize: 12, marginBottom: 4 },
  code: { color: "#FFD700", fontSize: 28, fontWeight: "800", letterSpacing: 4, marginBottom: 8 },
  copyBtn: {
    backgroundColor: "#5A2EFF", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  copyBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  playersLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, marginBottom: 8 },
  playerItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#0B163F", borderRadius: 10, padding: 10,
  },
  playerName: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },
  readyBadge: { backgroundColor: "#1E2F6E", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  readyBadgeActive: { backgroundColor: "#22C55E22", borderWidth: 1, borderColor: "#22C55E" },
  readyText: { color: "#8899BB", fontSize: 11, fontWeight: "600" },
  readyBtn: {
    backgroundColor: "#22C55E", borderRadius: 12, paddingVertical: 12,
    alignItems: "center", marginTop: 16,
  },
  readyBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  modalOverlay: {
    flex: 1, backgroundColor: "#00000088",
    alignItems: "center", justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#0F1E52", borderRadius: 20, padding: 24,
    width: "80%", alignItems: "center", borderWidth: 1, borderColor: "#5A2EFF",
  },
  closeBtn: {
    position: "absolute", top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#1E2F6E", alignItems: "center", justifyContent: "center",
  },
  closeBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  modalTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 18, marginTop: 12, marginBottom: 4 },
  modalSubtitle: { color: "#8899BB", fontSize: 13, marginBottom: 16 },
  modalCodeBox: {
    backgroundColor: "#0B163F", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16,
    marginBottom: 16, borderWidth: 2, borderColor: "#5A2EFF",
  },
  modalCode: { color: "#FFD700", fontSize: 32, fontWeight: "800", letterSpacing: 6 },
  modalCopyBtn: {
    backgroundColor: "#5A2EFF", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
    marginBottom: 16,
  },
  modalCopyBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  modalInfo: { color: "#8899BB", fontSize: 12 },
});
