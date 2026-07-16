import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  const client_secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return new Response('GitHub OAuth credentials are not fully set.', { status: 500 });
  }

  if (!code) {
    return new Response('Missing authorization code.', { status: 400 });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(`OAuth Error: ${data.error_description || data.error}`, { status: 400 });
    }

    // Send the token back to Decap CMS via postMessage
    const script = `
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("Sending message to parent window...");
            window.opener.postMessage(
              'authorization:github:success:' + JSON.stringify(${JSON.stringify({
                token: data.access_token,
                provider: 'github',
              })}),
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          // Start the handshake
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;

    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
};
