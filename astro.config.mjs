import { defineConfig } from 'astro/config';

// 网站正式地址，用于 RSS 和页面里的绝对链接。
// 在部署平台的环境变量里设置 SITE_URL 即可覆盖，换域名时不用改代码。
const site = process.env.SITE_URL || 'https://silksong-blog.szxsilk.workers.dev';

export default defineConfig({
  site,
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
});
