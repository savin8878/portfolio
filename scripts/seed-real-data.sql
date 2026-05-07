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
  'Full-Stack Developer specializing in high-performance Next.js, TypeScript, and Node.js applications. Built multilingual, SEO-optimized platforms serving users across 200+ countries. Delivered AI-powered automation tools, reduced API costs by 50%, and improved workflow efficiency by 30%. Experienced in architecting scalable systems using Prisma, MySQL, Docker, Kafka, and microservices.',
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
('CodeCluse', 2, true),
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
  'Engineered a Next.js and TypeScript-based SaaS platform for visual web-scraping automation with drag-and-drop workflow design.',
  'Engineered a Next.js and TypeScript-based SaaS platform for visual web-scraping automation with drag-and-drop workflow design. Delivered secure scheduling, Stripe billing automation, and stable scraping for login-gated sites.',
  'Teams needed to automate web scraping without coding.',
  'Built a Next.js + TypeScript visual scraper with drag-and-drop workflows, encrypted credentials, and AI-assisted form interaction.',
  ARRAY['Next.js', 'TypeScript', 'React Flow', 'Prisma ORM', 'TanStack Query', 'Stripe'],
  ARRAY[
    'Problem: Teams needed to automate web scraping without coding.',
    'Action: Built a Next.js + TypeScript visual scraper with drag-and-drop workflows, encrypted credentials, and AI-assisted form interaction.',
    'Result: Delivered secure scheduling, Stripe billing automation, and stable scraping for login-gated sites.'
  ],
  'https://web-scrapper-sepia.vercel.app',
  '',
  true,
  true,
  1,
  '{"timeline": "2025 – Present", "workflow_type": "Visual Drag & Drop", "billing": "Stripe Integrated", "auth_scraping": "Encrypted Credentials"}'
),
(
  'Learning Management System',
  'learning-management-system',
  'Built a Next.js and TypeScript-based Learning Management System with advanced features for seamless desktop and mobile experience.',
  'Built a Next.js and TypeScript-based Learning Management System in 2022-2023. Added advanced features for seamless desktop/mobile experience, including authentication, secure payments, admin analytics, and real-time communication.',
  'Educators and students needed a robust full-stack LMS with real-time interactions, secure payments, and an admin analytics layer.',
  'Built a full-stack LMS with Next.js, Node.js, Express, and MongoDB. Used Redux Toolkit, TailwindCSS, and TypeScript for state management, UI, and type safety. Integrated Redis, Cloudinary, and Socket.io for caching, media, and real-time communication. Implemented JWT and OAuth authentication with secure payments, admin analytics, and responsive design.',
  ARRAY['Next.js', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit', 'TailwindCSS', 'TypeScript', 'Redis', 'Cloudinary', 'Socket.io', 'JWT', 'OAuth'],
  ARRAY[
    'Built with Next.js, Node.js, Express, and MongoDB for a robust full-stack LMS platform.',
    'Used Redux Toolkit, TailwindCSS, and TypeScript for state management, UI, and type safety.',
    'Integrated Redis, Cloudinary, and Socket.io for caching, media handling, and real-time communication.',
    'Implemented JWT & OAuth authentication with secure payments, admin analytics, and responsive design.'
  ],
  '',
  '',
  true,
  true,
  2,
  '{"timeline": "2022 – Present"}'
),
(
  'ShopDots — Multivendor E-Commerce',
  'shopdots-multivendor-ecommerce',
  'Multi-Vendor E-Commerce SaaS Platform built with a Microservice Architecture and three dedicated front-ends (User, Seller, Admin).',
  'Developed a scalable e-commerce SaaS platform using a Microservice Architecture with three dedicated front-ends (User, Seller, Admin). Utilized Apache Kafka for an Event-Driven Architecture (EDA) to handle high-volume analytics processing in real-time. Ensured consistent deployment using Docker and implemented API rate limiting and automated cron jobs for maintenance.',
  'A scalable multi-vendor e-commerce platform was needed to support real-time analytics, independent vendor/admin/user experiences, and reliable deployment.',
  'Designed a microservice architecture with three dedicated front-ends, leveraged Apache Kafka for event-driven analytics, and shipped consistent Docker-based deployments with automated cron jobs and API rate limiting.',
  ARRAY['Microservices', 'Apache Kafka', 'Docker', 'Node.js', 'TypeScript', 'REST APIs'],
  ARRAY[
    'Scalability: Utilized Apache Kafka for an Event-Driven Architecture (EDA) to handle high-volume analytics processing in real-time.',
    'Infrastructure: Ensured consistent deployment using Docker and implemented API Rate Limiting and automated Cron Jobs for maintenance.'
  ],
  '',
  '',
  true,
  true,
  3,
  '{"timeline": "2022 – 2023", "frontends": "User / Seller / Admin"}'
);

-- Tech Stack (SKILLS section from PDF, grouped by category)
INSERT INTO tech_stack (name, icon, category, proficiency_level, years_experience, display_order, is_active) VALUES
-- FRONTEND
('Next.js', 'nextjs', 'Frontend', 5, 2, 1, true),
('React.js', 'react', 'Frontend', 5, 3, 2, true),
('TypeScript', 'typescript', 'Frontend', 5, 2, 3, true),
('Redux Toolkit', 'redux', 'Frontend', 4, 2, 4, true),
('TailwindCSS', 'tailwind', 'Frontend', 5, 2, 5, true),
-- BACKEND
('Node.js', 'nodejs', 'Backend', 5, 3, 6, true),
('Express.js', 'express', 'Backend', 5, 3, 7, true),
('REST APIs', 'api', 'Backend', 5, 3, 8, true),
('Microservices', 'microservices', 'Backend', 4, 2, 9, true),
('Kafka', 'kafka', 'Backend', 3, 1, 10, true),
-- Tools & Platforms
('Docker', 'docker', 'Tools & Platforms', 4, 2, 11, true),
('Nginx', 'nginx', 'Tools & Platforms', 3, 1, 12, true),
('Prisma', 'prisma', 'Tools & Platforms', 5, 2, 13, true),
('Drizzle', 'drizzle', 'Tools & Platforms', 3, 1, 14, true),
('Git', 'git', 'Tools & Platforms', 5, 3, 15, true),
('VPS', 'server', 'Tools & Platforms', 3, 1, 16, true),
-- Databases
('MySQL', 'mysql', 'Databases', 4, 2, 17, true),
('MongoDB', 'mongodb', 'Databases', 4, 2, 18, true),
('Prisma ORM', 'prisma', 'Databases', 5, 2, 19, true),
('PostgreSQL', 'postgresql', 'Databases', 5, 2, 20, true),
('Redis', 'redis', 'Databases', 4, 2, 21, true),
-- Concepts
('Data Structures', 'binary-tree', 'Concepts', 4, 3, 22, true),
('Algorithms', 'algorithm', 'Concepts', 4, 3, 23, true),
('OOP', 'cube', 'Concepts', 4, 3, 24, true),
('Agile Methodologies', 'agile', 'Concepts', 4, 2, 25, true),
-- Others
('SEO Optimization', 'search', 'Others', 4, 2, 26, true),
('i18n', 'languages', 'Others', 5, 2, 27, true),
('Web Scraping Automation', 'spider', 'Others', 4, 2, 28, true),
('Socket.io', 'socketio', 'Others', 4, 2, 29, true);

-- Experiences (EXPERIENCE section from PDF — exact wording)
INSERT INTO experiences (company_name, job_title, location, start_date, end_date, is_current, description, achievements, tech_used, display_order, is_active) VALUES
(
  'Nessco Industries',
  'Full Stack Developer',
  'Jaipur, Rajasthan',
  '2024-01-01',
  NULL,
  true,
  'Architected a Next.js and TypeScript website with middleware for internationalization, supporting 200+ countries and dynamic language detection for global user engagement.',
  ARRAY[
    'Architected a Next.js and TypeScript website with middleware for internationalization, supporting 200+ countries and dynamic language detection for global user engagement.',
    'Developed a Node.js, Express, and TypeScript admin panel with AI-driven translations for 110+ languages, streamlining content management across 15+ multilingual data models.',
    'Built an AI-based card reader tool for sales teams, processing image uploads via background jobs for accurate lead data extraction and CRM integration, boosting efficiency by 30%.',
    'Optimized Prisma schema and MySQL indexing — improved query performance by 25–30%.',
    'Implemented SEO redirects and geolocation routing for 30+ regions, boosting organic traffic. Reduced API calls by 50% using optimized translation caching pipelines.'
  ],
  ARRAY['Next.js', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Redis'],
  1,
  true
),
(
  'CodeCluse',
  'Intern',
  'Remote',
  '2023-10-01',
  '2023-12-31',
  false,
  'Implemented OTP verification using the MERN stack and contributed to delivering project milestones within an agile team.',
  ARRAY[
    'Implemented OTP verification using MERN stack (MongoDB, Express.js, React, Node.js), enhancing user authentication security.',
    'Successfully completed internship deliverables, meeting project deadlines and quality standards.'
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
  'Designed responsive career and portfolio pages for the UpSys website using React and CSS, improving user engagement.',
  ARRAY[
    'Designed responsive career and portfolio pages for the UpSys website using React and CSS, improving user engagement.',
    'Collaborated with a development team via a private Git repository, maintaining consistent code updates using Visual Studio Code.',
    'Streamlined workflow by adhering to agile practices, contributing to timely project milestones.'
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
