import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { EmptyState } from "../components/ui/EmptyState"
import { useChallengeStore } from "../stores/challengeStore"
import { useAuthStore } from "../stores/authStore"
import { GAME_LABELS } from "../lib/utils"

const tabs = ["received", "sent", "history"] as const
type Tab = (typeof tabs)[number]

const GAME_ICONS: Record<string, string> = {
  "reflex-rush": "⚡",
  "match-call": "⚽",
  "tactics-daily": "🧠",
  "true-or-false": "📖",
  "career-path": "🗺️",
  "football-a-z": "🔤",
  "football-jeopardy": "❓",
  "trivia-path": "🛤️",
  "tic-tac-toe-grid": "🎮",
}

export function Challenges() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { challenges, loading, loadChallenges } = useChallengeStore()
  const [tab, setTab] = useState<Tab>("received")

  useEffect(() => {
    if (user) loadChallenges()
  }, [user, loadChallenges])

  const received = challenges.filter((c) => c.challenged_id === user?.id && c.status === "pending")
  const sent = challenges.filter((c) => c.challenger_id === user?.id && c.status === "pending")
  const history = challenges.filter((c) => c.status === "completed")

  const activeList = tab === "received" ? received : tab === "sent" ? sent : history

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Head-to-Head Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-surface-2 rounded-lg p-1 w-fit">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                      tab === t
                        ? "bg-copper text-base"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {t}
                    {t === "received" && received.length > 0 && (
                      <span className="ml-1.5 text-xs bg-danger text-base px-1.5 py-0.5 rounded-full">
                        {received.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-lg bg-surface-3/50 animate-pulse" />
                  ))}
                </div>
              ) : activeList.length === 0 ? (
                <EmptyState
                  icon="🏟️"
                  title={
                    tab === "received"
                      ? "No challenges received"
                      : tab === "sent"
                        ? "No challenges sent"
                        : "No completed challenges"
                  }
                  description={
                    tab === "received"
                      ? "When someone challenges you, it will appear here."
                      : tab === "sent"
                        ? "Visit another player's profile to challenge them on a game."
                        : "Complete challenges to see results here."
                  }
                  action={
                    tab === "sent" ? (
                      <Button variant="secondary" size="sm" onClick={() => navigate("/leaderboards")}>
                        Find Players
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="space-y-3">
                  {activeList.map((c, i) => {
                    const isChallenger = c.challenger_id === user?.id
                    const opponentName = isChallenger ? c.challenged_username : c.challenger_username
                    const myScore = isChallenger ? c.challenger_score : c.challenged_score
                    const theirScore = isChallenger ? c.challenged_score : c.challenger_score
                    const isReceived = tab === "received"
                    const won = c.winner_id === user?.id
                    const gameLabel = GAME_LABELS[c.game_id as keyof typeof GAME_LABELS] || c.game_id

                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="p-4 rounded-xl border border-border bg-surface-2"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center text-xl shrink-0">
                            {GAME_ICONS[c.game_id] || "🎮"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-heading font-bold text-text">
                                {gameLabel}
                              </h3>
                              {c.status === "completed" && (
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                  won
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-danger/20 text-danger"
                                }`}>
                                  {won ? "Won" : "Lost"}
                                </span>
                              )}
                              {c.status === "pending" && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-copper/10 text-copper">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted">
                              {isChallenger ? "vs" : "from"}{" "}
                              <span className="font-medium text-text">{opponentName || "Unknown"}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                              <span>
                                Your score: <span className="font-medium text-text">{myScore ?? "—"}</span>
                              </span>
                              {theirScore != null && (
                                <span>
                                  Their score: <span className="font-medium text-text">{theirScore}</span>
                                </span>
                              )}
                            </div>
                            {c.status === "pending" && c.winner_id == null && (
                              <p className="text-[11px] text-text-muted mt-1">
                                To win: {c.challenged_score == null ? `beat ${c.challenger_score}` : "waiting for result"}
                              </p>
                            )}
                          </div>
                          {isReceived && c.status === "pending" && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => navigate(`/play/${c.game_id}`)}
                            >
                              Play
                            </Button>
                          )}
                        </div>
                        <p className="text-[10px] text-text-muted mt-2">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
