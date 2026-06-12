/**
 * PvP Kod Sistemi - Nebasun v1.1
 */

export type PvPMode = "1v1" | "2v2";

export interface PvPPlayer {
  deviceId: string;
  playerName: string;
  joinedAt: number;
  score: number;
  isReady: boolean;
}

export interface PvPSession {
  sessionId: string;
  mode: PvPMode;
  code: string;
  createdAt: number;
  expiresAt: number;
  players: PvPPlayer[];
  status: "waiting" | "ready" | "started" | "finished";
}

export function generateCode(mode: PvPMode): string {
  const length = mode === "1v1" ? 4 : 6;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Okunması kolay karakterler
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function validateCode(code: string, mode: PvPMode): boolean {
  const expectedLength = mode === "1v1" ? 4 : 6;
  return code.length === expectedLength && /^[A-Z0-9]+$/.test(code.toUpperCase());
}

export function createPvPSession(mode: PvPMode, deviceId: string, playerName: string): PvPSession {
  const now = Date.now();
  return {
    sessionId: `pvp_${now}_${Math.random().toString(36).substring(7)}`,
    mode,
    code: generateCode(mode),
    createdAt: now,
    expiresAt: now + 10 * 60 * 1000, // 10 dakika
    players: [{ deviceId, playerName, joinedAt: now, score: 0, isReady: false }],
    status: "waiting",
  };
}
