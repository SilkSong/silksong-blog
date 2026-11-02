---
title: 博客更换主题采坑记
date: 2017-11-20 23:12:41
tags: [工具折腾]
description: 博客好久没写了，近期准备重新拾起来，正巧发现了一个很不错的主题 even, 查看了一下文档也很友好，就打算把主题换一下，之前网站上缺的评论，目录，RSS订阅和底部社交链接等小功能也一起补上，折腾了几个小时，踩了几个小坑，记录一下。
---

博客好久没写了，近期准备重新拾起来，正巧发现了一个很不错的主题 [even](https://github.com/ahonn/hexo-theme-even), 查看了一下文档也很友好，就打算把主题换一下，之前网站上缺的评论，目录，RSS订阅和底部社交链接等小功能也一起补上，折腾了几个小时，踩了几个小坑，记录一下。

## hexo 插件无法安装
按照文档，需要先通过 npm 安装 hexo-renderer-scss 插件， 
`npm install hexo-renderer-scss --save`
但是我的 iTerm 上根本下载不下来，Google 搜索到了一个 [issue](https://github.com/tufu9441/maupassant-hexo/issues/225)，事实上我通过更换为淘宝源和把我的代理更换为全局模式都解决了这个问题

## Git submodule error
所以本地工作完成后，我使用 `git add .` 命令添加，发现了一个 *modified content, untracked content* 的错误，无论如何也没法 commit，也不知哪里出了问题，试着用这行字搜索，发现这是一个常见的 submodule error, 因为之前添加主题的时候，clone 了那个主题 repo 放到了 theme 文件夹中，所以就形成了一个 submodule，简单的做法，进入 theme/even 文件夹，执行 `rm -rf .git` 命令删掉 .git 就好了

## Git 版本回退和强制 push
为了解决上一条错误，作为一个 git 小白，我不知怎么的，把 theme 文件夹的内容 push 到了远端仓库，而且本地仓库也被修改了，幸好我在进行一系列 XJB 操作之前，复制了一份文件。当我要把这份备份文件 push 到远端仓库的时候，报错说无法 push, 我的本地仓库落后了几个 commits, 需要先 git pull 云云。我搜索了一下，可以使用 `git push -f` 的方法暴力（force) push，明确好远端仓库没有我需要保存的内容后，我使用 `git push -f` 成功把本地的内容同步到了远端仓库。在这个过程中，我还学会了 `git log` 用来查看 commit, 和通过 ` git reset --hard commitid` 的方法进行版本回退。

## 域名解析
因为经过了 force push，Github 上仓库上关联的 Custom domain 给删去了，导致我直接输入域名显示 404，重新添加上以后，又确认好 CNAME 文件书写正确，使用命令 `hexo g` `hexo d`，就成功打开了我的博客。

## 总结

在这个过程里，自己掌握了一些前端的知识，还深刻的掌握了几个 git 命令，发现还是在实践中才能掌握好知识。网站算是完善好了，不过相比较关注那些功能和主题，最重要的还是内容。希望自己能重新拾起博客，记录技术，记录生活，相信多年以后，这会是一笔宝贵的财富。我也会一直坚持下去，乐在其中。




