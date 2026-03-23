"use client"

import { useEffect, useState } from "react"

interface Block {
  id: number
  page: string
  block_type: string
  content: Record<string, string>
  position_x: number
  position_y: number
  width: number
  height: number
  z_index: number
  styles: Record<string, string>
}

export function CustomBlocksRenderer({ page }: { page: string }) {
  const [blocks, setBlocks] = useState<Block[]>([])

  useEffect(() => {
    fetch(`/api/admin/blocks?page=${page}`)
      .then((r) => r.json())
      .then((d) => setBlocks(d.blocks || []))
      .catch(() => {})
  }, [page])

  if (blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
        const s = block.styles || {}
        const isBg = block.content.mode === "background"

        const base: React.CSSProperties = {
          position: "absolute",
          left: block.position_x,
          top: block.position_y,
          width: block.width,
          minHeight: block.height,
          zIndex: isBg ? 0 : block.z_index,
          borderRadius: s.borderRadius || "0px",
          opacity: s.opacity ? Number(s.opacity) : 1,
          transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined,
          filter: s.blur ? `blur(${s.blur}px)` : undefined,
          boxShadow: s.shadow || "none",
          overflow: "hidden",
          pointerEvents: isBg ? "none" : "auto",
        }

        switch (block.block_type) {
          case "text":
            return (
              <div key={block.id} style={{
                ...base,
                padding: s.padding || "8px",
                color: s.color || "#fff",
                fontSize: s.fontSize || "18px",
                backgroundColor: s.bgColor || "transparent",
                fontWeight: s.fontWeight || "normal",
                fontFamily: s.fontFamily || "inherit",
                lineHeight: s.lineHeight || "1.5",
                textAlign: (s.textAlign as React.CSSProperties["textAlign"]) || "left",
                letterSpacing: s.letterSpacing || "normal",
              }}
                dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || "" }}
              />
            )

          case "image":
            return (
              <div key={block.id} style={{ ...base, position: isBg ? "absolute" : "absolute" }}>
                {block.content.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={block.content.src} alt={block.content.alt || ""} style={{ width: "100%", height: "100%", objectFit: (block.content.fit as React.CSSProperties["objectFit"]) || "cover", borderRadius: "inherit" }} />
                )}
                {block.content.overlay && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: `rgba(0,0,0,${s.overlayOpacity || "0.5"})`, color: "white", fontSize: s.overlaySize || "24px", fontWeight: "bold", padding: "16px", textAlign: "center", borderRadius: "inherit" }}>
                    {block.content.overlay}
                  </div>
                )}
              </div>
            )

          case "video":
            return (
              <div key={block.id} style={base}>
                {block.content.src && (
                  <video src={block.content.src} autoPlay muted={block.content.muted !== "false"} loop={block.content.loop !== "false"} playsInline style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                )}
                {block.content.overlay && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: `rgba(0,0,0,${s.overlayOpacity || "0.5"})`, color: "white", fontSize: s.overlaySize || "28px", fontWeight: "bold", padding: "20px", textAlign: "center" }}>
                    {block.content.overlay}
                  </div>
                )}
              </div>
            )

          case "code":
            return (
              <div key={block.id} style={{ ...base, padding: "12px", backgroundColor: s.bgColor || "#1e1e1e", color: s.color || "#d4d4d4", fontFamily: "'JetBrains Mono', monospace", fontSize: s.fontSize || "13px", whiteSpace: "pre-wrap" }}>
                <pre style={{ margin: 0 }}><code>{block.content.code || ""}</code></pre>
              </div>
            )

          case "divider":
            return (
              <div key={block.id} style={{ ...base, display: "flex", alignItems: "center" }}>
                <hr style={{ width: "100%", border: "none", borderTop: `${s.thickness || "2px"} ${s.lineStyle || "solid"} ${s.color || "rgba(255,255,255,0.2)"}` }} />
              </div>
            )

          case "shape":
            return (
              <div key={block.id} style={{
                ...base,
                backgroundColor: s.bgColor || "rgba(99,102,241,0.15)",
                backgroundImage: block.content.src ? `url(${block.content.src})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 0,
                pointerEvents: "none",
              }}>
                {block.content.overlay && (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: s.overlaySize || "20px", fontWeight: "bold" }}>
                    {block.content.overlay}
                  </div>
                )}
              </div>
            )

          case "spacer":
            return <div key={block.id} style={{ ...base, backgroundColor: "transparent" }} />

          default:
            return null
        }
      })}
    </>
  )
}
