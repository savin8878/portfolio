"use client"

/**
 * ScrollProjectsSection — a pinned, scroll-driven "deck → grid" reveal.
 *
 * The cards live in their real responsive grid; we measure each slot, then on
 * scroll-start offset them back into a tilted, overlapping cluster and
 * interpolate them into their grid positions as the user scrolls. Smooth,
 * staggered, and resolution-independent (only a transform is animated, layout
 * is real CSS grid). Modeled on the Shakira-Yanti reference.
 */

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/db"
import { Reveal, Parallax } from "@/components/anim"

const GRADIENTS = [
  "from-violet-600 via-indigo-500 to-blue-600",
  "from-rose-500 via-pink-500 to-purple-600",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
]
// Per-card cluster scatter (px) + fan rotation (deg) at scroll-start.
const SCATTER: [number, number][] = [
  [-46, -26],
  [42, -34],
  [-30, 30],
  [50, 22],
]
const ROT = [-9, 7, -6, 8]

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3))
const seg = (p: number, a: number, b: number) =>
  ease(Math.min(1, Math.max(0, (p - a) / (b - a))))

interface Offset {
  dx: number
  dy: number
  rot: number
}

function DeckCard({
  project,
  index,
  progress,
  offset,
  ready,
  registerRef,
}: {
  project: Project
  index: number
  progress: MotionValue<number>
  offset: Offset
  ready: boolean
  registerRef: (el: HTMLElement | null) => void
}) {
  const start = index * 0.05
  const end = Math.min(0.98, 0.62 + index * 0.07)

  const x = useTransform(progress, (p) => offset.dx * (1 - seg(p, start, end)))
  const y = useTransform(progress, (p) => offset.dy * (1 - seg(p, start, end)))
  const rotate = useTransform(progress, (p) => offset.rot * (1 - seg(p, start, end)))
  const scale = useTransform(progress, (p) => 0.8 + 0.2 * seg(p, start, end))

  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.div
      ref={registerRef}
      style={{ x, y, rotate, scale, zIndex: index, opacity: ready ? 1 : 0 }}
      className="group relative will-change-transform"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border transition-colors duration-300"
        style={{
          background: "rgba(20,18,26,0.6)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 30px 70px -30px rgba(0,0,0,0.7)",
        }}
      >
        {/* visual */}
        <div className="relative aspect-16/10 w-full overflow-hidden">
          {project.featured_image ? (
            <Image
              src={project.featured_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 45vw"
            />
          ) : (
            <>
              <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
              <div
                className="absolute -right-4 -bottom-8 select-none font-black leading-none tracking-tighter text-white/15"
                style={{ fontSize: "9rem" }}
              >
                {project.title.charAt(0)}
              </div>
            </>
          )}
          {/* hover chip */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span
              className="translate-y-2 rounded-full px-4 py-1.5 text-xs font-semibold opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ background: "rgba(10,8,12,0.7)", color: "#f5ede6" }}
            >
              View Project
            </span>
          </div>
        </div>

        {/* meta */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight" style={{ color: "#f5ede6" }}>
              {project.title}
            </h3>
            <p className="truncate text-xs" style={{ color: "rgba(245,237,230,0.55)" }}>
              {project.short_description}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold"
            style={{ color: "#ff7a18" }}
          >
            Peek Inside <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

interface ScrollProjectsSectionProps {
  projects: Project[]
  content?: Record<string, unknown>
}

export function ScrollProjectsSection({ projects, content }: ScrollProjectsSectionProps) {
  const cards = projects.slice(0, 4)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardEls = useRef<(HTMLElement | null)[]>([])
  const [offsets, setOffsets] = useState<Offset[]>([])
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current
      if (!grid) return
      const cx = grid.clientWidth / 2
      const cy = grid.clientHeight / 2
      const offs = cardEls.current.slice(0, cards.length).map((el, i) => {
        if (!el) return { dx: 0, dy: 0, rot: 0 }
        const ccx = el.offsetLeft + el.offsetWidth / 2
        const ccy = el.offsetTop + el.offsetHeight / 2
        const s = SCATTER[i % SCATTER.length]
        return { dx: cx - ccx + s[0], dy: cy - ccy + s[1], rot: ROT[i % ROT.length] }
      })
      setOffsets(offs)
      setReady(true)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [cards.length])

  if (cards.length === 0) return null

  const label = (content?.label as string) || "Featured Work"
  const title = (content?.title as string) || "Selected"
  const highlight = (content?.title_highlight as string) || "case studies"

  return (
    <section ref={wrapperRef} data-scroll-deck className="relative" style={{ height: "240vh", backgroundColor: "#08070b" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* ambient glow — drifts for depth */}
        <Parallax speed={60} className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(50% 40% at 50% 30%, rgba(255,122,24,0.10), transparent 70%)" }}
          />
        </Parallax>
        {/* counter-drifting secondary glow for layered parallax */}
        <Parallax speed={-40} className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(40% 35% at 70% 80%, rgba(255,77,46,0.08), transparent 70%)" }}
          />
        </Parallax>

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-16 sm:px-6 lg:px-8">
          {/* heading */}
          <div className="shrink-0 text-center">
            <Reveal from="top" distance={32}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "rgba(255,122,24,0.10)", border: "1px solid rgba(255,122,24,0.22)", color: "#ffd24a" }}
              >
                {label}
              </span>
            </Reveal>
            <Reveal from="zoom" delay={0.08} duration={0.9}>
              <h2
                className="mt-4 font-black uppercase leading-[0.95] tracking-tighter"
                style={{ color: "#f5ede6", fontSize: "clamp(2rem,5vw,3.5rem)" }}
              >
                {title}{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(100deg,#ff4d2e,#ff7a18 50%,#ffd24a)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {highlight}
                </span>
              </h2>
            </Reveal>
          </div>

          {/* the deck → grid */}
          <div
            ref={gridRef}
            className="relative mt-8 grid min-h-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2 sm:grid-rows-2"
          >
            {cards.map((p, i) => (
              <DeckCard
                key={p.id}
                project={p}
                index={i}
                progress={scrollYProgress}
                offset={offsets[i] ?? { dx: 0, dy: 0, rot: 0 }}
                ready={ready}
                registerRef={(el) => {
                  cardEls.current[i] = el
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
