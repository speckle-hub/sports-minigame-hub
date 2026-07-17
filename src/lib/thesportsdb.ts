// TheSportsDB API client (free tier: key "3", non-commercial use only)
// Throttled request queue + localStorage cache

const BASE = "https://www.thesportsdb.com/api/v1/json/3"
const CACHE_PREFIX = "sportsdb:"
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const THROTTLE_MS = 500 // ms between requests
const MAX_RETRIES = 3

export interface SportsDBPlayer {
  idPlayer: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strThumb: string | null
  strCutout: string | null
  strRender: string | null
  strNumber: string | null
  strNationality: string | null
  dateBorn: string | null
  strHeight: string | null
  strWeight: string | null
}

interface CacheEntry<T> {
  data: T
  ts: number
}

// ── Request queue ────────────────────────────────────────────────────
let lastRequestTime = 0
let queue: (() => void)[] = []

function processQueue() {
  if (queue.length === 0) return
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed >= THROTTLE_MS) {
    lastRequestTime = now
    const next = queue.shift()!
    next()
  } else {
    setTimeout(() => {
      lastRequestTime = Date.now()
      const next = queue.shift()!
      next()
    }, THROTTLE_MS - elapsed)
  }
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        resolve(await fn())
      } catch (err) {
        reject(err)
      }
    })
    processQueue()
  })
}

// ── Cache ────────────────────────────────────────────────────────────
function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

function cacheSet<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // localStorage full — silently fail
  }
}

function invalidateCache(key: string): void {
  try {
    localStorage.removeItem(CACHE_PREFIX + key)
  } catch {
    // ignore
  }
}

// ── Fetch with retry ─────────────────────────────────────────────────
async function throttledFetchJSON<T>(url: string): Promise<T | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const data = await enqueue(async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) return null
        const text = await res.text()
        // Guard: API sometimes returns HTML error pages instead of JSON
        if (text.trimStart().startsWith("<") || text.trimStart().startsWith("<!")) {
          return null
        }
        return JSON.parse(text) as T
      } catch {
        return null
      }
    })
    if (data !== null) return data
    // Rate limited or transient error — back off exponentially
    if (attempt < MAX_RETRIES) {
      const backoff = THROTTLE_MS * Math.pow(2, attempt + 1)
      await new Promise((r) => setTimeout(r, backoff))
    }
  }
  return null
}

// ── Public API ───────────────────────────────────────────────────────

// One-time cleanup: remove empty cached results from before the throttle fix
;(function cleanStaleCache() {
  try {
    const prefix = CACHE_PREFIX + "search:"
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        const raw = localStorage.getItem(key)
        if (raw) {
          const entry = JSON.parse(raw)
          if (Array.isArray(entry.data) && entry.data.length === 0) {
            localStorage.removeItem(key)
          }
        }
      }
    }
  } catch {
    // ignore
  }
})()

export function getPhotoUrl(player: SportsDBPlayer): string | null {
  return player.strCutout || player.strThumb || player.strRender || null
}

export async function searchPlayers(query: string): Promise<SportsDBPlayer[]> {
  const q = query.trim()
  if (!q) return []

  const cacheKey = `search:${q.toLowerCase()}`
  const cached = cacheGet<SportsDBPlayer[]>(cacheKey)
  if (cached) return cached

  // Check historic player cache first (instant, no API call)
  const { getCachedPlayer } = await import("./historic-player-cache")
  const historicMatch = getCachedPlayer(q)
  if (historicMatch) {
    const player: SportsDBPlayer = {
      ...historicMatch,
      dateBorn: null,
      strHeight: null,
      strWeight: null,
    }
    cacheSet(cacheKey, [player])
    return [player]
  }

  const data = await throttledFetchJSON<{ player: SportsDBPlayer[] | null }>(
    `${BASE}/searchplayers.php?p=${encodeURIComponent(q)}`
  )
  const players = data?.player ?? []
  if (players.length > 0) {
    cacheSet(cacheKey, players)
  } else {
    // Don't cache empty results — the player might appear later or the API was rate-limited
    invalidateCache(cacheKey)
  }
  return players
}

export async function getTeamRoster(teamId: string): Promise<SportsDBPlayer[]> {
  if (!teamId) return []

  const cacheKey = `roster:${teamId}`
  const cached = cacheGet<SportsDBPlayer[]>(cacheKey)
  if (cached) return cached

  const data = await throttledFetchJSON<{ player: SportsDBPlayer[] }>(
    `${BASE}/lookup_all_players.php?id=${teamId}`
  )
  const players = data?.player ?? []
  if (players.length > 0) {
    cacheSet(cacheKey, players)
  }
  return players
}

export async function lookupPlayer(playerId: string): Promise<SportsDBPlayer | null> {
  if (!playerId) return null

  const cacheKey = `player:${playerId}`
  const cached = cacheGet<SportsDBPlayer>(cacheKey)
  if (cached) return cached

  const data = await throttledFetchJSON<{ players: SportsDBPlayer[] | null }>(
    `${BASE}/lookupplayer.php?id=${playerId}`
  )
  const player = data?.players?.[0] ?? null
  if (player) cacheSet(cacheKey, player)
  return player
}

export async function searchTeams(
  query: string
): Promise<Array<{ idTeam: string; strTeam: string; strBadge: string | null }>> {
  const q = query.trim()
  if (!q) return []

  const cacheKey = `teams:${q.toLowerCase()}`
  const cached = cacheGet<Array<{ idTeam: string; strTeam: string; strBadge: string | null }>>(
    cacheKey
  )
  if (cached) return cached

  const data = await throttledFetchJSON<{
    teams: Array<{ idTeam: string; strTeam: string; strBadge: string | null }> | null
  }>(`${BASE}/searchteams.php?t=${encodeURIComponent(q)}`)
  const teams = data?.teams ?? []
  if (teams.length > 0) {
    cacheSet(cacheKey, teams)
  }
  return teams
}
