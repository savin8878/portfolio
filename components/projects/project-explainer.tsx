"use client"

/**
 * ProjectExplainer — the "walkthrough" surface for a project card.
 *
 * Renders up to two media actions next to the usual Live / Code links:
 *   • Watch  → opens a cinematic lightbox (native <video> for .mp4/.webm,
 *              or an embedded player for YouTube / Vimeo links).
 *   • Listen → expands an inline audio player *inside the card* with a live,
 *              seekable waveform — a short spoken "founder's note".
 *
 * The card it lives in is usually a link, so every control stops propagation
 * and prevents default — clicking "Watch"/"Listen" never navigates away.
 * The video lightbox is rendered through a portal so no card `overflow-hidden`
 * can ever clip it.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Film, Headphones, Pause, Play, X } from "lucide-react"

interface ProjectExplainerProps {
  title: string
  videoUrl?: string | null
  audioUrl?: string | null
  className?: string
  /** "sm" for tight card docks, "md" for detail pages */
  size?: "sm" | "md"
}

const ACCENT = "#ff7a18"
const ACCENT_2 = "#ff4d2e"

// Deterministic waveform shape (no Math.random — keeps SSR + client identical).
const BARS = 56
const WAVEFORM = Array.from({ length: BARS }, (_, i) => {
  const v =
    Math.sin(i * 0.5) * 0.5 + Math.sin(i * 1.3) * 0.32 + Math.sin(i * 0.21) * 0.2
  return 26 + Math.abs(v) * 64 // 26%..~90%
})

function parseVideo(url: string): { kind: "file" | "embed"; src: string } {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  )
  if (yt) return { kind: "embed", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` }
  return { kind: "file", src: url }
}

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) t = 0
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** Swallow card-navigation for any control rendered inside a linked card. */
function stop(e: React.MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
}

export function ProjectExplainer({
  title,
  videoUrl,
  audioUrl,
  className = "",
  size = "sm",
}: ProjectExplainerProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const [audioOpen, setAudioOpen] = useState(false)

  if (!videoUrl && !audioUrl) return null

  const chip =
    size === "sm"
      ? "h-8 gap-1.5 px-3 text-[11px]"
      : "h-10 gap-2 px-4 text-sm"

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {videoUrl && (
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              setVideoOpen(true)
            }}
            aria-label={`Watch the ${title} walkthrough`}
            className={`group/btn relative z-10 inline-flex items-center rounded-full font-semibold text-[#1a0a04] shadow-[0_6px_20px_-6px_rgba(255,77,46,0.7)] transition-transform hover:scale-[1.04] active:scale-95 ${chip}`}
            style={{ background: `linear-gradient(100deg, ${ACCENT_2}, ${ACCENT})` }}
          >
            <Film className="h-3.5 w-3.5" />
            Watch explainer
          </button>
        )}

        {audioUrl && (
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              setAudioOpen((v) => !v)
            }}
            aria-expanded={audioOpen}
            aria-label={`Listen to the ${title} audio note`}
            className={`relative z-10 inline-flex items-center rounded-full border font-semibold transition-colors ${chip}`}
            style={{
              borderColor: audioOpen ? `${ACCENT}66` : "rgba(255,255,255,0.16)",
              background: audioOpen ? "rgba(255,122,24,0.10)" : "rgba(255,255,255,0.04)",
              color: audioOpen ? ACCENT : "rgba(245,237,230,0.86)",
            }}
          >
            {audioOpen ? <MiniBars /> : <Headphones className="h-3.5 w-3.5" />}
            Listen
          </button>
        )}
      </div>

      {/* Inline audio player — expands within the card, never clipped */}
      <AnimatePresence initial={false}>
        {audioUrl && audioOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            onClick={stop}
          >
            <AudioPlayer src={audioUrl} />
          </motion.div>
        )}
      </AnimatePresence>

      {videoUrl && (
        <VideoLightbox
          open={videoOpen}
          url={videoUrl}
          title={title}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}

/* ----------------------------- Audio player ----------------------------- */

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(0)

  const progress = dur > 0 ? cur / dur : 0

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      void a.play()
    } else {
      a.pause()
    }
  }, [])

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const a = audioRef.current
      if (!a || !dur) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      a.currentTime = ratio * dur
      setCur(a.currentTime)
    },
    [dur]
  )

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-3"
      style={{
        borderColor: "rgba(255,122,24,0.22)",
        background:
          "linear-gradient(180deg, rgba(255,122,24,0.06), rgba(255,255,255,0.02))",
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#1a0a04] transition-transform hover:scale-105 active:scale-95"
        style={{ background: `linear-gradient(100deg, ${ACCENT_2}, ${ACCENT})` }}
      >
        {playing ? <Pause className="h-4 w-4" fill="#1a0a04" /> : <Play className="h-4 w-4 translate-x-px" fill="#1a0a04" />}
      </button>

      {/* Seekable waveform */}
      <div
        onClick={seek}
        className="flex h-9 flex-1 cursor-pointer items-center gap-[2px]"
        role="slider"
        aria-label="Seek audio"
        aria-valuemin={0}
        aria-valuemax={Math.round(dur)}
        aria-valuenow={Math.round(cur)}
      >
        {WAVEFORM.map((h, i) => {
          const filled = i / BARS <= progress
          return (
            <span
              key={i}
              className="flex-1 rounded-full"
              style={{
                height: `${h}%`,
                transformOrigin: "center",
                background: filled ? ACCENT : "rgba(245,237,230,0.18)",
                animation: playing ? `pe-eq 0.9s ease-in-out ${(i % 7) * 0.07}s infinite alternate` : "none",
              }}
            />
          )
        })}
      </div>

      <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
        {fmt(cur)} / {fmt(dur)}
      </span>

      <style>{`@keyframes pe-eq{from{transform:scaleY(0.6)}to{transform:scaleY(1.08)}}`}</style>
    </div>
  )
}

/** Tiny live equalizer shown in the "Listen" chip while the panel is open. */
function MiniBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: ACCENT, height: "40%" }}
          animate={{ height: ["40%", "100%", "55%", "90%", "40%"] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 }}
        />
      ))}
    </span>
  )
}

/* ----------------------------- Video lightbox ----------------------------- */

function VideoLightbox({
  open,
  url,
  title,
  onClose,
}: {
  open: boolean
  url: string
  title: string
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!mounted) return null

  const video = parseVideo(url)

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] grid place-items-center p-4 sm:p-8"
          style={{ background: "rgba(6,5,9,0.82)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              borderColor: "rgba(255,122,24,0.3)",
              boxShadow: "0 40px 120px -30px rgba(255,77,46,0.45)",
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0c0a10] px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: "rgba(255,122,24,0.14)" }}>
                  <Film className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                    Walkthrough
                  </p>
                  <p className="truncate text-sm font-medium text-white/90">{title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close walkthrough"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* player */}
            <div className="relative aspect-video bg-black">
              {video.kind === "file" ? (
                <video src={video.src} controls autoPlay playsInline className="h-full w-full" />
              ) : (
                <iframe
                  src={video.src}
                  title={title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
