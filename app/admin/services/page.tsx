import Link from "next/link"
import { Plus, Pencil, Eye, EyeOff, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"

async function getServices() {
  const services = await sql`
    SELECT id, title, short_description, icon, price_range, is_active, display_order, created_at
    FROM services
    ORDER BY display_order ASC
  `
  return services
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Services</h2>
          <p className="text-muted-foreground">
            Manage your service offerings and pricing
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-10 p-4"></th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Price Range
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
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {service.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {service.short_description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        {service.price_range ? (
                          <Badge variant="secondary">{service.price_range}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {service.is_active ? (
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
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/services/${service.id}/edit`}>
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
                      No services yet. Add your first service to get started.
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
