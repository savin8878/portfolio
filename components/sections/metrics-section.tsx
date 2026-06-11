"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import type { ImpactMetric } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"
import { cn } from "@/lib/utils"

const NUMBER_CLASS =
  "bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-5xl font-semibold leading-none tracking-[-0.04em] text-transparent sm:text-6xl md:text-7xl"

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/\D/g, "")) || 0
  const hasM = value.includes("M")
  const hasK = value.includes("K")

  useEffect(() => {
    if (!inView) return
    // reduced-motion: land on the final number, no ticking
    if (reduce) { setCount(target); return }
    const steps = 60
    const step = target / steps
    let cur = 0
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { setCount(target); clearInterval(t) }
      else setCount(Math.floor(cur))
    }, 1800 / steps)
    return () => clearInterval(t)
  }, [inView, target, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{hasM ? "M" : hasK ? "K" : ""}{suffix}
    </span>
  )
}

/** One-shot shower of embers thrown off the digit baseline when it's struck.
 *  Self-unmounts once the burst finishes so no dead spans linger. */
function SparkBurst() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100)
    return () => clearTimeout(t)
  }, [])

  const sparks = useMemo(() => {
    const N = 11
    return Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1)
      const angle = (-140 + t * 100) * (Math.PI / 180) // narrow upward fan, -140°..-40°
      const dist = 40 + (i % 3) * 20
      return {
        dx: Math.cos(angle) * dist * 0.62, // damp horizontal so it never spills columns
        dy: Math.sin(angle) * dist, // negative = up
        size: i % 4 === 0 ? 3 : 2,
        delay: (i % 5) * 0.012,
        dur: 0.55 + (i % 3) * 0.13,
      }
    })
  }, [])

  if (gone) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center" aria-hidden>
      <div className="relative h-0 w-0">
        {sparks.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background:
                "radial-gradient(circle, #fff 0%, oklch(from var(--accent-2) l c h) 55%, oklch(from var(--accent-3) l c h) 100%)",
              boxShadow: "0 0 6px oklch(from var(--accent-2) l c h / 0.9)",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: s.dx, y: [0, s.dy * 0.7, s.dy + 16], opacity: [1, 1, 0], scale: [1, 1, 0.4] }}
            transition={{ duration: s.dur, delay: s.delay, ease: [0.2, 0.7, 0.3, 1] }}
          />
        ))}
      </div>
    </div>
  )
}

/** A single impact stat that gets "hammer-struck" as it enters view: the number
 *  flashes white-hot and tempers down to its resting gradient while a shower of
 *  embers flies off the baseline. Strikes are staggered 1-2-3-4 across the row. */
function MetricStat({ metric, index }: { metric: ImpactMetric; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const reduce = useReducedMotion()
  const [struck, setStruck] = useState(false)

  const isNumeric = /\d/.test(metric.value)

  useEffect(() => {
    if (!inView || reduce || !isNumeric) return
    const t = setTimeout(() => setStruck(true), index * 190)
    return () => clearTimeout(t)
  }, [inView, reduce, index, isNumeric])

  // reserve the FINAL width so the ember fan stays centred while the count grows
  const unit = metric.value.includes("M") ? "M" : metric.value.includes("K") ? "K" : ""
  const finalLen = (String(parseInt(metric.value.replace(/\D/g, "")) || 0) + unit + (metric.suffix || "")).length

  return (
    <div ref={ref}>
      {isNumeric ? (
        <div className="relative inline-block" style={{ minWidth: `${finalLen}ch` }}>
          {struck && <SparkBurst />}
          {/* filter wrapper: the strike's brightness + glow composite OVER the
              already-painted gradient text, never touching its clip (keeps the
              bg-clip-text crisp on every engine) */}
          <div className={cn("inline-block", struck && "anvil-struck")}>
            <div className={NUMBER_CLASS}>
              <Counter value={metric.value} suffix={metric.suffix} />
            </div>
          </div>
        </div>
      ) : (
        <div className={NUMBER_CLASS}>
          {metric.value}
          {metric.suffix}
        </div>
      )}
      <p className="mt-4 text-sm font-medium text-muted-foreground">{metric.label}</p>
    </div>
  )
}

const DIRS = ["left", "bottom", "top", "right"] as const

export function MetricsSection({ metrics }: { metrics: ImpactMetric[] }) {
  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      {/* oversized ghost word — deep parallax layer */}
      <Parallax speed={70} className="pointer-events-none absolute -right-4 top-6 -z-10 select-none">
        <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
          IMPACT
        </span>
      </Parallax>
      <Parallax speed={-50} className="pointer-events-none absolute -left-24 top-1/3 -z-10">
        <div className="h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              Impact by the numbers
            </span>
          </Reveal>
          <Reveal from="left" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              Work that moves <span className="text-gradient-static">real metrics.</span>
            </h2>
          </Reveal>
        </div>

        <Stagger stagger={0.1} className="grid grid-cols-2 gap-y-12 border-t border-border/50 pt-12 md:grid-cols-4 md:divide-x md:divide-border/50">
          {metrics.map((metric, i) => (
            <StaggerItem key={metric.id} from={DIRS[i % DIRS.length]} className="px-2 md:px-8 md:first:pl-0">
              <MetricStat metric={metric} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
