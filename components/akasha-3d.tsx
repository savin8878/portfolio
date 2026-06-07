"use client"

/**
 * Akasha3D — the WebGL centerpiece.
 *
 * ~20k GPU particles morphing chaos → sacred geometry → dodecahedron (aether),
 * driven by how far you've scrolled through the hero. Curl-noise turbulence on
 * the GPU, additive bloom, and a camera that leans toward the cursor.
 *
 * Loaded client-only (see akasha-3d-mount). Honours prefers-reduced-motion by
 * rendering a single still, fully-ordered frame.
 */

import { useMemo, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import {
  chaosCloud,
  phyllotaxisSphere,
  dodecahedronSurface,
  randomSeeds,
} from "@/lib/akasha-shapes"
import { akashaVertexShader, akashaFragmentShader } from "@/lib/akasha-glsl"

const RADIUS = 2.0

function colorTriplet(dark: boolean) {
  // violet → magenta → cyan, sampled from the site's accent palette.
  return dark
    ? [new THREE.Color("#6f6dff"), new THREE.Color("#c484ff"), new THREE.Color("#78d2f5")]
    : [new THREE.Color("#5a4fe0"), new THREE.Color("#9646dc"), new THREE.Color("#1f8fcf")]
}

function AkashaPoints({
  count,
  progressRef,
  pointerRef,
  reduced,
}: {
  count: number
  progressRef: React.MutableRefObject<number>
  pointerRef: React.MutableRefObject<{ x: number; y: number }>
  reduced: boolean
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const renderProgress = useRef(reduced ? 1 : 0)

  const { geometry, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(chaosCloud(count, RADIUS), 3))
    g.setAttribute("aChaos", new THREE.BufferAttribute(chaosCloud(count, RADIUS), 3))
    g.setAttribute("aSacred", new THREE.BufferAttribute(phyllotaxisSphere(count, RADIUS), 3))
    g.setAttribute("aSolid", new THREE.BufferAttribute(dodecahedronSurface(count, RADIUS * 1.05), 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(randomSeeds(count), 1))

    const dark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
    const [cA, cB, cC] = colorTriplet(dark)

    const u = {
      uTime: { value: 0 },
      uProgress: { value: reduced ? 1 : 0 },
      uSize: { value: 30 },
      uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: cA },
      uColorB: { value: cB },
      uColorC: { value: cC },
    }
    return { geometry: g, uniforms: u }
  }, [count, reduced])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const m = matRef.current
    if (!m) return
    if (!reduced) {
      m.uniforms.uTime.value += delta
      // Ease the rendered progress toward the scroll target (critically damped feel).
      renderProgress.current += (progressRef.current - renderProgress.current) * Math.min(1, delta * 3)
      m.uniforms.uProgress.value = renderProgress.current
      // Smooth the pointer into the field + camera handled in Rig.
      const mv = m.uniforms.uMouse.value as THREE.Vector2
      mv.x += (pointerRef.current.x - mv.x) * Math.min(1, delta * 4)
      mv.y += (pointerRef.current.y - mv.y) * Math.min(1, delta * 4)
    }
  })

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        args={[
          {
            uniforms,
            vertexShader: akashaVertexShader,
            fragmentShader: akashaFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  )
}

// Explicit sizing: drive the renderer + camera from measured props instead of
// relying on R3F's internal measure (which can read 0 in some mount orders).
function Resizer({ width, height }: { width: number; height: number }) {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    gl.setSize(width, height, true)
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = camera as THREE.PerspectiveCamera
      cam.aspect = width / height
      cam.updateProjectionMatrix()
    }
  }, [width, height, gl, camera])
  return null
}

function Rig({ pointerRef, reduced }: { pointerRef: React.MutableRefObject<{ x: number; y: number }>; reduced: boolean }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    if (reduced) return
    const tx = pointerRef.current.x * 0.6
    const ty = pointerRef.current.y * 0.4
    camera.position.x += (tx - camera.position.x) * Math.min(1, delta * 2)
    camera.position.y += (ty - camera.position.y) * Math.min(1, delta * 2)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Akasha3D({
  progressRef,
  width,
  height,
}: {
  progressRef: React.MutableRefObject<number>
  width: number
  height: number
}) {
  const pointerRef = useRef({ x: 0, y: 0 })
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  // Escape hatch for environments without float-framebuffer support (e.g. some
  // headless/software renderers). Real GPUs keep bloom on.
  const noBloom =
    typeof window !== "undefined" &&
    (window as unknown as { __AKASHA_NOBLOOM__?: boolean }).__AKASHA_NOBLOOM__ === true

  // Particle budget: lighter on small / low-DPR screens.
  const count = useMemo(() => {
    if (typeof window === "undefined") return 18000
    const w = window.innerWidth
    if (w < 640) return 9000
    if (w < 1024) return 14000
    return 20000
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <Canvas
      style={{ width, height, display: "block" }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 2]}
      resize={{ offsetSize: true }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Resizer width={width} height={height} />
      <AkashaPoints count={count} progressRef={progressRef} pointerRef={pointerRef} reduced={reduced} />
      <Rig pointerRef={pointerRef} reduced={reduced} />
      {!reduced && !noBloom && (
        <EffectComposer>
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.05}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      )}
    </Canvas>
  )
}
