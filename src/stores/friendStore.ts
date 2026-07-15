import { create } from "zustand"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "./authStore"

export interface SearchResult {
  username: string
  avatar_url: string | null
  total_xp: number
}

interface FriendState {
  followingIds: Set<string>
  followingUsernames: Set<string>
  loading: boolean
  loadFollowing: () => Promise<void>
  isFollowing: (username: string) => boolean
  followUser: (followingId: string) => Promise<{ error: string | null }>
  unfollowUser: (followingId: string) => Promise<{ error: string | null }>
  searchPlayers: (query: string) => Promise<SearchResult[]>
}

export const useFriendStore = create<FriendState>((set, get) => ({
  followingIds: new Set(),
  followingUsernames: new Set(),
  loading: false,

  loadFollowing: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ followingIds: new Set(), followingUsernames: new Set(), loading: false })
      return
    }

    set({ loading: true })
    const { data, error } = await supabase
      .from("follows")
      .select("following_id, profiles!inner(username)")
      .eq("follower_id", user.id)

    if (error) {
      console.error("Failed to load follows:", error)
      set({ loading: false })
      return
    }

    const ids = new Set<string>()
    const usernames = new Set<string>()
    for (const row of data || []) {
      ids.add(row.following_id)
      const p = (row as any).profiles
      if (p?.username) usernames.add(p.username)
    }

    set({ followingIds: ids, followingUsernames: usernames, loading: false })
  },

  isFollowing: (username: string) => {
    return get().followingUsernames.has(username)
  },

  followUser: async (followingId: string) => {
    const user = useAuthStore.getState().user
    if (!user) return { error: "Not signed in" }

    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: followingId,
    })

    if (error) return { error: error.message }

    await get().loadFollowing()
    return { error: null }
  },

  unfollowUser: async (followingId: string) => {
    const user = useAuthStore.getState().user
    if (!user) return { error: "Not signed in" }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", followingId)

    if (error) return { error: error.message }

    await get().loadFollowing()
    return { error: null }
  },

  searchPlayers: async (query: string) => {
    if (!query.trim()) return []

    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url, total_xp")
      .ilike("username", `%${query.trim()}%`)
      .order("total_xp", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Search failed:", error)
      return []
    }

    // Filter out the current user
    const currentUsername = useAuthStore.getState().profile?.username
    return (data || []).filter((p) => p.username !== currentUsername) as SearchResult[]
  },
}))
