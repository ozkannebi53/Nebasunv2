/**
 * NEBASUN Türkçe Kelime Havuzu
 * 
 * 3, 4, 5, 6 harfli kelimeler
 * Her kullanıcıya rastgele/karışık şekilde dağıtılır
 */

const WORDS_3 = [
  "aba", "ace", "acı", "ada", "aga", "ağı", "ahı", "akı", "ala", "alp", "alt", "ana", "anı", "ant", "ara", "arı", "ark", "arş", "asa", "ası", "ask", "ast", "ata", "atı", "ava", "aya", "ayı", "azı", "bac", "bal", "ban", "bar", "bas", "bat", "bay", "bed", "bel", "ben", "bez", "bık", "bıy", "biz", "boş", "boy", "buz", "can", "cep", "cer", "cık", "cıl", "cim", "cin", "cis", "ciz", "cop", "cor", "coş", "cuk", "cup", "dal", "dam", "dar", "daş", "deç", "dem", "den", "der", "dış", "dik", "dil", "din", "dip", "diş", "diz", "dok", "dol", "don", "dop", "dor", "doş", "doz", "düş", "düz", "ece", "efe", "ege", "eke", "ele", "eli", "emi", "ere", "eti", "eve", "eze", "faç", "fan", "far", "fas", "fay", "fek", "fel", "fen", "fer", "fes", "fey", "fış", "fiş", "fit", "fon", "fos", "fül", "füze", "gam", "gar", "gaz", "gel", "gem", "gen", "gep", "gir", "git", "giz", "gök", "göl", "gön", "göz", "gül", "güm", "gün", "gür", "güç", "hal", "ham", "han", "hap", "har", "has", "hat", "hav", "hay", "heç", "hem", "her", "hey", "hız", "hıç", "hıh", "hır", "hış", "hıt", "hiç", "hin", "hip", "his", "hiş", "hit", "hoç", "hop", "hor", "hoş", "hun", "hür", "hüş", "içe", "iri", "ısı", "iyi", "izi", "jel", "jet", "kal", "kan", "kar", "kas", "kat", "kaz", "kel", "kem", "ker", "kes", "kez", "kıl", "kım", "kın", "kır", "kıt", "kış", "kim", "kin", "kip", "kir", "kiş", "kit", "kod", "kol", "kom", "kon", "kop", "kor", "koç", "koy", "köz", "kul", "kum", "kun", "kup", "kur", "kuş", "kut", "kül", "kün", "kür", "lak", "lal", "lam", "lan", "lap", "las", "laş", "lav", "lay", "laz", "leş", "lif", "lik", "lim", "lin", "lip", "lir", "loş", "lüx", "maç", "mal", "man", "map", "mar", "mat", "may", "meç", "mel", "men", "mer", "met", "mez", "mıh", "mır", "mış", "miç", "mil", "mim", "min", "mir", "mis", "miş", "mit", "mor", "mum", "mus", "muş", "mut", "muz", "nal", "nam", "nan", "nar", "nas", "naz", "net", "ney", "nez", "nih", "nil", "nim", "nis", "niş", "nit", "nod", "nok", "nom", "non", "nop", "nor", "nos", "not", "noy", "nuğ", "nul", "num", "nun", "nup", "nur", "nus", "nut", "nuz",
];

const WORDS_4 = [
  "abaç", "abak", "aban", "abes", "abla", "abli", "abuk", "acem", "acil", "aciz", "açar", "açık", "açkı", "açma", "adak", "adam", "aday", "adet", "adil", "adli", "afak", "afet", "afiş", "afra", "afro", "agah", "agor", "ağaç", "ağıl", "ağın", "ağır", "ağız", "ağlı", "ağma", "ahir", "ahit", "ahiz", "akıl", "aklı", "akma", "akne", "akol", "akor", "aksa", "aksi", "akta", "akte", "aktü", "alan", "alay", "alçı", "alca", "alda", "alem", "alev", "algı", "alım", "alın", "alış", "alka", "alkı", "allı", "alma", "altı", "alto", "amaç", "amak", "amal", "aman", "amca", "amel", "amil", "amin", "amir", "amon", "amut", "anan", "anay", "anda", "andı", "anik", "anıt", "anka", "anlı", "anma", "anos", "ansı", "antı", "apak", "apay", "apik", "apse", "arab", "arad", "araf", "arak", "aral", "aran", "arap", "araş", "arat", "aray", "arda", "ardi", "arga", "argi", "argo", "arık", "arın", "arış", "arka", "arklı", "arpa", "arsa", "arşın", "arta", "artı", "arzu", "asab", "asan", "asar", "asay", "asıl", "asım", "asır", "askı", "asla", "aslı", "asma", "asri", "asta", "aşı", "aşık", "aşın", "aşır", "aşka", "aşkı", "aşlı", "aşma", "atak", "atal", "atan", "atar", "ateç", "ateş", "atik", "atış", "atkı", "atla", "atlı", "atma", "atom", "aval", "avan", "avar", "avcı", "avun", "avut", "ayak", "ayal", "ayan", "ayar", "ayaz", "ayça", "aygı", "ayık", "ayın", "ayır", "ayka", "aylı", "ayma", "aynı", "ayra", "ayrı", "ayta", "ayva", "azad", "azak", "azam", "azap", "azar", "azat", "azgı", "azık", "azil", "azim", "azış", "aziz", "azlı", "azma", "azot", "azra", "azur", "baba", "baca", "baci", "bacı", "bada", "badi", "bağa", "bağı", "baha", "baki", "bala", "bale", "balı", "bana", "band", "bani", "bank", "barı", "bark", "baro", "bası", "bask", "bast", "başı", "bata", "batı", "baya", "bayı", "baza", "bazı", "bece", "beda", "bede", "bedi", "beka", "bela", "beli", "bena", "beni", "bent", "bera", "berk", "besa", "beta", "beze", "bide", "bila", "bile", "bili", "bina", "bini", "bira", "biri", "bise", "bita", "biye", "boğa", "bola", "bolu", "bona", "bora", "boru", "boşa", "boşu", "boya", "boyu", "boza", "bozu", "buca", "buğu", "buha", "buka", "bula", "bulu", "buna", "bura", "buru", "buse", "buta", "butu", "büke", "bükü", "büro",
];

const WORDS_5 = [
  "abacı", "abart", "ablak", "abone", "acemi", "acılı", "acıma", "acıktı", "açlık", "açmak", "adama", "adese", "adeta", "adliye", "adres", "afaki", "afişe", "afyon", "ağaç", "ağılı", "ağırl", "ağlak", "ağmak", "ağyar", "ahali", "ahenk", "ahize", "ahlak", "ahlat", "ahmak", "ajans", "akait", "akarsu", "akide", "akran", "aksak", "aksam", "akşın", "aktar", "aktif", "aktör", "akü", "akvam", "alaka", "alarm", "alaycı", "albay", "albüm", "alem", "alet", "algı", "alıcı", "alile", "alkol", "allah", "almaç", "almak", "alman", "almaş", "alnaç", "altlı", "altın", "alyon", "amaç", "amade", "ambal", "ambar", "amca", "amele", "amelî", "amfi", "amil", "amir", "amon", "amorf", "amut", "anane", "ançor", "andaç", "andız", "anemi", "angut", "anıms", "anket", "anlak", "anlam", "anlık", "anmak", "anons", "antet", "antik", "antra", "antre", "anüri", "apeli", "apiko", "aplike", "apolet", "apsis", "aptal", "araba", "arabi", "aracı", "aralık", "arama", "arazi", "arbed", "ardıç", "arena", "argaç", "argın", "argit", "argot", "arıcı", "arife", "ariyet", "ariza", "arkaç", "arkoz", "arlık", "armut", "arpa", "arsa", "arsen", "artış", "artık", "artmak", "arzı", "asabi", "asfal", "askar", "askı", "aslan", "aslık", "asmak", "asort", "aspas", "astım", "astır", "asude", "asval", "asyan", "aşama", "aşçın", "aşırı", "aşkın", "aşmak", "atari", "atıcı", "atike", "atkı", "atlas", "atlet", "atmak", "atölye", "avans", "avare", "avcı", "avdet", "avere", "avize", "avlak", "avrat", "avuç", "ayan", "ayar", "ayaz", "aygın", "aygıt", "aylak", "aylık", "aymaz", "aynen", "ayraç", "ayran", "ayva", "azade", "azami", "azgın", "azılı", "azize", "azlık", "azmak", "azman", "azmet", "aznav", "azrak", "azuze",
];

const WORDS_6 = [
  "abajur", "abaküs", "abanma", "abdest", "abiler", "abozca", "abrama", "abukça", "acayip", "acıklı", "acılık", "acizce", "acımak", "acıtan", "açacak", "açgöz", "açılan", "açılma", "açkıcı", "açmağa", "adalet", "adamak", "adanma", "adaşın", "adliye", "adrese", "advert", "afacan", "afalla", "afiyet", "aforoz", "afralı", "afrika", "afişler", "ağalar", "ağarma", "ağdacı", "ağlamak", "ağlama", "ağrılı", "ağrısı", "ağzına", "ahengi", "ahlaki", "ahlat", "ahret", "ahşap", "aidatı", "ailece", "ailecek", "aynalı", "ajanda", "akasya", "akıllı", "akılsız", "akışlı", "akitli", "akraba", "aksama", "aksine", "aksiyon", "aktüel", "aktör", "aktarım", "alacak", "alacalı", "alakan", "alaklı", "alaşım", "alatur", "albeni", "albüm", "alevli", "alıcı", "algıla", "alıkça", "alıntı", "alkış", "alkol", "almanı", "almaca", "alnına", "altmış", "altlık", "altüst", "alümin", "alümin", "ambalaj", "ambara", "amblem", "amelce", "amelos", "amiral", "amitis", "amonyak", "ampiri", "ampute", "anaçça", "anadan", "anafor", "ananas", "anayasa", "ancağı", "ancıla", "andırı", "anımsa", "ankara", "anlams", "anlıca", "anluka", "anomik", "anorak", "anoxia", "antika", "antlaş", "antrak", "antras", "antren", "antrik", "anüs", "apakça", "apardi", "apayrı", "apecik", "aperil", "aperit", "apışma", "aplik", "apotem", "apress", "apseli", "araba", "arabik", "aracı", "aralık", "arama", "arami", "aranje", "ararat", "arasta", "arayış", "arayüz", "arbede", "ardıç", "ardına", "arenal", "argala", "argın", "argoda", "argüman", "arıcıl", "arife", "arilik", "aristo", "aritme", "arkaç", "arkası", "arkaya", "arkite", "arkot", "arpa", "arpeji", "arşive", "arsız", "arsız", "artanı", "artmak", "artçı", "artısı", "arzusu",
];

export const TURKISH_WORDS = {
  3: WORDS_3,
  4: WORDS_4,
  5: WORDS_5,
  6: WORDS_6,
};

/**
 * Rastgele kelime seç (3, 4, 5, 6 harfli)
 */
export function getRandomWord(length?: 3 | 4 | 5 | 6): string {
  // Eğer uzunluk belirtilmemişse rastgele seç
  if (!length) {
    const lengths = [3, 4, 5, 6] as const;
    length = lengths[Math.floor(Math.random() * lengths.length)];
  }
  
  const words = TURKISH_WORDS[length];
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Kelimeyi harflere ayır (rastgele sırada)
 */
export function shuffleWord(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

/**
 * Kelime geçerli mi?
 */
export function isValidWord(word: string): boolean {
  const length = word.length as 3 | 4 | 5 | 6;
  if (![3, 4, 5, 6].includes(length)) return false;
  return TURKISH_WORDS[length].includes(word.toUpperCase());
}

/**
 * Kelime anlamı (basit sözlük)
 */
const WORD_MEANINGS: Record<string, string> = {
  "ABA": "Kalın yün kumaş",
  "ACE": "Acı tat",
  "ACI": "Ağrı, sızı",
  "ADA": "Deniz içindeki kara parçası",
  "AGA": "Osmanlı döneminde yönetici",
  "ADAM": "İnsan",
  "ADET": "Sayı, miktar",
  "AFET": "Felaket, kaza",
  "AGAH": "Haberi olan, bilgili",
  "AĞAÇ": "Gövdesi olan bitki",
  "AĞLAMAK": "Gözyaşı dökmek",
  "AĞLAMA": "Ağlama eylemi",
  "AĞRILI": "Ağrı çeken",
  "AĞRISI": "Ağrı hissi",
  "AĞZINA": "Ağzına doğru",
  "AHENGI": "Uyumlu",
  "AHLAKI": "Ahlak ile ilgili",
  "AHLAT": "Meyve ağacı",
  "AHRET": "Ölümden sonraki hayat",
  "AHŞAP": "Ağaçtan yapılmış",
  "AKILLI": "Zeka sahibi",
  "AKILSIZ": "Zekasız",
  "AKIŞLI": "Akıp giden",
  "AKRABA": "Akrabalık ilişkisi olanlar",
  "AKSINE": "Tersine",
  "AKSIYON": "Hareket, eylem",
  "AKTÜEL": "Güncel, mevcut",
  "AKTÖR": "Oyuncu",
  "ALACAK": "Borç",
  "ALACALI": "Alaca desenli",
  "ALAKAN": "Alakalı",
  "ALAKLI": "İlgili",
  "ALAŞIM": "Metal karışımı",
  "ALBENI": "Güzellik",
  "ALBÜM": "Fotoğraf defteri",
  "ALEVLI": "Ateş çıkan",
  "ALICI": "Satın alan",
  "ALGILA": "Anlamak, kavramak",
  "ALIKÇA": "Hafif, sıvı",
  "ALINTI": "Başkasından alınan",
  "ALKIŞ": "Tezahürat",
  "ALKOL": "Sarhoş edici madde",
  "ALMANI": "Almanca konuşan",
  "ALMACA": "Alma ağacı",
  "ALNINA": "Alına doğru",
  "ALTMIŞ": "60 sayısı",
  "ALTLIK": "Alt taraf",
  "ALTÜST": "Başaşağı",
  "AMBALAJ": "Paketleme",
  "AMBARA": "Depo",
  "AMBLEM": "Sembol, işaret",
  "AMIRAL": "Deniz ordusu komutanı",
  "AMONYAK": "Kimyasal madde",
  "ANAÇÇA": "Ana gibi",
  "ANADAN": "Anadan beri",
  "ANANAS": "Tropikal meyve",
  "ANAYASA": "Temel kanun",
  "ANKARA": "Türkiye'nin başkenti",
  "ANTIKA": "Eski eşya",
  "ANTREN": "Antrenman",
  "APTAL": "Akılsız",
  "ARABA": "Taşıt",
  "ARACI": "Arada olan",
  "ARALIK": "Arası, boşluk",
  "ARAMA": "Arama eylemi",
  "ARAZI": "Toprak, yer",
  "ARDIÇ": "Bir tür ağaç",
  "ARENA": "Gösteri alanı",
  "ARGOT": "Argo sözcükler",
  "ARICI": "Arı yetiştiren",
  "ARIFE": "Bayram arifesi",
  "ARIZA": "Bozulma, arıza",
  "ARKA": "Arkası, arka taraf",
  "ARKAÇ": "Arka taraf",
  "ARKASI": "Arkasında",
  "ARKAYA": "Arkaya doğru",
  "ARKITE": "Mimari",
  "ARPA": "Tahıl",
  "ARSA": "Boş arazi",
  "ARSIZ": "Utanmaz",
  "ARTANI": "Artık kalan",
  "ARTMAK": "Çoğalmak",
  "ARTÇI": "Arta kalan",
  "ARTISI": "Artı tarafı",
  "ARZUSU": "İsteği",
  "ASABI": "Sinir sistemi ile ilgili",
  "ASFAL": "Asfalt",
  "ASKAR": "Asker",
  "ASKI": "Askı, ip",
  "ASLAN": "Vahşi hayvan",
  "ASLIK": "Aslı, orijinali",
  "ASMAK": "Asmak eylemi",
  "ASORT": "Çeşitli",
  "ASPAS": "Tırnak işareti",
  "ASTIM": "Astım hastalığı",
  "ASUDE": "Rahat, huzurlu",
  "ASVAL": "Asıl değer",
  "ASYAN": "Asya kıtası",
  "AŞAMA": "Basamak, derece",
  "AŞÇIN": "Yemek yapan",
  "AŞIRI": "Fazla, aşırı",
  "AŞKIN": "Aşkın etkisinde",
  "AŞMAK": "Geçmek, aşmak",
  "ATARI": "Atarı, hazırlık",
  "ATICI": "Atan",
  "ATIKE": "Atike adı",
  "ATKI": "Dokuma ipliği",
  "ATLAS": "Harita kitabı",
  "ATLET": "Sporcu",
  "ATMAK": "Atmak eylemi",
  "ATÖLYE": "Çalışma yeri",
  "AVANS": "Ön ödeme",
  "AVARE": "Başıboş",
  "AVCI": "Avlayan",
  "AVDET": "Dönüş",
  "AVERE": "Ticari mal",
  "AVIZE": "Avize, lüster",
  "AVLAK": "Avlanacak yer",
  "AVRAT": "Kadın",
  "AVUÇ": "El avucu",
  "AYAN": "Ayanlar",
  "AYAR": "Ayar, ölçü",
  "AYAZ": "Soğuk, kırağı",
  "AYGIN": "Yaygın",
  "AYGIT": "Aygıt, alet",
  "AYLAK": "Boş, işsiz",
  "AYLIK": "Bir ayda bir",
  "AYMAZ": "Aymazlık",
  "AYNEN": "Aynen, aynı şekilde",
  "AYRAÇ": "Ayırıcı",
  "AYRAN": "Yoğurt içeceği",
  "AYVA": "Meyve",
  "AZADE": "Azat, özgür",
  "AZAMI": "En fazla",
  "AZGIN": "Çılgın",
  "AZILI": "Kararlı",
  "AZIZE": "Azize adı",
  "AZLIK": "Azlık, azınlık",
  "AZMAK": "Azmak eylemi",
  "AZMAN": "Azman, usta",
  "AZMET": "Azim, kararlılık",
  "AZRAK": "Azrak adı",
  "AZUZE": "Azuze adı",
};

export function getWordMeaning(word: string): string {
  return WORD_MEANINGS[word.toUpperCase()] || "Anlam bilinmiyor";
}

/**
 * Kullanıcıya rastgele kelime havuzu oluştur
 * Her çağrıda farklı kombinasyon
 */
export function generateRandomWordSet(count: number = 10): string[] {
  const allWords = [
    ...WORDS_3,
    ...WORDS_4,
    ...WORDS_5,
    ...WORDS_6,
  ];
  
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
