import { supabase } from '../supabase'

export interface ProjectData {
  user_id?: string;
  html_code: string;
  css_code: string;
  js_code: string;
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
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching deployments for user ${userId}:`, error)
    throw error
  }

  return data as DeploymentData[]
}

// ============ ADMIN & CREDIT SYSTEM ============

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface UserCredit {
  id: string;
  user_id: string;
  credits: number;
  unlimited: boolean;
  last_updated: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'deployment' | 'redeem' | 'admin_grant' | 'admin_deduct';
  description?: string;
  created_at: string;
}

export interface RedemptionCode {
  id: string;
  code: string;
  created_by: string;
  credits: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  admin_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  target_users: string[];
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
}

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !error && !!data
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<UserCredit | null> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as UserCredit
}

/**
 * Initialize user credits (called on first deployment or signup)
 */
export async function initializeUserCredits(userId: string, initialCredits: number = 5) {
  const { data, error } = await supabase
    .from('user_credits')
    .insert([{
      user_id: userId,
      credits: initialCredits,
      unlimited: false
    }])
    .select()
    .single()

  if (error) throw error
  return data as UserCredit
}

/**
 * Deduct credits from user (for deployments)
 */
export async function deductCredits(userId: string, amount: number, description: string) {
  // Get current credits
  const credits = await getUserCredits(userId)
  if (!credits) {
    throw new Error('User credits not initialized')
  }

  // Check if user has unlimited credits
  if (credits.unlimited) {
    return { success: true, remaining: -1 }
  }

  // Check if enough credits
  if (credits.credits < amount) {
    throw new Error('Insufficient credits')
  }

  // Deduct credits
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({ credits: credits.credits - amount })
    .eq('user_id', userId)

  if (updateError) throw updateError

  // Log transaction
  await logCreditTransaction(userId, -amount, 'deployment', description)

  return { success: true, remaining: credits.credits - amount }
}

/**
 * Add credits to user (admin grant or redemption)
 */
export async function addCredits(userId: string, amount: number, type: 'admin_grant' | 'redeem', description?: string) {
  const credits = await getUserCredits(userId)
  
  if (!credits) {
    throw new Error('User credits not initialized')
  }

  const newBalance = credits.credits + amount

  const { error } = await supabase
    .from('user_credits')
    .update({ credits: newBalance })
    .eq('user_id', userId)

  if (error) throw error

  await logCreditTransaction(userId, amount, type, description)
  return { success: true, remaining: newBalance }
}

/**
 * Log a credit transaction
 */
export async function logCreditTransaction(
  userId: string,
  amount: number,
  type: 'deployment' | 'redeem' | 'admin_grant' | 'admin_deduct',
  description?: string
) {
  const { error } = await supabase
    .from('credit_transactions')
    .insert([{
      user_id: userId,
      amount,
      transaction_type: type,
      description
    }])

  if (error) throw error
}

/**
 * Create a redemption code (admin only)
 */
export async function createRedemptionCode(
  adminId: string,
  credits: number,
  maxUses: number = 1,
  expiresAt?: string
): Promise<RedemptionCode> {
  // Generate unique code
  const code = `CSSLAB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  const { data, error } = await supabase
    .from('redemption_codes')
    .insert([{
      code,
      created_by: adminId,
      credits,
      max_uses: maxUses,
      is_active: true,
      expires_at: expiresAt
    }])
    .select()
    .single()

  if (error) throw error
  return data as RedemptionCode
}

/**
 * Redeem a code for credits
 */
export async function redeemCode(userId: string, code: string) {
  // Find the code
  const { data: codeData, error: codeError } = await supabase
    .from('redemption_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (codeError || !codeData) {
    throw new Error('Invalid redemption code')
  }

  const redemptionCode = codeData as RedemptionCode

  // Check if active
  if (!redemptionCode.is_active) {
    throw new Error('This code is no longer active')
  }

  // Check expiration
  if (redemptionCode.expires_at && new Date(redemptionCode.expires_at) < new Date()) {
    throw new Error('This code has expired')
  }

  // Check max uses
  if (redemptionCode.current_uses >= redemptionCode.max_uses) {
    throw new Error('This code has reached its usage limit')
  }

  // Check if already redeemed by this user
  const { data: existingRedeem } = await supabase
    .from('redeemed_codes')
    .select('id')
    .eq('user_id', userId)
    .eq('code_id', redemptionCode.id)
    .single()

  if (existingRedeem) {
    throw new Error('You have already redeemed this code')
  }

  // Record redemption
  await supabase
    .from('redeemed_codes')
    .insert([{
      user_id: userId,
      code_id: redemptionCode.id
    }])

  // Update usage count
  await supabase
    .from('redemption_codes')
    .update({ current_uses: redemptionCode.current_uses + 1 })
    .eq('id', redemptionCode.id)

  // Add credits
  await addCredits(userId, redemptionCode.credits, 'redeem', `Redeemed code: ${code}`)

  return { success: true, creditsAdded: redemptionCode.credits }
}

/**
 * Get all redemption codes (admin only)
 */
export async function getRedemptionCodes() {
  const { data, error } = await supabase
    .from('redemption_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RedemptionCode[]
}

/**
 * Deactivate a redemption code (admin only)
 */
export async function deactivateRedemptionCode(codeId: string) {
  const { error } = await supabase
    .from('redemption_codes')
    .update({ is_active: false })
    .eq('id', codeId)

  if (error) throw error
  return { success: true }
}

/**
 * Create an admin notification and broadcast to users
 */
export async function createAdminNotification(
  adminId: string,
  title: string,
  message: string,
  type: 'info' | 'warning' | 'error' | 'success' = 'info',
  targetUsers?: string[]
) {
  // Create admin notification
  const { data: notifData, error: notifError } = await supabase
    .from('admin_notifications')
    .insert([{
      admin_id: adminId,
      title,
      message,
      type,
      target_users: targetUsers || []
    }])
    .select()
    .single()

  if (notifError) throw notifError

  // If no specific users targeted, create for all users
  if (!targetUsers || targetUsers.length === 0) {
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    if (!usersError && users) {
      for (const user of users.users) {
        await supabase
          .from('user_notifications')
          .insert([{
            user_id: user.id,
            admin_notification_id: notifData.id,
            title,
            message,
            type
          }])
      }
    }
  } else {
    // Create for specific users
    for (const userId of targetUsers) {
      await supabase
        .from('user_notifications')
        .insert([{
          user_id: userId,
          admin_notification_id: notifData.id,
          title,
          message,
          type
        }])
    }
  }

  return notifData as AdminNotification
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as UserNotification[]
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('user_notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) throw error
}

/**
 * Grant credits to user (admin only)
 */
export async function adminGrantCredits(userId: string, amount: number, reason?: string) {
  await addCredits(userId, amount, 'admin_grant', reason || 'Admin grant')
  return { success: true }
}

/**
 * Deduct credits from user (admin only)
 */
export async function adminDeductCredits(userId: string, amount: number, reason?: string) {
  const credits = await getUserCredits(userId)
  if (!credits) throw new Error('User credits not initialized')

  const newBalance = Math.max(0, credits.credits - amount)
  const { error } = await supabase
    .from('user_credits')
    .update({ credits: newBalance })
    .eq('user_id', userId)

  if (error) throw error
  await logCreditTransaction(userId, -amount, 'admin_deduct', reason || 'Admin deduction')
  return { success: true, remaining: newBalance }
}

/**
 * Get credit transaction history for user
 */
export async function getCreditHistory(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as CreditTransaction[]
}
