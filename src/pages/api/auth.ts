import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ redirect }) => {
  const client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  
  if (!client_id) {
    return new Response(JSON.stringify({ error: 'OAUTH_GITHUB_CLIENT_ID environment variable is not set.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`;
  return redirect(githubAuthUrl);
};
