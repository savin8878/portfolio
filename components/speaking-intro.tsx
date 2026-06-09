"use client"

/**
 * SpeakingIntro — a cinematic, *spoken* portfolio introduction.
 *
 * Shows the tagline as an idle caption. On "Play intro" it narrates the intro
 * script aloud using the browser's built-in speech synthesis (no API/keys) and
 * crossfades each line in as a subtitle, in sync with the voice (each caption
 * advances on the utterance's `onend`). A live equalizer + progress dots show
 * it's talking. If speech synthesis isn't available it falls back to timed
 * captions, so the cinematic reveal still plays. All lines are real, visible
 * text, so the content is accessible whether or not it's spoken.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Play, Square } from "lucide-react"

interface SpeakingIntroProps {
  /** caption shown when idle (the tagline) */
  idle: string
  /** narration script, one caption per line */
  lines: string[]
  /** short impact-metric chips */
  metrics?: string[]
}

export function SpeakingIntro({ idle, lines, metrics = [] }: SpeakingIntroProps) {
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(-1)
  const [canSpeak, setCanSpeak] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const cancelled = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    setCanSpeak(true)
    const pick = () => {
      const vs = window.speechSynthesis.getVoices()
      voiceRef.current =
        vs.find((v) => /^en/i.test(v.lang) && /google|natural|daniel|david|aaron|samantha|mark/i.test(v.name)) ||
        vs.find((v) => /^en/i.test(v.lang)) ||
        vs[0] ||
        null
    }
    pick()
    window.speechSynthesis.addEventListener("voiceschanged", pick)
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pick)
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    cancelled.current = true
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    setPlaying(false)
    setActive(-1)
  }, [])

  const play = useCallback(() => {
    cancelled.current = false
    setPlaying(true)
    setActive(0)

    if (canSpeak && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      let i = 0
      const next = () => {
        if (cancelled.current || i >= lines.length) {
          setPlaying(false)
          setActive(-1)
          return
        }
        setActive(i)
        const u = new SpeechSynthesisUtterance(lines[i])
        if (voiceRef.current) u.voice = voiceRef.current
        u.rate = 1
        u.pitch = 1
        u.volume = 1
        u.onend = () => {
          i += 1
          next()
        }
        u.onerror = () => {
          i += 1
          next()
        }
        window.speechSynthesis.speak(u)
      }
      next()
    } else {
      // no TTS available -> timed cinematic captions
      let i = 0
      const tick = () => {
        if (cancelled.current || i >= lines.length) {
          setPlaying(false)
          setActive(-1)
          return
        }
        setActive(i)
        i += 1
        window.setTimeout(tick, 2800)
      }
      tick()
    }
  }, [canSpeak, lines])

  const caption = active >= 0 ? lines[active] : idle

  return (
    <div className="mt-6 flex flex-col items-center lg:items-start">
      {/* caption / subtitle */}
      <div className="relative flex min-h-[5rem] max-w-xl items-start">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-base leading-relaxed sm:text-lg lg:text-left"
            style={{ color: active >= 0 ? "#f5ede6" : "rgba(245,237,230,0.78)" }}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* play / stop + progress dots */}
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={playing ? stop : play}
          aria-label={playing ? "Stop spoken introduction" : "Play spoken introduction"}
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
          style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)", color: "#1a0a04" }}
        >
          {playing ? (
            <Square className="h-3.5 w-3.5" fill="#1a0a04" />
          ) : (
            <Play className="h-3.5 w-3.5" fill="#1a0a04" />
          )}
          {playing ? "Stop" : "Play intro"}
          {playing && <Equalizer />}
        </button>

        <div className="flex items-center gap-1.5" aria-hidden>
          {lines.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: active === i ? 20 : 6,
                background:
                  active >= 0 && i <= active ? "#ff7a18" : "rgba(245,237,230,0.25)",
              }}
            />
          ))}
        </div>
      </div>

      {/* impact metric chips */}
      {metrics.length > 0 && (
        <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
          {metrics.map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,122,24,0.3)",
                color: "rgba(245,237,230,0.9)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#ff7a18" }} />
              {m}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Tiny animated equalizer shown while speaking. */
function Equalizer() {
  return (
    <span className="ml-1 flex h-4 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: "#1a0a04", height: "30%" }}
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
        />
      ))}
    </span>
  )
}
