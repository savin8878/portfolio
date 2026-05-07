"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Sketch primitive library — reusable SVG hand-drawn animations.
 *
 * All primitives share a turbulence-based "roughen" filter to give a hand-drawn
 * feel and use framer-motion pathLength to animate the stroke as if a pen is
 * drawing in real time.
 *
 * SketchDefs must be mounted once near the root of the app so the filters are
 * available for filter="url(#sketch-rough)" references.
 */

export function SketchDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none", overflow: "hidden" }}
    >
      <defs>
        <filter id="sketch-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
        <filter id="sketch-rough-strong" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.6" />
        </filter>
        <filter id="sketch-pencil" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
        </filter>
        <filter id="sketch-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.08 0"
          />
        </filter>
      </defs>
    </svg>
  )
}

type SketchBaseProps = {
  color?: string
  strokeWidth?: number
  delay?: number
  duration?: number
  once?: boolean
  className?: string
  style?: React.CSSProperties
}

const drawEase = [0.22, 1, 0.36, 1] as const

/** Hand-drawn wavy underline. Place inside a `relative` parent. */
export function SketchUnderline({
  color = "currentColor",
  strokeWidth = 3,
  delay = 0,
  duration = 1.2,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn(
        "absolute left-[-2%] right-[-2%] bottom-[-0.35em] h-[0.5em] w-[104%] pointer-events-none",
        className,
      )}
      style={style}
    >
      <motion.path
        d="M 4 12 C 60 4, 120 18, 180 10 S 300 2, 396 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
      <motion.path
        d="M 8 16 C 80 10, 160 20, 240 14 S 340 8, 392 16"
        stroke={color}
        strokeWidth={strokeWidth * 0.55}
        strokeLinecap="round"
        strokeOpacity="0.55"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: duration * 0.9, delay: delay + 0.25, ease: drawEase }}
      />
    </svg>
  )
}

/** Hand-drawn imperfect oval around a target element (position parent `relative`). */
export function SketchCircle({
  color = "currentColor",
  strokeWidth = 2.5,
  delay = 0,
  duration = 1.8,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 220 90"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn(
        "absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none overflow-visible",
        className,
      )}
      style={style}
    >
      <motion.path
        d="M 110 6 C 38 8, 8 30, 12 46 C 18 68, 66 82, 116 80 C 178 78, 208 58, 206 38 C 204 16, 170 2, 110 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

/** Scribble-style highlight behind inline text. */
export function ScribbleHighlight({
  color = "currentColor",
  strokeWidth = 16,
  delay = 0,
  duration = 1.4,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn(
        "absolute -z-10 left-[-3%] right-[-3%] top-[20%] w-[106%] h-[80%] pointer-events-none",
        className,
      )}
      style={style}
    >
      <motion.path
        d="M 8 20 C 60 12, 130 30, 200 16 S 300 32, 392 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeOpacity="0.35"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

type SketchArrowProps = SketchBaseProps & {
  curve?: number
  flipX?: boolean
  flipY?: boolean
}

/** Hand-drawn curved arrow. Curve controls the bow of the path. */
export function SketchArrow({
  color = "currentColor",
  strokeWidth = 2.5,
  delay = 0,
  duration = 1.1,
  once = true,
  curve = 1,
  flipX = false,
  flipY = false,
  className,
  style,
}: SketchArrowProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  const cy = 50 - 40 * curve
  return (
    <svg
      ref={ref}
      viewBox="0 0 140 100"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("pointer-events-none overflow-visible", className)}
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        ...style,
      }}
    >
      <motion.path
        d={`M 10 15 Q 60 ${cy}, 118 78`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
      <motion.path
        d="M 118 78 L 100 72 M 118 78 L 110 58"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.45, delay: delay + duration * 0.8, ease: drawEase }}
      />
    </svg>
  )
}

/** Four-pointed sparkle, pops in with a rotate + scale. */
export function SketchStar({
  color = "currentColor",
  strokeWidth = 2,
  delay = 0,
  duration = 0.9,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 40 40"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("pointer-events-none", className)}
      style={style}
      initial={{ scale: 0, rotate: -60, opacity: 0 }}
      animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay }}
    >
      <motion.path
        d="M 20 3 Q 22 18, 37 20 Q 22 22, 20 37 Q 18 22, 3 20 Q 18 18, 20 3 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={color}
        fillOpacity="0.12"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration, delay: delay + 0.1, ease: drawEase }}
      />
    </motion.svg>
  )
}

/** Wavy rectangle border that draws around a card. */
export function SketchBox({
  color = "currentColor",
  strokeWidth = 2,
  delay = 0,
  duration = 2,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      style={style}
    >
      <motion.path
        d="M 10 8 C 110 4, 220 12, 390 6 C 394 60, 390 130, 394 194 C 280 198, 160 190, 8 196 C 4 140, 6 78, 10 8 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

/** Full-width wavy divider. */
export function SketchSquiggle({
  color = "currentColor",
  strokeWidth = 2.5,
  delay = 0,
  duration = 1.4,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("w-full h-4 pointer-events-none", className)}
      style={style}
    >
      <motion.path
        d="M 2 10 Q 25 2, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 T 350 10 T 398 10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

/** Hand-drawn check mark. */
export function SketchCheck({
  color = "currentColor",
  strokeWidth = 3,
  delay = 0,
  duration = 0.6,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 32 32"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <motion.path
        d="M 5 17 L 13 25 L 28 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

/** Hand-drawn vertical squiggly line — useful as a timeline rail. */
export function SketchVerticalLine({
  color = "currentColor",
  strokeWidth = 2.5,
  delay = 0,
  duration = 2.5,
  once = true,
  className,
  style,
}: SketchBaseProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-80px" })
  return (
    <svg
      ref={ref}
      viewBox="0 0 20 800"
      preserveAspectRatio="none"
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <motion.path
        d="M 10 4 Q 14 80, 10 160 T 10 320 T 10 480 T 10 640 T 10 796"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}

/** Dotted/dashed sketch path — decorative trail. */
export function SketchDottedPath({
  color = "currentColor",
  strokeWidth = 2,
  delay = 0,
  duration = 1.6,
  once = true,
  className,
  style,
  d = "M 10 50 Q 60 10, 110 50 T 210 50",
  viewBox = "0 0 220 100",
}: SketchBaseProps & { d?: string; viewBox?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      filter="url(#sketch-rough)"
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="1 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration, delay, ease: drawEase }}
      />
    </svg>
  )
}
