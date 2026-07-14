import { useRef, useCallback, useState } from "react"
import { toPng } from "html-to-image"
import { motion } from "framer-motion"
import { Button } from "./ui/Button"
import { GAME_LABELS, calculateLevel, formatPercentile } from "../lib/utils"

interface ShareCardProps {
  gameId: string
  score: number
  details: Record<string, number | string>
  xpEarned: number
  username?: string
  avatarUrl?: string | null
  rank?: number
  totalPlayers?: number
}

export function ShareCard({
  gameId,
  score,
  details: _details,
  xpEarned,
  username = "Player",
  avatarUrl: _avatarUrl,
  rank = 1,
  totalPlayers = 100,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [shareError, setShareError] = useState<string | null>(null)

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setShareError(null)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0A0A0A",
        skipFonts: true,
      })
      const link = document.createElement("a")
      link.download = `sports-hub-${gameId}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate share card:", err)
      setShareError("Could not generate image. Try a different browser.")
    }
  }, [gameId])

  const level = calculateLevel(xpEarned)
  const percentile = formatPercentile(rank, totalPlayers)

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="w-full max-w-[320px] bg-base border-2 border-copper/30 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-copper/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none grain" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-copper flex items-center justify-center font-heading font-bold text-base text-xs">
                S
              </div>
              <span className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider">
                Sports Hub
              </span>
            </div>
            <span className="text-[10px] font-mono text-text-dim">
              #{Date.now().toString(36).toUpperCase()}
            </span>
          </div>

          <div className="text-center mb-6">
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-[0.2em] mb-1">
              {GAME_LABELS[gameId as keyof typeof GAME_LABELS] || gameId}
            </p>
            <motion.p
              className="text-5xl font-heading font-bold text-copper"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {score}
              {gameId === "reflex-rush" && (
                <span className="text-lg text-text-muted ml-1">ms</span>
              )}
              {gameId === "match-call" && (
                <span className="text-lg text-text-muted ml-1">correct</span>
              )}
              {gameId === "tactics-daily" && (
                <span className="text-lg text-text-muted ml-1">guesses</span>
              )}
            </motion.p>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center font-heading font-bold text-copper text-sm">
                  {username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{username}</p>
                  <p className="text-[10px] text-text-muted">Lv.{level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-heading font-bold text-copper">+{xpEarned} XP</p>
                <p className="text-[10px] text-text-muted">{percentile}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-[10px] text-text-dim font-mono">
            <span>{new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>play.sportshub.com</span>
          </div>
        </div>
      </div>

      <Button onClick={handleDownload} variant="secondary" size="sm">
        Download Card
      </Button>
      {shareError && (
        <p className="text-xs text-danger text-center">{shareError}</p>
      )}
    </div>
  )
}
