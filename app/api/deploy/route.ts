import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createDeployment, getUserCredits, initializeUserCredits, deductCredits } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { html, css, js } = await request.json();

    // Verify authentication via the Authorization header or session cookies
    // For simplicity with Supabase auth in Next.js App Router API, we can parse the token
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

    // Check or initialize user credits
    let userCredits = await getUserCredits(userId);
    if (!userCredits) {
      userCredits = await initializeUserCredits(userId, 5); // Start with 5 free credits
    }

    // Check if user has unlimited credits
    if (!userCredits.unlimited) {
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

      // Deduct 1 credit for deployment
      if (userCredits.credits < 1) {
        return new NextResponse(JSON.stringify({ error: 'Insufficient credits. You need at least 1 credit to deploy.' }), { status: 402 });
      }

      try {
        await deductCredits(userId, 1, 'Deployment created');
      } catch (creditError) {
        console.error('Error deducting credits:', creditError);
        return new NextResponse('Error processing credits', { status: 500 });
      }
    }

    // Generate a unique 6-8 character slug
    const slug = nanoid(7).toLowerCase();

    // Note: To be absolutely robust, you'd check for slug collision in a while loop
    // But nanoid(7) has very low collision probability for a small app.

    // Save project code
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        html_code: html || '',
        css_code: css || '',
        js_code: js || ''
      }])
      .select()
      .single();

    if (projectError) {
      console.error('Error saving project for deployment:', projectError);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    // Create deployment record
    const deploymentRecord = {
      user_id: userId,
      project_id: project.id,
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
      slug,
      creditsRemaining: userCredits.unlimited ? -1 : userCredits.credits - 1
    });
  } catch (error) {
    console.error('Deploy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
