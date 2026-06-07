/**
 * Akasha morph targets.
 *
 * Three position buffers of identical length, so a particle can be linearly
 * interpolated from one form to the next as the visitor scrolls:
 *
 *   1. CHAOS      — uniform random points in a sphere (the unformed ether)
 *   2. SACRED     — a Fibonacci/phyllotaxis sphere; points spaced by the golden
 *                   angle (137.5°), the same growth law as sunflowers and galaxies
 *   3. SOLID      — points sampled on the surface of a dodecahedron, the Platonic
 *                   solid Plato assigned to the heavens / aether (the fifth element)
 *
 * Chaos → sacred order → crystalline form. The whole arc of "Akasha condensing".
 */

import * as THREE from "three"

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)) // ≈ 2.39996 rad (137.5°)

/** Uniform random points inside a sphere of the given radius. */
export function chaosCloud(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Rejection-free: random direction × cube-root radius for uniform density.
    const u = Math.random()
    const v = Math.random()
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const r = radius * Math.cbrt(Math.random())
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

/** Fibonacci sphere — points distributed by the golden angle. Sacred order. */
export function phyllotaxisSphere(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2 // y ∈ [1, -1]
    const r = Math.sqrt(1 - y * y)
    const theta = GOLDEN_ANGLE * i
    arr[i * 3] = Math.cos(theta) * r * radius
    arr[i * 3 + 1] = y * radius
    arr[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return arr
}

/** Sample `count` points across the surface of a dodecahedron (area-weighted). */
export function dodecahedronSurface(count: number, radius: number): Float32Array {
  const geo = new THREE.DodecahedronGeometry(radius, 0)
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo
  const pos = nonIndexed.getAttribute("position") as THREE.BufferAttribute
  const triCount = pos.count / 3

  // Cumulative areas for weighted triangle selection.
  const areas = new Float32Array(triCount)
  let total = 0
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, t * 3)
    b.fromBufferAttribute(pos, t * 3 + 1)
    c.fromBufferAttribute(pos, t * 3 + 2)
    const area = b.clone().sub(a).cross(c.clone().sub(a)).length() * 0.5
    total += area
    areas[t] = total
  }

  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Pick a triangle weighted by area (binary search the cumulative table).
    const target = Math.random() * total
    let lo = 0
    let hi = triCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (areas[mid] < target) lo = mid + 1
      else hi = mid
    }
    const t = lo
    a.fromBufferAttribute(pos, t * 3)
    b.fromBufferAttribute(pos, t * 3 + 1)
    c.fromBufferAttribute(pos, t * 3 + 2)

    // Uniform random barycentric coordinates within the triangle.
    let r1 = Math.random()
    let r2 = Math.random()
    if (r1 + r2 > 1) {
      r1 = 1 - r1
      r2 = 1 - r2
    }
    out[i * 3] = a.x + r1 * (b.x - a.x) + r2 * (c.x - a.x)
    out[i * 3 + 1] = a.y + r1 * (b.y - a.y) + r2 * (c.y - a.y)
    out[i * 3 + 2] = a.z + r1 * (b.z - a.z) + r2 * (c.z - a.z)
  }

  geo.dispose()
  if (nonIndexed !== geo) nonIndexed.dispose()
  return out
}

/** Per-particle random scalars (size / phase variation). */
export function randomSeeds(count: number): Float32Array {
  const arr = new Float32Array(count)
  for (let i = 0; i < count; i++) arr[i] = Math.random()
  return arr
}
