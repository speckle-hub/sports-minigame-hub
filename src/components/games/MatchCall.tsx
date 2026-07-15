import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { saveGameResult } from "../../lib/gameService"
import { calculateMatchCallXP, seededRandom } from "../../lib/utils"
import { MATCH_CALL_SCENARIOS, MATCH_CALL_ROUNDS, MATCH_CALL_TIMER_MS } from "../../lib/constants"
import type { MatchCallScenario } from "../../lib/constants"
import { sfxGoal, sfxMiss, sfxRoundComplete, sfxGameComplete } from "../../lib/sound"

type Phase = "ready" | "playing" | "round-result" | "done"

function pickScenarios(): MatchCallScenario[] {
  const rng = seededRandom(Date.now())
  const pool = [...MATCH_CALL_SCENARIOS]
  const picked: MatchCallScenario[] = []
  for (let i = 0; i < Math.min(MATCH_CALL_ROUNDS, pool.length); i++) {
    const idx = Math.floor(rng() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }
  return picked
}

export function MatchCall() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState(0)
  const [scenarios] = useState(pickScenarios)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MATCH_CALL_TIMER_MS)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [results, setResults] = useState<{ correct: boolean; timeMs: number }[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundStartRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRound = useCallback(() => {
    setSelectedAnswer(null)
    setTimeLeft(MATCH_CALL_TIMER_MS)
    roundStartRef.current = performance.now()

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return next
      })
    }, 100)
  }, [])

  const handleStart = useCallback(() => {
    setPhase("playing")
    startRound()
  }, [startRound])

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null

      const elapsed = performance.now() - roundStartRef.current
      const timeMs = Math.round(elapsed)
      const correct = index === scenarios[round].correctIndex

      setSelectedAnswer(index)
      setTimeLeft(0)

      if (correct) {
        setCorrectCount((c) => c + 1)
        sfxGoal()
      } else {
        sfxMiss()
      }
      setTotalTime((t) => t + timeMs)
      setResults((r) => [...r, { correct, timeMs }])

      if (round + 1 >= MATCH_CALL_ROUNDS) {
        setTimeout(() => { setPhase("done"); sfxGameComplete() }, 1500)
      } else {
        setTimeout(() => {
          setPhase("round-result"); sfxRoundComplete()
        }, 1500)
      }
    },
    [selectedAnswer, scenarios, round]
  )

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null

    const elapsed = performance.now() - roundStartRef.current
    setSelectedAnswer(-1)
    setTimeLeft(0)
    setTotalTime((t) => t + Math.round(elapsed))
    setResults((r) => [...r, { correct: false, timeMs: Math.round(elapsed) }])
    sfxMiss()

    if (round + 1 >= MATCH_CALL_ROUNDS) {
      setTimeout(() => { setPhase("done"); sfxGameComplete() }, 1500)
    } else {
      setTimeout(() => {
        setPhase("round-result"); sfxRoundComplete()
      }, 1500)
    }
  }, [round])

  useEffect(() => {
    if (timeLeft === 0 && selectedAnswer === null && phase === "playing") {
      handleTimeout()
    }
  }, [timeLeft, selectedAnswer, phase, handleTimeout])

  const nextRound = useCallback(() => {
    setRound((r) => r + 1)
    setPhase("playing")
    startRound()
  }, [startRound])

  const playAgain = useCallback(() => {
    setPhase("ready")
    setRound(0)
    setCorrectCount(0)
    setSelectedAnswer(null)
    setResults([])
    setTotalTime(0)
    setTimeLeft(MATCH_CALL_TIMER_MS)
  }, [])

  const savedRef = useRef(false)

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      const avgTime = results.length > 0 ? Math.floor(totalTime / results.length) : MATCH_CALL_TIMER_MS
      const xp = calculateMatchCallXP(correctCount, MATCH_CALL_ROUNDS, avgTime)
      saveGameResult({
        gameId: "match-call",
        score: correctCount,
        details: {
          correct: correctCount,
          total: MATCH_CALL_ROUNDS,
          averageTimeMs: avgTime,
        },
        xpEarned: xp,
      })
    }
    if (phase !== "done") {
      savedRef.current = false
    }
  }, [phase, results.length, totalTime, correctCount])

  const current = scenarios[round]
  const timerPct = timeLeft / MATCH_CALL_TIMER_MS

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-heading font-bold text-text">Match Call</h1>
          <p className="text-text-muted mt-2">Predict the outcome. Beat the clock.</p>
        </motion.div>

        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-copper glow-copper-strong text-base font-heading font-bold text-base rounded-xl"
        >
          Start Session
        </motion.button>

        <p className="text-sm text-text-muted">
          {MATCH_CALL_ROUNDS} rounds &bull; {MATCH_CALL_TIMER_MS / 1000}s per round
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-12 max-w-xl mx-auto px-4">
      <motion.div
        className="text-center w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Match Call</h1>
        <p className="text-text-muted mt-1">
          Round {Math.min(round + 1, MATCH_CALL_ROUNDS)} / {MATCH_CALL_ROUNDS}
        </p>
      </motion.div>

      {phase === "round-result" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={nextRound}
            className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
          >
            Next Round
          </button>
        </motion.div>
      )}

      {phase === "playing" && (
        <>
          {/* Timer bar */}
          <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                timerPct > 0.3 ? "bg-copper" : "bg-danger"
              }`}
              animate={{ width: `${timerPct * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Scenario card */}
          <div className="w-full p-6 bg-surface-2 border border-border rounded-xl">
            <p className="text-text text-sm leading-relaxed">{current.scenario}</p>
          </div>

          {/* Options */}
          <div className="w-full grid grid-cols-1 gap-3">
            {current.options.map((option, i) => {
              let variant = "bg-surface-2 border-border hover:border-copper/40"
              if (selectedAnswer !== null) {
                if (i === current.correctIndex) {
                  variant = "bg-pitch/20 border-pitch/40"
                } else if (i === selectedAnswer && i !== current.correctIndex) {
                  variant = "bg-danger/10 border-danger/30"
                } else {
                  variant = "bg-surface-3/50 border-border opacity-50"
                }
              }
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full p-4 border rounded-xl text-left text-sm font-medium text-text transition-colors ${variant}`}
                  whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                >
                  <span className="text-copper font-heading font-bold mr-2">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* Timer warning */}
          {timerPct <= 0.3 && selectedAnswer === null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-danger font-medium"
            >
              Time is running out!
            </motion.p>
          )}
        </>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 w-full"
        >
          <div className="text-4xl">
            {correctCount === MATCH_CALL_ROUNDS
              ? "🏆"
              : correctCount >= MATCH_CALL_ROUNDS * 0.6
                ? "🎯"
                : "📊"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">Session Complete</h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {correctCount}/{MATCH_CALL_ROUNDS}
              </p>
              <p className="text-xs text-text-muted mt-1">Correct</p>
            </div>
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-text">
                {results.length > 0
                  ? Math.floor(totalTime / results.length / 1000) + "s"
                  : "—"}
              </p>
              <p className="text-xs text-text-muted mt-1">Avg Time</p>
            </div>
          </div>

          <div className="w-full space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                  r.correct
                    ? "bg-pitch/10 border border-pitch/20"
                    : "bg-danger/10 border border-danger/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{r.correct ? "✅" : "❌"}</span>
                  <span className="text-text font-medium">Round {i + 1}</span>
                </span>
                <span className="text-text-muted text-xs">{Math.floor(r.timeMs / 100)}.{Math.floor((r.timeMs % 100) / 10)}s</span>
              </div>
            ))}
          </div>

          <button
            onClick={playAgain}
            className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  )
}
