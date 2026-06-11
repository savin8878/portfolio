"use client"

/**
 * HeadingIgnite — as you scroll the homepage, each section heading "ignites" the
 * moment it enters the focus band: a molten fire-gradient sweeps through the
 * letters and the title blooms with an ember glow. Headings light one after
 * another, in order, and stay lit.
 *
 * No rail, no drawn line, no turbulence filter — the effect lives entirely on the
 * real heading elements via CSS (see `.thread-heading` in globals.css), so it is
 * crisp and GPU-cheap. This component is the thin JS layer that:
 *
 *   · resolves each section's primary heading (data-thread-heading, else h1/h2)
 *   · tags it so the CSS can target it
 *   · uses an IntersectionObserver focus band to add `is-lit` once, in sequence
 *
 * H1 (the hero, whose name is already a styled gradient with inline-coloured
 * spans) gets the glow only — never the text-clip fill, which would blank its
 * non-gradient sub-span. Honors reduced-motion (lights instantly).
 *
 * Mounted once from app/page.tsx with the same RailItem list as <SectionRail>, so
 * it tracks the live section order and can never drift out of sync.
 */

import { useEffect } from "react"
import type { RailItem } from "@/lib/section-meta"

const ALL_CLASSES = ["thread-heading", "thread-heading--fill", "is-lit"]

export function HeadingIgnite({ items }: { items: RailItem[] }) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const headings: HTMLElement[] = []

    for (const it of items) {
      const section = document.getElementById(it.anchorId)
      if (!section) continue
      const h =
        (section.querySelector("[data-thread-heading]") as HTMLElement | null) ||
        (section.querySelector("h1, h2") as HTMLElement | null)
      if (!h) continue

      h.classList.add("thread-heading")
      // the hero <h1> carries inline-coloured spans — clip-fill would blank them,
      // so it gets the glow only
      if (h.tagName !== "H1") h.classList.add("thread-heading--fill")

      headings.push(h)
    }

    const ignite = (h: HTMLElement) => {
      h.classList.add("is-lit")
    }

    const cleanups: Array<() => void> = []

    if (reduce) {
      headings.forEach(ignite)
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              ignite(e.target as HTMLElement)
              io.unobserve(e.target)
            }
          }
        },
        // active band ~ 12%–58% of the viewport: a heading lights as it rises into
        // the upper-middle, matching the section's "in focus" moment
        { rootMargin: "-12% 0px -42% 0px", threshold: 0 },
      )
      headings.forEach((h) => io.observe(h))
      cleanups.push(() => io.disconnect())
    }

    return () => {
      cleanups.forEach((fn) => fn())
      headings.forEach((h) => h.classList.remove(...ALL_CLASSES))
    }
  }, [items])

  return null
}
