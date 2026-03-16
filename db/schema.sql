-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  html_code text DEFAULT '',
  css_code text DEFAULT '',
  js_code text DEFAULT '',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create templates table
CREATE TABLE templates (
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
CREATE TABLE template_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert access for projects
CREATE POLICY "Enable read access for all users on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on projects" ON projects FOR INSERT WITH CHECK (true);

-- Allow public read access for templates
CREATE POLICY "Enable read access for all users on templates" ON templates FOR SELECT USING (true);

-- Allow public insert access for template requests
CREATE POLICY "Enable insert access for all users on template_requests" ON template_requests FOR INSERT WITH CHECK (true);
