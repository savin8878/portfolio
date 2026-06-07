"use client"

/**
 * Shared motion toolkit — layered, multi-directional, 3D-feeling reveals.
 *
 *  <Reveal from="left">…</Reveal>            one element slides/rotates in on scroll
 *  <Stagger><StaggerItem/>…</Stagger>        layered children, staggered, per-item direction
 *  <Parallax speed={40}>…</Parallax>         scroll-linked depth (background/foreground drift)
 *  <TiltCard>…</TiltCard>                     pointer-driven 3D tilt
 *
 * All reveals use real 3D (rotateX/rotateY + transformPerspective) so motion
 * reads as depth, not a flat fade. Reduced-motion collapses to a plain fade.
 */

import {
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export type RevealFrom =
  | "bottom"
  | "top"
  | "left"
  | "right"
  | "zoom"
  | "flip-up"
  | "flip-left"

function hiddenState(from: RevealFrom, distance: number, blur: boolean) {
  const base: Record<string, number | string> = { opacity: 0 }
  if (blur) base.filter = "blur(12px)"
  switch (from) {
    case "bottom":
      return { ...base, y: distance, rotateX: -10 }
    case "top":
      return { ...base, y: -distance, rotateX: 10 }
    case "left":
      return { ...base, x: -distance, rotateY: -14 }
    case "right":
      return { ...base, x: distance, rotateY: 14 }
    case "zoom":
      return { ...base, scale: 0.82 }
    case "flip-up":
      return { ...base, rotateX: 50, y: distance * 0.5 }
    case "flip-left":
      return { ...base, rotateY: 50, x: distance * 0.5 }
  }
}

const SHOWN = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  rotateY: 0,
  filter: "blur(0px)",
}

interface RevealProps {
  children: ReactNode
  from?: RevealFrom
  distance?: number
  delay?: number
  duration?: number
  once?: boolean
  blur?: boolean
  className?: string
  style?: CSSProperties
}

export function Reveal({
  children,
  from = "bottom",
  distance = 48,
  delay = 0,
  duration = 0.85,
  once = true,
  blur = true,
  className,
  style,
}: RevealProps) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : hiddenState(from, distance, blur),
    show: { ...SHOWN, transition: { duration, ease: EASE, delay } },
  }
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1100, ...style }}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: ReactNode
  stagger?: number
  delay?: number
  once?: boolean
  className?: string
  style?: CSSProperties
}

export function Stagger({
  children,
  stagger = 0.1,
  delay = 0,
  once = true,
  className,
  style,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  from?: RevealFrom
  distance?: number
  duration?: number
  blur?: boolean
  className?: string
  style?: CSSProperties
}

export function StaggerItem({
  children,
  from = "bottom",
  distance = 48,
  duration = 0.8,
  blur = true,
  className,
  style,
}: StaggerItemProps) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : hiddenState(from, distance, blur),
    show: { ...SHOWN, transition: { duration, ease: EASE } },
  }
  return (
    <motion.div className={className} style={{ transformPerspective: 1100, ...style }} variants={variants}>
      {children}
    </motion.div>
  )
}

interface ParallaxProps {
  children: ReactNode
  /** px of drift across the viewport pass (positive = moves up as you scroll). */
  speed?: number
  className?: string
  style?: CSSProperties
}

export function Parallax({ children, speed = 40, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  return (
    <motion.div ref={ref} style={reduce ? style : { y, ...style }} className={className}>
      {children}
    </motion.div>
  )
}

interface TiltCardProps {
  children: ReactNode
  /** max tilt in degrees */
  max?: number
  className?: string
  style?: CSSProperties
}

export function TiltCard({ children, max = 9, className, style }: TiltCardProps) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 16 })
  const sry = useSpring(ry, { stiffness: 150, damping: 16 })

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </motion.div>
  )
}
