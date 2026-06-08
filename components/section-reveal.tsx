"use client"

/**
 * SectionReveal — wraps a homepage section and gives it a scroll-driven
 * "open / explore / recede" rhythm tied to its own position in the viewport.
 *
 * Three acts, encoded in the useTransform stops over the section's own scroll
 * progress (0 = about to enter from below, 1 = fully scrolled past the top):
 *
 *   ENTER  0  → 0.32   rises from below, scales up, clip opens   (the section
 *                      "moves down and expands")
 *   DWELL  0.32 → 0.68 holds at identity — the section sits crisp and full
 *                      while its OWN inner Reveal/Stagger/Counter primitives
 *                      "explore" the content (wrapper does nothing, so it
 *                      never fights the inner animations or blurs text)
 *   RECEDE 0.68 → 1    sinks + dims as the NEXT section rises and expands out
 *                      from underneath it — a continuous filmic handoff
 *
 * Sticky sections (sticky=true) get a transform-free, opacity-only reveal:
 * any transform / clip-path / filter on this wrapper would become the
 * containing block for their inner position:sticky panels and break the pin.
 */

import { useRef, type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

const SPRING = { stiffness: 120, damping: 28, restDelta: 0.001 }

interface SectionRevealProps {
  anchorId: string
  /** section relies on position:sticky -> opacity-only reveal (no transform) */
  sticky?: boolean
  /** the landing section: already on screen, so skip ENTER and only RECEDE */
  isHero?: boolean
  /** thin band (logo strip) -> gentler scale so a single row never distorts */
  thin?: boolean
  children: ReactNode
}

export function SectionReveal({
  anchorId,
  sticky = false,
  isHero = false,
  thin = false,
  children,
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Hooks must run unconditionally; we pick which output to apply below.
  const minScale = thin ? 0.97 : 0.94

  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [isHero ? 0 : 64, 0, 0, -40],
  )
  const y = useSpring(yRaw, SPRING)

  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.32, 0.68, 1],
    [isHero ? 1 : minScale, 1, 1, 0.97],
  )
  const scale = useSpring(scaleRaw, SPRING)

  const opacity = useTransform(
    scrollYProgress,
    isHero ? [0, 0.68, 1] : [0, 0.18, 0.7, 1],
    isHero ? [1, 1, 0.6] : [0, 1, 1, 0.55],
  )

  // clip only animates during ENTER, then holds wide open ("card opening")
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.32],
    ["inset(10% 0% 10% 0% round 24px)", "inset(0% 0% 0% 0% round 0px)"],
  )

  // Sticky sections OR reduced-motion: opacity only, no transform / clip / filter.
  if (sticky || reduce) {
    return (
      <motion.section
        ref={ref}
        id={anchorId}
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.section>
    )
  }

  return (
    <motion.section
      ref={ref}
      id={anchorId}
      className="relative will-change-transform"
      style={isHero ? { y, scale, opacity } : { y, scale, opacity, clipPath }}
    >
      {children}
    </motion.section>
  )
}
