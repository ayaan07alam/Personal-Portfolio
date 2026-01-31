-- Create tables for portfolio website

-- Hero Section
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  background_image TEXT,
  profile_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Section
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  resume_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  location TEXT,
  company_logo TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  logo TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Information
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  portfolio_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data
INSERT INTO hero_section (title, subtitle, description, cta_text, cta_link)
VALUES (
  'Hi, I''m Your Name',
  'Full Stack Developer',
  'I craft beautiful and functional web experiences that make a difference.',
  'View My Work',
  '#projects'
);

INSERT INTO about_section (title, content)
VALUES (
  'About Me',
  'I am a passionate developer with experience in building modern web applications. I love creating beautiful, functional, and user-friendly experiences that solve real-world problems.'
);

INSERT INTO contact_info (email, phone, location)
VALUES (
  'your.email@example.com',
  '+1 (123) 456-7890',
  'San Francisco, CA'
);

-- Create storage bucket for images (run this in Supabase Storage UI or via SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_section FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);

-- Authenticated users can modify (for admin dashboard)
CREATE POLICY "Authenticated users can insert" ON hero_section FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON hero_section FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON hero_section FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON about_section FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON about_section FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON about_section FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON skills FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON skills FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON experiences FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON experiences FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON education FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON education FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON education FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON contact_info FOR INSERT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update" ON contact_info FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete" ON contact_info FOR DELETE TO authenticated USING (true);
