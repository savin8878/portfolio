-- Real Seed Data for Akash Vishwakarma Portfolio (matches AKASH_VISHWAKARMA.pdf resume)
-- This script clears existing data and inserts the resume content as defaults.

-- Ensure projects.achievements column exists for per-project bullet points
ALTER TABLE projects ADD COLUMN IF NOT EXISTS achievements TEXT[];

-- Ensure resume_configs table exists (created lazily by the API otherwise)
CREATE TABLE IF NOT EXISTS resume_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Default Resume',
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing data (in reverse dependency order)
DELETE FROM resume_configs;
DELETE FROM blog_posts;
DELETE FROM blog_categories;
DELETE FROM testimonials;
DELETE FROM projects;
DELETE FROM project_categories;
DELETE FROM experiences;
DELETE FROM education;
DELETE FROM certifications;
DELETE FROM tech_stack;
DELETE FROM services;
DELETE FROM impact_metrics;
DELETE FROM social_links;
DELETE FROM client_logos;
DELETE FROM process_steps;
DELETE FROM philosophy_items;
DELETE FROM hero_section;
DELETE FROM site_settings;
DELETE FROM theme_settings;
DELETE FROM contact_submissions;

-- Theme Settings
INSERT INTO theme_settings (primary_color, secondary_color, accent_color, background_color, foreground_color, muted_color, border_radius, font_heading, font_body, dark_mode)
VALUES ('#0f172a', '#64748b', '#6366f1', '#ffffff', '#0f172a', '#f1f5f9', '0.75rem', 'Inter', 'Inter', false);

-- Site Settings (PROFESSIONAL PROFILE from PDF)
INSERT INTO site_settings (site_name, site_description, developer_name, professional_title, tagline, email, phone, location, availability_status, meta_title, meta_description)
VALUES (
  'Akash Vishwakarma',
  'Full-Stack Developer with 2+ years building scalable, high-performance web apps in Next.js, React, TypeScript, and Node.js. Shipped multilingual, SEO-optimized platforms serving 200+ countries and 110+ languages, and AI automation tools that cut API costs 50% and lifted efficiency 30%. Skilled in REST APIs, microservices, and event-driven architecture with Prisma, PostgreSQL, MySQL, Docker, and Apache Kafka.',
  'Akash Vishwakarma',
  'Full Stack Developer',
  'I build scalable, high-performance web applications with Next.js, TypeScript, and Node.js.',
  'Jobforakash9770@gmail.com',
  '+918305838352',
  'Jaipur, Rajasthan',
  'available',
  'Akash Vishwakarma — Full Stack Developer',
  'Full-Stack Developer specializing in Next.js, TypeScript, and Node.js. Built multilingual, SEO-optimized platforms across 200+ countries with AI-powered automation tools.'
);

-- Hero Section
INSERT INTO hero_section (headline, subheadline, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, background_type, is_active)
VALUES (
  'Building Scalable & High-Performance Web Applications',
  'Full-Stack Developer specializing in Next.js, TypeScript, and Node.js. I create multilingual, SEO-optimized platforms and AI-powered automation tools that improve efficiency and reduce operational costs.',
  'View My Work',
  '/projects',
  'Get In Touch',
  '/contact',
  'gradient',
  true
);

-- Social Links (CONTACT block from PDF)
INSERT INTO social_links (platform, url, icon, display_order, is_active) VALUES
('LinkedIn', 'https://linkedin.com/akash', 'linkedin', 1, true),
('Website', 'https://www.akash.com', 'globe', 2, true),
('Email', 'mailto:Jobforakash9770@gmail.com', 'mail', 3, true),
('Phone', 'tel:+918305838352', 'phone', 4, true);

-- Impact Metrics (from PDF profile + experience)
INSERT INTO impact_metrics (label, value, suffix, icon, display_order, is_active) VALUES
('Countries Supported', '200', '+', 'globe', 1, true),
('Languages Supported', '110', '+', 'languages', 2, true),
('Workflow Efficiency Boost', '30', '%', 'zap', 3, true),
('API Calls Reduced', '50', '%', 'trending-down', 4, true);

-- Client Logos (companies from PDF EXPERIENCE)
INSERT INTO client_logos (name, display_order, is_active) VALUES
('Nessco Industries', 1, true),
('CodeClause', 2, true),
('UpSys IT and Marketing Sol', 3, true);

-- Project Categories
INSERT INTO project_categories (name, slug, description, display_order, is_active) VALUES
('SaaS', 'saas', 'Software as a Service platforms', 1, true),
('Web Apps', 'web-apps', 'Full-stack web applications', 2, true),
('E-Commerce', 'ecommerce', 'Multi-vendor and microservice e-commerce platforms', 3, true);

-- Projects (PDF PROJECTS section)
INSERT INTO projects (title, slug, short_description, full_description, problem_statement, solution, tech_stack, achievements, live_url, github_url, is_featured, is_published, display_order, results_metrics) VALUES
(
  'ScrapeFlow — SaaS Web Scraping Platform',
  'scrapeflow',
  'A Next.js and TypeScript SaaS platform for no-code, visual web-scraping automation with a drag-and-drop workflow builder.',
  'Engineered a Next.js and TypeScript-based SaaS platform for visual web-scraping automation with drag-and-drop workflow design. Delivered secure scheduling, Stripe billing automation, and stable scraping for login-gated sites.',
  'Teams needed to automate web scraping without coding.',
  'Built a Next.js + TypeScript visual scraper with drag-and-drop workflows, encrypted credentials, and AI-assisted form interaction.',
  ARRAY['Next.js', 'TypeScript', 'React Flow', 'Prisma ORM', 'TanStack Query', 'Stripe'],
  ARRAY[
    'Constructed a no-code visual scraper with a drag-and-drop workflow builder (React Flow) in Next.js and TypeScript.',
    'Integrated Stripe for subscription billing automation and added encrypted credential storage with AI-assisted form interaction for login-gated sites.',
    'Automated secure job scheduling and reliable scraping pipelines using Prisma ORM and TanStack Query.'
  ],
  'https://web-scrapper-sepia.vercel.app',
  '',
  true,
  true,
  2,
  '{"timeline": "2025 – Present", "workflow_type": "Visual Drag & Drop", "billing": "Stripe Integrated", "auth_scraping": "Encrypted Credentials"}'
),
(
  'Learning Management System',
  'learning-management-system',
  'A full-stack Learning Management System delivering a seamless desktop and mobile experience.',
  'Built a Next.js and TypeScript-based Learning Management System in 2022-2023. Added advanced features for seamless desktop/mobile experience, including authentication, secure payments, admin analytics, and real-time communication.',
  'Educators and students needed a robust full-stack LMS with real-time interactions, secure payments, and an admin analytics layer.',
  'Built a full-stack LMS with Next.js, Node.js, Express, and MongoDB. Used Redux Toolkit, TailwindCSS, and TypeScript for state management, UI, and type safety. Integrated Redis, Cloudinary, and Socket.io for caching, media, and real-time communication. Implemented JWT and OAuth authentication with secure payments, admin analytics, and responsive design.',
  ARRAY['Next.js', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit', 'TailwindCSS', 'TypeScript', 'Redis', 'Cloudinary', 'Socket.io', 'JWT', 'OAuth'],
  ARRAY[
    'Engineered a full-stack LMS (Next.js, Node.js, Express, MongoDB) with Redux Toolkit, TailwindCSS, and TypeScript.',
    'Integrated Redis, Cloudinary, and Socket.io for caching, media handling, and real-time communication.',
    'Enforced JWT & OAuth authentication with secure payments, admin analytics, and responsive design.'
  ],
  '',
  '',
  true,
  true,
  3,
  '{"timeline": "2022 – Present"}'
),
(
  'ShopDots — Multivendor E-Commerce',
  'shopdots-multivendor-ecommerce',
  'Multi-vendor e-commerce SaaS platform on a microservice architecture with three dedicated front-ends (User, Seller, Admin).',
  'Developed a scalable e-commerce SaaS platform using a Microservice Architecture with three dedicated front-ends (User, Seller, Admin). Utilized Apache Kafka for an Event-Driven Architecture (EDA) to handle high-volume analytics processing in real-time. Ensured consistent deployment using Docker and implemented API rate limiting and automated cron jobs for maintenance.',
  'A scalable multi-vendor e-commerce platform was needed to support real-time analytics, independent vendor/admin/user experiences, and reliable deployment.',
  'Designed a microservice architecture with three dedicated front-ends, leveraged Apache Kafka for event-driven analytics, and shipped consistent Docker-based deployments with automated cron jobs and API rate limiting.',
  ARRAY['Microservices', 'Apache Kafka', 'Docker', 'Node.js', 'TypeScript', 'REST APIs'],
  ARRAY[
    'Established a scalable multi-vendor e-commerce SaaS platform on a microservice architecture with three dedicated front-ends (User, Seller, Admin).',
    'Leveraged Apache Kafka to build an event-driven architecture (EDA), processing high-volume analytics in real time.',
    'Containerized services with Docker and added API rate limiting and automated cron jobs for reliable, consistent deployments.'
  ],
  '',
  '',
  true,
  true,
  4,
  '{"timeline": "2022 – 2023", "frontends": "User / Seller / Admin"}'
),
(
  'Multi-Tenant ERP Platform',
  'multi-tenant-erp-platform',
  'A production-grade, multi-tenant SaaS ERP for HR, Real-Estate/MLM, and Inventory, built on a no-code dynamic form engine where every business process is a configurable form.',
  'A production-grade, multi-tenant SaaS ERP serving HR, Real-Estate/MLM, and Inventory operations on a single shared-database architecture, built on a no-code dynamic form engine where every business process (attendance, payroll, leads, records) is a configurable form.',
  'Organizations needed to run HR, Real-Estate/MLM, and Inventory operations on one platform without writing custom code for every business process, while keeping each tenant''s data isolated and access tightly controlled.',
  'Built a multi-tenant SaaS on a shared-database architecture with organization-scoped data isolation and a no-code dynamic form engine, layering on 3-tier RBAC, a workflow-rules automation engine, multi-provider AI, and production hardening (Redis caching, audit logging, soft-delete recovery, PWA).',
  ARRAY['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Redis/ioredis', 'Tailwind CSS', 'Radix UI', 'Redux Toolkit', 'SWR', 'Vercel AI SDK', 'face-api.js', 'Supabase', 'PM2/VPS'],
  ARRAY[
    'Architected a multi-tenant SaaS (org-scoped data isolation) with a no-code drag-and-drop form builder powering 346 REST API routes across 139 Prisma models in PostgreSQL.',
    'Built a 3-tier RBAC system (admin → per-user overrides → role-based grants) with real-time permission-versioning and route-level access gating.',
    'Delivered a full HR suite (payroll, leave, onboarding/offboarding, recruitment, appraisals) plus biometric attendance via face-api.js with geofencing and timezone-aware records.',
    'Engineered a Real-Estate/MLM module (property/lead/agent management, commission hierarchy, wallet/ledger) and a workflow-rules engine with event triggers and scheduled jobs.',
    'Integrated multi-provider AI (Anthropic, OpenAI, Google, Groq, xAI) for resume parsing and a contextual chatbot; hardened with Redis caching, audit logging, soft-delete recovery, and PWA push, deployed on a VPS via PM2.'
  ],
  '',
  '',
  true,
  true,
  1,
  '{"api_routes": "346", "prisma_models": "139", "architecture": "Multi-Tenant SaaS / Shared DB", "modules": "HR, Real-Estate/MLM, Inventory"}'
);

-- Tech Stack (SKILLS section from PDF, grouped by category)
INSERT INTO tech_stack (name, icon, category, proficiency_level, years_experience, display_order, is_active) VALUES
-- FRONTEND
('Next.js', 'nextjs', 'Frontend', 5, 2, 1, true),
('React.js', 'react', 'Frontend', 5, 3, 2, true),
('JavaScript (ES6+)', 'javascript', 'Frontend', 5, 3, 3, true),
('TypeScript', 'typescript', 'Frontend', 5, 2, 4, true),
('HTML5', 'html5', 'Frontend', 5, 3, 5, true),
('CSS3', 'css3', 'Frontend', 5, 3, 6, true),
('Redux Toolkit', 'redux', 'Frontend', 4, 2, 7, true),
('TailwindCSS', 'tailwind', 'Frontend', 5, 2, 8, true),
-- BACKEND
('Node.js', 'nodejs', 'Backend', 5, 3, 9, true),
('Express.js', 'express', 'Backend', 5, 3, 10, true),
('REST APIs', 'api', 'Backend', 5, 3, 11, true),
('Microservices', 'microservices', 'Backend', 4, 2, 12, true),
('Apache Kafka', 'kafka', 'Backend', 3, 1, 13, true),
('JWT & OAuth', 'lock', 'Backend', 4, 2, 14, true),
-- Tools & Platforms
('Docker', 'docker', 'Tools & Platforms', 4, 2, 15, true),
('CI/CD', 'pipeline', 'Tools & Platforms', 3, 2, 16, true),
('Nginx', 'nginx', 'Tools & Platforms', 3, 1, 17, true),
('Linux', 'linux', 'Tools & Platforms', 4, 2, 18, true),
('Prisma', 'prisma', 'Tools & Platforms', 5, 2, 19, true),
('Drizzle', 'drizzle', 'Tools & Platforms', 3, 1, 20, true),
('Git & GitHub', 'git', 'Tools & Platforms', 5, 3, 21, true),
('Stripe', 'stripe', 'Tools & Platforms', 4, 2, 22, true),
('VPS', 'server', 'Tools & Platforms', 3, 1, 23, true),
-- Databases
('MySQL', 'mysql', 'Databases', 4, 2, 24, true),
('PostgreSQL', 'postgresql', 'Databases', 5, 2, 25, true),
('MongoDB', 'mongodb', 'Databases', 4, 2, 26, true),
('Prisma ORM', 'prisma', 'Databases', 5, 2, 27, true),
('Redis', 'redis', 'Databases', 4, 2, 28, true),
-- Concepts
('Data Structures & Algorithms', 'binary-tree', 'Concepts', 4, 3, 29, true),
('System Design', 'algorithm', 'Concepts', 4, 2, 30, true),
('Object-Oriented Programming (OOP)', 'cube', 'Concepts', 4, 3, 31, true),
('Event-Driven Architecture', 'workflow', 'Concepts', 4, 2, 32, true),
('Agile / Scrum', 'agile', 'Concepts', 4, 2, 33, true),
-- Others
('RESTful API Design', 'api', 'Others', 5, 2, 34, true),
('SEO Optimization', 'search', 'Others', 4, 2, 35, true),
('Internationalization (i18n)', 'languages', 'Others', 5, 2, 36, true),
('Web Scraping Automation', 'spider', 'Others', 4, 2, 37, true),
('Socket.io', 'socketio', 'Others', 4, 2, 38, true);

-- Experiences (EXPERIENCE section from PDF — exact wording)
INSERT INTO experiences (company_name, job_title, location, start_date, end_date, is_current, description, achievements, tech_used, display_order, is_active) VALUES
(
  'Nessco Industries',
  'Full Stack Developer',
  'Jaipur, Rajasthan',
  '2024-01-01',
  NULL,
  true,
  'Led full-stack development of a multilingual, SEO-focused corporate platform serving users across 200+ countries and 110+ languages.',
  ARRAY[
    'Architected a Next.js + TypeScript platform with middleware-based i18n and dynamic language detection, scaling to 200+ countries.',
    'Built a Node.js, Express, and TypeScript admin panel with AI-driven translations across 110+ languages, managing 15+ data models.',
    'Created an AI-powered card-reader that extracts lead data from image uploads via background jobs and syncs to CRM, lifting sales efficiency 30%.',
    'Tuned Prisma schema and MySQL indexing to lift query performance 25–30%, and cut API calls 50% via translation-caching pipelines.',
    'Configured SEO redirects and geolocation-based routing across 30+ regions to grow organic traffic.'
  ],
  ARRAY['Next.js', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Redis'],
  1,
  true
),
(
  'CodeClause',
  'Intern',
  'Remote',
  '2023-10-01',
  '2023-12-31',
  false,
  'Contributed to authentication and feature delivery during a 3-month internship, completing 100% of assigned milestones on schedule.',
  ARRAY[
    'Developed OTP-based two-factor authentication using the MERN stack (MongoDB, Express.js, React, Node.js), securing 100% of new user registrations.',
    'Collaborated in daily stand-ups and code reviews, maintaining quality standards across the codebase.'
  ],
  ARRAY['MongoDB', 'Express', 'React', 'Node.js'],
  2,
  true
),
(
  'UpSys IT and Marketing Sol',
  'Developer',
  'Remote',
  '2023-06-01',
  '2023-08-31',
  false,
  'Built 5+ responsive, mobile-first pages over a 3-month engagement, delivering a smooth cross-device experience.',
  ARRAY[
    'Built a library of 10+ reusable React components and responsive CSS layouts powering 5+ career and portfolio pages, ensuring pixel-consistent rendering across mobile, tablet, and desktop breakpoints.',
    'Collaborated with a cross-functional team using Git version control, shipping peer-reviewed pull requests that kept the codebase stable across 100+ commits.',
    'Delivered 100% of assigned project milestones on schedule through an iterative, incremental development workflow.'
  ],
  ARRAY['React', 'CSS', 'JavaScript', 'Git'],
  3,
  true
);

-- Education (EDUCATION section from PDF)
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, description, achievements, display_order, is_active) VALUES
(
  'Jaypee University Guna',
  'B.Tech',
  'Computer Science',
  '2020-08-01',
  '2024-06-30',
  'Bachelor of Technology in Computer Science.',
  ARRAY['CGPA: 7.2/10'],
  1,
  true
),
(
  'Sardar Patel H.S. School Rewa',
  'Senior Secondary',
  'State Board',
  '2019-06-01',
  '2020-05-31',
  'Senior Secondary (State Board).',
  ARRAY['Percentage: 85.8%'],
  2,
  true
),
(
  'Sardar Patel H.S. School Rewa',
  'Secondary',
  'State Board',
  '2017-06-01',
  '2018-05-31',
  'Secondary (State Board).',
  ARRAY['Percentage: 93.4%'],
  3,
  true
);

-- Certifications (CERTIFICATES section from PDF)
INSERT INTO certifications (name, issuer, display_order, is_active) VALUES
('Self Paced Javascript Course', 'GeeksforGeeks', 1, true),
('Self Paced Git and Github Course', 'GeeksforGeeks', 2, true),
('Self Paced SQL Course', 'GeeksforGeeks', 3, true),
('Meta Full Stack Course', 'Coursera', 4, true);

-- Services (kept aligned with PDF profile expertise)
INSERT INTO services (title, slug, short_description, full_description, icon, features, price_range, delivery_time, is_featured, display_order, is_active) VALUES
(
  'Full-Stack Web Development',
  'fullstack-web-development',
  'End-to-end web application development with Next.js, TypeScript, and Node.js.',
  'I build scalable, high-performance web applications from scratch using modern technologies. From frontend to backend, database design to deployment, I handle the entire stack.',
  'code',
  ARRAY['Next.js & React development', 'TypeScript for type safety', 'Node.js / Express backend APIs', 'Database design & optimization', 'SEO optimization', 'Responsive UI/UX'],
  'Contact for quote',
  '4-12 weeks',
  true,
  1,
  true
),
(
  'SaaS Platform Development',
  'saas-development',
  'Build scalable SaaS products with authentication, billing, and multi-tenancy.',
  'I specialize in building production-grade SaaS platforms with features like user authentication, subscription billing, real-time features, and microservice architecture.',
  'cloud',
  ARRAY['Microservice architecture', 'Stripe billing integration', 'Real-time features with Socket.io', 'Authentication & authorization', 'Admin dashboards', 'API development'],
  'Contact for quote',
  '8-16 weeks',
  true,
  2,
  true
),
(
  'AI-Powered Tools & Automation',
  'ai-tools-automation',
  'Build AI-powered admin panels, automation tools, and intelligent workflows.',
  'Leverage my experience building AI-powered admin panels supporting 110+ languages, automation tools (web scraping, card readers), and intelligent systems that boost team productivity.',
  'cpu',
  ARRAY['AI-powered content management', 'Multi-language (i18n) support', 'Automated workflows', 'Translation caching pipelines', 'Web scraping automation', 'Performance optimization'],
  'Contact for quote',
  '6-12 weeks',
  true,
  3,
  true
),
(
  'Performance Optimization',
  'performance-optimization',
  'Optimize your existing application for speed, scalability, and efficiency.',
  'I audit and optimize existing web applications — improving database query performance, reducing API calls, and implementing caching strategies for better performance.',
  'zap',
  ARRAY['Database query optimization', 'Caching strategies', 'API optimization', 'Prisma schema design', 'MySQL/PostgreSQL indexing', 'Load testing'],
  'Contact for quote',
  '2-4 weeks',
  false,
  4,
  true
);

-- Process Steps
INSERT INTO process_steps (title, description, icon, display_order, is_active) VALUES
('Discovery', 'Understanding your business goals, target audience, and technical requirements to define a clear roadmap.', 'search', 1, true),
('Architecture', 'Designing a scalable, maintainable system architecture optimized for performance and growth.', 'layers', 2, true),
('Development', 'Building your application with modern technologies — Next.js, TypeScript, Node.js — with regular progress updates.', 'code', 3, true),
('Testing & Optimization', 'Rigorous testing, performance optimization, and database query tuning to ensure reliability.', 'check-circle', 4, true),
('Launch & Deploy', 'Deploying to production with monitoring, documentation, and post-launch support.', 'rocket', 5, true),
('Iterate & Scale', 'Continuous improvement based on user feedback, analytics, and scaling requirements.', 'refresh-cw', 6, true);

-- Philosophy Items
INSERT INTO philosophy_items (title, description, icon, display_order, is_active) VALUES
('Scalable Architecture', 'Every project starts with a solid architectural foundation designed to handle growth — from day one to millions of users.', 'building', 1, true),
('Performance First', 'I optimize at every layer — database queries improved by 25–30%, API calls reduced by 50%, efficient caching pipelines.', 'zap', 2, true),
('Clean & Maintainable Code', 'Writing code that your future team will thank you for. Readability, type safety, and maintainability are non-negotiable.', 'code', 3, true),
('Global Ready', 'Experience building multilingual platforms supporting 200+ countries and 110+ languages from day one.', 'globe', 4, true);

-- Blog Categories
INSERT INTO blog_categories (name, slug, description, display_order, is_active) VALUES
('Engineering', 'engineering', 'Technical deep-dives and engineering best practices', 1, true),
('Architecture', 'architecture', 'System design and software architecture', 2, true),
('Web Development', 'web-development', 'Frontend and backend web development', 3, true),
('Tutorials', 'tutorials', 'Step-by-step coding tutorials', 4, true);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, tags, reading_time, is_featured, is_published, published_at) VALUES
(
  'Building Multilingual Web Apps with Next.js Middleware',
  'building-multilingual-web-apps-nextjs-middleware',
  'How I implemented middleware-based language detection to support 200+ countries dynamically in a Next.js application.',
  'In this article, I walk through how I designed and implemented a middleware-based language detection system that dynamically supports 200+ countries.',
  (SELECT id FROM blog_categories WHERE slug = 'engineering'),
  ARRAY['Next.js', 'Internationalization', 'Middleware', 'SEO', 'Performance'],
  10,
  true,
  true,
  CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
  'Optimizing Database Performance with Prisma and MySQL',
  'optimizing-database-performance-prisma-mysql',
  'Practical techniques I used to improve database query performance by 25-30% through Prisma schema optimization and MySQL indexing.',
  'Database performance is critical for any scalable application. In this post, I share the practical techniques I used at Nessco Industries to improve query performance by 25-30%.',
  (SELECT id FROM blog_categories WHERE slug = 'engineering'),
  ARRAY['Database', 'Prisma', 'MySQL', 'Performance', 'Optimization'],
  8,
  true,
  true,
  CURRENT_TIMESTAMP - INTERVAL '14 days'
),
(
  'Event-Driven Architecture with Kafka and Microservices',
  'event-driven-architecture-kafka-microservices',
  'Designing a multi-vendor e-commerce platform with Apache Kafka for real-time analytics and Docker-based microservices.',
  'Building real-time, multi-vendor commerce at scale requires careful architectural decisions. In this post, I share how the ShopDots platform was structured around Apache Kafka and a microservices topology.',
  (SELECT id FROM blog_categories WHERE slug = 'architecture'),
  ARRAY['Kafka', 'Microservices', 'EDA', 'Docker', 'Architecture'],
  12,
  false,
  true,
  CURRENT_TIMESTAMP - INTERVAL '21 days'
);
