import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createDeployment } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { html, css, js, projectId } = await request.json();

    // Verify authentication via the Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = user.id;

    // Check rate limits: maximum 10 deployments per user per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
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

    const newDeployment = await createDeployment(deploymentRecord);

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
