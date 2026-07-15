import { getCollection } from 'astro:content';

export async function GET() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = allPosts.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());

  const siteTitle = 'Frenzy Blog';
  const siteDescription = 'Stay ahead of the curve with our exclusive daily news and insights!';
  const siteUrl = 'https://frenzy.vercel.app';

  let itemsXml = '';
  for (const post of sortedPosts) {
    itemsXml += `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${post.data.publishedDate.toUTCString()}</pubDate>
    </item>`;
  }

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <description>${siteDescription}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>
`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
