import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    author: z.string(), // Links to author slug/id
    category: z.string(), // Category name
    tags: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featuredImage: z.string(), // Image path or public URL
    featuredImageAlt: z.string().default(''),
    draft: z.boolean().default(false),
    canonical: z.string().url().optional(),
    readingTime: z.string().optional(),
    ogImage: z.string().optional(),
    twitterImage: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  })
});

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  })
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  })
});

export const collections = {
  blog,
  authors,
  categories,
};
