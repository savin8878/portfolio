"use client"

import { Check } from "lucide-react"
import type { ProcessStep } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"
import { Reveal, Parallax } from "@/components/anim"
import {
  SketchCircle,
  SketchVerticalLine,
  SketchUnderline,
  SketchStar,
  SketchArrow,
  SketchSquiggle,
  SketchCheck,
} from "@/components/sketch-primitives"

interface ProcessSectionProps {
  steps: ProcessStep[]
  content?: Record<string, unknown>
}

/** One step rendered as a hand-drawn, self-animating sketch unit. */
function SketchStep({ step, index, isLast }: { step: ProcessStep; index: number; isLast: boolean }) {
  const Icon = iconMap[step.icon] || DefaultIcon
  const d = index * 0.12

  return (
    <div className="relative flex gap-5 pb-14 last:pb-0 sm:gap-7">
      {/* hand-drawn rail: node + connector that draw themselves */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center">
          <SketchCircle className="text-accent" strokeWidth={2.5} duration={1.4} delay={d} />
          <span className="font-sketch text-3xl font-bold text-accent">{index + 1}</span>
        </div>
        {!isLast && (
          <div className="relative my-1 min-h-20 w-6 flex-1">
            <SketchVerticalLine
              className="absolute inset-0 h-full w-full text-accent/70"
              strokeWidth={2.5}
              duration={1.8}
              delay={d + 0.3}
            />
          </div>
        )}
      </div>

      {/* content */}
      <div className="relative flex-1 pt-2">
        <div className="mb-2 flex items-center gap-3">
          <Icon className="h-5 w-5 text-accent" />
          <h3 className="relative inline-block font-sketch text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {step.title}
            <SketchUnderline className="text-accent" strokeWidth={3} duration={1} delay={d + 0.5} />
          </h3>
        </div>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">{step.description}</p>

        {/* alternating hand-drawn doodle accents */}
        {index % 3 === 0 && (
          <SketchStar className="absolute -right-2 -top-3 h-7 w-7 text-accent-2 sm:right-10" delay={d + 0.8} />
        )}
        {index % 3 === 1 && (
          <SketchArrow className="absolute -right-1 top-0 h-12 w-14 text-accent/70 sm:right-8" curve={1.2} delay={d + 0.7} />
        )}
        {index % 3 === 2 && (
          <SketchSquiggle className="mt-4 max-w-40 text-accent/50" delay={d + 0.7} />
        )}
      </div>
    </div>
  )
}

export function ProcessSection({ steps, content }: ProcessSectionProps) {
  const label = (content?.label as string) || "Process"
  const title = (content?.title as string) || "From idea to"
  const titleHighlight = (content?.title_highlight as string) || "production"
  const panelLabel = (content?.panel_label as string) || "My commitment"
  const panelTitle = (content?.panel_title as string) || "Clarity at every step"
  const panelDescription =
    (content?.panel_description as string) ||
    "No black boxes. You always know where the project stands, what was shipped, and what comes next. Decisions together — not surprises after the fact."
  const panelItems = (content?.panel_items as string[]) || [
    "Weekly async updates",
    "Shared project board",
    "Code reviews & docs",
    "Post-launch support",
  ]

  return (
    <section className="relative border-t border-border/50 py-24 sm:py-32">
      {/* ghost word clipped in its own box so the section keeps no `overflow`
          ancestor — otherwise the sticky panel below would break */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Parallax speed={-44} className="absolute -left-6 top-12 select-none">
          <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
            FLOW
          </span>
        </Parallax>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <Reveal from="top">
            <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent/60" />
              {label}
            </span>
          </Reveal>
          <Reveal from="left" delay={0.08}>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              {title} <span className="text-gradient-static">{titleHighlight}</span> — without drama.
            </h2>
          </Reveal>
        </div>

        {/* LEFT = scrolling hand-drawn sketch journey · RIGHT = sticky panel */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {steps.map((step, i) => (
              <SketchStep key={step.id} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>

          {/* sticky commitment — stays pinned while the sketch scrolls */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative border-l-2 border-accent/40 pl-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent">{panelLabel}</p>
              <h3 className="relative mt-4 inline-block font-sketch text-3xl font-bold leading-tight tracking-tight text-foreground">
                {panelTitle}
                <SketchUnderline className="text-accent" strokeWidth={3} delay={0.4} />
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{panelDescription}</p>
              <div className="mt-7 flex flex-col gap-3.5">
                {panelItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <SketchCheck className="h-5 w-5 shrink-0 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
              <SketchStar className="absolute -right-2 top-0 h-6 w-6 text-accent-2" delay={0.9} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
