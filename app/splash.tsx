import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const letterSpacingAnim = useRef(new Animated.Value(20)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animasyon dizisi
    Animated.sequence([
      // Arka plan yavaşça belirsin
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Metin ve ölçek animasyonu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(letterSpacingAnim, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: false, // letterSpacing native driver desteklemez
        }),
      ]),
    ]).start();

    // 4 saniye sonra ana ekrana geç
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Koyu lacivert/siyah şık arka plan */}
      <View style={[styles.background, { opacity: 1 }]} />
      
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Beyaz, şık ve animasyonlu font */}
        <Animated.Text 
          style={[
            styles.brandText,
            { letterSpacing: letterSpacingAnim }
          ]}
        >
          AKREPGMİ
        </Animated.Text>
        
        <View style={styles.separator} />
        
        <Text style={styles.subText}>NEBASUN v3.1</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.loadingText}>YÜKLENİYOR</Text>
        <View style={styles.loadingBarContainer}>
          <Animated.View style={styles.loadingBar} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050A1E",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(90, 46, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  separator: {
    width: 60,
    height: 3,
    backgroundColor: "#5A2EFF",
    marginVertical: 15,
    borderRadius: 2,
  },
  subText: {
    color: "#8899BB",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 4,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  loadingText: {
    color: "#5A2EFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },
  loadingBarContainer: {
    width: 150,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 1,
    overflow: "hidden",
  },
  loadingBar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#5A2EFF",
  }
});
