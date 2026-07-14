import { TicTacToeGrid } from "../components/games/TicTacToeGrid"
import { useGameStore } from "../stores/gameStore"
import { ShareCard } from "../components/ShareCard"
import { useAuthStore } from "../stores/authStore"

export function TicTacToeGridPage() {
  const { lastResult } = useGameStore()
  const { profile } = useAuthStore()

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <TicTacToeGrid />
        {lastResult && lastResult.gameId === "tic-tac-toe-grid" && (
          <div className="mt-8 flex justify-center">
            <ShareCard
              gameId={lastResult.gameId}
              score={lastResult.score}
              details={lastResult.details}
              xpEarned={lastResult.xpEarned}
              username={profile?.username}
              avatarUrl={profile?.avatar_url}
              rank={1}
              totalPlayers={100}
            />
          </div>
        )}
      </div>
    </div>
  )
}