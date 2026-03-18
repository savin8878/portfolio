-- Create contact form fields table for dynamic form builder
CREATE TABLE IF NOT EXISTS contact_form_fields (
  id SERIAL PRIMARY KEY,
  field_name VARCHAR(100) NOT NULL UNIQUE,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL DEFAULT 'text',
  placeholder VARCHAR(255),
  help_text TEXT,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  field_width VARCHAR(20) DEFAULT 'full',
  options JSONB,
  validation_rules JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default form fields
INSERT INTO contact_form_fields (field_name, field_label, field_type, placeholder, is_required, is_active, display_order, field_width, options) VALUES
('name', 'Full Name', 'text', 'John Doe', true, true, 1, 'half', NULL),
('email', 'Email Address', 'email', 'john@example.com', true, true, 2, 'half', NULL),
('company', 'Company / Organization', 'text', 'Acme Inc', false, true, 3, 'full', NULL),
('project_type', 'Project Type', 'select', 'Select type', true, true, 4, 'third', '["SaaS Development", "MVP Development", "Technical Consulting", "API Development", "Web Application", "Mobile App", "E-Commerce", "Other"]'),
('budget_range', 'Budget Range', 'select', 'Select budget', false, true, 5, 'third', '["Under $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "Over $100,000"]'),
('timeline', 'Timeline', 'select', 'Select timeline', false, true, 6, 'third', '["ASAP", "Within 1 month", "1-3 months", "3-6 months", "Flexible"]'),
('message', 'Project Details', 'textarea', 'Tell me about your project, goals, and any specific requirements...', true, true, 7, 'full', NULL)
ON CONFLICT (field_name) DO NOTHING;
