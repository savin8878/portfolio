"use client"

/**
 * CinematicHero — a cinematic landing with an animated cartoon mascot of the
 * developer that "speaks" (typewriter narration) and introduces them. Bold
 * fire/ember theme to match the intro. Drop-in replacement for HeroSection.
 */

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowRight, Github, Linkedin, Twitter, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { GeometryCanvas } from "@/components/geometry-canvas"
import type { SocialLink } from "@/lib/db"

interface CinematicHeroProps {
  developerName: string
  professionalTitle: string
  tagline: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText: string
  secondaryCtaUrl: string
  socialLinks?: SocialLink[]
  content?: Record<string, unknown>
}

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

const fallbackSocialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@akash.dev", icon: Mail, label: "Email" },
]

const FLOAT_TAGS = [
  { label: "React", x: "6%", y: "18%", d: 0 },
  { label: "Next.js", x: "78%", y: "10%", d: 1.2 },
  { label: "TypeScript", x: "84%", y: "62%", d: 0.6 },
  { label: "Node", x: "2%", y: "66%", d: 1.8 },
  { label: "AI", x: "70%", y: "84%", d: 0.9 },
]

export function CinematicHero({
  developerName,
  professionalTitle,
  tagline,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  socialLinks,
  content,
}: CinematicHeroProps) {
  const availabilityText =
    (content?.availability_text as string) || "Available for new projects"

  const sectionRef = useRef<HTMLElement>(null)

  // pointer parallax (drives the mascot + light)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 80, damping: 18 })
  const sy = useSpring(py, { stiffness: 80, damping: 18 })
  const glowX = useTransform(sx, (v) => `${50 + v * 12}%`)
  const glowY = useTransform(sy, (v) => `${55 + v * 10}%`)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      px.set((e.clientX - r.left) / r.width - 0.5)
      py.set((e.clientY - r.top) / r.height - 0.5)
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [px, py])

  const nameParts = developerName.trim().split(/\s+/)
  const firstName = nameParts[0] || developerName

  // The mascot's narration.
  const lines = [
    `Hey — I'm ${firstName} 👋`,
    professionalTitle,
    tagline,
    "Let's build something great →",
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#08070b" }}
    >
      {/* ---------- cinematic background ---------- */}
      <div className="absolute inset-0 -z-10">
        {/* base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, #1a0f08 0%, #0b0810 45%, #08070b 100%)",
          }}
        />
        {/* fire glow that follows the cursor */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(40% 45% at ${x} ${y}, rgba(255,122,24,0.22), transparent 70%)`,
            ),
          }}
        />
        {/* advanced geometry animation — subtle depth layer */}
        <GeometryCanvas className="absolute inset-0 h-full w-full opacity-60" density={120} speed={0.7} intensity={0.8} />
        {/* light rays from top */}
        <div
          className="absolute inset-x-0 top-0 h-[70vh] opacity-50 mix-blend-screen"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,160,60,0.10) 18deg, transparent 36deg, rgba(255,90,40,0.08) 54deg, transparent 72deg, rgba(255,160,60,0.10) 90deg, transparent 108deg)",
            maskImage: "linear-gradient(to bottom, black, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 80%)",
          }}
        />
        {/* grain + line grid for texture */}
        <div className="absolute inset-0 grain opacity-60" />
        <div className="absolute inset-0 line-grid opacity-[0.18] mask-fade-radial" />
        {/* bottom vignette so the next section blends in */}
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{ background: "linear-gradient(to bottom, transparent, #08070b)" }}
        />
      </div>

      {/* floating tech tags */}
      {FLOAT_TAGS.map((t) => (
        <motion.div
          key={t.label}
          className="pointer-events-none absolute hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md"
          style={{
            left: t.x,
            top: t.y,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(245,237,230,0.85)",
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5 + t.d, repeat: Infinity, ease: "easeInOut", delay: t.d }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#ff7a18" }} />
          {t.label}
        </motion.div>
      ))}

      {/* ---------- content ---------- */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* left: copy */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{ background: "rgba(255,122,24,0.10)", border: "1px solid rgba(255,122,24,0.25)", color: "#ffd24a" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#34d399" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#34d399" }} />
            </span>
            {availabilityText}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black uppercase leading-[0.88] tracking-tighter"
            style={{ color: "#f5ede6", fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
          >
            <span className="block" style={{ color: "rgba(245,237,230,0.55)", fontSize: "0.42em", letterSpacing: "0.02em" }}>
              {nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "Hi, I'm"}
            </span>
            <span
              style={{
                backgroundImage: "linear-gradient(100deg,#ff4d2e,#ff7a18 45%,#ffd24a)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {nameParts.length > 1 ? nameParts[nameParts.length - 1] : developerName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed sm:text-lg lg:mx-0"
            style={{ color: "rgba(245,237,230,0.7)" }}
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full px-6 text-sm font-semibold"
              style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)", color: "#1a0a04", border: "none" }}
            >
              <Link href={primaryCtaUrl}>
                <Sparkles className="mr-2 h-4 w-4" />
                {primaryCtaText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-6 text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.15)", color: "#f5ede6" }}
            >
              <Link href={secondaryCtaUrl}>{secondaryCtaText}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-1 lg:justify-start"
          >
            {(socialLinks && socialLinks.length > 0
              ? socialLinks.map((l) => ({
                  key: l.id as string | number,
                  href: l.url,
                  label: l.platform,
                  Icon: socialIcons[l.platform.toLowerCase()] || Mail,
                }))
              : fallbackSocialLinks.map((s) => ({ key: s.label, href: s.href, label: s.label, Icon: s.icon }))
            ).map((l) => (
              <Link
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full p-3 transition-colors"
                style={{ color: "rgba(245,237,230,0.55)" }}
              >
                <l.Icon className="h-5 w-5 transition-colors group-hover:text-[#ff7a18]" />
                <span className="sr-only">{l.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* right: the mascot that tells about you */}
        <div className="order-1 lg:order-2">
          <Mascot lines={lines} parallaxX={sx} parallaxY={sy} />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(245,237,230,0.4)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 justify-center rounded-full pt-1.5"
          style={{ border: "1px solid rgba(245,237,230,0.25)" }}
        >
          <span className="h-1.5 w-1 rounded-full" style={{ background: "#ff7a18" }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
