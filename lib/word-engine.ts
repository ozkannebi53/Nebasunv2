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
  { word: "ADA", meaning: "Dört tarafı sularla çevrili kara parçası.", category: "Coğrafya" },
  { word: "KALEM", meaning: "Yazı yazmak için kullanılan araç.", category: "Günlük Yaşam", origin: "Arapça", funFact: "Türkçede 'kalem' hem yazma aracını hem de fiyat anlamına gelir." },
  { word: "MASA", meaning: "Üzerinde çalışılan düz yüzeyli mobilya.", category: "Günlük Yaşam", origin: "Portekizce" },
  { word: "KAPAK", meaning: "Bir şeyin üstünü örten parça.", category: "Günlük Yaşam" },
  { word: "PENCERE", meaning: "Duvarda açılan cam bölüm.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "MUTFAK", meaning: "Yemek pişirilen oda.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "BAHÇE", meaning: "Çiçek ve bitkilerin yetiştirildiği alan.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "SOKAK", meaning: "Evler arasındaki dar yol.", category: "Günlük Yaşam" },
  { word: "KÖPRÜ", meaning: "İki yakayı birbirine bağlayan yapı.", category: "Günlük Yaşam", funFact: "İstanbul'daki Boğaz Köprüsü iki kıtayı birbirine bağlar." },
  { word: "ÇARŞI", meaning: "Alışveriş yapılan yer.", category: "Günlük Yaşam", origin: "Farsça" },
  { word: "PAZAR", meaning: "Açık hava alışveriş yeri.", category: "Günlük Yaşam", origin: "Farsça" },
  // Tarih
  { word: "KALE", meaning: "Savunma amaçlı yapı.", category: "Tarih", origin: "Arapça", funFact: "Türkiye'de yüzlerce tarihi kale bulunmaktadır." },
  { word: "SULTAN", meaning: "Osmanlı döneminde hükümdar.", category: "Tarih", origin: "Arapça" },
  { word: "ORDU", meaning: "Silahlı kuvvetler.", category: "Tarih" },
  { word: "SAVAŞ", meaning: "İki taraf arasındaki silahlı çatışma.", category: "Tarih" },
  { word: "ZAFER", meaning: "Savaşta ya da yarışmada kazanma.", category: "Tarih", origin: "Arapça" },
  { word: "TAHT", meaning: "Hükümdarın oturduğu özel koltuk.", category: "Tarih", origin: "Farsça" },
  { word: "SARAY", meaning: "Hükümdarın yaşadığı büyük yapı.", category: "Tarih", origin: "Farsça" },
  { word: "PADIŞAH", meaning: "Osmanlı imparatoru.", category: "Tarih", origin: "Farsça" },
  { word: "VEZIR", meaning: "Padişahın baş danışmanı.", category: "Tarih", origin: "Arapça" },
  { word: "AKINCI", meaning: "Osmanlı hafif süvari birliği.", category: "Tarih" },
  // Doğa
  { word: "DAĞLAR", meaning: "Yüksek arazi oluşumları.", category: "Doğa" },
  { word: "NEHIR", meaning: "Sürekli akan su kütlesi.", category: "Doğa" },
  { word: "ORMAN", meaning: "Ağaçlarla kaplı geniş alan.", category: "Doğa" },
  { word: "ÇÖLLER", meaning: "Yağışın çok az olduğu kurak bölge.", category: "Doğa" },
  { word: "GÖLLER", meaning: "Karayla çevrili durgun su kütlesi.", category: "Doğa" },
  { word: "BULUT", meaning: "Atmosferdeki su buharı kümesi.", category: "Doğa" },
  { word: "FIRTINA", meaning: "Şiddetli rüzgar ve yağış.", category: "Doğa" },
  { word: "YILDIZ", meaning: "Uzayda ışık yayan gök cismi.", category: "Uzay", funFact: "Güneş de bir yıldızdır." },
  { word: "GEZEGEN", meaning: "Yıldız etrafında dönen gök cismi.", category: "Uzay" },
  { word: "GALAKSI", meaning: "Milyarlarca yıldızdan oluşan sistem.", category: "Uzay" },
  // Hayvanlar
  { word: "ASLAN", meaning: "Afrika'nın büyük yırtıcı kedisi.", category: "Hayvanlar", funFact: "Aslan 'ormanların kralı' olarak bilinir." },
  { word: "KARTAL", meaning: "Büyük ve güçlü bir yırtıcı kuş.", category: "Hayvanlar" },
  { word: "AKREP", meaning: "Zehirli kuyruğu olan eklembacaklı.", category: "Hayvanlar", funFact: "Akrepler 430 milyon yıldır var olmaktadır." },
  { word: "EJDERHA", meaning: "Mitolojik ateş püskürten yaratık.", category: "Mitoloji" },
  { word: "KAPLAN", meaning: "Çizgili büyük yırtıcı kedi.", category: "Hayvanlar" },
  { word: "KARINCA", meaning: "Küçük sosyal böcek.", category: "Hayvanlar", funFact: "Karınca kendi ağırlığının 50 katını taşıyabilir." },
  { word: "BALIK", meaning: "Suda yaşayan omurgalı.", category: "Hayvanlar" },
  { word: "KAPLUMBAĞA", meaning: "Sert kabuklu sürüngen.", category: "Hayvanlar", funFact: "Bazı kaplumbağalar 200 yıl yaşayabilir." },
  // Yemekler
  { word: "KEBAP", meaning: "Ateşte pişirilen et yemeği.", category: "Yemekler", origin: "Arapça" },
  { word: "BAKLAVA", meaning: "Fıstıklı Türk tatlısı.", category: "Yemekler", funFact: "Baklava Osmanlı saray mutfağından gelmektedir." },
  { word: "PILAV", meaning: "Pişirilmiş pirinç yemeği.", category: "Yemekler", origin: "Farsça" },
  { word: "ÇORBA", meaning: "Sıvı sebze veya et yemeği.", category: "Yemekler", origin: "Türkçe" },
  { word: "BÖREK", meaning: "Yufkadan yapılan hamur işi.", category: "Yemekler" },
  { word: "MANTI", meaning: "İçli hamur yemeği.", category: "Yemekler", funFact: "Türk mantısı dünyanın en küçük mantılarından biridir." },
  // Spor
  { word: "FUTBOL", meaning: "11 kişilik takımların oynadığı top oyunu.", category: "Spor", origin: "İngilizce" },
  { word: "GÜREŞ", meaning: "Türkiye'nin milli sporu.", category: "Spor", funFact: "Yağlı güreş 650 yıldır Kırkpınar'da düzenlenmektedir." },
  { word: "OKÇULUK", meaning: "Ok ve yay ile yapılan spor.", category: "Spor" },
  { word: "CIRIT", meaning: "Atlı Türk sporu.", category: "Spor" },
  // Teknoloji
  { word: "BILGISAYAR", meaning: "Veri işleyen elektronik cihaz.", category: "Teknoloji" },
  { word: "INTERNET", meaning: "Küresel bilgisayar ağı.", category: "Teknoloji", origin: "İngilizce" },
  { word: "YAZILIM", meaning: "Bilgisayar programları.", category: "Teknoloji" },
  { word: "DONANIM", meaning: "Bilgisayarın fiziksel parçaları.", category: "Teknoloji" },
  // Atasözleri & Deyimler
  { word: "SABIR", meaning: "Zorluklara katlanma gücü.", category: "Atasözleri", funFact: "'Sabır acıdır meyvesi tatlıdır' atasözü meşhurdur." },
  { word: "UMUT", meaning: "İyi bir şeyin olacağına inanma.", category: "Günlük Yaşam" },
  { word: "CESARET", meaning: "Korkuya rağmen harekete geçme.", category: "Günlük Yaşam" },
  { word: "ADALET", meaning: "Hak ve hukuka uygunluk.", category: "Günlük Yaşam", origin: "Arapça" },
  { word: "ÖZGÜRLÜK", meaning: "Bağımsız olma durumu.", category: "Günlük Yaşam" },
  // Coğrafya
  { word: "BOĞAZ", meaning: "İki denizi birbirine bağlayan dar su yolu.", category: "Coğrafya", funFact: "İstanbul Boğazı Avrupa ile Asya'yı ayırır." },
  { word: "YARIMADA", meaning: "Üç tarafı suyla çevrili kara parçası.", category: "Coğrafya" },
  { word: "DELTA", meaning: "Nehrin denize döküldüğü yer.", category: "Coğrafya", origin: "Yunanca" },
  { word: "PLATO", meaning: "Yüksek düzlük arazi.", category: "Coğrafya", origin: "Fransızca" },
  { word: "VOLKAN", meaning: "Magmanın yeryüzüne çıktığı dağ.", category: "Coğrafya", origin: "Latince" },
  // Şehirler
  { word: "İSTANBUL", meaning: "Türkiye'nin en büyük şehri.", category: "Coğrafya" },
  { word: "ANKARA", meaning: "Türkiye'nin başkenti.", category: "Coğrafya" },
  { word: "İZMİR", meaning: "Ege Bölgesi'nin en büyük şehri.", category: "Coğrafya" },
  { word: "ADANA", meaning: "Güney Anadolu'nun önemli şehri.", category: "Coğrafya" },
  { word: "GAZIANTEP", meaning: "Güneydoğu Anadolu'nun önemli şehri.", category: "Coğrafya" },
];

// ─── Puzzle Generator ─────────────────────────────────────────────────────────

export interface GridPosition {
  row: number;
  col: number;
  direction: "horizontal" | "vertical";
}

export interface PuzzleWord {
  word: string;
  meaning: string;
  category: string;
  clue: string;
  found: boolean;
  isBonus: boolean;
  gridPos?: GridPosition;
}

export interface Puzzle {
  id: string;
  cityId: string;
  level: number;
  letters: string[];
  targetWords: PuzzleWord[];
  bonusWords: PuzzleWord[];
  allValidWords: Set<string>;
  gridWidth: number;
  gridHeight: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * WOW Tarzı Kesişen Izgara Algoritması
 * 
 * Mantık:
 * 1. İlk kelimeyi yatay olarak (0,0)'dan başlayarak yerleştir
 * 2. Her sonraki kelimeyi, önceki kelimelerin harfleriyle kesişecek şekilde yerleştir
 * 3. Kesişme noktaları aynı harfler olmalı
 * 4. Dikey ve yatay alternasyonu sağla
 */
function generateCrossingGridPositions(words: string[]): Record<string, GridPosition> {
  const positions: Record<string, GridPosition> = {};
  const grid: Set<string> = new Set();

  if (words.length === 0) return positions;

  // İlk kelimeyi yatay olarak yerleştir
  const firstWord = words[0];
  positions[firstWord] = { row: 5, col: 2, direction: "horizontal" };

  // Grid'e ilk kelimeyi işaretle
  for (let i = 0; i < firstWord.length; i++) {
    grid.add(`${5},${2 + i}`);
  }

  // Kalan kelimeleri yerleştir
  for (let wordIdx = 1; wordIdx < words.length; wordIdx++) {
    const word = words[wordIdx];
    const direction = wordIdx % 2 === 1 ? "vertical" : "horizontal";
    let placed = false;

    // Önceki kelimelerdeki harflerle kesişme noktası bul
    for (let prevIdx = 0; prevIdx < wordIdx; prevIdx++) {
      const prevWord = words[prevIdx];
      const prevPos = positions[prevWord];

      // Her harf kombinasyonunu dene
      for (let prevCharIdx = 0; prevCharIdx < prevWord.length; prevCharIdx++) {
        const prevChar = prevWord[prevCharIdx];

        for (let currCharIdx = 0; currCharIdx < word.length; currCharIdx++) {
          if (word[currCharIdx] === prevChar) {
            // Kesişme bulundu!
            let newRow, newCol;

            if (direction === "vertical") {
              // Yeni kelime dikey, önceki yatay
              if (prevPos.direction === "horizontal") {
                newRow = prevPos.row - currCharIdx;
                newCol = prevPos.col + prevCharIdx;
              } else {
                // Her iki de dikey — atla
                continue;
              }
            } else {
              // Yeni kelime yatay, önceki dikey
              if (prevPos.direction === "vertical") {
                newRow = prevPos.row + prevCharIdx;
                newCol = prevPos.col - currCharIdx;
              } else {
                // Her iki de yatay — atla
                continue;
              }
            }

            // Çakışma kontrolü yap
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
              const checkRow = direction === "vertical" ? newRow + i : newRow;
              const checkCol = direction === "vertical" ? newCol : newCol + i;
              const key = `${checkRow},${checkCol}`;

              if (grid.has(key)) {
                // Aynı harf olmalı
                if (direction === "vertical") {
                  const existingWord = Object.entries(positions).find(
                    ([w, p]) =>
                      p.direction === "horizontal" &&
                      p.row === checkRow &&
                      p.col <= checkCol &&
                      p.col + w.length > checkCol
                  );
                  if (existingWord && existingWord[0][checkCol - existingWord[1].col] !== word[i]) {
                    canPlace = false;
                    break;
                  }
                } else {
                  const existingWord = Object.entries(positions).find(
                    ([w, p]) =>
                      p.direction === "vertical" &&
                      p.col === checkCol &&
                      p.row <= checkRow &&
                      p.row + w.length > checkRow
                  );
                  if (existingWord && existingWord[0][checkRow - existingWord[1].row] !== word[i]) {
                    canPlace = false;
                    break;
                  }
                }
              }
            }

            if (canPlace && newRow >= 0 && newCol >= 0 && newRow < 15 && newCol < 15) {
              positions[word] = { row: newRow, col: newCol, direction };
              for (let i = 0; i < word.length; i++) {
                const r = direction === "vertical" ? newRow + i : newRow;
                const c = direction === "vertical" ? newCol : newCol + i;
                grid.add(`${r},${c}`);
              }
              placed = true;
              break;
            }
          }
        }

        if (placed) break;
      }

      if (placed) break;
    }

    // Kesişme bulunamazsa, boş yere yerleştir
    if (!placed) {
      const fallbackRow = 5 + wordIdx * 2;
      const fallbackCol = 2;
      if (fallbackRow < 15 && fallbackCol < 15) {
        positions[word] = {
          row: fallbackRow,
          col: fallbackCol,
          direction: wordIdx % 2 === 0 ? "horizontal" : "vertical",
        };
        for (let i = 0; i < word.length; i++) {
          const r = positions[word].direction === "vertical" ? fallbackRow + i : fallbackRow;
          const c = positions[word].direction === "vertical" ? fallbackCol : fallbackCol + i;
          grid.add(`${r},${c}`);
        }
      }
    }
  }

  return positions;
}

export function generatePuzzle(cityId: string, level: number, seed?: number): Puzzle {
  const rng = seed ?? Date.now();
  const count = Math.min(3 + Math.floor(level / 5), 6);

  // Seviyeye göre kelime uzunluğu filtrele
  const minLen = level < 5 ? 3 : 4;
  const maxLen = level < 10 ? 6 : 8;

  const pool = shuffle(WORD_DATABASE).filter(
    (w) => w.word.length >= minLen && w.word.length <= maxLen
  );
  const targets = pool.slice(0, count);

  // Harf havuzunu oluştur (Sadece hedef kelimelerdeki harfler + 1-2 ekstra)
  const letterSet = new Set<string>();
  targets.forEach((w) => w.word.split("").forEach((c) => letterSet.add(c)));

  const extras = "ABCDEFGHIJKLMNOPRSTUYZÇĞİÖŞÜ".split("");
  shuffle(extras)
    .slice(0, 2)
    .forEach((c) => letterSet.add(c));

  const letters = shuffle(Array.from(letterSet)).slice(0, Math.min(letterSet.size, 8));

  // Kesişen ızgara pozisyonlarını hesapla
  const gridPosMap = generateCrossingGridPositions(targets.map((t) => t.word));

  // Bonus kelimeler
  const letterCount: Record<string, number> = {};
  letters.forEach((l) => {
    letterCount[l] = (letterCount[l] ?? 0) + 1;
  });

  const bonusPool = WORD_DATABASE.filter((entry) => {
    if (targets.find((t) => t.word === entry.word)) return false;
    const needed: Record<string, number> = {};
    entry.word.split("").forEach((c) => {
      needed[c] = (needed[c] ?? 0) + 1;
    });
    return Object.entries(needed).every(([c, n]) => (letterCount[c] ?? 0) >= n);
  }).slice(0, 5);

  const allValidWords = new Set<string>([
    ...targets.map((w) => w.word),
    ...bonusPool.map((w) => w.word),
  ]);

  // Grid boyutlarını hesapla
  let gridWidth = 10;
  let gridHeight = 10;

  Object.values(gridPosMap).forEach((pos) => {
    if (pos.direction === "horizontal") {
      gridWidth = Math.max(gridWidth, pos.col + WORD_DATABASE.find((w) => w.word === Object.keys(gridPosMap).find((k) => gridPosMap[k] === pos))?.word.length || 0);
    } else {
      gridHeight = Math.max(gridHeight, pos.row + WORD_DATABASE.find((w) => w.word === Object.keys(gridPosMap).find((k) => gridPosMap[k] === pos))?.word.length || 0);
    }
  });

  return {
    id: `${cityId}-${level}-${rng}`,
    cityId,
    level,
    letters,
    targetWords: targets.map((w) => ({
      word: w.word,
      meaning: w.meaning,
      category: w.category,
      clue: w.meaning,
      found: false,
      isBonus: false,
      gridPos: gridPosMap[w.word],
    })),
    bonusWords: bonusPool.map((w) => ({
      word: w.word,
      meaning: w.meaning,
      category: w.category,
      clue: w.meaning,
      found: false,
      isBonus: true,
    })),
    allValidWords,
    gridWidth,
    gridHeight,
  };
}

export function checkWord(puzzle: Puzzle, attempt: string): "target" | "bonus" | "invalid" {
  const upper = attempt.toUpperCase().replace(/i/g, "İ");
  if (puzzle.targetWords.find((w) => w.word === upper)) return "target";
  if (puzzle.bonusWords.find((w) => w.word === upper)) return "bonus";
  return "invalid";
}

export function getLimaResponse(word: string): string {
  const entry = WORD_DATABASE.find((w) => w.word === word.toUpperCase());
  if (!entry) return `"${word}" kelimesini buldun! 🦂`;
  return `✨ **${entry.word}** — ${entry.meaning}`;
}
