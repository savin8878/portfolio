"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Check } from "lucide-react"
import type { ProcessStep } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

interface ProcessSectionProps {
  steps: ProcessStep[]
  content?: Record<string, unknown>
}

function Step({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = iconMap[step.icon] || DefaultIcon
  return (
    <StaggerItem from={index % 2 ? "right" : "left"} className="group relative pb-12 last:pb-0">
      <div className="absolute -left-[2.65rem] top-1 grid h-7 w-7 place-items-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold tabular-nums text-muted-foreground transition-colors duration-500 group-hover:border-accent group-hover:text-accent sm:-left-[3.65rem]">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        <Icon className="h-5 w-5 text-accent" />
        {step.title}
      </h3>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">{step.description}</p>
    </StaggerItem>
  )
}

export function ProcessSection({ steps, content }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 20%"] })
  const progressY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 60, damping: 20 })

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
    <section ref={sectionRef} className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      <Parallax speed={-55} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </Parallax>

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

        <div className="grid items-start gap-16 lg:grid-cols-[1fr_340px]">
          {/* steps on a rail */}
          <div className="relative ml-10 border-l border-border/50 pl-10 sm:ml-14 sm:pl-14">
            <motion.div className="absolute -left-px top-0 h-full w-px origin-top bg-accent" style={{ scaleY: progressY }} />
            <Stagger stagger={0.12} className="flex flex-col">
              {steps.map((step, i) => (
                <Step key={step.id} step={step} index={i} />
              ))}
            </Stagger>
          </div>

          {/* commitment — card-free, anchored by a left accent rule */}
          <Reveal from="right" delay={0.15} className="lg:sticky lg:top-28">
            <div className="border-l-2 border-accent/40 pl-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent">{panelLabel}</p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground">{panelTitle}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{panelDescription}</p>
              <Stagger stagger={0.08} delay={0.15} className="mt-7 flex flex-col gap-3">
                {panelItems.map((item) => (
                  <StaggerItem key={item} from="left" distance={24} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/15 text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
