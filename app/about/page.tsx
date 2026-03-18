import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { ExperienceTimeline } from "@/components/about/experience-timeline"
import { SkillsOverview } from "@/components/about/skills-overview"
import { CtaSection } from "@/components/sections/cta-section"
import {
  getSiteSettings,
  getExperiences,
  getTechStack,
  getEducation,
  getCertifications,
  getPageContent,
  getPageVisibility,
} from "@/lib/data"

export const metadata: Metadata = {
  title: "About - Akash Vishwakarma",
  description:
    "Learn about my journey as a Full-Stack Product Engineer with 8+ years of experience building scalable software solutions.",
}

export default async function AboutPage() {
  const [siteSettings, experiences, techStack, education, certifications, pageContent, vis] =
    await Promise.all([
      getSiteSettings(),
      getExperiences(),
      getTechStack(),
      getEducation(),
      getCertifications(),
      getPageContent("about"),
      getPageVisibility("about"),
    ])

  const show = (section: string) => vis[section] !== false

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {show("hero") && (
          <AboutHero
            name={siteSettings?.developer_name || "Akash Vishwakarma"}
            title={siteSettings?.professional_title || "Full-Stack Product Engineer"}
            bio={
              siteSettings?.site_description ||
              "Full-Stack Product Engineer specializing in building scalable SaaS platforms, AI tools, and high-performance web applications."
            }
            location={siteSettings?.location || "San Francisco, CA"}
            email={siteSettings?.email || "hello@alexchen.dev"}
            profileImage={siteSettings?.profile_image || null}
            resumeUrl={siteSettings?.resume_url || null}
            availabilityStatus={siteSettings?.availability_status || "Available for projects"}
            content={pageContent.hero}
          />
        )}

        {show("experience") && (
          <ExperienceTimeline
            experiences={experiences}
            education={education}
            certifications={certifications}
            content={pageContent.experience}
          />
        )}

        {show("skills") && (
          <SkillsOverview techStack={techStack} content={pageContent.skills} />
        )}

        {show("cta") && <CtaSection />}
      </main>

      <Footer />
    </div>
  )
}
