import { Skeleton } from "./Skeleton"

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="absolute -bottom-1 -right-1 w-12 h-5 rounded-full" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="hidden sm:block h-9 w-28 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-2 border border-border rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
