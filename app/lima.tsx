import React, { useState, useRef, useEffect } from "react";
1	import {
2	  View, Text, TextInput, TouchableOpacity, FlatList,
3	  StyleSheet, KeyboardAvoidingView, Platform,
4	  ActivityIndicator, ImageBackground, Dimensions,
5	  Keyboard,
6	} from "react-native";
7	import { useRouter } from "expo-router";
8	import { ScreenContainer } from "@/components/screen-container";
9	import { IconSymbol } from "@/components/ui/icon-symbol";
10	import { trpc } from "@/lib/trpc";
11	import * as Haptics from "expo-haptics";
12	import { LinearGradient } from "expo-linear-gradient";
13	
14	const { width } = Dimensions.get("window");
15	const BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663754068156/nNzxJg6WLQ2ETcJGtUs2Tj/game-background-gjnWzgDJS6PVKxwwfioQky.webp";
16	
17	interface Message {
18	  id: string;
19	  text: string;
20	  from: "user" | "akrep";
21	  timestamp: Date;
22	}
23	
24	export default function AkrepZekaScreen() {
25	  const router = useRouter();
26	  const [messages, setMessages] = useState<Message[]>([
27	    { 
28	      id: "0", 
29	      text: "Selam! Ben AKREP ZEKA. Seninle her konuda konuşabilir, strateji geliştirebilir veya sadece dertleşebilirim. 🦂", 
30	      from: "akrep",
31	      timestamp: new Date()
32	    },
33	  ]);
34	  const [input, setInput] = useState("");
35	  const [isTyping, setIsTyping] = useState(false);
36	  const listRef = useRef<FlatList>(null);
37	  
38	  // tRPC mutation with safety check
39	  const chatMutation = trpc.ai.chat.useMutation({
40	    onError: (err) => {
41	      console.error("tRPC Error:", err);
42	      addAkrepMessage("Bağlantımda bir parazit oluştu. Tekrar dener misin? 🦂");
43	    }
44	  });
45	
46	  const addAkrepMessage = (text: string) => {
47	    const msg: Message = { 
48	      id: Date.now().toString(), 
49	      text, 
50	      from: "akrep",
51	      timestamp: new Date()
52	    };
53	    setMessages(prev => [...prev, msg]);
54	    setIsTyping(false);
55	  };
56	
57	  const sendMessage = async () => {
58	    const text = input.trim();
59	    if (!text || isTyping) return;
60	    
61	    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
62	    
63	    const userMsg: Message = { id: Date.now().toString(), text, from: "user", timestamp: new Date() };
64	    setMessages(prev => [...prev, userMsg]);
65	    setInput("");
66	    setIsTyping(true);
67	    Keyboard.dismiss();
68	
69	    try {
70	      const history = messages.slice(-10).map(m => ({
71	        role: m.from === "user" ? "user" as const : "assistant" as const,
72	        content: m.text
73	      }));
74	
75	      const response = await chatMutation.mutateAsync({
76	        messages: [...history, { role: "user", content: text }]
77	      });
78	
79	      if (response && response.content) {
80	        addAkrepMessage(response.content);
81	      } else {
82	        addAkrepMessage("Derin düşüncelere daldım, ama bir cevap bulamadım. 🦂");
83	      }
84	    } catch (error) {
85	      console.error("AKREP ZEKA Chat Error:", error);
86	      // Error handled by mutation onError or here
87	    }
88	  };
89	
90	  useEffect(() => {
91	    if (messages.length > 0) {
92	      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
93	    }
94	  }, [messages, isTyping]);
95	
96	  return (
97	    <ImageBackground source={{ uri: BG_URL }} style={styles.container}>
98	      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
99	        <KeyboardAvoidingView 
100	          style={{ flex: 1 }} 
101	          behavior={Platform.OS === "ios" ? "padding" : undefined}
102	          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
103	        >
104	          {/* Header */}
105	          <View style={styles.header}>
106	            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
107	              <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
108	            </TouchableOpacity>
109	            <View style={styles.headerInfo}>
110	              <Text style={styles.headerTitle}>AKREP ZEKA</Text>
111	              <View style={styles.statusRow}>
112	                <View style={styles.onlineDot} />
113	                <Text style={styles.statusText}>Çevrimiçi</Text>
114	              </View>
115	            </View>
116	            <View style={styles.headerAvatar}>
117	              <Text style={{ fontSize: 24 }}>🦂</Text>
118	            </View>
119	          </View>
120	
121	          {/* Chat Body */}
122	          <FlatList
123	            ref={listRef}
124	            data={messages}
125	            keyExtractor={m => m.id}
126	            contentContainerStyle={styles.chatList}
127	            renderItem={({ item }) => (
128	              <View style={[styles.bubbleWrapper, item.from === "user" ? styles.userWrapper : styles.akrepWrapper]}>
129	                {item.from === "akrep" && (
130	                  <View style={styles.miniAvatar}>
131	                    <Text style={{ fontSize: 12 }}>🦂</Text>
132	                  </View>
133	                )}
134	                <View style={[styles.bubble, item.from === "user" ? styles.userBubble : styles.akrepBubble]}>
135	                  <Text style={[styles.bubbleText, item.from === "user" ? styles.userText : styles.akrepText]}>
136	                    {item.text}
137	                  </Text>
138	                  <Text style={styles.timeText}>
139	                    {item.timestamp.getHours().toString().padStart(2, '0')}:
140	                    {item.timestamp.getMinutes().toString().padStart(2, '0')}
141	                  </Text>
142	                </View>
143	              </View>
144	            )}
145	            ListFooterComponent={isTyping ? (
146	              <View style={styles.typingIndicator}>
147	                <Text style={styles.typingText}>Akrep Zeka yazıyor...</Text>
148	                <ActivityIndicator size="small" color="#FF00FF" style={{ marginLeft: 8 }} />
149	              </View>
150	            ) : null}
151	          />
152	
153	          {/* Input Panel */}
154	          <View style={styles.inputPanel}>
155	            <View style={styles.inputContainer}>
156	              <TextInput
157	                style={styles.input}
158	                value={input}
159	                onChangeText={setInput}
160	                placeholder="Bir şeyler sor..."
161	                placeholderTextColor="rgba(255,255,255,0.4)"
162	                multiline
163	              />
164	              <TouchableOpacity 
165	                style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
166	                onPress={sendMessage}
167	                disabled={!input.trim() || isTyping}
168	              >
169	                <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
170	              </TouchableOpacity>
171	            </View>
172	          </View>
173	        </KeyboardAvoidingView>
174	      </ScreenContainer>
175	    </ImageBackground>
176	  );
177	}
178	
179	const styles = StyleSheet.create({
180	  container: { flex: 1 },
181	  header: {
182	    flexDirection: "row", alignItems: "center", padding: 16,
183	    backgroundColor: "rgba(15, 30, 82, 0.9)",
184	    borderBottomWidth: 1, borderBottomColor: "rgba(255, 0, 255, 0.3)",
185	  },
186	  backBtn: { width: 40, height: 40, justifyContent: "center" },
187	  headerInfo: { flex: 1, marginLeft: 8 },
188	  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 1 },
189	  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
190	  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E", marginRight: 6 },
191	  statusText: { color: "#22C55E", fontSize: 11, fontWeight: "700" },
192	  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,0,255,0.1)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FF00FF" },
193	  
194	  chatList: { padding: 16, paddingBottom: 20 },
195	  bubbleWrapper: { flexDirection: "row", marginBottom: 16, maxWidth: "85%" },
196	  userWrapper: { alignSelf: "flex-end", flexDirection: "row-reverse" },
197	  akrepWrapper: { alignSelf: "flex-start" },
198	  miniAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(255,0,255,0.2)", alignItems: "center", justifyContent: "center", marginRight: 8, marginTop: 4 },
199	  bubble: { padding: 12, borderRadius: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
200	  userBubble: { backgroundColor: "#5A2EFF", borderTopRightRadius: 4 },
201	  akrepBubble: { backgroundColor: "rgba(15, 30, 82, 0.9)", borderTopLeftRadius: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
202	  bubbleText: { fontSize: 15, lineHeight: 22 },
203	  userText: { color: "#FFFFFF" },
204	  akrepText: { color: "#E0E0E0" },
205	  timeText: { fontSize: 9, color: "rgba(255,255,255,0.4)", alignSelf: "flex-end", marginTop: 4 },
206	  
207	  typingIndicator: { flexDirection: "row", alignItems: "center", marginLeft: 48, marginBottom: 16 },
208	  typingText: { color: "#FF00FF", fontSize: 12, fontWeight: "600" },
209	  
210	  inputPanel: { padding: 16, backgroundColor: "rgba(15, 30, 82, 0.95)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
211	  inputContainer: { flexDirection: "row", alignItems: "flex-end", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
212	  input: { flex: 1, color: "#FFFFFF", fontSize: 15, maxHeight: 100, paddingTop: 8, paddingBottom: 8 },
213	  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FF00FF", alignItems: "center", justifyContent: "center", marginLeft: 8 },
214	  sendBtnDisabled: { backgroundColor: "rgba(255,255,255,0.1)" }
215	});
216	
