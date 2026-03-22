import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Global AI endpoint for the entire admin panel
// Supports: content generation, insights, rewriting, SEO optimization

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

const PROVIDER_CONFIGS: Record<string, { url: string; defaultModel: string }> = {
  google: { url: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", defaultModel: "gemini-2.0-flash" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", defaultModel: "llama-3.3-70b-versatile" },
  openai: { url: "https://api.openai.com/v1/chat/completions", defaultModel: "gpt-4o-mini" },
  anthropic: { url: "https://api.anthropic.com/v1/messages", defaultModel: "claude-sonnet-4-20250514" },
}

async function getActiveProvider() {
  await ensureTable()
  const rows = await sql`SELECT provider, api_key, model FROM ai_provider_settings WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
  if (rows.length === 0) return null
  return { provider: rows[0].provider as string, apiKey: rows[0].api_key as string, model: (rows[0].model as string) || "" }
}

async function callAI(provider: string, apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  if (provider === "google") {
    const url = PROVIDER_CONFIGS.google.url.replace("{model}", model || PROVIDER_CONFIGS.google.defaultModel)
    const res = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    })
    if (!res.ok) throw new Error(`Google API: ${res.status}`)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  }

  if (provider === "anthropic") {
    const res = await fetch(PROVIDER_CONFIGS.anthropic.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: model || PROVIDER_CONFIGS.anthropic.defaultModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    })
    if (!res.ok) throw new Error(`Anthropic API: ${res.status}`)
    const data = await res.json()
    return data.content?.[0]?.text || ""
  }

  // OpenAI-compatible (openai, groq)
  const url = provider === "groq" ? PROVIDER_CONFIGS.groq.url : PROVIDER_CONFIGS.openai.url
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: model || PROVIDER_CONFIGS[provider]?.defaultModel || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })
  if (!res.ok) throw new Error(`${provider} API: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

export async function POST(request: Request) {
  try {
    const { action, context, content, instructions } = await request.json()

    const providerInfo = await getActiveProvider()
    if (!providerInfo) {
      return NextResponse.json({ error: "No AI provider configured. Add an API key in Resume Builder → AI Tailor tab → AI Provider Settings." }, { status: 400 })
    }

    let systemPrompt = ""
    let userPrompt = ""

    switch (action) {
      case "generate":
        systemPrompt = "You are a professional content writer for a portfolio/personal website. Write compelling, concise content."
        userPrompt = `Context: ${context || "website content"}\n\nInstructions: ${instructions || "Generate professional content"}\n\nCurrent content (if any): ${content || "none"}\n\nReturn ONLY the generated content, no explanations.`
        break

      case "rewrite":
        systemPrompt = "You are a professional editor. Rewrite the given content to be more compelling, clear, and professional."
        userPrompt = `Rewrite this content:\n\n${content}\n\n${instructions ? `Additional instructions: ${instructions}` : ""}\n\nReturn ONLY the rewritten content.`
        break

      case "improve":
        systemPrompt = "You are a professional editor. Improve the given content while maintaining its meaning and tone."
        userPrompt = `Improve this content for a ${context || "professional website"}:\n\n${content}\n\nReturn ONLY the improved content.`
        break

      case "seo_optimize":
        systemPrompt = "You are an SEO expert. Optimize the given content for search engines while keeping it natural and readable."
        userPrompt = `Optimize this content for SEO:\n\n${content}\n\nContext: ${context || "personal portfolio website"}\n${instructions ? `Keywords to focus on: ${instructions}` : ""}\n\nReturn ONLY the optimized content.`
        break

      case "summarize":
        systemPrompt = "You are a concise writer. Summarize the given content into a brief, impactful version."
        userPrompt = `Summarize this:\n\n${content}\n\n${instructions ? `Target length: ${instructions}` : "Keep it under 2-3 sentences."}\n\nReturn ONLY the summary.`
        break

      case "generate_description":
        systemPrompt = "You are an expert at writing project/service descriptions for professional portfolios."
        userPrompt = `Generate a professional description for:\n\nTitle: ${context}\n\nAdditional info: ${instructions || "none"}\n\nCurrent description: ${content || "none"}\n\nReturn ONLY the description (2-3 sentences).`
        break

      case "generate_achievements":
        systemPrompt = "You are an expert resume writer who creates impactful achievement bullet points."
        userPrompt = `Generate 3-5 achievement bullet points for this role:\n\nRole: ${context}\n\nDescription: ${content || "none"}\n\n${instructions ? `Focus on: ${instructions}` : ""}\n\nReturn each achievement on a new line. Use strong action verbs and quantify results. Return ONLY the achievements, one per line.`
        break

      case "insights":
        systemPrompt = "You are a career and content strategy advisor for a professional portfolio website."
        userPrompt = `Analyze this content and provide 3-5 actionable insights for improvement:\n\n${content}\n\nContext: ${context || "portfolio website"}\n\nReturn insights as a numbered list.`
        break

      case "translate":
        systemPrompt = "You are a professional translator. Translate accurately while maintaining professional tone."
        userPrompt = `Translate the following to ${instructions || "English"}:\n\n${content}\n\nReturn ONLY the translation.`
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await callAI(providerInfo.provider, providerInfo.apiKey, providerInfo.model, systemPrompt, userPrompt)

    return NextResponse.json({
      result,
      provider: providerInfo.provider,
      model: providerInfo.model,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed"
    console.error("Global AI error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
