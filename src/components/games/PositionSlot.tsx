import { motion } from "framer-motion"
import type { SportsDBPlayer } from "../../lib/thesportsdb"
import { getPhotoUrl } from "../../lib/thesportsdb"

interface PositionSlotProps {
  label: string
  player: SportsDBPlayer | null
  isDropTarget: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onClick: () => void
}

export function PositionSlot({
  label,
  player,
  isDropTarget,
  onPointerDown,
  onClick,
}: PositionSlotProps) {
  const photoUrl = player ? getPhotoUrl(player) : null

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-0.5"
      style={{
        left: "0%",
        top: "0%",
        transform: "translate(-50%, -50%)",
        touchAction: "none",
      }}
      animate={isDropTarget ? { scale: 1.2 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {photoUrl ? (
        <div
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 shadow-lg cursor-grab select-none ${
            isDropTarget
              ? "border-copper ring-2 ring-copper/50"
              : "border-white/30"
          }`}
          onPointerDown={player ? onPointerDown : undefined}
          style={{ touchAction: "none" }}
        >
          <img
            src={photoUrl}
            alt={player?.strPlayer || label}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
      ) : (
        <div
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-xs sm:text-sm font-heading font-bold border-2 shadow-lg select-none ${
            isDropTarget
              ? "bg-copper/30 text-copper border-copper"
              : "bg-surface-3/70 text-text-muted border-white/15"
          }`}
          onPointerDown={player ? onPointerDown : undefined}
          onClick={!player ? onClick : undefined}
          style={{ touchAction: "none", cursor: player ? "grab" : "pointer" }}
        >
          {player
            ? player.strPlayer
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : label}
        </div>
      )}
      <span className="text-[10px] sm:text-xs font-heading font-bold text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none pointer-events-none">
        {player ? player.strPlayer.split(" ").pop() : label}
      </span>
    </motion.div>
  )
}
