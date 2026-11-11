import rss from '@astrojs/rss';
import { getPosts, excerpt, SITE } from '../site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.slogan,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: excerpt(p, 200),
      link: `/posts/${p.id}/`,
    })),
  });
}
