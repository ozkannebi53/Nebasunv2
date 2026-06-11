import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLimaAIResponse, updateContext, type ConversationContext } from "@/lib/lima-ai";
import type { Message } from "@/lib/lima-ai";
import * as Haptics from "expo-haptics";



const QUICK_WORDS = ["KALE", "AKREP", "BAKLAVA", "BOĞAZ", "SULTAN", "GÜREŞ", "YILDIZ", "SABIR", "Anlamı nedir?", "Kökü nedir?"];

export default function LimaScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", text: "Merhaba! Ben Lima, senin kelime rehberin. 🦂 Herhangi bir Türkçe kelime hakkında soru sorabilirsin veya sohbet edebiliriz!", from: "lima" },
  ]);
  const [context, setContext] = useState<ConversationContext>({ conversationHistory: [] });
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = { id: Date.now().toString(), text: text.trim(), from: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const response = getLimaAIResponse(text.trim(), context);
      const limaMsg: Message = { id: (Date.now() + 1).toString(), text: response, from: "lima" };
      setMessages(prev => [...prev, limaMsg]);
      setContext(prev => updateContext(text.trim(), prev));
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 600);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const animateLima = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,   duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="arrow.left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={animateLima} activeOpacity={0.8}>
            <Animated.Text style={[styles.limaEmoji, { transform: [{ scale: scaleAnim }] }]}>🦂</Animated.Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Lima</Text>
            <Text style={styles.headerSub}>Kelime Asistanın</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Çevrimiçi</Text>
          </View>
        </View>

        {/* Quick words */}
        <View style={styles.quickRow}>
          <FlatList
            data={QUICK_WORDS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={w => w}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickChip} onPress={() => sendMessage(item)} activeOpacity={0.75}>
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Bir kelime yaz… (örn: KALE)"
            placeholderTextColor="#8899BB"
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isLima = msg.from === "lima";
  return (
    <View style={[styles.bubble, isLima ? styles.bubbleLima : styles.bubbleUser]}>
      {isLima && <Text style={styles.bubbleEmoji}>🦂</Text>}
      <View style={[styles.bubbleContent, isLima ? styles.bubbleContentLima : styles.bubbleContentUser]}>
        <Text style={[styles.bubbleText, { textAlign: isLima ? "left" : "right" }]}>{msg.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#0F1E52", borderBottomWidth: 1, borderBottomColor: "#1E2F6E",
  },
  backBtn: { marginRight: 8, padding: 4 },
  limaEmoji: { fontSize: 36 },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  headerSub: { color: "#8899BB", fontSize: 12 },
  onlineBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  onlineText: { color: "#22C55E", fontSize: 11, fontWeight: "600" },
  quickRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1E2F6E" },
  quickChip: {
    backgroundColor: "#5A2EFF22", borderWidth: 1, borderColor: "#5A2EFF",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  quickChipText: { color: "#5A2EFF", fontWeight: "700", fontSize: 12 },
  bubble: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleLima: { justifyContent: "flex-start" },
  bubbleUser: { justifyContent: "flex-end" },
  bubbleEmoji: { fontSize: 24, marginBottom: 4 },
  bubbleContent: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  bubbleContentLima: { backgroundColor: "#0F1E52", borderWidth: 1, borderColor: "#1E2F6E" },
  bubbleContentUser: { backgroundColor: "#5A2EFF" },
  bubbleText: { color: "#FFFFFF", fontSize: 14, lineHeight: 20 },
  inputRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#0F1E52", borderTopWidth: 1, borderTopColor: "#1E2F6E",
  },
  input: {
    flex: 1, backgroundColor: "#0B163F", borderWidth: 1, borderColor: "#1E2F6E",
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
    color: "#FFFFFF", fontSize: 14,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#5A2EFF", alignItems: "center", justifyContent: "center",
  },
});
