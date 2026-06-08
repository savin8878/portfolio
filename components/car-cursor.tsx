"use client"

/**
 * CarCursor — replaces the mouse pointer with a real 3D car (Three.js / R3F)
 * that drives toward the cursor, steers/banks into turns, and spins its wheels.
 * Procedural model (no asset fetch), fire-palette paint. Desktop only; the
 * canvas is pointer-events:none so clicks pass straight through to the page.
 */

import { useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"

const WHEELS: [number, number, number][] = [
  [0.66, 0.24, 0.52],
  [0.66, 0.24, -0.52],
  [-0.66, 0.24, 0.52],
  [-0.66, 0.24, -0.52],
]

function Car() {
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

    if (speed > 0.0008) {
      const targetHeading = Math.atan2(-vz, vx)
      let dh = targetHeading - heading.current
      dh = Math.atan2(Math.sin(dh), Math.cos(dh))
      heading.current += dh * Math.min(1, d * 12)
      bank.current = THREE.MathUtils.lerp(bank.current, THREE.MathUtils.clamp(dh * 4, -0.35, 0.35), 0.2)
    } else {
      bank.current = THREE.MathUtils.lerp(bank.current, 0, 0.1)
    }

    g.position.set(pos.current.x, Math.sin(state.clock.elapsedTime * 2) * 0.04, pos.current.z)
    g.rotation.set(0, heading.current, bank.current)

    const spin = speed * 3.4
    for (const w of wheels.current) if (w) w.rotation.z -= spin

    last.current.copy(pos.current)
  })

  return (
    <group ref={group} scale={0.42}>
      {/* lower body */}
      <RoundedBox args={[2.2, 0.32, 1.02]} radius={0.12} smoothness={4} position={[0, 0.22, 0]}>
        <meshStandardMaterial color="#b8350d" metalness={0.5} roughness={0.45} emissive="#7a2208" emissiveIntensity={0.2} />
      </RoundedBox>
      {/* main shell */}
      <RoundedBox args={[2.0, 0.5, 0.96]} radius={0.16} smoothness={4} position={[0.02, 0.46, 0]}>
        <meshStandardMaterial color="#ff7a18" metalness={0.45} roughness={0.28} emissive="#ff5a1e" emissiveIntensity={0.3} />
      </RoundedBox>
      {/* cabin / glass */}
      <RoundedBox args={[0.95, 0.42, 0.8]} radius={0.14} smoothness={4} position={[-0.12, 0.78, 0]}>
        <meshStandardMaterial color="#15101a" metalness={0.9} roughness={0.08} />
      </RoundedBox>
      {/* spoiler */}
      <mesh position={[-1.0, 0.78, 0]}>
        <boxGeometry args={[0.12, 0.05, 0.95]} />
        <meshStandardMaterial color="#15101a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.95, 0.66, 0.4]}><boxGeometry args={[0.06, 0.2, 0.05]} /><meshStandardMaterial color="#15101a" /></mesh>
      <mesh position={[-0.95, 0.66, -0.4]}><boxGeometry args={[0.06, 0.2, 0.05]} /><meshStandardMaterial color="#15101a" /></mesh>

      {/* headlights */}
      <mesh position={[1.02, 0.46, 0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#ffd27a" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <mesh position={[1.02, 0.46, -0.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#ffd27a" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <pointLight position={[1.6, 0.5, 0]} color="#ffb060" intensity={6} distance={5} decay={2} />
      {/* taillights */}
      <mesh position={[-1.06, 0.46, 0.32]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#ff2a1a" emissive="#ff2a1a" emissiveIntensity={3} toneMapped={false} /></mesh>
      <mesh position={[-1.06, 0.46, -0.32]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color="#ff2a1a" emissive="#ff2a1a" emissiveIntensity={3} toneMapped={false} /></mesh>

      {/* wheels */}
      {WHEELS.map((p, i) => (
        <group key={i} position={p} ref={(el) => { wheels.current[i] = el }}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.22, 26]} />
            <meshStandardMaterial color="#0c0a0e" metalness={0.4} roughness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.24, 16]} />
            <meshStandardMaterial color="#ff7a18" emissive="#ff5a1e" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function CarCursor() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 9, 6.5], fov: 32 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 9, 5]} intensity={1.4} />
      <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#ff7a18" />
      <Car />
    </Canvas>
  )
}
