"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  eyebrow?: string
  title: string
  /** Optional trailing words rendered in the fire gradient. */
  highlight?: string
  description?: string
}

/**
 * Modern editorial page header — mono eyebrow + accent rule, oversized heading,
 * generous whitespace. Replaces the old hand-drawn SketchPageHeader.
 */
export function PageHeader({ eyebrow, title, highlight, description }: PageHeaderProps) {
  return (
    <section className="relative border-b border-border/50 pb-16 pt-28 sm:pt-32">
      {/* subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
        style={{ background: "radial-gradient(50% 100% at 50% 0%, rgba(255,122,24,0.08), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-8 bg-accent/60" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl md:text-7xl"
        >
          {title}
          {highlight && <span className="text-gradient-static"> {highlight}</span>}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
