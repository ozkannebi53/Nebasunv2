import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Rarity = "Sıradan" | "Nadir" | "Epik" | "Efsanevi" | "Mitik" | "Kozmik";
export type League = "Bronz" | "Gümüş" | "Altın" | "Elmas" | "Efsane" | "Akrep Ustaları";

export interface Scorpion {
  id: string;
  name: string;
  rarity: Rarity;
  emoji: string;
  color: string;
  unlocked: boolean;
}

export interface City {
  id: string;
  name: string;
  country: string;
  completed: boolean;
  stars: number; // 0-3
  emoji: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  progress: number;
  reward: { gold?: number; xp?: number; gems?: number };
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  league: League;
  leaguePoints: number;
  currentCity: string;
  currentCityIndex: number;
  totalWordsFound: number;
  streak: number;
  lastPlayDate: string;
  activeScorpion: string;
  scorpions: Scorpion[];
  cities: City[];
  quests: Quest[];
  achievements: Achievement[];
  combo: number;
  maxCombo: number;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const SCORPIONS: Scorpion[] = [
  { id: "golden",   name: "Altın Akrep",    rarity: "Kozmik",    emoji: "🦂", color: "#FFD700", unlocked: true  },
  { id: "ice",      name: "Buz Akrebi",     rarity: "Efsanevi",  emoji: "❄️", color: "#00BFFF", unlocked: false },
  { id: "lava",     name: "Lav Akrebi",     rarity: "Epik",      emoji: "🌋", color: "#FF4500", unlocked: false },
  { id: "desert",   name: "Çöl Akrebi",     rarity: "Nadir",     emoji: "🏜️", color: "#DEB887", unlocked: false },
  { id: "storm",    name: "Fırtına Akrebi", rarity: "Efsanevi",  emoji: "⚡", color: "#9400D3", unlocked: false },
  { id: "nebula",   name: "Nebula Akrebi",  rarity: "Mitik",     emoji: "🌌", color: "#FF69B4", unlocked: false },
  { id: "galaxy",   name: "Galaksi Akrebi", rarity: "Kozmik",    emoji: "🌠", color: "#7B2FFF", unlocked: false },
  { id: "king",     name: "Kral Akrep",     rarity: "Mitik",     emoji: "👑", color: "#FF8C00", unlocked: false },
];

export const TURKEY_CITIES: City[] = [
  { id: "istanbul",      name: "İstanbul",      country: "Türkiye",    completed: false, stars: 0, emoji: "🕌" },
  { id: "ankara",        name: "Ankara",        country: "Türkiye",    completed: false, stars: 0, emoji: "🏛️" },
  { id: "izmir",         name: "İzmir",         country: "Türkiye",    completed: false, stars: 0, emoji: "🌊" },
  { id: "antalya",       name: "Antalya",       country: "Türkiye",    completed: false, stars: 0, emoji: "🏖️" },
  { id: "bursa",         name: "Bursa",         country: "Türkiye",    completed: false, stars: 0, emoji: "🏔️" },
  { id: "adana",         name: "Adana",         country: "Türkiye",    completed: false, stars: 0, emoji: "🌶️" },
  { id: "konya",         name: "Konya",         country: "Türkiye",    completed: false, stars: 0, emoji: "🌾" },
  { id: "trabzon",       name: "Trabzon",       country: "Türkiye",    completed: false, stars: 0, emoji: "🍵" },
  { id: "gaziantep",     name: "Gaziantep",     country: "Türkiye",    completed: false, stars: 0, emoji: "🥜" },
  { id: "erzurum",       name: "Erzurum",       country: "Türkiye",    completed: false, stars: 0, emoji: "❄️" },
];

export const WORLD_CITIES: City[] = [
  { id: "baku",          name: "Bakü",          country: "Azerbaycan", completed: false, stars: 0, emoji: "🔥" },
  { id: "tehran",        name: "Tahran",        country: "İran",       completed: false, stars: 0, emoji: "🕌" },
  { id: "baghdad",       name: "Bağdat",        country: "Irak",       completed: false, stars: 0, emoji: "🏺" },
  { id: "damascus",      name: "Şam",           country: "Suriye",     completed: false, stars: 0, emoji: "🌹" },
  { id: "cairo",         name: "Kahire",        country: "Mısır",      completed: false, stars: 0, emoji: "🔺" },
  { id: "athens",        name: "Atina",         country: "Yunanistan", completed: false, stars: 0, emoji: "🏛️" },
  { id: "rome",          name: "Roma",          country: "İtalya",     completed: false, stars: 0, emoji: "🍕" },
  { id: "paris",         name: "Paris",         country: "Fransa",     completed: false, stars: 0, emoji: "🗼" },
  { id: "madrid",        name: "Madrid",        country: "İspanya",    completed: false, stars: 0, emoji: "💃" },
  { id: "tokyo",         name: "Tokyo",         country: "Japonya",    completed: false, stars: 0, emoji: "🗾" },
  { id: "beijing",       name: "Pekin",         country: "Çin",        completed: false, stars: 0, emoji: "🐉" },
];

export const INITIAL_QUESTS: Quest[] = [
  { id: "q1", title: "Kelime Avcısı",    description: "20 kelime bul",       type: "daily",   target: 20, progress: 0, reward: { gold: 50,  xp: 100 }, completed: false },
  { id: "q2", title: "Düellist",         description: "3 düello kazan",      type: "daily",   target: 3,  progress: 0, reward: { gold: 80,  xp: 150 }, completed: false },
  { id: "q3", title: "Deyim Ustası",     description: "5 deyim tamamla",     type: "weekly",  target: 5,  progress: 0, reward: { gold: 200, xp: 300 }, completed: false },
  { id: "q4", title: "Turnuva Savaşçısı","description": "1 turnuva oyna",    type: "weekly",  target: 1,  progress: 0, reward: { gems: 10,  xp: 200 }, completed: false },
  { id: "q5", title: "Keşifçi",          description: "3 şehir tamamla",     type: "monthly", target: 3,  progress: 0, reward: { gems: 50,  xp: 500 }, completed: false },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "İlk Adım",         description: "İlk kelimeni bul",          unlocked: false, icon: "🎯" },
  { id: "a2", title: "İlk 100 Kelime",   description: "100 kelime bul",            unlocked: false, icon: "💯" },
  { id: "a3", title: "İlk 1000 Kelime",  description: "1000 kelime bul",           unlocked: false, icon: "🏆" },
  { id: "a4", title: "Kelime Ustası",    description: "10000 kelime bul",          unlocked: false, icon: "👑" },
  { id: "a5", title: "Akrep Sadakati",   description: "30 gün üst üste oyna",      unlocked: false, icon: "🦂" },
  { id: "a6", title: "30 Günlük Seri",   description: "30 gün seri yap",           unlocked: false, icon: "🔥" },
  { id: "a7", title: "Turnuva Şampiyonu","description": "Bir turnuva kazan",       unlocked: false, icon: "🥇" },
  { id: "a8", title: "Dünya Gezgini",    description: "5 ülkeyi tamamla",          unlocked: false, icon: "🌍" },
];

const DEFAULT_STATE: PlayerState = {
  name: "Akrep Savaşçısı",
  level: 1,
  xp: 0,
  xpToNext: 1000,
  gold: 500,
  gems: 50,
  energy: 50,
  maxEnergy: 50,
  league: "Bronz",
  leaguePoints: 0,
  currentCity: "istanbul",
  currentCityIndex: 0,
  totalWordsFound: 0,
  streak: 0,
  lastPlayDate: "",
  activeScorpion: "golden",
  scorpions: SCORPIONS,
  cities: [...TURKEY_CITIES, ...WORLD_CITIES],
  quests: INITIAL_QUESTS,
  achievements: INITIAL_ACHIEVEMENTS,
  combo: 0,
  maxCombo: 0,
};

// ─── Storage Helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = "@nebasun_player";

export async function loadPlayer(): Promise<PlayerState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (_) {}
  return { ...DEFAULT_STATE };
}

export async function savePlayer(state: PlayerState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

export function addXP(state: PlayerState, amount: number): PlayerState {
  let xp = state.xp + amount;
  let level = state.level;
  let xpToNext = state.xpToNext;
  while (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = Math.floor(xpToNext * 1.3);
  }
  return { ...state, xp, level, xpToNext };
}

export function addGold(state: PlayerState, amount: number): PlayerState {
  return { ...state, gold: state.gold + amount };
}

export function incrementCombo(state: PlayerState): PlayerState {
  const combo = state.combo + 1;
  return { ...state, combo, maxCombo: Math.max(state.maxCombo, combo) };
}

export function resetCombo(state: PlayerState): PlayerState {
  return { ...state, combo: 0 };
}

export function getLeagueColor(league: League): string {
  const map: Record<League, string> = {
    "Bronz": "#CD7F32",
    "Gümüş": "#C0C0C0",
    "Altın": "#FFD700",
    "Elmas": "#00BFFF",
    "Efsane": "#FF4500",
    "Akrep Ustaları": "#5A2EFF",
  };
  return map[league] ?? "#CD7F32";
}

export function getRarityColor(rarity: Rarity): string {
  const map: Record<Rarity, string> = {
    "Sıradan":   "#9BA1A6",
    "Nadir":     "#22C55E",
    "Epik":      "#A855F7",
    "Efsanevi":  "#FF8A00",
    "Mitik":     "#FF4500",
    "Kozmik":    "#FFD700",
  };
  return map[rarity] ?? "#9BA1A6";
}
