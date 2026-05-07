"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion"
import { Check } from "lucide-react"
import type { ProcessStep } from "@/lib/db"
import { iconMap, DefaultIcon } from "@/lib/icon-map"

interface ProcessSectionProps {
  steps: ProcessStep[]
  content?: Record<string, unknown>
}

function Step({ step, index, total }: { step: ProcessStep; index: number; total: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = iconMap[step.icon] || DefaultIcon
  const isLast = index === total - 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-5"
    >
      {/* Number + connector */}
      <div className="flex flex-col items-center shrink-0 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.06 + 0.1, type: "spring", stiffness: 300, damping: 20 }}
          className="relative z-10"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-accent to-accent-2 grid place-items-center shadow-lg shadow-accent/30">
            <span className="text-xs font-mono font-semibold text-accent-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="absolute -inset-1 rounded-xl bg-accent/30 blur-md -z-10" />
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 relative overflow-hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.9, delay: index * 0.06 + 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute inset-0 bg-linear-to-b from-accent/60 via-accent/30 to-transparent"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`pb-12 flex-1 ${isLast ? "pb-0" : ""}`}>
        <div className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 hover:border-accent/30 hover:bg-card transition-all duration-500">
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent grid place-items-center group-hover:scale-110 transition-transform duration-500">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base leading-snug mb-1.5 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProcessSection({ steps, content }: ProcessSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  })
  const progressY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 60,
    damping: 20,
  })

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
    <section ref={sectionRef} className="relative py-32 border-t border-border/40 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={ref} className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent mb-5"
          >
            {label}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground"
          >
            {title} <span className="text-gradient-static">{titleHighlight}</span> — without drama.
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-16 items-start">
          {/* Steps */}
          <div className="relative">
            {/* Scroll progress ghost line */}
            <motion.div
              className="absolute left-5.25 top-11 bottom-11 w-px origin-top bg-accent/60"
              style={{ scaleY: progressY }}
            />
            {steps.map((step, i) => (
              <Step key={step.id} step={step} index={i} total={steps.length} />
            ))}
          </div>

          {/* Right sticky panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative rounded-3xl ring-gradient overflow-hidden bg-card/60 backdrop-blur-sm">
              <div className="absolute inset-0 aurora opacity-40" />
              <div className="relative p-8">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent mb-4">
                  {panelLabel}
                </p>
                <h3 className="text-2xl font-semibold text-foreground leading-tight mb-4 tracking-tight">
                  {panelTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-7">
                  {panelDescription}
                </p>
                <div className="flex flex-col gap-3">
                  {panelItems.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent grid place-items-center shrink-0">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
