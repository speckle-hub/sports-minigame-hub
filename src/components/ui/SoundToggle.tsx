import { motion } from "framer-motion"
import { useSettingsStore } from "../../stores/settingsStore"
import { cn } from "../../lib/utils"

export function SoundToggle({ className }: { className?: string }) {
  const { muted, toggleMute } = useSettingsStore()

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors",
        muted
          ? "bg-surface-2 text-text-muted hover:text-text"
          : "bg-copper/10 text-copper hover:bg-copper/20",
        className
      )}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.777l6.793-6.793c.63-.63 1.707-.184 1.707.707v14c0 .891-1.077 1.337-1.707.707L6.5 15.223H3a1 1 0 01-1-1v-4a1 1 0 011-1h3.5z" />
        </svg>
      )}
    </motion.button>
  )
}
