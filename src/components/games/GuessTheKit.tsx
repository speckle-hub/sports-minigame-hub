import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { sfxCorrect, sfxIncorrect, sfxRoundComplete, sfxGameComplete } from "../../lib/sound"
import { KIT_CLUBS, KIT_ROUNDS, KIT_TOTAL_STAGES } from "../../lib/constants"
import { KitPattern } from "./KitPattern"
import type { KitClub } from "../../lib/constants"

type Phase = "ready" | "playing" | "round-result" | "done"

interface RoundData {
  target: KitClub
  options: KitClub[]
  correctIndex: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRounds(): RoundData[] {
  const shuffled = shuffleArray(KIT_CLUBS)
  const rounds: RoundData[] = []
  let poolIndex = KIT_ROUNDS

  for (let i = 0; i < KIT_ROUNDS; i++) {
    const target = shuffled[i]
    const distractors = shuffled.slice(poolIndex, poolIndex + 3)
    poolIndex += 3

    const options = shuffleArray([target, ...distractors])
    const correctIndex = options.findIndex((o) => o.name === target.name)
    rounds.push({ target, options, correctIndex })
  }

  return rounds
}

function calculateXP(stage: number): number {
  if (stage === 1) return 300
  if (stage === 2) return 200
  return 100
}

export function GuessTheKit() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState(0)
  const [stage, setStage] = useState(1)
  const [rounds] = useState(pickRounds)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [results, setResults] = useState<{ correct: boolean; stage: number; xp: number }[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [roundXp, setRoundXp] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [waitingForReveal, setWaitingForReveal] = useState(false)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  const current = rounds[round]

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      saveGameResult({
        gameId: "guess-the-kit",
        score: correctCount,
        details: { correct: correctCount, total: KIT_ROUNDS },
        xpEarned: totalXp,
      })
    }
  }, [phase, correctCount, totalXp])

  useEffect(() => {
    return () => {
      savedRef.current = true
    }
  }, [])

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setRound(0)
    setStage(1)
    setCorrectCount(0)
    setTotalXp(0)
    setResults([])
    setSelectedAnswer(null)
    setRoundXp(0)
    setFeedbackMessage("")
    setWaitingForReveal(false)
  }

  function handleAnswer(index: number) {
    if (selectedAnswer !== null || waitingForReveal) return
    setSelectedAnswer(index)

    const correct = index === current.correctIndex

    if (correct) {
      const xp = calculateXP(stage)
      setRoundXp(xp)
      setCorrectCount((c) => c + 1)
      setTotalXp((t) => t + xp)
      setResults((r) => [...r, { correct: true, stage, xp }])
      sfxCorrect()
      setPhase("round-result")
    } else {
      sfxIncorrect()
      if (stage >= KIT_TOTAL_STAGES) {
        setRoundXp(0)
        setResults((r) => [...r, { correct: false, stage, xp: 0 }])
        setFeedbackMessage(`Not quite! The answer was ${current.target.name}.`)
        setTimeout(() => {
          setPhase("round-result")
        }, 1200)
      } else {
        setWaitingForReveal(true)
        setFeedbackMessage("Nope! Revealing more of the kit...")
        setTimeout(() => {
          setStage((s) => s + 1)
          setSelectedAnswer(null)
          setWaitingForReveal(false)
          setFeedbackMessage("")
        }, 1200)
      }
    }
  }

  function handleRevealMore() {
    if (selectedAnswer !== null || waitingForReveal) return
    if (stage >= KIT_TOTAL_STAGES) return

    setWaitingForReveal(true)
    setFeedbackMessage("Revealing more of the kit...")
    setTimeout(() => {
      setStage((s) => s + 1)
      setWaitingForReveal(false)
      setFeedbackMessage("")
    }, 600)
  }

  function handleNext() {
    setSelectedAnswer(null)
    setStage(1)
    setRoundXp(0)
    setFeedbackMessage("")
    setWaitingForReveal(false)

    if (round + 1 >= KIT_ROUNDS) {
      setPhase("done")
      sfxGameComplete()
    } else {
      setRound((r) => r + 1)
      setPhase("playing")
      sfxRoundComplete()
    }
  }

  function playAgain() {
    setPhase("ready")
    setRound(0)
    setStage(1)
    setCorrectCount(0)
    setTotalXp(0)
    setResults([])
    setSelectedAnswer(null)
    setRoundXp(0)
    setFeedbackMessage("")
    setWaitingForReveal(false)
    setIsPlaying(false)
  }

  const stageLabel = stage === 1 ? "Heavily Cropped" : stage === 2 ? "Partially Revealed" : "Full Kit"

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Guess the Kit</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">Identify the club from a zoomed-in kit illustration. Fewer reveals = more points!</p>
        )}
        {(phase === "playing" || phase === "round-result") && (
          <p className="text-text-muted mt-2">
            Round {Math.min(round + 1, KIT_ROUNDS)} / {KIT_ROUNDS}
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-text-muted font-heading font-bold uppercase tracking-wider">
                Kit Preview
              </h3>
              <span className="text-xs text-copper font-heading font-bold">
                {stageLabel}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`kit-${round}-${stage}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <KitPattern club={current.target} stage={stage} />
              </motion.div>
            </AnimatePresence>
          </div>

          {feedbackMessage && (
            <motion.p
              key={feedbackMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-text-muted text-center"
            >
              {feedbackMessage}
            </motion.p>
          )}

          {!waitingForReveal && selectedAnswer === null && stage < KIT_TOTAL_STAGES && (
            <button
              onClick={handleRevealMore}
              className="text-sm text-text-muted hover:text-copper transition-colors underline underline-offset-2"
            >
              Reveal more of the kit (-100 XP if correct after)
            </button>
          )}

          <div className="w-full space-y-3">
            {current.options.map((option, i) => {
              const isSelected = selectedAnswer === i
              const isCorrectOption = i === current.correctIndex

              let variant = "bg-surface-2 border-border hover:border-copper/40 hover:bg-surface-3"
              if (isSelected) {
                variant = isCorrectOption
                  ? "bg-pitch/10 border border-pitch/30"
                  : "bg-danger/10 border border-danger/20"
              } else if (selectedAnswer !== null && isCorrectOption) {
                variant = "bg-pitch/10 border border-pitch/30"
              }

              return (
                <motion.button
                  key={`${option.name}-${i}`}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null || waitingForReveal}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={selectedAnswer === null && !waitingForReveal ? { scale: 1.01 } : {}}
                  whileTap={selectedAnswer === null && !waitingForReveal ? { scale: 0.99 } : {}}
                  className={`w-full p-4 border rounded-xl text-left text-sm font-medium text-text transition-colors ${variant} disabled:cursor-default`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: option.primary }}
                    />
                    <span className="text-copper font-heading font-bold mr-2">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{option.name}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "round-result" && (
          <motion.div
            key={`result-${round}`}
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
                {results[results.length - 1].correct ? "✅" : "😤"}
              </div>
              <p className={`text-xl font-heading font-bold mb-1 ${
                results[results.length - 1].correct ? "text-pitch-light" : "text-text-muted"
              }`}>
                {results[results.length - 1].correct ? "Correct!" : "Out of Reveals!"}
              </p>
              <p className="text-sm text-text-muted mb-1">
                The club is{" "}
                <span className="font-heading font-bold text-copper">
                  {current.target.name}
                </span>
              </p>
              {results[results.length - 1].correct && results[results.length - 1].stage <= 1 && (
                <p className="text-xs text-copper font-heading font-bold mt-1">
                  Incredible eye for kits!
                </p>
              )}
            </div>

            {results[results.length - 1].correct && (
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
              {round + 1 >= KIT_ROUNDS ? "See Results" : "Next Round"}
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
            {correctCount === KIT_ROUNDS
              ? "🏆"
              : correctCount >= Math.ceil(KIT_ROUNDS * 0.6)
                ? "🎯"
                : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {correctCount === KIT_ROUNDS
              ? "Perfect Score!"
              : correctCount >= Math.ceil(KIT_ROUNDS * 0.6)
                ? "Great Kit Knowledge!"
                : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {correctCount}/{KIT_ROUNDS}
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
                  {r.correct ? `Stage ${r.stage} - +${r.xp} XP` : "0 XP"}
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
