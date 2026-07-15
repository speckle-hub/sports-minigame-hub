import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { calculateReflexXP } from "../../lib/utils"
import { REFLEX_RUSH_ROUNDS } from "../../lib/constants"
import { saveGameResult } from "../../lib/gameService"
import { sfxCorrect, sfxGameComplete } from "../../lib/sound"

type Phase = "ready" | "waiting" | "cue" | "result" | "done"

export function ReflexRush() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState<number | null>(null)
  const [falseStart, setFalseStart] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)
  const { setIsPlaying } = useGameStore()

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const startRound = useCallback(() => {
    cleanup()
    setPhase("waiting")
    setFalseStart(false)

    const delay = 1000 + Math.random() * 2500
    timeoutRef.current = setTimeout(() => {
      setPhase("cue")
      startTimeRef.current = performance.now()
    }, delay)
  }, [cleanup])

  const nextRound = useCallback(() => {
    setRound((r) => r + 1)
    startRound()
  }, [startRound])

  const handleClick = useCallback(() => {
    if (phase === "ready") {
      setIsPlaying(true)
      startRound()
      return
    }

    if (phase === "waiting") {
      cleanup()
      setFalseStart(true)
      setPhase("result")
      return
    }

    if (phase === "cue") {
      const reactionTime = performance.now() - startTimeRef.current
      const newTimes = [...times, Math.round(reactionTime)]
      setTimes(newTimes)
      setCurrentTime(Math.round(reactionTime))
      sfxCorrect()

      if (round + 1 >= REFLEX_RUSH_ROUNDS) {
        setPhase("done")
        sfxGameComplete()
      } else {
        setPhase("result")
        sfxCorrect()
      }
      return
    }

    if (phase === "result") {
      if (falseStart) {
        startRound()
      } else {
        nextRound()
      }
    }
  }, [phase, startRound, nextRound, times, round, cleanup, falseStart])

  useEffect(() => {
    if (phase === "ready") {
      setRound(0)
      setTimes([])
      setCurrentTime(null)
      setFinalScore(null)
      setFalseStart(false)
      setIsPlaying(false)
    }
  }, [phase, setIsPlaying])

  useEffect(() => {
    if (phase === "done" && times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      setFinalScore(avg)
      const xp = calculateReflexXP(avg)
      saveGameResult({
        gameId: "reflex-rush",
        score: avg,
        details: { times: times.join(","), average: avg },
        xpEarned: xp,
      })
    }
  }, [phase, times])

  const playAgain = useCallback(() => {
    setPhase("ready")
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Reflex Rush</h1>
        <p className="text-text-muted mt-2">
          Round {Math.min(round + 1, REFLEX_RUSH_ROUNDS)} / {REFLEX_RUSH_ROUNDS}
        </p>
      </motion.div>

      <motion.button
        onClick={handleClick}
        className={`
          w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center cursor-pointer select-none
          transition-all duration-150
          ${phase === "ready" ? "bg-copper glow-copper-strong" : ""}
          ${phase === "waiting" ? "bg-surface-2 border-2 border-border" : ""}
          ${phase === "cue" ? "bg-pitch glow-copper scale-105" : ""}
          ${phase === "result" ? "bg-surface-3" : ""}
          ${falseStart ? "!bg-danger !glow-none" : ""}
        `}
        whileHover={{ scale: phase === "ready" ? 1.05 : 1 }}
        whileTap={{ scale: phase === "ready" ? 0.95 : 1 }}
      >
        <AnimatePresence mode="wait">
          {phase === "ready" && (
            <motion.span
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-heading font-bold text-base"
            >
              TAP TO START
            </motion.span>
          )}
          {phase === "waiting" && (
            <motion.span
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.05, 1] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-lg font-heading font-bold text-text-muted"
            >
              WAIT...
            </motion.span>
          )}
          {phase === "cue" && (
            <motion.span
              key="cue"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-2xl font-heading font-bold text-text"
            >
              ⚡ TAP!
            </motion.span>
          )}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {falseStart ? (
                <>
                  <p className="text-xl font-heading font-bold text-danger mb-1">
                    FALSE START!
                  </p>
                  <p className="text-sm text-text-muted">Tap to retry this round</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-heading font-bold text-copper mb-1">
                    {currentTime}ms
                  </p>
                  <p className="text-sm text-text-muted">Tap to continue</p>
                </>
              )}
            </motion.div>
          )}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-sm text-text-muted mb-1">Average</p>
              <p className="text-4xl font-heading font-bold text-copper mb-2">
                {finalScore}ms
              </p>
              <p className="text-xs text-text-muted mb-4">
                XP: +{finalScore ? calculateReflexXP(finalScore) : 0}
              </p>
              <button
                onClick={playAgain}
                className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {times.length > 0 && phase !== "ready" && (
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {times.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-10 h-14 bg-surface-2 rounded-lg flex items-center justify-center text-xs font-heading font-bold text-text-muted"
            >
              {t}ms
            </motion.div>
          ))}
          {Array.from({ length: REFLEX_RUSH_ROUNDS - times.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-10 h-14 bg-surface-3/50 rounded-lg border border-dashed border-border"
            />
          ))}
        </div>
      )}
    </div>
  )
}
