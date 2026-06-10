-- Project explainers: a spoken/visual walkthrough that lives on the project card,
-- alongside the existing live_url / github_url links.
--   explainer_video_url  -> direct file (.mp4/.webm) OR a YouTube / Vimeo link
--   explainer_audio_url  -> direct file (.mp3/.wav/.m4a) — a short "founder's note" narration
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS explainer_video_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS explainer_audio_url VARCHAR(500);
