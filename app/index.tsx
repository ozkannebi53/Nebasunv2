import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useGame } from "@/lib/game-context";
import { WORLD } from "@/data/world-data";

const { width } = Dimensions.get("window");
const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

type Screen = "countries" | "provinces" | "levels";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useGame();
  const [screen, setScreen] = useState<Screen>("countries");
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
      setScreen("countries");
    } else if (screen === "levels") {
      setSelectedProvince(null);
      setScreen("provinces");
    }
  };

  const currentCountry = WORLD.find((c) => c.id === selectedCountry);
  const currentProvince = currentCountry?.provinces.find(
    (p) => p.id === selectedProvince
  );

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer
        containerClassName="bg-transparent"
        edges={["top", "left", "right"]}
      >
        {/* Header */}
        <View style={styles.header}>
          {screen !== "countries" && (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <IconSymbol name="chevron.left" size={28} color="white" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>NEBASUN</Text>
            <Text style={styles.headerSubtitle}>
              {screen === "countries"
                ? "Dünyayı Keşfet"
                : screen === "provinces"
                ? `${currentCountry?.name}`
                : `${currentProvince?.name}`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.profileBtn}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💰</Text>
            <Text style={styles.statValue}>{state.gold}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💎</Text>
            <Text style={styles.statValue}>{state.gems}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💡</Text>
            <Text style={styles.statValue}>{state.hints || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>⭐</Text>
            <Text style={styles.statValue}>{state.level}</Text>
          </View>
        </View>

        {/* Countries Screen */}
        {screen === "countries" && (
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
        )}

        {/* Provinces Screen */}
        {screen === "provinces" && currentCountry && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>İlleri Seç</Text>
            {currentCountry.provinces.map((province) => (
              <TouchableOpacity
                key={province.id}
                style={styles.provinceCard}
                onPress={() => handleProvinceSelect(province.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.provinceName}>{province.name}</Text>
                  <Text style={styles.provinceSubtitle}>
                    10 Seviye • Tamamlanmadı
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color="#00C8FF" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Levels Screen */}
        {screen === "levels" && currentProvince && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Seviyeleri Seç</Text>
            <View style={styles.levelsGrid}>
              {currentProvince.levels.map((level) => (
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
        )}
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
  backBtn: { width: 40, height: 40, justifyContent: "center", marginRight: 8 },
  headerTitle: {
    color: "#FF00FF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 0, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF00FF",
  },
  profileEmoji: { fontSize: 20 },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15, 30, 82, 0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: { alignItems: "center" },
  statLabel: { fontSize: 18 },
  statValue: {
    color: "#00C8FF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
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
  countryName: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  countrySubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
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
  provinceName: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  provinceSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
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
  levelNumber: {
    color: "#00C8FF",
    fontSize: 24,
    fontWeight: "900",
  },
  levelWord: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
});
