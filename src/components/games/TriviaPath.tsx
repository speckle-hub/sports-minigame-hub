import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { TRIVIA_PATH_QUESTIONS, TRIVIA_PATH_TILES_PER_SESSION } from "../../lib/constants"
import type { TriviaPathQuestion } from "../../lib/constants"

type Phase = "ready" | "playing" | "result" | "done"

function pickQuestions(): TriviaPathQuestion[] {
  const shuffled = [...TRIVIA_PATH_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, TRIVIA_PATH_TILES_PER_SESSION)
}

export function TriviaPath() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [step, setStep] = useState(0)
  const [questions] = useState(pickQuestions)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [results, setResults] = useState<{ correct: boolean; xp: number }[]>([])
  const [stepXp, setStepXp] = useState(0)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  const current = questions[step]

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setStep(0)
    setCorrectCount(0)
    setTotalXp(0)
    setSelectedAnswer(null)
    setResults([])
    setStepXp(0)
  }

  function handleAnswer(index: number) {
    if (selectedAnswer !== null) return
    const correct = index === current.correctIndex
    const xp = correct ? (step + 1) * 30 : 0

    setSelectedAnswer(index)
    setStepXp(xp)
    if (correct) {
      setCorrectCount((c) => c + 1)
      setTotalXp((t) => t + xp)
    }
    setResults((r) => [...r, { correct, xp }])
    setPhase("result")
  }

  function handleNext() {
    setSelectedAnswer(null)
    setStepXp(0)
    if (step + 1 >= TRIVIA_PATH_TILES_PER_SESSION) {
      setPhase("done")
      if (!savedRef.current) {
        savedRef.current = true
        saveGameResult({
          gameId: "trivia-path",
          score: correctCount,
          details: { correct: correctCount, total: TRIVIA_PATH_TILES_PER_SESSION },
          xpEarned: totalXp,
        })
      }
    } else {
      setStep((s) => s + 1)
      setPhase("playing")
    }
  }

  function playAgain() {
    setPhase("ready")
    setStep(0)
    setCorrectCount(0)
    setTotalXp(0)
    setSelectedAnswer(null)
    setResults([])
    setStepXp(0)
    setIsPlaying(false)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Trivia Path</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">Answer trivia questions along the path. No penalties for wrong answers!</p>
        )}
        {(phase === "playing" || phase === "result") && (
          <p className="text-text-muted mt-2">
            Question {Math.min(step + 1, TRIVIA_PATH_TILES_PER_SESSION)} / {TRIVIA_PATH_TILES_PER_SESSION}
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
          <div className="w-full p-6 bg-surface-2 border border-border rounded-xl">
            <p className="text-sm text-text-muted font-heading font-bold mb-3 uppercase tracking-wider">
              {current.difficulty.toUpperCase()}
            </p>
            <p className="text-lg text-text font-medium leading-relaxed">
              {current.question}
            </p>
          </div>

          <div className="w-full space-y-3">
            {current.options.map((option, i) => {
              let variant = "bg-surface-2 border-border hover:border-copper/40 hover:bg-surface-3"
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-4 border rounded-xl text-left text-sm font-medium text-text transition-colors ${variant}`}
                >
                  <span className="text-copper font-heading font-bold mr-2">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </motion.button>
              )
            })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "result" && current && (
          <motion.div
            key={`result-${step}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
          >
            <div className={`p-6 rounded-xl text-center ${
              results[results.length - 1].correct
                ? "bg-pitch/10 border border-pitch/30"
                : "bg-surface-3 border border-border"
            }`}>
              <div className="text-4xl mb-2">
                {results[results.length - 1].correct ? "✅" : "⏭️"}
              </div>
              <p className={`text-xl font-heading font-bold mb-1 ${
                results[results.length - 1].correct ? "text-pitch-light" : "text-text-muted"
              }`}>
                {results[results.length - 1].correct ? "Correct!" : "Not quite!"}
              </p>
              <p className="text-sm text-text-muted">
                The answer is{" "}
                <span className="font-heading font-bold text-copper">
                  {current.options[current.correctIndex]}
                </span>
              </p>
            </div>

            {results[results.length - 1].correct && (
              <div className="text-center">
                <p className="text-copper font-heading font-bold">
                  +{stepXp} XP
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
            >
              {step + 1 >= TRIVIA_PATH_TILES_PER_SESSION ? "See Results" : "Next Question"}
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
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-heading font-bold uppercase">Progress</span>
              <span className="text-xs text-copper font-heading font-bold">
                {results.filter((r) => r.correct).length}/{TRIVIA_PATH_TILES_PER_SESSION}
              </span>
            </div>
            <div className="flex gap-1.5 justify-center">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-heading font-bold ${
                    r.correct ? "bg-pitch text-text" : "bg-surface-3 text-text-dim"
                  }`}
                >
                  {r.correct ? "✓" : "✗"}
                </div>
              ))}
            </div>
          </div>

          <div className="text-5xl">
            {correctCount === TRIVIA_PATH_TILES_PER_SESSION ? "🏆" : correctCount >= 3 ? "🎯" : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {correctCount === TRIVIA_PATH_TILES_PER_SESSION
              ? "Perfect Score!"
              : correctCount >= 3
                ? "Solid Knowledge!"
                : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {correctCount}/{TRIVIA_PATH_TILES_PER_SESSION}
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