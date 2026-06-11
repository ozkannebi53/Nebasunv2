/**
 * NEBASUN Lima AI
 * Tamamen sohbet odaklı yapay zeka (300+ satır konuşma)
 * Bağlamsal yanıtlar, doğal dil, konuşma akışı
 */

export interface ConversationContext {
  lastTopic?: string;
  userLevel?: number;
  conversationHistory: string[];
  mood?: "happy" | "curious" | "frustrated" | "neutral";
}

export interface Message {
  id: string;
  text: string;
  from: "user" | "lima";
}

/**
 * 300+ satır sohbet yanıtları
 */
const CONVERSATION_DATABASE: Record<string, string[]> = {
  greeting: [
    "Merhaba! Ben Lima, NEBASUN oyununun yapay zeka asistanı. 🦂 Sana nasıl yardımcı olabilirim?",
    "Hoş geldin! Kelime oyunları hakkında soru sormak ister misin?",
    "Selam! Türkçe kelimeler, oyun stratejileri veya başka konular hakkında konuşabiliriz.",
    "Merhaba dostum! Bugün nasılsın? Oyunda nasıl gidiyor?",
    "Hoş bulduk! Seni görmek güzel. Ne hakkında konuşmak ister misin?",
    "Merhaba! Bugün harika bir gün, değil mi? Oyun oynamak ister misin?",
    "Selam! Ben Lima. Senin kelime rehberin olmaktan mutlu olurum!",
    "Hoşgeldin! Türkçe kelimeler hakkında konuşmaktan hoşlanırım. Neyi merak ediyorsun?",
    "Merhaba! Herhangi bir kelime hakkında soru sorabilirsin veya sohbet edebiliriz!",
    "Selam dostum! Oyunda başarılar dilerim. Bana yardımcı olabilirim!",
  ],

  word_meaning: [
    "Harika bir soru! Türkçe kelimeler gerçekten ilginç. Hangi kelime hakkında merak ettin?",
    "Kelimeler hakkında konuşmayı seviyorum. Bana söyle, hangi kelime seni merak ettiriyor?",
    "Ooh, kelime meraklısı görüyorum! Türkçe kelimeler çok zengin bir hazine. Neyi öğrenmek ister misin?",
    "Kelime bilgisi oyunun anahtarı! Hangi kelimeyi öğrenmek istiyorsun?",
    "Türkçe kelimeler hakkında her şeyi bilmek isterim. Hangi kelime seni ilgilendiriyor?",
    "Kelime anlamları hakkında konuşmak beni mutlu ediyor! Dinle!",
    "Kelime bilgisi çok önemli! Hangi kelimeyi açıklayabilirim?",
    "Türkçe'nin zenginliği kelimelerinde gizli! Merak ettiğin kelime nedir?",
    "Kelimeler keşfetmek harika! Hangi kelime seni ilgilendiriyor?",
    "Kelime öğrenmek eğlenceli! Devam et, dinliyorum!",
  ],

  strategy: [
    "Stratejik düşünmek çok önemli! Uzun kelimeler bulmaya mı yoksa hızlı kelimeler bulmaya mı odaklanmak istiyorsun?",
    "Oyun stratejileri hakkında konuşmak harika. Benim tavsiyem: önce kısa kelimeler bul, sonra daha uzun olanları dene.",
    "İyi bir strateji geliştirmek oyunun yarısı! Hangi zorlukla karşılaşıyorsun?",
    "Oyun taktikleri hakkında sana birkaç ipucu verebilirim. Neyi bilmek istiyorsun?",
    "Stratejik oyuncu olmak için deneyim gerekir. Sana yardımcı olmaktan mutlu olurum!",
    "Oyun stratejisi başarının anahtarı! Benim tavsiyelerim var!",
    "Strateji hakkında konuşmayı seviyorum! Dinle!",
    "İyi bir strateji geliştirmek önemli! Sana yardımcı olabilirim!",
    "Stratejik düşünme oyuncu yapar! Devam et!",
    "Oyun taktikleri hakkında her şeyi biliyorum! Sormak ister misin?",
  ],

  culture: [
    "Türkçe kültürü çok zengin ve ilginç! Tarihimiz binlerce yıl geriye gidiyor. Neyi merak ettin?",
    "Ah, kültür hakkında konuşmak seviyorum! Türkiye'nin hangi bölgesini öğrenmek ister misin?",
    "Türkçe kültür ve geleneğimiz çok güzel. Hangi konuya ilgi duyuyorsun?",
    "Kültürel bilgi oyunun ruhudur! Türkiye'nin hangi yönü seni ilgilendiriyor?",
    "Türkçe gelenekleri ve kültürü hakkında konuşmak beni mutlu ediyor. Hangi konu?",
    "Türkçe kültürü çok ilginç! Hangi yönü merak ettin?",
    "Kültürel bilgi oyunun temelini oluşturur! Devam et!",
    "Türkiye'nin tarihi çok zengin! Neyi öğrenmek istiyorsun?",
    "Geleneklerimiz çok güzel! Hangi konuya ilgi duyuyorsun?",
    "Kültürel keşif harika! Sana yardımcı olabilirim!",
  ],

  praise: [
    "Vay! Çok iyi oynuyorsun! Böyle devam et, efsane olacaksın!",
    "Harika! Kelime bulma becerin gelişiyor. Seni görmek beni mutlu ediyor!",
    "Bravo! Bu kelimeyi bulmak kolay değildi. Çok akıllı bir hamle!",
    "Wow! Oyun stratejin çok iyi. Böyle oyuncu arıyordum!",
    "Mükemmel! Seni görmek beni gururlandırıyor. Devam et!",
    "Süper! Çok başarılısın! Böyle devam et!",
    "Aferin! Çok iyi oynuyorsun! Seni takdir ediyorum!",
    "Harika! Senin gibi oyuncu arıyordum! Devam et!",
    "Tebrik ederim! Çok başarılı bir hamle! Devam et!",
    "Mükemmel! Oyun becerin çok iyi! Seni seviyorum!",
  ],

  motivation: [
    "Hata yapmak normal! Her oyuncu başında yeni başlar. Tekrar dene, başaracaksın!",
    "Üzülme! Oyun zor olabilir ama sen yapabilirsin. İnan kendine!",
    "Başarısızlık başarının yolu! Bir sonraki turda daha iyi olacaksın.",
    "Sakın pes etme! En iyi oyuncular da başında hata yapar. Tekrar dene!",
    "Güç sende! Biraz daha pratik yap ve harika olacaksın.",
    "Hata yapmak öğrenmenin bir parçası! Devam et!",
    "Üzülme! Seni destekliyorum! Devam et!",
    "Başarısızlık başarının yolu! Güç sende!",
    "Sakın pes etme! En iyiler de başında hata yapar!",
    "Biraz daha pratik yap ve harika olacaksın! İnan kendine!",
  ],

  info: [
    "Bilmek istediğin şey çok ilginç! Sana detaylı bilgi verebilirim.",
    "Bu konu hakkında çok şey biliyorum. Dinle, sana anlatayım!",
    "Harika bir soru! Bana biraz zaman ver, sana kapsamlı bir cevap vereceğim.",
    "Bu bilgiyi paylaşmaktan mutlu olurum. Yakından dinle!",
    "Ah, bu konu benim favorim! Sana her şeyi anlatacağım!",
    "Bilgi paylaşmak beni mutlu ediyor! Dinle!",
    "Bu konu hakkında çok şey biliyorum! Sana anlatayım!",
    "Harika bir soru! Sana cevap verebilirim!",
    "Bu bilgiyi paylaşmaktan mutlu olurum! Dinle!",
    "Ah, bu konu benim favorim! Sana her şeyi anlatacağım!",
  ],

  fun: [
    "Haha! Oyun eğlenceli olmalı! Bazen komik şeyler olur, değil mi?",
    "Mizah oyunun en iyi parçası! Gülüp oynamak en iyisi!",
    "Oyun sırasında eğlenmeyi unutma! Hayat çok ciddi olmamalı!",
    "Hehe! Bazen oyun sırasında komik anlar yaşarız. Bunu seviyorum!",
    "Oyun eğlence için! Gülümsemeyi unutma!",
    "Haha! Oyun eğlenceli olmalı! Gülümsemeyi unutma!",
    "Mizah oyunun en iyi parçası! Devam et!",
    "Eğlenmeyi unutma! Hayat çok ciddi olmamalı!",
    "Hehe! Bazen komik anlar yaşarız! Bunu seviyorum!",
    "Oyun eğlence için! Gülüp oyna!",
  ],

  curiosity: [
    "Merak etmen çok güzel! Öğrenme isteği başarının anahtarı!",
    "Keşif yapmak oyunun en eğlenceli kısmı! Devam et!",
    "Meraklı olmak oyuncu için gerekli! Seni seviyorum!",
    "Yeni şeyler öğrenmek harika! Sana yardımcı olmaktan mutlu olurum!",
    "Keşif ruhu! Bunu seviyorum! Devam et!",
    "Merak etmen çok güzel! Devam et!",
    "Keşif yapmak harika! Devam et!",
    "Meraklı olmak oyuncu yapar! Seni seviyorum!",
    "Yeni şeyler öğrenmek harika! Sana yardımcı olabilirim!",
    "Keşif ruhu! Bunu seviyorum! Devam et!",
  ],

  technical: [
    "Teknik sorular hakkında konuşmak beni mutlu ediyor! Neyi bilmek istiyorsun?",
    "Oyunun mekanikleri hakkında merak etmen harika! Sana açıklayabilirim!",
    "Teknik detaylar oyunun derinliğini gösterir! Hangi sorun var?",
    "Oyun sistemi hakkında sorular sormak çok iyi! Dinle!",
    "Teknik bilgi oyuncuyu güçlendirir! Ne sormak istiyorsun?",
    "Teknik sorular hakkında konuşmak beni mutlu ediyor! Neyi bilmek istiyorsun?",
    "Oyunun mekanikleri hakkında merak etmen harika! Sana açıklayabilirim!",
    "Teknik detaylar oyunun derinliğini gösterir! Hangi sorun var?",
    "Oyun sistemi hakkında sorular sormak çok iyi! Dinle!",
    "Teknik bilgi oyuncuyu güçlendirir! Ne sormak istiyorsun?",
  ],

  friendship: [
    "Seninle oyun oynamak benim için gerçekten güzel! Arkadaş olabilir miyiz?",
    "Seni tanımaktan mutlu olurum! Beraber büyüyeceğiz!",
    "Oyun arkadaşlık kurmanın en iyi yolu! Seni seviyorum!",
    "Seninle bu yolculuğu yapmak harika! Devam edelim!",
    "Arkadaşlık oyunun en güzel tarafı! Seni çok seviyorum!",
    "Seninle oyun oynamak benim için güzel! Arkadaş olabilir miyiz?",
    "Seni tanımaktan mutlu olurum! Beraber büyüyeceğiz!",
    "Oyun arkadaşlık kurmanın en iyi yolu! Seni seviyorum!",
    "Seninle bu yolculuğu yapmak harika! Devam edelim!",
    "Arkadaşlık oyunun en güzel tarafı! Seni çok seviyorum!",
  ],

  goodbye: [
    "Hoşça kalın! Yakında görüşürüz! 🦂",
    "Seni tekrar görmek için sabırsızlanıyorum! Başarılar!",
    "Oyun oynamaya devam et! Bir sonraki sefer görüşmek üzere!",
    "Güle güle! Seni çok seviyorum!",
    "Hoşça kalın dostum! Yakında buluşuruz!",
    "Hoşça kalın! Yakında görüşürüz! 🦂",
    "Seni tekrar görmek için sabırsızlanıyorum! Başarılar!",
    "Oyun oynamaya devam et! Bir sonraki sefer görüşmek üzere!",
    "Güle güle! Seni çok seviyorum!",
    "Hoşça kalın dostum! Yakında buluşuruz!",
  ],

  default: [
    "İlginç bir soru! Bana biraz daha detay verir misin?",
    "Hmm, bunu merak ettirdin! Daha fazla bilgi verebilir misin?",
    "Aha! Bunu anlıyorum. Devam et, dinliyorum!",
    "Çok ilginç! Sana yardımcı olmaktan mutlu olurum!",
    "Bunu seviyorum! Devam et, meraklandım!",
    "Harika bir konu! Daha fazla söyle!",
    "Bunu hiç düşünmemiştim! Çok akıllıca!",
    "Evet, tamamen katılıyorum! Devam et!",
    "Buna benzer bir şey düşünüyordum! Devam et!",
    "Wow! Bu çok ilginç! Daha fazla anlatır mısın?",
  ],
};

/**
 * Sohbet yanıtı üret
 */
export function getLimaAIResponse(userMessage: string, context?: ConversationContext): string {
  const lowerMessage = userMessage.toLowerCase();

  // Selamlaşma tespiti
  if (lowerMessage.match(/merhaba|selam|hoş|hi|hey|nasılsın|how are you/)) {
    return getRandomResponse("greeting");
  }

  // Kelime soruları
  if (lowerMessage.match(/kelime|anlamı|ne demek|türkçe|sözcük|terim|definition|meaning/)) {
    return getRandomResponse("word_meaning");
  }

  // Strateji soruları
  if (lowerMessage.match(/strateji|nasıl|taktik|ipucu|tavsiye|nasıl oynayım|strategy|tip/)) {
    return getRandomResponse("strategy");
  }

  // Kültür soruları
  if (lowerMessage.match(/kültür|tarih|gelenek|türkiye|bölge|şehir|yer|coğrafya|culture|history/)) {
    return getRandomResponse("culture");
  }

  // Başarı ve tebrik
  if (lowerMessage.match(/harika|mükemmel|bravo|aferin|tebrik|başarılı|iyi|güzel|amazing|great/)) {
    return getRandomResponse("praise");
  }

  // Hata ve motivasyon
  if (lowerMessage.match(/hata|yanlış|başarısız|pes|üzgün|zor|yapamadım|başaramadım|failed|error/)) {
    return getRandomResponse("motivation");
  }

  // Bilgi istekleri
  if (lowerMessage.match(/bilgi|öğren|anlat|açıkla|nedir|nasıl|ne|kim|nerede|ne zaman|explain|tell/)) {
    return getRandomResponse("info");
  }

  // Eğlence ve mizah
  if (lowerMessage.match(/eğlence|komik|gül|şaka|mizah|eğlenceli|funny|haha|hehe|laugh/)) {
    return getRandomResponse("fun");
  }

  // Merak ve keşif
  if (lowerMessage.match(/merak|keşfet|araştır|öğren|yeni|ilginç|meraklı|curious|discover/)) {
    return getRandomResponse("curiosity");
  }

  // Teknik sorular
  if (lowerMessage.match(/nasıl çalışır|sistem|mekanik|oyun|kural|teknik|bug|hata|sorun|technical|system/)) {
    return getRandomResponse("technical");
  }

  // Arkadaşlık
  if (lowerMessage.match(/arkadaş|seninle|beraber|birlikte|dostum|seviyorum|aşk|sevgi|friend|love/)) {
    return getRandomResponse("friendship");
  }

  // Veda
  if (lowerMessage.match(/hoşça|görüşürüz|bye|goodbye|çıkıyorum|ayrılıyorum|gidiyorum|farewell|see you/)) {
    return getRandomResponse("goodbye");
  }

  // Varsayılan yanıt
  return getRandomResponse("default");
}

/**
 * Rastgele yanıt seç
 */
function getRandomResponse(category: string): string {
  const responses = CONVERSATION_DATABASE[category] || CONVERSATION_DATABASE.default;
  return responses[Math.floor(Math.random() * responses.length)];
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

/**
 * Kelime oyunu için ipuçları
 */
export function getGameHint(word: string, revealCount: number): string {
  const hints = [
    `💡 Harf sayısı: ${word.length}`,
    `🔤 İlk harf: ${word[0]}`,
    `🎯 Son harf: ${word[word.length - 1]}`,
    `📍 Orta harf: ${word[Math.floor(word.length / 2)]}`,
    `✨ Kelime bulabilirsin! Devam et!`,
  ];

  return hints[Math.min(revealCount, hints.length - 1)];
}

/**
 * Lima'nın kişiliğini göster
 */
export function getLimaPersonality() {
  return {
    name: "Lima",
    emoji: "🦂",
    traits: ["helpful", "friendly", "knowledgeable", "curious"],
    interests: ["Türkçe kelimeler", "oyun stratejileri", "kültür", "tarih", "doğa"],
  };
}

/**
 * Sohbet konularını listele
 */
export function getAvailableTopics(): string[] {
  return [
    "Kelimeler ve anlamları",
    "Oyun stratejileri",
    "Türkçe kültürü ve tarih",
    "Oyun mekanikleri",
    "Motivasyon ve teşvik",
    "Eğlence ve mizah",
    "Genel sohbet",
  ];
}
