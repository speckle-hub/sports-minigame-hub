import { create } from "zustand"
import { setMuted } from "../lib/sound"

interface SettingsState {
  muted: boolean
  toggleMute: () => void
  _hydrated: boolean
}

const STORAGE_KEY = "sports-hub-settings"

export const useSettingsStore = create<SettingsState>((set, get) => {
  const stored = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return null
  })()

  const initialMuted = stored?.muted ?? false
  setMuted(initialMuted)

  return {
    muted: initialMuted,
    _hydrated: true,
    toggleMute: () => {
      const next = !get().muted
      setMuted(next)
      set({ muted: next })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted: next }))
      } catch {}
    },
  }
})
