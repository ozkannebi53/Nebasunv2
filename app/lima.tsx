import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";

interface Message {
  id: string;
  text: string;
  from: "user" | "akrep";
}

export default function AkrepZekaScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "0", 
      text: "Merhaba! Ben AKREP ZEKA. Gemini 1.5 Flash ile güçlendirildim. Seninle her konuda sohbet edebilirim. Sadece oyun değil, hayat, teknoloji veya sorunların hakkında da konuşabiliriz. 🦂", 
      from: "akrep" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  
  const chatMutation = trpc.ai.chat.useMutation();

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const userMsg: Message = { id: Date.now().toString(), text, from: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Sohbet geçmişini Gemini formatına uygun hazırla
      const history = messages.slice(-6).map(m => ({
        role: m.from === "user" ? "user" as const : "assistant" as const,
        content: m.text
      }));

      const response = await chatMutation.mutateAsync({
        messages: [
          ...history,
          { role: "user", content: text }
        ]
      });

      const akrepMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.content, 
        from: "akrep" 
      };
      
      setMessages(prev => [...prev, akrepMsg]);
    } catch (error) {
      console.error("AKREP ZEKA Error:", error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Şu an bağlantımda bir sorun var ama AKREP ZEKA her zaman burada. Lütfen tekrar dener misin? 🦂", 
        from: "akrep" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isLoading]);

  return (
    <ScreenContainer containerClassName="bg-[#050A1E]" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AKREP ZEKA</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Gemini 1.5 Flash Aktif</Text>
            </View>
          </View>
          <Text style={styles.akrepEmojiHeader}>🦂</Text>
        </View>

        {/* Messages List */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[styles.bubbleContainer, item.from === "user" ? styles.userContainer : styles.akrepContainer]}>
              <View style={[styles.bubble, item.from === "user" ? styles.userBubble : styles.akrepBubble]}>
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#8899BB"
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 15,
    backgroundColor: "#0F1E52", borderBottomWidth: 1, borderBottomColor: "#1E2F6E",
  },
  backBtn: { padding: 5 },
  headerTitleContainer: { flex: 1, marginLeft: 15 },
  headerTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 20, letterSpacing: 1 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E", marginRight: 6 },
  statusText: { color: "#22C55E", fontSize: 12, fontWeight: "700" },
  akrepEmojiHeader: { fontSize: 32 },
  
  messageList: { padding: 20, paddingBottom: 30 },
  bubbleContainer: { flexDirection: "row", marginBottom: 15 },
  userContainer: { justifyContent: "flex-end" },
  akrepContainer: { justifyContent: "flex-start" },
  bubble: { maxWidth: "85%", padding: 14, borderRadius: 18 },
  userBubble: { backgroundColor: "#5A2EFF", borderBottomRightRadius: 4 },
  akrepBubble: { backgroundColor: "#0F1E52", borderWidth: 1, borderColor: "#1E2F6E", borderBottomLeftRadius: 4 },
  bubbleText: { color: "#FFFFFF", fontSize: 16, lineHeight: 22 },
  
  inputArea: {
    flexDirection: "row", alignItems: "flex-end", padding: 15,
    backgroundColor: "#0F1E52", borderTopWidth: 1, borderTopColor: "#1E2F6E",
    gap: 12,
  },
  input: {
    flex: 1, backgroundColor: "#0B163F", borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 10, color: "#FFFFFF",
    fontSize: 16, borderWidth: 1, borderColor: "#1E2F6E",
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#5A2EFF", alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#1E2F6E", opacity: 0.6 },
});
