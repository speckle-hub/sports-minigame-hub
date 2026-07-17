import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { searchPlayers, type SportsDBPlayer } from "../../lib/thesportsdb"

interface PlayerSearchProps {
  onSelect: (player: SportsDBPlayer) => void
  onClose: () => void
  positionLabel: string
}

export function PlayerSearch({ onSelect, onClose, positionLabel }: PlayerSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SportsDBPlayer[]>([])
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await searchPlayers(q)
      setResults(data.slice(0, 12))
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 400)
    return () => clearTimeout(t)
  }, [query, doSearch])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full sm:max-w-md bg-surface rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-h-[80vh] flex flex-col"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-bold text-text">
            Search Players
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-text-muted mb-3">
          Adding player to: <span className="text-copper font-bold">{positionLabel}</span>
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name (e.g. Messi, Ronaldo)..."
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-copper transition-colors mb-4"
          autoFocus
        />

        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {loading && (
            <div className="flex justify-center py-8">
              <span className="w-5 h-5 border-2 border-copper border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-center text-text-muted py-8 text-sm">
              No players found for "{query}"
            </p>
          )}

          {!loading &&
            results.map((player) => (
              <button
                key={player.idPlayer}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors text-left"
                onClick={() => onSelect(player)}
              >
                {player.strThumb ? (
                  <img
                    src={player.strThumb}
                    alt={player.strPlayer}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-sm font-heading font-bold text-text-muted">
                    {player.strPlayer
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">
                    {player.strPlayer}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {player.strTeam} · {player.strPosition || "Unknown"}
                  </p>
                </div>
                <span className="text-xs text-text-dim shrink-0">
                  #{player.strNumber || "—"}
                </span>
              </button>
            ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
