// Seeds a default resume_configs row matching the AKASH_VISHWAKARMA.pdf resume.
// This is what the admin Resume Builder loads first (overrides buildInitialConfig).

const { neon } = require("@neondatabase/serverless");
const fs = require("fs");

const DB_URL = fs
  .readFileSync(".env", "utf8")
  .split("\n")[0]
  .split("=")
  .slice(1)
  .join("=")
  .trim();

const sql = neon(DB_URL);

const config = {
  profile: {
    fullName: "Akash Vishwakarma",
    title: "Full Stack Developer",
    email: "Jobforakash9770@gmail.com",
    phone: "+918305838352",
    location: "Jaipur, Rajasthan",
    website: "www.akash.com",
    linkedin: "linkedin.com/akash",
    github: "",
    summary:
      "Full-Stack Developer specializing in high-performance Next.js, TypeScript, and Node.js applications. Built multilingual, SEO-optimized platforms serving users across 200+ countries. Delivered AI-powered automation tools, reduced API costs by 50%, and improved workflow efficiency by 30%. Experienced in architecting scalable systems using Prisma, MySQL, Docker, Kafka, and microservices.",
    profileImage: null,
  },
  experiences: [
    {
      id: "exp-nessco",
      enabled: true,
      company: "Nessco Industries",
      title: "Full Stack Developer",
      location: "Jaipur, Rajasthan",
      startDate: "2024-01-01",
      endDate: "",
      isCurrent: true,
      description:
        "Architected a Next.js and TypeScript website with middleware for internationalization, supporting 200+ countries and dynamic language detection for global user engagement.",
      achievements: [
        "Architected a Next.js and TypeScript website with middleware for internationalization, supporting 200+ countries and dynamic language detection for global user engagement.",
        "Developed a Node.js, Express, and TypeScript admin panel with AI-driven translations for 110+ languages, streamlining content management across 15+ multilingual data models.",
        "Built an AI-based card reader tool for sales teams, processing image uploads via background jobs for accurate lead data extraction and CRM integration, boosting efficiency by 30%.",
        "Optimized Prisma schema and MySQL indexing — improved query performance by 25–30%.",
        "Implemented SEO redirects and geolocation routing for 30+ regions, boosting organic traffic. Reduced API calls by 50% using optimized translation caching pipelines.",
      ],
    },
    {
      id: "exp-codecluse",
      enabled: true,
      company: "CodeCluse",
      title: "Intern",
      location: "Remote",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      isCurrent: false,
      description:
        "Implemented OTP verification using the MERN stack and contributed to delivering project milestones within an agile team.",
      achievements: [
        "Implemented OTP verification using MERN stack (MongoDB, Express.js, React, Node.js), enhancing user authentication security.",
        "Successfully completed internship deliverables, meeting project deadlines and quality standards.",
      ],
    },
    {
      id: "exp-upsys",
      enabled: true,
      company: "UpSys IT and Marketing Sol",
      title: "Developer",
      location: "Remote",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      isCurrent: false,
      description:
        "Designed responsive career and portfolio pages for the UpSys website using React and CSS, improving user engagement.",
      achievements: [
        "Designed responsive career and portfolio pages for the UpSys website using React and CSS, improving user engagement.",
        "Collaborated with a development team via a private Git repository, maintaining consistent code updates using Visual Studio Code.",
        "Streamlined workflow by adhering to agile practices, contributing to timely project milestones.",
      ],
    },
  ],
  education: [
    {
      id: "edu-jaypee",
      enabled: true,
      institution: "Jaypee University Guna",
      degree: "B.Tech",
      field: "Computer Science",
      startDate: "2020-08-01",
      endDate: "2024-06-30",
      description: "Bachelor of Technology in Computer Science.",
      achievements: ["CGPA: 7.2/10"],
    },
    {
      id: "edu-senior",
      enabled: true,
      institution: "Sardar Patel H.S. School Rewa",
      degree: "Senior Secondary",
      field: "State Board",
      startDate: "2019-06-01",
      endDate: "2020-05-31",
      description: "Senior Secondary (State Board).",
      achievements: ["Percentage: 85.8%"],
    },
    {
      id: "edu-secondary",
      enabled: true,
      institution: "Sardar Patel H.S. School Rewa",
      degree: "Secondary",
      field: "State Board",
      startDate: "2017-06-01",
      endDate: "2018-05-31",
      description: "Secondary (State Board).",
      achievements: ["Percentage: 93.4%"],
    },
  ],
  certifications: [
    {
      id: "cert-js",
      enabled: true,
      name: "Self Paced Javascript Course",
      issuer: "GeeksforGeeks",
      date: "",
      credentialId: "",
      url: "",
    },
    {
      id: "cert-git",
      enabled: true,
      name: "Self Paced Git and Github Course",
      issuer: "GeeksforGeeks",
      date: "",
      credentialId: "",
      url: "",
    },
    {
      id: "cert-sql",
      enabled: true,
      name: "Self Paced SQL Course",
      issuer: "GeeksforGeeks",
      date: "",
      credentialId: "",
      url: "",
    },
    {
      id: "cert-meta",
      enabled: true,
      name: "Meta Full Stack Course",
      issuer: "Coursera",
      date: "",
      credentialId: "",
      url: "",
    },
  ],
  skillCategories: [
    {
      id: "skills-frontend",
      name: "Frontend",
      skills: ["Next.js", "React.js", "TypeScript", "Redux Toolkit", "TailwindCSS"],
    },
    {
      id: "skills-backend",
      name: "Backend",
      skills: ["Node.js", "Express.js", "REST APIs", "Microservices", "Kafka"],
    },
    {
      id: "skills-tools",
      name: "Tools & Platforms",
      skills: ["Docker", "Nginx", "Prisma", "Drizzle", "Git", "VPS"],
    },
    {
      id: "skills-databases",
      name: "Databases",
      skills: ["MySQL", "MongoDB", "Prisma ORM", "PostgreSQL", "Redis"],
    },
    {
      id: "skills-concepts",
      name: "Concepts",
      skills: ["Data Structures", "Algorithms", "OOP", "Agile Methodologies"],
    },
    {
      id: "skills-others",
      name: "Others",
      skills: ["SEO Optimization", "i18n", "Web Scraping Automation", "Socket.io"],
    },
  ],
  projects: [
    {
      id: "proj-scrapeflow",
      enabled: true,
      title: "ScrapeFlow — SaaS Web Scraping Platform",
      role: "Full-Stack Developer",
      description:
        "Engineered a Next.js and TypeScript-based SaaS platform for visual web-scraping automation with drag-and-drop workflow design.",
      achievements: [
        "Problem: Teams needed to automate web scraping without coding.",
        "Action: Built a Next.js + TypeScript visual scraper with drag-and-drop workflows, encrypted credentials, and AI-assisted form interaction.",
        "Result: Delivered secure scheduling, Stripe billing automation, and stable scraping for login-gated sites.",
      ],
      techStack: ["Next.js", "TypeScript", "React Flow", "Prisma ORM", "TanStack Query", "Stripe"],
      url: "https://web-scrapper-sepia.vercel.app",
      repoUrl: "",
      startDate: "2025-01-01",
      endDate: "",
      isCurrent: true,
    },
    {
      id: "proj-lms",
      enabled: true,
      title: "Learning Management System",
      role: "Full-Stack Developer",
      description:
        "Built a Next.js and TypeScript-based Learning Management System with advanced features for seamless desktop and mobile experience.",
      achievements: [
        "Built with Next.js, Node.js, Express, and MongoDB for a robust full-stack LMS platform.",
        "Used Redux Toolkit, TailwindCSS, and TypeScript for state management, UI, and type safety.",
        "Integrated Redis, Cloudinary, and Socket.io for caching, media handling, and real-time communication.",
        "Implemented JWT & OAuth authentication with secure payments, admin analytics, and responsive design.",
      ],
      techStack: [
        "Next.js",
        "Node.js",
        "Express",
        "MongoDB",
        "Redux Toolkit",
        "TailwindCSS",
        "TypeScript",
        "Redis",
        "Cloudinary",
        "Socket.io",
        "JWT",
        "OAuth",
      ],
      url: "",
      repoUrl: "",
      startDate: "2022-01-01",
      endDate: "",
      isCurrent: true,
    },
    {
      id: "proj-shopdots",
      enabled: true,
      title: "ShopDots — Multivendor E-Commerce",
      role: "Full-Stack Developer",
      description:
        "Multi-Vendor E-Commerce SaaS Platform built with a Microservice Architecture and three dedicated front-ends (User, Seller, Admin).",
      achievements: [
        "Scalability: Utilized Apache Kafka for an Event-Driven Architecture (EDA) to handle high-volume analytics processing in real-time.",
        "Infrastructure: Ensured consistent deployment using Docker and implemented API Rate Limiting and automated Cron Jobs for maintenance.",
      ],
      techStack: ["Microservices", "Apache Kafka", "Docker", "Node.js", "TypeScript", "REST APIs"],
      url: "",
      repoUrl: "",
      startDate: "2022-01-01",
      endDate: "2023-12-31",
      isCurrent: false,
    },
  ],
  customSections: [
    {
      id: "custom-languages",
      title: "Languages",
      items: [
        { id: "lang-hindi", content: "Hindi (native)" },
        { id: "lang-english", content: "English (professional)" },
      ],
    },
    {
      id: "custom-achievements",
      title: "Achievements",
      items: [
        { id: "ach-handball", content: "2017 — State level Handball Player (Ranked 2), Shivpuri, MP" },
        { id: "ach-rank1", content: "2018 — Rank 1 in School Board Examination" },
        { id: "ach-ncc", content: "2018 — NCC Cadet (A Certified), Sagar Battalion" },
        { id: "ach-leetcode", content: "Solved 400+ problems on LeetCode, demonstrating consistency" },
      ],
    },
  ],
  template: "classic",
  accentColor: "#2563eb",
  fontSize: "medium",
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "custom",
  ],
  showProfileImage: false,
  sidebarWidth: 220,
  pagePadding: 32,
};

async function run() {
  await sql`UPDATE resume_configs SET is_default = false WHERE is_default = true`;

  const result = await sql`
    INSERT INTO resume_configs (name, config, is_default)
    VALUES (
      ${"Akash Vishwakarma — PDF Resume"},
      ${JSON.stringify(config)}::jsonb,
      true
    )
    RETURNING id, name, is_default, updated_at
  `;

  console.log("Inserted default resume_config:", result[0]);
}

run().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
