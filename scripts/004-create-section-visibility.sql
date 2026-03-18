-- Section visibility table for toggling sections on/off per page
CREATE TABLE IF NOT EXISTS section_visibility (
  id SERIAL PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, section)
);

-- Seed all page sections with default visibility (all visible)
INSERT INTO section_visibility (page, section, is_visible, display_order) VALUES
-- Home page
('home', 'hero', true, 0),
('home', 'clients', true, 1),
('home', 'metrics', true, 2),
('home', 'featured_projects', true, 3),
('home', 'philosophy', true, 4),
('home', 'tech_stack', true, 5),
('home', 'process', true, 6),
('home', 'testimonials', true, 7),
('home', 'blog_preview', true, 8),
('home', 'cta', true, 9),

-- About page
('about', 'hero', true, 0),
('about', 'experience', true, 1),
('about', 'skills', true, 2),
('about', 'cta', true, 3),

-- Services page
('services', 'hero', true, 0),
('services', 'services_grid', true, 1),
('services', 'pricing', true, 2),
('services', 'faq', true, 3),
('services', 'cta', true, 4),

-- Projects page
('projects', 'hero', true, 0),
('projects', 'projects_grid', true, 1),
('projects', 'cta', true, 2),

-- Blog page
('blog', 'hero', true, 0),
('blog', 'blog_grid', true, 1),

-- Contact page
('contact', 'hero', true, 0),
('contact', 'form', true, 1),
('contact', 'info', true, 2)

ON CONFLICT (page, section) DO NOTHING;
