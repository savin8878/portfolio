"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import type { ImpactMetric } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"

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

export function MetricsSection({ metrics }: { metrics: ImpactMetric[] }) {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 line-grid mask-fade-radial opacity-50 -z-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Impact by the numbers
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
            Work that <span className="text-gradient-static">moves</span> real metrics.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl leading-relaxed">
            The shipped things, the scaled systems, the users reached — numbers I'm proud to stand behind.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => {
            const Icon = iconMap[metric.icon] || DefaultIcon
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl ring-conic"
              >
                <div className="relative h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 sm:p-8 overflow-hidden transition-all duration-500 group-hover:border-accent/30 group-hover:bg-card">
                  {/* Glow blob */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative">
                    <div className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20 mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-none text-foreground mb-3">
                      <Counter value={metric.value} suffix={metric.suffix} />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>

                    <div className="mt-4 h-[2px] w-0 bg-linear-to-r from-accent to-accent-2 group-hover:w-12 transition-all duration-500 rounded-full" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
