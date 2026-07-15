import { Skeleton } from "./Skeleton"

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-16" />
      </div>

      <div className="grid grid-cols-[40px_1fr_80px] gap-3 px-3 py-2">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12 justify-self-end" />
      </div>

      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_80px] gap-3 items-center p-3 rounded-lg"
        >
          <Skeleton className="h-6 w-8 mx-auto rounded" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-5 w-16 justify-self-end" />
        </div>
      ))}
    </div>
  )
}
