import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { ServiceForm } from "@/components/admin/service-form"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

async function getService(id: string) {
  const services = await sql`
    SELECT * FROM services WHERE id = ${id}
  `
  return services[0] || null
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params
  const service = await getService(id)

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/services"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Edit Service</h2>
        <p className="text-muted-foreground">
          Update {service.title}
        </p>
      </div>

      <ServiceForm service={service} />
    </div>
  )
}
