import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { BlogPostForm } from "@/components/admin/blog-post-form"

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

async function getBlogPost(id: string) {
  const posts = await sql`
    SELECT * FROM blog_posts WHERE id = ${id}
  `
  return posts[0] || null
}

async function getCategories() {
  const categories = await sql`SELECT id, name FROM blog_categories ORDER BY name`
  return categories
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params
  const [post, categories] = await Promise.all([
    getBlogPost(id),
    getCategories(),
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Posts
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Edit Blog Post</h2>
        <p className="text-muted-foreground">
          Update {post.title}
        </p>
      </div>

      <BlogPostForm post={post} categories={categories} />
    </div>
  )
}
