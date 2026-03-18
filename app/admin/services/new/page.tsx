import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ServiceForm } from "@/components/admin/service-form"

export default function NewServicePage() {
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
        <h2 className="text-2xl font-bold text-foreground">New Service</h2>
        <p className="text-muted-foreground">
          Add a new service offering
        </p>
      </div>

      <ServiceForm />
    </div>
  )
}
