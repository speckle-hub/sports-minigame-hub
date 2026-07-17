import { KitPattern } from "./KitPattern"
import type { KitClub } from "../../lib/constants"

const previewClubs: KitClub[] = [
  { name: "Barcelona", primary: "#A50044", secondary: "#004D98", pattern: "stripes" },
  { name: "Celtic", primary: "#00985F", secondary: "#FFFFFF", pattern: "hoops" },
  { name: "River Plate", primary: "#FFFFFF", secondary: "#DA291C", pattern: "sash" },
  { name: "Liverpool", primary: "#C8102E", secondary: "#FFFFFF", pattern: "solid" },
]

export function KitPreview() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-heading font-bold text-text text-center mb-8">
        Kit Pattern Preview
      </h2>

      {previewClubs.map((club) => (
        <div key={club.name} className="mb-12">
          <div className="text-center mb-4">
            <span className="font-heading font-bold text-copper text-lg">{club.name}</span>
            <span className="text-text-muted text-sm ml-3">({club.pattern})</span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-2 rounded-xl p-4 border border-border">
              <p className="text-center text-xs text-text-muted font-heading font-bold uppercase tracking-wider mb-3">Stage 1 — Heavily Cropped</p>
              <KitPattern club={club} stage={1} />
            </div>
            <div className="bg-surface-2 rounded-xl p-4 border border-border">
              <p className="text-center text-xs text-text-muted font-heading font-bold uppercase tracking-wider mb-3">Stage 2 — Partially Revealed</p>
              <KitPattern club={club} stage={2} />
            </div>
            <div className="bg-surface-2 rounded-xl p-4 border border-border">
              <p className="text-center text-xs text-text-muted font-heading font-bold uppercase tracking-wider mb-3">Stage 3 — Full Kit</p>
              <KitPattern club={club} stage={3} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
