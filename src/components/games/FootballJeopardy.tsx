import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { FOOTBALL_JEOPARDY_TILES, FOOTBALL_JEOPARDY_TILES_PER_SESSION } from "../../lib/constants"
import { matchName } from "../../lib/utils"
import { Input } from "../ui/Input"
import type { JeopardyTile } from "../../lib/constants"

type Phase = "ready" | "playing" | "answering" | "round-result" | "done"

function pickTiles(): JeopardyTile[] {
  const shuffled = [...FOOTBALL_JEOPARDY_TILES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, FOOTBALL_JEOPARDY_TILES_PER_SESSION)
}

function calculateJeopardyXP(points: number): number {
  if (points >= 1000) return 400
  if (points >= 700) return 300
  if (points >= 400) return 200
  return 100
}

export function FootballJeopardy() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [tiles] = useState(pickTiles)
  const [usedIndices, setUsedIndices] = useState<number[]>([])
  const [currentTile, setCurrentTile] = useState<number | null>(null)
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<{ tile: JeopardyTile; correct: boolean; xp: number }[]>([])
  const [sessionXp, setSessionXp] = useState(0)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  function startGame() {
    setIsPlaying(true)
    savedRef.current = false
    setPhase("playing")
    setUsedIndices([])
    setCurrentTile(null)
    setAnswer("")
    setScore(0)
    setResults([])
    setSessionXp(0)
  }

  function pickTile(index: number) {
    setCurrentTile(index)
    setAnswer("")
    setPhase("answering")
  }

  function handleSubmit() {
    if (currentTile === null) return
    const tile = tiles[currentTile]
    const isCorrect = matchName(answer, tile.answer)
    const xp = isCorrect ? calculateJeopardyXP(tile.points) : 0
    if (isCorrect) {
      setScore((s) => s + tile.points)
      setSessionXp((x) => x + xp)
    }
    setResults((r) => [...r, { tile, correct: isCorrect, xp }])
    setUsedIndices((u) => [...u, currentTile])
    setPhase("round-result")
  }

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      saveGameResult({
        gameId: "football-jeopardy",
        score: score,
        details: { points: score, correct: results.filter((r) => r.correct).length, total: results.length },
        xpEarned: sessionXp,
      })
    }
  }, [phase, score, results.length, sessionXp])

  function handleNext() {
    setCurrentTile(null)
    setAnswer("")
    if (results.length >= FOOTBALL_JEOPARDY_TILES_PER_SESSION) {
      setPhase("done")
    } else {
      setPhase("playing")
    }
  }

  function playAgain() {
    setPhase("ready")
    setUsedIndices([])
    setCurrentTile(null)
    setAnswer("")
    setScore(0)
    setResults([])
    setSessionXp(0)
    setIsPlaying(false)
  }

  const gridTiles = tiles.filter((_, i) => !usedIndices.includes(i))

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Football Jeopardy</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">Pick tiles and answer questions to score points!</p>
        )}
        {phase !== "ready" && (
          <p className="text-text-muted mt-2">
            Score: {score} pts
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
          <p className="text-sm text-text-muted">
            Pick a tile ({gridTiles.length} remaining)
          </p>
          <div className="w-full grid grid-cols-2 gap-3">
            {tiles.map((tile, i) => {
              const used = usedIndices.includes(i)
              return (
                <motion.button
                  key={i}
                  onClick={() => !used && pickTile(i)}
                  disabled={used}
                  whileHover={!used ? { scale: 1.03 } : {}}
                  whileTap={!used ? { scale: 0.97 } : {}}
                  className={`p-4 rounded-xl text-center transition-all ${
                    used
                      ? "bg-surface-3/30 border border-border opacity-40 cursor-not-allowed"
                      : "bg-surface-2 border border-copper/30 hover:border-copper cursor-pointer"
                  }`}
                >
                  <p className={`text-xs font-heading font-bold mb-1 ${used ? "text-text-dim" : "text-copper"}`}>
                    {tile.category}
                  </p>
                  <p className={`text-xl font-heading font-bold ${used ? "text-text-dim" : "text-text"}`}>
                    {tile.points}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "answering" && currentTile !== null && (
          <motion.div
            key="answering"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
          >
            <div className="p-6 bg-surface-2 border border-border rounded-xl">
              <p className="text-xs text-copper font-heading font-bold mb-2">
                {tiles[currentTile].category} - {tiles[currentTile].points} pts
              </p>
              <p className="text-lg text-text font-medium">
                {tiles[currentTile].question}
              </p>
            </div>

            <div className="w-full flex gap-2">
              <Input
                inline
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit()
                }}
                placeholder="Your answer..."
                autoFocus
              />
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={!answer.trim()}
                className="px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "round-result" && currentTile !== null && (
          <motion.div
            key={`result-${currentTile}`}
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
                {results[results.length - 1].correct ? "✅" : "❌"}
              </div>
              <p className={`text-xl font-heading font-bold mb-1 ${
                results[results.length - 1].correct ? "text-pitch-light" : "text-text-muted"
              }`}>
                {results[results.length - 1].correct ? "Correct!" : "Wrong!"}
              </p>
              <p className="text-sm text-text-muted">
                The answer is{" "}
                <span className="font-heading font-bold text-copper">
                  {tiles[currentTile].answer}
                </span>
              </p>
            </div>

            {results[results.length - 1].correct && (
              <div className="text-center">
                <p className="text-copper font-heading font-bold">
                  +{tiles[currentTile].points} pts
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-copper text-base font-heading font-bold rounded-xl hover:bg-copper-hover transition-colors"
            >
              {results.length >= FOOTBALL_JEOPARDY_TILES_PER_SESSION ? "See Results" : "Next Tile"}
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
            {score >= 1000 ? "🏆" : score >= 500 ? "🎯" : "📚"}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">
            {score >= 1000 ? "Jeopardy Champion!" : score >= 500 ? "Great Knowledge!" : "Keep Learning!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {score}
              </p>
              <p className="text-xs text-text-muted mt-1">Points</p>
            </div>
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                +{sessionXp}
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
                  <span className="text-text font-medium truncate">{r.tile.category}</span>
                </span>
                <span className="text-text-muted text-xs">
                  {r.correct ? `+${r.tile.points}` : "wrong"}
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