"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Testimonial } from "@/lib/db"
import { Reveal, Parallax } from "@/components/anim"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  content?: Record<string, unknown>
}

export function TestimonialsSection({ testimonials, content }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  const label = (content?.label as string) || "Testimonials"
  const title = (content?.title as string) || "Good words"
  const titleHighlight = (content?.title_highlight as string) || "travel fast."

  if (!testimonials.length) return null

  function go(next: number) {
    setDir(next > active ? 1 : -1)
    setActive((next + testimonials.length) % testimonials.length)
  }
  const t = testimonials[active]

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
      <Parallax speed={50} className="pointer-events-none absolute -right-10 top-10 -z-10 select-none">
        <span className="block font-serif text-[24vw] leading-none text-accent/5">&rdquo;</span>
      </Parallax>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal from="top">
          <span data-thread-heading className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent/60" />
            {label} — {title} {titleHighlight}
          </span>
        </Reveal>

        <div className="relative mt-12 min-h-64">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={active}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, rotateY: dir * 6, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, rotateY: dir * -6, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1100 }}
            >
              <p className="text-2xl font-medium leading-[1.3] tracking-[-0.015em] text-foreground text-balance sm:text-3xl md:text-4xl">
                {t.testimonial_text}
              </p>
              <footer className="mt-10 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-accent to-accent-3 text-base font-semibold text-accent-foreground">
                  {t.client_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold leading-tight text-foreground">{t.client_name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t.client_title}
                    {t.client_company && ` · ${t.client_company}`}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center gap-6 border-t border-border/50 pt-8">
          <div className="flex gap-2">
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "w-10 bg-accent" : "w-4 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  )
}
