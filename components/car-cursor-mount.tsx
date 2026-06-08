"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const CarCursor = dynamic(() => import("@/components/car-cursor").then((m) => m.CarCursor), {
  ssr: false,
})

/**
 * Mounts the 3D car cursor only where it makes sense: a fine pointer (real
 * mouse), WebGL available, and motion allowed. Hides the native cursor while
 * active. Touch / reduced-motion users keep the normal pointer.
 */
export function CarCursorMount() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let webgl = false
    try {
      const c = document.createElement("canvas")
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"))
    } catch {
      webgl = false
    }
    if (fine && !reduce && webgl) {
      setEnabled(true)
      document.documentElement.classList.add("car-cursor-on")
    }
    return () => document.documentElement.classList.remove("car-cursor-on")
  }, [])

  if (!enabled) return null
  return <CarCursor />
}
