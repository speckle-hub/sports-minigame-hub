import { supabase } from "./supabase"
import { calculateLevel } from "./utils"
import { GAME_IDS } from "./utils"
import { FREE_GRADIENT_IDS } from "./cosmetics"
import type { Profile } from "../stores/authStore"

interface CheckContext {
  gameId?: string
  score?: number
  details?: Record<string, number | string>
  xpEarned?: number
}

export async function checkAndUnlockCosmetics(
  userId: string,
  profile: Profile,
  context?: CheckContext
): Promise<string[]> {
  const currentUnlocked = new Set(profile.unlocked_cosmetics || [])

  // Always grant free items
  for (const id of FREE_GRADIENT_IDS) {
    currentUnlocked.add(id)
  }

  const level = calculateLevel(profile.total_xp)
  const newlyUnlocked: string[] = []

  // Level-based gradients
  const gradientLevels: [number, string][] = [
    [3, "amber"], [5, "ember"], [8, "forest"], [12, "midnight"],
    [15, "royal"], [18, "sage"], [22, "slate"], [25, "flame"],
  ]
  for (const [lvl, id] of gradientLevels) {
    if (level >= lvl && !currentUnlocked.has(id)) {
      currentUnlocked.add(id)
      newlyUnlocked.push(id)
    }
  }

  // Level badges
  const levelBadges: [number, string][] = [
    [5, "level-5"], [10, "level-10"], [20, "level-20"],
  ]
  for (const [lvl, id] of levelBadges) {
    if (level >= lvl && !currentUnlocked.has(id)) {
      currentUnlocked.add(id)
      newlyUnlocked.push(id)
    }
  }

  // Streak badges
  const streakBadges: [number, string][] = [
    [3, "streak-3"], [7, "streak-7"], [30, "streak-30"],
  ]
  for (const [days, id] of streakBadges) {
    if (profile.longest_streak >= days && !currentUnlocked.has(id)) {
      currentUnlocked.add(id)
      newlyUnlocked.push(id)
    }
  }

  // Game-result-based checks (only when context is provided)
  if (context?.gameId) {
    const { gameId, score, details } = context

    // All-games badge: played all 9 game IDs
    if (!currentUnlocked.has("all-games")) {
      const played = await fetchPlayedGames(userId)
      const allIds = Object.values(GAME_IDS)
      if (allIds.every((id) => played.has(id))) {
        currentUnlocked.add("all-games")
        newlyUnlocked.push("all-games")
      }
    }

    // Full Time badge: completed a game with 0 mistakes
    if (!currentUnlocked.has("full-time")) {
      const mistakes =
        details?.correct !== undefined && details?.total !== undefined
          ? Number(details.total) - Number(details.correct)
          : 1
      if (mistakes === 0) {
        currentUnlocked.add("full-time")
        newlyUnlocked.push("full-time")
      }
    }

    // Perfect Tactics: solved in 1 guess
    if (
      !currentUnlocked.has("perfect-tactics") &&
      gameId === GAME_IDS.TACTICS_DAILY &&
      details?.guesses === "1"
    ) {
      currentUnlocked.add("perfect-tactics")
      newlyUnlocked.push("perfect-tactics")
    }

    // Golden Boot: 5/5 on Match Call or ≤ 150ms avg on Reflex Rush
    if (!currentUnlocked.has("golden-boot")) {
      if (gameId === GAME_IDS.MATCH_CALL && score === 5) {
        currentUnlocked.add("golden-boot")
        newlyUnlocked.push("golden-boot")
      } else if (
        gameId === GAME_IDS.REFLEX_RUSH &&
        score !== undefined &&
        score <= 150
      ) {
        currentUnlocked.add("golden-boot")
        newlyUnlocked.push("golden-boot")
      }
    }
  }

  // Top 10 badge: check leaderboard rank
  if (!currentUnlocked.has("top-10")) {
    const isTop10 = await checkTop10Leaderboard(userId)
    if (isTop10) {
      currentUnlocked.add("top-10")
      newlyUnlocked.push("top-10")
    }
  }

  // Persist to Supabase if there are new unlocks
  if (newlyUnlocked.length > 0) {
    const newList = Array.from(currentUnlocked)
    await supabase
      .from("profiles")
      .update({ unlocked_cosmetics: newList })
      .eq("id", userId)
  }

  return newlyUnlocked
}

async function fetchPlayedGames(userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from("game_results")
    .select("game_id")
    .eq("user_id", userId)

  return new Set((data || []).map((r: any) => r.game_id))
}

async function checkTop10Leaderboard(userId: string): Promise<boolean> {
  // Check all-time XP leaderboard — user's rank among profiles
  const { data, error } = await supabase
    .from("profiles")
    .select("id, total_xp")
    .order("total_xp", { ascending: false })
    .limit(10)

  if (error || !data) return false
  return data.some((p) => p.id === userId)
}
