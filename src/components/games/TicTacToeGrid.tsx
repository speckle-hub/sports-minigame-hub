import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "../../stores/gameStore"
import { saveGameResult } from "../../lib/gameService"
import { sfxCorrect, sfxIncorrect, sfxGameComplete } from "../../lib/sound"
import { TIC_TAC_TOE_GRIDS, TIC_TAC_TOE_TIME_LIMIT } from "../../lib/constants"
import { matchName } from "../../lib/utils"
import { Input } from "../ui/Input"
import type { TicTacToeGridData } from "../../lib/constants"

type Phase = "ready" | "mode-select" | "playing" | "done"
type GameMode = "classic" | "marathon"

const WIN_LINES = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
]

function pickGrid(): TicTacToeGridData {
  return TIC_TAC_TOE_GRIDS[Math.floor(Math.random() * TIC_TAC_TOE_GRIDS.length)]
}

function matchesGridAnswer(input: string, validAnswers: string[]): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  return validAnswers.some((entry) => matchName(trimmed, entry, 2))
}

function checkWin(filled: boolean[][]): boolean {
  return WIN_LINES.some((line) => line.every(([r, c]) => filled[r][c]))
}

export function TicTacToeGrid() {
  const [phase, setPhase] = useState<Phase>("ready")
  const [mode, setMode] = useState<GameMode | null>(null)
  const [grid, setGrid] = useState(pickGrid)
  const [filled, setFilled] = useState<boolean[][]>([[], [], []].map(() => [false, false, false]))
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null)
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIC_TAC_TOE_TIME_LIMIT)
  const [message, setMessage] = useState<{ text: string; type: "correct" | "wrong" } | null>(null)
  const [finalStatus, setFinalStatus] = useState<"win" | "timeout" | "done">("done")
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const savedRef = useRef(false)
  const { setIsPlaying } = useGameStore()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeCell])

  useEffect(() => {
    if (phase === "done" && !savedRef.current) {
      savedRef.current = true
      let xp = 0
      if (mode === "classic") {
        xp = finalStatus === "win" ? 300 + score * 20 : score * 30
      } else {
        xp = 50 + score * 40
      }
      saveGameResult({
        gameId: "tic-tac-toe-grid",
        score: score,
        details: { correct: score, total: 9, mode: mode ?? "", won: finalStatus === "win" ? "true" : "false" },
        xpEarned: xp,
      })
    }
  }, [phase, score, mode, finalStatus])

  function chooseMode(m: GameMode) {
    setMode(m)
    setPhase("playing")
    setIsPlaying(true)
    savedRef.current = false
    setGrid(pickGrid())
    setFilled([[], [], []].map(() => [false, false, false]))
    setActiveCell(null)
    setAnswer("")
    setScore(0)
    setTimeLeft(TIC_TAC_TOE_TIME_LIMIT)
    setMessage(null)
    setFinalStatus("done")

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          setFinalStatus("timeout")
          setPhase("done")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function handleCellClick(row: number, col: number) {
    if (filled[row][col]) return
    if (message) return
    setActiveCell([row, col])
    setAnswer("")
  }

  function handleSubmit() {
    if (!activeCell || !answer.trim()) return
    const [row, col] = activeCell
    const validAnswers = grid.cells[row][col]
    const isCorrect = matchesGridAnswer(answer, validAnswers)
    if (isCorrect) {
      const newFilled = filled.map((r) => [...r])
      newFilled[row][col] = true
      setFilled(newFilled)
      setScore((s) => s + 1)
      setMessage({ text: `Correct! +1`, type: "correct" })
      sfxCorrect()

      if (mode === "classic" && checkWin(newFilled)) {
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          setFinalStatus("win")
          setPhase("done")
          sfxGameComplete()
        }, 1200)
        return
      }
    } else {
      setMessage({ text: `Not in our list for this cell`, type: "wrong" })
      sfxIncorrect()
    }
    setTimeout(() => {
      setMessage(null)
      setActiveCell(null)
      setAnswer("")
    }, 1200)
  }

  function playAgain() {
    setPhase("ready")
    setMode(null)
    setGrid(pickGrid())
    setFilled([[], [], []].map(() => [false, false, false]))
    setActiveCell(null)
    setAnswer("")
    setScore(0)
    setTimeLeft(TIC_TAC_TOE_TIME_LIMIT)
    setMessage(null)
    setFinalStatus("done")
    setIsPlaying(false)
  }

  const allFilled = filled.every((row) => row.every((c) => c))

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text">Tic-Tac-Toe Grid</h1>
        {phase === "ready" && (
          <p className="text-text-muted mt-2">
            Fill the grid by naming players matching each row and column criteria!
          </p>
        )}
        {phase === "playing" && (
          <p className="text-text-muted mt-2">
            {mode === "classic" ? "Fill any 3 in a row to win!" : `Score: ${score}/9`}
          </p>
        )}
      </motion.div>

      {phase === "ready" && (
        <motion.button
          onClick={() => setPhase("mode-select")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-copper glow-copper-strong text-base font-heading font-bold text-base rounded-xl"
        >
          Play Tic-Tac-Toe Grid
        </motion.button>
      )}

      {phase === "mode-select" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-4"
        >
          <p className="text-center text-text-muted text-sm">Choose your mode</p>

          <motion.button
            onClick={() => chooseMode("classic")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full p-6 bg-surface-2 border border-copper/30 hover:border-copper rounded-xl text-left transition-all"
          >
            <p className="text-lg font-heading font-bold text-text mb-1">⚔️ Classic</p>
            <p className="text-sm text-text-muted">
              Fill any 3 cells in a row, column, or diagonal to win. Round ends as soon as you complete a line!
            </p>
          </motion.button>

          <motion.button
            onClick={() => chooseMode("marathon")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full p-6 bg-surface-2 border border-copper/30 hover:border-copper rounded-xl text-left transition-all"
          >
            <p className="text-lg font-heading font-bold text-text mb-1">🏃 Marathon</p>
            <p className="text-sm text-text-muted">
              Fill as many of the 9 cells as you can within the time limit. Score by count.
            </p>
          </motion.button>

          <button
            onClick={() => setPhase("ready")}
            className="text-sm text-text-muted hover:text-copper transition-colors underline underline-offset-2 mx-auto block"
          >
            Back
          </button>
        </motion.div>
      )}

      {phase === "playing" && (
        <>
          <div className="w-full h-3 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${(timeLeft / TIC_TAC_TOE_TIME_LIMIT) * 100}%`,
                backgroundColor:
                  timeLeft > 30
                    ? "rgb(183, 121, 31)"
                    : timeLeft > 15
                      ? "rgb(234, 179, 8)"
                      : "rgb(239, 68, 68)",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-text-muted -mt-4">{timeLeft}s remaining</p>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-[140px_repeat(3,1fr)] gap-1 mb-1">
                <div className="p-2" />
                {grid.cols.map((col, i) => (
                  <div key={i} className="p-2 text-center text-xs font-heading font-bold text-copper leading-tight">
                    {col}
                  </div>
                ))}
              </div>

              {grid.rows.map((rowLabel, row) => (
                <div key={row} className="grid grid-cols-[140px_repeat(3,1fr)] gap-1 mb-1">
                  <div className="p-2 flex items-center text-xs font-heading font-bold text-text-muted leading-tight">
                    {rowLabel}
                  </div>
                  {[0, 1, 2].map((col) => {
                    const isFilled = filled[row][col]
                    const isActive = activeCell?.[0] === row && activeCell?.[1] === col
                    return (
                      <motion.button
                        key={col}
                        onClick={() => handleCellClick(row, col)}
                        disabled={isFilled}
                        whileHover={!isFilled && !activeCell ? { scale: 1.03 } : {}}
                        whileTap={!isFilled && !activeCell ? { scale: 0.97 } : {}}
                        className={`h-20 rounded-xl border transition-all ${
                          isFilled
                            ? "bg-pitch/20 border-pitch/40 cursor-default"
                            : isActive
                              ? "bg-copper/20 border-copper ring-2 ring-copper/40"
                              : "bg-surface-2 border-border hover:border-copper/40 cursor-pointer"
                        }`}
                      >
                        {isFilled ? (
                          <span className="text-2xl">✅</span>
                        ) : isActive ? (
                          <span className="text-xs text-copper font-heading font-bold">Selected</span>
                        ) : (
                          <span className="text-lg text-text-dim">+</span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full p-4 rounded-xl text-center ${
                  message.type === "correct"
                    ? "bg-pitch/10 border border-pitch/30"
                    : "bg-danger/10 border border-danger/20"
                }`}
              >
                <p className={`text-sm font-medium ${
                  message.type === "correct" ? "text-pitch-light" : "text-danger"
                }`}>
                  {message.text}
                </p>
              </motion.div>
            )}

            {!message && activeCell && (
              <div className="w-full flex gap-2">
                <Input
                  ref={inputRef}
                  inline
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                  placeholder="Type player name..."
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
            )}
          </AnimatePresence>

          {!message && !activeCell && (
            <p className="text-sm text-text-muted">Click any empty cell to fill it</p>
          )}
        </>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center space-y-6"
        >
          {mode === "classic" && finalStatus === "win" ? (
            <>
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-heading font-bold text-text">Tic-Tac-Toe! You Win!</h2>
              <p className="text-sm text-text-muted">You completed a line with {score} correct answer(s)</p>
            </>
          ) : mode === "classic" && finalStatus === "timeout" ? (
            <>
              <div className="text-5xl">⏰</div>
              <h2 className="text-2xl font-heading font-bold text-text">Time's Up!</h2>
              <p className="text-sm text-text-muted">No line completed this round</p>
            </>
          ) : (
            <>
              <div className="text-5xl">
                {allFilled ? "🏆" : score >= 5 ? "🎯" : "📚"}
              </div>
              <h2 className="text-2xl font-heading font-bold text-text">
                {allFilled ? "Grid Master!" : score >= 5 ? "Solid Knowledge!" : "Keep Learning!"}
              </h2>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                {score}/9
              </p>
              <p className="text-xs text-text-muted mt-1">Correct</p>
            </div>
            <div className="p-4 bg-surface-2 rounded-xl">
              <p className="text-3xl font-heading font-bold text-copper">
                +{mode === "classic"
                  ? finalStatus === "win" ? 300 + score * 20 : score * 30
                  : 50 + score * 40}
              </p>
              <p className="text-xs text-text-muted mt-1">XP Earned</p>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-1 mb-1">
                <div className="p-1" />
                {grid.cols.map((col, i) => (
                  <div key={i} className="p-1 text-center text-[10px] font-heading font-bold text-copper">
                    {col.length > 15 ? col.slice(0, 15) + "..." : col}
                  </div>
                ))}
              </div>
              {grid.rows.map((rowLabel, row) => (
                <div key={row} className="grid grid-cols-[120px_repeat(3,1fr)] gap-1 mb-1">
                  <div className="p-1 flex items-center text-[10px] font-heading font-bold text-text-muted">
                    {rowLabel.length > 18 ? rowLabel.slice(0, 18) + "..." : rowLabel}
                  </div>
                  {[0, 1, 2].map((col) => (
                    <div
                      key={col}
                      className={`h-12 rounded-lg flex items-center justify-center text-xs ${
                        filled[row][col]
                          ? "bg-pitch/20 border border-pitch/30"
                          : "bg-surface-3/50 border border-dashed border-border"
                      }`}
                    >
                      {filled[row][col] ? "✅" : "❌"}
                    </div>
                  ))}
                </div>
              ))}
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
