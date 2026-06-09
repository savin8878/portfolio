"use client"

/**
 * CinematicIntro — a full-screen loading reveal that plays on first load.
 *
 * Aesthetic: bold / kinetic "fire". Near-black canvas, a LETTER PUZZLE where
 * the name materialises out of scrambling glyphs and locks in letter-by-letter
 * as a loading counter climbs 00→100, then a curtain-lift reveal into the site.
 *
 * Behaviour:
 *  - Plays on every full page load (re-enable the sessionStorage guard to make
 *    it once-per-session).
 *  - Locks scroll while playing, restores on reveal.
 *  - Skippable (button + Esc) and respects prefers-reduced-motion.
 */

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface CinematicIntroProps {
  name?: string
  role?: string
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

// Glyphs the unsolved letters cycle through while the puzzle resolves.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$*/<>{}=+"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_IO: [number, number, number, number] = [0.65, 0, 0.35, 1]

export function CinematicIntro({
  name = "Akash Vishwakarma",
  role = "Full-Stack Product Engineer",
}: CinematicIntroProps) {
  // The puzzle target: the first name in caps (single word reads cleanest).
  const target = (name.trim().split(/\s+/)[0] || name).toUpperCase()

  // The overlay is SSR-rendered (visible by default) so the intro covers the
  // first paint with no flash of the page beneath. Initial values are identical
  // on server + first client render (no scramble yet -> no hydration mismatch).
  const [motionOk, setMotionOk] = useState(true)
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)
  const [display, setDisplay] = useState(target)
  const [locked, setLocked] = useState(0)
  const targetLen = target.length

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* ignore */
    }
    setVisible(false)
  }, [])

  // ---- the timeline: one rAF loop derived from a shared start timestamp, so it
  // is resilient to React Strict Mode's mount→unmount→mount in dev.
  useEffect(() => {
    if (typeof window === "undefined") return

    // Plays on every full page load. To play once per session, uncomment:
    // if (sessionStorage.getItem(SESSION_KEY) === "1") { setVisible(false); return }

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    setMotionOk(!reduce)

    // Timeline (ms).
    const COUNT_OVER = reduce ? 500 : 2400 // counter (and puzzle) resolve window
    const HOLD = reduce ? 250 : 850 // dwell on the solved name before reveal
    const END_AT = COUNT_OVER + HOLD

    if (introStartedAt === null) introStartedAt = performance.now()
    const startedAt = introStartedAt

    let lastCount = -1
    let lastLocked = -1
    let lastScramble = 0
    let raf = 0

    const loop = (now: number) => {
      const e = now - startedAt

      // eased counter 0 → 100
      const p = Math.min(1, e / COUNT_OVER)
      const c = Math.round((1 - Math.pow(1 - p, 2.2)) * 100)
      if (c !== lastCount) {
        lastCount = c
        setCount(c)
      }

      // letters lock left → right as the counter climbs
      const lk = reduce ? targetLen : Math.min(targetLen, Math.floor((c / 100) * targetLen))
      if (lk !== lastLocked) {
        lastLocked = lk
        setLocked(lk)
      }

      // flicker the unsolved glyphs (throttled so it reads as a shuffle)
      if (reduce) {
        setDisplay(target)
      } else if (now - lastScramble > 70) {
        lastScramble = now
        let s = ""
        for (let i = 0; i < targetLen; i++) {
          s += i < lk ? target[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        setDisplay(s)
      }

      if (e >= END_AT) {
        setCount(100)
        setLocked(targetLen)
        setDisplay(target)
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

  const solved = locked >= targetLen

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
              background: `radial-gradient(60% 50% at 50% 56%, ${FIRE.ember}33, transparent 70%), radial-gradient(40% 35% at 50% 64%, ${FIRE.flame}22, transparent 75%)`,
            }}
            animate={motionOk ? { opacity: [0.55, 1, 0.7], scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

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
              PORTFOLIO &rsquo;26
            </span>
          </motion.div>

          {/* Center stage — the letter puzzle. Each letter is a FIXED-WIDTH cell
              (so swapping glyphs never shifts the word) with its own gradient
              (so per-letter transforms are safe), and resolves from a soft,
              blurred, scaled-down state into sharp focus — a smooth decode. */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
            <div
              className="flex justify-center font-black uppercase leading-[0.85]"
              style={{ fontSize: "clamp(3.5rem, 16vw, 11rem)" }}
              aria-label={target}
            >
              {display.split("").map((ch, i) => {
                const isLocked = i < locked
                return (
                  <span
                    key={i}
                    aria-hidden
                    className="inline-block text-center"
                    style={{
                      width: "0.72em",
                      backgroundImage: GRADIENT,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      opacity: isLocked ? 1 : 0.22,
                      filter: isLocked ? "blur(0px)" : "blur(6px)",
                      transform: isLocked
                        ? "translateY(0) scale(1)"
                        : "translateY(0.06em) scale(0.9)",
                      transition:
                        "opacity 0.55s ease, filter 0.55s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {ch}
                  </span>
                )
              })}
            </div>

            {/* role — fades in once the name is solved */}
            <span
              className="mt-6 block font-mono text-xs uppercase sm:text-sm"
              style={{
                color: `${FIRE.ash}aa`,
                opacity: solved ? 1 : 0,
                letterSpacing: solved ? "0.32em" : "0.5em",
                transition: "opacity 0.6s ease 0.1s, letter-spacing 0.7s ease 0.1s",
              }}
            >
              {role}
            </span>
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
