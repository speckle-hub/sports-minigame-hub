import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { sfxCorrect, sfxIncorrect, sfxRoundComplete, sfxGameComplete } from "../../lib/sound"
import {
  TRUE_FALSE_ROUNDS,
  TRUE_FALSE_TIMER_MS,
  TRUE_FALSE_QUESTIONS,
} from "../../lib/constants"
import type { TrueFalseQuestion } from "../../lib/constants"

type Phase = "ready" | "playing" | "result" | "done"

function pickQuestions(): TrueFalseQuestion[] {
  const shuffled = [...TRUE_FALSE_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, TRUE_FALSE_ROUNDS)
}

function calculateXP(correct: boolean, timeMs: number): number {
  if (!correct) return 0
  const timeFraction = Math.max(0, (TRUE_FALSE_TIMER_MS - timeMs) / TRUE_FALSE_TIMER_MS)
  return 100 + Math.floor(timeFraction * 50)
}

export function TrueFalse() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState(0)
  const [questions] = useState(pickQuestions)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [results, setResults] = useState<{ correct: boolean; xp: number }[]>([])
  const [roundXp, setRoundXp] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const roundStartRef = useRef<number>(0)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  const current = questions[round] as TrueFalseQuestion | undefined

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      saveGameResult({
        gameId: "true-or-false",
        score: correctCount,
        details: { correct: correctCount, total: TRUE_FALSE_ROUNDS },
        xpEarned: totalXp,
      })
    }
  }, [phase, correctCount, totalXp])

  function startTimer() {
    roundStartRef.current = performance.now()
    setSelectedAnswer(null)
    setRoundXp(0)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      setPhase("result")
    }, TRUE_FALSE_TIMER_MS)
  }

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setRound(0)
    setCorrectCount(0)
    setTotalXp(0)
    setResults([])
    setSelectedAnswer(null)
    startTimer()
  }

  function handleAnswer(answer: boolean) {
    if (timeoutRef.current === null) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null

    const elapsed = performance.now() - roundStartRef.current
    const correct = answer === current!.answer
    const xp = calculateXP(correct, elapsed)

    setSelectedAnswer(answer)
    setRoundXp(xp)
    if (correct) {
      setCorrectCount((c) => c + 1)
      setTotalXp((t) => t + xp)
      sfxCorrect()
    } else {
      sfxIncorrect()
    }
    setResults((r) => [...r, { correct, xp }])
    setPhase("result")
  }

  function handleNext() {
    if (round + 1 >= TRUE_FALSE_ROUNDS) {
      setPhase("done")
      sfxGameComplete()
    } else {
      setRound((r) => r + 1)
      setPhase("playing")
      startTimer()
      sfxRoundComplete()
    }
  }

  function playAgain() {
    setPhase("ready")
    setRound(0)
    setCorrectCount(0)
    setTotalXp(0)
    setSelectedAnswer(null)
    setResults([])
    setIsPlaying(false)
  }

  const timedOut = selectedAnswer === null && phase === "result"
  const playerCorrect = selectedAnswer !== null && selectedAnswer === current?.answer
  const timerDuration = TRUE_FALSE_TIMER_MS / 1000

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">True or False</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">Football statements. Are they fact or fiction?</p>
        )}
        {(phase === "playing" || phase === "result") && (
          <p className="text-text-muted mt-2">
            Round {Math.min(round + 1, TRUE_FALSE_ROUNDS)} / {TRUE_FALSE_ROUNDS}
          </p>
        )}
      </motion.div>

      {phase === "ready" && (
        <motion.button
          onClick={startGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-copper glow-copper-strong text-base font-heading font-bold text-base rounded-xl"
        >
          Start Game
        </motion.button>
      )}

      {phase === "playing" && current && (
        <>
          <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              key={round}
              className="h-full rounded-full bg-copper"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: timerDuration, ease: "linear" }}
            />
          </div>

          <motion.div
            key={round}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 bg-surface-2 border border-border rounded-xl text-center"
          >
            <p className="text-lg font-medium text-text leading-relaxed">
              {current.statement}
            </p>
          </motion.div>

          <div className="flex gap-4 w-full">
            <motion.button
              onClick={() => handleAnswer(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-6 py-4 bg-pitch hover:bg-pitch-light text-base font-heading font-bold rounded-xl transition-colors text-lg"
            >
              True
            </motion.button>
            <motion.button
              onClick={() => handleAnswer(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-6 py-4 bg-danger hover:bg-danger/80 text-base font-heading font-bold rounded-xl transition-colors text-lg"
            >
              False
            </motion.button>
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "result" && current && (
          <motion.div
            key={`result-${round}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
          >
            <div className={`p-6 rounded-xl text-center ${
              timedOut
                ? "bg-surface-3 border border-border"
                : playerCorrect
                  ? "bg-pitch/10 border border-pitch/30"
                  : "bg-danger/10 border border-danger/30"
            }`}>
              <div className="text-4xl mb-2">
                {timedOut ? "⏰" : playerCorrect ? "✅" : "❌"}
              </div>
              <p className={`text-xl font-heading font-bold mb-1 ${
                timedOut
                  ? "text-text-muted"
                  : playerCorrect
                    ? "text-pitch-light"
                    : "text-danger"
              }`}>
                {timedOut ? "Time's Up!" : playerCorrect ? "Correct!" : "Wrong!"}
              </p>
              <p className="text-sm text-text-muted mb-3">
                The answer is{" "}
                <span className="font-heading font-bold text-copper">
                  {current.answer ? "True" : "False"}
                </span>
              </p>
              <p className="text-sm text-text leading-relaxed">
                {current.explanation}
              </p>
            </div>

            {!timedOut && playerCorrect && (
              <div className="text-center">
                <p className="text-copper font-heading font-bold">
                  +{roundXp} XP
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
            >
              {round + 1 >= TRUE_FALSE_ROUNDS ? "See Results" : "Next Question"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center space-y-6"
        >
          <div className="text-5xl">
            {correctCount === TRUE_FALSE_ROUNDS
              ? "🏆"
              : correctCount >= TRUE_FALSE_ROUNDS * 0.6
                ? "🎯"
                : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {correctCount === TRUE_FALSE_ROUNDS
              ? "Perfect Score!"
              : correctCount >= TRUE_FALSE_ROUNDS * 0.6
                ? "Great Knowledge!"
                : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {correctCount}/{TRUE_FALSE_ROUNDS}
              </p>
              <p className="text-xs text-text-muted mt-1">Correct</p>
            </div>
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                +{totalXp}
              </p>
              <p className="text-xs text-text-muted mt-1">XP Earned</p>
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
                <span className="text-text-muted text-xs">
                  {r.correct ? `+${r.xp} XP` : "0 XP"}
                </span>
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
