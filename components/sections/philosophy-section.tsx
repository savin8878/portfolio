"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import type { PhilosophyItem } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"

interface PhilosophySectionProps {
  items: PhilosophyItem[]
}

export function PhilosophySection({ items }: PhilosophySectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 aurora opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5">
            Principles
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground text-balance">
            How I <span className="text-gradient-static">build</span> the things I build.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-balance">
            Four rules that decide what goes into the codebase — and what never does.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || DefaultIcon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl ring-conic h-full"
              >
                <div className="relative h-full rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-7 overflow-hidden transition-all duration-500 group-hover:border-accent/30 group-hover:bg-card">
                  {/* Index number */}
                  <span className="absolute top-5 right-5 text-xs font-mono text-muted-foreground/60 tabular-nums">
                    0{index + 1}
                  </span>

                  {/* Icon with gradient backdrop */}
                  <div className="relative inline-flex mb-5">
                    <div className="absolute inset-0 bg-linear-to-br from-accent to-accent-2 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-accent to-accent-2 grid place-items-center text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
