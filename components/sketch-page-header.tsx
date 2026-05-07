"use client"

import { motion } from "framer-motion"
import {
  SketchUnderline,
  SketchStar,
  SketchSquiggle,
  ScribbleHighlight,
} from "@/components/sketch-primitives"
import { SketchDoodles } from "@/components/sketch-doodles"
import { cn } from "@/lib/utils"

interface SketchPageHeaderProps {
  /** Small uppercase/handwritten kicker shown above the title. */
  kicker?: string
  /** Optional handwritten tagline shown above the heading — uses Caveat. */
  handwritten?: string
  /** The main heading text. */
  title: string
  /** Word(s) inside the title to highlight with scribble/underline. If omitted the last word is picked. */
  highlight?: string
  /** Paragraph beneath the heading. */
  description?: string
  /** Add floating sketch doodles behind the header. Default true. */
  doodles?: boolean
  /** Extra className on the outer section. */
  className?: string
  /** Alignment of the text block. */
  align?: "center" | "left"
  /** Optional extra content rendered below the description. */
  children?: React.ReactNode
}

export function SketchPageHeader({
  kicker,
  handwritten,
  title,
  highlight,
  description,
  doodles = true,
  className,
  align = "center",
  children,
}: SketchPageHeaderProps) {
  // Figure out which part of the title gets highlighted.
  const trimmed = title.trim()
  const words = trimmed.split(/\s+/)
  const highlightText = highlight ?? words.slice(-1)[0]
  const headIndex = trimmed.lastIndexOf(highlightText)
  const head = headIndex >= 0 ? trimmed.slice(0, headIndex).trim() : trimmed
  const tail = headIndex >= 0 ? trimmed.slice(headIndex) : ""

  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start"

  return (
    <section className={cn("relative py-24 overflow-hidden paper-grain", className)}>
      {/* Background notebook grid + squiggle dividers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 notebook-grid opacity-60" />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20" />
        <SketchSquiggle
          color="oklch(0.55 0.2 250 / 0.3)"
          strokeWidth={2}
          className="absolute top-10 left-0 right-0 h-5"
        />
        <SketchSquiggle
          color="oklch(0.55 0.2 250 / 0.3)"
          strokeWidth={2}
          className="absolute bottom-10 left-0 right-0 h-5"
          delay={0.2}
        />
      </div>

      {doodles && <SketchDoodles density="sparse" className="-z-5" />}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className={cn("flex flex-col", alignClass)}>
          {kicker && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-5"
            >
              {kicker}
            </motion.span>
          )}

          {handwritten && (
            <motion.span
              initial={{ opacity: 0, y: -6, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sketch text-3xl sm:text-4xl text-accent/90 mb-3 inline-block"
              aria-hidden
            >
              {handwritten}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance max-w-4xl"
          >
            {head && <span>{head} </span>}
            {tail && (
              <span className="relative inline-block">
                <span className="relative z-10">{tail}</span>
                <SketchUnderline
                  color="oklch(0.6 0.2 250)"
                  strokeWidth={4}
                  delay={0.7}
                />
              </span>
            )}

            {/* Decorative sparkles — absolute relative to the heading */}
            <SketchStar
              color="oklch(0.6 0.2 320)"
              delay={1.0}
              className="absolute -top-5 -right-6 w-6 h-6 hidden sm:block"
            />
            <SketchStar
              color="oklch(0.65 0.15 180)"
              delay={1.2}
              className="absolute -bottom-3 -left-6 w-4 h-4 hidden sm:block"
            />
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                "mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 w-full"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Smaller inline page header — for sections on detail pages. */
export function SketchSectionLabel({
  kicker,
  title,
  description,
  handwritten,
  align = "center",
  className,
}: {
  kicker?: string
  title: string
  description?: string
  handwritten?: string
  align?: "center" | "left"
  className?: string
}) {
  const trimmed = title.trim()
  const words = trimmed.split(/\s+/)
  const tail = words.slice(-1)[0]
  const head = words.slice(0, -1).join(" ")
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start"

  return (
    <div className={cn("flex flex-col max-w-3xl", alignClass, className)}>
      {kicker && (
        <motion.div
          initial={{ opacity: 0, x: align === "left" ? -10 : 0, scale: align === "center" ? 0.9 : 1 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
            {kicker}
          </span>
          <span className="h-px w-8 bg-accent" />
        </motion.div>
      )}

      {handwritten && (
        <motion.span
          initial={{ opacity: 0, rotate: -6 }}
          whileInView={{ opacity: 1, rotate: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-sketch text-2xl text-accent/80 mb-2"
          aria-hidden
        >
          {handwritten}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance"
      >
        {head && <span>{head} </span>}
        <span className="relative inline-block">
          <span className="relative z-10">{tail}</span>
          <SketchUnderline color="oklch(0.6 0.2 250)" strokeWidth={4} delay={0.4} />
        </span>
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

/** Re-export ScribbleHighlight convenience for per-page use. */
export { ScribbleHighlight }
