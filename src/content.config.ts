import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 文章放在 src/content/posts，新增文章直接在这里新建 .md
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.coerce.string()).nullish().transform((t) => t ?? []),
    description: z.string().nullish(),
  }),
});

export const collections = { posts };
