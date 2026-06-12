import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, ImageBackground, Dimensions,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";

interface Message {
  id: string;
  text: string;
  from: "user" | "akrep";
  timestamp: Date;
}

export default function AkrepZekaScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "0", 
      text: "Selam! Ben AKREP ZEKA. Seninle her konuda konuşabilir, strateji geliştirebilir veya sadece dertleşebilirim. 🦂", 
      from: "akrep",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);
  
  // tRPC mutation with safety check
  const chatMutation = trpc.ai.chat.useMutation({
    onError: (err) => {
      console.error("tRPC Error:", err);
      addAkrepMessage("Bağlantımda bir parazit oluştu. Tekrar dener misin? 🦂");
    }
  });

  const addAkrepMessage = (text: string) => {
    const msg: Message = { 
      id: Date.now().toString(), 
      text, 
      from: "akrep",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, msg]);
    setIsTyping(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const userMsg: Message = { id: Date.now().toString(), text, from: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.from === "user" ? "user" as const : "assistant" as const,
        content: m.text
      }));

      const response = await chatMutation.mutateAsync({
        messages: [...history, { role: "user", content: text }]
      });

      if (response && response.content) {
        addAkrepMessage(response.content);
      } else {
        addAkrepMessage("Derin düşüncelere daldım, ama bir cevap bulamadım. 🦂");
      }
    } catch (error) {
      console.error("AKREP ZEKA Chat Error:", error);
      // Error handled by mutation onError or here
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [messages, isTyping]);

  return (
    <ImageBackground source={{ uri: BG_URL }} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>AKREP ZEKA</Text>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Çevrimiçi</Text>
              </View>
            </View>
            <View style={styles.headerAvatar}>
              <Text style={{ fontSize: 24 }}>🦂</Text>
            </View>
          </View>

          {/* Chat Body */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.chatList}
            renderItem={({ item }) => (
              <View style={[styles.bubbleWrapper, item.from === "user" ? styles.userWrapper : styles.akrepWrapper]}>
                {item.from === "akrep" && (
                  <View style={styles.miniAvatar}>
                    <Text style={{ fontSize: 12 }}>🦂</Text>
                  </View>
                )}
                <View style={[styles.bubble, item.from === "user" ? styles.userBubble : styles.akrepBubble]}>
                  <Text style={[styles.bubbleText, item.from === "user" ? styles.userText : styles.akrepText]}>
                    {item.text}
                  </Text>
                  <Text style={styles.timeText}>
                    {item.timestamp.getHours().toString().padStart(2, '0')}:
                    {item.timestamp.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={isTyping ? (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Akrep Zeka yazıyor...</Text>
                <ActivityIndicator size="small" color="#FF00FF" style={{ marginLeft: 8 }} />
              </View>
            ) : null}
          />

          {/* Input Panel */}
          <View style={styles.inputPanel}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Bir şeyler sor..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
                onPress={sendMessage}
                disabled={!input.trim() || isTyping}
              >
                <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", padding: 16,
    backgroundColor: "rgba(15, 30, 82, 0.9)",
    borderBottomWidth: 1, borderBottomColor: "rgba(255, 0, 255, 0.3)",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 1 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E", marginRight: 6 },
  statusText: { color: "#22C55E", fontSize: 11, fontWeight: "700" },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,0,255,0.1)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FF00FF" },
  
  chatList: { padding: 16, paddingBottom: 20 },
  bubbleWrapper: { flexDirection: "row", marginBottom: 16, maxWidth: "85%" },
  userWrapper: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  akrepWrapper: { alignSelf: "flex-start" },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(255,0,255,0.2)", alignItems: "center", justifyContent: "center", marginRight: 8, marginTop: 4 },
  bubble: { padding: 12, borderRadius: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  userBubble: { backgroundColor: "#5A2EFF", borderTopRightRadius: 4 },
  akrepBubble: { backgroundColor: "rgba(15, 30, 82, 0.9)", borderTopLeftRadius: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: "#FFFFFF" },
  akrepText: { color: "#E0E0E0" },
  timeText: { fontSize: 9, color: "rgba(255,255,255,0.4)", alignSelf: "flex-end", marginTop: 4 },
  
  typingIndicator: { flexDirection: "row", alignItems: "center", marginLeft: 48, marginBottom: 16 },
  typingText: { color: "#FF00FF", fontSize: 12, fontWeight: "600" },
  
  inputPanel: { padding: 16, backgroundColor: "rgba(15, 30, 82, 0.95)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
  inputContainer: { flexDirection: "row", alignItems: "flex-end", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  input: { flex: 1, color: "#FFFFFF", fontSize: 15, maxHeight: 100, paddingTop: 8, paddingBottom: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FF00FF", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  sendBtnDisabled: { backgroundColor: "rgba(255,255,255,0.1)" }
});
