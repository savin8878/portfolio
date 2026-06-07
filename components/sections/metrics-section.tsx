"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import type { ImpactMetric } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/\D/g, "")) || 0
  const hasM = value.includes("M")
  const hasK = value.includes("K")

  useEffect(() => {
    if (!inView) return
    const steps = 60
    const step = target / steps
    let cur = 0
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { setCount(target); clearInterval(t) }
      else setCount(Math.floor(cur))
    }, 1800 / steps)
    return () => clearInterval(t)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{hasM ? "M" : hasK ? "K" : ""}{suffix}
    </span>
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
              <div className="bg-linear-to-br from-foreground to-foreground/55 bg-clip-text text-5xl font-semibold leading-none tracking-[-0.04em] text-transparent sm:text-6xl md:text-7xl">
                <Counter value={metric.value} suffix={metric.suffix} />
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">{metric.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
