"use client"

/**
 * AkashaField — आकाश, the fifth element.
 *
 * A field of ~N massless points drifting along a curl-noise vector field (see
 * lib/noise.ts). The curl of a potential is divergence-free, so the swarm flows
 * like an incompressible fluid — the visual metaphor for *aether*, the subtle
 * medium from which space and form are said to emerge.
 *
 * The cursor injects a vortex: a finger trailed through still water. Scroll
 * raises the field's "coherence" — chaos condensing toward order — which the
 * parent passes down as `coherence`.
 *
 * Performance: device-pixel-ratio capped, particle count scaled to viewport
 * area, paused when offscreen or when the tab is hidden, and reduced to a single
 * still frame when the visitor prefers reduced motion.
 */

import { useEffect, useRef } from "react"
import { curl } from "@/lib/noise"

interface Particle {
  x: number
  y: number
  px: number
  py: number
  life: number
  maxLife: number
  hue: number
}

interface AkashaFieldProps {
  className?: string
  /** 0 = primordial chaos, 1 = ordered. Drives flow scale + brightness. */
  coherenceRef?: React.MutableRefObject<number>
}

// Palette stops sampled from the site's OKLCH accents, in RGB.
const STOPS_DARK = [
  [124, 122, 255], // accent  (violet)
  [196, 132, 255], // accent-2 (magenta)
  [120, 210, 245], // accent-3 (cyan)
]
const STOPS_LIGHT = [
  [96, 78, 230],
  [150, 70, 220],
  [40, 140, 200],
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Sample a 3-stop palette at position p ∈ [0,1].
function palette(stops: number[][], p: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, p)) * 2
  const i = Math.min(1, Math.floor(x))
  const f = x - i
  const a = stops[i]
  const b = stops[i + 1]
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)]
}

export function AkashaField({ className, coherenceRef }: AkashaFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext("2d", { alpha: true })
    if (!context) return
    // Re-bind as explicitly non-null consts so narrowing holds inside the
    // nested animation closures below.
    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = context

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = 1
    let particles: Particle[] = []
    let raf = 0
    let running = true
    let frame = 0

    // Pointer state — the finger in the water.
    const pointer = { x: -9999, y: -9999, active: false, vx: 0, vy: 0 }

    const isDark = () =>
      document.documentElement.classList.contains("dark") ||
      (!document.documentElement.classList.contains("light") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    function resize() {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Particle budget scales with area but is capped for low-end devices.
      const target = Math.min(
        1100,
        Math.max(280, Math.floor((width * height) / 1600))
      )
      particles = new Array(target).fill(0).map(() => spawn())

      // Lay down the base so the first trails read against a solid field.
      ctx.fillStyle = isDark() ? "rgb(9, 9, 14)" : "rgb(250, 250, 251)"
      ctx.fillRect(0, 0, width, height)
    }

    function spawn(seedLife = true): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        px: 0,
        py: 0,
        life: seedLife ? Math.random() * 200 : 0,
        maxLife: 120 + Math.random() * 220,
        hue: Math.random(),
      }
    }

    const FIELD_SCALE = 0.0016 // how "zoomed in" we sample the noise
    const SPEED = 26

    function step() {
      frame++
      const dark = isDark()
      const stops = dark ? STOPS_DARK : STOPS_LIGHT
      const coherence = coherenceRef?.current ?? 0

      // Trail fade — translucent veil over the previous frame leaves comet tails.
      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = dark
        ? "rgba(9, 9, 14, 0.075)"
        : "rgba(250, 250, 251, 0.085)"
      ctx.fillRect(0, 0, width, height)

      // Additive light in dark mode makes the ether glow where it concentrates.
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over"

      // As coherence rises, the noise scale tightens (more structured filaments)
      // and the time-evolution slows — chaos settling into order.
      const t = frame * 0.0012 * (1 - coherence * 0.6)
      const fieldScale = FIELD_SCALE * (1 + coherence * 0.7)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.px = p.x
        p.py = p.y

        // Curl-noise advection — the divergence-free flow.
        const [cx, cy] = curl(p.x * fieldScale + t, p.y * fieldScale - t)
        let vx = cx * SPEED
        let vy = cy * SPEED

        // Cursor vortex: swirl tangentially around the pointer, fading with r².
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          const radius = 190
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1
            const falloff = 1 - d / radius
            // Perpendicular component → rotation; small inward pull → gather.
            vx += ((-dy / d) * 34 - (dx / d) * 6) * falloff
            vy += ((dx / d) * 34 - (dy / d) * 6) * falloff
          }
        }

        p.x += vx
        p.y += vy
        p.life++

        // Respawn when aged out or drifted off the field.
        if (
          p.life > p.maxLife ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          particles[i] = spawn(false)
          continue
        }

        const lifeRatio = p.life / p.maxLife
        // Fade in and out at the ends of a particle's life.
        const alpha =
          Math.sin(lifeRatio * Math.PI) * (dark ? 0.5 : 0.32) * (0.5 + coherence * 0.5)

        const [r, g, b] = palette(stops, (p.hue + coherence * 0.3) % 1)
        ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`
        ctx.lineWidth = dark ? 1.1 : 0.9
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }

      ctx.globalCompositeOperation = "source-over"
    }

    function loop() {
      if (running) step()
      raf = requestAnimationFrame(loop)
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      pointer.vx = nx - pointer.x
      pointer.vy = ny - pointer.y
      pointer.x = nx
      pointer.y = ny
      pointer.active = true
    }
    function onPointerLeave() {
      pointer.active = false
    }

    resize()

    if (prefersReduced) {
      // One calm, still frame — no animation loop.
      for (let i = 0; i < 6; i++) step()
    } else {
      loop()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerout", onPointerLeave, { passive: true })

    // Pause when scrolled away or tab hidden — never burn cycles unseen.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden && !prefersReduced
      },
      { threshold: 0 }
    )
    io.observe(canvas)
    const onVis = () => {
      running = !document.hidden && !prefersReduced
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerout", onPointerLeave)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [coherenceRef])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
