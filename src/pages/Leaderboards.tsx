import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { cn, GAME_LABELS, GAME_IDS } from "../lib/utils"
import { useLeaderboardStore } from "../stores/leaderboardStore"

const games = [
  { id: "all", label: "All Games" },
  { id: GAME_IDS.REFLEX_RUSH, label: "Reflex Rush" },
  { id: GAME_IDS.MATCH_CALL, label: "Match Call" },
  { id: GAME_IDS.TACTICS_DAILY, label: "Tactics Daily" },
  { id: GAME_IDS.TRUE_OR_FALSE, label: "True or False" },
  { id: GAME_IDS.CAREER_PATH, label: "Career Path" },
  { id: GAME_IDS.FOOTBALL_AZ, label: "Football A-Z" },
  { id: GAME_IDS.FOOTBALL_JEOPARDY, label: "Football Jeopardy" },
  { id: GAME_IDS.TRIVIA_PATH, label: "Trivia Path" },
  { id: GAME_IDS.TIC_TAC_TOE_GRID, label: "Tic-Tac-Toe Grid" },
]

const periods = [
  { id: "all-time" as const, label: "All Time" },
  { id: "weekly" as const, label: "This Week" },
]

export function Leaderboards() {
  const {
    entries,
    isLoading,
    game: selectedGame,
    period: selectedPeriod,
    setGame,
    setPeriod,
    fetchEntries,
  } = useLeaderboardStore()

  useEffect(() => {
    fetchEntries()
  }, [selectedGame, selectedPeriod, fetchEntries])

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-heading font-bold text-text">
              Leaderboards
            </h1>
            <div className="flex gap-2">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    selectedPeriod === p.id
                      ? "bg-copper text-base"
                      : "bg-surface-2 text-text-muted hover:text-text"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => setGame(g.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                  selectedGame === g.id
                    ? "bg-surface-2 text-text border border-copper/30"
                    : "bg-surface-3/50 text-text-muted hover:text-text"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedGame === "all"
                  ? "Global Rankings"
                  : `${GAME_LABELS[selectedGame as keyof typeof GAME_LABELS] || ""} Rankings`}
              </CardTitle>
              <span className="text-xs text-text-muted">
                {selectedPeriod === "all-time" ? "All time" : "This week"}
              </span>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                </div>
              ) : entries.length === 0 ? (
                <p className="text-center py-12 text-text-muted">
                  No entries yet. Be the first to play!
                </p>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedGame}-${selectedPeriod}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    <div className="grid grid-cols-[40px_1fr_80px] gap-3 px-3 py-2 text-xs text-text-muted uppercase tracking-wider font-medium">
                      <span>Rank</span>
                      <span>Player</span>
                      <span className="text-right">Score</span>
                    </div>
                    {entries.map((entry, i) => (
                      <motion.div
                        key={entry.username}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-[40px_1fr_80px] gap-3 items-center p-3 rounded-lg hover:bg-surface-2 transition-colors"
                      >
                        <span
                          className={cn(
                            "text-center font-heading font-bold text-lg",
                            entry.rank === 1 && "text-gold",
                            entry.rank === 2 && "text-silver",
                            entry.rank === 3 && "text-bronze",
                            entry.rank > 3 && "text-text-muted"
                          )}
                        >
                          #{entry.rank}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-3 flex items-center justify-center text-sm font-heading font-bold text-text">
                            {entry.username[0]}
                          </div>
                          <span className="text-sm font-medium text-text">
                            {entry.username}
                          </span>
                        </div>
                        <span className="text-sm font-heading font-bold text-copper text-right">
                          {entry.score}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
