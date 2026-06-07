"use client"

/**
 * CinematicIntro — a full-screen "intro video" that plays on first load.
 *
 * Aesthetic: bold / kinetic / "fire" — near-black canvas, red→orange gradient
 * typography, oversized cycling words that build to the line "speaks louder
 * than a résumé", a live loading counter (00→100), then a curtain-lift reveal
 * into the site. Designed to make the portfolio feel like a promo reel.
 *
 * Behaviour:
 *  - Plays once per browser session (sessionStorage guard).
 *  - Locks scroll while playing, restores on reveal.
 *  - Skippable (button + Esc) and respects prefers-reduced-motion.
 */

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { GeometryCanvas } from "@/components/geometry-canvas"

interface CinematicIntroProps {
  name?: string
  role?: string
  /** The mega words that flash one-by-one before the punch line. */
  words?: string[]
}

const SESSION_KEY = "akasha:intro:played"

// Module-scoped so the timeline survives React Strict Mode's dev remount
// (resumes from the same origin instead of restarting / dying).
let introStartedAt: number | null = null

// Fire palette — independent of the global theme tokens so the intro reads the
// same in light/dark and matches the bold reference look.
const FIRE = {
  ink: "#07060a",
  ember: "#ff4d2e",
  flame: "#ff7a18",
  gold: "#ffd24a",
  ash: "#f5ede6",
}
const GRADIENT = `linear-gradient(100deg, ${FIRE.ember} 0%, ${FIRE.flame} 45%, ${FIRE.gold} 100%)`

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_IO: [number, number, number, number] = [0.65, 0, 0.35, 1]

export function CinematicIntro({
  name = "Akash Vishwakarma",
  role = "Full-Stack Product Engineer",
  words = ["DESIGN.", "BUILD.", "SHIP."],
}: CinematicIntroProps) {
  // The overlay is SSR-rendered (visible by default) so the intro covers the
  // first paint with no flash of the page beneath. This is safe because every
  // initial value below is identical on the server and the first client render.
  // `motionOk` gates the looping glow animation; defaults on and is narrowed in
  // the timeline effect for users who prefer reduced motion.
  const [motionOk, setMotionOk] = useState(true)

  const [visible, setVisible] = useState(true)
  const [scene, setScene] = useState(-1) // -1 = pre, 0..n-1 = mega words
  const [phase, setPhase] = useState<"words" | "punch" | "name">("words")
  const [count, setCount] = useState(0)

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* ignore */
    }
    setVisible(false)
  }, [])

  // ---- the timeline: one rAF loop derived from a shared start timestamp.
  // Driving everything from elapsed time (rather than chained timeouts) makes
  // it resilient to React Strict Mode's mount→unmount→mount in dev: the loop is
  // cancelled on cleanup and simply resumes from the same `introStartedAt`.
  useEffect(() => {
    if (typeof window === "undefined") return

    // Plays on every full page load. (To make it play only once per session,
    // re-enable the sessionStorage guard below.)
    // if (sessionStorage.getItem(SESSION_KEY) === "1") {
    //   setInstant(true); setVisible(false); return
    // }

    // Read the motion preference authoritatively here (the value is reliable by
    // the time effects run, unlike during render).
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    setMotionOk(!reduce)

    // Timeline (ms). Reduced motion collapses to a short hold + reveal.
    const WORD_MS = 620
    const WORD_START = 350
    const PUNCH_AT = WORD_START + words.length * WORD_MS
    const NAME_AT = PUNCH_AT + 1150
    const END_AT = reduce ? 900 : NAME_AT + 950
    const COUNT_OVER = reduce ? 700 : NAME_AT

    if (introStartedAt === null) introStartedAt = performance.now()
    const startedAt = introStartedAt

    // Track last-pushed values so we only setState on a real change (rAF runs
    // ~60×/s; spamming identical phase/scene updates is what wedged the swap).
    let lastCount = -1
    let lastPhase = ""
    let lastScene = -2
    let raf = 0
    const loop = (now: number) => {
      const e = now - startedAt

      const p = Math.min(1, e / COUNT_OVER)
      const c = Math.round((1 - Math.pow(1 - p, 2.2)) * 100)
      if (c !== lastCount) {
        lastCount = c
        setCount(c)
      }

      let nextPhase: "words" | "punch" | "name" = "name"
      let nextScene = -1
      if (reduce) {
        nextPhase = "name"
      } else if (e < PUNCH_AT) {
        nextPhase = "words"
        nextScene = e < WORD_START ? -1 : Math.min(words.length - 1, Math.floor((e - WORD_START) / WORD_MS))
      } else if (e < NAME_AT) {
        nextPhase = "punch"
      }
      if (nextPhase !== lastPhase) {
        lastPhase = nextPhase
        setPhase(nextPhase)
      }
      if (nextScene !== lastScene) {
        lastScene = nextScene
        setScene(nextScene)
      }

      if (e >= END_AT) {
        finish()
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll lock — tied to visibility so it always restores, even under Strict Mode.
  useEffect(() => {
    if (!visible) return
    const html = document.documentElement.style.overflow
    const body = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = html
      document.body.style.overflow = body
    }
  }, [visible])

  // Esc to skip
  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [visible, finish])

  const firstName = name.trim().split(/\s+/)[0]?.toUpperCase() ?? "HELLO"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cinematic-intro"
          className="z-200 grid place-items-center overflow-hidden grain select-none"
          style={{
            // `.grain` (unlayered CSS) forces position:relative and would beat
            // Tailwind's layered `.fixed` utility — so pin it inline instead.
            position: "fixed",
            inset: 0,
            backgroundColor: FIRE.ink,
            color: FIRE.ash,
          }}
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 1.0, ease: EASE_IO },
          }}
          aria-label="Intro animation"
          role="dialog"
        >
          {/* Animated fire glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(60% 50% at 50% 62%, ${FIRE.ember}33, transparent 70%), radial-gradient(40% 35% at 50% 70%, ${FIRE.flame}22, transparent 75%)`,
            }}
            animate={motionOk ? { opacity: [0.55, 1, 0.7], scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Advanced 3D geometry animation — the "intro video" centerpiece */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <GeometryCanvas className="h-full w-full" density={180} />
          </motion.div>

          {/* Faint kinetic backdrop word-strip (CSS `.marquee` self-disables
              under prefers-reduced-motion, so it's always rendered). */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-[0.04]">
            <div
              className="marquee whitespace-nowrap font-black uppercase leading-none tracking-tighter"
              style={{ fontSize: "clamp(6rem, 22vw, 18rem)" }}
            >
              {"PORTFOLIO · RÉSUMÉ · ".repeat(6)}
            </div>
          </div>

          {/* Top bar */}
          <motion.div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-5 sm:px-8 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em]"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ color: `${FIRE.ash}cc` }}
          >
            <span>{name}</span>
            <span className="hidden sm:inline" style={{ color: FIRE.flame }}>
              PORTFOLIO ’26
            </span>
          </motion.div>

          {/* Center stage — children are absolutely stacked so rapid swaps
              crossfade in place (no mode="wait" queue to wedge). */}
          <div className="absolute inset-0 z-10">
            <AnimatePresence>
              {phase === "words" && scene >= 0 && (
                <motion.div
                  key={`w-${scene}`}
                  className="absolute inset-0 flex items-center justify-center px-6 text-center font-black uppercase leading-[0.9] tracking-tighter"
                  style={{
                    fontSize: "clamp(3.5rem, 17vw, 12rem)",
                    backgroundImage: GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                  initial={{ opacity: 0, y: 70, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -55, filter: "blur(10px)" }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  {words[scene]}
                </motion.div>
              )}

              {phase === "punch" && (
                <motion.div
                  key="punch"
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -45, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <span
                    className="font-black uppercase leading-[0.86] tracking-tighter"
                    style={{
                      fontSize: "clamp(3rem, 15vw, 11rem)",
                      backgroundImage: GRADIENT,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    SPEAKS
                    <br />
                    LOUDER
                  </span>
                  <motion.span
                    className="mt-5 text-sm sm:text-lg md:text-xl font-medium tracking-tight"
                    style={{ color: `${FIRE.ash}d0` }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT }}
                  >
                    than any résumé.&nbsp;
                    <span aria-hidden>🔥</span>
                  </motion.span>
                </motion.div>
              )}

              {phase === "name" && (
                <motion.div
                  key="name"
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                >
                  <Reveal>
                    <span
                      className="font-black uppercase leading-[0.85] tracking-tighter"
                      style={{
                        fontSize: "clamp(3.5rem, 18vw, 13rem)",
                        backgroundImage: GRADIENT,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {firstName}
                    </span>
                  </Reveal>
                  <motion.span
                    className="mt-4 text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.32em]"
                    style={{ color: `${FIRE.ash}aa` }}
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    animate={{ opacity: 1, letterSpacing: "0.32em" }}
                    transition={{ delay: 0.25, duration: 0.7, ease: EASE_OUT }}
                  >
                    {role}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom bar: progress + counter */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 sm:pb-7">
            <div className="mb-3 h-px w-full overflow-hidden" style={{ backgroundColor: `${FIRE.ash}1a` }}>
              <motion.div
                className="h-full origin-left"
                style={{ background: GRADIENT, scaleX: count / 100 }}
              />
            </div>
            <div className="flex items-end justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em]" style={{ color: `${FIRE.ash}99` }}>
              <span>Loading experience</span>
              <span
                className="font-black tabular-nums"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
                  lineHeight: 1,
                  color: FIRE.ash,
                }}
              >
                {String(count).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Skip */}
          <button
            onClick={finish}
            className="absolute right-4 top-16 z-20 rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors sm:right-8 sm:top-16"
            style={{ borderColor: `${FIRE.ash}33`, color: `${FIRE.ash}99` }}
          >
            Skip ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Clip-up reveal used for the name lockup. */
function Reveal({ children }: { children: React.ReactNode }) {
  const variants: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.8, ease: EASE_OUT } },
  }
  return (
    <span className="block overflow-hidden">
      <motion.span className="block" variants={variants} initial="hidden" animate="show">
        {children}
      </motion.span>
    </span>
  )
}
