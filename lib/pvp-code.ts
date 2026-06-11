/**
 * PvP Kod Sistemi
 * 
 * 1v1 modu: 2 cihaz, 4 haneli kod
 * 2v2 modu: 4 cihaz, 6 haneli kod
 * 
 * Kod doğrulandığında oyun başlar
 */

export type PvPMode = "1v1" | "2v2";

export interface PvPSession {
  sessionId: string;
  mode: PvPMode;
  code: string;
  createdAt: number;
  expiresAt: number;
  players: PvPPlayer[];
  status: "waiting" | "ready" | "started" | "finished";
}

export interface PvPPlayer {
  deviceId: string;
  playerName: string;
  joinedAt: number;
  score: number;
  isReady: boolean;
}

/**
 * 4 haneli kod oluştur (1v1 için)
 */
export function generateCode1v1(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

/**
 * 6 haneli kod oluştur (2v2 için)
 */
export function generateCode2v2(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Kod formatını doğrula
 */
export function validateCode(code: string, mode: PvPMode): boolean {
  const expectedLength = mode === "1v1" ? 4 : 6;
  return code.length === expectedLength && /^[A-Z0-9]+$/.test(code);
}

/**
 * PvP oturumu oluştur
 */
export function createPvPSession(mode: PvPMode, deviceId: string, playerName: string): PvPSession {
  const code = mode === "1v1" ? generateCode1v1() : generateCode2v2();
  const now = Date.now();
  
  return {
    sessionId: `pvp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    mode,
    code,
    createdAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5 dakika geçerli
    players: [
      {
        deviceId,
        playerName,
        joinedAt: now,
        score: 0,
        isReady: false,
      },
    ],
    status: "waiting",
  };
}

/**
 * Oyuncuyu oturuma ekle
 */
export function addPlayerToSession(
  session: PvPSession,
  deviceId: string,
  playerName: string
): PvPSession | null {
  // Kod geçerli mi?
  if (Date.now() > session.expiresAt) {
    return null; // Kod süresi doldu
  }

  // Oyuncu sayısı kontrol
  const maxPlayers = session.mode === "1v1" ? 2 : 4;
  if (session.players.length >= maxPlayers) {
    return null; // Dolu
  }

  // Zaten katılmış mı?
  if (session.players.some(p => p.deviceId === deviceId)) {
    return session; // Zaten katılmış
  }

  const updatedSession = {
    ...session,
    players: [
      ...session.players,
      {
        deviceId,
        playerName,
        joinedAt: Date.now(),
        score: 0,
        isReady: false,
      },
    ],
  };

  // Tüm oyuncular katıldı mı?
  if (updatedSession.players.length === maxPlayers) {
    updatedSession.status = "ready";
  }

  return updatedSession;
}

/**
 * Oyuncu hazır olduğunu işaretle
 */
export function markPlayerReady(session: PvPSession, deviceId: string): PvPSession {
  return {
    ...session,
    players: session.players.map(p =>
      p.deviceId === deviceId ? { ...p, isReady: true } : p
    ),
    status: session.players.every(p => p.deviceId === deviceId || p.isReady) ? "started" : "ready",
  };
}

/**
 * Oyuncu puanını güncelle
 */
export function updatePlayerScore(session: PvPSession, deviceId: string, points: number): PvPSession {
  return {
    ...session,
    players: session.players.map(p =>
      p.deviceId === deviceId ? { ...p, score: p.score + points } : p
    ),
  };
}

/**
 * Oturumu bitir ve kazananı belirle
 */
export function finishPvPSession(session: PvPSession): { session: PvPSession; winner?: PvPPlayer } {
  const sortedPlayers = [...session.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return {
    session: {
      ...session,
      status: "finished",
    },
    winner,
  };
}

/**
 * Oturum geçerli mi?
 */
export function isSessionValid(session: PvPSession): boolean {
  return Date.now() <= session.expiresAt && session.status !== "finished";
}

/**
 * Oturum özeti
 */
export function getSessionSummary(session: PvPSession): string {
  const playerList = session.players
    .map(p => `${p.playerName} (${p.score} puan)`)
    .join(", ");

  return `[${session.mode.toUpperCase()}] ${playerList} — Durum: ${session.status}`;
}
