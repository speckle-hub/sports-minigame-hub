import { create } from "zustand"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "./authStore"
import { GAME_LABELS } from "../lib/utils"

export interface Challenge {
  id: string
  challenger_id: string
  challenged_id: string
  game_id: string
  challenger_score: number
  challenged_score: number | null
  status: "pending" | "completed"
  winner_id: string | null
  created_at: string
  completed_at: string | null
  challenger_username?: string
  challenged_username?: string
}

const LOWER_IS_BETTER = new Set(["reflex-rush", "tactics-daily"])

function isBeat(challengerScore: number, challengedScore: number, gameId: string): boolean {
  if (LOWER_IS_BETTER.has(gameId)) {
    return challengedScore < challengerScore
  }
  return challengedScore > challengerScore
}

interface ChallengeState {
  challenges: Challenge[]
  loading: boolean
  pendingCount: number
  loadChallenges: () => Promise<void>
  sendChallenge: (challengedId: string, gameId: string, challengerScore: number) => Promise<{ error: string | null }>
  checkAndResolveChallenge: (userId: string, gameId: string, newScore: number) => Promise<void>
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  loading: false,
  pendingCount: 0,

  loadChallenges: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ challenges: [], pendingCount: 0 })
      return
    }

    set({ loading: true })

    const { data, error } = await supabase
      .from("challenges")
      .select(`
        *,
        challenger:challenger_id(username),
        challenged:challenged_id(username)
      `)
      .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to load challenges:", error)
      set({ loading: false })
      return
    }

    const challenges: Challenge[] = (data || []).map((r: any) => ({
      id: r.id,
      challenger_id: r.challenger_id,
      challenged_id: r.challenged_id,
      game_id: r.game_id,
      challenger_score: r.challenger_score,
      challenged_score: r.challenged_score,
      status: r.status,
      winner_id: r.winner_id,
      created_at: r.created_at,
      completed_at: r.completed_at,
      challenger_username: r.challenger?.username,
      challenged_username: r.challenged?.username,
    }))

    const pendingCount = challenges.filter((c) => c.status === "pending" && c.challenged_id === user.id).length

    set({ challenges, pendingCount, loading: false })
  },

  sendChallenge: async (challengedId: string, gameId: string, challengerScore: number) => {
    const user = useAuthStore.getState().user
    if (!user) return { error: "Not signed in" }
    if (user.id === challengedId) return { error: "Cannot challenge yourself" }

    const { error } = await supabase.from("challenges").insert({
      challenger_id: user.id,
      challenged_id: challengedId,
      game_id: gameId,
      challenger_score: challengerScore,
    })

    if (error) return { error: error.message }

    const gameLabel = GAME_LABELS[gameId as keyof typeof GAME_LABELS] || gameId
    const challengerName = useAuthStore.getState().profile?.username || "Someone"
    setTimeout(() => {
      supabase.from("notifications").insert({
        user_id: challengedId,
        type: "challenge_received",
        title: "New Challenge!",
        body: `${challengerName} challenged you on ${gameLabel} — beat their score of ${challengerScore} to win`,
        link: "/challenges",
      }).then()
    }, 0)

    await get().loadChallenges()
    return { error: null }
  },

  checkAndResolveChallenge: async (userId: string, gameId: string, newScore: number) => {
    const { data: pending } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenged_id", userId)
      .eq("game_id", gameId)
      .eq("status", "pending")

    if (!pending || pending.length === 0) return

    const gameLabel = GAME_LABELS[gameId as keyof typeof GAME_LABELS] || gameId
    const profile = useAuthStore.getState().profile
    const myName = profile?.username || "Someone"

    for (const challenge of pending) {
      const beat = isBeat(challenge.challenger_score, newScore, gameId)
      const winnerId = beat ? userId : challenge.challenger_id

      await supabase
        .from("challenges")
        .update({
          status: "completed",
          challenged_score: newScore,
          winner_id: winnerId,
          completed_at: new Date().toISOString(),
        })
        .eq("id", challenge.id)

      // Notify both players
      setTimeout(() => {
        if (beat) {
          supabase.from("notifications").insert([
            {
              user_id: userId,
              type: "challenge_result",
              title: "You won!",
              body: `You beat ${challenge.challenger_username || "your opponent"} on ${gameLabel}!`,
              link: "/challenges",
            },
            {
              user_id: challenge.challenger_id,
              type: "challenge_result",
              title: "Challenge lost",
              body: `${myName} beat your ${gameLabel} challenge`,
              link: "/challenges",
            },
          ]).then()
        } else {
          supabase.from("notifications").insert([
            {
              user_id: userId,
              type: "challenge_result",
              title: "Challenge lost",
              body: `You couldn't beat ${challenge.challenger_username || "your opponent"}'s ${gameLabel} score`,
              link: "/challenges",
            },
            {
              user_id: challenge.challenger_id,
              type: "challenge_result",
              title: "You won!",
              body: `${myName} couldn't beat your ${gameLabel} challenge`,
              link: "/challenges",
            },
          ]).then()
        }
      }, 0)
    }

    await get().loadChallenges()
  },
}))
