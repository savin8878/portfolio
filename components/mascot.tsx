"use client"

/**
 * Mascot — an animated, flat-illustration developer character (the site's
 * cartoon avatar) that floats, blinks, waves, head-tracks the cursor, and
 * "speaks" via a typewriter speech bubble that narrates the supplied lines.
 *
 * Pure SVG + framer-motion: crisp at any size, fully themed, no asset needed.
 */

import { useEffect, useRef, useState } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"

interface MascotProps {
  lines: string[]
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
}

function useTypewriter(lines: string[], typeMs = 40, holdMs = 1600) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState("")
  const key = lines.join("")

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let i = 0
    const current = lines[idx % lines.length] ?? ""

    const step = () => {
      if (cancelled) return
      if (i <= current.length) {
        setText(current.slice(0, i))
        i += 1
        timer = setTimeout(step, typeMs)
      } else {
        timer = setTimeout(() => {
          if (!cancelled) setIdx((n) => (n + 1) % lines.length)
        }, holdMs)
      }
    }
    timer = setTimeout(step, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, key, typeMs, holdMs])

  return text
}

export function Mascot({ lines, parallaxX, parallaxY }: MascotProps) {
  const text = useTypewriter(lines)

  // head follows the cursor a little
  const headRotate = useTransform(parallaxX, (v) => v * 7)
  const headX = useTransform(parallaxX, (v) => v * 10)
  const headY = useTransform(parallaxY, (v) => v * 8)
  const pupilX = useTransform(parallaxX, (v) => v * 5)
  const pupilY = useTransform(parallaxY, (v) => v * 4)

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-0 z-20 w-[min(20rem,82%)] -translate-x-1/2"
      >
        <div
          className="relative rounded-2xl px-5 py-4 text-center backdrop-blur-xl"
          style={{
            background: "rgba(20,16,24,0.72)",
            border: "1px solid rgba(255,122,24,0.30)",
            boxShadow: "0 20px 60px -20px rgba(255,90,30,0.5)",
          }}
        >
          <p
            className="min-h-[2.75rem] text-sm font-medium leading-snug sm:text-base"
            style={{ color: "#f5ede6" }}
          >
            {text}
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="ml-0.5 inline-block"
              style={{ color: "#ff7a18" }}
            >
              |
            </motion.span>
          </p>
          {/* tail */}
          <div
            className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45"
            style={{
              background: "rgba(20,16,24,0.72)",
              borderRight: "1px solid rgba(255,122,24,0.30)",
              borderBottom: "1px solid rgba(255,122,24,0.30)",
            }}
          />
        </div>
      </motion.div>

      {/* character */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pt-24"
      >
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
          <svg viewBox="0 0 420 470" className="mx-auto w-full" role="img" aria-label="Animated developer mascot">
            <defs>
              <linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2b2e3d" />
                <stop offset="1" stopColor="#181a24" />
              </linearGradient>
              <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f0bd95" />
                <stop offset="1" stopColor="#e0a87e" />
              </linearGradient>
              <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1b1c24" />
                <stop offset="1" stopColor="#0e0f15" />
              </linearGradient>
              <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ff7a18" stopOpacity="0.32" />
                <stop offset="1" stopColor="#ff7a18" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* glow halo */}
            <ellipse cx="210" cy="250" rx="180" ry="180" fill="url(#halo)" />
            {/* ground shadow */}
            <ellipse cx="210" cy="452" rx="120" ry="16" fill="#000" opacity="0.35" />

            {/* ---- body / hoodie ---- */}
            <path d="M92,470 C92,360 120,298 210,298 C300,298 328,360 328,470 Z" fill="url(#hoodie)" />
            {/* hood collar */}
            <path d="M150,318 C170,300 250,300 270,318 C250,332 170,332 150,318 Z" fill="#14151d" opacity="0.85" />
            {/* zipper + drawstrings */}
            <line x1="210" y1="322" x2="210" y2="470" stroke="#14151d" strokeWidth="4" opacity="0.7" />
            <line x1="200" y1="320" x2="196" y2="372" stroke="#ff7a18" strokeWidth="5" strokeLinecap="round" />
            <line x1="220" y1="320" x2="224" y2="372" stroke="#ff7a18" strokeWidth="5" strokeLinecap="round" />
            <circle cx="196" cy="376" r="4" fill="#ffd24a" />
            <circle cx="224" cy="376" r="4" fill="#ffd24a" />

            {/* ---- resting right arm (viewer right) ---- */}
            <path d="M300,330 C326,350 332,400 322,440" stroke="url(#hoodie)" strokeWidth="40" strokeLinecap="round" fill="none" />

            {/* ---- head (parallax) ---- */}
            <motion.g
              style={{
                rotate: headRotate,
                x: headX,
                y: headY,
                transformBox: "fill-box",
                transformOrigin: "center bottom",
              }}
            >
              {/* neck */}
              <rect x="192" y="262" width="36" height="50" rx="16" fill="url(#skin)" />
              {/* ears */}
              <ellipse cx="132" cy="206" rx="15" ry="21" fill="url(#skin)" />
              <ellipse cx="288" cy="206" rx="15" ry="21" fill="url(#skin)" />
              {/* face */}
              <ellipse cx="210" cy="198" rx="80" ry="86" fill="url(#skin)" />
              {/* hair */}
              <path d="M132,178 C130,118 165,90 210,90 C255,90 290,118 288,178 C278,150 252,126 210,126 C168,126 150,150 132,178 Z" fill="#2f2620" />
              {/* cheeks */}
              <ellipse cx="166" cy="222" rx="12" ry="7" fill="#ff7a18" opacity="0.18" />
              <ellipse cx="254" cy="222" rx="12" ry="7" fill="#ff7a18" opacity="0.18" />
              {/* eyebrows */}
              <rect x="166" y="168" width="36" height="7" rx="3.5" fill="#3a2c22" />
              <rect x="218" y="168" width="36" height="7" rx="3.5" fill="#3a2c22" />
              {/* eyes (blink) */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
                transition={{ duration: 4, times: [0, 0.9, 0.94, 0.98, 1], repeat: Infinity }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <ellipse cx="184" cy="194" rx="16" ry="18" fill="#fff" />
                <ellipse cx="236" cy="194" rx="16" ry="18" fill="#fff" />
                <motion.g style={{ x: pupilX, y: pupilY }}>
                  <circle cx="186" cy="196" r="7.5" fill="#2a2018" />
                  <circle cx="238" cy="196" r="7.5" fill="#2a2018" />
                  <circle cx="189" cy="192" r="2.5" fill="#fff" />
                  <circle cx="241" cy="192" r="2.5" fill="#fff" />
                </motion.g>
              </motion.g>
              {/* nose */}
              <ellipse cx="210" cy="214" rx="4.5" ry="7" fill="#d79a70" />
              {/* mouth (gentle talk) */}
              <motion.path
                animate={{ d: ["M190,230 Q210,248 230,230", "M192,231 Q210,240 228,231"] }}
                transition={{ duration: 0.45, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                stroke="#7a4733"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* ---- headphones (over the head group so they track too) ---- */}
              <path d="M120,196 C128,108 292,108 300,196" stroke="#14151d" strokeWidth="15" strokeLinecap="round" fill="none" />
              <rect x="106" y="172" width="38" height="74" rx="17" fill="url(#cup)" />
              <rect x="276" y="172" width="38" height="74" rx="17" fill="url(#cup)" />
              <circle cx="125" cy="209" r="10" fill="none" stroke="#ff7a18" strokeWidth="3.5" />
              <circle cx="295" cy="209" r="10" fill="none" stroke="#ff7a18" strokeWidth="3.5" />
            </motion.g>

            {/* ---- waving left arm (viewer left), over body ---- */}
            <path d="M120,330 C96,316 86,288 92,262" stroke="url(#hoodie)" strokeWidth="38" strokeLinecap="round" fill="none" />
            <motion.g
              animate={{ rotate: [0, 16, -4, 16, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "right bottom" }}
            >
              {/* forearm */}
              <path d="M92,262 C86,228 82,200 80,178" stroke="url(#hoodie)" strokeWidth="34" strokeLinecap="round" fill="none" />
              {/* hand */}
              <circle cx="80" cy="168" r="21" fill="url(#skin)" />
              <rect x="62" y="150" width="9" height="22" rx="4.5" fill="url(#skin)" />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
