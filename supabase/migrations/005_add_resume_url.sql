-- Add resume_url to hero_section
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_section' AND column_name = 'resume_url') THEN
        ALTER TABLE hero_section ADD COLUMN resume_url TEXT;
    END IF;
END $$;
