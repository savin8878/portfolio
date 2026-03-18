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
    <section className="relative py-28 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Tech Stack</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Technologies I{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--accent)), #818cf8)" }}
            >
              Work With
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + ci * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category label */}
              <div className="flex items-center gap-2 mb-5">
                <span className="h-px w-5 bg-accent/50" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent">{category}</span>
              </div>

              <div className="flex flex-col gap-2">
                {grouped[category].map((tech, ti) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + ci * 0.08 + ti * 0.04 }}
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3 hover:border-accent/40 hover:bg-accent/3 transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                      {tech.name}
                    </span>
                    {/* Proficiency dots */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{
                            delay: 0.25 + ci * 0.08 + ti * 0.04 + i * 0.04,
                            type: "spring",
                            stiffness: 400,
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i < tech.proficiency_level ? "bg-accent" : "bg-border"
                          }`}
                        />
                      ))}
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
