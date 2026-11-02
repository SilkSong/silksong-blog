import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = {
  name: 'SilkSong',
  slogan: 'finding inner peace',
  github: 'https://github.com/SilkSong',
};

export type Post = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// 中文按约 400 字/分钟，英文按约 200 词/分钟估算
export function readingTime(body = '') {
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/!\[.*?\]\(.*?\)/g, '');
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export function excerpt(post: Post, len = 110) {
  const src = post.data.description?.trim() || (post.body ?? '').replace(/[#>*`\[\]()!_-]/g, '').trim();
  return src.length > len ? src.slice(0, len) + '…' : src;
}

export async function getTags() {
  const counts = new Map<string, number>();
  for (const p of await getPosts()) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export const tagUrl = (t: string) => `/tags/${encodeURIComponent(t)}/`;
export const postUrl = (p: Post) => `/posts/${p.id}/`;
