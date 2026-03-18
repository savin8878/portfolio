import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      category_id,
      tags,
      meta_description,
      reading_time,
      is_published,
      is_featured,
    } = body

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, category_id, tags,
        meta_description, reading_time, is_published, is_featured,
        published_at
      ) VALUES (
        ${title}, ${slug}, ${excerpt || null}, ${content},
        ${category_id || null}, ${tags || []}, ${meta_description || null},
        ${reading_time || 5}, ${is_published || false}, ${is_featured || false},
        ${is_published ? new Date() : null}
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
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
      excerpt,
      content,
      category_id,
      tags,
      meta_description,
      reading_time,
      is_published,
      is_featured,
    } = body

    // Get current published state to determine if we need to set published_at
    const current = await sql`SELECT is_published, published_at FROM blog_posts WHERE id = ${id}`
    const wasPublished = current[0]?.is_published
    const existingPublishedAt = current[0]?.published_at

    const publishedAt = is_published && !wasPublished 
      ? new Date() 
      : is_published 
        ? existingPublishedAt 
        : null

    await sql`
      UPDATE blog_posts SET
        title = ${title},
        slug = ${slug},
        excerpt = ${excerpt || null},
        content = ${content},
        category_id = ${category_id || null},
        tags = ${tags || []},
        meta_description = ${meta_description || null},
        reading_time = ${reading_time || 5},
        is_published = ${is_published || false},
        is_featured = ${is_featured || false},
        published_at = ${publishedAt},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { error: "Failed to update blog post" },
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

    await sql`DELETE FROM blog_posts WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
