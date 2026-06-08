"use client"

/**
 * HeroVideo — a framed, cinematic "video introduction" player that replaces the
 * cartoon mascot in the hero.
 *
 *  · plays /hero-intro.mp4 muted-on-load as a silent looping preview
 *  · a tap on the play button unmutes and plays with sound; then a small
 *    play/pause + mute control bar appears
 *  · subtle pointer-parallax tilt (driven by the hero's cursor springs)
 *  · if the video file isn't there yet, it shows a polished fallback frame so
 *    the hero never looks broken — drop hero-intro.mp4 (+ optional
 *    hero-poster.jpg) into /public to go live.
 */

import { useRef, useState } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface HeroVideoProps {
  name: string
  title: string
  src?: string
  poster?: string
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
}

export function HeroVideo({
  name,
  title,
  src = "/hero-intro.mp4",
  poster = "/hero-poster.jpg",
  parallaxX,
  parallaxY,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [paused, setPaused] = useState(false)

  const rotateY = useTransform(parallaxX, [-0.5, 0.5], [9, -9])
  const rotateX = useTransform(parallaxY, [-0.5, 0.5], [-7, 7])

  const firstName = name.trim().split(/\s+/)[0] || name

  const enableSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    void v.play()
    setSoundOn(true)
    setPaused(false)
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

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setSoundOn(!v.muted)
  }

  const showHint = process.env.NODE_ENV !== "production"

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* ambient ember glow behind the frame */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(255,90,40,0.45), transparent 70%)",
        }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        className="group relative aspect-4/5 w-full overflow-hidden rounded-[2rem]"
      >
        {/* frame ring + depth shadow */}
        <div className="pointer-events-none absolute inset-0 z-30 rounded-[2rem] ring-1 ring-inset ring-white/12" />
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[2rem]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,122,24,0.25), 0 40px 80px -24px rgba(0,0,0,0.65)",
          }}
        />

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

        {/* top vignette + live "Intro" label */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-linear-to-b from-black/50 to-transparent" />
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full"
              style={{ background: "#ff7a18" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "#ff7a18" }}
            />
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "rgba(245,237,230,0.85)" }}
          >
            Intro
          </span>
        </div>

        {/* big play-with-sound button, shown until sound is enabled */}
        {!failed && !soundOn && (
          <button
            onClick={enableSound}
            aria-label="Play introduction with sound"
            className="absolute inset-0 z-20 grid place-items-center outline-none"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="grid h-16 w-16 place-items-center rounded-full shadow-2xl"
              style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)" }}
            >
              <Play className="ml-0.5 h-7 w-7" fill="#1a0a04" stroke="#1a0a04" />
            </motion.span>
          </button>
        )}

        {/* control bar, once sound is enabled */}
        {!failed && soundOn && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-linear-to-t from-black/65 to-transparent px-4 pb-4 pt-12 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={togglePlay}
              aria-label={paused ? "Play" : "Pause"}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
              style={{ color: "#f5ede6" }}
            >
              {paused ? <Play className="ml-0.5 h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleMute}
              aria-label="Mute"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
              style={{ color: "#f5ede6" }}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function Fallback({ firstName, showHint }: { firstName: string; showHint: boolean }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        background:
          "radial-gradient(80% 70% at 50% 35%, #2a1207, #120a14 70%, #0b0810)",
      }}
    >
      <div className="grain absolute inset-0 opacity-40" />
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
