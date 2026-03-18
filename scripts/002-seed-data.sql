-- Seed Data for Premium Portfolio

-- Theme Settings
INSERT INTO theme_settings (primary_color, secondary_color, accent_color, background_color, foreground_color, muted_color, border_radius, font_heading, font_body, dark_mode)
VALUES ('#0f172a', '#64748b', '#3b82f6', '#ffffff', '#0f172a', '#f1f5f9', '0.75rem', 'Inter', 'Inter', false);

-- Site Settings
INSERT INTO site_settings (site_name, site_description, developer_name, professional_title, tagline, email, location, availability_status, meta_title, meta_description)
VALUES (
  'Akash Vishwakarma Portfolio',
  'Full-Stack Product Engineer specializing in scalable SaaS platforms, AI tools, and high-performance web applications.',
  'Akash Vishwakarma',
  'Full-Stack Product Engineer',
  'I build scalable SaaS platforms, AI tools, and high-performance web applications that drive business growth.',
  'hello@alexchen.dev',
  'San Francisco, CA',
  'available',
  'Akash Vishwakarma - Full-Stack Product Engineer',
  'Senior Full-Stack Engineer specializing in building scalable SaaS platforms, AI tools, and high-performance web applications.'
);

-- Hero Section
INSERT INTO hero_section (headline, subheadline, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, background_type, is_active)
VALUES (
  'Building the Future of Digital Products',
  'I help startups and enterprises build scalable SaaS platforms, AI-powered tools, and high-performance web applications that drive measurable business impact.',
  'View Case Studies',
  '/projects',
  'Start a Project',
  '/contact',
  'gradient',
  true
);

-- Social Links
INSERT INTO social_links (platform, url, icon, display_order, is_active) VALUES
('GitHub', 'https://github.com', 'github', 1, true),
('LinkedIn', 'https://linkedin.com', 'linkedin', 2, true),
('Twitter', 'https://twitter.com', 'twitter', 3, true),
('Email', 'mailto:hello@alexchen.dev', 'mail', 4, true);

-- Impact Metrics
INSERT INTO impact_metrics (label, value, suffix, icon, display_order, is_active) VALUES
('Products Built', '30', '+', 'package', 1, true),
('Users Reached', '1M', '+', 'users', 2, true),
('Successful Deployments', '120', '+', 'rocket', 3, true),
('Years Experience', '8', '+', 'calendar', 4, true);

-- Client Logos
INSERT INTO client_logos (name, display_order, is_active) VALUES
('TechCorp', 1, true),
('StartupX', 2, true),
('InnovateLabs', 3, true),
('CloudScale', 4, true),
('DataFlow', 5, true),
('AIVentures', 6, true);

-- Project Categories
INSERT INTO project_categories (name, slug, description, display_order, is_active) VALUES
('SaaS', 'saas', 'Software as a Service platforms', 1, true),
('AI Tools', 'ai-tools', 'Artificial Intelligence powered applications', 2, true),
('Web Apps', 'web-apps', 'Full-stack web applications', 3, true),
('Open Source', 'open-source', 'Open source contributions and projects', 4, true),
('Mobile Apps', 'mobile-apps', 'Cross-platform mobile applications', 5, true);

-- Projects
INSERT INTO projects (title, slug, short_description, full_description, problem_statement, solution, tech_stack, is_featured, is_published, display_order, results_metrics) VALUES
(
  'CloudSync Analytics',
  'cloudsync-analytics',
  'Real-time analytics platform processing 10M+ events daily for enterprise clients.',
  'Built a comprehensive real-time analytics platform that processes millions of events daily, providing actionable insights for enterprise decision-making.',
  'Enterprise clients needed a scalable solution to process and visualize millions of data points in real-time without latency issues.',
  'Developed a microservices architecture using event-driven design, implementing real-time data pipelines with Apache Kafka and Redis for caching.',
  ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Apache Kafka', 'AWS'],
  true,
  true,
  1,
  '{"users": "50K+", "events_daily": "10M+", "uptime": "99.99%", "response_time": "<100ms"}'
),
(
  'AI Content Studio',
  'ai-content-studio',
  'AI-powered content generation platform used by 5000+ marketing teams worldwide.',
  'Created an AI-powered content generation platform that helps marketing teams create high-quality content at scale.',
  'Marketing teams struggled to produce consistent, high-quality content at the pace required by modern digital marketing.',
  'Built an AI-powered platform leveraging GPT-4 and custom fine-tuned models to generate, edit, and optimize marketing content.',
  ARRAY['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Redis', 'Docker'],
  true,
  true,
  2,
  '{"teams": "5000+", "content_generated": "1M+", "time_saved": "70%", "satisfaction": "4.9/5"}'
),
(
  'FinTech Dashboard',
  'fintech-dashboard',
  'Secure financial dashboard managing $500M+ in transactions for a Series B startup.',
  'Designed and built a comprehensive financial dashboard for managing large-scale transactions with bank-level security.',
  'A growing fintech startup needed a secure, scalable dashboard to manage increasing transaction volumes while maintaining compliance.',
  'Implemented a secure dashboard with real-time transaction monitoring, fraud detection, and comprehensive audit logging.',
  ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Plaid', 'AWS'],
  true,
  true,
  3,
  '{"transactions": "$500M+", "security_incidents": "0", "processing_speed": "2x faster", "compliance": "100%"}'
),
(
  'DevOps Automation Suite',
  'devops-automation',
  'CI/CD platform reducing deployment time by 80% for development teams.',
  'Created an automated DevOps platform that streamlines the entire deployment pipeline from code commit to production.',
  'Development teams were spending too much time on manual deployment processes, leading to slower release cycles.',
  'Built a comprehensive CI/CD platform with automated testing, containerization, and one-click deployments.',
  ARRAY['Go', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'AWS'],
  false,
  true,
  4,
  '{"deployment_time": "-80%", "teams": "100+", "deployments_monthly": "10K+", "rollback_time": "<5min"}'
),
(
  'E-Commerce Platform',
  'ecommerce-platform',
  'Headless commerce solution powering 200+ online stores with $50M+ GMV.',
  'Built a headless e-commerce platform that enables businesses to create custom shopping experiences.',
  'Traditional e-commerce platforms lacked the flexibility for brands to create unique customer experiences.',
  'Developed a headless commerce API with customizable storefronts, real-time inventory, and multi-channel selling.',
  ARRAY['Next.js', 'GraphQL', 'PostgreSQL', 'Stripe', 'Algolia', 'Vercel'],
  false,
  true,
  5,
  '{"stores": "200+", "gmv": "$50M+", "conversion_increase": "+35%", "page_speed": "95+"}'
);

-- Tech Stack
INSERT INTO tech_stack (name, icon, category, proficiency_level, years_experience, display_order, is_active) VALUES
('React', 'react', 'Frontend', 5, 6, 1, true),
('Next.js', 'nextjs', 'Frontend', 5, 4, 2, true),
('TypeScript', 'typescript', 'Frontend', 5, 5, 3, true),
('Tailwind CSS', 'tailwind', 'Frontend', 5, 4, 4, true),
('Node.js', 'nodejs', 'Backend', 5, 7, 5, true),
('Python', 'python', 'Backend', 4, 5, 6, true),
('PostgreSQL', 'postgresql', 'Backend', 5, 6, 7, true),
('MongoDB', 'mongodb', 'Backend', 4, 4, 8, true),
('AWS', 'aws', 'Infrastructure', 5, 5, 9, true),
('Docker', 'docker', 'Infrastructure', 5, 5, 10, true),
('Kubernetes', 'kubernetes', 'Infrastructure', 4, 3, 11, true),
('Vercel', 'vercel', 'Infrastructure', 5, 3, 12, true),
('Git', 'git', 'Tools', 5, 8, 13, true),
('Figma', 'figma', 'Tools', 4, 4, 14, true);

-- Experiences
INSERT INTO experiences (company_name, job_title, location, start_date, end_date, is_current, description, achievements, tech_used, display_order, is_active) VALUES
(
  'TechCorp',
  'Senior Full-Stack Engineer',
  'San Francisco, CA',
  '2022-01-01',
  NULL,
  true,
  'Leading development of enterprise SaaS products and mentoring junior engineers.',
  ARRAY['Led team of 8 engineers delivering $10M+ revenue product', 'Reduced infrastructure costs by 40%', 'Implemented CI/CD reducing deployment time by 80%'],
  ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Kubernetes'],
  1,
  true
),
(
  'StartupX',
  'Full-Stack Engineer',
  'Remote',
  '2019-06-01',
  '2021-12-31',
  false,
  'Built core product features and scaled platform to 100K+ users.',
  ARRAY['Scaled platform from 0 to 100K users', 'Built real-time collaboration features', 'Optimized database queries improving performance by 60%'],
  ARRAY['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
  2,
  true
),
(
  'InnovateLabs',
  'Software Engineer',
  'New York, NY',
  '2017-03-01',
  '2019-05-31',
  false,
  'Developed web applications for enterprise clients across various industries.',
  ARRAY['Delivered 15+ client projects on time', 'Introduced automated testing improving code quality', 'Mentored 3 junior developers'],
  ARRAY['React', 'Python', 'PostgreSQL', 'AWS'],
  3,
  true
);

-- Services
INSERT INTO services (title, slug, short_description, full_description, icon, features, price_range, delivery_time, is_featured, display_order, is_active) VALUES
(
  'SaaS Development',
  'saas-development',
  'End-to-end SaaS product development from concept to launch.',
  'I specialize in building scalable SaaS platforms that grow with your business. From initial concept and architecture to launch and beyond, I handle the entire development lifecycle.',
  'cloud',
  ARRAY['Full-stack development', 'Scalable architecture', 'Payment integration', 'User authentication', 'Analytics dashboard', 'API development'],
  '$15,000 - $50,000',
  '8-16 weeks',
  true,
  1,
  true
),
(
  'MVP Development',
  'mvp-development',
  'Rapid MVP development to validate your startup idea.',
  'Get your product to market fast with a well-architected MVP. I focus on building the core features that matter most, allowing you to validate your idea and start gathering user feedback quickly.',
  'rocket',
  ARRAY['Rapid prototyping', 'Core feature development', 'User feedback integration', 'Scalable foundation', 'Launch support'],
  '$8,000 - $25,000',
  '4-8 weeks',
  true,
  2,
  true
),
(
  'Technical Consulting',
  'technical-consulting',
  'Strategic technical guidance for your engineering challenges.',
  'Leverage my experience to solve complex technical challenges, improve your architecture, or guide your team through critical decisions.',
  'lightbulb',
  ARRAY['Architecture review', 'Code audit', 'Performance optimization', 'Team mentoring', 'Technology selection'],
  '$200 - $400/hour',
  'Ongoing',
  false,
  3,
  true
),
(
  'API Development',
  'api-development',
  'Robust, scalable API design and implementation.',
  'Build powerful APIs that serve as the backbone of your digital products. I create well-documented, secure, and performant APIs that your team and partners will love.',
  'code',
  ARRAY['RESTful API design', 'GraphQL implementation', 'API documentation', 'Rate limiting', 'Authentication', 'Versioning'],
  '$10,000 - $30,000',
  '4-12 weeks',
  false,
  4,
  true
);

-- Testimonials
INSERT INTO testimonials (client_name, client_title, client_company, testimonial_text, rating, is_featured, display_order, is_active) VALUES
(
  'Sarah Johnson',
  'CEO',
  'TechStartup Inc',
  'Alex transformed our vision into a reality. His technical expertise and attention to detail resulted in a product that exceeded our expectations. The platform he built has been instrumental in our growth.',
  5,
  true,
  1,
  true
),
(
  'Michael Chen',
  'CTO',
  'DataFlow Systems',
  'Working with Alex was a game-changer for our engineering team. His architectural decisions and clean code practices set a new standard for our development process.',
  5,
  true,
  2,
  true
),
(
  'Emily Rodriguez',
  'Product Manager',
  'CloudScale',
  'Alex has an incredible ability to understand business requirements and translate them into elegant technical solutions. His communication and delivery are always on point.',
  5,
  true,
  3,
  true
),
(
  'David Park',
  'Founder',
  'AIVentures',
  'The AI-powered platform Alex built for us handles millions of requests with ease. His expertise in both AI and scalable architecture made him the perfect partner for our project.',
  5,
  false,
  4,
  true
);

-- Blog Categories
INSERT INTO blog_categories (name, slug, description, display_order, is_active) VALUES
('Engineering', 'engineering', 'Technical deep-dives and engineering best practices', 1, true),
('Architecture', 'architecture', 'System design and software architecture', 2, true),
('Career', 'career', 'Career advice and professional development', 3, true),
('Tutorials', 'tutorials', 'Step-by-step coding tutorials', 4, true);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, tags, reading_time, is_featured, is_published, published_at) VALUES
(
  'Building Scalable SaaS Architecture in 2024',
  'building-scalable-saas-architecture-2024',
  'A comprehensive guide to designing and implementing scalable SaaS architectures that can handle millions of users.',
  'Full article content here...',
  (SELECT id FROM blog_categories WHERE slug = 'architecture'),
  ARRAY['SaaS', 'Architecture', 'Scalability', 'Best Practices'],
  12,
  true,
  true,
  CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
  'The Art of Writing Clean TypeScript Code',
  'art-of-writing-clean-typescript-code',
  'Practical tips and patterns for writing maintainable, type-safe TypeScript code in large codebases.',
  'Full article content here...',
  (SELECT id FROM blog_categories WHERE slug = 'engineering'),
  ARRAY['TypeScript', 'Clean Code', 'Best Practices'],
  8,
  true,
  true,
  CURRENT_TIMESTAMP - INTERVAL '12 days'
),
(
  'From Engineer to Tech Lead: Lessons Learned',
  'from-engineer-to-tech-lead',
  'Reflections on the transition from individual contributor to technical leadership and the skills that matter most.',
  'Full article content here...',
  (SELECT id FROM blog_categories WHERE slug = 'career'),
  ARRAY['Career', 'Leadership', 'Growth'],
  10,
  false,
  true,
  CURRENT_TIMESTAMP - INTERVAL '20 days'
);

-- Process Steps
INSERT INTO process_steps (title, description, icon, display_order, is_active) VALUES
('Discovery', 'Deep dive into your business goals, target users, and technical requirements to create a solid foundation.', 'search', 1, true),
('Architecture', 'Design a scalable, maintainable system architecture that aligns with your growth trajectory.', 'layers', 2, true),
('Development', 'Build your product using modern technologies and best practices with regular progress updates.', 'code', 3, true),
('Testing', 'Rigorous testing to ensure reliability, security, and performance across all scenarios.', 'check-circle', 4, true),
('Launch', 'Deploy to production with monitoring, documentation, and support for a smooth launch.', 'rocket', 5, true),
('Iterate', 'Continuous improvement based on user feedback and analytics to drive growth.', 'refresh-cw', 6, true);

-- Philosophy Items
INSERT INTO philosophy_items (title, description, icon, display_order, is_active) VALUES
('Scalable Architecture First', 'Every project starts with a solid architectural foundation designed to handle growth from day one.', 'building', 1, true),
('Clean, Maintainable Code', 'Writing code that your future team will thank you for. Readability and maintainability are non-negotiable.', 'code', 2, true),
('Measurable Business Impact', 'Every technical decision is tied to business outcomes. Features are prioritized by impact, not complexity.', 'chart-bar', 3, true),
('Performance Obsessed', 'Fast is a feature. I optimize for performance at every layer of the stack.', 'zap', 4, true);
