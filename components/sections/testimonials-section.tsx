"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
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
  const title = (content?.title as string) || "What Clients"
  const titleHighlight = (content?.title_highlight as string) || "Say"

  if (!testimonials.length) return null

  function go(next: number) {
    setDir(next > active ? 1 : -1)
    setActive(next)
  }
  function prev() { go((active - 1 + testimonials.length) % testimonials.length) }
  function next() { go((active + 1) % testimonials.length) }

  const t = testimonials[active]

  return (
    <section className="relative py-28 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={ref} className="mb-16">
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
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight"
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

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-2 text-[120px] leading-none font-black text-accent/[0.07] select-none pointer-events-none">
              &ldquo;
            </div>

            <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden p-8 md:p-10">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -30 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
                      />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium mb-8">
                    &ldquo;{t.testimonial_text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-accent">{t.client_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-none mb-1">{t.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.client_title}{t.client_company && ` · ${t.client_company}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/40">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:border-accent/50 hover:bg-accent/5 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5 ml-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? "w-6 bg-accent" : "w-1.5 bg-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
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
                className={`text-left rounded-xl border p-4 transition-all duration-300 ${
                  i === active
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/40 bg-card hover:border-accent/20 hover:bg-accent/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    i === active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
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
