"use client"

/**
 * SectionSketches — a hand-drawn doodle overlay scattered at the edges/margins
 * of a section. Mounted once inside the shared <SectionReveal> wrapper so EVERY
 * homepage section gets sketch accents, with a per-section `seed` that varies
 * which doodles appear and where (so no two neighbours look identical).
 *
 * All doodles are pointer-events-none, self-animate (draw-in via the sketch
 * primitives), use the fire/ember accent tokens, and sit in the side gutters /
 * top-bottom padding bands so they frame the content rather than cover it.
 * Side-heavy doodles are hidden on small screens (where gutters disappear).
 */

import type { ReactNode } from "react"
import {
  SketchStar,
  SketchArrow,
  SketchSquiggle,
  SketchDottedPath,
  SketchVerticalLine,
} from "@/components/sketch-primitives"

// A pool of placements. Each renders one positioned doodle. Stars + squiggles
// live in the top/bottom padding bands (safe on every screen); arrows / dotted
// trails / the rail line sit in the side gutters and hide on small screens.
const POOL: ((key: string) => ReactNode)[] = [
  (k) => <SketchStar key={k} className="absolute left-[4%] top-[15%] h-9 w-9 text-accent-2 opacity-80" />,
  (k) => <SketchStar key={k} className="absolute right-[11%] top-[12%] h-5 w-5 text-accent opacity-80" />,
  (k) => <SketchStar key={k} className="absolute left-[10%] bottom-[16%] h-7 w-7 text-accent-3 opacity-75" />,
  (k) => <SketchStar key={k} className="absolute right-[13%] top-[42%] hidden h-6 w-6 text-accent-2 opacity-75 sm:block" />,
  (k) => <SketchSquiggle key={k} className="absolute left-[7%] top-[9%] w-28 text-accent-2 opacity-70" />,
  (k) => <SketchSquiggle key={k} className="absolute right-[7%] bottom-[10%] w-32 text-accent opacity-65" />,
  (k) => <SketchArrow key={k} className="absolute right-[6%] top-[22%] hidden h-16 w-20 text-accent opacity-70 sm:block" curve={1.3} />,
  (k) => <SketchArrow key={k} className="absolute left-[5%] bottom-[22%] hidden h-14 w-16 text-accent-3 opacity-60 sm:block" curve={1.1} flipX />,
  (k) => <SketchArrow key={k} className="absolute left-[8%] top-[18%] hidden h-12 w-14 text-accent opacity-60 md:block" curve={1.2} flipX flipY />,
  (k) => <SketchDottedPath key={k} className="absolute right-[4%] top-[40%] hidden h-20 w-28 text-accent-2 opacity-60 md:block" />,
  (k) => <SketchDottedPath key={k} className="absolute left-[3%] top-[46%] hidden h-16 w-24 text-accent opacity-55 md:block" d="M 10 12 Q 60 60, 110 28 T 210 48" />,
  (k) => <SketchVerticalLine key={k} className="absolute left-[2%] top-[24%] hidden h-28 w-3 text-accent-2 opacity-40 lg:block" />,
]

export function SectionSketches({ seed = 0 }: { seed?: number }) {
  const n = POOL.length
  // stride 5 is coprime with 12 -> three always-distinct indices; the *7 base
  // spreads the starting point so adjacent sections differ.
  const base = (seed * 7) % n
  const picks = [base, (base + 5) % n, (base + 10) % n]

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {picks.map((i) => POOL[i](`sk-${seed}-${i}`))}
    </div>
  )
}
