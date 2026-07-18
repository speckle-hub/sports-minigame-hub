import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { cn, GAME_LABELS, GAME_IDS } from "../lib/utils"
import { useLeaderboardStore } from "../stores/leaderboardStore"
import { useAuthStore } from "../stores/authStore"
import { useFriendStore } from "../stores/friendStore"
import { LeaderboardSkeleton } from "../components/ui/LeaderboardSkeleton"
import { EmptyState } from "../components/ui/EmptyState"
import type { SearchResult } from "../stores/friendStore"

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
  { id: GAME_IDS.GUESS_THE_KIT, label: "Guess the Kit" },
]

const periods = [
  { id: "all-time" as const, label: "All Time" },
  { id: "weekly" as const, label: "This Week" },
]

export function Leaderboards() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    entries,
    isLoading,
    game: selectedGame,
    period: selectedPeriod,
    filter: selectedFilter,
    setGame,
    setPeriod,
    setFilter,
    fetchEntries,
  } = useLeaderboardStore()
  const { loadFollowing } = useFriendStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [selectedGame, selectedPeriod, selectedFilter, fetchEntries])

  useEffect(() => {
    if (user) loadFollowing()
  }, [user, loadFollowing])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      const { searchPlayers } = useFriendStore.getState()
      const results = await searchPlayers(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const topScore = useMemo(() =>
    entries.length > 0 ? Math.max(...entries.map((e) => e.score)) : 0,
    [entries]
  )

  const emptyMessage =
    selectedFilter === "friends"
      ? {
          icon: "👥" as const,
          title: "Not Following Anyone Yet",
          description: "Search for players to follow and see their scores here.",
        }
      : selectedGame === "all"
        ? {
            icon: "🏟️" as const,
            title: "No Scores Yet",
            description: "No one has played yet. Pick a game and be the first on the board!",
          }
        : {
            icon: "🏟️" as const,
            title: "No Scores Yet",
            description: `No scores yet for ${games.find((g) => g.id === selectedGame)?.label || "this game"}. Be the first to make the list!`,
          }

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
            <LayoutGroup id="leaderboard-filters">
              <div className="flex gap-3 items-center">
                <div className="flex gap-1 bg-surface-2 rounded-lg p-1 relative">
                  <button
                    onClick={() => setFilter("global")}
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10",
                      selectedFilter === "global"
                        ? "text-base"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    {selectedFilter === "global" && (
                      <motion.div
                        layoutId="filter-indicator"
                        className="absolute inset-0 bg-copper rounded-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Global</span>
                  </button>
                  <button
                    onClick={() => setFilter("friends")}
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10",
                      selectedFilter === "friends"
                        ? "text-base"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    {selectedFilter === "friends" && (
                      <motion.div
                        layoutId="filter-indicator"
                        className="absolute inset-0 bg-copper rounded-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Friends</span>
                  </button>
                </div>
                <div className="flex gap-1 bg-surface-2 rounded-lg p-1 relative">
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={cn(
                        "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10",
                        selectedPeriod === p.id
                          ? "text-base"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      {selectedPeriod === p.id && (
                        <motion.div
                          layoutId="period-indicator"
                          className="absolute inset-0 bg-copper rounded-md"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </LayoutGroup>
          </div>

          {selectedPeriod === "weekly" && (
            <div className="mb-6 p-3 rounded-lg bg-surface-2 border border-border flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-sm font-medium text-text">Weekly Rankings</p>
                <p className="text-xs text-text-muted">Fresh leaderboard — resets every Monday</p>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="mb-6">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-sm text-copper hover:underline mb-2"
            >
              {showSearch ? "Hide search" : "Find players →"}
            </button>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    inline
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username..."
                  />
                  {searching && (
                    <p className="text-xs text-text-muted mt-2">Searching...</p>
                  )}
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                      {searchResults.map((r) => {
                        const isFriend = useFriendStore.getState().isFollowing(r.username)
                        return (
                          <button
                            key={r.username}
                            onClick={() => navigate(`/profile/${r.username}`)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-xs font-heading font-bold text-text">
                              {r.username[0]}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text flex items-center gap-2">
                                {r.username}
                                {isFriend && (
                                  <span className="text-[10px] text-copper font-heading font-bold">●</span>
                                )}
                              </p>
                              <p className="text-xs text-text-muted">Lv.{Math.floor(Math.sqrt(r.total_xp / 100))} · {r.total_xp.toLocaleString()} XP</p>
                            </div>
                            <span className="text-xs text-copper">View →</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {searchQuery.trim() && !searching && searchResults.length === 0 && (
                    <p className="text-xs text-text-muted mt-2">No players found matching "{searchQuery}"</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <LayoutGroup id="game-filters">
              {games.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGame(g.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                    selectedGame === g.id
                      ? "text-text border border-copper/30"
                      : "bg-surface-3/50 text-text-muted hover:text-text"
                  )}
                >
                  {selectedGame === g.id && (
                    <motion.div
                      layoutId="game-indicator"
                      className="absolute inset-0 bg-surface-2 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{g.label}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedFilter === "friends"
                  ? "Friends Rankings"
                  : selectedGame === "all"
                    ? "Global Rankings"
                    : `${GAME_LABELS[selectedGame as keyof typeof GAME_LABELS] || ""} Rankings`}
              </CardTitle>
              <span className="text-xs text-text-muted">
                {selectedPeriod === "all-time" ? "All time" : "This week"}
              </span>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LeaderboardSkeleton />
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={emptyMessage.icon}
                  title={emptyMessage.title}
                  description={emptyMessage.description}
                  action={
                    selectedFilter === "friends" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowSearch(true)}
                      >
                        Find Players
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedGame}-${selectedPeriod}-${selectedFilter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1"
                  >
                    <div className="grid grid-cols-[40px_1fr_120px] gap-3 px-3 py-2 text-xs text-text-muted uppercase tracking-wider font-medium">
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
                        className="grid grid-cols-[40px_1fr_120px] gap-3 items-center p-3 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
                        onClick={() => navigate(`/profile/${entry.username}`)}
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
                          <span className="text-sm font-medium text-text flex items-center gap-2">
                            {entry.username}
                            {entry.isFriend && (
                              <span className="text-[10px] text-copper font-heading font-bold">●</span>
                            )}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-heading font-bold text-copper">
                            {entry.score}
                          </span>
                          {topScore > 0 && (
                            <div className="h-[3px] rounded-full bg-surface-3/50 mt-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(entry.score / topScore) * 100}%` }}
                                transition={{ delay: i * 0.03 + 0.2, duration: 0.5, ease: "easeOut" }}
                                className="h-full rounded-full bg-copper"
                              />
                            </div>
                          )}
                        </div>
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
