import { useId, useMemo } from "react"
import type { KitClub } from "../../lib/constants"

interface KitPatternProps {
  club: KitClub
  stage: number
}

function ShirtPath({ id }: { id: string }) {
  return (
    <clipPath id={id}>
      <path d="
        M 72 32
        Q 82 22, 100 22
        Q 118 22, 128 32
        L 152 28
        C 168 26, 185 30, 192 45
        C 197 60, 196 82, 189 90
        C 184 96, 172 92, 162 82
        L 164 188
        C 164 202, 150 210, 130 212
        Q 100 215, 70 212
        C 50 210, 36 202, 36 188
        L 38 82
        C 28 92, 16 96, 11 90
        C 4 82, 3 60, 8 45
        C 15 30, 32 26, 48 28
        Z
      " />
    </clipPath>
  )
}

function Stripes({ club }: { club: KitClub }) {
  const stripeW = 11
  const total = Math.ceil(200 / stripeW)
  return (
    <>
      {Array.from({ length: total }).map((_, i) => (
        <rect key={i} x={i * stripeW} y={0} width={stripeW} height={280}
          fill={i % 2 === 0 ? club.primary : club.secondary} />
      ))}
    </>
  )
}

function Hoops({ club }: { club: KitClub }) {
  const hoopH = 13
  const total = Math.ceil(280 / hoopH)
  return (
    <>
      {Array.from({ length: total }).map((_, i) => (
        <rect key={i} x={0} y={i * hoopH} width={200} height={hoopH}
          fill={i % 2 === 0 ? club.primary : club.secondary} />
      ))}
    </>
  )
}

function Solid({ club }: { club: KitClub }) {
  return <rect x={0} y={0} width={200} height={280} fill={club.primary} />
}

function Sash({ club }: { club: KitClub }) {
  return (
    <>
      <rect x={0} y={0} width={200} height={280} fill={club.primary} />
      <g transform="rotate(-35, 100, 140)">
        <rect x={58} y={-10} width={36} height={300} fill={club.secondary} />
        <rect x={58} y={-10} width={36} height={300} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      </g>
    </>
  )
}

function Quarters({ club }: { club: KitClub }) {
  return (
    <>
      <rect x={0} y={0} width={100} height={140} fill={club.primary} />
      <rect x={100} y={0} width={100} height={140} fill={club.secondary} />
      <rect x={0} y={140} width={100} height={140} fill={club.secondary} />
      <rect x={100} y={140} width={100} height={140} fill={club.primary} />
    </>
  )
}

const CROP_OPTIONS = [
  { t: 32, r: 22, b: 35, l: 22 },
  { t: 16, r: 28, b: 58, l: 28 },
  { t: 30, r: 48, b: 38, l: 12 },
  { t: 30, r: 12, b: 38, l: 48 },
  { t: 52, r: 24, b: 18, l: 24 },
]

export function KitPattern({ club, stage }: KitPatternProps) {
  const shirtId = useId()

  const cropIndex = useMemo(() => {
    let hash = 0
    for (let i = 0; i < club.name.length; i++) {
      hash = ((hash << 5) - hash) + club.name.charCodeAt(i)
    }
    return Math.abs(hash) % CROP_OPTIONS.length
  }, [club.name])

  const clipStyle = stage === 1
    ? { clipPath: `inset(${CROP_OPTIONS[cropIndex].t}% ${CROP_OPTIONS[cropIndex].r}% ${CROP_OPTIONS[cropIndex].b}% ${CROP_OPTIONS[cropIndex].l}%)` }
    : stage === 2
    ? { clipPath: "inset(10% 5% 12% 5%)" }
    : {}

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-56 h-[19rem] flex items-center justify-center"
        style={{
          filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
        }}
      >
        <svg viewBox="0 0 200 260" className="w-full h-full" style={clipStyle}>
          <defs>
            <ShirtPath id={shirtId} />

            <linearGradient id={`sheen-${shirtId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity={0.1} />
              <stop offset="20%" stopColor="white" stopOpacity={0.04} />
              <stop offset="45%" stopColor="black" stopOpacity={0} />
              <stop offset="75%" stopColor="black" stopOpacity={0.05} />
              <stop offset="100%" stopColor="black" stopOpacity={0.14} />
            </linearGradient>

            <filter id={`grain-${shirtId}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope={0.035} />
              </feComponentTransfer>
            </filter>
          </defs>

          <g clipPath={`url(#${shirtId})`}>
            {club.pattern === "stripes" && <Stripes club={club} />}
            {club.pattern === "hoops" && <Hoops club={club} />}
            {club.pattern === "solid" && <Solid club={club} />}
            {club.pattern === "sash" && <Sash club={club} />}
            {club.pattern === "quarters" && <Quarters club={club} />}
          </g>

          <rect x={0} y={0} width={200} height={260} fill={`url(#sheen-${shirtId})`} clipPath={`url(#${shirtId})`} />

          <rect x={0} y={0} width={200} height={260} filter={`url(#grain-${shirtId})`} clipPath={`url(#${shirtId})`} />

          <path
            d="M 72 32 Q 82 22, 100 22 Q 118 22, 128 32 L 152 28 C 168 26, 185 30, 192 45 C 197 60, 196 82, 189 90 C 184 96, 172 92, 162 82 L 164 188 C 164 202, 150 210, 130 212 Q 100 215, 70 212 C 50 210, 36 202, 36 188 L 38 82 C 28 92, 16 96, 11 90 C 4 82, 3 60, 8 45 C 15 30, 32 26, 48 28 Z"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1.5"
          />

          <path
            d="M 74 30 Q 82 24, 100 26 Q 118 24, 126 30"
            fill="none"
            stroke={club.secondary}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line x1="100" y1="26" x2="100" y2="34" stroke={club.secondary} strokeWidth="2" strokeLinecap="round" />

          <path
            d="M 12 50 C 7 66, 7 80, 14 88"
            fill="none"
            stroke={club.secondary}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 188 50 C 193 66, 193 80, 186 88"
            fill="none"
            stroke={club.secondary}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
