import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_provider_settings (
      id SERIAL PRIMARY KEY, provider VARCHAR(50) NOT NULL, api_key TEXT NOT NULL,
      model VARCHAR(100) DEFAULT '', is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider)
    )
  `
}

const PROVIDERS: Record<string, { url: string; defaultModel: string; visionModel?: string }> = {
  google: { url: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", defaultModel: "gemini-2.0-flash", visionModel: "gemini-2.0-flash" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", defaultModel: "llama-3.3-70b-versatile", visionModel: "llama-3.2-90b-vision-preview" },
  openai: { url: "https://api.openai.com/v1/chat/completions", defaultModel: "gpt-4o-mini", visionModel: "gpt-4o-mini" },
  anthropic: { url: "https://api.anthropic.com/v1/messages", defaultModel: "claude-sonnet-4-20250514", visionModel: "claude-sonnet-4-20250514" },
}

async function getProvider() {
  await ensureTable()
  const rows = await sql`SELECT provider, api_key, model FROM ai_provider_settings WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
  if (rows.length === 0) return null
  return { provider: rows[0].provider as string, apiKey: rows[0].api_key as string, model: (rows[0].model as string) || "" }
}

const PARSE_PROMPT = `You are an expert resume parser. Extract ALL information from this resume and return ONLY valid JSON (no markdown, no code fences, no explanation) in this exact format:
{
  "profile": { "fullName": "", "title": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "", "summary": "" },
  "experiences": [{ "title": "", "company": "", "location": "", "startDate": "YYYY-MM-DD", "endDate": "", "isCurrent": false, "description": "", "achievements": [] }],
  "education": [{ "degree": "", "field": "", "institution": "", "startDate": "", "endDate": "YYYY-MM-DD", "description": "", "achievements": [] }],
  "certifications": [{ "name": "", "issuer": "", "date": "YYYY-MM-DD", "credentialId": "" }],
  "skillCategories": [{ "name": "Category", "skills": ["skill1"] }],
  "projects": [{ "title": "", "description": "", "techStack": [], "url": "" }]
}
Extract EVERY detail. For dates use YYYY-MM-DD. If "Present"/"Current", leave endDate empty and isCurrent=true. Group skills logically. Return ONLY JSON.`

// Call AI with text
async function callAIText(provider: string, apiKey: string, model: string, prompt: string, content: string): Promise<string> {
  const fullPrompt = `${prompt}\n\nRESUME CONTENT:\n${content}`

  if (provider === "google") {
    const url = PROVIDERS.google.url.replace("{model}", model || PROVIDERS.google.defaultModel)
    const res = await fetch(`${url}?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 8192 } }),
    })
    if (!res.ok) throw new Error(`Google: ${res.status} ${await res.text()}`)
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text || ""
  }
  if (provider === "anthropic") {
    const res = await fetch(PROVIDERS.anthropic.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: model || PROVIDERS.anthropic.defaultModel, max_tokens: 8192, messages: [{ role: "user", content: fullPrompt }] }),
    })
    if (!res.ok) throw new Error(`Anthropic: ${res.status}`)
    const d = await res.json()
    return d.content?.[0]?.text || ""
  }
  const url = provider === "groq" ? PROVIDERS.groq.url : PROVIDERS.openai.url
  const res = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || PROVIDERS[provider]?.defaultModel, messages: [{ role: "user", content: fullPrompt }], temperature: 0.2, max_tokens: 8192 }),
  })
  if (!res.ok) throw new Error(`${provider}: ${res.status}`)
  const d = await res.json()
  return d.choices?.[0]?.message?.content || ""
}

// Call AI with image (vision)
async function callAIVision(provider: string, apiKey: string, base64: string, mimeType: string): Promise<string> {
  const prompt = PARSE_PROMPT + "\n\nExtract all resume information from this image."

  if (provider === "google") {
    const visionModel = PROVIDERS.google.visionModel || "gemini-2.0-flash"
    const url = PROVIDERS.google.url.replace("{model}", visionModel)
    const res = await fetch(`${url}?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64 } }
        ] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
      }),
    })
    if (!res.ok) throw new Error(`Google Vision: ${res.status} ${await res.text()}`)
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text || ""
  }

  if (provider === "anthropic") {
    const res = await fetch(PROVIDERS.anthropic.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: PROVIDERS.anthropic.visionModel || "claude-sonnet-4-20250514",
        max_tokens: 8192,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    })
    if (!res.ok) throw new Error(`Anthropic Vision: ${res.status}`)
    const d = await res.json()
    return d.content?.[0]?.text || ""
  }

  // OpenAI / Groq vision
  const url = provider === "groq" ? PROVIDERS.groq.url : PROVIDERS.openai.url
  const vModel = provider === "groq" ? (PROVIDERS.groq.visionModel || "llama-3.2-90b-vision-preview") : (PROVIDERS.openai.visionModel || "gpt-4o-mini")
  const res = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: vModel,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
        ],
      }],
      temperature: 0.2, max_tokens: 8192,
    }),
  })
  if (!res.ok) throw new Error(`${provider} Vision: ${res.status}`)
  const d = await res.json()
  return d.choices?.[0]?.message?.content || ""
}

export async function POST(request: Request) {
  try {
    const prov = await getProvider()
    if (!prov) return NextResponse.json({ error: "No AI provider configured. Add an API key in the AI Tailor tab." }, { status: 400 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const mime = file.type || ""
    let aiResult = ""

    if (mime === "application/pdf" || file.name.endsWith(".pdf")) {
      // PDF: extract text then send to AI
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse")
      const pdfData = await pdfParse(buffer)
      const text = pdfData.text?.trim()
      if (!text) return NextResponse.json({ error: "Could not extract text from PDF. Try uploading an image instead." }, { status: 422 })
      aiResult = await callAIText(prov.provider, prov.apiKey, prov.model, PARSE_PROMPT, text)

    } else if (mime.startsWith("image/")) {
      // Image: send directly to vision AI
      const base64 = buffer.toString("base64")
      aiResult = await callAIVision(prov.provider, prov.apiKey, base64, mime)

    } else if (mime.startsWith("text/") || file.name.match(/\.(txt|md|csv|text)$/i)) {
      // Plain text
      const text = buffer.toString("utf-8")
      aiResult = await callAIText(prov.provider, prov.apiKey, prov.model, PARSE_PROMPT, text)

    } else {
      return NextResponse.json({ error: `Unsupported file type: ${mime}. Upload PDF, image (PNG/JPG), or text file.` }, { status: 400 })
    }

    // Parse JSON from AI response
    let parsed
    try {
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/)
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
      else parsed = JSON.parse(aiResult)
    } catch {
      return NextResponse.json({ error: "AI could not parse the resume. Please try a clearer file.", raw: aiResult.slice(0, 500) }, { status: 422 })
    }

    return NextResponse.json({ result: parsed, provider: prov.provider, fileType: mime })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Upload processing failed"
    console.error("Resume upload error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
