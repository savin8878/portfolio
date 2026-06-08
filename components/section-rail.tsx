"use client"

/**
 * SectionRail — a floating, ember-glowing "filmstrip" index of every visible
 * homepage section, fixed to the right edge.
 *
 *  · numbered nodes (01..N); passed sections stay lit, the active one ignites
 *  · a shared-element capsule (layoutId) glides between nodes with spring
 *  · a fire-gradient fill "burns down" the track as you scroll (page progress)
 *  · labels slide out on hover; click smooth-scrolls via Lenis
 *  · active section detected with an IntersectionObserver centred band, so it
 *    stays correct under Lenis's transformed scroll (no scrollY math)
 *  · on mobile it collapses to a thin, non-interactive progress spine
 */

import { useEffect, useState } from "react"
import {
  motion,
  useReducedMotion,
  useScroll as useWindowScroll,
  useSpring,
} from "framer-motion"
import { useScroll as useLenisScroll } from "@/components/scroll-provider"
import { cn } from "@/lib/utils"
import type { RailItem } from "@/lib/section-meta"

const LENIS_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

export function SectionRail({ items }: { items: RailItem[] }) {
  const { lenis } = useLenisScroll()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  // whole-page scroll progress -> the burn-down track fill
  const { scrollYProgress } = useWindowScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    if (!items.length) return
    const idToIndex = new Map(items.map((it, i) => [it.anchorId, i]))
    const intersecting = new Set<number>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = idToIndex.get((e.target as HTMLElement).id)
          if (idx === undefined) continue
          if (e.isIntersecting) intersecting.add(idx)
          else intersecting.delete(idx)
        }
        // thin centred band -> usually one section in view; pick the topmost
        if (intersecting.size) setActive(Math.min(...intersecting))
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    )

    items.forEach((it) => {
      const el = document.getElementById(it.anchorId)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [items])

  const go = (anchorId: string) => {
    if (lenis) {
      lenis.scrollTo("#" + anchorId, { offset: -80, duration: 1.1, easing: LENIS_EASE })
    } else {
      document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (items.length === 0) return null

  return (
    <>
      {/* Desktop: interactive ember filmstrip rail */}
      <nav
        aria-label="Section navigator"
        className="group fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="glass relative flex flex-col gap-1 rounded-2xl p-2">
          {/* vertical track + fire burn-down fill, aligned to the dot column */}
          <div className="pointer-events-none absolute bottom-4 left-[26px] top-4 w-px -translate-x-1/2 overflow-hidden rounded-full bg-border/40">
            <motion.div
              style={{ scaleY: fill }}
              className="h-full w-full origin-top bg-linear-to-b from-accent via-accent-2 to-accent-3"
            />
          </div>

          {items.map((it, i) => {
            const isActive = i === active
            const explored = i < active
            return (
              <button
                key={it.anchorId}
                type="button"
                onClick={() => go(it.anchorId)}
                aria-current={isActive ? "true" : undefined}
                className="relative flex items-center gap-3 rounded-xl py-1.5 pl-1 pr-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                {isActive && (
                  <motion.span
                    layoutId="rail-indicator"
                    className="absolute inset-0 -z-10 rounded-xl bg-accent/12"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* numbered node */}
                <span
                  className={cn(
                    "relative grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[9px] tabular-nums transition-all duration-300",
                    isActive
                      ? "glow-sm scale-110 border-accent bg-accent text-accent-foreground"
                      : explored
                        ? "border-accent/50 bg-accent/20 text-accent"
                        : "border-border/60 bg-muted/30 text-muted-foreground/60 group-hover:border-border",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* label — slides open on rail hover */}
                <span
                  className={cn(
                    "max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 group-hover:max-w-[150px]",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {it.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile: ambient progress spine (never blocks taps) */}
      <div className="pointer-events-none fixed bottom-24 right-1.5 top-24 z-40 w-[3px] overflow-hidden rounded-full bg-border/30 lg:hidden">
        <motion.div
          style={{ scaleY: fill }}
          className="h-full w-full origin-top rounded-full bg-linear-to-b from-accent via-accent-2 to-accent-3"
        />
      </div>
    </>
  )
}
