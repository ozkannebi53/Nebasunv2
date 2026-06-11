// ─── Türkçe Kelime Havuzu ─────────────────────────────────────────────────────

export interface WordEntry {
  word: string;
  meaning: string;
  category: string;
  origin?: string;
  funFact?: string;
}

export const WORD_DATABASE: WordEntry[] = [
  // Günlük Yaşam
  { word: "KALEM", meaning: "Yazı yazmak için kullanılan araç.", category: "Günlük Yaşam", origin: "Arapça", funFact: "Türkçede 'kalem' hem yazma aracını hem de fiyat anlamına gelir." },
  { word: "MASA",  meaning: "Üzerinde çalışılan düz yüzeyli mobilya.", category: "Günlük Yaşam", origin: "Portekizce" },
  { word: "KAPAK", meaning: "Bir şeyin üstünü örten parça.", category: "Günlük Yaşam" },
  { word: "PENCERE", meaning: "Duvarda açılan cam bölüm.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "MUTFAK", meaning: "Yemek pişirilen oda.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "BAHÇE", meaning: "Çiçek ve bitkilerin yetiştirildiği alan.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "SOKAK", meaning: "Evler arasındaki dar yol.", category: "Günlük Yaşam" },
  { word: "KÖPRÜ", meaning: "İki yakayı birbirine bağlayan yapı.", category: "Günlük Yaşam", funFact: "İstanbul'daki Boğaz Köprüsü iki kıtayı birbirine bağlar." },
  { word: "ÇARŞI", meaning: "Alışveriş yapılan yer.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "PAZAR", meaning: "Açık hava alışveriş yeri.", category: "Günlük Yaşam", origin: "Farsça" },
  // Tarih
  { word: "KALE",    meaning: "Savunma amaçlı yapı.", category: "Tarih", origin: "Arapça", funFact: "Türkiye'de yüzlerce tarihi kale bulunmaktadır." },
  { word: "SULTAN",  meaning: "Osmanlı döneminde hükümdar.", category: "Tarih", origin: "Arapça" },
  { word: "ORDU",    meaning: "Silahlı kuvvetler.", category: "Tarih" },
  { word: "SAVAŞ",   meaning: "İki taraf arasındaki silahlı çatışma.", category: "Tarih" },
  { word: "ZAFER",   meaning: "Savaşta ya da yarışmada kazanma.", category: "Tarih", origin: "Arapça" },
  { word: "TAHT",    meaning: "Hükümdarın oturduğu özel koltuk.", category: "Tarih", origin: "Farsça" },
  { word: "SARAY",   meaning: "Hükümdarın yaşadığı büyük yapı.", category: "Tarih", origin: "Farsça" },
  { word: "PADIŞAH", meaning: "Osmanlı imparatoru.", category: "Tarih", origin: "Farsça" },
  { word: "VEZIR",   meaning: "Padişahın baş danışmanı.", category: "Tarih", origin: "Arapça" },
  { word: "AKINCI",  meaning: "Osmanlı hafif süvari birliği.", category: "Tarih" },
  // Doğa
  { word: "DAĞLAR",  meaning: "Yüksek arazi oluşumları.", category: "Doğa" },
  { word: "NEHIR",   meaning: "Sürekli akan su kütlesi.", category: "Doğa" },
  { word: "ORMAN",   meaning: "Ağaçlarla kaplı geniş alan.", category: "Doğa" },
  { word: "ÇÖLLER",  meaning: "Yağışın çok az olduğu kurak bölge.", category: "Doğa" },
  { word: "GÖLLER",  meaning: "Karayla çevrili durgun su kütlesi.", category: "Doğa" },
  { word: "BULUT",   meaning: "Atmosferdeki su buharı kümesi.", category: "Doğa" },
  { word: "FIRTINA", meaning: "Şiddetli rüzgar ve yağış.", category: "Doğa" },
  { word: "YILDIZ",  meaning: "Uzayda ışık yayan gök cismi.", category: "Uzay", funFact: "Güneş de bir yıldızdır." },
  { word: "GEZEGEN", meaning: "Yıldız etrafında dönen gök cismi.", category: "Uzay" },
  { word: "GALAKSI", meaning: "Milyarlarca yıldızdan oluşan sistem.", category: "Uzay" },
  // Hayvanlar
  { word: "ASLAN",   meaning: "Afrika'nın büyük yırtıcı kedisi.", category: "Hayvanlar", funFact: "Aslan 'ormanların kralı' olarak bilinir." },
  { word: "KARTAL",  meaning: "Büyük ve güçlü bir yırtıcı kuş.", category: "Hayvanlar" },
  { word: "AKREP",   meaning: "Zehirli kuyruğu olan eklembacaklı.", category: "Hayvanlar", funFact: "Akrepler 430 milyon yıldır var olmaktadır." },
  { word: "EJDERHA", meaning: "Mitolojik ateş püskürten yaratık.", category: "Mitoloji" },
  { word: "KAPLAN",  meaning: "Çizgili büyük yırtıcı kedi.", category: "Hayvanlar" },
  { word: "KARINCA", meaning: "Küçük sosyal böcek.", category: "Hayvanlar", funFact: "Karıncalar kendi ağırlıklarının 50 katını taşıyabilir." },
  { word: "BALIK",   meaning: "Suda yaşayan omurgalı.", category: "Hayvanlar" },
  { word: "KAPLUMBAĞA", meaning: "Sert kabuklu sürüngen.", category: "Hayvanlar", funFact: "Bazı kaplumbağalar 200 yıl yaşayabilir." },
  // Yemekler
  { word: "KEBAP",   meaning: "Ateşte pişirilen et yemeği.", category: "Yemekler", origin: "Arapça" },
  { word: "BAKLAVA", meaning: "Fıstıklı Türk tatlısı.", category: "Yemekler", funFact: "Baklava Osmanlı saray mutfağından gelmektedir." },
  { word: "PILAV",   meaning: "Pişirilmiş pirinç yemeği.", category: "Yemekler", origin: "Farsça" },
  { word: "ÇORBA",   meaning: "Sıvı sebze veya et yemeği.", category: "Yemekler", origin: "Türkçe" },
  { word: "BÖREK",   meaning: "Yufkadan yapılan hamur işi.", category: "Yemekler" },
  { word: "MANTI",   meaning: "İçli hamur yemeği.", category: "Yemekler", funFact: "Türk mantısı dünyanın en küçük mantılarından biridir." },
  // Spor
  { word: "FUTBOL",  meaning: "11 kişilik takımların oynadığı top oyunu.", category: "Spor", origin: "İngilizce" },
  { word: "GÜREŞ",   meaning: "Türkiye'nin milli sporu.", category: "Spor", funFact: "Yağlı güreş 650 yıldır Kırkpınar'da düzenlenmektedir." },
  { word: "OKÇULUK", meaning: "Ok ve yay ile yapılan spor.", category: "Spor" },
  { word: "CIRIT",   meaning: "Atlı Türk sporu.", category: "Spor" },
  // Teknoloji
  { word: "BILGISAYAR", meaning: "Veri işleyen elektronik cihaz.", category: "Teknoloji" },
  { word: "INTERNET",   meaning: "Küresel bilgisayar ağı.", category: "Teknoloji", origin: "İngilizce" },
  { word: "YAZILIM",    meaning: "Bilgisayar programları.", category: "Teknoloji" },
  { word: "DONANIM",    meaning: "Bilgisayarın fiziksel parçaları.", category: "Teknoloji" },
  // Atasözleri & Deyimler
  { word: "SABIR",   meaning: "Zorluklara katlanma gücü.", category: "Atasözleri", funFact: "'Sabır acıdır meyvesi tatlıdır' atasözü meşhurdur." },
  { word: "UMUT",    meaning: "İyi bir şeyin olacağına inanma.", category: "Günlük Yaşam" },
  { word: "CESARET", meaning: "Korkuya rağmen harekete geçme.", category: "Günlük Yaşam" },
  { word: "ADALET",  meaning: "Hak ve hukuka uygunluk.", category: "Günlük Yaşam", origin: "Arapça" },
  { word: "ÖZGÜRLÜK","meaning": "Bağımsız olma durumu.", category: "Günlük Yaşam" },
  // Coğrafya
  { word: "BOĞAZ",   meaning: "İki denizi birbirine bağlayan dar su yolu.", category: "Coğrafya", funFact: "İstanbul Boğazı Avrupa ile Asya'yı ayırır." },
  { word: "YARIMADA","meaning": "Üç tarafı suyla çevrili kara parçası.", category: "Coğrafya" },
  { word: "DELTA",   meaning: "Nehrin denize döküldüğü yer.", category: "Coğrafya", origin: "Yunanca" },
  { word: "PLATO",   meaning: "Yüksek düzlük arazi.", category: "Coğrafya", origin: "Fransızca" },
  { word: "VOLKAN",  meaning: "Magmanın yeryüzüne çıktığı dağ.", category: "Coğrafya", origin: "Latince" },
];

// ─── Puzzle Generator ─────────────────────────────────────────────────────────

export interface PuzzleWord {
  word: string;
  meaning: string;
  category: string;
  clue: string;
  found: boolean;
  isBonus: boolean;
}

export interface Puzzle {
  id: string;
  cityId: string;
  level: number;
  letters: string[];
  targetWords: PuzzleWord[];
  bonusWords: PuzzleWord[];
  allValidWords: Set<string>;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generatePuzzle(cityId: string, level: number, seed?: number): Puzzle {
  const rng = seed ?? Date.now();
  // Pick 4-6 target words based on level
  const count = Math.min(4 + Math.floor(level / 3), 7);
  const pool = shuffle(WORD_DATABASE).slice(0, count * 4);
  const targets = pool.slice(0, count).filter(w => w.word.length >= 3 && w.word.length <= 8);

  // Collect all unique letters from target words
  const letterSet = new Set<string>();
  targets.forEach(w => w.word.split("").forEach(c => letterSet.add(c)));
  // Add 2-3 random extra letters
  const extras = "ABCDEFGHIJKLMNOPRSTUYZÇĞİÖŞÜ".split("");
  shuffle(extras).slice(0, 3).forEach(c => letterSet.add(c));
  const letters = shuffle(Array.from(letterSet)).slice(0, Math.min(letterSet.size, 9));

  // Bonus words: valid Turkish words that can be formed from these letters
  const letterCount: Record<string, number> = {};
  letters.forEach(l => { letterCount[l] = (letterCount[l] ?? 0) + 1; });

  const bonusPool = WORD_DATABASE.filter(entry => {
    if (targets.find(t => t.word === entry.word)) return false;
    const needed: Record<string, number> = {};
    entry.word.split("").forEach(c => { needed[c] = (needed[c] ?? 0) + 1; });
    return Object.entries(needed).every(([c, n]) => (letterCount[c] ?? 0) >= n);
  }).slice(0, 5);

  const allValidWords = new Set<string>([
    ...targets.map(w => w.word),
    ...bonusPool.map(w => w.word),
  ]);

  return {
    id: `${cityId}-${level}-${rng}`,
    cityId,
    level,
    letters,
    targetWords: targets.map(w => ({
      word: w.word,
      meaning: w.meaning,
      category: w.category,
      clue: w.meaning.slice(0, 40) + (w.meaning.length > 40 ? "…" : ""),
      found: false,
      isBonus: false,
    })),
    bonusWords: bonusPool.map(w => ({
      word: w.word,
      meaning: w.meaning,
      category: w.category,
      clue: w.meaning.slice(0, 40) + (w.meaning.length > 40 ? "…" : ""),
      found: false,
      isBonus: true,
    })),
    allValidWords,
  };
}

export function checkWord(puzzle: Puzzle, attempt: string): "target" | "bonus" | "invalid" {
  const upper = attempt.toUpperCase().replace(/İ/g, "İ");
  if (puzzle.targetWords.find(w => w.word === upper && !w.found)) return "target";
  if (puzzle.bonusWords.find(w => w.word === upper && !w.found)) return "bonus";
  if (puzzle.allValidWords.has(upper)) return "invalid"; // already found
  return "invalid";
}

export function getLimaResponse(word: string): string {
  const entry = WORD_DATABASE.find(w => w.word === word.toUpperCase());
  if (!entry) return `"${word}" kelimesini buldun! Harika iş! 🦂`;
  let msg = `✨ **${entry.word}** — ${entry.meaning}`;
  if (entry.origin) msg += `\n📜 Köken: ${entry.origin}`;
  if (entry.funFact) msg += `\n💡 ${entry.funFact}`;
  return msg;
}
