import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { CAREER_PATH_PLAYERS, CAREER_PATH_ROUNDS, CAREER_PATH_MAX_CLUBS } from "../../lib/constants"
import { matchName } from "../../lib/utils"
import { Input } from "../ui/Input"
import type { CareerPathPlayer } from "../../lib/constants"

type Phase = "ready" | "playing" | "round-result" | "done"

function pickPlayers(): CareerPathPlayer[] {
  const shuffled = [...CAREER_PATH_PLAYERS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, CAREER_PATH_ROUNDS)
}

function calculateXP(clubsRevealed: number): number {
  if (clubsRevealed <= 1) return 300
  if (clubsRevealed === 2) return 250
  if (clubsRevealed === 3) return 200
  if (clubsRevealed === 4) return 150
  return 100
}

export function CareerPath() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState(0)
  const [players] = useState(pickPlayers)
  const [clubsRevealed, setClubsRevealed] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [results, setResults] = useState<{ correct: boolean; clubsRevealed: number; xp: number }[]>([])
  const [guess, setGuess] = useState("")
  const [roundResult, setRoundResult] = useState<{ correct: boolean; xp: number; clubsRevealed: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  const current = players[round]

  useEffect(() => {
    if (phase === "playing" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase, round])

  useEffect(() => {
    return () => {
      savedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      saveGameResult({
        gameId: "career-path",
        score: correctCount,
        details: { correct: correctCount, total: CAREER_PATH_ROUNDS },
        xpEarned: totalXp,
      })
    }
  }, [phase, correctCount, totalXp])

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setRound(0)
    setClubsRevealed(1)
    setCorrectCount(0)
    setTotalXp(0)
    setResults([])
    setGuess("")
    setRoundResult(null)
  }

  function handleGuess() {
    if (!guess.trim() || !current) return
    const correct = matchName(guess, current.name)
    const xp = correct ? calculateXP(clubsRevealed) : 0

    if (correct) {
      setCorrectCount((c) => c + 1)
      setTotalXp((t) => t + xp)
      setRoundResult({ correct: true, xp, clubsRevealed })
      setResults((r) => [...r, { correct: true, clubsRevealed, xp }])
      setPhase("round-result")
    } else {
      if (clubsRevealed >= current.clubs.length || clubsRevealed >= CAREER_PATH_MAX_CLUBS) {
        setRoundResult({ correct: false, xp: 0, clubsRevealed })
        setResults((r) => [...r, { correct: false, clubsRevealed, xp: 0 }])
        setPhase("round-result")
      } else {
        setClubsRevealed((c) => c + 1)
        setGuess("")
      }
    }
  }

  function handlePass() {
    if (!current) return
    if (clubsRevealed >= current.clubs.length || clubsRevealed >= CAREER_PATH_MAX_CLUBS) {
      setRoundResult({ correct: false, xp: 0, clubsRevealed })
      setResults((r) => [...r, { correct: false, clubsRevealed, xp: 0 }])
      setPhase("round-result")
    } else {
      setClubsRevealed((c) => c + 1)
      setGuess("")
    }
  }

  function handleNext() {
    setGuess("")
    setRoundResult(null)
    if (round + 1 >= CAREER_PATH_ROUNDS) {
      setPhase("done")
    } else {
      setRound((r) => r + 1)
      setClubsRevealed(1)
      setPhase("playing")
    }
  }

  function playAgain() {
    setPhase("ready")
    setRound(0)
    setClubsRevealed(1)
    setCorrectCount(0)
    setTotalXp(0)
    setResults([])
    setGuess("")
    setRoundResult(null)
    setIsPlaying(false)
  }

  const maxClubs = current ? Math.min(current.clubs.length, CAREER_PATH_MAX_CLUBS) : 0

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Career Path</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">Name the player from their club career. Fewer clubs = more points!</p>
        )}
        {(phase === "playing" || phase === "round-result") && (
          <p className="text-text-muted mt-2">
            Round {Math.min(round + 1, CAREER_PATH_ROUNDS)} / {CAREER_PATH_ROUNDS}
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
            <h3 className="text-sm text-text-muted font-heading font-bold mb-3 uppercase tracking-wider">
              Clubs (revealed: {clubsRevealed}/{maxClubs})
            </h3>
            <div className="space-y-2">
              {current.clubs.slice(0, clubsRevealed).map((club, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-surface-3 rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-copper/20 flex items-center justify-center text-xs font-heading font-bold text-copper">
                    {i + 1}
                  </span>
                  <span className="text-text font-medium">{club}</span>
                </motion.div>
              ))}
              {Array.from({ length: maxClubs - clubsRevealed }).map((_, i) => (
                <div
                  key={`hidden-${i}`}
                  className="flex items-center gap-3 p-3 bg-surface-3/30 rounded-lg border border-dashed border-border"
                >
                  <span className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs text-text-dim">
                    ?
                  </span>
                  <span className="text-text-dim italic text-sm">Hidden club</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex gap-2">
            <Input
              ref={inputRef}
              inline
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGuess()
              }}
              placeholder="Type player name..."
            />
            <motion.button
              onClick={handleGuess}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!guess.trim()}
              className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guess
            </motion.button>
          </div>

          <button
            onClick={handlePass}
            className="text-sm text-text-muted hover:text-copper transition-colors underline underline-offset-2"
          >
            Pass (reveal next club)
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "round-result" && roundResult && current && (
          <motion.div
            key={`result-${round}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
          >
            <div className={`p-6 rounded-xl text-center ${
              roundResult.correct
                ? "bg-pitch/10 border border-pitch/30"
                : "bg-surface-3 border border-border"
            }`}>
              <div className="text-4xl mb-2">
                {roundResult.correct ? "✅" : "😤"}
              </div>
              <p className={`text-xl font-heading font-bold mb-1 ${
                roundResult.correct ? "text-pitch-light" : "text-text-muted"
              }`}>
                {roundResult.correct ? "Correct!" : "Out of Clubs!"}
              </p>
              <p className="text-sm text-text-muted mb-1">
                The player is{" "}
                <span className="font-heading font-bold text-copper">
                  {current.name}
                </span>
              </p>
              {roundResult.correct && roundResult.clubsRevealed <= 1 && (
                <p className="text-xs text-copper font-heading font-bold mt-1">
                  One-club wonder! Insane knowledge!
                </p>
              )}
            </div>

            {roundResult.correct && (
              <div className="text-center">
                <p className="text-copper font-heading font-bold">
                  +{roundResult.xp} XP
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
            >
              {round + 1 >= CAREER_PATH_ROUNDS ? "See Results" : "Next Player"}
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
            {correctCount === CAREER_PATH_ROUNDS
              ? "🏆"
              : correctCount >= Math.ceil(CAREER_PATH_ROUNDS * 0.6)
                ? "🎯"
                : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {correctCount === CAREER_PATH_ROUNDS
              ? "Perfect Score!"
              : correctCount >= Math.ceil(CAREER_PATH_ROUNDS * 0.6)
                ? "Great Knowledge!"
                : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {correctCount}/{CAREER_PATH_ROUNDS}
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
                  {r.correct ? `${r.clubsRevealed} club(s) - +${r.xp} XP` : "0 XP"}
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