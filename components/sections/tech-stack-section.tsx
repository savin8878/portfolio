"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { TechStackItem } from "@/lib/db"

const CATEGORY_ORDER = ["Frontend", "Backend", "Infrastructure", "Tools"]

export function TechStackSection({ techStack }: { techStack: TechStackItem[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const grouped = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, TechStackItem[]>)

  const categories = CATEGORY_ORDER.filter((c) => grouped[c])

  return (
    <section className="relative py-32 border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 dot-grid mask-fade-radial opacity-40 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5"
          >
            Tech Stack
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground"
          >
            Tools that <span className="text-gradient-static">ship fast</span>, scale quiet.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg text-muted-foreground leading-relaxed"
          >
            Battle-tested picks — the exact stack I reach for when a product has to work on day one and day 1,000.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + ci * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 hover:border-accent/30 transition-all duration-500"
            >
              {/* Category label */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  {category}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums">
                  {String(grouped[category].length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {grouped[category].map((tech, ti) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + ci * 0.08 + ti * 0.04 }}
                    className="group/item"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground group-hover/item:text-accent transition-colors">
                        {tech.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">
                        {tech.proficiency_level * 20}%
                      </span>
                    </div>
                    {/* Proficiency bar */}
                    <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${tech.proficiency_level * 20}%` } : {}}
                        transition={{
                          duration: 1.1,
                          delay: 0.3 + ci * 0.08 + ti * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full bg-linear-to-r from-accent to-accent-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
