import { useState, useRef, useCallback, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { toPng } from "html-to-image"
import { Pitch } from "./Pitch"
import { PositionSlot } from "./PositionSlot"
import { PlayerSearch } from "./PlayerSearch"
import {
  FORMATIONS,
  HISTORIC_LINEUPS,
  type Formation,
  type HistoricLineup,
} from "../../lib/constants"
import type { SportsDBPlayer } from "../../lib/thesportsdb"
import { searchPlayers, getPhotoUrl } from "../../lib/thesportsdb"

type Mode = "custom" | "historic"

interface DragState {
  player: SportsDBPlayer
  sourceIndex: number // -1 = pool, 0..n = slot
  x: number
  y: number
}

export function FormationBuilder() {
  const [mode, setMode] = useState<Mode>("custom")
  const [formation, setFormation] = useState<Formation>(FORMATIONS[0])
  const [lineup, setLineup] = useState<HistoricLineup | null>(null)
  const [slotPlayers, setSlotPlayers] = useState<(SportsDBPlayer | null)[]>(
    Array(formation.positions.length).fill(null)
  )
  const [pool, setPool] = useState<SportsDBPlayer[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchSlot, setSearchSlot] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingLineup, setLoadingLineup] = useState(false)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)
  const pitchRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])

  // ---------- formation / lineup ----------
  const handleFormationChange = (f: Formation) => {
    setFormation(f)
    setSlotPlayers(Array(f.positions.length).fill(null))
    setPool([])
    setLineup(null)
  }

  const handleLineupSelect = async (l: HistoricLineup) => {
    setLineup(l)
    const f = FORMATIONS.find((f) => f.id === l.formation) || FORMATIONS[0]
    setFormation(f)
    setSlotPlayers(Array(f.positions.length).fill(null))
    setPool([])
    setLoadingLineup(true)
    for (let i = 0; i < l.players.length && i < f.positions.length; i++) {
      const entry = l.players[i]
      const searchName = entry.searchName || entry.name
      try {
        const results = await searchPlayers(searchName)
        if (results.length > 0) {
          setSlotPlayers((prev) => {
            const next = [...prev]
            next[i] = results[0]
            return next
          })
        }
      } catch {
        // silently skip
      }
    }
    setLoadingLineup(false)
  }

  // ---------- search ----------
  const handleSlotClick = (index: number) => {
    setSearchSlot(index)
    setSearchOpen(true)
  }

  const handlePlayerSelect = (player: SportsDBPlayer) => {
    if (searchSlot === null) return
    setSlotPlayers((prev) => {
      const next = [...prev]
      const displaced = next[searchSlot]
      next[searchSlot] = player
      // return displaced player to pool if any
      if (displaced) setPool((p) => [...p, displaced])
      return next
    })
    setSearchOpen(false)
    setSearchSlot(null)
  }

  // ---------- drag ----------
  const getSlotCenter = useCallback(
    (index: number) => {
      const el = slotRefs.current[index]
      if (!el || !pitchRef.current) return null
      const slotRect = el.getBoundingClientRect()
      const pitchRect = pitchRef.current.getBoundingClientRect()
      return {
        x: slotRect.left + slotRect.width / 2 - pitchRect.left,
        y: slotRect.top + slotRect.height / 2 - pitchRect.top,
      }
    },
    []
  )

  const findClosestSlot = useCallback(
    (px: number, py: number): number | null => {
      let best = -1
      let bestDist = 50 // px threshold
      for (let i = 0; i < formation.positions.length; i++) {
        const c = getSlotCenter(i)
        if (!c) continue
        const d = Math.hypot(px - c.x, py - c.y)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      }
      return best >= 0 ? best : null
    },
    [formation.positions.length, getSlotCenter]
  )

  const onDragPointerDown = useCallback(
    (player: SportsDBPlayer, sourceIndex: number, e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
      const rect = el.getBoundingClientRect()
      setDrag({
        player,
        sourceIndex,
        x: e.clientX - rect.left + rect.width / 2,
        y: e.clientY - rect.top + rect.height / 2,
      })
    },
    []
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag || !pitchRef.current) return
      e.preventDefault()
      const pitchRect = pitchRef.current.getBoundingClientRect()
      setDrag((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX - pitchRect.left,
              y: e.clientY - pitchRect.top,
            }
          : prev
      )
      setHoverSlot(findClosestSlot(e.clientX - pitchRect.left, e.clientY - pitchRect.top))
    },
    [drag, findClosestSlot]
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!drag || !pitchRef.current) return
      e.preventDefault()
      const pitchRect = pitchRef.current.getBoundingClientRect()
      const target = findClosestSlot(e.clientX - pitchRect.left, e.clientY - pitchRect.top)

      if (target !== null) {
        setSlotPlayers((prev) => {
          const next = [...prev]
          const displaced = next[target]
          next[target] = drag.player
          // return displaced to pool
          if (displaced) {
            if (drag.sourceIndex === -1) {
              // from pool → swap: put displaced in pool
              setPool((p) => [...p, displaced])
            } else {
              // from another slot → swap
              setSlotPlayers((p) => {
                const updated = [...p]
                updated[drag.sourceIndex] = displaced
                return updated
              })
            }
          } else {
            // empty slot
            if (drag.sourceIndex >= 0) {
              // from another slot → clear source
              setSlotPlayers((p) => {
                const updated = [...p]
                updated[drag.sourceIndex] = null
                return updated
              })
            }
          }
          return next
        })
        // remove from pool if dragged from pool
        if (drag.sourceIndex === -1) {
          setPool((p) => p.filter((pl) => pl.idPlayer !== drag.player.idPlayer))
        }
      } else {
        // dropped outside → return to pool
        if (drag.sourceIndex >= 0) {
          setSlotPlayers((prev) => {
            const next = [...prev]
            next[drag.sourceIndex] = null
            return next
          })
          setPool((p) => [...p, drag.player])
        }
      }

      setDrag(null)
      setHoverSlot(null)
    },
    [drag, findClosestSlot]
  )

  const handleRemovePlayer = (index: number) => {
    setSlotPlayers((prev) => {
      const p = prev[index]
      if (p) setPool((pool) => [...pool, p])
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const handleClearAll = () => {
    setSlotPlayers(Array(formation.positions.length).fill(null))
    setPool([])
  }

  const handleSaveImage = async () => {
    if (!pitchRef.current) return
    setSaving(true)
    try {
      const dataUrl = await toPng(pitchRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0A0A0A",
      })
      const link = document.createElement("a")
      link.download = `formation-${formation.id.toLowerCase()}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  // reset slot refs array
  useEffect(() => {
    slotRefs.current = slotRefs.current.slice(0, formation.positions.length)
  }, [formation.positions.length])

  return (
    <div className="space-y-6 select-none">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-bold transition-colors ${
            mode === "custom"
              ? "bg-copper text-white"
              : "bg-surface-2 text-text-muted hover:text-text"
          }`}
          onClick={() => setMode("custom")}
        >
          Custom Mode
        </button>
        <button
          className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-bold transition-colors ${
            mode === "historic"
              ? "bg-copper text-white"
              : "bg-surface-2 text-text-muted hover:text-text"
          }`}
          onClick={() => setMode("historic")}
        >
          Historic Lineups
        </button>
      </div>

      {/* Formation selector */}
      {mode === "custom" && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
            Choose Formation
          </p>
          <div className="grid grid-cols-4 gap-2">
            {FORMATIONS.map((f) => (
              <button
                key={f.id}
                className={`py-2 rounded-lg text-xs sm:text-sm font-heading font-bold transition-colors ${
                  formation.id === f.id
                    ? "bg-pitch text-white border border-copper/50"
                    : "bg-surface-2 text-text-muted hover:text-text border border-transparent"
                }`}
                onClick={() => handleFormationChange(f)}
              >
                {f.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-dim">{formation.description}</p>
        </div>
      )}

      {/* Historic lineup selector */}
      {mode === "historic" && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
            Choose Historic Lineup
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {HISTORIC_LINEUPS.map((l) => (
              <button
                key={l.id}
                className={`text-left p-3 rounded-xl transition-colors ${
                  lineup?.id === l.id
                    ? "bg-pitch border border-copper/50"
                    : "bg-surface-2 hover:bg-surface-3 border border-transparent"
                }`}
                onClick={() => handleLineupSelect(l)}
              >
                <p className="text-sm font-heading font-bold text-text">
                  {l.label}
                </p>
                <p className="text-xs text-text-muted">
                  {l.formation} · {l.year}
                </p>
              </button>
            ))}
          </div>
          {loadingLineup && (
            <div className="flex items-center gap-2 py-2">
              <span className="w-4 h-4 border-2 border-copper border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-text-muted">Loading players from API...</span>
            </div>
          )}
        </div>
      )}

      {/* Pitch with drag-and-drop */}
      <div
        ref={pitchRef}
        className="bg-base rounded-2xl p-4 relative"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          if (drag) {
            setDrag(null)
            setHoverSlot(null)
          }
        }}
        style={{ touchAction: "none" }}
      >
        <Pitch>
          {formation.positions.map((pos, i) => (
            <div
              key={`${formation.id}-${i}`}
              ref={(el) => { slotRefs.current[i] = el }}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <PositionSlot
                x={0}
                y={0}
                label={pos.label}
                player={slotPlayers[i] || null}
                isDropTarget={hoverSlot === i}
                onPointerDown={
                  slotPlayers[i]
                    ? (e) => onDragPointerDown(slotPlayers[i]!, i, e)
                    : undefined
                }
                onClick={() => handleSlotClick(i)}
              />
            </div>
          ))}
        </Pitch>

        {/* Drag ghost */}
        {drag && (
          <div
            className="fixed pointer-events-none z-[100]"
            style={{
              left: drag.x + (pitchRef.current?.getBoundingClientRect().left ?? 0),
              top: drag.y + (pitchRef.current?.getBoundingClientRect().top ?? 0),
              transform: "translate(-50%, -50%)",
            }}
          >
            {getPhotoUrl(drag.player) ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-copper shadow-2xl opacity-90">
                <img
                  src={getPhotoUrl(drag.player)!}
                  alt={drag.player.strPlayer}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-copper text-white flex items-center justify-center text-sm font-heading font-bold border-2 border-copper shadow-2xl opacity-90">
                {drag.player.strPlayer
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Player pool */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
            Player Pool
          </p>
          <div className="flex gap-2">
            <button
              className="text-xs text-text-dim hover:text-danger transition-colors"
              onClick={handleClearAll}
            >
              Clear All
            </button>
            <button
              className="text-xs text-copper hover:text-copper-hover transition-colors"
              onClick={handleSaveImage}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save as Image"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-surface-2/50 rounded-xl">
          {pool.map((player) => (
            <div
              key={player.idPlayer}
              className="flex items-center gap-1.5 bg-surface-3 rounded-full pl-0.5 pr-2 py-0.5 cursor-grab active:cursor-grabbing border border-border hover:border-copper/40 transition-colors"
              onPointerDown={(e) => onDragPointerDown(player, -1, e)}
              style={{ touchAction: "none" }}
            >
              {player.strThumb ? (
                <img
                  src={player.strThumb}
                  alt={player.strPlayer}
                  className="w-7 h-7 rounded-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-copper/20 flex items-center justify-center text-[10px] font-heading font-bold text-copper">
                  {player.strPlayer
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <span className="text-xs text-text font-medium truncate max-w-[80px]">
                {player.strPlayer.split(" ").pop()}
              </span>
              <button
                className="text-text-dim hover:text-danger text-xs ml-0.5"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setPool((p) => p.filter((pl) => pl.idPlayer !== player.idPlayer))
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Search button */}
          <button
            className="flex items-center gap-1.5 bg-surface-3 rounded-full px-3 py-1.5 text-xs text-copper hover:bg-surface-3/80 transition-colors border border-copper/30"
            onClick={() => {
              setSearchSlot(null)
              setSearchOpen(true)
            }}
          >
            <span>+</span> Search Player
          </button>
        </div>
      </div>

      {/* Squad list (placed players) */}
      <div className="space-y-2">
        <p className="text-xs text-text-muted font-heading uppercase tracking-wider">
          Squad — {slotPlayers.filter(Boolean).length}/{formation.positions.length}
        </p>
        <div className="space-y-1">
          {formation.positions.map((pos, i) => {
            const p = slotPlayers[i]
            return (
              <div
                key={`${formation.id}-${i}`}
                className="flex items-center gap-3 p-2 rounded-lg bg-surface-2/50"
              >
                <span className="w-8 text-xs font-heading font-bold text-text-muted text-center">
                  {pos.label}
                </span>
                {p ? (
                  <>
                    {p.strThumb ? (
                      <img
                        src={p.strThumb}
                        alt={p.strPlayer}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-copper/20 flex items-center justify-center text-xs font-heading font-bold text-copper">
                        {p.strPlayer
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <span className="flex-1 text-sm text-text truncate">
                      {p.strPlayer}
                    </span>
                    <button
                      className="text-xs text-text-dim hover:text-danger transition-colors"
                      onClick={() => handleRemovePlayer(i)}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    className="flex-1 text-left text-sm text-text-dim hover:text-copper transition-colors"
                    onClick={() => handleSlotClick(i)}
                  >
                    + Search player for {pos.label}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <PlayerSearch
            positionLabel={
              searchSlot !== null
                ? formation.positions[searchSlot].label
                : "any position"
            }
            onSelect={(player) => {
              if (searchSlot !== null) {
                handlePlayerSelect(player)
              } else {
                // added from general search → add to pool
                setPool((p) => [...p, player])
                setSearchOpen(false)
                setSearchSlot(null)
              }
            }}
            onClose={() => {
              setSearchOpen(false)
              setSearchSlot(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
