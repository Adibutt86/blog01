export interface SEOProps {
  title: string;
  description: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publishedDate?: Date | string;
  updatedDate?: Date | string;
  featuredImage?: string;
  featuredImageAlt?: string;
  draft?: boolean;
  canonical?: string;
  readingTime?: string;
  ogImage?: string;
  twitterImage?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  language?: string;
}

export function generateSchemaOrg(props: SEOProps, siteUrl: string, currentUrl: string) {
  const baseSchema: Record<string, any>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "Frenzy",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`,
        "caption": "Frenzy Logo"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Frenzy",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  if (props.type === 'article' || props.publishedDate) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${currentUrl}/#article`,
      "isPartOf": {
        "@id": `${currentUrl}/#webpage`
      },
      "headline": props.title,
      "description": props.description,
      "image": props.featuredImage ? `${siteUrl}${props.featuredImage}` : `${siteUrl}/images/post-bg.jpg`,
      "datePublished": props.publishedDate ? new Date(props.publishedDate).toISOString() : undefined,
      "dateModified": props.updatedDate ? new Date(props.updatedDate).toISOString() : props.publishedDate ? new Date(props.publishedDate).toISOString() : undefined,
      "author": {
        "@type": "Person",
        "name": props.author || "Max Themes"
      },
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "mainEntityOfPage": currentUrl
    };
    baseSchema.push(articleSchema);
  } else {
    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${currentUrl}/#webpage`,
      "url": currentUrl,
      "name": props.title,
      "description": props.description,
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      }
    };
    baseSchema.push(webpageSchema);
  }

  return JSON.stringify(baseSchema);
}
