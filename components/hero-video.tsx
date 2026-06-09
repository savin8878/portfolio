"use client"

/**
 * HeroVideo — a FULL-SCREEN video introduction that fills the hero behind the
 * headline + CTAs.
 *
 *  · plays /hero-intro.mp4 full-bleed (object-cover), muted + looping on load
 *  · cinematic scrims keep the overlaid text readable
 *  · a small corner control bar toggles play/pause and sound (tap unmute to
 *    hear the intro)
 *  · if the video file isn't there yet, it shows a polished fallback backdrop
 *    so the hero never looks broken — drop hero-intro.mp4 (+ optional
 *    hero-poster.jpg) into /public to go live.
 *
 * Assumes it is mounted inside a `position: relative` hero <section>; it renders
 * its own absolute background layer (-z-10) and a z-20 corner control bar.
 */

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface HeroVideoProps {
  name: string
  src?: string
  /** optional still frame; omitted by default so there's no 404 if absent */
  poster?: string
}

export function HeroVideo({
  name,
  src = "/hero-intro.mp4",
  poster,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [paused, setPaused] = useState(false)

  const firstName = name.trim().split(/\s+/)[0] || name

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) {
      v.volume = 1
      void v.play()
      setPaused(false)
    }
    setSoundOn(!v.muted)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  const showHint = process.env.NODE_ENV !== "production"
  const ctrl =
    "grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors"
  const ctrlStyle = {
    background: "rgba(8,7,11,0.45)",
    borderColor: "rgba(245,237,230,0.15)",
    color: "#f5ede6",
  }

  return (
    <>
      {/* full-bleed video background + cinematic scrims */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {failed ? (
          <Fallback firstName={firstName} showHint={showHint} />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        {/* left-darkening scrim so left/centered copy stays legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,7,11,0.88) 0%, rgba(8,7,11,0.55) 45%, rgba(8,7,11,0.15) 100%)",
          }}
        />
        {/* bottom-up scrim + vignette to blend into the next section */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #08070b 0%, rgba(8,7,11,0.35) 32%, transparent 65%)",
          }}
        />
        <div className="grain absolute inset-0 opacity-40" />
      </div>

      {/* corner control bar (above the overlaid content) */}
      {!failed && (
        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
          <button onClick={togglePlay} aria-label={paused ? "Play" : "Pause"} className={ctrl} style={ctrlStyle}>
            {paused ? <Play className="ml-0.5 h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleSound}
            aria-label={soundOn ? "Mute introduction" : "Play introduction with sound"}
            className={ctrl}
            style={ctrlStyle}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      )}
    </>
  )
}

function Fallback({ firstName, showHint }: { firstName: string; showHint: boolean }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 30%, #2a1207 0%, #120a14 55%, #08070b 100%)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <motion.span
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-20 w-20 place-items-center rounded-full shadow-2xl"
          style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)" }}
        >
          <Play className="ml-1 h-8 w-8" fill="#1a0a04" stroke="#1a0a04" />
        </motion.span>
        <p className="text-base font-semibold" style={{ color: "rgba(245,237,230,0.85)" }}>
          {firstName}&rsquo;s intro reel
        </p>
        {showHint && (
          <p
            className="max-w-56 text-[11px] font-mono uppercase leading-relaxed tracking-[0.15em]"
            style={{ color: "rgba(245,237,230,0.4)" }}
          >
            add public/hero-intro.mp4 to go live
          </p>
        )}
      </div>
    </div>
  )
}
