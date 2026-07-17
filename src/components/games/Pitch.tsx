interface PitchProps {
  children?: React.ReactNode
  className?: string
}

export function Pitch({ children, className = "" }: PitchProps) {
  return (
    <div className={`relative w-full aspect-[3/4] max-w-[400px] mx-auto ${className}`}>
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pitch background */}
        <rect x="0" y="0" width="300" height="400" rx="8" fill="#1B4332" />

        {/* Grass stripes */}
        {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((y, i) => (
          <rect
            key={y}
            x="0"
            y={y}
            width="300"
            height="40"
            fill={i % 2 === 0 ? "#1B4332" : "#204D38"}
          />
        ))}

        {/* Pitch border */}
        <rect
          x="8"
          y="8"
          width="284"
          height="384"
          rx="4"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Centre line */}
        <line
          x1="8" y1="200" x2="292" y2="200"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Centre circle */}
        <circle
          cx="150" cy="200" r="40"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        <circle cx="150" cy="200" r="3" fill="rgba(255,255,255,0.5)" />

        {/* Top penalty area */}
        <rect
          x="56" y="8" width="188" height="68"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        {/* Top 6-yard box */}
        <rect
          x="100" y="8" width="100" height="28"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        {/* Top penalty spot */}
        <circle cx="150" cy="52" r="2.5" fill="rgba(255,255,255,0.5)" />
        {/* Top penalty arc */}
        <path
          d="M 112 76 A 38 38 0 0 0 188 76"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Bottom penalty area */}
        <rect
          x="56" y="324" width="188" height="68"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        {/* Bottom 6-yard box */}
        <rect
          x="100" y="364" width="100" height="28"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        {/* Bottom penalty spot */}
        <circle cx="150" cy="348" r="2.5" fill="rgba(255,255,255,0.5)" />
        {/* Bottom penalty arc */}
        <path
          d="M 112 324 A 38 38 0 0 1 188 324"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Corner arcs */}
        <path d="M 8 16 A 8 8 0 0 0 16 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <path d="M 284 8 A 8 8 0 0 0 292 16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <path d="M 8 384 A 8 8 0 0 1 16 392" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <path d="M 284 392 A 8 8 0 0 1 292 384" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      </svg>

      {/* Position slots overlay */}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}
