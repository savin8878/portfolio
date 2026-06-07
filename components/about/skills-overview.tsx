"use client"

import type { TechStackItem } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

interface SkillsOverviewProps {
  techStack: TechStackItem[]
  content?: Record<string, unknown>
}

const CATEGORY_ORDER = ["Frontend", "Backend", "Infrastructure", "Tools"]

export function SkillsOverview({ techStack, content }: SkillsOverviewProps) {
  const grouped = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, TechStackItem[]>)

  const categories = CATEGORY_ORDER.filter((c) => grouped[c])

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      {/* right glow drifts up (positive) */}
      <Parallax
        speed={60}
        className="pointer-events-none absolute -right-32 top-1/4 -z-10 h-96 w-96 opacity-50"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,122,24,0.08), transparent 70%)" }}
        />
      </Parallax>

      {/* left glow drifts the opposite way (negative) — counter-drift = depth */}
      <Parallax
        speed={-40}
        className="pointer-events-none absolute -left-24 bottom-12 -z-10 h-80 w-80 opacity-40"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,122,24,0.06), transparent 70%)" }}
        />
      </Parallax>

      {/* oversized ghost count floating behind the heading */}
      <Parallax
        speed={48}
        className="pointer-events-none absolute -right-4 top-8 -z-10 select-none"
      >
        <span className="font-mono text-[9rem] font-black leading-none tracking-tighter text-muted-foreground/5 sm:text-[15rem]">
          {String(techStack.length).padStart(2, "0")}
        </span>
      </Parallax>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* header group — eyebrow drops from top, heading slides from left */}
        <div className="mb-16 max-w-3xl">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              {(content?.label as string) || "Tech Stack"}
            </span>
          </Reveal>
          <Reveal from="left" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              {(content?.title as string) || "Skills &"}{" "}
              <span className="text-gradient-static">{(content?.title_highlight as string) || "expertise."}</span>
            </h2>
          </Reveal>
        </div>

        {/* category rows — cycle through 4 directions for layered 3D arrival */}
        <Stagger stagger={0.1} className="border-t border-border/50">
          {categories.map((category, ci) => (
            <StaggerItem
              key={category}
              from={(["left", "right", "flip-up", "zoom"] as const)[ci % 4]}
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
                  <span key={tech.id} className="group inline-flex items-baseline gap-1.5">
                    <span className="text-xl font-medium tracking-tight text-foreground/55 transition-colors duration-300 group-hover:text-accent md:text-2xl">
                      {tech.name}
                    </span>
                    {tech.years_experience ? (
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground/40">
                        {tech.years_experience}y
                      </span>
                    ) : null}
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
