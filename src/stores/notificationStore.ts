import { create } from "zustand"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "./authStore"

export interface AppNotification {
  id: string
  user_id: string
  type: "challenge_received" | "challenge_result" | "badge_unlocked" | "follower" | "level_up"
  title: string
  body: string
  link?: string
  read: boolean
  created_at: string
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  loadNotifications: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  loadNotifications: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ notifications: [], unreadCount: 0 })
      return
    }

    set({ loading: true })
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Failed to load notifications:", error)
      set({ loading: false })
      return
    }

    const notifications = (data || []) as AppNotification[]
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      loading: false,
    })
  },

  markRead: async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length }
    })
  },

  markAllRead: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },
}))
