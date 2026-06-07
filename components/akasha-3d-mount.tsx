"use client"

/**
 * Client-only mount for the WebGL field. Three.js cannot render on the server,
 * so we load Akasha3D with ssr:false and fade it in once it's ready.
 *
 * We measure the container ourselves with a ResizeObserver and hand explicit
 * pixel sizes to the Canvas — percentage-only sizing can leave R3F at its 300×150
 * default in some mount orders. If WebGL is unavailable, nothing renders and the
 * hero falls back to its gradient backdrop.
 */

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const Akasha3D = dynamic(() => import("@/components/akasha-3d"), { ssr: false })

function webglAvailable() {
  try {
    const c = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    )
  } catch {
    return false
  }
}

export function Akasha3DMount({
  progressRef,
  className,
}: {
  progressRef: React.MutableRefObject<number>
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ok, setOk] = useState(false)
  const [shown, setShown] = useState(false)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!webglAvailable()) return
    setOk(true)
  }, [])

  useEffect(() => {
    const el = hostRef.current
    if (!el || !ok) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ok])

  useEffect(() => {
    if (size.w > 0 && size.h > 0 && !shown) {
      const t = setTimeout(() => setShown(true), 80)
      return () => clearTimeout(t)
    }
  }, [size, shown])

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ opacity: shown ? 1 : 0, transition: "opacity 1.4s ease" }}
    >
      {ok && size.w > 0 && size.h > 0 && (
        <Akasha3D progressRef={progressRef} width={size.w} height={size.h} />
      )}
    </div>
  )
}
