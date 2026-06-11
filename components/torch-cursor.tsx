"use client"

/**
 * TorchCursor — a warm "torch in the dark" that follows the pointer across the
 * dark site, additively rim-lighting whatever it passes over (headings, cards,
 * the nav, the rail). Fire = light in the dark, so this is the most on-theme
 * atmosphere the site can carry.
 *
 * How it works:
 *  · two stacked radial-gradient blobs — a snappy warm CORE and a laggy ember
 *    HALO — follow the pointer with different spring weights, giving the light
 *    real depth and a touch of inertia.
 *  · the whole layer is `mix-blend-mode: screen`, so it ADDS warm light to the
 *    content beneath instead of covering it: dark gutters glow, text/cards warm,
 *    nothing gets washed to grey.
 *  · a slow brightness "flicker" makes it breathe like a real flame.
 *
 * It is pointer-events-none, sits above the nav/rail (z-55) but below the intro
 * loader (z-200), and is disabled where it doesn't belong: touch / coarse
 * pointers (no hover), admin routes, and — for the flame flicker — reduced motion.
 */

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

const CORE = 460
const HALO = 1120

export function TorchCursor() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)

  // raw pointer position (off-screen until the first move)
  const x = useMotionValue(-2000)
  const y = useMotionValue(-2000)

  // core tracks tightly; halo trails for depth
  const coreX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.4 })
  const coreY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.4 })
  const haloX = useSpring(x, { stiffness: 110, damping: 28, mass: 0.9 })
  const haloY = useSpring(y, { stiffness: 110, damping: 28, mass: 0.9 })

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const hide = () => setVisible(false)
    window.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerleave", hide)
    window.addEventListener("blur", hide)
    return () => {
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", hide)
      window.removeEventListener("blur", hide)
    }
  }, [enabled, visible, x, y])

  if (!enabled || pathname?.startsWith("/admin")) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" style={{ mixBlendMode: "screen" }} aria-hidden>
      {/* ambient ember halo — large, trailing */}
      <motion.div
        className={`absolute left-0 top-0 rounded-full transition-opacity duration-500 ${reduce ? "" : "torch-flicker"}`}
        style={{
          x: haloX,
          y: haloY,
          width: HALO,
          height: HALO,
          marginLeft: -HALO / 2,
          marginTop: -HALO / 2,
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(circle, oklch(from var(--accent-3) l c h / 0.20) 0%, oklch(from var(--accent-3) l c h / 0.09) 32%, transparent 64%)",
        }}
      />
      {/* warm core — tight, snappy */}
      <motion.div
        className={`absolute left-0 top-0 rounded-full transition-opacity duration-300 ${reduce ? "" : "torch-flicker-fast"}`}
        style={{
          x: coreX,
          y: coreY,
          width: CORE,
          height: CORE,
          marginLeft: -CORE / 2,
          marginTop: -CORE / 2,
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(circle, oklch(from var(--accent-2) l c h / 0.42) 0%, oklch(from var(--accent) l c h / 0.26) 24%, oklch(from var(--accent-3) l c h / 0.10) 50%, transparent 70%)",
        }}
      />
    </div>
  )
}
