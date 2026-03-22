import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Supported providers and their API endpoints
const PROVIDER_CONFIGS: Record<string, { url: string; defaultModel: string }> = {
  google: {
    url: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    defaultModel: "gemini-2.0-flash",
  },
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile",
  },
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
  },
  anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-sonnet-4-20250514",
  },
}

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

async function getActiveProvider(): Promise<{ provider: string; apiKey: string; model: string } | null> {
  await ensureTable()
  const rows = await sql`
    SELECT provider, api_key, model FROM ai_provider_settings
    WHERE is_active = true ORDER BY updated_at DESC LIMIT 1
  `
  if (rows.length === 0) return null
  return {
    provider: rows[0].provider as string,
    apiKey: rows[0].api_key as string,
    model: (rows[0].model as string) || "",
  }
}

// Call Google Gemini API
async function callGoogle(apiKey: string, model: string, prompt: string): Promise<string> {
  const url = PROVIDER_CONFIGS.google.url.replace("{model}", model || PROVIDER_CONFIGS.google.defaultModel)
  const res = await fetch(`${url}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  })
  if (!res.ok) throw new Error(`Google API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ""
}

// Call Groq API (OpenAI-compatible)
async function callGroq(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(PROVIDER_CONFIGS.groq.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || PROVIDER_CONFIGS.groq.defaultModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })
  if (!res.ok) throw new Error(`Groq API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

// Call OpenAI API
async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(PROVIDER_CONFIGS.openai.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || PROVIDER_CONFIGS.openai.defaultModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

// Call Anthropic API
async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch(PROVIDER_CONFIGS.anthropic.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || PROVIDER_CONFIGS.anthropic.defaultModel,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.content?.[0]?.text || ""
}

async function callAI(provider: string, apiKey: string, model: string, prompt: string): Promise<string> {
  switch (provider) {
    case "google": return callGoogle(apiKey, model, prompt)
    case "groq": return callGroq(apiKey, model, prompt)
    case "openai": return callOpenAI(apiKey, model, prompt)
    case "anthropic": return callAnthropic(apiKey, model, prompt)
    default: throw new Error(`Unknown provider: ${provider}`)
  }
}

export async function POST(request: Request) {
  try {
    const { jobTitle, jobDescription, companyName, currentResume, action } = await request.json()

    const providerInfo = await getActiveProvider()
    if (!providerInfo) {
      return NextResponse.json(
        { error: "No AI provider configured. Go to AI Settings to add an API key." },
        { status: 400 }
      )
    }

    let prompt = ""

    if (action === "tailor_summary") {
      prompt = `You are an expert resume writer. Rewrite the professional summary to be perfectly tailored for this job application.

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "the company"}
JOB DESCRIPTION:
${jobDescription}

CURRENT SUMMARY:
${currentResume?.summary || "No existing summary"}

CURRENT SKILLS: ${currentResume?.skills?.join(", ") || "Not provided"}

Instructions:
- Write a compelling 2-3 sentence professional summary
- Highlight relevant experience and skills that match the job description
- Use strong action words and quantifiable achievements where possible
- Keep it concise and impactful
- Do NOT include the section title, just the summary text
- Return ONLY the summary text, nothing else`

    } else if (action === "tailor_experience") {
      prompt = `You are an expert resume writer. Rewrite these work experience achievements to be tailored for this specific job application.

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "the company"}
JOB DESCRIPTION:
${jobDescription}

CURRENT EXPERIENCE:
${JSON.stringify(currentResume?.experiences || [], null, 2)}

Instructions:
- For each experience entry, rewrite the description and achievements to emphasize skills relevant to the target job
- Use strong action verbs and quantify results where possible
- Keep the same companies, titles, and dates — only improve descriptions and achievements
- Return ONLY valid JSON array in this exact format:
[
  {
    "id": "original_id",
    "description": "improved description",
    "achievements": ["achievement 1", "achievement 2"]
  }
]
- Return ONLY the JSON array, no markdown, no explanation`

    } else if (action === "tailor_skills") {
      prompt = `You are an expert resume writer. Analyze this job description and suggest the best skills to highlight on a resume.

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "the company"}
JOB DESCRIPTION:
${jobDescription}

CURRENT SKILLS:
${JSON.stringify(currentResume?.skillCategories || [], null, 2)}

Instructions:
- Reorganize and prioritize skills that match the job description
- Add any commonly expected skills for this role that the candidate might have
- Group them into relevant categories
- Return ONLY valid JSON array in this format:
[
  { "name": "Category Name", "skills": ["skill1", "skill2", "skill3"] }
]
- Return ONLY the JSON array, no markdown, no explanation`

    } else if (action === "full_tailor") {
      prompt = `You are an expert resume writer. Analyze this job posting and the candidate's current resume data, then generate a fully tailored resume content optimized for this specific position.

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "the company"}
JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME DATA:
${JSON.stringify(currentResume, null, 2)}

Instructions:
- Rewrite the professional summary to target this specific role
- Rewrite experience descriptions and achievements to highlight relevant skills
- Reorganize skills to prioritize those matching the job
- Keep all factual information (dates, company names, degrees) unchanged
- Use strong ATS-friendly keywords from the job description
- Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "summary": "new tailored summary",
  "experiences": [
    {
      "id": "original_id",
      "description": "tailored description",
      "achievements": ["achievement1", "achievement2"]
    }
  ],
  "skillCategories": [
    { "name": "Category", "skills": ["skill1", "skill2"] }
  ]
}`

    } else if (action === "generate_cover_letter") {
      prompt = `Write a professional cover letter for this job application.

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "the company"}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE INFO:
Name: ${currentResume?.profile?.fullName || "Candidate"}
Title: ${currentResume?.profile?.title || "Professional"}
Summary: ${currentResume?.summary || ""}
Key Skills: ${currentResume?.skills?.join(", ") || ""}

Instructions:
- Write a compelling, professional cover letter (3-4 paragraphs)
- Reference specific requirements from the job description
- Highlight relevant experience and skills
- Show enthusiasm for the company and role
- Keep it concise (under 400 words)
- Return ONLY the cover letter text`

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await callAI(providerInfo.provider, providerInfo.apiKey, providerInfo.model, prompt)

    // Try to parse JSON responses
    let parsed: unknown = result
    if (action !== "tailor_summary" && action !== "generate_cover_letter") {
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = result.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        }
      } catch {
        parsed = result
      }
    }

    return NextResponse.json({
      result: parsed,
      provider: providerInfo.provider,
      model: providerInfo.model,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed"
    console.error("AI tailor error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
