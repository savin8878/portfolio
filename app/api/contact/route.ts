import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Map common field names to database columns
    const fieldMapping: Record<string, string> = {
      name: "name",
      full_name: "name",
      email: "email",
      email_address: "email",
      company: "company",
      company_name: "company",
      organization: "company",
      project_type: "project_type",
      projectType: "project_type",
      budget: "budget_range",
      budget_range: "budget_range",
      timeline: "timeline",
      message: "message",
      project_details: "message",
      details: "message",
    }

    // Extract known fields
    let name = null
    let email = null
    let company = null
    let projectType = null
    let budgetRange = null
    let timeline = null
    let message = null

    for (const [key, value] of Object.entries(body)) {
      const dbColumn = fieldMapping[key]
      
      if (dbColumn === "name") name = value
      else if (dbColumn === "email") email = value
      else if (dbColumn === "company") company = value
      else if (dbColumn === "project_type") projectType = value
      else if (dbColumn === "budget_range") budgetRange = value
      else if (dbColumn === "timeline") timeline = value
      else if (dbColumn === "message") message = value
    }

    // Basic validation - require at least name, email, and message
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Ensure message is never null - use a default if not provided
    const finalMessage = message || `Contact form submission from ${name}`
    
    await sql`
      INSERT INTO contact_submissions (
        name, email, company, project_type, budget_range, timeline, message, status
      )
      VALUES (
        ${name}, 
        ${email}, 
        ${company || null}, 
        ${projectType || null}, 
        ${budgetRange || null}, 
        ${timeline || null}, 
        ${finalMessage},
        'new'
      )
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving contact submission:", error)
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    )
  }
}
