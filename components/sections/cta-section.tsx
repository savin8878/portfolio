"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Calendar, Mail, MessageSquare } from "lucide-react"

const DEFAULT_LINKS = [
  {
    icon: "MessageSquare",
    label: "Start a Project",
    sub: "Tell me about your idea",
    href: "/contact",
    primary: true,
  },
  {
    icon: "Calendar",
    label: "Schedule a Call",
    sub: "Pick a time that works",
    href: "/contact#schedule",
    primary: false,
  },
  {
    icon: "Mail",
    label: "Send an Email",
    sub: "hello@akashvishwakarma.dev",
    href: "mailto:hello@akashvishwakarma.dev",
    primary: false,
  },
]

const ICON_MAP: Record<string, typeof MessageSquare> = {
  MessageSquare,
  Calendar,
  Mail,
}

interface CtaSectionProps {
  content?: Record<string, unknown>
}

export function CtaSection({ content }: CtaSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const label = (content?.label as string) || "Get in touch"
  const title = (content?.title as string) || "Let\u2019s build"
  const titleHighlight = (content?.title_highlight as string) || "something"
  const titleSuffix = (content?.title_suffix as string) || "worth shipping."
  const description =
    (content?.description as string) ||
    "Launching a new product, scaling a platform, or solving a hard engineering problem \u2014 I'm in."
  const responseText =
    (content?.response_text as string) ||
    "Available for new projects \u00b7 Typical response within 24 hours"
  const links = (content?.links as Array<{
    icon: string
    label: string
    sub: string
    href: string
    primary: boolean
  }>) || DEFAULT_LINKS

  return (
    <section className="relative py-32 border-t border-border/40 overflow-hidden">
      {/* Dramatic aurora background */}
      <div className="absolute inset-0 aurora opacity-80 -z-10" />
      <div className="absolute inset-0 dot-grid mask-fade-radial opacity-40 -z-10" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-accent mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {label}
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] leading-[0.98] text-foreground text-balance"
          >
            {title} <span className="text-gradient">{titleHighlight}</span> {titleSuffix}
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance"
          >
            {description}
          </motion.p>

          {/* CTA cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-3 mt-14 max-w-3xl mx-auto"
          >
            {links.map((link, i) => {
              const Icon = ICON_MAP[link.icon] || MessageSquare
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className={`group relative flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-500 overflow-hidden ${
                      link.primary
                        ? "bg-linear-to-br from-accent to-accent-2 text-accent-foreground shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-1"
                        : "glass hover:border-accent/40 hover:-translate-y-1"
                    }`}
                  >
                    {link.primary && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shimmer" />
                    )}
                    <div className={`relative w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 ${
                      link.primary
                        ? "bg-white/15 backdrop-blur-sm"
                        : "bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent/15"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center relative">
                      <p className={`font-semibold text-sm leading-none mb-1.5 tracking-tight ${
                        link.primary ? "text-accent-foreground" : "text-foreground"
                      }`}>
                        {link.label}
                      </p>
                      <p className={`text-[11px] ${link.primary ? "text-accent-foreground/75" : "text-muted-foreground"}`}>
                        {link.sub}
                      </p>
                    </div>
                    <ArrowRight className={`h-3.5 w-3.5 transition-all duration-300 group-hover:translate-x-0.5 ${
                      link.primary ? "text-accent-foreground" : "text-accent opacity-0 group-hover:opacity-100"
                    }`} />
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Response time */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12 text-xs text-muted-foreground flex items-center justify-center gap-2 font-mono"
          >
            {responseText}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
