-- Reviews / Testimonials from clients
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  client_avatar TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  project_name TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can only READ approved reviews
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Anyone can INSERT (submit a review) — they default to is_approved = false
CREATE POLICY "Public can submit reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Authenticated users can select all reviews" ON reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update reviews" ON reviews
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete reviews" ON reviews
  FOR DELETE TO authenticated USING (true);
