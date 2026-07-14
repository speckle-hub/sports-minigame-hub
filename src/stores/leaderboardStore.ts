import { create } from "zustand"
import { supabase } from "../lib/supabase"

export interface LeaderboardEntry {
  rank: number
  username: string
  avatar_url: string | null
  score: number
  xp: number
  isFriend: boolean
}

interface LeaderboardState {
  entries: LeaderboardEntry[]
  isLoading: boolean
  filter: "global" | "friends"
  game: string | "all"
  period: "all-time" | "weekly"
  setEntries: (entries: LeaderboardEntry[]) => void
  setIsLoading: (isLoading: boolean) => void
  setFilter: (filter: "global" | "friends") => void
  setGame: (game: string | "all") => void
  setPeriod: (period: "all-time" | "weekly") => void
  fetchEntries: () => Promise<void>
}

function getStartOfWeek(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  entries: [],
  isLoading: false,
  filter: "global",
  game: "all",
  period: "all-time",
  setEntries: (entries) => set({ entries }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set({ filter }),
  setGame: (game) => set({ game }),
  setPeriod: (period) => set({ period }),
  fetchEntries: async () => {
    const { game, period } = get()
    set({ isLoading: true })

    try {
      if (game === "all" && period === "all-time") {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, total_xp")
          .order("total_xp", { ascending: false })
          .limit(100)

        if (error) throw error

        const entries: LeaderboardEntry[] = (data || []).map((p, i) => ({
          rank: i + 1,
          username: p.username,
          avatar_url: p.avatar_url,
          score: p.total_xp,
          xp: p.total_xp,
          isFriend: false,
        }))

        set({ entries, isLoading: false })
        return
      }

      if (game === "all" && period === "weekly") {
        const weekStart = getStartOfWeek()
        const { data, error } = await supabase
          .from("game_results")
          .select("xp_earned, user_id, profiles(username, avatar_url)")
          .gte("created_at", weekStart)

        if (error) throw error

        const userMap = new Map<string, { username: string; avatar_url: string | null; xp: number }>()
        for (const r of data || []) {
          const p = (r as any).profiles
          if (!p) continue
          const key = p.username
          const existing = userMap.get(key) || { username: p.username, avatar_url: p.avatar_url, xp: 0 }
          existing.xp += (r as any).xp_earned
          userMap.set(key, existing)
        }

        const entries: LeaderboardEntry[] = Array.from(userMap.values())
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 100)
          .map((p, i) => ({
            rank: i + 1,
            username: p.username,
            avatar_url: p.avatar_url,
            score: p.xp,
            xp: p.xp,
            isFriend: false,
          }))

        set({ entries, isLoading: false })
        return
      }

      const isWeekly = period === "weekly"
      let query = supabase
        .from("game_results")
        .select("score, xp_earned, user_id, profiles(username, avatar_url)")
        .eq("game_id", game)
        .order("score", { ascending: false })

      if (isWeekly) {
        query = query.gte("created_at", getStartOfWeek())
      }

      const { data, error } = await query

      if (error) throw error

      const userMap = new Map<string, { username: string; avatar_url: string | null; bestScore: number; totalXp: number }>()
      for (const r of data || []) {
        const p = (r as any).profiles
        if (!p) continue
        const key = p.username
        const existing = userMap.get(key) || { username: p.username, avatar_url: p.avatar_url, bestScore: 0, totalXp: 0 }
        if (r.score > existing.bestScore) {
          existing.bestScore = r.score
        }
        existing.totalXp += r.xp_earned
        userMap.set(key, existing)
      }

      const entries: LeaderboardEntry[] = Array.from(userMap.values())
        .sort((a, b) => b.bestScore - a.bestScore)
        .slice(0, 100)
        .map((p, i) => ({
          rank: i + 1,
          username: p.username,
          avatar_url: p.avatar_url,
          score: p.bestScore,
          xp: p.totalXp,
          isFriend: false,
        }))

      set({ entries, isLoading: false })
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
      set({ entries: [], isLoading: false })
    }
  },
}))
