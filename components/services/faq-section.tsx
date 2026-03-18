"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is your typical project timeline?",
    answer:
      "Project timelines vary based on scope. MVPs typically take 4-8 weeks, while larger enterprise projects range from 8-16 weeks. I provide detailed timelines during the discovery phase.",
  },
  {
    question: "How do you handle communication during projects?",
    answer:
      "I believe in transparent, frequent communication. You will receive weekly progress updates, have access to a shared project management board, and we will have regular check-in calls to ensure alignment.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and PostgreSQL. I also have experience with cloud platforms like AWS and Vercel for scalable deployments.",
  },
  {
    question: "Do you offer ongoing maintenance and support?",
    answer:
      "Yes, I offer maintenance packages for projects I have built. This includes bug fixes, security updates, performance monitoring, and feature enhancements as needed.",
  },
  {
    question: "What is your payment structure?",
    answer:
      "For project work, I typically require 30% upfront, 40% at midpoint, and 30% upon completion. For consulting, I offer hourly or retainer arrangements. All terms are discussed before starting.",
  },
  {
    question: "Can you work with my existing team?",
    answer:
      "Absolutely. I frequently collaborate with in-house teams, whether it is augmenting your development capacity, providing technical leadership, or mentoring junior developers.",
  },
]

export function FaqSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider">
            FAQ
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Frequently Asked Questions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
