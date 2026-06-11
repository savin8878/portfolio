"use client"

/**
 * Magnetic — wraps a CTA so it leans toward the cursor with a springy "magnetic"
 * pull (clamped so it never slides over a neighbour) and, optionally, puffs a few
 * crisp embers off its top edge on hover. Pointer events pass straight through to
 * the child, so the wrapped button/link still works.
 *
 * Reusable: <Magnetic><Button asChild>…</Button></Magnetic>. Honors reduced
 * motion (no pull, no embers) — the child renders untouched. The lean is computed
 * live from the element's rect minus its painted spring offset, so it stays
 * correct under Lenis smooth-scroll without caching a stale centre.
 */

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface Ember {
  id: number
  dx: number
  dy: number
  size: number
  dur: number
  delay: number
}

// module-level counter → stable keys without nondeterministic RNG / time calls
let emberSeq = 0
const CAP = 12 // px — max lean, so a leaning button never crosses its gutter
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export function Magnetic({
  children,
  strength = 0.3,
  embers = true,
  className,
}: {
  children: ReactNode
  /** 0..1 — how strongly the element leans toward the cursor (lean is capped at ±12px) */
  strength?: number
  /** puff embers on hover (default true; turn off on high-traffic chrome like the navbar) */
  embers?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.45 })
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.45 })

  const [burst, setBurst] = useState<Ember[]>([])

  // clear a pending ember-clear timer if we unmount mid-burst (CTAs unmount on nav)
  useEffect(() => () => { if (clearTimer.current) clearTimeout(clearTimer.current) }, [])

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    // rect already includes the painted spring offset; subtract it to recover the
    // untransformed centre → exact + scroll-safe with no cached state
    const cx = r.left + r.width / 2 - sx.get()
    const cy = r.top + r.height / 2 - sy.get()
    x.set(clamp((e.clientX - cx) * strength, -CAP, CAP))
    y.set(clamp((e.clientY - cy) * strength, -CAP, CAP))
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const puff = () => {
    if (reduce || !embers) return
    const N = 6
    const next: Ember[] = Array.from({ length: N }, (_, i) => {
      const a = (-150 + (i / (N - 1)) * 120) * (Math.PI / 180) // upward fan
      const dist = 26 + (i % 3) * 12
      return {
        id: emberSeq++,
        dx: Math.cos(a) * dist * 0.7,
        dy: Math.sin(a) * dist,
        size: i % 3 === 0 ? 3 : 2,
        dur: 0.6 + (i % 3) * 0.12,
        delay: (i % 4) * 0.01,
      }
    })
    setBurst(next)
    if (clearTimer.current) clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => setBurst([]), 1000)
  }

  return (
    <motion.span
      className={cn("relative inline-flex", className)}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseEnter={puff}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}

      {burst.length > 0 && (
        <span className="pointer-events-none absolute inset-x-0 top-1 z-10 flex justify-center" aria-hidden>
          <span className="relative h-0 w-0">
            {burst.map((s) => (
              <motion.span
                key={s.id}
                className="absolute rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  background:
                    "radial-gradient(circle, #fff 0%, oklch(from var(--accent-2) l c h) 55%, oklch(from var(--accent-3) l c h) 100%)",
                  boxShadow: "0 0 5px oklch(from var(--accent-2) l c h / 0.9)",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: s.dx, y: [0, s.dy * 0.7, s.dy + 12], opacity: [1, 1, 0], scale: [1, 1, 0.4] }}
                transition={{ duration: s.dur, delay: s.delay, ease: [0.2, 0.7, 0.3, 1] }}
              />
            ))}
          </span>
        </span>
      )}
    </motion.span>
  )
}
