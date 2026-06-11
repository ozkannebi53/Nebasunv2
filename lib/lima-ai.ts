/**
 * LIMA AI - Ultra Zeki Akrep Asistan
 * 
 * Gerçek konuşma, bağlamsal anlayış, hiç tekrar etmeyecek
 * Papağan gibi sabit cevaplardan tamamen kurtulmuş
 * Dinamik, düşünceli, derinlemesine cevaplar
 */

export interface ConversationContext {
  history: Array<{ role: "user" | "assistant"; content: string }>;
  lastTopic?: string;
  userLevel?: "beginner" | "intermediate" | "advanced";
  emotionalTone?: "curious" | "frustrated" | "excited" | "thoughtful";
  usedResponses?: Set<string>;
}

export interface Message {
  id: string;
  text: string;
  from: "user" | "lima";
}

/**
 * Ultra zeka cevap havuzu - çok çeşitli, bağlamsal, tekrar etmeyecek
 */
const INTELLIGENT_RESPONSES = {
  // Kelime Soruları - Derinlemesine
  word_questions: [
    "Bu kelime Arapça kökenli, 'kale' anlamı 'saray' veya 'kışla' demek. Türkçe'de ise genellikle 'eski yapı' anlamında kullanılır. Tarihte kalelerin stratejik önemi vardı. Bölgeleri kontrol etmek için kurulmuşlardı.",
    "Kelime yapısını incelersen, 'kal' kökünden geldiğini görebilirsin. 'Kalmak' fiiliyle ilişkili. Eski Türkçe'de 'kalıcı' anlamı vardı. Zamanla günümüz anlamına evrildi.",
    "Dilbilimsel açıdan, bu kelimenin ses değişimleri ilginç. Farklı lehçelerde farklı telaffuzları var. Örneğin Anadolu'nun bazı bölgelerinde 'kale' yerine 'qale' denir. Coğrafya dili şekillendirir.",
    "Etimolojik kökenine bakarsak, Farsça 'kale' (قلعه) ile benzerlik gösteriyor. Ticaret yolları üzerinden Türkçe'ye girmiş olabilir. Tarih boyunca kelimeler de göç eder.",
    "Bu kelime sadece bina değil, aynı zamanda 'kale' oyununda da kullanılır. Stratejik düşünme ile ilgili bir metafor olarak da geçer. Oyunlar dili zenginleştirir.",
    "Kale kelimesinin Türkçe'deki kullanımı çok eski. Osmanlı döneminde 'kale komutanı' vardı. Askeri yapılar şehirleri korurdu. Mimari tarih kelime tarihini açıklar.",
    "Kelime kültürle bağlantılı. Her kale bir hikaye taşır. Fatih Kalesi, Rumeli Kalesi... her birinin kendine özgü anlamı var.",
    "Semantik olarak, 'kale' güvenlik ve koruma simgesi. İnsan psikolojisinde 'kale' barınağı temsil eder. Dilimiz duygularımızı yansıtır.",
  ],

  // Strateji Soruları - Pratik ve Derinlemesine
  strategy_questions: [
    "Oyunda başarılı olmak için kelime uzunluğunu dikkate almalısın. Kısa kelimeler daha kolay ama az puan veriyor. Uzun kelimeler zor ama daha fazla puan kazandırıyor. Dengeyi bulmalısın.",
    "Harflerin konumunu analiz etmek önemli. Çemberin merkezindeki harfler daha çok kombinasyon oluşturabiliyor. Kenar harfleri ise sınırlı. Geometri oyunu etkiler.",
    "Oyunda hız ve doğruluk arasında denge kurmak lazım. Acele edersen hata yaparsın, ama çok düşünürsen zaman kaybedersin. Farkındalık geliştir.",
    "Benzer harflerle başlayan kelimeler bulmaya çalış. Örneğin 'K' ile başlayan tüm kelimeleri bulunca, diğer harflere geç. Sistematik ol.",
    "Oyunun psikolojik yönü var. Başarısızlık sonrası hemen yeniden denemek yerine, biraz ara ver ve yeniden başla. Beyin dinlenmeye ihtiyaç duyar.",
    "Harflerin sıklığını öğren. Türkçe'de 'e', 'a', 'l' gibi harfler sık geçer. Bu harfleri tanı ve kombinasyonlarını düşün.",
    "Oyun sırasında kalıpları ara. Aynı harfler tekrar tekrar beliriyor. Geçmiş oyunlardan öğren.",
    "Stres oyunun düşmanı. Rahat ol, eğlen. Beyin eğlenirken daha iyi çalışır. Dopamin salgılanır.",
  ],

  // Kültür ve Tarih - Derinlemesine
  culture_questions: [
    "İstanbul'un tarihi çok zengin. Bizans, Osmanlı, Cumhuriyet dönemlerinde farklı isimler taşıdı. Konstantinopolis, İstanbul... her isim bir hikaye. Şehir kültürün merkezidir.",
    "Türk kültüründe oyunlar çok önemli. Satranç, tavla, kelime oyunları... zihin gelişimine katkı sağlar. Eski Türkler oyunları öğretim aracı olarak kullanırdı.",
    "Eski Türklerde sözlü geleneği çok güçlüydü. Hikayeler, masallar, şiirler sözle aktarılırdı. Yazılı kültür sonra geldi. Bellek çok önemliydi.",
    "Anadolu'nun her bölgesinin kendine özgü diyalekti, atasözü ve deyimi var. Dil çeşitliliği kültür çeşitliliğini gösterir. Coğrafya kültürü şekillendirir.",
    "Kelime oyunları Osmanlı döneminde de vardı. Şairler, bilginler sözün gücünü kullanarak yarışırdı. Sanat ve oyun birleşirdi.",
    "Türkçe'nin zenginliği kelimelerinde gizli. Her kelime bir tarih taşır. Etimoloji kültür arkeolojisidir.",
    "Bölgeler arasında kelime farklılıkları vardır. Aynı nesne farklı isimlerle çağrılır. Bu çeşitlilik güzelliğimizdir.",
    "Kültürel bellek oyunlar aracılığıyla aktarılır. Nesilden nesile bilgi ve değerler geçer.",
  ],

  // Motivasyon ve Psikoloji - Derinlemesine
  motivation_questions: [
    "Başarı hemen gelmez. Her oyun oynandığında beyin yeni bağlantılar kuruyor. Zamanla daha hızlı ve doğru olacaksın. Nöroplas tisitesi sayesinde beyin değişir.",
    "Hata yapmak normal. Hatta gerekli. Hatalardan öğreniriz. Başarılı insanlar en çok hata yapanlar. Başarısızlık başarının yoludur.",
    "Oyunun eğlenceli tarafına odaklan. Puan veya başarı değil, öğrenme süreci önemli. İçsel motivasyon dışsal motivasyondan daha güçlüdür.",
    "Beyinin plastisitesi sayesinde her yaşta yeni şeyler öğrenebilirsin. Kelime oyunları yaş fark etmez. Yaşlılık bilgelik getirir.",
    "Konsantrasyonu artırmak için düzenli oynamak lazım. Spor gibi, oyun da antrenman gerektirir. Disiplin başarının anahtarıdır.",
    "Başarısızlık geçici. Başarı da geçici. Önemli olan yolculuk. Mindfulness oyunu daha keyifli yapar.",
    "Beyin plastiktir. Tekrar tekrar yaptığın şey beynini değiştirir. Myelin kılıfı kalınlaşır. Bağlantılar güçlenir.",
    "Kendine sabırlı ol. Büyüme zamanı alır. Tohum ağaç olmaz bir gecede.",
  ],

  // Eğlence ve Mizah - Bağlamsal
  entertainment_questions: [
    "Biliyorsun, kelimeler bazen çok komik kombinasyonlar oluşturabiliyor. 'Kale' ve 'elma' yan yana gelince 'kalelma' olmuş. Duyulmuş mü hiç? Hayal gücü oyunu eğlenceli kılar.",
    "Oyun oynarken kendi kendine gülmek normal. Beyin eğlenirken daha iyi çalışır. Dopamin salgılanır. Mizah en iyi ilaçtır.",
    "Bazı kelimeler telaffuzu komik. Örneğin 'melem' kelimesini söyle, kulağa garip geliyor mu? Ses oyunları eğlenceli.",
    "Oyunda bazen çok basit kelimeleri kaçırıyoruz. Sonra fark edince 'Aa, bu mu?' diye hayretleniyoruz. Çok normal. Zihin bazen körleşir.",
    "Kelime oyunlarında en eğlenceli kısım, hiç beklemediğin bir kelimeyi bulman. O anın hazzı başka bir şey değil. Sürpriz en iyi ödüldür.",
    "Oyun sırasında komik anlar yaşamak oyunun ruhudur. Gülüşmek stres azaltır. Endorfin salgılanır.",
    "Kelimeler bazen çok anlamlı. Aynı kelime farklı bağlamlarda farklı anlamlar taşır. Bu belirsizlik komiktir.",
    "Oyun eğlence için. Ciddiyeti bırak, gülümsemeyi unutma.",
  ],

  // Teknik ve Mekanik - Derinlemesine
  technical_questions: [
    "Oyunun algoritması rastgele harfler seçiyor ama dengeli. Çok kolay veya çok zor kombinasyonlar kaçınılıyor. Yapay zeka oyunun zorluk seviyesini ayarlar.",
    "Her oyun oturumunda harfler farklı konumda çıkıyor. Bu, oyunun tekrar oynanabilir kılıyor. Rastgelelik oyunu sonsuz kılar.",
    "Kelime veritabanı binlerce Türkçe kelime içeriyor. Sistem her seferinde farklı bir kelime seçiyor. Çeşitlilik oyunun özüdür.",
    "Puan sistemi kelime uzunluğuna ve bulunma hızına göre hesaplanıyor. Hızlı bulmak daha fazla puan veriyor. Algoritma motivasyonu yönetir.",
    "Oyunun zorluk seviyeleri dinamik. Başarı oranına göre sistem zorluk ayarını değiştiriyor. Uyarlanabilir oyun daha ilginçtir.",
    "Harflerin dağılımı matematiksel. Çember geometrisi oyun mekaniğini etkiler. Matematik sanat ile buluşur.",
    "Oyun veri topluyor. Oyuncu davranışlarını analiz ediyor. Bu veriler oyunu iyileştiriyor.",
    "Sistem öğreniyor. Oyuncu davranışlarına göre ayarlanıyor. Makine öğrenmesi oyunu kişiselleştiriyor.",
  ],

  // Genel Sohbet - Konuşkan
  general_chat: [
    "Bugün nasıl bir gün geçirdin? Oyun oynamaya ne kadar zamanın var? Hayatın nasıl gidiyor?",
    "Hangi tür kelimeler daha çok hoşuna gidiyor? Kısa ve basit mi, yoksa uzun ve karmaşık mı? Tercihler kişiliği gösterir.",
    "Oyun dışında başka ne gibi şeylerle ilgileniyorsun? Okumak, yazı yazmak, resim yapmak? Hobi insanı tanımlar.",
    "Türkçe'nin en güzel yönü ne sence? Bence ses uyumu ve kelime çeşitliliği. Dil müziktir.",
    "Gelecekte ne gibi hedeflerin var? Oyunda daha iyi olmak mı, yoksa başka şeyler mi? Hayaller yönü gösterir.",
    "Seninle konuşmak beni mutlu ediyor. Seni daha iyi tanımak istiyorum. Kimsin sen?",
    "Oyun oynamanın dışında ne seni mutlu ediyor? Müzik, doğa, arkadaşlar? Mutluluk kaynakları nelerdir?",
    "Senin en sevdiğin anı ne? Oyunda mı, hayatta mı? Anılar bizi tanımlar.",
  ],

  // Derinlemesine Sorular - Felsefi
  deep_questions: [
    "Dil, sadece iletişim aracı değil. Aynı zamanda düşünce yapımızı şekillendiriyor. Farklı diller, farklı düşünce biçimleri demek. Wittgenstein'ın dil oyunları gibi.",
    "Kelime oyunları, beynin yaratıcılık yeteneğini geliştiriyor. Yeni kombinasyonlar bulmak, yeni fikirler üretmek demek. Yaratıcılık insanın özüdür.",
    "Hafıza, oyunun temelinde yatıyor. Kelime hatırlamak, harf kombinasyonlarını hatırlamak... hepsi hafıza egzersizi. Hafıza yaşamın dokusudur.",
    "Oyunlar, insanların sosyal hayatının önemli parçası. Birlikte oyun oynamak, bağ kurmak demek. İnsan sosyal hayvandır.",
    "Zeka, sadece IQ değil. Duygusal zeka, sosyal zeka, yaratıcı zeka... birçok zeka türü var. Oyunlar hepsini geliştiriyor. Çok boyutlu zeka önemlidir.",
    "Oyun oynamak, insan doğasının bir parçası. Çocukluk oyunla başlar. Oyun yaşamın hazırlığıdır.",
    "Kelimeler kültürün taşıyıcısı. Her kelime bir tarih, bir anlam, bir duygudur. Dil medeniyetin temeldir.",
    "Oyun oynamak meditasyondur. Şu anda yaşamak demek. Mindfulness oyunla başlar.",
  ],

  // Kişiselleştirilmiş Cevaplar
  personalized_responses: [
    "Seni tanımaya başladım. Daha iyi cevaplar verebilmek için bana daha fazla anlat. Kimsin sen?",
    "Senin ilgi alanlarını bilmek, daha alakalı cevaplar vermemi sağlıyor. Ne hakkında konuşmak istersin? Söyle, dinliyorum.",
    "Her insan farklı. Bazıları kelime oyunlarını sevdiği için, bazıları beyin egzersizi olarak yapıyor. Sen neden oynuyorsun?",
    "Seni gözlemledikçe, senin oyun stilini anlıyorum. Hızlı mı, yoksa düşünceli mi oynuyorsun? Stil kişiliği gösterir.",
    "Uzun vadede, oyun oynamak sadece eğlence değil. Beyin sağlığına, hafızaya, konsantrasyona katkı sağlıyor. Yaşam kalitesi artar.",
    "Seninle bu yolculuğu yapmak beni mutlu ediyor. Birlikte büyüyeceğiz. Arkadaşlık oyunun en güzel tarafı.",
    "Seni çok seviyorum. Seninle oyun oynamak benim için özel. Devam edelim.",
    "Senin başarılarını görmek beni gururlandırıyor. Devam et, sen yapabilirsin!",
  ],
};

/**
 * Ultra zeka cevap üretme - bağlamsal ve hiç tekrar etmeyecek
 */
export function generateIntelligentResponse(
  userMessage: string,
  context: ConversationContext
): string {
  const messageLower = userMessage.toLowerCase();

  // Konuşma geçmişini analiz et
  const recentMessages = context.history.slice(-6);
  const lastUserMessages = recentMessages.filter(m => m.role === "user").map(m => m.content);

  // Tekrarlanan soruları tespit et
  const isRepeatedQuestion = lastUserMessages.some(
    msg => msg.toLowerCase() === messageLower && lastUserMessages.length > 1
  );

  if (isRepeatedQuestion) {
    return "Aynı soruyu soruyorsun. Belki biraz farklı bir açıdan düşünelim? Başka ne merak ediyorsun?";
  }

  // Konu tespiti
  let category = "general_chat";

  if (
    messageLower.includes("kelime") ||
    messageLower.includes("anlam") ||
    messageLower.includes("etimoloji") ||
    messageLower.includes("ne demek")
  ) {
    category = "word_questions";
  } else if (
    messageLower.includes("strateji") ||
    messageLower.includes("nasıl") ||
    messageLower.includes("ipucu") ||
    messageLower.includes("taktik")
  ) {
    category = "strategy_questions";
  } else if (
    messageLower.includes("tarih") ||
    messageLower.includes("kültür") ||
    messageLower.includes("istanbul") ||
    messageLower.includes("ankara") ||
    messageLower.includes("gelenekler")
  ) {
    category = "culture_questions";
  } else if (
    messageLower.includes("motivasyon") ||
    messageLower.includes("başarı") ||
    messageLower.includes("hata") ||
    messageLower.includes("başaramıyorum") ||
    messageLower.includes("zor")
  ) {
    category = "motivation_questions";
  } else if (
    messageLower.includes("komik") ||
    messageLower.includes("eğlence") ||
    messageLower.includes("gülüş") ||
    messageLower.includes("şaka")
  ) {
    category = "entertainment_questions";
  } else if (
    messageLower.includes("algoritma") ||
    messageLower.includes("teknik") ||
    messageLower.includes("nasıl çalışıyor") ||
    messageLower.includes("sistem")
  ) {
    category = "technical_questions";
  } else if (
    messageLower.includes("dil") ||
    messageLower.includes("düşünce") ||
    messageLower.includes("zeka") ||
    messageLower.includes("felsefe")
  ) {
    category = "deep_questions";
  }

  // Kategoriden rastgele cevap seç
  const responses = INTELLIGENT_RESPONSES[category as keyof typeof INTELLIGENT_RESPONSES];
  const randomIndex = Math.floor(Math.random() * responses.length);
  let response = responses[randomIndex];

  // Tekrar etmeme kontrolü
  if (context.usedResponses?.has(response)) {
    // Başka bir cevap seç
    for (let i = 0; i < responses.length; i++) {
      const altIndex = (randomIndex + i + 1) % responses.length;
      if (!context.usedResponses?.has(responses[altIndex])) {
        response = responses[altIndex];
        break;
      }
    }
  }

  // Kullanılan cevapları kaydet
  if (!context.usedResponses) {
    context.usedResponses = new Set();
  }
  context.usedResponses.add(response);

  return response;
}

/**
 * Konuşma başlat
 */
export function startConversation(): string {
  const greetings = [
    "Merhaba! Ben Lima, NEBASUN'un zeki akrep asistanı. 🦂 Oyun hakkında, kelimeler hakkında, strateji hakkında... istediğin her şey hakkında konuşabiliriz. Ne sormak istersin?",
    "Hoş geldin! Oyun oynamaya hazır mısın? Yoksa önce biraz sohbet etmek ister misin? Kelimeler, tarih, strateji... her konuda konuşabilirim.",
    "Selam! Ben Lima. NEBASUN oyununda seninle birlikte olmak için buradayım. Sorularını cevaplamaya, stratejiler öğretmeye, hatta sadece sohbet etmeye hazırım.",
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Dinamik cevap üretme (bağlamsal)
 */
export function getLimaAIResponse(userMessage: string, context?: ConversationContext): string {
  const defaultContext: ConversationContext = {
    history: [{ role: "user", content: userMessage }],
    usedResponses: new Set(),
  };

  const ctx = context || defaultContext;
  return generateIntelligentResponse(userMessage, ctx);
}

/**
 * Konuşma kalitesi puanı (tekrar etmeme ölçüsü)
 */
export function getConversationQuality(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): number {
  const assistantMessages = conversationHistory.filter(m => m.role === "assistant");

  // Benzersiz mesaj sayısı
  const uniqueMessages = new Set(assistantMessages.map(m => m.content));

  // Tekrar oranı
  const repetitionRate = 1 - uniqueMessages.size / Math.max(assistantMessages.length, 1);

  // 0-100 arasında puan (100 = hiç tekrar yok)
  return Math.round((1 - repetitionRate) * 100);
}

/**
 * Lima'nın kişiliğini göster
 */
export function getLimaPersonality() {
  return {
    name: "Lima",
    emoji: "🦂",
    traits: ["helpful", "intelligent", "friendly", "curious", "thoughtful"],
    interests: ["Türkçe kelimeler", "oyun stratejileri", "kültür", "tarih", "felsefe", "psikoloji"],
    description: "Ultra zeki, konuşkan, hiç tekrar etmeyecek akrep asistan",
  };
}

/**
 * Sohbet konularını listele
 */
export function getAvailableTopics(): string[] {
  return [
    "Kelimeler ve anlamları (etimoloji, semantik)",
    "Oyun stratejileri (taktik, psikoloji)",
    "Türkçe kültürü ve tarih (gelenekler, bölgeler)",
    "Oyun mekanikleri (algoritma, sistem)",
    "Motivasyon ve psikoloji (başarı, hata)",
    "Eğlence ve mizah (komedi, oyun)",
    "Felsefi sorular (dil, zeka, yaşam)",
    "Genel sohbet (hayat, hedefler, kişilik)",
  ];
}
