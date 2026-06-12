import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGame } from "@/lib/game-context";
import { WORLD } from "@/data/world-data";

const { width } = Dimensions.get("window");
const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

type Screen = "home" | "countries" | "provinces" | "levels";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useGame();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setScreen("provinces");
  };

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setScreen("levels");
  };

  const handleLevelStart = (levelId: number) => {
    if (selectedCountry && selectedProvince) {
      router.push({
        pathname: "/game",
        params: {
          countryId: selectedCountry,
          provinceId: selectedProvince,
          level: levelId,
        },
      });
    }
  };

  const handleBack = () => {
    if (screen === "provinces") {
      setSelectedCountry(null);
      setScreen("home");
    } else if (screen === "levels") {
      setSelectedProvince(null);
      setScreen("provinces");
    }
  };

  const currentCountry = WORLD.find((c) => c.id === selectedCountry);
  const currentProvince = currentCountry?.provinces.find(
    (p) => p.id === selectedProvince
  );

  const renderHome = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeEmoji}>🦂</Text>
        <Text style={styles.welcomeTitle}>NEBASUN</Text>
        <Text style={styles.welcomeSubtitle}>Kelime Bulmaca Oyunu</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statLabel}>Seviye</Text>
          <Text style={styles.statValue}>{state.level}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Altın</Text>
          <Text style={styles.statValue}>{state.gold}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={styles.statLabel}>Elmas</Text>
          <Text style={styles.statValue}>{state.gems}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setScreen("countries")}
      >
        <Text style={styles.playButtonText}>🎮 OYUNA BAŞLA</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Nasıl Oynanır?</Text>
        <Text style={styles.infoText}>
          Çemberdeki harfleri sürükleyerek kelimeleri bulun. Her kelimeyi
          bulduğunuzda kutucuklara yerleşir.
        </Text>
      </View>
    </ScrollView>
  );

  const renderCountries = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Ülkeleri Seç</Text>
      {WORLD.map((country) => (
        <TouchableOpacity
          key={country.id}
          style={styles.countryCard}
          onPress={() => handleCountrySelect(country.id)}
        >
          <Text style={styles.countryFlag}>{country.flag}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.countrySubtitle}>
              {country.provinces.length} İl • 100 Seviye
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#00C8FF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProvinces = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{currentCountry?.name}</Text>
      {currentCountry?.provinces.map((province) => (
        <TouchableOpacity
          key={province.id}
          style={styles.provinceCard}
          onPress={() => handleProvinceSelect(province.id)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.provinceName}>{province.name}</Text>
            <Text style={styles.provinceSubtitle}>10 Seviye</Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#00C8FF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLevels = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{currentProvince?.name}</Text>
      <View style={styles.levelsGrid}>
        {currentProvince?.levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelButton}
            onPress={() => handleLevelStart(level.id)}
          >
            <Text style={styles.levelNumber}>{level.id}</Text>
            <Text style={styles.levelWord}>{level.word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer
        containerClassName="bg-transparent"
        edges={["top", "left", "right"]}
      >
        {/* Header */}
        {screen !== "home" && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <IconSymbol name="chevron.left" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {screen === "countries"
                ? "ÜLKELER"
                : screen === "provinces"
                ? currentCountry?.name
                : currentProvince?.name}
            </Text>
            <View style={{ width: 40 }} />
          </View>
        )}

        {/* Content */}
        <View style={{ flex: 1 }}>
          {screen === "home" && renderHome()}
          {screen === "countries" && renderCountries()}
          {screen === "provinces" && renderProvinces()}
          {screen === "levels" && renderLevels()}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, screen === "home" && styles.navButtonActive]}
            onPress={() => setScreen("home")}
          >
            <IconSymbol
              name="house.fill"
              size={24}
              color={screen === "home" ? "#FF00FF" : "rgba(255,255,255,0.5)"}
            />
            <Text
              style={[
                styles.navLabel,
                screen === "home" && styles.navLabelActive,
              ]}
            >
              Anasayfa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, screen === "countries" && styles.navButtonActive]}
            onPress={() => {
              setScreen("countries");
              setSelectedCountry(null);
              setSelectedProvince(null);
            }}
          >
            <IconSymbol
              name="globe"
              size={24}
              color={screen === "countries" ? "#FF00FF" : "rgba(255,255,255,0.5)"}
            />
            <Text
              style={[
                styles.navLabel,
                screen === "countries" && styles.navLabelActive,
              ]}
            >
              Oyun
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/lima")}
          >
            <Text style={{ fontSize: 24 }}>🦂</Text>
            <Text style={styles.navLabel}>AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/profile")}
          >
            <IconSymbol
              name="person.fill"
              size={24}
              color="rgba(255,255,255,0.5)"
            />
            <Text style={styles.navLabel}>Profil</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 0, 255, 0.2)",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    flex: 1,
    color: "#FF00FF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
  welcomeCard: {
    backgroundColor: "rgba(255, 0, 255, 0.15)",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FF00FF",
  },
  welcomeEmoji: { fontSize: 64, marginBottom: 12 },
  welcomeTitle: {
    color: "#FF00FF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
  },
  welcomeSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(0, 200, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.3)",
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statLabel: { color: "rgba(255, 255, 255, 0.6)", fontSize: 10 },
  statValue: { color: "#00C8FF", fontSize: 18, fontWeight: "900", marginTop: 4 },
  playButton: {
    backgroundColor: "#FF00FF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  infoSection: {
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoTitle: {
    color: "#FF00FF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#FF00FF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
    letterSpacing: 1,
  },
  countryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 30, 82, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 0, 255, 0.3)",
  },
  countryFlag: { fontSize: 40, marginRight: 12 },
  countryName: { color: "white", fontSize: 18, fontWeight: "900" },
  countrySubtitle: { color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 },
  provinceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 200, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(0, 200, 255, 0.3)",
  },
  provinceName: { color: "white", fontSize: 16, fontWeight: "900" },
  provinceSubtitle: { color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 },
  levelsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  levelButton: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "rgba(255, 0, 255, 0.15)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF00FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  levelNumber: { color: "#00C8FF", fontSize: 24, fontWeight: "900" },
  levelWord: { color: "white", fontSize: 12, fontWeight: "700", marginTop: 4 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(15, 30, 82, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 0, 255, 0.2)",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navButton: { alignItems: "center", flex: 1 },
  navButtonActive: { opacity: 1 },
  navLabel: { color: "rgba(255, 255, 255, 0.5)", fontSize: 10, marginTop: 4 },
  navLabelActive: { color: "#FF00FF", fontWeight: "700" },
});
