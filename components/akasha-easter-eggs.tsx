"use client"

/**
 * The hidden room.
 *
 * Two secrets, for the curious:
 *   1. A console signature — for the developer who opens DevTools to see how it's
 *      built. It greets them by their craft.
 *   2. The Konami sequence (↑ ↑ ↓ ↓ ← → ← → B A) collapses the ether into a
 *      single still point and reveals a mahāvākya — one of the Upanishadic "great
 *      sayings". Found only by those who go looking. That is the whole point.
 *
 * Neither secret costs the casual visitor anything; both reward attention.
 */

import { useEffect } from "react"

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
]

export function AkashaEasterEggs() {
  useEffect(() => {
    // ---- 1. Console signature --------------------------------------------
    const title =
      "color:#7c7aff;font-size:15px;font-weight:700;font-family:ui-monospace,monospace"
    const dim = "color:#9aa;font-size:11px;font-family:ui-monospace,monospace"
    const accent = "color:#c484ff;font-size:11px;font-family:ui-monospace,monospace"
    // eslint-disable-next-line no-console
    console.log(
      "%cआकाश · AKASHA%c\n~20,000 particles on the GPU, advected by 3D curl-noise —\nthe curl of a simplex potential, so the flow is divergence-free\n(incompressible, like a real fluid). They morph chaos → a\nFibonacci sphere → the dodecahedron, Plato's solid of aether.\nHand-written GLSL. The fifth element, in code.\n\n%cYou opened the console. You're my kind of person.\n%cTry the Konami code. ↑↑↓↓←→←→ B A",
      title,
      dim,
      accent,
      dim
    )

    // ---- 2. Konami revelation --------------------------------------------
    let idx = 0
    let revealed = false

    function reveal() {
      if (revealed) return
      revealed = true
      document.documentElement.classList.add("akasha-revealed")

      const el = document.createElement("div")
      el.setAttribute("role", "status")
      el.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:9999",
        "display:flex",
        "flex-direction:column",
        "align-items:center",
        "justify-content:center",
        "gap:0.75rem",
        "pointer-events:none",
        "background:radial-gradient(circle at center, rgba(124,122,255,0.10), transparent 60%)",
        "opacity:0",
        "transition:opacity 1.2s ease",
        "text-align:center",
      ].join(";")
      el.innerHTML = [
        '<div style="font-size:clamp(2rem,7vw,4rem);font-weight:600;letter-spacing:0.04em;background:linear-gradient(115deg,#7c7aff,#c484ff,#78d2f5);-webkit-background-clip:text;background-clip:text;color:transparent">तत् त्वम् असि</div>',
        '<div style="font-size:0.8rem;letter-spacing:0.3em;text-transform:uppercase;color:#9aa">Tat Tvam Asi — Thou art That</div>',
      ].join("")
      document.body.appendChild(el)

      requestAnimationFrame(() => {
        el.style.opacity = "1"
      })
      window.setTimeout(() => {
        el.style.opacity = "0"
      }, 3200)
      window.setTimeout(() => {
        el.remove()
        document.documentElement.classList.remove("akasha-revealed")
        revealed = false
      }, 4600)
    }

    function onKey(e: KeyboardEvent) {
      const want = KONAMI[idx]
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === want) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          reveal()
        }
      } else {
        idx = key === KONAMI[0] ? 1 : 0
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return null
}
