import { create } from "zustand"

interface GameResult {
  gameId: string
  score: number
  details: Record<string, number | string>
  xpEarned: number
  timestamp: number
}

interface GameState {
  lastResult: GameResult | null
  isPlaying: boolean
  setLastResult: (result: GameResult | null) => void
  setIsPlaying: (isPlaying: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  lastResult: null,
  isPlaying: false,
  setLastResult: (result) => set({ lastResult: result }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}))
