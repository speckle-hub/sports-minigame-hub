import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { calculateTacticsXP, seededRandom } from "../../lib/utils"
import { TACTICS_MAX_GUESSES, TACTICS_DAILY_PUZZLES } from "../../lib/constants"
import { saveTacticsDailyResult } from "../../lib/gameService"
import { sfxCorrect, sfxIncorrect, sfxGameComplete } from "../../lib/sound"

const EMOJI_MAP = {
  correct: "🟩",
  close: "🟨",
  wrong: "⬛",
}

const INPUTS = [
  { value: "4-3-3", label: "4-3-3" },
  { value: "Gegenpress", label: "Gegenpress" },
  { value: "Tiki-Taka", label: "Tiki-Taka" },
  { value: "False 9", label: "False 9" },
  { value: "3-5-2", label: "3-5-2" },
  { value: "Route One", label: "Route One" },
  { value: "Total Football", label: "Total Football" },
  { value: "Park the Bus", label: "Park the Bus" },
  { value: "High Line", label: "High Line" },
  { value: "Catenaccio", label: "Catenaccio" },
]

function getDailyPuzzle() {
  const today = new Date()
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const rng = seededRandom(seed)
  const idx = Math.floor(rng() * TACTICS_DAILY_PUZZLES.length)
  return TACTICS_DAILY_PUZZLES[idx]
}

export function TacticsDaily() {
  const puzzle = useMemo(() => getDailyPuzzle(), [])
  const [guesses, setGuesses] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [won, setWon] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleGuess = useCallback(
    (value: string) => {
      if (isComplete || guesses.includes(value)) return
      const newGuesses = [...guesses, value]
      setGuesses(newGuesses)

      if (value === puzzle.answer) {
        setIsComplete(true)
        setWon(true)
        sfxCorrect()
        setTimeout(() => sfxGameComplete(), 400)
        const xp = calculateTacticsXP(newGuesses.length)
        saveTacticsDailyResult({
          gameId: "tactics-daily",
          score: newGuesses.length,
          details: { won: "true", guesses: newGuesses.length },
          xpEarned: xp,
        })
      } else {
        sfxIncorrect()
        if (newGuesses.length >= TACTICS_MAX_GUESSES) {
          setIsComplete(true)
          setWon(false)
          setTimeout(() => sfxGameComplete(), 400)
          saveTacticsDailyResult({
            gameId: "tactics-daily",
            score: TACTICS_MAX_GUESSES,
            details: {
              won: "false",
              guesses: newGuesses.length,
              answer: puzzle.answer,
            },
            xpEarned: 0,
          })
        }
      }
    },
    [guesses, isComplete, puzzle]
  )

  const availableInputs = INPUTS.filter((i) => !guesses.includes(i.value))

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Tactics Daily</h1>
        <p className="text-text-muted mt-2">Guess the tactic from the clues</p>
      </motion.div>

      <div className="w-full space-y-3">
        {puzzle.clues.slice(0, guesses.length + 1).map((clue, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-surface-2 border border-border rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-copper font-heading font-bold text-sm mt-0.5">
                #{i + 1}
              </span>
              <p className="text-text text-sm leading-relaxed">{clue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {!isComplete && (
        <>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableInputs.map((input) => (
              <motion.button
                key={input.value}
                onClick={() => handleGuess(input.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-surface-2 border border-border rounded-lg text-sm font-medium text-text hover:border-copper/40 hover:bg-surface-3 transition-colors"
              >
                {input.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">
              {TACTICS_MAX_GUESSES - guesses.length} guesses remaining
            </span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-copper hover:underline"
            >
              {showHint ? "Hide hint" : "Need a hint?"}
            </button>
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-pitch/10 border border-pitch/30 rounded-xl"
              >
                <p className="text-sm text-pitch-light font-medium">💡 {puzzle.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {guesses.length > 0 && (
        <div className="w-full space-y-1.5">
          {guesses.map((guess, i) => {
            const isCorrect = guess === puzzle.answer
            const isAnswerRevealed =
              isComplete && !won && i === guesses.length - 1
            const emoji = isCorrect
              ? EMOJI_MAP.correct
              : isAnswerRevealed
                ? EMOJI_MAP.wrong
                : EMOJI_MAP.close

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isCorrect
                    ? "bg-pitch/10 border border-pitch/30"
                    : isAnswerRevealed
                      ? "bg-danger/10 border border-danger/20"
                      : "bg-surface-2 border border-border"
                }`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-sm font-medium text-text">{guess}</span>
                {isCorrect && (
                  <span className="text-xs text-pitch-light ml-auto">✓ Correct!</span>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-3xl">{won ? "🎯" : "😤"}</div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {won ? "Well Spotted!" : "Better Luck Tomorrow"}
          </h2>
          <p className="text-text-muted">
            The answer was{" "}
            <span className="text-copper font-heading font-bold">{puzzle.answer}</span>
          </p>
          <p className="text-sm text-text-dim leading-relaxed max-w-md">
            {puzzle.explanation}
          </p>
          <div className="text-sm text-text-muted">
            {won && (
              <span className="text-copper font-heading font-bold">
                +{calculateTacticsXP(guesses.length)} XP
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
