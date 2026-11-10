# SilkSong's Blog

> finding inner peace · 整个江湖都任我闯，我的生命像一首歌

用 [Astro](https://astro.build) 搭建的个人博客，纯静态，支持明暗主题。

## 本地开发

需要 Node.js 22.22 或更高版本。

```bash
npm install
npm run dev      # 本地预览
npm run build    # 生成网站到 dist/
```

## 写文章

在 `src/content/posts/` 新建一个 `.md` 文件：

```markdown
---
title: 文章标题
date: 2026-11-10 20:00:00
tags: [AI / Agent]
description: 一句话摘要，会显示在文章列表里
---

正文……
```

分类就是 `tags`，目前有：iOS 开发、工具折腾、生活随笔。写新分类直接填，分类页会自动出现。

## 目录

| 路径 | 内容 |
|---|---|
| `src/pages/` | 首页、文章页、归档、分类、关于、404、RSS |
| `src/layouts/Base.astro` | 导航栏、页脚、明暗切换 |
| `src/components/` | 文章列表行、叶子图标、页脚 slogan |
| `src/styles/global.css` | 全局样式和明暗主题的颜色 |
| `src/site.ts` | 网站名、slogan、GitHub 链接 |
| `src/assets/` | 关于页合照：放 `family.jpg` 即可显示 |
| `public/` | 网站图标等原样发布的文件 |

## 部署（Cloudflare Workers）

仓库里的 `wrangler.jsonc` 把网站配置成纯静态资源：先 `npm run build` 生成 `dist/`，再用 `npx wrangler deploy` 上传。

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → 创建 → 导入 Git 仓库，选择 `silksong-blog`。
2. 构建命令 `npm run build`，部署命令 `npx wrangler deploy`。Node 版本由 `.node-version` 指定。
3. Worker 名称必须和 `wrangler.jsonc` 里的 `name` 一致：`silksong-blog`。
4. 环境变量 `SITE_URL`（在构建变量里设置）：网站的正式地址，用于 RSS 链接，默认是 `https://silksong-blog.szxsilk.workers.dev`，以后绑定域名时再设置。

之后每次 `git push` 到 `main` 都会自动重新部署。
