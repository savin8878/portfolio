"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Package, Users, Rocket, Calendar } from "lucide-react"
import type { ImpactMetric } from "@/lib/db"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  package: Package,
  users: Users,
  rocket: Rocket,
  calendar: Calendar,
}

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/\D/g, "")) || 0
  const hasM = value.includes("M")

  useEffect(() => {
    if (!inView) return
    const steps = 60
    const step = target / steps
    let cur = 0
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { setCount(target); clearInterval(t) }
      else setCount(Math.floor(cur))
    }, 2000 / steps)
    return () => clearInterval(t)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{hasM ? "M" : ""}{suffix}
    </span>
  )
}

export function MetricsSection({ metrics }: { metrics: ImpactMetric[] }) {
  return (
    <section className="relative overflow-hidden border-y border-border/40">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-14"
        >
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
            Track Record
          </span>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40">
          {metrics.map((metric, i) => {
            const Icon = iconMap[metric.icon] || Package
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group px-8 py-10 flex flex-col gap-4 hover:bg-accent/[0.03] transition-colors duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl border border-border/60 flex items-center justify-center text-accent group-hover:border-accent/40 group-hover:bg-accent/5 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="text-5xl sm:text-6xl font-black leading-none tracking-tight text-foreground">
                  <Counter value={metric.value} suffix={metric.suffix} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                  <div className="mt-1.5 h-0.5 w-0 bg-accent rounded-full group-hover:w-8 transition-all duration-500" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
