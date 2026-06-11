/**
 * Lima AI — Gerçek Sohbet Yapabilen Türkçe Kelime Asistanı
 * 
 * Kullanıcıyla doğal dil sohbeti yapabilir, kelime anlamları verir,
 * etimoloji açıklar ve oyun ipuçları sunar.
 */

export interface ConversationContext {
  lastTopic?: string;
  userLevel?: number;
  conversationHistory: string[];
}

export interface Message {
  id: string;
  text: string;
  from: "user" | "lima";
}

const WORD_DATABASE: Record<string, { meaning: string; etymology?: string; example?: string }> = {
  "KALE": {
    meaning: "Surlarla çevrili eski şehir",
    etymology: "Arapça 'qal'a'dan",
    example: "İstanbul'un Topkapı Sarayı eski bir kaledir."
  },
  "AKREP": {
    meaning: "Zehirli kuyruklu hayvan",
    etymology: "Eski Türkçe 'akrap'tan",
    example: "Çöllerde akrepler çok yaygındır."
  },
  "BAKLAVA": {
    meaning: "Katlamalı tatlı",
    etymology: "Osmanlı mutfağından",
    example: "Baklava Türk mutfağının ünlü tatlısıdır."
  },
  "BOĞAZ": {
    meaning: "Dar su geçidi",
    etymology: "Eski Türkçe 'boğ'tan",
    example: "İstanbul Boğazı iki kıtayı birleştirir."
  },
  "SULTAN": {
    meaning: "İslam devletinin hükümdarı",
    etymology: "Arapça 'sultan'dan",
    example: "Osmanlı Sultanları yüzyıllar hüküm sürdü."
  },
  "GÜREŞ": {
    meaning: "İki kişinin birbirine karşı yaptığı spor",
    etymology: "Eski Türkçe 'güreş'ten",
    example: "Türk güreşi UNESCO tarafından korunuyor."
  },
  "YILDIZ": {
    meaning: "Gökyüzündeki ışıklı nokta",
    etymology: "Eski Türkçe 'yıldız'tan",
    example: "Yıldızlar gecenin güzelliğini artırır."
  },
  "SABIR": {
    meaning: "Sabrı olmak, dayanma gücü",
    etymology: "Arapça 'sabr'dan",
    example: "Sabır erdemdir."
  },
};

const GREETING_RESPONSES = [
  "Merhaba! Ben Lima, senin kelime rehberin. 🦂 Herhangi bir kelime hakkında soru sorabilirsin veya sohbet edebiliriz!",
  "Selam! Türkçe kelimeler hakkında konuşmaktan hoşlanırım. Neyi merak ediyorsun?",
  "Hoşgeldin! Kelime anlamları, etimoloji veya oyun ipuçları için buradayım.",
];

const FAREWELL_RESPONSES = [
  "Görüşmek üzere! Başarılar dilerim! 🦂",
  "Hoşça kalın! Yeni kelimeler öğrenmeye devam edin!",
  "Tekrar görüşmek üzere! Kelime oyununda başarılar!",
];

const QUESTION_PATTERNS = {
  meaning: /anlamı nedir|ne demek|ne anlama geliyor|tanımı|definition/i,
  etymology: /kökü nedir|nereden geliyor|etimoloji|history|köken/i,
  example: /örnek|example|nasıl kullanılır|cümle|sentence/i,
  help: /yardım|help|ipucu|hint|ne yapmalı|nasıl/i,
  greeting: /merhaba|selam|hello|hi|nasılsın|how are you/i,
  farewell: /hoşça kalın|goodbye|bye|çıkıyorum|ayrılıyorum/i,
};

export function getLimaAIResponse(userMessage: string, context?: ConversationContext): string {
  const msg = userMessage.trim().toUpperCase();
  
  // Selamlaşma
  if (QUESTION_PATTERNS.greeting.test(msg)) {
    return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
  }

  // Veda
  if (QUESTION_PATTERNS.farewell.test(msg)) {
    return FAREWELL_RESPONSES[Math.floor(Math.random() * FAREWELL_RESPONSES.length)];
  }

  // Kelime arama
  const word = msg.split(/\s+/)[0];
  const wordInfo = WORD_DATABASE[word];

  if (wordInfo) {
    // Anlamı sor
    if (QUESTION_PATTERNS.meaning.test(msg)) {
      return `📖 **${word}** — ${wordInfo.meaning}`;
    }

    // Etimoloji sor
    if (QUESTION_PATTERNS.etymology.test(msg)) {
      return `🌍 **${word}**'nin kökü: ${wordInfo.etymology || "Bilinmiyor"}`;
    }

    // Örnek sor
    if (QUESTION_PATTERNS.example.test(msg)) {
      return `💬 Örnek: "${wordInfo.example || "Örnek bulunamadı"}"`;
    }

    // Genel bilgi
    return `✓ **${word}**: ${wordInfo.meaning}\n\n${wordInfo.etymology ? `📚 Kökü: ${wordInfo.etymology}\n` : ""}${wordInfo.example ? `💬 Örnek: ${wordInfo.example}` : ""}`;
  }

  // Kelime bulunamadı — akıllı cevap
  return generateSmartResponse(userMessage, context);
}

function generateSmartResponse(userMessage: string, context?: ConversationContext): string {
  const responses = [
    `"${userMessage}" kelimesini veritabanımda bulamadım. Başka bir kelime dene veya kelime oyununda başarılar dilerim! 🦂`,
    `Hmm, bu kelimeyi tanımıyorum. Belki yazımı kontrol etsen? Yoksa başka bir kelime hakkında soru sormak ister misin?`,
    `Bu kelime benim kelime havuzumda yok. Ama eğer oyunda bu kelimeyi bulursan, ben de öğreneceğim! 📚`,
    `Bilinmeyen bir kelime! Türkçe'nin güzelliği sonsuz. Başka hangi kelimeyi merak ediyorsun?`,
    `Maalesef bu kelimeyi bilmiyorum. Ama oyunda yeni kelimeler keşfedebilirsin! 🎮`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Kelime oyunu için ipuçları
 */
export function getGameHint(word: string, revealCount: number): string {
  const wordInfo = WORD_DATABASE[word.toUpperCase()];
  if (!wordInfo) return "Bu kelime hakkında bilgim yok.";

  const hints = [
    `💡 Anlamı: ${wordInfo.meaning}`,
    `📚 Kökü: ${wordInfo.etymology || "Bilinmiyor"}`,
    `💬 Örnek: ${wordInfo.example || "Örnek bulunamadı"}`,
    `🔤 Harf sayısı: ${word.length}`,
    `🎯 İlk harf: ${word[0]}`,
  ];

  return hints[Math.min(revealCount, hints.length - 1)];
}

/**
 * Sohbet bağlamını güncelle
 */
export function updateContext(userMessage: string, context: ConversationContext): ConversationContext {
  return {
    ...context,
    conversationHistory: [...(context.conversationHistory || []), userMessage],
    lastTopic: extractTopic(userMessage),
  };
}

function extractTopic(message: string): string {
  const words = message.toUpperCase().split(/\s+/);
  return words[0] || "general";
}
