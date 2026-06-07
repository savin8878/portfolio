"use client"

import type { TechStackItem } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

const CATEGORY_ORDER = ["Frontend", "Backend", "Infrastructure", "Tools"]
const DIRS = ["left", "right"] as const

export function TechStackSection({ techStack }: { techStack: TechStackItem[] }) {
  const grouped = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, TechStackItem[]>)

  const categories = CATEGORY_ORDER.filter((c) => grouped[c])

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      <Parallax speed={65} className="pointer-events-none absolute -left-4 top-10 -z-10 select-none">
        <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
          STACK
        </span>
      </Parallax>
      <Parallax speed={-48} className="pointer-events-none absolute right-0 top-1/4 -z-10">
        <div className="h-112 w-md rounded-full bg-accent/8 blur-3xl" />
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              Tech Stack
            </span>
          </Reveal>
          <Reveal from="right" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              Tools that ship fast, scale quiet.
            </h2>
          </Reveal>
        </div>

        <Stagger stagger={0.12} className="border-t border-border/50">
          {categories.map((category, ci) => (
            <StaggerItem
              key={category}
              from={DIRS[ci % DIRS.length]}
              className="grid grid-cols-1 gap-4 border-b border-border/50 py-10 md:grid-cols-[14rem_1fr] md:gap-12"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">{category}</span>
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground/40">
                  {String(grouped[category].length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {grouped[category].map((tech) => (
                  <span
                    key={tech.id}
                    className="cursor-default text-xl font-medium tracking-tight text-foreground/55 transition-colors duration-300 hover:text-accent md:text-2xl"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
