import { notFound } from 'next/navigation';
import { getDeploymentBySlug } from '@/lib/db';

export const revalidate = 60; // Cache the page for 60 seconds

export default async function DeploymentRenderer({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const deployment = await getDeploymentBySlug(slug);

    if (!deployment) {
      return notFound();
    }

    const { html_code, css_code, js_code } = deployment;

    // Construct the full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deployed with CSSLab</title>
        <style>
          /* CSSLab Reset and Defaults for sandboxed environment */
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }

          /* User CSS */
          ${css_code}

          /* Branding Footer CSS */
          .csslab-branding-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            padding: 8px 12px;
            background: rgba(17, 24, 39, 0.9);
            color: #d1d5db;
            font-size: 12px;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            border-top-left-radius: 6px;
            z-index: 999999;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(55, 65, 81, 0.5);
            border-bottom: none;
            border-right: none;
            pointer-events: none;
          }
          .csslab-branding-footer a {
            color: #60a5fa;
            text-decoration: none;
            pointer-events: auto;
          }
          .csslab-branding-footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <!-- User HTML -->
        ${html_code}

        <!-- Branding Footer -->
        <div class="csslab-branding-footer">
          Deployed with <strong>CSSLab</strong> | Built by <a href="#" target="_blank" rel="noopener noreferrer">Cool Shot Systems</a>
        </div>

        <!-- User JS -->
        <script>
          try {
            ${js_code}
          } catch (error) {
            console.error('User script error:', error);
          }
        </script>
      </body>
      </html>
    `;

    return (
      <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-white">
        <iframe
          srcDoc={fullHtml}
          title={`Deployment: ${slug}`}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-none"
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering deployment:', error);
    return notFound();
  }
}
