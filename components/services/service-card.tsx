"use client"

import { motion } from "framer-motion"
import {
  Cloud,
  Rocket,
  Lightbulb,
  Code2,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Service } from "@/lib/db"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: Cloud,
  rocket: Rocket,
  lightbulb: Lightbulb,
  code: Code2,
}

interface ServiceCardProps {
  service: Service
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Code2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      id={service.slug}
      className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-foreground">
              {service.title}
            </h3>
            {service.is_featured && (
              <Badge variant="secondary">Popular</Badge>
            )}
          </div>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {service.short_description}
          </p>
        </div>
      </div>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <div className="mt-6 grid gap-2">
          {service.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pricing & Timeline */}
      <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-6">
        {service.price_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {service.price_range}
            </span>
          </div>
        )}
        {service.delivery_time && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {service.delivery_time}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
