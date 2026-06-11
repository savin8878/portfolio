"use client"

/**
 * Charcoal 404 — the requested page "burned down": a charred ember-gradient 404
 * with embers drifting up from the ashes. The global torch cursor (screen-blend)
 * re-lights the numerals further as it passes; the resting gradient stays legible
 * on its own so touch / no-hover visitors (no torch) still read it. A magnetic
 * "back to base camp" CTA relights the trail home. Carries the site nav + footer
 * so a lost visitor always has a way out.
 */

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/magnetic"

// deterministic pseudo-random so SSR + client markup match (no hydration drift)
const rand = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: rand(i + 1) * 100,
  size: 2 + Math.round(rand(i + 7) * 2),
  rise: 420 + rand(i + 3) * 360,
  drift: (rand(i + 5) - 0.5) * 60,
  dur: 5 + rand(i + 9) * 5,
  delay: rand(i + 11) * 5,
}))

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — Page not found · Akash Vishwakarma"
  }, [])

  return (
    <>
      <Navbar />
      <main className="relative grid min-h-[86vh] place-items-center overflow-hidden bg-background px-6 text-center">
        {/* faint ember floor glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-accent-3/10 via-accent/5 to-transparent"
          aria-hidden
        />

        {/* embers drifting up from the ashes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {EMBERS.map((e, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${e.left}%`,
                width: e.size,
                height: e.size,
                background:
                  "radial-gradient(circle, #fff 0%, oklch(from var(--accent-2) l c h) 50%, oklch(from var(--accent-3) l c h) 100%)",
                boxShadow: "0 0 6px oklch(from var(--accent-2) l c h / 0.8)",
              }}
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{ y: [0, -e.rise], x: [0, e.drift], opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: e.dur, delay: e.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-xl">
          {/* charred 404 — readable at rest; the torch cursor adds extra glow */}
          <h1
            className="select-none text-[34vw] font-black leading-none tracking-tighter sm:text-[18rem]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, oklch(0.62 0.12 58) 0%, oklch(0.5 0.09 40) 58%, oklch(0.43 0.07 32) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 26px oklch(from var(--accent-3) l c h / 0.28))",
            }}
          >
            404
          </h1>

          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-accent">Page not found</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            This page burned down.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The trail went cold here — nothing but embers. Let&rsquo;s walk you back to where the fire&rsquo;s still
            burning.
          </p>

          <div className="mt-9 flex items-center justify-center">
            <Magnetic strength={0.25}>
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full px-6 text-sm font-semibold"
                style={{ background: "linear-gradient(100deg,#ff4d2e,#ff7a18)", color: "#1a0a04", border: "none" }}
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to base camp
                </Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
