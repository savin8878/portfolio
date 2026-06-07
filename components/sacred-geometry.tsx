/**
 * SacredGeometry — the order hidden inside the chaos.
 *
 * The Flower of Life: nineteen circles on a triangular lattice, the figure the
 * ancients drew to encode how unity unfolds into multiplicity. Over it,
 * Metatron's Cube — every centre joined to every other — the thirteen points
 * from which the five Platonic solids (and so, classically, the five elements,
 * Akasha among them) can be derived.
 *
 * Pure geometry, computed deterministically: no randomness, server-safe. It sits
 * at a whisper of opacity so it is *felt* before it is consciously seen.
 */

const SQRT3 = Math.sqrt(3)

function flowerCenters(spacing: number) {
  const centers: { x: number; y: number }[] = []
  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      if (Math.abs(q + r) > 2) continue // hex radius 2 → exactly 19 points
      centers.push({
        x: spacing * (q + r / 2),
        y: spacing * (r * (SQRT3 / 2)),
      })
    }
  }
  return centers
}

export function SacredGeometry({ className = "" }: { className?: string }) {
  const R = 60 // circle radius == lattice spacing (so circles kiss)
  const centers = flowerCenters(R)

  // Metatron: the 13 inner-most centres, fully connected.
  const metatron = centers
    .filter((c) => Math.hypot(c.x, c.y) <= R * 2 + 0.5)
    .sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
    .slice(0, 13)

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let i = 0; i < metatron.length; i++) {
    for (let j = i + 1; j < metatron.length; j++) {
      lines.push({
        x1: metatron[i].x,
        y1: metatron[i].y,
        x2: metatron[j].x,
        y2: metatron[j].y,
      })
    }
  }

  return (
    <svg
      viewBox="-220 -220 440 440"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <g className="aether-spin" style={{ transformOrigin: "center" }}>
        {/* Metatron's Cube — the connective lattice */}
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.5">
          {lines.map((l, i) => (
            <line key={`l${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
        {/* Flower of Life — nineteen circles */}
        <g stroke="currentColor" strokeWidth="0.6">
          {centers.map((c, i) => (
            <circle key={`c${i}`} cx={c.x} cy={c.y} r={R} />
          ))}
        </g>
        {/* Bounding vesica + outer ring */}
        <circle cx="0" cy="0" r={R * 3} stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <circle cx="0" cy="0" r={R * 2} stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      </g>
    </svg>
  )
}
