import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Logo animasyonu
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Metin animasyonu (gecikmeli)
    setTimeout(() => {
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Giriş ekranına geç
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router, scaleAnim, opacityAnim, rotateAnim, translateYAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Arka plan gradient */}
      <View style={styles.background} />

      {/* Merkez animasyonlu logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.logo}>🦂</Text>
      </Animated.View>

      {/* Başlık */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [{ translateY: translateYAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.title}>NEBASUN</Text>
        <Text style={styles.subtitle}>Kelime Oyunu</Text>
      </Animated.View>

      {/* Alt metin */}
      <Animated.View
        style={[
          styles.bottomText,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B163F",
  },
  background: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "#0B163F",
    // Gradient efekti için overlay
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(90, 46, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(90, 46, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 8,
  },
  subtitle: {
    color: "#8899BB",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  bottomText: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  loadingText: {
    color: "#5A2EFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
