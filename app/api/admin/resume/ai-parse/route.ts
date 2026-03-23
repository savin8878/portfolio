import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_provider_settings (
      id SERIAL PRIMARY KEY,
      provider VARCHAR(50) NOT NULL,
      api_key TEXT NOT NULL,
      model VARCHAR(100) DEFAULT '',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider)
    )
  `
}

const PROVIDERS: Record<string, { url: string; defaultModel: string }> = {
  google: { url: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", defaultModel: "gemini-2.0-flash" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", defaultModel: "llama-3.3-70b-versatile" },
  openai: { url: "https://api.openai.com/v1/chat/completions", defaultModel: "gpt-4o-mini" },
  anthropic: { url: "https://api.anthropic.com/v1/messages", defaultModel: "claude-sonnet-4-20250514" },
}

async function getProvider() {
  await ensureTable()
  const rows = await sql`SELECT provider, api_key, model FROM ai_provider_settings WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
  if (rows.length === 0) return null
  return { provider: rows[0].provider as string, apiKey: rows[0].api_key as string, model: (rows[0].model as string) || "" }
}

async function callAI(provider: string, apiKey: string, model: string, prompt: string): Promise<string> {
  if (provider === "google") {
    const url = PROVIDERS.google.url.replace("{model}", model || PROVIDERS.google.defaultModel)
    const res = await fetch(`${url}?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 8192 } }),
    })
    if (!res.ok) throw new Error(`Google: ${res.status}`)
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text || ""
  }
  if (provider === "anthropic") {
    const res = await fetch(PROVIDERS.anthropic.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: model || PROVIDERS.anthropic.defaultModel, max_tokens: 8192, messages: [{ role: "user", content: prompt }] }),
    })
    if (!res.ok) throw new Error(`Anthropic: ${res.status}`)
    const d = await res.json()
    return d.content?.[0]?.text || ""
  }
  // OpenAI-compatible
  const url = provider === "groq" ? PROVIDERS.groq.url : PROVIDERS.openai.url
  const res = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || PROVIDERS[provider]?.defaultModel, messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 8192 }),
  })
  if (!res.ok) throw new Error(`${provider}: ${res.status}`)
  const d = await res.json()
  return d.choices?.[0]?.message?.content || ""
}

export async function POST(request: Request) {
  try {
    const { action, content } = await request.json()

    const prov = await getProvider()
    if (!prov) return NextResponse.json({ error: "No AI provider configured. Go to AI Tailor tab → AI Provider Settings to add an API key." }, { status: 400 })

    let prompt = ""

    if (action === "parse_resume") {
      prompt = `You are an expert resume parser. Extract ALL information from this resume text and return it as a structured JSON object.

RESUME TEXT:
${content}

Return ONLY valid JSON (no markdown, no explanation, no code fences) in this EXACT format:
{
  "profile": {
    "fullName": "extracted name",
    "title": "professional title/headline",
    "email": "email if found",
    "phone": "phone if found",
    "location": "city, state/country if found",
    "website": "website url if found",
    "linkedin": "linkedin url if found",
    "github": "github url if found",
    "summary": "professional summary/objective text"
  },
  "experiences": [
    {
      "title": "job title",
      "company": "company name",
      "location": "job location",
      "startDate": "YYYY-MM-DD or best guess",
      "endDate": "YYYY-MM-DD or empty if current",
      "isCurrent": false,
      "description": "role description",
      "achievements": ["achievement 1", "achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "field": "field of study",
      "institution": "school/university name",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "description": "",
      "achievements": ["honors, GPA, etc"]
    }
  ],
  "certifications": [
    {
      "name": "cert name",
      "issuer": "issuing organization",
      "date": "YYYY-MM-DD",
      "credentialId": ""
    }
  ],
  "skillCategories": [
    {
      "name": "category name (e.g. Programming Languages, Frameworks, Tools)",
      "skills": ["skill1", "skill2"]
    }
  ],
  "projects": [
    {
      "title": "project name",
      "description": "project description",
      "techStack": ["tech1", "tech2"],
      "url": "project url if found"
    }
  ]
}

Rules:
- Extract EVERY detail you can find
- For dates, use YYYY-MM-DD format. If only year is given, use YYYY-01-01. If "Present" or "Current", leave endDate empty and set isCurrent to true
- Group skills into logical categories (Languages, Frameworks, Tools, Databases, etc.)
- Each achievement should be a separate string in the array
- If a field is not found, use empty string "" or empty array []
- Return ONLY the JSON, nothing else`

    } else if (action === "infer_content") {
      prompt = `You are an expert resume writer. I will give you raw content (notes, bullet points, job descriptions, LinkedIn data, or any unstructured text about a person's career). Your job is to create a complete, polished, professional resume from this content.

RAW CONTENT:
${content}

Create a complete resume. Infer and generate professional content from the raw data. If information is incomplete, make reasonable professional assumptions.

Return ONLY valid JSON (no markdown, no explanation, no code fences) in this EXACT format:
{
  "profile": {
    "fullName": "inferred or given name",
    "title": "best professional title based on experience",
    "email": "email if found or empty",
    "phone": "phone if found or empty",
    "location": "location if found or empty",
    "website": "",
    "linkedin": "",
    "github": "",
    "summary": "Write a compelling 2-3 sentence professional summary highlighting key strengths, years of experience, and career focus"
  },
  "experiences": [
    {
      "title": "job title",
      "company": "company",
      "location": "",
      "startDate": "YYYY-MM-DD",
      "endDate": "",
      "isCurrent": false,
      "description": "Write a professional 1-2 sentence description of the role",
      "achievements": ["Write 3-5 strong achievement bullets with metrics where possible"]
    }
  ],
  "education": [
    {
      "degree": "degree",
      "field": "field",
      "institution": "school",
      "startDate": "",
      "endDate": "YYYY-MM-DD",
      "description": "",
      "achievements": []
    }
  ],
  "certifications": [],
  "skillCategories": [
    {
      "name": "Category",
      "skills": ["skill1", "skill2"]
    }
  ],
  "projects": []
}

Rules:
- Generate professional, polished content — not raw notes
- Write strong achievement bullets with action verbs and metrics
- Create a compelling summary that would impress recruiters
- Group skills into 3-5 logical categories
- If data is minimal, generate reasonable professional content based on the role/industry
- Return ONLY JSON`

    } else if (action === "enhance_resume") {
      prompt = `You are an elite resume consultant. Take this existing resume data and enhance it significantly — improve every description, strengthen every achievement, optimize for ATS systems, and make it more impactful.

CURRENT RESUME DATA:
${content}

Enhance the resume by:
1. Rewriting the summary to be more compelling and keyword-rich
2. Strengthening every experience description with better action verbs
3. Adding metrics and quantified results to achievements where possible
4. Reorganizing skills for maximum ATS impact
5. Improving project descriptions
6. Making everything more concise and impactful

Return ONLY valid JSON (no markdown, no explanation, no code fences) in the same format as the input but with ALL content improved. Keep the same structure, IDs, dates, company names — only improve the text content.`

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await callAI(prov.provider, prov.apiKey, prov.model, prompt)

    // Extract JSON
    let parsed
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
      else parsed = JSON.parse(result)
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again.", raw: result }, { status: 422 })
    }

    return NextResponse.json({ result: parsed, provider: prov.provider })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "AI processing failed"
    console.error("AI parse error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
