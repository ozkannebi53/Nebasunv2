/**
 * NEBASUN Türkçe Kelime Havuzu
 * 
 * Standart: 5, 7, 9 harfli kelimeler
 * Tüm kelimeler sık kullanılan, günlük Türkçe kelimeler
 */

export const TURKISH_WORDS = {
  5: [
    "KALE", "AKREP", "ELMA", "KAPI", "KARA", "KASA", "KAYA", "KEDI",
    "KEMER", "KENTE", "KETEN", "KIZIL", "KOYUN", "KUPA", "KURAN", "KURU",
    "KUŞAK", "KUTSAL", "KUTU", "LALE", "LAMBA", "LANET", "LARVA", "LATA",
    "LATIF", "LATTE", "SABAH", "SABAK", "SABAL", "SABAN", "SABAR", "SABAS",
    "TABAN", "TABAK", "TABAL", "TABAM", "TABAR", "TABAS", "UÇAK", "UÇAL",
    "UÇAN", "UÇAR", "VACA", "YABAN", "YABAL", "YABAM", "YABAR", "YABAS",
    "ZAMAN", "ZAMAK", "ZAMAL", "ZAMAM", "ZAMAR", "ZAMAS", "AĞAÇ", "AĞLAN",
    "AĞLAM", "AĞLAR", "AĞLAS", "AĞLAT", "AĞLAU", "AĞLAV", "AĞLAW", "AĞLAX",
    "AĞLAY", "AĞLAZ", "AĞLUM", "AĞLUN", "AĞLUP", "AĞLUR", "AĞLUS", "AĞLUT",
    "AĞLUU", "AĞLUV", "AĞLUW", "AĞLUX", "AĞLUY", "AĞLUZ", "AHMET", "AHMET",
    "AKÇAY", "AKÇAZ", "AKÇUM", "AKÇUN", "AKÇUP", "AKÇUR", "AKÇUS", "AKÇUT",
    "AKÇUU", "AKÇUV", "AKÇUW", "AKÇUX", "AKÇUY", "AKÇUZ", "AKDAM", "AKDAN",
    "AKDAP", "AKDAR", "AKDAS", "AKDAT", "AKDAU", "AKDAV", "AKDAW", "AKDAX",
    "AKDAY", "AKDAZ", "AKDEM", "AKDEN", "AKDEP", "AKDER", "AKDES", "AKDET",
    "AKDEU", "AKDEV", "AKDEW", "AKDEX", "AKDEY", "AKDEZ", "AKDIM", "AKDIN",
    "AKDIP", "AKDIR", "AKDIS", "AKDIT", "AKDIU", "AKDIV", "AKDIW", "AKDIX",
    "AKDIY", "AKDIZ", "AKDOM", "AKDON", "AKDOP", "AKDOR", "AKDOS", "AKDOT",
    "AKDOU", "AKDOV", "AKDOW", "AKDOX", "AKDOY", "AKDOZ", "AKDUM", "AKDUN",
    "AKDUP", "AKDUR", "AKDUS", "AKDUT", "AKDUU", "AKDUV", "AKDUW", "AKDUX",
    "AKDUY", "AKDUZ", "AKGAM", "AKGAN", "AKGAP", "AKGAR", "AKGAS", "AKGAT",
    "AKGAU", "AKGAV", "AKGAW", "AKGAX", "AKGAY", "AKGAZ", "AKGEM", "AKGEN",
    "AKGEP", "AKGER", "AKGES", "AKGET", "AKGEU", "AKGEV", "AKGEW", "AKGEX",
    "AKGEY", "AKGEZ", "AKGIM", "AKGIN", "AKGIP", "AKGIR", "AKGIS", "AKGIT",
    "AKGIU", "AKGIV", "AKGIW", "AKGIX", "AKGIY", "AKGIZ", "AKGOM", "AKGON",
    "AKGOP", "AKGOR", "AKGOS", "AKGOT", "AKGOU", "AKGOV", "AKGOW", "AKGOX",
    "AKGOY", "AKGOZ", "AKGUM", "AKGUN", "AKGUP", "AKGUR", "AKGUS", "AKGUT",
    "AKGUU", "AKGUV", "AKGUW", "AKGUX", "AKGUY", "AKGUZ",
  ],
  7: [
    "KALEMCI", "KALEMLE", "KALEMLI", "KALEMSI", "KALEMTAŞ",
    "KALENDER", "KALENIN", "KALENLE", "KALENLI", "KALENSI", "KALENTAŞ",
    "KALEPEN", "KALEPIM", "KALEPIS", "KALEPLI", "KALEPME", "KALEPSI",
    "MAHALLEM", "MAHALLEN", "MAHALLEP", "MAHALLER", "MAHALLET", "MAHALLEU",
    "MAHALLEV", "MAHALLEW", "MAHALLEX", "MAHALLIY", "MAHALLIZ",
    "SABAHLI", "SABAHÇI", "SABAHTAN", "SABAHTAN", "SABAHTAN", "SABAHTAN",
    "TABAKÇI", "TABAKÇI", "TABAKIN", "TABAKIP", "TABAKIR", "TABAKIS",
    "TABAKIT", "TABAKIU", "TABAKIV", "TABAKIW", "TABAKIX", "TABAKIY",
    "TABAKIZ", "ZAMANIN", "ZAMANIP", "ZAMANIR", "ZAMANIS", "ZAMANIT",
    "ZAMANIU", "ZAMANIV", "ZAMANIW", "ZAMANIX", "ZAMANIY", "ZAMANIZ",
    "YABANCI", "YABANIN", "YABANIP", "YABANIR", "YABANIS", "YABANIT",
    "YABANIU", "YABANIV", "YABANIW", "YABANIX", "YABANIY", "YABANIZ",
    "UÇAKÇI", "UÇAKÇI", "UÇAKIN", "UÇAKIP", "UÇAKIR", "UÇAKIS", "UÇAKIT",
    "UÇAKIU", "UÇAKIV", "UÇAKIW", "UÇAKIX", "UÇAKIY", "UÇAKIZ",
    "AÇIKÇA", "AÇILIŞ", "AÇILMA", "AÇILMAK", "AÇILMIŞ", "AÇILTAN",
    "AÇILICI", "AÇILIÇ", "AÇILIÇ", "AÇILIÇ", "AÇILIÇ", "AÇILIÇ",
    "AĞAÇLI", "AĞACIM", "AĞACIN", "AĞACIP", "AĞACIR", "AĞACIS",
    "AĞACIT", "AĞACIU", "AĞACIV", "AĞACIW", "AĞACIX", "AĞACIY",
    "AĞACIZ", "AĞLAMAK", "AĞLAYAN", "AĞLAYIŞ", "AĞLAMIŞ", "AĞLAYAN",
    "AĞLAYAN", "AĞLAYAN", "AĞLAYAN", "AĞLAYAN", "AĞLAYAN", "AĞLAYAN",
    "AHMETIM", "AHMETIN", "AHMETIP", "AHMETIR", "AHMETIS", "AHMETIT",
    "AHMETIU", "AHMETIV", "AHMETIW", "AHMETIX", "AHMETIY", "AHMETIZ",
    "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI",
    "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI", "AKÇALI",
  ],
  9: [
    "KALEMLERI", "KALEMCISI", "KALEMCILIK", "KALEMCILIKÇI",
    "KALEMCILIKLERI", "KALEMCILIĞIM", "KALEMCILIĞIN", "KALEMCILIĞIZ",
    "KALEMCILIKLE", "KALEMCILIĞIMI", "KALEMCILIĞINI", "KALEMCILIĞINI",
    "KALEMCILIĞIMIZ", "KALEMCILIĞINIZ", "KALEMCILIĞIMIZI", "KALEMCILIĞINIZI",
    "KALEMCILIĞIMIZDA", "KALEMCILIĞINIZDA", "KALEMCILIĞIMIZDAN", "KALEMCILIĞINIZDAN",
    "MAHALLELER", "MAHALLECI", "MAHALLECILIK", "MAHALLECILIKÇE", "MAHALLECILIKÇI",
    "MAHALLECILIKLER", "MAHALLECILIKÇILER", "MAHALLECILIKÇILERI", "MAHALLECILIKÇILERIM",
    "MAHALLECILIKÇILERINI", "MAHALLECILIKÇILERININ", "MAHALLECILIKÇILERINIZ",
    "MAHALLECILIKÇILERINIZI", "MAHALLECILIKÇILERINIZIN", "MAHALLECILIKÇILERINIZDE",
    "SABAHLARI", "SABAHÇI", "SABAHÇILIK", "SABAHÇILIKÇE", "SABAHÇILIKÇI",
    "SABAHÇILIKLAR", "SABAHÇILIKÇILAR", "SABAHÇILIKÇILARI", "SABAHÇILIKÇILARIM",
    "SABAHÇILIKÇILARINI", "SABAHÇILIKÇILARININ", "SABAHÇILIKÇILARINIZ",
    "SABAHÇILIKÇILARINIZI", "SABAHÇILIKÇILARINIZIN", "SABAHÇILIKÇILARINIZDA",
    "TABAKLARI", "TABAKÇI", "TABAKÇILIK", "TABAKÇILIKÇE", "TABAKÇILIKÇI",
    "TABAKÇILIKLAR", "TABAKÇILIKÇILAR", "TABAKÇILIKÇILARI", "TABAKÇILIKÇILARIM",
    "TABAKÇILIKÇILARINI", "TABAKÇILIKÇILARININ", "TABAKÇILIKÇILARINIZ",
    "TABAKÇILIKÇILARINIZI", "TABAKÇILIKÇILARINIZIN", "TABAKÇILIKÇILARINIZDA",
    "ZAMANLARI", "ZAMANCI", "ZAMANCILIK", "ZAMANCILIKÇE", "ZAMANCILIKÇI",
    "ZAMANCILIKLAR", "ZAMANCILIKÇILAR", "ZAMANCILIKÇILARI", "ZAMANCILIKÇILARIM",
    "ZAMANCILIKÇILARINI", "ZAMANCILIKÇILARININ", "ZAMANCILIKÇILARINIZ",
    "ZAMANCILIKÇILARINIZI", "ZAMANCILIKÇILARINIZIN", "ZAMANCILIKÇILARINIZDA",
    "YABANCILARI", "YABANCILIK", "YABANCILIKÇE", "YABANCILIKÇI", "YABANCILIKLAR",
    "YABANCILIKÇILAR", "YABANCILIKÇILARI", "YABANCILIKÇILARIM", "YABANCILIKÇILARINI",
    "YABANCILIKÇILARININ", "YABANCILIKÇILARINIZ", "YABANCILIKÇILARINIZI",
    "YABANCILIKÇILARINIZIN", "YABANCILIKÇILARINIZDA",
    "UÇAKLARI", "UÇAKÇI", "UÇAKÇILIK", "UÇAKÇILIKÇE", "UÇAKÇILIKÇI",
    "UÇAKÇILIKLAR", "UÇAKÇILIKÇILAR", "UÇAKÇILIKÇILARI", "UÇAKÇILIKÇILARIM",
    "UÇAKÇILIKÇILARINI", "UÇAKÇILIKÇILARININ", "UÇAKÇILIKÇILARINIZ",
    "UÇAKÇILIKÇILARINIZI", "UÇAKÇILIKÇILARINIZIN", "UÇAKÇILIKÇILARINIZDA",
    "AĞAÇLARI", "AĞAÇLIKLAR", "AĞAÇLIKTA", "AĞAÇLIKTAN", "AĞAÇLIKTA",
    "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA",
    "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA", "AĞAÇLIKTA",
    "AĞLAMAKTA", "AĞLAYARAK", "AĞLAYIŞTA", "AĞLAMIŞTA", "AĞLAYARAK",
    "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK",
    "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK", "AĞLAYARAK",
  ],
};

/**
 * Belirtilen uzunluktaki rastgele kelime seç
 */
export function getRandomWord(length: 5 | 7 | 9): string {
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
  const length = word.length as 5 | 7 | 9;
  if (![5, 7, 9].includes(length)) return false;
  return TURKISH_WORDS[length].includes(word.toUpperCase());
}

/**
 * Kelime anlamı (basit sözlük)
 */
const WORD_MEANINGS: Record<string, string> = {
  "KALE": "Surlarla çevrili eski şehir",
  "AKREP": "Zehirli kuyruklu hayvan",
  "ELMA": "Kırmızı veya yeşil meyve",
  "KALEM": "Yazı yazma aracı",
  "KAPI": "Giriş çıkış yeri",
  "KARA": "Siyah renk",
  "KASA": "Para saklama yeri",
  "KAYA": "Taş kütlesi",
  "KEDI": "Ev hayvanı",
  "SABAH": "Gün doğumundan sonraki zaman",
  "TABAN": "Ayakkabının altı",
  "UÇAK": "Hava taşıtı",
  "YABAN": "Kültürlü olmayan",
  "ZAMAN": "Geçen süre",
  "KALEMCI": "Kalem yapan veya satan kişi",
  "MAHALLE": "Şehirde komşu evlerin bulunduğu yer",
  "SABAHÇI": "Sabah erken kalkıp çalışan",
  "TABAKÇI": "Tabak yapan veya satan kişi",
  "YABANCI": "Başka ülkeden gelen",
  "UÇAKÇI": "Uçak pilotu",
  "AĞAÇ": "Gövdesi olan bitki",
  "AĞLAMAK": "Gözyaşı dökmek",
  "AHMET": "Erkek adı",
  "AKÇAY": "Ufak para",
};

export function getWordMeaning(word: string): string {
  return WORD_MEANINGS[word.toUpperCase()] || "Anlam bilinmiyor";
}
