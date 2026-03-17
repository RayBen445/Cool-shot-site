import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-build-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
// Try using service role key to bypass RLS for server-side insertions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export async function POST(request: Request) {
  try {
    const { html, css, js, projectId } = await request.json();

    // Verify authentication via the Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Create an authenticated Supabase client using the JWT to verify the user
    const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser();

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = user.id;

    // Create a privileged client for the actual insertion to bypass flaky RLS checks in edge
    const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limits: maximum 10 deployments per user per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabaseAdminClient
      .from('deployments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneDayAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    if (count && count >= 10) {
      return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded: Max 10 deployments per day' }), { status: 429 });
    }

    // Generate a unique 6-8 character slug
    const slug = nanoid(7).toLowerCase();

    if (!projectId) {
      return new NextResponse(JSON.stringify({ error: 'Missing projectId' }), { status: 400 });
    }

    // Create deployment record mapping the extracted html/css/js properties sent from the client
    const deploymentRecord = {
      user_id: userId,
      project_id: projectId,
      slug,
      html_code: html || '',
      css_code: css || '',
      js_code: js || ''
    };

    // Use the admin client to insert to pass RLS
    const { data: newDeployment, error: deploymentError } = await supabaseAdminClient
      .from('deployments')
      .insert([deploymentRecord])
      .select()
      .single();

    if (deploymentError) {
      console.error('Error creating deployment record:', deploymentError);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    const url = `https://${slug}.csslab.zone.id`;

    return NextResponse.json({
      success: true,
      deployment: newDeployment,
      url,
      slug
    });
  } catch (error) {
    console.error('Deploy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
