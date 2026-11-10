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
| `public/` | 网站图标、图片（关于页合照：`public/images/family.jpg`） |

## 部署（Cloudflare Pages）

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → 创建 → Pages → 连接到 Git，选择 `silksong-blog` 仓库。
2. 构建设置：框架预设 **Astro**，构建命令 `npm run build`，输出目录 `dist`。Node 版本由仓库里的 `.node-version` 指定。
3. 部署完成后得到 `https://<项目名>.pages.dev`。
4. 环境变量 `SITE_URL`：设成网站的正式地址（例如 `https://<项目名>.pages.dev`，或以后绑定的自定义域名），然后重新部署。默认值是 `https://silksong-blog.pages.dev`。

之后每次 `git push` 到 `main` 都会自动重新部署。
