"use client"

/**
 * Projects showcase — CARD-FREE. A large editorial index: an interactive list
 * of project titles on the left; hovering a title morphs a big cinematic
 * preview on the right (with 3D tilt + parallax). No boxes, no bento grid.
 */

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/db"
import { Reveal, Stagger, StaggerItem, Parallax, TiltCard } from "@/components/anim"

interface ScrollProjectsSectionProps {
  projects: Project[]
  content?: Record<string, unknown>
}

const GRADIENTS = [
  "from-accent/30 via-accent-3/20 to-transparent",
  "from-accent-2/25 via-accent/15 to-transparent",
  "from-accent-3/25 via-accent/15 to-transparent",
  "from-accent/25 via-accent-2/15 to-transparent",
  "from-accent-2/25 via-accent-3/15 to-transparent",
  "from-accent/30 via-accent-2/15 to-transparent",
]

function Preview({ project, index }: { project: Project; index: number }) {
  const gradient = GRADIENTS[index % GRADIENTS.length]
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, scale: 1.04, rotateY: 8, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, rotateY: -8, filter: "blur(12px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
      style={{ transformPerspective: 1200 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {project.featured_image ? (
          <Image src={project.featured_image} alt={project.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${gradient}`}>
            <span className="absolute -right-6 -bottom-10 select-none text-[16rem] font-black leading-none text-foreground/10">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7">
          <p className="text-xl font-semibold tracking-tight text-foreground">{project.title}</p>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{project.short_description}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {project.tech_stack?.slice(0, 4).map((tech) => (
              <span key={tech} className="font-mono text-xs text-muted-foreground/70">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ScrollProjectsSection({ projects, content }: ScrollProjectsSectionProps) {
  const items = projects.slice(0, 6)
  const [active, setActive] = useState(0)

  if (items.length === 0) return null

  const label = (content?.label as string) || "Featured Work"
  const title = (content?.title as string) || "Selected"
  const highlight = (content?.title_highlight as string) || "case studies."

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      <Parallax speed={-44} className="pointer-events-none absolute -left-6 top-10 -z-10 select-none">
        <span className="block font-mono text-[18vw] font-semibold uppercase leading-none tracking-[-0.05em] text-muted-foreground/5">
          WORK
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal from="top">
              <span className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
                <span className="h-px w-8 bg-accent/60" />
                {label}
              </span>
            </Reveal>
            <Reveal from="left" delay={0.08}>
              <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
                {title} <span className="text-gradient-static">{highlight}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal from="right" delay={0.16}>
            <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-accent">
              All projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* interactive title list */}
          <Stagger stagger={0.08} className="border-t border-border/50">
            {items.map((p, i) => (
              <StaggerItem key={p.id} from="left">
                <Link
                  href={`/projects/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-5 border-b border-border/50 py-6"
                >
                  <span className={`font-mono text-sm tabular-nums transition-colors ${active === i ? "text-accent" : "text-muted-foreground/40"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* mobile inline preview (card-free, full-bleed) */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl lg:hidden">
                    {p.featured_image ? (
                      <Image src={p.featured_image} alt="" fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className={`absolute inset-0 bg-linear-to-br ${GRADIENTS[i % GRADIENTS.length]}`} />
                    )}
                  </div>
                  <span
                    className={`flex-1 text-2xl font-semibold tracking-tight transition-colors duration-300 md:text-3xl ${
                      active === i ? "text-foreground" : "text-muted-foreground/55 group-hover:text-foreground"
                    }`}
                  >
                    {p.title}
                  </span>
                  <ArrowUpRight
                    className={`h-6 w-6 shrink-0 transition-all duration-300 ${
                      active === i ? "text-accent opacity-100" : "text-muted-foreground/40 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {/* big morphing preview (desktop) */}
          <Reveal from="right" className="hidden lg:block">
            <TiltCard max={7} className="sticky top-28 aspect-4/5 w-full">
              <AnimatePresence mode="wait">
                <Preview key={active} project={items[active]} index={active} />
              </AnimatePresence>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
