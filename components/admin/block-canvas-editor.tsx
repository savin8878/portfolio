"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  Type, ImageIcon, Video, Code2, Minus, Square, Trash2, Copy, Layers, Monitor,
  Tablet, Smartphone, RefreshCw, ExternalLink, Lock, Unlock, Eye, EyeOff,
  ArrowUp, ArrowDown, RotateCw, Maximize, Image as ImageBg, Move,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// ─── Types ───
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
  is_visible: boolean
}

const BLOCK_TYPES = [
  { type: "text", label: "Text Block", icon: Type, desc: "Heading, paragraph, or label" },
  { type: "image", label: "Image", icon: ImageIcon, desc: "Photo or graphic" },
  { type: "video", label: "Video", icon: Video, desc: "Video embed" },
  { type: "code", label: "Code", icon: Code2, desc: "Code snippet" },
  { type: "divider", label: "Divider", icon: Minus, desc: "Separator line" },
  { type: "shape", label: "Shape / BG", icon: Square, desc: "Color or image background" },
]

const DEF: Record<string, { c: Record<string, string>; w: number; h: number; s?: Record<string, string> }> = {
  text: { c: { text: "Double-click to edit" }, w: 350, h: 50, s: { color: "#ffffff", fontSize: "18px", bgColor: "transparent" } },
  image: { c: { src: "", alt: "Image", fit: "cover", mode: "normal" }, w: 400, h: 280 },
  video: { c: { src: "", muted: "true", loop: "true", controls: "true", mode: "normal" }, w: 480, h: 270 },
  code: { c: { code: "console.log('hello')" }, w: 450, h: 160, s: { bgColor: "#1e1e1e", color: "#d4d4d4", fontSize: "13px" } },
  divider: { c: {}, w: 500, h: 4, s: { color: "rgba(255,255,255,0.2)", thickness: "2px" } },
  shape: { c: { mode: "background" }, w: 500, h: 300, s: { bgColor: "rgba(99,102,241,0.15)", borderRadius: "12px" } },
}

export function BlockCanvasEditor({ page }: { page: string }) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [ctx, setCtx] = useState<{ x: number; y: number; rx: number; ry: number } | null>(null)
  const [drag, setDrag] = useState<{ id: number; sx: number; sy: number; ox: number; oy: number } | null>(null)
  const [rsz, setRsz] = useState<{ id: number; sx: number; sy: number; ow: number; oh: number; dir: string } | null>(null)
  const [editing, setEditing] = useState<number | null>(null)
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [pk, setPk] = useState(0)
  const ovRef = useRef<HTMLDivElement>(null)
  const path = page === "home" ? "/" : `/${page}`
  const vpW = { desktop: "100%", tablet: "768px", mobile: "375px" }

  useEffect(() => {
    fetch(`/api/admin/blocks?page=${page}`).then((r) => r.json()).then((d) => setBlocks(d.blocks || [])).catch(() => {})
  }, [page])

  // ─── CRUD ───
  const create = useCallback(async (type: string, x: number, y: number) => {
    const d = DEF[type] || DEF.text
    try {
      const r = await fetch("/api/admin/blocks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, block_type: type, content: d.c, position_x: x, position_y: y, width: d.w, height: d.h, z_index: (blocks.length + 1) * 10, styles: d.s || {} }),
      })
      const data = await r.json()
      if (data.block) { setBlocks((p) => [...p, data.block]); setSel(data.block.id) }
    } catch {}
    setCtx(null)
  }, [page, blocks.length])

  const update = useCallback(async (id: number, upd: Partial<Block>) => {
    setBlocks((p) => p.map((b) => b.id === id ? { ...b, ...upd } : b))
    try { await fetch("/api/admin/blocks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...upd }) }) } catch {}
  }, [])

  const remove = useCallback(async (id: number) => {
    setBlocks((p) => p.filter((b) => b.id !== id)); setSel(null)
    try { await fetch(`/api/admin/blocks?id=${id}`, { method: "DELETE" }) } catch {}
  }, [])

  const dup = useCallback(async (id: number) => {
    const b = blocks.find((bl) => bl.id === id); if (!b) return
    create(b.block_type, b.position_x + 20, b.position_y + 20)
  }, [blocks, create])

  const bringForward = useCallback((id: number) => {
    const b = blocks.find((bl) => bl.id === id); if (!b) return
    update(id, { z_index: b.z_index + 10 })
  }, [blocks, update])

  const sendBack = useCallback((id: number) => {
    const b = blocks.find((bl) => bl.id === id); if (!b) return
    update(id, { z_index: Math.max(1, b.z_index - 10) })
  }, [blocks, update])

  // ─── Drag ───
  const onDown = useCallback((e: React.MouseEvent, id: number) => {
    if ((e.target as HTMLElement).dataset.resize || (e.target as HTMLElement).closest("[data-resize]")) return
    if (blocks.find((b) => b.id === id)?.styles?.locked === "true") return
    e.preventDefault(); e.stopPropagation()
    const b = blocks.find((bl) => bl.id === id); if (!b) return
    setSel(id); setEditing(null)
    setDrag({ id, sx: e.clientX, sy: e.clientY, ox: b.position_x, oy: b.position_y })
  }, [blocks])

  const onRszDown = useCallback((e: React.MouseEvent, id: number, dir: string) => {
    e.preventDefault(); e.stopPropagation()
    const b = blocks.find((bl) => bl.id === id); if (!b) return
    setRsz({ id, sx: e.clientX, sy: e.clientY, ow: b.width, oh: b.height, dir })
  }, [blocks])

  useEffect(() => {
    if (!drag && !rsz) return
    const move = (e: MouseEvent) => {
      if (drag) {
        const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy
        setBlocks((p) => p.map((b) => b.id === drag.id ? { ...b, position_x: Math.round(Math.max(0, drag.ox + dx)), position_y: Math.round(Math.max(0, drag.oy + dy)) } : b))
      }
      if (rsz) {
        const dx = e.clientX - rsz.sx, dy = e.clientY - rsz.sy
        setBlocks((p) => p.map((b) => {
          if (b.id !== rsz.id) return b
          let w = rsz.ow, h = rsz.oh
          if (rsz.dir.includes("r")) w = Math.max(30, rsz.ow + dx)
          if (rsz.dir.includes("b")) h = Math.max(16, rsz.oh + dy)
          if (rsz.dir.includes("l")) w = Math.max(30, rsz.ow - dx)
          return { ...b, width: Math.round(w), height: Math.round(h), ...(rsz.dir.includes("l") ? { position_x: Math.round(Math.max(0, drag ? drag.ox : b.position_x + dx)) } : {}) }
        }))
      }
    }
    const up = () => {
      if (drag) { const b = blocks.find((bl) => bl.id === drag.id); if (b) update(b.id, { position_x: b.position_x, position_y: b.position_y }) }
      if (rsz) { const b = blocks.find((bl) => bl.id === rsz.id); if (b) update(b.id, { width: b.width, height: b.height }) }
      setDrag(null); setRsz(null)
    }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up) }
  }, [drag, rsz, blocks, update])

  // ─── Double-click ───
  const onDblClick = useCallback((e: React.MouseEvent) => {
    const blockEl = (e.target as HTMLElement).closest("[data-block]")
    if (blockEl) {
      const id = Number(blockEl.getAttribute("data-block-id"))
      if (id) { setEditing(id); setSel(id) }
      return
    }
    const rect = ovRef.current?.getBoundingClientRect(); if (!rect) return
    create("text", Math.round(e.clientX - rect.left + (ovRef.current?.scrollLeft || 0)), Math.round(e.clientY - rect.top + (ovRef.current?.scrollTop || 0)))
  }, [create])

  // ─── Right-click ───
  const onRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const rect = ovRef.current?.getBoundingClientRect(); if (!rect) return
    setCtx({ x: e.clientX, y: e.clientY, rx: Math.round(e.clientX - rect.left + (ovRef.current?.scrollLeft || 0)), ry: Math.round(e.clientY - rect.top + (ovRef.current?.scrollTop || 0)) })
  }, [])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sel) return
      if (e.key === "Delete" || e.key === "Backspace") { if (!editing) remove(sel) }
      if (e.key === "Escape") { setSel(null); setEditing(null) }
      if (e.ctrlKey && e.key === "d") { e.preventDefault(); dup(sel) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sel, editing, remove, dup])

  const selected = sel ? blocks.find((b) => b.id === sel) : null

  // ─── Block renderer ───
  function renderBlock(block: Block) {
    const isEditing = editing === block.id
    const s = block.styles || {}
    const isBg = block.content.mode === "background" || block.block_type === "shape"

    const base: React.CSSProperties = {
      width: "100%", height: "100%", borderRadius: s.borderRadius || "0px",
      opacity: s.opacity ? Number(s.opacity) : 1,
      transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined,
      filter: s.blur ? `blur(${s.blur}px)` : undefined,
      boxShadow: s.shadow || "none",
      overflow: "hidden",
    }

    switch (block.block_type) {
      case "text":
        return isEditing ? (
          <div
            contentEditable
            suppressContentEditableWarning
            style={{ ...base, padding: s.padding || "8px", color: s.color || "#fff", fontSize: s.fontSize || "18px", backgroundColor: s.bgColor || "transparent", fontWeight: s.fontWeight || "normal", fontFamily: s.fontFamily || "inherit", lineHeight: s.lineHeight || "1.5", textAlign: (s.textAlign as React.CSSProperties["textAlign"]) || "left", outline: "none", cursor: "text", letterSpacing: s.letterSpacing || "normal" }}
            onBlur={(e) => {
              const html = e.currentTarget.innerHTML
              const text = e.currentTarget.innerText
              update(block.id, { content: { ...block.content, text, html } })
              setEditing(null)
            }}
            dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || "" }}
          />
        ) : (
          <div style={{ ...base, padding: s.padding || "8px", color: s.color || "#fff", fontSize: s.fontSize || "18px", backgroundColor: s.bgColor || "transparent", fontWeight: s.fontWeight || "normal", fontFamily: s.fontFamily || "inherit", lineHeight: s.lineHeight || "1.5", textAlign: (s.textAlign as React.CSSProperties["textAlign"]) || "left", letterSpacing: s.letterSpacing || "normal" }}
            dangerouslySetInnerHTML={{ __html: block.content.html || block.content.text || "" }}
          />
        )

      case "image":
        return (
          <div style={{ ...base, backgroundColor: "#222", position: "relative" }}>
            {block.content.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={block.content.src} alt={block.content.alt || ""} style={{ width: "100%", height: "100%", objectFit: (block.content.fit as React.CSSProperties["objectFit"]) || "cover", borderRadius: "inherit" }} />
            ) : (
              <div className="flex items-center justify-center h-full"><ImageIcon className="h-10 w-10 text-white/30" /></div>
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
          <div style={{ ...base, backgroundColor: "#111", position: "relative" }}>
            {block.content.src ? (
              <video src={block.content.src} muted loop autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
            ) : (
              <div className="flex items-center justify-center h-full"><Video className="h-10 w-10 text-white/30" /></div>
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
          <div style={{ ...base, padding: "12px", backgroundColor: s.bgColor || "#1e1e1e", color: s.color || "#d4d4d4", fontFamily: "'JetBrains Mono', monospace", fontSize: s.fontSize || "13px", whiteSpace: "pre-wrap", overflowX: "auto" }}>
            <code>{block.content.code || ""}</code>
          </div>
        )

      case "divider":
        return (
          <div style={{ ...base, display: "flex", alignItems: "center" }}>
            <hr style={{ width: "100%", border: "none", borderTop: `${s.thickness || "2px"} ${s.lineStyle || "solid"} ${s.color || "rgba(255,255,255,0.2)"}` }} />
          </div>
        )

      case "shape":
        return (
          <div style={{ ...base, backgroundColor: s.bgColor || "rgba(99,102,241,0.15)", backgroundImage: block.content.src ? `url(${block.content.src})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
            {block.content.overlay && (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: s.overlaySize || "20px", fontWeight: "bold" }}>
                {block.content.overlay}
              </div>
            )}
          </div>
        )

      default: return null
    }
  }

  return (
    <div className="flex h-full">
      {/* ─── Canvas ─── */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-1 bg-muted rounded p-0.5">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([v, I]) => (
              <Button key={v} variant={viewport === v ? "default" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setViewport(v)}><I className="h-3 w-3" /></Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">Double-click = edit/add · Right-click = add block · Del = delete · Ctrl+D = duplicate</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setPk((k) => k + 1)}><RefreshCw className="h-3 w-3 mr-1" />Refresh</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => window.open(path, "_blank")}><ExternalLink className="h-3 w-3 mr-1" />Live</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex justify-center p-4">
          <div style={{ width: vpW[viewport], maxWidth: "100%", transition: "width 0.3s" }} className="relative bg-white dark:bg-background rounded-lg shadow-xl border overflow-hidden">
            <div className="bg-muted/50 px-3 py-1.5 border-b flex items-center gap-2">
              <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" /></div>
              <div className="flex-1 bg-background rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono">{path === "/" ? "localhost:3000" : `localhost:3000${path}`}</div>
            </div>

            <div className="relative" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
              <iframe key={pk} src={`${path}?t=${Date.now()}`} className="w-full h-full border-0" style={{ pointerEvents: drag || rsz ? "none" : "auto" }} title="Preview" />

              {/* Block overlay */}
              <div ref={ovRef} className="absolute inset-0 overflow-auto" style={{ pointerEvents: "auto", zIndex: 10 }}
                onDoubleClick={onDblClick} onContextMenu={onRightClick}
                onClick={(e) => { if (!(e.target as HTMLElement).closest("[data-block]") && !(e.target as HTMLElement).closest("[data-resize]")) { setSel(null); setEditing(null); setCtx(null) } }}
              >
                {blocks.sort((a, b) => a.z_index - b.z_index).map((block) => (
                  <div
                    key={block.id}
                    data-block
                    data-block-id={block.id}
                    style={{
                      position: "absolute", left: block.position_x, top: block.position_y, width: block.width, height: block.height,
                      zIndex: block.z_index,
                      outline: sel === block.id ? "2px solid #6366f1" : block.styles?.locked === "true" ? "1px dashed #f59e0b40" : "1px dashed rgba(99,102,241,0.25)",
                      cursor: block.styles?.locked === "true" ? "not-allowed" : drag?.id === block.id ? "grabbing" : editing === block.id ? "text" : "grab",
                      borderRadius: block.styles?.borderRadius || "0px",
                    }}
                    onMouseDown={(e) => onDown(e, block.id)}
                    onClick={(e) => { e.stopPropagation(); setSel(block.id); setCtx(null) }}
                  >
                    {renderBlock(block)}

                    {/* Selection UI */}
                    {sel === block.id && (
                      <>
                        {/* Resize handles — all 4 corners + midpoints */}
                        {["br", "bl", "tr", "tl", "r", "b"].map((dir) => {
                          const pos: React.CSSProperties = dir === "br" ? { right: -5, bottom: -5, cursor: "se-resize" }
                            : dir === "bl" ? { left: -5, bottom: -5, cursor: "sw-resize" }
                            : dir === "tr" ? { right: -5, top: -5, cursor: "ne-resize" }
                            : dir === "tl" ? { left: -5, top: -5, cursor: "nw-resize" }
                            : dir === "r" ? { right: -5, top: "50%", marginTop: -5, cursor: "e-resize" }
                            : { bottom: -5, left: "50%", marginLeft: -5, cursor: "s-resize" }
                          return (
                            <div key={dir} data-resize onMouseDown={(e) => onRszDown(e, block.id, dir)} style={{ position: "absolute", width: 10, height: 10, backgroundColor: "#6366f1", borderRadius: 2, zIndex: 999, ...pos }} />
                          )
                        })}
                        {/* Label */}
                        <div style={{ position: "absolute", top: -22, left: 0, fontSize: "9px", color: "white", backgroundColor: "#6366f1", padding: "1px 8px", borderRadius: "3px 3px 0 0", whiteSpace: "nowrap", zIndex: 999 }}>
                          {block.block_type} · {block.width}×{block.height}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Context menu */}
              {ctx && (
                <div style={{ position: "fixed", left: ctx.x, top: ctx.y, zIndex: 99999 }} className="bg-background border rounded-lg shadow-2xl py-1 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                  <div className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Add Block</div>
                  {BLOCK_TYPES.map((bt) => (
                    <button key={bt.type} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left" onClick={() => create(bt.type, ctx.rx, ctx.ry)}>
                      <bt.icon className="h-3.5 w-3.5 text-accent" />
                      <div><div className="font-medium">{bt.label}</div><div className="text-[9px] text-muted-foreground">{bt.desc}</div></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Properties Panel ─── */}
      <div className="w-72 border-l bg-background overflow-y-auto flex-shrink-0">
        {selected ? (
          <div>
            {/* Header */}
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <span className="text-sm font-semibold capitalize">{selected.block_type}</span>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Bring Forward" onClick={() => bringForward(selected.id)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Send Back" onClick={() => sendBack(selected.id)}><ArrowDown className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Duplicate" onClick={() => dup(selected.id)}><Copy className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title={selected.styles?.locked === "true" ? "Unlock" : "Lock"} onClick={() => update(selected.id, { styles: { ...selected.styles, locked: selected.styles?.locked === "true" ? "false" : "true" } })}>
                  {selected.styles?.locked === "true" ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => remove(selected.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>

            <div className="p-3 space-y-3 text-xs">
              {/* ── Content ── */}
              <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Content</div>

              {selected.block_type === "text" && (
                <div className="space-y-1"><Label className="text-[10px]">Text (edit inline by double-clicking)</Label>
                  <Textarea value={selected.content.text || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, text: e.target.value, html: e.target.value.split("\n").map((l) => `<p>${l}</p>`).join("") } })} rows={3} className="text-xs" /></div>
              )}
              {(selected.block_type === "image" || selected.block_type === "shape") && (<>
                <div className="space-y-1"><Label className="text-[10px]">{selected.block_type === "shape" ? "Background Image URL (optional)" : "Image URL"}</Label>
                  <Input value={selected.content.src || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, src: e.target.value } })} placeholder="https://..." className="text-[10px] h-7" /></div>
                <div className="space-y-1"><Label className="text-[10px]">Overlay Text</Label>
                  <Input value={selected.content.overlay || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, overlay: e.target.value } })} placeholder="Text on top..." className="text-[10px] h-7" /></div>
                {selected.block_type === "image" && (
                  <div className="space-y-1"><Label className="text-[10px]">Use as Background</Label>
                    <Switch checked={selected.content.mode === "background"} onCheckedChange={(v) => update(selected.id, { content: { ...selected.content, mode: v ? "background" : "normal" } })} /></div>
                )}
              </>)}
              {selected.block_type === "video" && (<>
                <div className="space-y-1"><Label className="text-[10px]">Video URL</Label>
                  <Input value={selected.content.src || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, src: e.target.value } })} className="text-[10px] h-7" /></div>
                <div className="space-y-1"><Label className="text-[10px]">Overlay Text</Label>
                  <Input value={selected.content.overlay || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, overlay: e.target.value } })} className="text-[10px] h-7" /></div>
                <div className="space-y-1"><Label className="text-[10px]">Use as Background</Label>
                  <Switch checked={selected.content.mode === "background"} onCheckedChange={(v) => update(selected.id, { content: { ...selected.content, mode: v ? "background" : "normal" } })} /></div>
              </>)}
              {selected.block_type === "code" && (
                <div className="space-y-1"><Label className="text-[10px]">Code</Label>
                  <Textarea value={selected.content.code || ""} onChange={(e) => update(selected.id, { content: { ...selected.content, code: e.target.value } })} rows={6} className="text-[10px] font-mono" /></div>
              )}

              {/* ── Position ── */}
              <div className="pt-2 border-t font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Position & Size</div>
              <div className="grid grid-cols-4 gap-1">
                {([["X", "position_x"], ["Y", "position_y"], ["W", "width"], ["H", "height"]] as const).map(([l, k]) => (
                  <div key={k}><Label className="text-[9px] text-muted-foreground">{l}</Label>
                    <Input type="number" value={Math.round((selected as Record<string, number>)[k] || 0)} onChange={(e) => update(selected.id, { [k]: Number(e.target.value) } as Partial<Block>)} className="text-[10px] h-6 px-1" /></div>
                ))}
              </div>

              {/* ── Typography (text blocks) ── */}
              {selected.block_type === "text" && (<>
                <div className="pt-2 border-t font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Typography</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-[9px] text-muted-foreground">Font Size</Label>
                    <Input value={selected.styles?.fontSize || "18px"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, fontSize: e.target.value } })} className="text-[10px] h-6" /></div>
                  <div><Label className="text-[9px] text-muted-foreground">Weight</Label>
                    <Select value={selected.styles?.fontWeight || "normal"} onValueChange={(v) => update(selected.id, { styles: { ...selected.styles, fontWeight: v } })}>
                      <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="300">Light</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="500">Medium</SelectItem><SelectItem value="600">Semibold</SelectItem><SelectItem value="bold">Bold</SelectItem><SelectItem value="800">Extra Bold</SelectItem></SelectContent>
                    </Select></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-[9px] text-muted-foreground">Align</Label>
                    <Select value={selected.styles?.textAlign || "left"} onValueChange={(v) => update(selected.id, { styles: { ...selected.styles, textAlign: v } })}>
                      <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="left">Left</SelectItem><SelectItem value="center">Center</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent>
                    </Select></div>
                  <div><Label className="text-[9px] text-muted-foreground">Line Height</Label>
                    <Input value={selected.styles?.lineHeight || "1.5"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, lineHeight: e.target.value } })} className="text-[10px] h-6" /></div>
                </div>
                <div><Label className="text-[9px] text-muted-foreground">Letter Spacing</Label>
                  <Input value={selected.styles?.letterSpacing || "normal"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, letterSpacing: e.target.value } })} placeholder="normal, 1px, 0.05em" className="text-[10px] h-6" /></div>
                <div><Label className="text-[9px] text-muted-foreground">Font Family</Label>
                  <Select value={selected.styles?.fontFamily || "inherit"} onValueChange={(v) => update(selected.id, { styles: { ...selected.styles, fontFamily: v } })}>
                    <SelectTrigger className="h-6 text-[10px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="inherit">Default</SelectItem><SelectItem value="Inter, sans-serif">Inter</SelectItem><SelectItem value="Georgia, serif">Georgia</SelectItem><SelectItem value="'JetBrains Mono', monospace">Monospace</SelectItem><SelectItem value="system-ui">System UI</SelectItem></SelectContent>
                  </Select></div>
              </>)}

              {/* ── Colors ── */}
              <div className="pt-2 border-t font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Colors</div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-[9px] text-muted-foreground">Text</Label>
                  <div className="flex gap-1"><input type="color" value={selected.styles?.color || "#ffffff"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, color: e.target.value } })} className="w-6 h-6 rounded cursor-pointer border-0" />
                    <Input value={selected.styles?.color || ""} onChange={(e) => update(selected.id, { styles: { ...selected.styles, color: e.target.value } })} className="text-[10px] h-6 font-mono" /></div></div>
                <div><Label className="text-[9px] text-muted-foreground">Background</Label>
                  <div className="flex gap-1"><input type="color" value={(selected.styles?.bgColor || "#000000").replace("transparent", "#000000")} onChange={(e) => update(selected.id, { styles: { ...selected.styles, bgColor: e.target.value } })} className="w-6 h-6 rounded cursor-pointer border-0" />
                    <Input value={selected.styles?.bgColor || ""} onChange={(e) => update(selected.id, { styles: { ...selected.styles, bgColor: e.target.value } })} placeholder="transparent" className="text-[10px] h-6 font-mono" /></div></div>
              </div>

              {/* ── Effects ── */}
              <div className="pt-2 border-t font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Effects</div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-[9px] text-muted-foreground">Opacity</Label>
                  <Input type="number" min="0" max="1" step="0.1" value={selected.styles?.opacity || "1"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, opacity: e.target.value } })} className="text-[10px] h-6" /></div>
                <div><Label className="text-[9px] text-muted-foreground">Blur</Label>
                  <Input type="number" min="0" step="1" value={selected.styles?.blur || "0"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, blur: e.target.value } })} className="text-[10px] h-6" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-[9px] text-muted-foreground">Rotation (deg)</Label>
                  <Input type="number" value={selected.styles?.rotation || "0"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, rotation: e.target.value } })} className="text-[10px] h-6" /></div>
                <div><Label className="text-[9px] text-muted-foreground">Border Radius</Label>
                  <Input value={selected.styles?.borderRadius || "0px"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, borderRadius: e.target.value } })} className="text-[10px] h-6" /></div>
              </div>
              <div><Label className="text-[9px] text-muted-foreground">Box Shadow</Label>
                <Input value={selected.styles?.shadow || ""} onChange={(e) => update(selected.id, { styles: { ...selected.styles, shadow: e.target.value } })} placeholder="0 4px 20px rgba(0,0,0,0.3)" className="text-[10px] h-6" /></div>
              <div><Label className="text-[9px] text-muted-foreground">Padding</Label>
                <Input value={selected.styles?.padding || "0px"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, padding: e.target.value } })} className="text-[10px] h-6" /></div>

              {/* Overlay settings for image/video/shape */}
              {(selected.block_type === "image" || selected.block_type === "video" || selected.block_type === "shape") && selected.content.overlay && (<>
                <div className="pt-2 border-t font-semibold text-[10px] text-muted-foreground uppercase tracking-wide">Overlay</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-[9px] text-muted-foreground">Font Size</Label>
                    <Input value={selected.styles?.overlaySize || "24px"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, overlaySize: e.target.value } })} className="text-[10px] h-6" /></div>
                  <div><Label className="text-[9px] text-muted-foreground">Opacity</Label>
                    <Input type="number" min="0" max="1" step="0.1" value={selected.styles?.overlayOpacity || "0.5"} onChange={(e) => update(selected.id, { styles: { ...selected.styles, overlayOpacity: e.target.value } })} className="text-[10px] h-6" /></div>
                </div>
              </>)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Layers className="h-8 w-8 text-muted-foreground/15 mb-3" />
            <p className="text-xs font-medium text-muted-foreground">No block selected</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1 leading-relaxed">Double-click on preview to add text<br/>Right-click for more block types<br/>Del to delete · Ctrl+D to duplicate</p>
            <div className="grid grid-cols-2 gap-1.5 w-full mt-4">
              {BLOCK_TYPES.map((bt) => (
                <Button key={bt.type} variant="outline" size="sm" className="h-8 text-[10px] gap-1 justify-start" onClick={() => create(bt.type, 50, 100 + blocks.length * 40)}>
                  <bt.icon className="h-3 w-3" />{bt.label}
                </Button>
              ))}
            </div>
            {blocks.length > 0 && (
              <div className="mt-4 w-full border-t pt-3 text-left">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1.5">Blocks ({blocks.length})</div>
                <div className="space-y-0.5 max-h-[200px] overflow-y-auto">
                  {blocks.map((b) => (
                    <button key={b.id} onClick={() => setSel(b.id)} className={`flex items-center gap-2 w-full px-2 py-1 rounded text-[10px] text-left transition-colors ${sel === b.id ? "bg-accent/10 text-accent" : "hover:bg-muted"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sel === b.id ? "bg-accent" : "bg-muted-foreground/30"}`} />
                      <span className="capitalize flex-1">{b.block_type}</span>
                      <span className="text-muted-foreground">{b.width}×{b.height}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
