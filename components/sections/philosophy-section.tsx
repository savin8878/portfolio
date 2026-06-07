"use client"

import { ArrowUpRight } from "lucide-react"
import type { PhilosophyItem } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

interface PhilosophySectionProps {
  items: PhilosophyItem[]
}

const DIRS = ["left", "right"] as const

export function PhilosophySection({ items }: PhilosophySectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      {/* ghost word + glow — layered parallax depth */}
      <Parallax speed={-46} className="pointer-events-none absolute left-1/2 top-24 -z-10 -translate-x-1/2 select-none">
        <span className="block font-mono text-[20vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
          ETHOS
        </span>
      </Parallax>
      <Parallax speed={44} className="pointer-events-none absolute -right-20 bottom-0 -z-10">
        <div className="h-112 w-md rounded-full bg-accent/8 blur-3xl" />
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              Principles
            </span>
          </Reveal>
          <Reveal from="left" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              How I build the things I build.
            </h2>
          </Reveal>
        </div>

        <Stagger stagger={0.12} className="border-t border-border/50">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || DefaultIcon
            return (
              <StaggerItem
                key={item.id}
                from={DIRS[index % DIRS.length]}
                className="group relative grid grid-cols-1 gap-4 border-b border-border/50 py-9 md:grid-cols-[7rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <span className="pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 rounded-2xl bg-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="font-mono text-5xl font-semibold leading-none tabular-nums text-muted-foreground/30 transition-colors duration-500 group-hover:text-accent md:text-6xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="max-w-2xl">
                  <h3 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    <Icon className="h-5 w-5 text-accent" />
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.description}</p>
                </div>

                <ArrowUpRight className="hidden h-6 w-6 translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100 md:block" />
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
