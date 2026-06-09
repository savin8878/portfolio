"use client"

/**
 * ExperienceTimeline — mirrors the homepage Process section: a hand-drawn,
 * self-animating sketch journey on the LEFT (experience → education →
 * certifications, each a numbered sketch unit) and a sticky "At a glance"
 * commitment-style panel on the RIGHT that stays pinned while the journey
 * scrolls. Same fire/ember + Caveat sketch aesthetic.
 */

import { GraduationCap, Award, Briefcase, type LucideIcon } from "lucide-react"
import type { Experience, Education, Certification } from "@/lib/db"
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
import { SectionSketches } from "@/components/section-sketches"

interface ExperienceTimelineProps {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  content?: Record<string, unknown>
}

function formatDate(date: Date | null): string {
  if (!date) return "Present"
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

/** A single unified entry in the career journey (job, degree or certificate). */
interface JourneyEntry {
  icon: LucideIcon
  title: string
  subtitle?: string
  meta?: string
  description?: string
  bullets?: string[]
  tech?: string[]
}

/** One entry rendered as a hand-drawn, self-animating sketch unit. */
function JourneyStep({ entry, index, isLast }: { entry: JourneyEntry; index: number; isLast: boolean }) {
  const Icon = entry.icon
  const d = index * 0.12

  return (
    <div className="relative flex gap-5 pb-14 last:pb-0 sm:gap-7">
      {/* hand-drawn rail: numbered node + connector that draw themselves */}
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
        <div className="mb-1 flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0 text-accent" />
          <h3 className="relative inline-block font-sketch text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {entry.title}
            <SketchUnderline className="text-accent" strokeWidth={3} duration={1} delay={d + 0.5} />
          </h3>
        </div>

        {entry.subtitle && <p className="text-sm font-medium text-accent">{entry.subtitle}</p>}
        {entry.meta && <p className="mt-0.5 font-mono text-xs text-muted-foreground">{entry.meta}</p>}
        {entry.description && (
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{entry.description}</p>
        )}

        {entry.bullets && entry.bullets.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {entry.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <SketchCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {entry.tech && entry.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {entry.tech.map((t) => (
              <span key={t} className="font-mono text-xs text-muted-foreground/60">{t}</span>
            ))}
          </div>
        )}

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

export function ExperienceTimeline({ experiences, education, certifications, content }: ExperienceTimelineProps) {
  const label = (content?.label as string) || "Career Journey"
  const title = (content?.title as string) || "Experience &"
  const titleHighlight = (content?.title_highlight as string) || "background."
  const panelLabel = (content?.panel_label as string) || "At a glance"
  const panelTitle = (content?.panel_title as string) || "Career highlights"
  const panelDescription =
    (content?.panel_description as string) ||
    "Years of building products that scale, shipping AI-powered tools, and turning complex problems into elegant, reliable solutions."
  const panelItems = (content?.panel_items as string[]) || [
    "2+ years in full-stack development",
    "Scaled platforms to 200+ countries",
    "AI-powered tooling & automation",
    "Product-driven engineering",
  ]

  // One continuous hand-drawn journey: experience, then education, then certs.
  const entries: JourneyEntry[] = [
    ...experiences.map((e) => ({
      icon: Briefcase,
      title: e.job_title,
      subtitle: e.company_name,
      meta: `${formatDate(e.start_date)} — ${e.is_current ? "Present" : formatDate(e.end_date)}${e.location ? ` · ${e.location}` : ""}`,
      description: e.description,
      bullets: e.achievements ?? undefined,
      tech: e.tech_used ?? undefined,
    })),
    ...education.map((ed) => ({
      icon: GraduationCap,
      title: ed.degree,
      subtitle: ed.institution,
      meta: `${formatDate(ed.start_date)} — ${formatDate(ed.end_date)}`,
      description: ed.field_of_study ?? undefined,
    })),
    ...certifications.map((c) => ({
      icon: Award,
      title: c.name,
      subtitle: c.issuer,
      meta: formatDate(c.issue_date),
    })),
  ]

  return (
    <section className="relative border-t border-border/50 py-24 sm:py-32">
      {/* ghost word clipped in its own box so the section keeps NO overflow
          ancestor — otherwise the sticky panel below would break */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Parallax speed={-44} className="absolute -left-6 top-12 select-none">
          <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
            PATH
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
              {title} <span className="text-gradient-static">{titleHighlight}</span>
            </h2>
          </Reveal>
        </div>

        {/* LEFT = scrolling hand-drawn journey · RIGHT = sticky panel */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {entries.map((entry, i) => (
              <JourneyStep key={`${entry.title}-${i}`} entry={entry} index={i} isLast={i === entries.length - 1} />
            ))}
          </div>

          {/* sticky highlights — stays pinned while the journey scrolls */}
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

      {/* doodle accents framing the section (matches the homepage wrapper) */}
      <SectionSketches seed={4} />
    </section>
  )
}
