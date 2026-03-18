"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingTiers = [
  {
    name: "Consulting",
    description: "Strategic technical guidance for your projects",
    price: "$200-400",
    unit: "/hour",
    features: [
      "Architecture review",
      "Code audit",
      "Performance analysis",
      "Technology selection",
      "Team mentoring",
      "Best practices guidance",
    ],
    cta: "Schedule Call",
    href: "/contact",
    popular: false,
  },
  {
    name: "MVP Development",
    description: "Launch your product idea quickly",
    price: "$8k-25k",
    unit: "/project",
    features: [
      "Full-stack development",
      "4-8 week delivery",
      "Core features",
      "Modern tech stack",
      "Deployment setup",
      "Post-launch support",
    ],
    cta: "Start Project",
    href: "/contact",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Full-scale application development",
    price: "$15k-50k+",
    unit: "/project",
    features: [
      "Complex systems",
      "Scalable architecture",
      "8-16 week delivery",
      "Full documentation",
      "CI/CD pipeline",
      "Ongoing maintenance",
    ],
    cta: "Get Quote",
    href: "/contact",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
            Pricing
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Investment Options
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing tailored to your project scope and requirements.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.popular
                  ? "border-accent bg-accent/5 shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.unit}</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className="w-full group"
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link href={tier.href}>
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All prices are estimates. Final pricing depends on project scope and
          requirements.
        </p>
      </div>
    </section>
  )
}
