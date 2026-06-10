import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      short_description,
      full_description,
      problem_statement,
      solution,
      tech_stack,
      category_id,
      results_metrics,
      live_url,
      github_url,
      explainer_video_url,
      explainer_audio_url,
      is_published,
      is_featured,
    } = body

    const result = await sql`
      INSERT INTO projects (
        title, slug, short_description, full_description, problem_statement,
        solution, tech_stack, category_id, results_metrics, live_url,
        github_url, explainer_video_url, explainer_audio_url, is_published, is_featured
      ) VALUES (
        ${title}, ${slug}, ${short_description}, ${full_description || null},
        ${problem_statement || null}, ${solution || null}, ${tech_stack || []},
        ${category_id || null}, ${results_metrics ? JSON.stringify(results_metrics) : null}, ${live_url || null},
        ${github_url || null}, ${explainer_video_url || null}, ${explainer_audio_url || null}, ${is_published || false}, ${is_featured || false}
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      slug,
      short_description,
      full_description,
      problem_statement,
      solution,
      tech_stack,
      category_id,
      results_metrics,
      live_url,
      github_url,
      explainer_video_url,
      explainer_audio_url,
      is_published,
      is_featured,
    } = body

    await sql`
      UPDATE projects SET
        title = ${title},
        slug = ${slug},
        short_description = ${short_description},
        full_description = ${full_description || null},
        problem_statement = ${problem_statement || null},
        solution = ${solution || null},
        tech_stack = ${tech_stack || []},
        category_id = ${category_id || null},
        results_metrics = ${results_metrics ? JSON.stringify(results_metrics) : null},
        live_url = ${live_url || null},
        github_url = ${github_url || null},
        explainer_video_url = ${explainer_video_url || null},
        explainer_audio_url = ${explainer_audio_url || null},
        is_published = ${is_published || false},
        is_featured = ${is_featured || false},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM projects WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
