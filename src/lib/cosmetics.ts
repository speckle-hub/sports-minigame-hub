export type CosmeticType = "gradient" | "badge"

export interface CosmeticDef {
  id: string
  type: CosmeticType
  name: string
  description: string
  icon: string
  condition: string
  free?: boolean
}

export const ALL_COSMETICS: CosmeticDef[] = [
  // -- Avatar gradients (free defaults) --
  { id: "copper", type: "gradient", name: "Copper", description: "Warm copper gradient", icon: "🟤", condition: "Default", free: true },
  { id: "pitch", type: "gradient", name: "Pitch Green", description: "Fresh pitch gradient", icon: "🟢", condition: "Default", free: true },
  { id: "gold", type: "gradient", name: "Gold", description: "Golden glow", icon: "🟡", condition: "Default", free: true },
  { id: "copper-gold", type: "gradient", name: "Copper Gold", description: "Copper meets gold", icon: "🏆", condition: "Default", free: true },
  { id: "pitch-copper", type: "gradient", name: "Pitch Copper", description: "Green to copper blend", icon: "🌿", condition: "Default", free: true },
  { id: "surface", type: "gradient", name: "Stealth", description: "Dark and subtle", icon: "🌑", condition: "Default", free: true },

  // -- Avatar gradients (unlockable) --
  { id: "amber", type: "gradient", name: "Amber", description: "Gold to copper warmth", icon: "🔶", condition: "Reach Level 3" },
  { id: "ember", type: "gradient", name: "Ember", description: "Copper to deep red", icon: "🔥", condition: "Reach Level 5" },
  { id: "forest", type: "gradient", name: "Forest", description: "Deep pitch green", icon: "🌲", condition: "Reach Level 8" },
  { id: "midnight", type: "gradient", name: "Midnight", description: "Dark with copper edge", icon: "🌙", condition: "Reach Level 12" },
  { id: "royal", type: "gradient", name: "Royal", description: "Gold-dominant prestige", icon: "👑", condition: "Reach Level 15" },
  { id: "sage", type: "gradient", name: "Sage", description: "Muted green elegance", icon: "🌱", condition: "Reach Level 18" },
  { id: "slate", type: "gradient", name: "Slate", description: "Cool dark gradient", icon: "🪨", condition: "Reach Level 22" },
  { id: "flame", type: "gradient", name: "Flame", description: "Red to gold heat", icon: "💥", condition: "Reach Level 25" },

  // -- Streak badges --
  { id: "streak-3", type: "badge", name: "3-Day Run", description: "Maintained a 3-day streak", icon: "🔥", condition: "Reach a 3-day streak" },
  { id: "streak-7", type: "badge", name: "7-Day Streak", description: "Maintained a 7-day streak", icon: "⚡", condition: "Reach a 7-day streak" },
  { id: "streak-30", type: "badge", name: "30-Day Legend", description: "Maintained a 30-day streak", icon: "👑", condition: "Reach a 30-day streak" },

  // -- Level badges --
  { id: "level-5", type: "badge", name: "Rising Star", description: "Reached Level 5", icon: "⭐", condition: "Reach Level 5" },
  { id: "level-10", type: "badge", name: "Football Brain", description: "Reached Level 10", icon: "🧠", condition: "Reach Level 10" },
  { id: "level-20", type: "badge", name: "Legendary", description: "Reached Level 20", icon: "🏆", condition: "Reach Level 20" },

  // -- Completionist --
  { id: "all-games", type: "badge", name: "Full Collection", description: "Played all 9 games", icon: "📋", condition: "Play every game at least once" },

  // -- Skill badges --
  { id: "top-10", type: "badge", name: "Top Class", description: "Top 10 on any leaderboard", icon: "🎯", condition: "Reach top 10 on any leaderboard" },
  { id: "perfect-tactics", type: "badge", name: "Mastermind", description: "Solved Tactics Daily in 1 guess", icon: "🧩", condition: "Solve Tactics Daily in 1 guess" },

  // -- Football-flavored badges --
  { id: "full-time", type: "badge", name: "Full Time", description: "Completed a game with no mistakes", icon: "🏁", condition: "Finish any game with 100% accuracy" },
  { id: "golden-boot", type: "badge", name: "Golden Boot", description: "Top score on Match Call or Reflex Rush", icon: "👟", condition: "Score 5/5 on Match Call or average ≤ 150ms on Reflex Rush" },
]

export const COSMETIC_MAP = new Map(ALL_COSMETICS.map((c) => [c.id, c] as const))

export const FREE_GRADIENT_IDS = new Set(ALL_COSMETICS.filter((c) => c.free).map((c) => c.id))

export const UNLOCKABLE_GRADIENT_IDS = new Set(
  ALL_COSMETICS.filter((c) => c.type === "gradient" && !c.free).map((c) => c.id)
)

export const BADGE_IDS = new Set(ALL_COSMETICS.filter((c) => c.type === "badge").map((c) => c.id))

export function getCosmetic(id: string): CosmeticDef | undefined {
  return COSMETIC_MAP.get(id)
}

export function isUnlocked(cosmeticId: string, unlockedList: string[]): boolean {
  return unlockedList.includes(cosmeticId)
}
