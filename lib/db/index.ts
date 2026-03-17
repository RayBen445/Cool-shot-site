import { supabase } from '../supabase'

export interface ProjectData {
  id?: string;
  user_id?: string;
  title?: string;
  description?: string;
  files?: Record<string, string>;
  readme?: string;
  html_code?: string;
  css_code?: string;
  js_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  preview_image: string;
  tags: string[];
  created_at: string;
}

export interface TemplateRequestData {
  template_id: string;
  name: string;
  email: string;
  message?: string;
}

/**
 * Save a new project to the database
 */
export async function saveProject(project: ProjectData) {
  // If id is provided, we do an upsert
  const { data, error } = await supabase
    .from('projects')
    .upsert([project], { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    console.error('Error saving project:', error)
    throw error
  }

  return data
}

/**
 * Update project
 */
export async function updateProject(id: string, updates: Partial<ProjectData>) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating project ${id}:`, error)
    throw error
  }
  return data
}

/**
 * Fetch a project by its ID
 */
export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching project with ID ${id}:`, error)
    throw error
  }

  return data
}

/**
 * List all projects for a user
 */
export async function getProjectsByUser(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false, nullsFirst: false })

  // fallback ordering by created_at if updated_at is null
  if (error) {
    console.error(`Error fetching projects for user ${userId}:`, error)
    throw error
  }
  return data as ProjectData[]
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw error
  }
  return true
}

/**
 * List all available templates
 */
export async function listTemplates(): Promise<TemplateData[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error listing templates:', error)
    throw error
  }

  return data as TemplateData[]
}

/**
 * Fetch a template by its ID
 */
export async function getTemplateById(id: string): Promise<TemplateData> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching template with ID ${id}:`, error)
    throw error
  }

  return data as TemplateData
}

/**
 * Create a new template request
 */
export async function createTemplateRequest(request: TemplateRequestData) {
  const { data, error } = await supabase
    .from('template_requests')
    .insert([request])
    .select()
    .single()

  if (error) {
    console.error('Error creating template request:', error)
    throw error
  }

  return data
}

export interface DeploymentData {
  id?: string;
  user_id: string;
  project_id?: string;
  slug: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at?: string;
}

/**
 * Save a new deployment to the database
 */
export async function createDeployment(deployment: DeploymentData) {
  const { data, error } = await supabase
    .from('deployments')
    .insert([deployment])
    .select()
    .single()

  if (error) {
    console.error('Error creating deployment:', error)
    throw error
  }

  return data
}

/**
 * Fetch a deployment by its slug
 */
export async function getDeploymentBySlug(slug: string) {
  const { data, error } = await supabase
    .from('deployments')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`Error fetching deployment with slug ${slug}:`, error)
    throw error
  }

  return data
}

/**
 * Fetch all deployments for a specific user
 */
export async function getDeploymentsByUser(userId: string) {
  const { data, error } = await supabase
    .from('deployments')
    .select('*, projects(title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching deployments for user ${userId}:`, error)
    throw error
  }

  return data as DeploymentData[]
}

/**
 * Delete a deployment by its ID
 */
export async function deleteDeployment(id: string) {
  const { error } = await supabase
    .from('deployments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting deployment with ID ${id}:`, error)
    throw error
  }

  return true
}
