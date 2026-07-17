import { FormationBuilder } from "../components/games/FormationBuilder"

export function FormationBuilderPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-2">
            Formation Builder
          </h1>
          <p className="text-sm text-text-muted">
            Build your dream XI or explore historic lineups
          </p>
        </div>
        <FormationBuilder />
        <div className="mt-8 mb-16 text-center">
          <p className="text-[11px] text-text-dim">
            Player data from TheSportsDB (free tier, non-commercial use)
          </p>
        </div>
      </div>
    </div>
  )
}
