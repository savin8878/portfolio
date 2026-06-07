"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Mail, MessageSquare } from "lucide-react"
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/anim"

const DEFAULT_LINKS = [
  { icon: "MessageSquare", label: "Start a Project", sub: "Tell me about your idea", href: "/contact", primary: true },
  { icon: "Calendar", label: "Schedule a Call", sub: "Pick a time that works", href: "/contact#schedule", primary: false },
  { icon: "Mail", label: "Send an Email", sub: "hello@akashvishwakarma.dev", href: "mailto:hello@akashvishwakarma.dev", primary: false },
]

const ICON_MAP: Record<string, typeof MessageSquare> = { MessageSquare, Calendar, Mail }

interface CtaSectionProps {
  content?: Record<string, unknown>
}

export function CtaSection({ content }: CtaSectionProps) {
  const label = (content?.label as string) || "Get in touch"
  const title = (content?.title as string) || "Let’s build"
  const titleHighlight = (content?.title_highlight as string) || "something"
  const titleSuffix = (content?.title_suffix as string) || "worth shipping."
  const description =
    (content?.description as string) ||
    "Launching a new product, scaling a platform, or solving a hard engineering problem — I'm in."
  const responseText =
    (content?.response_text as string) ||
    "Available for new projects · Typical response within 24 hours"
  const links =
    (content?.links as Array<{ icon: string; label: string; sub: string; href: string; primary: boolean }>) ||
    DEFAULT_LINKS

  const dirs = ["left", "bottom", "right"] as const

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-28 sm:py-36">
      <Parallax speed={-60} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 aurora opacity-70" />
      </Parallax>
      <Parallax speed={40} className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center">
        <span className="block font-mono text-[22vw] font-semibold uppercase leading-none tracking-[-0.06em] text-muted-foreground/5">
          BUILD
        </span>
      </Parallax>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <Reveal from="top">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {label}
          </span>
        </Reveal>

        <Reveal from="bottom" delay={0.08}>
          <h2 className="mt-7 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {title} <span className="text-gradient">{titleHighlight}</span> {titleSuffix}
          </h2>
        </Reveal>

        <Reveal from="zoom" delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
            {description}
          </p>
        </Reveal>

        {/* card-free action row — hairline dividers, no boxes */}
        <Stagger stagger={0.1} delay={0.25} className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-y-8 sm:grid-cols-3 sm:divide-x sm:divide-border/50">
          {links.map((link, i) => {
            const Icon = ICON_MAP[link.icon] || MessageSquare
            return (
              <StaggerItem key={link.label} from={dirs[i % dirs.length]} className="px-4">
                <Link href={link.href} className="group flex flex-col items-center gap-2">
                  <span className={`grid h-12 w-12 place-items-center rounded-full transition-colors duration-300 ${link.primary ? "bg-accent text-accent-foreground" : "border border-border/60 text-accent group-hover:border-accent/50"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {link.label}
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  <span className="text-xs text-muted-foreground">{link.sub}</span>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>

        <Reveal from="bottom" delay={0.4}>
          <p className="mt-14 font-mono text-xs text-muted-foreground">{responseText}</p>
        </Reveal>
      </div>
    </section>
  )
}
