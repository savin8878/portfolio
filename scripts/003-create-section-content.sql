-- Section content table for managing all static text across the site
CREATE TABLE IF NOT EXISTS section_content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section)
);

-- Seed: Home page sections
INSERT INTO section_content (page, section, content) VALUES
('home', 'hero', '{
  "availability_text": "Available for new projects"
}'),
('home', 'clients', '{
  "subtitle": "Trusted by innovative companies"
}'),
('home', 'featured_projects', '{
  "label": "Featured Work",
  "title": "Case Studies &",
  "title_highlight": "Projects"
}'),
('home', 'process', '{
  "label": "Process",
  "title": "How We Build",
  "title_highlight": "Together",
  "panel_label": "My commitment",
  "panel_title": "Clarity at every step",
  "panel_description": "No black boxes. You always know where the project stands, what was shipped, and what comes next. I aim for decisions together — not surprises after the fact.",
  "panel_items": ["Weekly async updates", "Shared project board", "Code reviews & docs", "Post-launch support"]
}'),
('home', 'testimonials', '{
  "label": "Testimonials",
  "title": "What Clients",
  "title_highlight": "Say"
}'),
('home', 'blog_preview', '{
  "label": "Latest Insights",
  "title": "From the Blog",
  "description": "Technical deep-dives, engineering best practices, and lessons learned from building products."
}'),
('home', 'cta', '{
  "label": "Get In Touch",
  "title": "Let''s Build",
  "title_highlight": "Something",
  "title_suffix": "Exceptional",
  "description": "Whether launching a new product, scaling a platform, or solving a hard engineering problem — I''m ready to help.",
  "response_text": "Available for new projects · Typical response within 24 hours",
  "links": [
    {"icon": "MessageSquare", "label": "Start a Project", "sub": "Tell me about your idea", "href": "/contact", "primary": true},
    {"icon": "Calendar", "label": "Schedule a Call", "sub": "Pick a time that works", "href": "/contact#schedule", "primary": false},
    {"icon": "Mail", "label": "Send an Email", "sub": "hello@akashvishwakarma.dev", "href": "mailto:hello@akashvishwakarma.dev", "primary": false}
  ]
}'),

-- Seed: About page sections
('about', 'hero', '{
  "experience_text": "With over 8 years of experience, I have helped startups and enterprises build products that scale. My approach combines deep technical expertise with a strong focus on business outcomes, ensuring every line of code contributes to measurable impact.",
  "personal_text": "When I am not coding, you will find me exploring new technologies, contributing to open source projects, or mentoring aspiring developers. I believe in continuous learning and sharing knowledge with the community.",
  "years_experience": "8+ Years Experience"
}'),
('about', 'experience', '{
  "label": "Career Journey",
  "title": "Experience &",
  "title_highlight": "Background",
  "panel_label": "At a Glance",
  "panel_title": "Career Highlights",
  "panel_description": "Years of building products that scale, leading teams, and turning complex problems into elegant solutions.",
  "panel_items": ["8+ years in full-stack development", "Startup to enterprise scale", "Team leadership & mentoring", "Product-driven engineering"]
}'),
('about', 'skills', '{
  "label": "Tech Stack",
  "title": "Skills &",
  "title_highlight": "Expertise",
  "description": "A comprehensive overview of my technical capabilities built over years of hands-on experience."
}')

ON CONFLICT (page, section) DO NOTHING;
