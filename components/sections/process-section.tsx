"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion"
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6"
    >
      {/* Left: number + line */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.06 + 0.1, type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-full border border-accent/40 bg-accent/5 flex items-center justify-center text-xs font-black text-accent z-10"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>
        {index < total - 1 && (
          <div className="w-px flex-1 mt-2 bg-border/40" />
        )}
      </div>

      {/* Right: content */}
      <div className={`pb-10 flex-1 ${index === total - 1 ? "pb-0" : ""}`}>
        <div className="rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all duration-300 group overflow-hidden">
          {/* Top accent bar on hover */}
          <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-transparent via-accent/60 to-transparent transition-all duration-500" />

          <div className="p-6 flex gap-5 items-start">
            <div className="w-10 h-10 rounded-xl border border-border/60 bg-muted flex items-center justify-center text-accent group-hover:border-accent/40 group-hover:bg-accent/5 transition-all duration-300 shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base leading-snug mb-1.5 group-hover:text-accent transition-colors duration-300">
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
  const lineScaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 60,
    damping: 20,
  })

  const label = (content?.label as string) || "Process"
  const title = (content?.title as string) || "How We Build"
  const titleHighlight = (content?.title_highlight as string) || "Together"
  const panelLabel = (content?.panel_label as string) || "My commitment"
  const panelTitle = (content?.panel_title as string) || "Clarity at every step"
  const panelDescription =
    (content?.panel_description as string) ||
    "No black boxes. You always know where the project stands, what was shipped, and what comes next. I aim for decisions together — not surprises after the fact."
  const panelItems = (content?.panel_items as string[]) || [
    "Weekly async updates",
    "Shared project board",
    "Code reviews & docs",
    "Post-launch support",
  ]

  return (
    <section ref={sectionRef} className="relative py-28 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">{label}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            {title}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--accent)), #818cf8)" }}
            >
              {titleHighlight}
            </span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Steps */}
          <div>
            {steps.map((step, i) => (
              <Step key={step.id} step={step} index={i} total={steps.length} />
            ))}
          </div>
          {/* Right panel — summary / CTA */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="h-px w-full bg-linear-to-r from-transparent via-accent/60 to-transparent" />
              <div className="p-8">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent mb-4">
                  {panelLabel}
                </p>
                <h3 className="text-2xl font-black text-foreground leading-snug mb-4">
                  {panelTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-8">
                  {panelDescription}
                </p>
                <div className="flex flex-col gap-3">
                  {panelItems.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
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
