-- Add video column to projects table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'video') THEN
        ALTER TABLE projects ADD COLUMN video TEXT;
    END IF;
END $$;
