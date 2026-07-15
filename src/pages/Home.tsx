import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { StatCard } from "../components/ui/StatCard"
import { StreakBadge } from "../components/ui/StreakBadge"
import { XPBar } from "../components/ui/XPBar"
import { useAuthStore } from "../stores/authStore"
import { supabase } from "../lib/supabase"
import {
  GAME_IDS,
  GAME_LABELS,
  GAME_DESCRIPTIONS,
  calculateLevel,
} from "../lib/utils"

const games = [
  {
    id: GAME_IDS.REFLEX_RUSH,
    icon: "⚡",
    color: "from-copper to-gold",
  },
  {
    id: GAME_IDS.MATCH_CALL,
    icon: "🎯",
    color: "from-gold to-copper",
  },
  {
    id: GAME_IDS.TACTICS_DAILY,
    icon: "🧠",
    color: "from-pitch to-pitch-light",
  },
  {
    id: GAME_IDS.TRUE_OR_FALSE,
    icon: "📖",
    color: "from-copper to-surface-2",
  },
  {
    id: GAME_IDS.CAREER_PATH,
    icon: "🗺️",
    color: "from-pitch-light to-pitch",
  },
  {
    id: GAME_IDS.FOOTBALL_AZ,
    icon: "🔤",
    color: "from-surface-2 to-copper",
  },
  {
    id: GAME_IDS.FOOTBALL_JEOPARDY,
    icon: "❓",
    color: "from-gold to-surface-2",
  },
  {
    id: GAME_IDS.TRIVIA_PATH,
    icon: "🛤️",
    color: "from-surface-2 to-pitch-light",
  },
  {
    id: GAME_IDS.TIC_TAC_TOE_GRID,
    icon: "🎮",
    color: "from-pitch-light to-copper",
  },
]

interface TopPlayer {
  rank: number
  username: string
  avatar_url: string | null
  total_xp: number
  level: number
}

export function Home() {
  const { profile, isGuest } = useAuthStore()
  const level = profile ? calculateLevel(profile.total_xp) : 0
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([])
  const [topPlayersLoading, setTopPlayersLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchTopPlayers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, total_xp")
        .order("total_xp", { ascending: false })
        .limit(3)

      if (!error && data && !cancelled) {
        setTopPlayers(
          data.map((p, i) => ({
            rank: i + 1,
            username: p.username,
            avatar_url: p.avatar_url,
            total_xp: p.total_xp,
            level: calculateLevel(p.total_xp),
          }))
        )
      }
      if (!cancelled) setTopPlayersLoading(false)
    }
    fetchTopPlayers()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-16">
          <motion.h1
            className="text-5xl sm:text-7xl font-heading font-bold text-text mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Your{" "}
            <span className="text-gradient">Sports</span> Arena
          </motion.h1>
          <motion.p
            className="text-lg text-text-muted max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Nine games. One legacy. Play, earn XP, climb the leaderboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to={`/play/${GAME_IDS.TACTICS_DAILY}`}>
              <Button size="lg" className="text-base">
                Today's Challenge →
              </Button>
            </Link>
          </motion.div>
        </section>

        {!isGuest && profile && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-copper/20 flex items-center justify-center text-2xl font-heading font-bold text-copper">
                    {profile.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-text">
                      {profile.username}
                    </h2>
                    <p className="text-sm text-text-muted">Level {level}</p>
                  </div>
                </div>
                {profile.current_streak > 0 && (
                  <StreakBadge count={profile.current_streak} />
                )}
              </div>
              <XPBar xp={profile.total_xp} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <StatCard label="Total XP" value={profile.total_xp} />
                <StatCard
                  label="Longest Streak"
                  value={`${profile.longest_streak} days`}
                />
                <StatCard label="Level" value={level} />
                <StatCard label="Games Played" value={Object.keys(profile.best_scores || {}).length} />
              </div>
            </Card>
          </motion.section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-text mb-6">
            Play Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Link to={`/play/${game.id}`}>
                  <Card
                    variant="highlight"
                    className="group cursor-pointer hover:border-copper/40 transition-colors h-full"
                  >
                    <CardContent>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-4`}
                      >
                        {game.icon}
                      </div>
                      <CardTitle>{GAME_LABELS[game.id]}</CardTitle>
                      <p className="text-sm text-text-muted mt-1">
                        {GAME_DESCRIPTIONS[game.id]}
                      </p>
                      <div className="mt-4 flex items-center text-copper text-sm font-heading font-bold group-hover:gap-2 transition-all">
                        Play Now →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {!topPlayersLoading && topPlayers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-text">
                Top Players
              </h2>
              <Link
                to="/leaderboards"
                className="text-sm text-copper hover:underline"
              >
                View All →
              </Link>
            </div>
            <Card>
              <div className="space-y-3">
                {topPlayers.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    <span
                      className={`w-8 text-center font-heading font-bold text-lg ${
                        player.rank === 1
                          ? "text-gold"
                          : player.rank === 2
                            ? "text-silver"
                            : "text-bronze"
                      }`}
                    >
                      #{player.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center font-heading font-bold text-text">
                      {player.username[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{player.username}</p>
                      <p className="text-xs text-text-muted">Lv.{player.level}</p>
                    </div>
                    <span className="text-sm font-heading font-bold text-copper">
                      {player.total_xp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}
