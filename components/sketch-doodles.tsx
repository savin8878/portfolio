"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * Decorative hand-drawn doodles that float in the background of a section.
 * Each doodle draws itself in with a pathLength animation, then drifts with a
 * CSS transform loop. The whole layer is non-interactive and keyboard-inert.
 */

type Doodle =
  | { kind: "squiggle"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "star"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "spiral"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "loop"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "cross"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "arrow"; top: string; left: string; size: number; rot: number; delay: number; dur: number }
  | { kind: "dots"; top: string; left: string; size: number; rot: number; delay: number; dur: number }

const DEFAULT_DOODLES: Doodle[] = [
  { kind: "star",     top: "8%",   left: "6%",   size: 38, rot: -12, delay: 0.2, dur: 7 },
  { kind: "squiggle", top: "14%",  left: "88%",  size: 90, rot: 8,   delay: 0.6, dur: 8 },
  { kind: "spiral",   top: "38%",  left: "4%",   size: 58, rot: 0,   delay: 1.0, dur: 9 },
  { kind: "loop",     top: "62%",  left: "92%",  size: 72, rot: -18, delay: 0.4, dur: 10 },
  { kind: "cross",    top: "78%",  left: "10%",  size: 30, rot: 14,  delay: 1.2, dur: 6 },
  { kind: "star",     top: "72%",  left: "84%",  size: 26, rot: 0,   delay: 0.8, dur: 7 },
  { kind: "arrow",    top: "28%",  left: "74%",  size: 70, rot: -24, delay: 1.4, dur: 8 },
  { kind: "dots",     top: "52%",  left: "48%",  size: 80, rot: 0,   delay: 0.0, dur: 11 },
]

interface SketchDoodlesProps {
  className?: string
  color?: string
  density?: "sparse" | "normal" | "dense"
}

export function SketchDoodles({
  className,
  color = "currentColor",
  density = "normal",
}: SketchDoodlesProps) {
  const reduceMotion = useReducedMotion()

  const doodles = useMemo(() => {
    if (density === "sparse") return DEFAULT_DOODLES.slice(0, 4)
    if (density === "dense") return [...DEFAULT_DOODLES, ...DEFAULT_DOODLES.map((d, i) => ({
      ...d,
      top: `${(parseFloat(d.top) + 30) % 90}%`,
      left: `${(parseFloat(d.left) + 45) % 95}%`,
      delay: d.delay + 0.5,
      rot: d.rot + 12 + i,
    }))]
    return DEFAULT_DOODLES
  }, [density])

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden text-accent/55 dark:text-accent/60",
        className,
      )}
    >
      {doodles.map((d, i) => (
        <div
          key={`${d.kind}-${i}`}
          className={reduceMotion ? undefined : "sketch-float"}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            // @ts-expect-error custom property
            "--r": `${d.rot}deg`,
            "--d": `${d.dur}s`,
            color,
          }}
        >
          <Doodle kind={d.kind} delay={d.delay} />
        </div>
      ))}
    </div>
  )
}

function Doodle({ kind, delay }: { kind: Doodle["kind"]; delay: number }) {
  const commonSvg = {
    width: "100%",
    height: "100%",
    fill: "none" as const,
    filter: "url(#sketch-rough)",
  }

  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const },
  }

  switch (kind) {
    case "squiggle":
      return (
        <svg viewBox="0 0 100 40" {...commonSvg}>
          <motion.path
            d="M 4 20 Q 16 4, 28 20 T 52 20 T 76 20 T 96 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            {...draw}
          />
        </svg>
      )
    case "star":
      return (
        <svg viewBox="0 0 40 40" {...commonSvg}>
          <motion.path
            d="M 20 3 Q 22 18, 37 20 Q 22 22, 20 37 Q 18 22, 3 20 Q 18 18, 20 3 Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.12"
            {...draw}
          />
        </svg>
      )
    case "spiral":
      return (
        <svg viewBox="0 0 60 60" {...commonSvg}>
          <motion.path
            d="M 30 30 m -3 0 a 3 3 0 1 1 6 0 a 6 6 0 1 1 -12 0 a 10 10 0 1 1 20 0 a 14 14 0 1 1 -28 0 a 19 19 0 1 1 38 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            {...draw}
          />
        </svg>
      )
    case "loop":
      return (
        <svg viewBox="0 0 80 60" {...commonSvg}>
          <motion.path
            d="M 6 50 C 10 10, 40 10, 44 30 C 46 44, 20 46, 24 30 C 28 12, 60 14, 68 34 C 74 48, 78 50, 78 52"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            {...draw}
          />
        </svg>
      )
    case "cross":
      return (
        <svg viewBox="0 0 30 30" {...commonSvg}>
          <motion.path
            d="M 5 5 L 25 25 M 25 5 L 5 25"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            {...draw}
          />
        </svg>
      )
    case "arrow":
      return (
        <svg viewBox="0 0 80 40" {...commonSvg}>
          <motion.path
            d="M 4 30 Q 30 4, 72 14 M 72 14 L 60 8 M 72 14 L 66 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...draw}
          />
        </svg>
      )
    case "dots":
      return (
        <svg viewBox="0 0 80 20" {...commonSvg}>
          {[6, 22, 38, 54, 70].map((cx, i) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy="10"
              r="2.4"
              fill="currentColor"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.35, delay: delay + i * 0.12 }}
            />
          ))}
        </svg>
      )
  }
}
