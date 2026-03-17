-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, -- Added for ownership/auth
  html_code text DEFAULT '',
  css_code text DEFAULT '',
  js_code text DEFAULT '',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add new columns safely using a DO block to avoid 'already exists' error
DO $$
BEGIN
  BEGIN
    ALTER TABLE projects ADD COLUMN title text;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;

  BEGIN
    ALTER TABLE projects ADD COLUMN description text;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;

  BEGIN
    ALTER TABLE projects ADD COLUMN files jsonb;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;

  BEGIN
    ALTER TABLE projects ADD COLUMN readme text;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;

  BEGIN
    ALTER TABLE projects ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
  EXCEPTION
    WHEN duplicate_column THEN null;
  END;
END $$;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  html text DEFAULT '',
  css text DEFAULT '',
  js text DEFAULT '',
  preview_image text,
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create template_requests table
CREATE TABLE IF NOT EXISTS template_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) safely
DO $$
BEGIN
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$
BEGIN
  ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$
BEGIN
  ALTER TABLE template_requests ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Enable read access for all users on projects" ON projects;
DROP POLICY IF EXISTS "Enable insert access for all users on projects" ON projects;
DROP POLICY IF EXISTS "Enable read access for all users on templates" ON templates;
DROP POLICY IF EXISTS "Enable insert access for all users on template_requests" ON template_requests;

-- Allow public read/insert access for projects
CREATE POLICY "Enable read access for all users on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on projects" ON projects FOR INSERT WITH CHECK (true);

-- Allow public read access for templates
CREATE POLICY "Enable read access for all users on templates" ON templates FOR SELECT USING (true);

-- Allow public insert access for template requests
CREATE POLICY "Enable insert access for all users on template_requests" ON template_requests FOR INSERT WITH CHECK (true);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, -- Required for auth
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  html_code text DEFAULT '',
  css_code text DEFAULT '',
  js_code text DEFAULT '',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for deployments
DO $$
BEGIN
  ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DROP POLICY IF EXISTS "Enable read access for all users on deployments" ON deployments;
DROP POLICY IF EXISTS "Enable insert access for authenticated users on deployments" ON deployments;
DROP POLICY IF EXISTS "Enable delete access for authenticated users on deployments" ON deployments;

-- Allow public read access for deployments by slug
CREATE POLICY "Enable read access for all users on deployments" ON deployments FOR SELECT USING (true);

-- Allow authenticated users to insert deployments
CREATE POLICY "Enable insert access for authenticated users on deployments" ON deployments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own deployments
CREATE POLICY "Enable delete access for authenticated users on deployments" ON deployments FOR DELETE USING (auth.uid() = user_id);
