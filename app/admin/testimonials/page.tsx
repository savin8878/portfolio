import Link from "next/link"
import { Plus, Pencil, Eye, EyeOff, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"

async function getTestimonials() {
  const testimonials = await sql`
    SELECT id, client_name, client_title, client_company, testimonial_text, rating, is_active, is_featured, created_at
    FROM testimonials
    ORDER BY created_at DESC
  `
  return testimonials
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
          <p className="text-muted-foreground">
            Manage client testimonials and reviews
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Testimonial
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Rating
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <tr
                      key={testimonial.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {testimonial.client_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.client_title}
                          </p>
                          {testimonial.client_company && (
                            <p className="text-xs text-muted-foreground">
                              {testimonial.client_company}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          "{testimonial.testimonial_text}"
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.rating || 5 }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {testimonial.is_active ? (
                            <Badge variant="default" className="bg-green-600">
                              <Eye className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          {testimonial.is_featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No testimonials yet. Add your first testimonial to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
