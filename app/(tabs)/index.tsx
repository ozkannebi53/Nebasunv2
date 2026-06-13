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

type Screen = "countries" | "provinces" | "levels";

export default function AdventureScreen() {
  const router = useRouter();
  const { state } = useGame();
  const [view, setView] = useState<Screen>("countries");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setView("provinces");
  };

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setView("levels");
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
    if (view === "provinces") {
      setSelectedCountry(null);
      setView("countries");
    } else if (view === "levels") {
      setSelectedProvince(null);
      setView("provinces");
    }
  };

  const currentCountry = WORLD.find((c) => c.id === selectedCountry);
  const currentProvince = currentCountry?.provinces.find(
    (p) => p.id === selectedProvince
  );

  // Kilit sistemi mantığı
  const isLevelLocked = (levelId: number) => {
    // Şimdilik sadece Bölüm 1 açıktır, diğerleri seviye atladıkça açılır
    // Bu mantık daha sonra PlayerState'e kaydedilen 'unlockedLevels' ile güçlendirilecek
    return levelId > state.level;
  };

  const renderCountries = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerInfo}>
        <Text style={styles.welcomeTitle}>DÜNYA TURU</Text>
        <Text style={styles.welcomeSubtitle}>Ülke seç ve maceraya başla!</Text>
      </View>

      {WORLD.map((country) => (
        <TouchableOpacity
          key={country.id}
          style={styles.card}
          onPress={() => handleCountrySelect(country.id)}
        >
          <Text style={styles.cardEmoji}>{country.flag}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{country.name}</Text>
            <Text style={styles.cardSubtitle}>{country.provinces.length} İl • 100+ Seviye</Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#5A2EFF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProvinces = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentCountry?.name}</Text>
      </View>

      {currentCountry?.provinces.map((province) => (
        <TouchableOpacity
          key={province.id}
          style={styles.card}
          onPress={() => handleProvinceSelect(province.id)}
        >
          <Text style={styles.cardEmoji}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{province.name}</Text>
            <Text style={styles.cardSubtitle}>10 Seviye</Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#5A2EFF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLevels = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentProvince?.name}</Text>
      </View>

      <View style={styles.levelsGrid}>
        {currentProvince?.levels.map((level) => {
          const locked = isLevelLocked(level.id);
          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelButton, locked && styles.levelButtonLocked]}
              onPress={() => !locked && handleLevelStart(level.id)}
              disabled={locked}
            >
              {locked ? (
                <IconSymbol name="lock.fill" size={24} color="rgba(255,255,255,0.3)" />
              ) : (
                <>
                  <Text style={styles.levelNumber}>{level.id}</Text>
                  <Text style={styles.levelLabel}>Bölüm</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.background}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top"]}>
        {view === "countries" && renderCountries()}
        {view === "provinces" && renderProvinces()}
        {view === "levels" && renderLevels()}
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerInfo: { marginBottom: 24, alignItems: "center" },
  welcomeTitle: { color: "#FF00FF", fontSize: 28, fontWeight: "900", letterSpacing: 2 },
  welcomeSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { color: "#FF00FF", fontSize: 22, fontWeight: "900", flex: 1, textAlign: "center", marginRight: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 30, 82, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 255, 0.2)",
  },
  cardEmoji: { fontSize: 32, marginRight: 16 },
  cardTitle: { color: "white", fontSize: 18, fontWeight: "900" },
  cardSubtitle: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 },
  levelsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  levelButton: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    backgroundColor: "rgba(90, 46, 255, 0.2)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#5A2EFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  levelButtonLocked: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  levelNumber: { color: "white", fontSize: 24, fontWeight: "900" },
  levelLabel: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700", marginTop: 2 },
});
