"use client"

/**
 * GeometryCanvas — an "advanced geometry" intro animation rendered on a 2D
 * canvas (reliable + screenshot-verifiable, unlike WebGL): a rotating 3D
 * icosahedron wireframe wrapped in an orbiting particle sphere, projected with
 * perspective, lit in the fire palette. Mouse-parallax + reduced-motion aware.
 */

import { useEffect, useRef } from "react"

interface GeometryCanvasProps {
  className?: string
  /** number of orbiting particles */
  density?: number
  /** base auto-rotation speed */
  speed?: number
  /** 0..1 overall opacity multiplier */
  intensity?: number
}

const PHI = (1 + Math.sqrt(5)) / 2

// Icosahedron — 12 vertices (normalized to the unit sphere).
const RAW: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
]
const VERTS = RAW.map(([x, y, z]) => {
  const l = Math.hypot(x, y, z)
  return [x / l, y / l, z / l] as [number, number, number]
})
// Edges: vertex pairs at the (minimum) edge length.
const EDGES: [number, number][] = (() => {
  let min = Infinity
  for (let i = 0; i < VERTS.length; i++)
    for (let j = i + 1; j < VERTS.length; j++) {
      const d = Math.hypot(VERTS[i][0] - VERTS[j][0], VERTS[i][1] - VERTS[j][1], VERTS[i][2] - VERTS[j][2])
      if (d < min) min = d
    }
  const e: [number, number][] = []
  for (let i = 0; i < VERTS.length; i++)
    for (let j = i + 1; j < VERTS.length; j++) {
      const d = Math.hypot(VERTS[i][0] - VERTS[j][0], VERTS[i][1] - VERTS[j][1], VERTS[i][2] - VERTS[j][2])
      if (d < min * 1.08) e.push([i, j])
    }
  return e
})()

function fibSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  const off = 2 / n
  const inc = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = i * off - 1 + off / 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const phi = i * inc
    pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r])
  }
  return pts
}

export function GeometryCanvas({ className, density = 150, speed = 1, intensity = 1 }: GeometryCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    const particles = fibSphere(density)

    let w = 0, h = 0, dpr = 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // pointer parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0
    const onMove = (e: MouseEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 0.8
      tmy = (e.clientY / window.innerHeight - 0.5) * 0.8
    }
    window.addEventListener("mousemove", onMove)

    const rotate = (p: [number, number, number], ax: number, ay: number): [number, number, number] => {
      const cy = Math.cos(ay), sy = Math.sin(ay)
      const x1 = p[0] * cy + p[2] * sy
      const z1 = -p[0] * sy + p[2] * cy
      const cx = Math.cos(ax), sx = Math.sin(ax)
      const y1 = p[1] * cx - z1 * sx
      const z2 = p[1] * sx + z1 * cx
      return [x1, y1, z2]
    }

    let raf = 0
    let t = 0
    const PERSP = 3.2

    const frame = () => {
      t += reduce ? 0 : 0.0024 * speed
      mx += (tmx - mx) * 0.05
      my += (tmy - my) * 0.05
      const ax = t + my
      const ay = t * 1.35 + mx
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.34

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"

      // particle sphere
      const proj = particles
        .map((p) => rotate(p, ax, ay))
        .map(([x, y, z]) => {
          const f = PERSP / (PERSP - z * 1.45)
          return { x: cx + x * f * R * 1.5, y: cy + y * f * R * 1.5, d: f }
        })
        .sort((a, b) => a.d - b.d)
      for (const p of proj) {
        const a = Math.min(1, (p.d - 0.6) * 1.1) * 0.5 * intensity
        if (a <= 0) continue
        const rad = (p.d - 0.5) * 2.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.4, rad), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,${140 + p.d * 60},${40 + p.d * 30},${a})`
        ctx.fill()
      }

      // icosahedron
      const v = VERTS.map((p) => {
        const [x, y, z] = rotate(p, ax, ay)
        const f = PERSP / (PERSP - z)
        return { x: cx + x * f * R, y: cy + y * f * R, d: f, z }
      })
      for (const [i, j] of EDGES) {
        const a = v[i], b = v[j]
        const depth = (a.d + b.d) / 2
        const alpha = Math.min(1, Math.max(0, (depth - 0.62) * 2.4)) * intensity
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, `rgba(255,77,46,${alpha})`)
        grad.addColorStop(0.5, `rgba(255,122,24,${alpha})`)
        grad.addColorStop(1, `rgba(255,210,74,${alpha})`)
        ctx.strokeStyle = grad
        ctx.lineWidth = depth * 1.6
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      // vertices glow
      for (const p of v) {
        const a = Math.min(1, Math.max(0, (p.d - 0.6) * 2)) * intensity
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7 * p.d)
        g.addColorStop(0, `rgba(255,225,150,${a})`)
        g.addColorStop(1, "rgba(255,122,24,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, 7 * p.d, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    // draw one static frame for reduced motion
    if (reduce) frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("mousemove", onMove)
    }
  }, [density, speed, intensity])

  return <canvas ref={ref} className={className} aria-hidden />
}
