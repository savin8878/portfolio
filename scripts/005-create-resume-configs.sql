-- Resume configurations table
CREATE TABLE IF NOT EXISTS resume_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Default Resume',
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick default lookup
CREATE INDEX IF NOT EXISTS idx_resume_configs_default ON resume_configs(is_default);
