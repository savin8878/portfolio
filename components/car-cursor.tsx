"use client"

/**
 * CarCursor — replaces the mouse pointer with an advanced 3D sports car
 * (Three.js / R3F): an extruded, clearcoat-painted body with tinted glass,
 * multi-spoke wheels + glowing brake discs, lit by a lightformer environment
 * for real reflections. Drives toward the cursor, steers + banks into turns,
 * spins/steers its wheels, and plays a speed-reactive engine sound.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { Volume2, VolumeX } from "lucide-react"
import * as THREE from "three"
import { engine } from "@/lib/engine-audio"

function useCarGeometry() {
  return useMemo(() => {
    // side silhouette (X = length, Y = height), extruded along Z (width)
    const body = new THREE.Shape()
    body.moveTo(-1.15, 0.07)
    body.lineTo(1.0, 0.07)
    body.quadraticCurveTo(1.24, 0.09, 1.2, 0.3)
    body.quadraticCurveTo(1.18, 0.41, 0.95, 0.43)
    body.quadraticCurveTo(0.62, 0.45, 0.46, 0.51)
    body.quadraticCurveTo(0.28, 0.56, 0.1, 0.81)
    body.quadraticCurveTo(-0.12, 0.91, -0.46, 0.89)
    body.quadraticCurveTo(-0.74, 0.87, -0.92, 0.52)
    body.lineTo(-1.1, 0.46)
    body.quadraticCurveTo(-1.22, 0.4, -1.15, 0.07)
    const bodyGeo = new THREE.ExtrudeGeometry(body, {
      depth: 0.96, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 5, steps: 1, curveSegments: 28,
    })
    bodyGeo.translate(0, 0, -0.48)

    const glass = new THREE.Shape()
    glass.moveTo(0.44, 0.52)
    glass.quadraticCurveTo(0.28, 0.57, 0.12, 0.79)
    glass.quadraticCurveTo(-0.12, 0.88, -0.45, 0.86)
    glass.quadraticCurveTo(-0.7, 0.84, -0.86, 0.55)
    glass.lineTo(0.44, 0.52)
    const glassGeo = new THREE.ExtrudeGeometry(glass, {
      depth: 0.82, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 22,
    })
    glassGeo.translate(0, 0, -0.41)

    return { bodyGeo, glassGeo }
  }, [])
}

function Wheel() {
  const spokes = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), [])
  return (
    <group>
      {/* tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 30]} />
        <meshStandardMaterial color="#0b0a0d" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* rim hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.24, 22]} />
        <meshPhysicalMaterial color="#d8d8dc" metalness={1} roughness={0.22} clearcoat={1} envMapIntensity={1.4} />
      </mesh>
      {/* spokes */}
      {spokes.map((a, i) => (
        <mesh key={i} rotation={[0, 0, a]}>
          <boxGeometry args={[0.055, 0.32, 0.07]} />
          <meshStandardMaterial color="#b8b8be" metalness={0.95} roughness={0.28} />
        </mesh>
      ))}
      {/* glowing brake disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 26]} />
        <meshStandardMaterial color="#3a0f06" emissive="#ff4d2e" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  )
}

const WHEELS: { pos: [number, number, number]; front: boolean }[] = [
  { pos: [0.66, 0.3, 0.5], front: true },
  { pos: [0.66, 0.3, -0.5], front: true },
  { pos: [-0.66, 0.3, 0.5], front: false },
  { pos: [-0.66, 0.3, -0.5], front: false },
]

function Car() {
  const { bodyGeo, glassGeo } = useCarGeometry()
  const group = useRef<THREE.Group>(null)
  const wheels = useRef<(THREE.Group | null)[]>([])
  const { camera } = useThree()

  const ndc = useRef({ x: 0, y: 0 })
  const ray = useRef(new THREE.Raycaster())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const target = useRef(new THREE.Vector3())
  const pos = useRef(new THREE.Vector3())
  const last = useRef(new THREE.Vector3())
  const heading = useRef(0)
  const bank = useRef(0)
  const steer = useRef(0)
  const v2 = useRef(new THREE.Vector2())

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ndc.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ndc.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const d = Math.min(dt, 0.05)

    v2.current.set(ndc.current.x, ndc.current.y)
    ray.current.setFromCamera(v2.current, camera)
    if (!ray.current.ray.intersectPlane(plane.current, target.current)) return

    pos.current.lerp(target.current, 1 - Math.pow(0.0015, d))
    const vx = pos.current.x - last.current.x
    const vz = pos.current.z - last.current.z
    const speed = Math.hypot(vx, vz)
    engine.setSpeed(speed)

    if (speed > 0.0008) {
      const targetHeading = Math.atan2(-vz, vx)
      let dh = targetHeading - heading.current
      dh = Math.atan2(Math.sin(dh), Math.cos(dh))
      heading.current += dh * Math.min(1, d * 12)
      bank.current = THREE.MathUtils.lerp(bank.current, THREE.MathUtils.clamp(dh * 4, -0.35, 0.35), 0.2)
      steer.current = THREE.MathUtils.lerp(steer.current, THREE.MathUtils.clamp(dh * 6, -0.5, 0.5), 0.3)
    } else {
      bank.current = THREE.MathUtils.lerp(bank.current, 0, 0.1)
      steer.current = THREE.MathUtils.lerp(steer.current, 0, 0.2)
    }

    g.position.set(pos.current.x, Math.sin(state.clock.elapsedTime * 2) * 0.04, pos.current.z)
    g.rotation.set(0, heading.current, bank.current)

    const spin = speed * 3.6
    wheels.current.forEach((w, i) => {
      if (!w) return
      w.rotation.z -= spin
      if (WHEELS[i].front) w.rotation.y = steer.current
    })

    last.current.copy(pos.current)
  })

  return (
    <group ref={group} scale={0.42}>
      {/* painted body */}
      <mesh geometry={bodyGeo} castShadow>
        <meshPhysicalMaterial
          color="#ff6a14"
          metalness={0.6}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.5}
          emissive="#ff3d00"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* tinted glass greenhouse */}
      <mesh geometry={glassGeo} position={[0, 0.006, 0]}>
        <meshPhysicalMaterial color="#0c0910" metalness={0.4} roughness={0.05} clearcoat={1} transmission={0.2} envMapIntensity={1.6} />
      </mesh>

      {/* headlights */}
      <mesh position={[1.16, 0.3, 0.34]}><sphereGeometry args={[0.09, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#ffe2a0" emissiveIntensity={5} toneMapped={false} /></mesh>
      <mesh position={[1.16, 0.3, -0.34]}><sphereGeometry args={[0.09, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#ffe2a0" emissiveIntensity={5} toneMapped={false} /></mesh>
      <pointLight position={[1.7, 0.45, 0]} color="#ffc070" intensity={7} distance={5.5} decay={2} />
      {/* taillight bar */}
      <mesh position={[-1.2, 0.42, 0]}><boxGeometry args={[0.05, 0.12, 0.7]} /><meshStandardMaterial color="#ff2a1a" emissive="#ff2a1a" emissiveIntensity={3.5} toneMapped={false} /></mesh>

      {/* wheels */}
      {WHEELS.map((w, i) => (
        <group key={i} position={w.pos} ref={(el) => { wheels.current[i] = el }}>
          <Wheel />
        </group>
      ))}
    </group>
  )
}

export function CarCursor() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const onGesture = () => engine.start()
    window.addEventListener("pointerdown", onGesture)
    window.addEventListener("keydown", onGesture)
    return () => {
      window.removeEventListener("pointerdown", onGesture)
      window.removeEventListener("keydown", onGesture)
    }
  }, [])

  return (
    <>
      <Canvas
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 9, 6.5], fov: 32 }}
        style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 9, 5]} intensity={1.3} />
        <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#ff7a18" />
        <Environment resolution={192} frames={1}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[7, 3, 1]} color="#ffd9a0" />
          <Lightformer intensity={1.4} position={[-5, 2, -2]} scale={[4, 5, 1]} color="#ff7a18" />
          <Lightformer intensity={1.1} position={[5, 1.5, 2]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Car />
      </Canvas>

      <button
        type="button"
        aria-label={muted ? "Unmute engine" : "Mute engine"}
        onClick={() => {
          const next = !muted
          setMuted(next)
          engine.setMuted(next)
          engine.start()
        }}
        className="fixed bottom-5 left-5 z-10000 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors"
        style={{ pointerEvents: "auto", background: "rgba(20,16,24,0.6)", borderColor: "rgba(255,122,24,0.35)", color: "#ff9a4a" }}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  )
}
