"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Calendar, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const LINKS = [
  {
    icon: MessageSquare,
    label: "Start a Project",
    sub: "Tell me about your idea",
    href: "/contact",
    primary: true,
  },
  {
    icon: Calendar,
    label: "Schedule a Call",
    sub: "Pick a time that works",
    href: "/contact#schedule",
    primary: false,
  },
  {
    icon: Mail,
    label: "Send an Email",
    sub: "hello@akashvishwakarma.dev",
    href: "mailto:hello@akashvishwakarma.dev",
    primary: false,
  },
]

export function CtaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative py-28 border-t border-border/40 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Corner accent glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Get In Touch</span>
            <span className="h-px w-8 bg-accent" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight mb-6"
          >
            Let&apos;s Build{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--accent)), #818cf8)" }}
            >
              Something
            </span>{" "}
            <br className="hidden sm:block" />
            Exceptional
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto"
          >
            Whether launching a new product, scaling a platform, or solving a hard
            engineering problem — I&apos;m ready to help.
          </motion.p>

          {/* CTA cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-4 mb-12"
          >
            {LINKS.map(({ icon: Icon, label, sub, href, primary }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.07 }}
              >
                <Link
                  href={href}
                  className={`group flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300 ${
                    primary
                      ? "border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent/60"
                      : "border-border/50 bg-card hover:border-accent/30 hover:bg-accent/[0.03]"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    primary
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted border border-border/60 text-accent group-hover:border-accent/40 group-hover:bg-accent/5"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground text-sm leading-none mb-1">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Response time */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
            className="text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Available for new projects · Typical response within 24 hours
          </motion.p>

        </div>
      </div>
    </section>
  )
}
