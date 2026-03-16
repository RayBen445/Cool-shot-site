import { supabase } from '../supabase'

export interface ProjectData {
  html_code: string;
  css_code: string;
  js_code: string;
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
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()

  if (error) {
    console.error('Error saving project:', error)
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
 * List all available templates
 */
export async function listTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error listing templates:', error)
    throw error
  }

  return data
}

/**
 * Fetch a template by its ID
 */
export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching template with ID ${id}:`, error)
    throw error
  }

  return data
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
