import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function xpForNextLevel(level: number): number {
  return (level + 1) ** 2 * 100
}

export function xpForCurrentLevel(level: number): number {
  return level ** 2 * 100
}

export function progressToNextLevel(xp: number): number {
  const level = calculateLevel(xp)
  const current = xpForCurrentLevel(level)
  const next = xpForNextLevel(level)
  if (next === current) return 0
  return (xp - current) / (next - current)
}

export const GAME_IDS = {
  REFLEX_RUSH: "reflex-rush",
  MATCH_CALL: "match-call",
  TACTICS_DAILY: "tactics-daily",
  TRUE_OR_FALSE: "true-or-false",
  CAREER_PATH: "career-path",
  FOOTBALL_AZ: "football-a-z",
  FOOTBALL_JEOPARDY: "football-jeopardy",
  TRIVIA_PATH: "trivia-path",
  TIC_TAC_TOE_GRID: "tic-tac-toe-grid",
} as const

export type GameId = (typeof GAME_IDS)[keyof typeof GAME_IDS]

export const GAME_LABELS: Record<GameId, string> = {
  "reflex-rush": "Reflex Rush",
  "match-call": "Match Call",
  "tactics-daily": "Tactics Daily",
  "true-or-false": "True or False",
  "career-path": "Career Path",
  "football-a-z": "Football A-Z",
  "football-jeopardy": "Football Jeopardy",
  "trivia-path": "Trivia Path",
  "tic-tac-toe-grid": "Tic-Tac-Toe Grid",
}

export const GAME_DESCRIPTIONS: Record<GameId, string> = {
  "reflex-rush": "Test your reaction time. Tap the moment you see the cue.",
  "match-call": "Predict the outcome. Beat the clock. 5 rapid-fire scenarios.",
  "tactics-daily": "Guess the tactic from progressive clues. One puzzle a day.",
  "true-or-false": "Football statements. Are they fact or fiction? 5 rounds to prove your knowledge.",
  "career-path": "Name the player from their club career. Fewer clubs = more points.",
  "football-a-z": "Name a footballer for each letter. Race the clock!",
  "football-jeopardy": "Pick categories and test your football knowledge.",
  "trivia-path": "Answer trivia questions along the path to victory.",
  "tic-tac-toe-grid": "Fill the grid with players matching row and column criteria.",
}

export const AVATAR_GRADIENTS = [
  { id: "copper", from: "copper", to: "copper/50", label: "Copper" },
  { id: "pitch", from: "pitch", to: "pitch-light", label: "Pitch Green" },
  { id: "gold", from: "gold", to: "copper", label: "Gold" },
  { id: "copper-gold", from: "copper", to: "gold", label: "Copper Gold" },
  { id: "pitch-copper", from: "pitch", to: "copper", label: "Pitch Copper" },
  { id: "surface", from: "surface-3", to: "surface-2", label: "Stealth" },
] as const

export function avatarGradientClasses(id: string | null | undefined): string {
  const map: Record<string, string> = {
    copper: "from-copper to-copper/50",
    pitch: "from-pitch to-pitch-light",
    gold: "from-gold to-copper",
    "copper-gold": "from-copper to-gold",
    "pitch-copper": "from-pitch to-copper",
    surface: "from-surface-3 to-surface-2",
  }
  return map[id ?? ""] ?? "from-copper to-copper/50"
}

export function calculateReflexXP(avgReactionMs: number): number {
  if (avgReactionMs <= 0) return 0
  const base = 100
  const bonus = Math.max(0, Math.floor((250 - avgReactionMs) / 2))
  return Math.min(base + bonus, 500)
}

export function calculateMatchCallXP(correct: number, total: number, averageTimeMs: number): number {
  if (total === 0) return 0
  const accuracy = correct / total
  const basePerCorrect = 100
  const accuracyBonus = Math.floor(accuracy * 100)
  const speedBonus = Math.max(0, Math.floor((10000 - averageTimeMs) / 200))
  const raw = Math.floor(correct * basePerCorrect + accuracyBonus + speedBonus)
  return Math.max(0, Math.min(raw, 800))
}

export function calculateTacticsXP(guessesUsed: number): number {
  const maxGuesses = 6
  return Math.floor(((maxGuesses - guessesUsed + 1) / maxGuesses) * 300)
}

export function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function formatTime(ms: number): string {
  return `${ms}ms`
}

export function formatPercentile(rank: number, total: number): string {
  if (total <= 1) return "TOP 100%"
  const pct = Math.round((1 - rank / total) * 100)
  if (pct >= 99) return "TOP 1%"
  if (pct >= 95) return "TOP 5%"
  if (pct >= 90) return "TOP 10%"
  if (pct >= 75) return "TOP 25%"
  if (pct >= 50) return "TOP 50%"
  return `TOP ${100 - pct}%`
}

const accentMap: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a", å: "a", ā: "a", ă: "a", ą: "a",
  é: "e", è: "e", ê: "e", ë: "e", ē: "e", ĕ: "e", ę: "e", ė: "e",
  í: "i", ì: "i", î: "i", ï: "i", ī: "i", ĭ: "i", į: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o", ő: "o", ō: "o", ŏ: "o", ǫ: "o",
  ú: "u", ù: "u", û: "u", ü: "u", ű: "u", ū: "u", ŭ: "o", ů: "u",
  ý: "y", ÿ: "y", ŷ: "y",
  ç: "c", ć: "c", ĉ: "c", ċ: "c", č: "c",
  đ: "d", ď: "d", ḑ: "d",
  ñ: "n", ń: "n", ņ: "n", ň: "n", ŉ: "n",
  š: "s", ś: "s", ŝ: "s", ş: "s",
  ť: "t", ţ: "t", ŧ: "t",
  ž: "z", ź: "z", ż: "z", ʒ: "z",
  æ: "ae", œ: "oe", ß: "ss", þ: "th", ð: "d",
  ğ: "g", ĝ: "g", ġ: "g",
  ĥ: "h",
  ĵ: "j",
  ķ: "k",
  ļ: "l", ł: "l", ľ: "l", ĺ: "l",
  ŗ: "r", ř: "r",
  ų: "u", ũ: "u",
}

export function normalizeAccents(s: string): string {
  return [...s].map((c) => accentMap[c] ?? c).join("")
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
  }
  return dp[m][n]
}

function clean(s: string): string {
  return normalizeAccents(s.toLowerCase().trim().replace(/\s+/g, " "))
}

export function matchName(input: string, target: string, maxTypoDistance: number = 2): boolean {
  const a = clean(input)
  const b = clean(target)
  if (!a || !b) return false
  if (a === b) return true
  if (levenshteinDistance(a, b) <= maxTypoDistance) return true

  const aWords = a.split(" ")
  const bWords = b.split(" ")

  if (aWords.length >= 2 && aWords.some((w) => w === b || levenshteinDistance(w, b) <= maxTypoDistance)) return true
  if (bWords.length >= 2 && bWords.some((w) => w === a || levenshteinDistance(w, a) <= maxTypoDistance)) return true

  if (aWords.length >= 2 && bWords.length >= 2) {
    const aLast = aWords[aWords.length - 1]
    const bLast = bWords[bWords.length - 1]
    if (aLast === bLast || levenshteinDistance(aLast, bLast) <= maxTypoDistance) return true
    const aFirst = aWords[0]
    const bFirst = bWords[0]
    if (aFirst === bFirst || levenshteinDistance(aFirst, bFirst) <= maxTypoDistance) return true
  }

  return false
}
