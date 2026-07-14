import { create } from "zustand"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  total_xp: number
  current_streak: number
  longest_streak: number
  last_streak_date: string | null
  join_date: string
  best_scores: Record<string, number>
  unlocked_cosmetics: string[]
}

interface AuthState {
  user: User | null
  profile: Profile | null
  isGuest: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setIsGuest: (isGuest: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  loadProfile: (userId: string) => Promise<void>
  updateProfile: (updates: Partial<Pick<Profile, "username" | "avatar_url">>) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isGuest: true,
  isLoading: true,

  setUser: (user) => set({ user, isGuest: !user }),

  setProfile: (profile) => set({ profile }),

  setIsGuest: (isGuest) =>
    set({
      isGuest,
      profile: isGuest
        ? {
            id: "",
            username: "Guest",
            avatar_url: null,
            total_xp: 0,
            current_streak: 0,
            longest_streak: 0,
            last_streak_date: null,
            join_date: new Date().toISOString(),
            best_scores: {},
            unlocked_cosmetics: [],
          }
        : null,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  loadProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.error("Failed to load profile:", error)
      set({ isLoading: false, isGuest: true })
      return
    }

    if (data) {
      set({ profile: data as Profile, isGuest: false, isLoading: false })
    } else {
      // Profile doesn't exist yet — create one (fallback if DB trigger didn't fire)
      const username = `Player_${userId.slice(0, 6)}`
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          username,
          avatar_url: null,
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Failed to create profile:", insertError)
        set({ isLoading: false, isGuest: true })
        return
      }

      set({ profile: newProfile as Profile, isGuest: false, isLoading: false })
    }
  },

  updateProfile: async (updates: Partial<Pick<Profile, "username" | "avatar_url">>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (error) return { error: error.message }

    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    }))

    return { error: null }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({
      user: null,
      profile: null,
      isGuest: true,
    })
  },
}))
