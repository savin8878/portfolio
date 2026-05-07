"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/db"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  content?: Record<string, unknown>
}

export function TestimonialsSection({ testimonials, content }: TestimonialsSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  const label = (content?.label as string) || "Testimonials"
  const title = (content?.title as string) || "Good words"
  const titleHighlight = (content?.title_highlight as string) || "travel fast."

  if (!testimonials.length) return null

  function go(next: number) {
    setDir(next > active ? 1 : -1)
    setActive(next)
  }
  const prev = () => go((active - 1 + testimonials.length) % testimonials.length)
  const next = () => go((active + 1) % testimonials.length)

  const t = testimonials[active]

  return (
    <section className="relative py-32 border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 aurora opacity-30 -z-10" />

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
            {title} <span className="text-gradient-static">{titleHighlight}</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-8 items-start">

          {/* Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl ring-gradient overflow-hidden bg-card/70 backdrop-blur-sm p-8 md:p-12">
              <Quote className="absolute top-6 right-6 h-20 w-20 text-accent/10" strokeWidth={1} />

              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -30 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="flex gap-0.5 mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
                      />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl lg:text-3xl text-foreground leading-[1.35] font-medium tracking-[-0.015em] mb-10 text-balance">
                    &ldquo;{t.testimonial_text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-accent to-accent-2 grid place-items-center shrink-0 shadow-lg shadow-accent/20">
                      <span className="text-sm font-semibold text-accent-foreground">
                        {t.client_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-tight">{t.client_name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {t.client_title}{t.client_company && ` · ${t.client_company}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border/40">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-full border border-border/60 grid place-items-center hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-10 h-10 rounded-full border border-border/60 grid place-items-center hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5 ml-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        i === active ? "w-8 bg-linear-to-r from-accent to-accent-2" : "w-1.5 bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-auto text-xs font-mono text-muted-foreground tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stacked preview list */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(i)}
                className={`text-left rounded-2xl border p-4 transition-all duration-400 ${
                  i === active
                    ? "border-accent/40 bg-accent/5 shadow-lg shadow-accent/5"
                    : "border-border/50 bg-card/40 hover:border-accent/20 hover:bg-accent/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-semibold transition-colors ${
                    i === active ? "bg-linear-to-br from-accent to-accent-2 text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {item.client_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-none">{item.client_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.client_company}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.testimonial_text}
                </p>
              </button>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
