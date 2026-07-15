let ctx: AudioContext | null = null
let muted = false
let interacted = false

function ctxInit() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === "suspended") ctx.resume()
}

const LISTENERS = new Set<() => void>()
export function onFirstInteraction(fn: () => void) {
  if (interacted) { fn(); return }
  LISTENERS.add(fn)
}

function handleInteraction() {
  if (interacted) return
  interacted = true
  LISTENERS.forEach((fn) => fn())
  LISTENERS.clear()
}

if (typeof document !== "undefined") {
  const evts = ["click", "touchstart", "keydown"]
  evts.forEach((e) => document.addEventListener(e, handleInteraction, { once: true }))
  // fallback: if none fired by timeout, mark as interacted anyway
  setTimeout(() => { if (!interacted) handleInteraction() }, 5000)
}

function play(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  if (muted || !interacted) return
  ctxInit()
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, ctx.currentTime)
  g.gain.setValueAtTime(vol, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
  o.connect(g)
  g.connect(ctx.destination)
  o.start()
  o.stop(ctx.currentTime + dur)
}

function playTones(tones: [number, number][], baseType: OscillatorType = "sine", vol = 0.15) {
  if (muted || !interacted) return
  ctxInit()
  if (!ctx) return
  tones.forEach(([freq, offset]) => {
    const o = ctx!.createOscillator()
    const g = ctx!.createGain()
    o.type = baseType
    o.frequency.setValueAtTime(freq, ctx!.currentTime + offset)
    g.gain.setValueAtTime(vol, ctx!.currentTime + offset)
    g.gain.exponentialRampToValueAtTime(0.001, ctx!.currentTime + offset + 0.3)
    o.connect(g)
    g.connect(ctx!.destination)
    o.start(ctx!.currentTime + offset)
    o.stop(ctx!.currentTime + offset + 0.3)
  })
}

export function sfxCorrect() {
  playTones([[523, 0], [659, 0.08]], "sine", 0.15)
}

export function sfxIncorrect() {
  play(200, 0.35, "square", 0.08)
}

export function sfxGoal() {
  playTones([[523, 0], [659, 0.08], [784, 0.16]], "sine", 0.15)
}

export function sfxMiss() {
  playTones([[400, 0], [300, 0.12]], "square", 0.06)
}

export function sfxRoundComplete() {
  playTones([[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]], "sine", 0.12)
}

export function sfxLevelUp() {
  playTones([[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36]], "triangle", 0.15)
}

export function sfxStreak() {
  playTones([[784, 0], [988, 0.06], [1175, 0.12]], "sine", 0.12)
}

export function sfxGameComplete() {
  playTones([[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36], [1319, 0.48]], "sine", 0.12)
}

export function setMuted(val: boolean) {
  muted = val
}

export function isMuted(): boolean {
  return muted
}
