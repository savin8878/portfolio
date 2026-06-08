/**
 * Procedural engine sound (Web Audio) — no audio asset needed.
 * Two detuned sawtooth oscillators + a sine sub through a lowpass filter; the
 * fundamental pitch, filter cutoff and gain all rise with the car's speed, so
 * it idles when still and revs as you move. Must be resumed from a user
 * gesture (browser autoplay policy) — call start() on first click.
 */

class EngineAudio {
  private ctx: AudioContext | null = null
  private gain: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private osc1: OscillatorNode | null = null
  private osc2: OscillatorNode | null = null
  private sub: OscillatorNode | null = null
  private raf = 0
  private speed = 0
  started = false
  muted = false

  private build() {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctor()
    this.ctx = ctx

    const gain = ctx.createGain()
    gain.gain.value = 0
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 500
    filter.Q.value = 6

    const osc1 = ctx.createOscillator()
    osc1.type = "sawtooth"
    osc1.frequency.value = 48
    const osc2 = ctx.createOscillator()
    osc2.type = "sawtooth"
    osc2.frequency.value = 48 * 1.01
    const sub = ctx.createOscillator()
    sub.type = "sine"
    sub.frequency.value = 30
    const subGain = ctx.createGain()
    subGain.gain.value = 0.6

    osc1.connect(filter)
    osc2.connect(filter)
    sub.connect(subGain).connect(filter)
    filter.connect(gain).connect(ctx.destination)
    osc1.start()
    osc2.start()
    sub.start()

    this.gain = gain
    this.filter = filter
    this.osc1 = osc1
    this.osc2 = osc2
    this.sub = sub

    const loop = () => {
      if (!this.ctx) return
      const t = this.ctx.currentTime
      const n = Math.min(1, Math.max(0, this.speed * 2.6)) // normalized 0..1
      const base = 46 + n * 120
      this.osc1!.frequency.setTargetAtTime(base, t, 0.08)
      this.osc2!.frequency.setTargetAtTime(base * 1.01, t, 0.08)
      this.sub!.frequency.setTargetAtTime(28 + n * 40, t, 0.08)
      this.filter!.frequency.setTargetAtTime(400 + n * 2600, t, 0.06)
      const target = this.muted ? 0 : 0.05 + n * 0.13
      this.gain!.gain.setTargetAtTime(target, t, 0.1)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  async start() {
    if (typeof window === "undefined") return
    if (!this.ctx) this.build()
    if (this.ctx && this.ctx.state === "suspended") {
      try { await this.ctx.resume() } catch { /* ignore */ }
    }
    this.started = true
  }

  setSpeed(s: number) {
    this.speed = s
  }

  setMuted(m: boolean) {
    this.muted = m
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    try { this.ctx?.close() } catch { /* ignore */ }
    this.ctx = null
  }
}

// Singleton shared between the car (writes speed) and the UI (mute/start).
export const engine = new EngineAudio()
