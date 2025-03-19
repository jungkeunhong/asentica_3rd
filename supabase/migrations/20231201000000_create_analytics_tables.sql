-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  referrer TEXT
);

-- Create search terms aggregation table
CREATE TABLE IF NOT EXISTS search_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT UNIQUE NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  first_searched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create page views analytics table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  title TEXT,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS search_analytics_query_idx ON search_analytics(query);
CREATE INDEX IF NOT EXISTS search_analytics_timestamp_idx ON search_analytics(timestamp);
CREATE INDEX IF NOT EXISTS search_analytics_user_id_idx ON search_analytics(user_id);

CREATE INDEX IF NOT EXISTS search_terms_count_idx ON search_terms(count);
CREATE INDEX IF NOT EXISTS search_terms_term_idx ON search_terms(term);

CREATE INDEX IF NOT EXISTS page_views_page_idx ON page_views(page);
CREATE INDEX IF NOT EXISTS page_views_timestamp_idx ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS page_views_user_id_idx ON page_views(user_id);

-- Add RLS policies
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for search_analytics
CREATE POLICY "Allow insert for all users" ON search_analytics
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Allow select for admins" ON search_analytics
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create policies for search_terms
CREATE POLICY "Allow select for all users" ON search_terms
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Allow insert/update for admins" ON search_terms
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create policies for page_views
CREATE POLICY "Allow insert for all users" ON page_views
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Allow select for admins" ON page_views
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
