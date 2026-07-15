import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { sfxCorrect, sfxIncorrect, sfxGameComplete } from "../../lib/sound"
import { FOOTBALL_AZ_LETTERS, FOOTBALL_AZ_TIME_LIMIT, FOOTBALL_AZ_LETTERS_PER_GAME } from "../../lib/constants"
import { matchName } from "../../lib/utils"
import { Input } from "../ui/Input"

type Phase = "ready" | "playing" | "done"

function pickLetters(): string[] {
  const letters = Object.keys(FOOTBALL_AZ_LETTERS).filter(
    (l) => FOOTBALL_AZ_LETTERS[l].length >= 2
  )
  const shuffled = letters.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, FOOTBALL_AZ_LETTERS_PER_GAME)
}

function matchesLetter(input: string, letter: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  const entries = FOOTBALL_AZ_LETTERS[letter] || []
  return entries.some((entry) => matchName(trimmed, entry, 2))
}

function calculateAZXP(correct: number, total: number): number {
  const pct = total > 0 ? correct / total : 0
  const base = 100
  const bonus = Math.floor(pct * 200)
  return base + bonus
}

export function FootballAZ() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [letters] = useState(pickLetters)
  const [letterIndex, setLetterIndex] = useState(0)
  const [correct, setCorrect] = useState<string[]>([])
  const [wrong, setWrong] = useState<string[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [guess, setGuess] = useState("")
  const [timeLeft, setTimeLeft] = useState(FOOTBALL_AZ_TIME_LIMIT)
  const [message, setMessage] = useState<{ text: string; type: "correct" | "wrong" | "skip" } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  const currentLetter = letters[letterIndex]

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === "playing" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase, letterIndex])

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      const totalAttempted = correct.length + wrong.length
      const xp = calculateAZXP(correct.length, totalAttempted)
      saveGameResult({
        gameId: "football-a-z",
        score: correct.length,
        details: { correct: correct.length, wrong: wrong.length, skipped: skipped.length },
        xpEarned: xp,
      })
    }
  }, [phase, correct.length, wrong.length, skipped.length])

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setLetterIndex(0)
    setCorrect([])
    setWrong([])
    setSkipped([])
    setGuess("")
    setTimeLeft(FOOTBALL_AZ_TIME_LIMIT)
    setMessage(null)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          setPhase("done")
          sfxGameComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function handleSubmit() {
    if (!guess.trim() || !currentLetter) return
    const isCorrect = matchesLetter(guess, currentLetter)
    if (isCorrect) {
      setCorrect((c) => [...c, currentLetter])
      setMessage({ text: `Correct! ${guess.trim()}`, type: "correct" })
      sfxCorrect()
    } else {
      setWrong((w) => [...w, currentLetter])
      setMessage({ text: `No match for "${currentLetter}"`, type: "wrong" })
      sfxIncorrect()
    }
    setGuess("")
    setTimeout(() => {
      setMessage(null)
      if (letterIndex + 1 >= letters.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setPhase("done")
      } else {
        setLetterIndex((i) => i + 1)
      }
    }, 800)
  }

  function handlePass() {
    if (!currentLetter) return
    setSkipped((s) => [...s, currentLetter])
    setMessage({ text: `Skipped "${currentLetter}"`, type: "skip" })
    setGuess("")
    setTimeout(() => {
      setMessage(null)
      if (letterIndex + 1 >= letters.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setPhase("done")
      } else {
        setLetterIndex((i) => i + 1)
      }
    }, 500)
  }

  function playAgain() {
    setPhase("ready")
    setLetterIndex(0)
    setCorrect([])
    setWrong([])
    setSkipped([])
    setGuess("")
    setTimeLeft(FOOTBALL_AZ_TIME_LIMIT)
    setMessage(null)
    setIsPlaying(false)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Football A-Z</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">
            Name a footballer for each letter. {FOOTBALL_AZ_TIME_LIMIT} seconds on the clock!
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

      {phase === "playing" && (
        <>
          <div className="w-full h-3 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${(timeLeft / FOOTBALL_AZ_TIME_LIMIT) * 100}%`,
                backgroundColor:
                  timeLeft > 20
                    ? "rgb(183, 121, 31)"
                    : timeLeft > 10
                      ? "rgb(234, 179, 8)"
                      : "rgb(239, 68, 68)",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-text-muted -mt-4">
            {timeLeft}s remaining
          </p>

          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {letters.map((l, i) => {
              let bg = "bg-surface-3"
              if (correct.includes(l)) bg = "bg-pitch"
              else if (wrong.includes(l)) bg = "bg-danger/50"
              else if (skipped.includes(l)) bg = "bg-surface-3/50"
              else if (i === letterIndex) bg = "bg-copper"
              return (
                <div
                  key={l}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-heading font-bold transition-colors ${
                    i === letterIndex ? "text-base scale-110" : "text-text"
                  } ${bg}`}
                >
                  {l}
                </div>
              )
            })}
          </div>

          {message ? (
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full p-4 rounded-xl text-center ${
                message.type === "correct"
                  ? "bg-pitch/10 border border-pitch/30"
                  : message.type === "wrong"
                    ? "bg-danger/10 border border-danger/20"
                    : "bg-surface-2 border border-border"
              }`}
            >
              <p className={`text-sm font-medium ${
                message.type === "correct" ? "text-pitch-light" : message.type === "wrong" ? "text-danger" : "text-text-muted"
              }`}>
                {message.text}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                key={currentLetter}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-2xl bg-copper/20 border-2 border-copper flex items-center justify-center"
              >
                <span className="text-5xl font-heading font-bold text-copper">
                  {currentLetter}
                </span>
              </motion.div>
              <p className="text-sm text-text-muted -mt-2">
                Name a footballer starting with "{currentLetter}"
              </p>

              <div className="w-full flex gap-2">
                <Input
                  ref={inputRef}
                  inline
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                  placeholder="Type player name..."
                />
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!guess.trim()}
                  className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </motion.button>
              </div>

              <button
                onClick={handlePass}
                className="text-sm text-text-muted hover:text-copper transition-colors underline underline-offset-2"
              >
                Pass this letter
              </button>
            </>
          )}
        </>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center space-y-6"
        >
          <div className="text-5xl">
            {correct.length >= 15 ? "🏆" : correct.length >= 10 ? "🎯" : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {correct.length >= 15
              ? "Football Genius!"
              : correct.length >= 10
                ? "Great Knowledge!"
                : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <div className="p-3 bg-surface-2 rounded-xl">
              <p className="text-2xl font-heading font-bold text-pitch-light">
                {correct.length}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Correct</p>
            </div>
            <div className="p-3 bg-surface-2 rounded-xl">
              <p className="text-2xl font-heading font-bold text-danger">
                {wrong.length}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Wrong</p>
            </div>
            <div className="p-3 bg-surface-2 rounded-xl">
              <p className="text-2xl font-heading font-bold text-text-muted">
                {skipped.length}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Passed</p>
            </div>
          </div>

          <div className="w-full space-y-1.5">
            {letters.map((l) => {
              let emoji = "⬜"
              let label = ""
              if (correct.includes(l)) {
                emoji = "✅"
                label = "correct"
              } else if (wrong.includes(l)) {
                emoji = "❌"
                label = "wrong"
              } else if (skipped.includes(l)) {
                emoji = "⏭️"
                label = "skipped"
              } else {
                emoji = "⬜"
                label = "unanswered"
              }
              return (
                <div
                  key={l}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                    correct.includes(l)
                      ? "bg-pitch/10"
                      : wrong.includes(l)
                        ? "bg-danger/10"
                        : "bg-surface-3/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="font-heading font-bold text-text">{l}</span>
                  </span>
                  <span className="text-text-dim text-[10px]">{label}</span>
                </div>
              )
            })}
          </div>

          <div className="text-copper font-heading font-bold">
            +{calculateAZXP(correct.length, correct.length + wrong.length)} XP
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