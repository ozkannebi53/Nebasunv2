import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLimaAIResponse, type ConversationContext } from "@/lib/lima-ai";
import type { Message } from "@/lib/lima-ai";
import * as Haptics from "expo-haptics";

export default function AkrepZekaScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "0", 
      text: "Merhaba! Ben AKREP ZEKA. Seninle her konuda sohbet edebilir, sorunlarını dinleyebilir ve sana yardımcı olabilirim. Sadece oyun için değil, hayatın her anı için buradayım. Ne anlatmak istersin? 🦂", 
      from: "lima" 
    },
  ]);
  const [context, setContext] = useState<ConversationContext>({ history: [] });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const userMsg: Message = { id: Date.now().toString(), text: text.trim(), from: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // AI yanıtı için kısa bir gecikme ve işlem
    setTimeout(() => {
      // Burada gerçekte backend çağrısı yapılacak, şimdilik mevcut mantığı AKREP ZEKA'ya uyarlıyoruz
      const response = getLimaAIResponse(text.trim(), context);
      const akrepMsg: Message = { id: (Date.now() + 1).toString(), text: response, from: "lima" };
      
      setMessages(prev => [...prev, akrepMsg]);
      setContext(prev => ({ 
        ...prev, 
        history: [...(prev.history || []), { role: "user" as const, content: text.trim() }] 
      }));
      
      setIsLoading(false);
      
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [context, isLoading]);

  const animateAkrep = () => {
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
          <TouchableOpacity onPress={animateAkrep} activeOpacity={0.8}>
            <Animated.Text style={[styles.akrepEmoji, { transform: [{ scale: scaleAnim }] }]}>🦂</Animated.Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>AKREP ZEKA</Text>
            <Text style={styles.headerSub}>Canlı ve Zeki Sohbet</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Aktif</Text>
          </View>
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
            placeholder="AKREP ZEKA ile konuş..."
            placeholderTextColor="#8899BB"
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            autoCapitalize="sentences" // Artık büyük harf zorunlu değil
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isLoading) && { opacity: 0.4 }]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAkrep = msg.from === "lima";
  return (
    <View style={[styles.bubble, isAkrep ? styles.bubbleAkrep : styles.bubbleUser]}>
      {isAkrep && <Text style={styles.bubbleEmoji}>🦂</Text>}
      <View style={[styles.bubbleContent, isAkrep ? styles.bubbleContentAkrep : styles.bubbleContentUser]}>
        <Text style={[styles.bubbleText, { textAlign: isAkrep ? "left" : "right" }]}>{msg.text}</Text>
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
  akrepEmoji: { fontSize: 36 },
  headerTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 18, letterSpacing: 1 },
  headerSub: { color: "#22C55E", fontSize: 12, fontWeight: "700" },
  onlineBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  onlineText: { color: "#22C55E", fontSize: 11, fontWeight: "600" },
  bubble: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleAkrep: { justifyContent: "flex-start" },
  bubbleUser: { justifyContent: "flex-end" },
  bubbleEmoji: { fontSize: 24, marginBottom: 4 },
  bubbleContent: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  bubbleContentAkrep: { backgroundColor: "#0F1E52", borderWidth: 1, borderColor: "#1E2F6E" },
  bubbleContentUser: { backgroundColor: "#5A2EFF" },
  bubbleText: { color: "#FFFFFF", fontSize: 15, lineHeight: 22 },
  inputRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#0F1E52", borderTopWidth: 1, borderTopColor: "#1E2F6E",
  },
  input: {
    flex: 1, backgroundColor: "#0B163F", borderWidth: 1, borderColor: "#1E2F6E",
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
    color: "#FFFFFF", fontSize: 15,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#5A2EFF", alignItems: "center", justifyContent: "center",
  },
});
