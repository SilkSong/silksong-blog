---
title: 打造一个简单好看实用的终端：Oh-My-Zsh 安装,配置以及设置终端代理
date: 2020-04-20 19:30:53
tags: [工具折腾]
description: 终端是每个程序员，无论你的水平高低，日常工作中必然会接触到的东西，无论是一个文件的打开，还是一个 Git commit 的提交，通过命令行的方式进行指令的输入，不仅会显得 “酷”，更重要的是，很多时候是高效简洁的
---
终端是每个程序员，无论你的水平高低，日常工作中必然会接触到的东西，无论是一个文件的打开，还是一个 Git commit 的提交，通过命令行的方式进行指令的输入，不仅会显得 “酷”，更重要的是，很多时候是高效简洁的。

在我进行这篇文章的实践之前，我的终端是黑色的底搭配白色的字，手敲文件路径，以及身在大陆，时常面临一些访问海外服务器时, 下载速度特别特别慢的窘境。这些都一定程度上降低了我的效率和使用终端的心情。

所以，如果你和我一样，是一个还不太会使用终端的入门级程序员，那么这篇文章，会带你打造一个界面好看，实用，又简单的终端。（文章所有配置基于 macOS 系统，iTerm 2 软件以及 Shadowsocks 协议的科学上网服务）

## Oh-My-Zsh 安装

开始之前先简单弄明白一个概念：Shell 是命令行界面的解析器，用户输入一条命令，Shell 解析它来与计算机内核进行交互。我们的终端(Terminal) 可以运行不同的 Shell，常见的有sh, bash，我们要用到的 zsh 也是 shell 的一种。最新的 macOS 系统默认安装了所有的 shell, 并且默认的 shell 就是 zsh。若你的默认 shell 不是 zsh, 你可以通过 `echo $SHELL` 查看当前的 shell；终端输入 `chsh -s /bin/zsh`, 输入密码，重启终端即可切换到 zsh。

[Oh-My-Zsh](https://github.com/ohmyzsh/ohmyzsh) 是一个管理你 zsh 配置的框架，你可以去到它的 Github 页面进行更详细的了解，里面有无数的配置等着你去探索，但也不要被它吓到，只需跟着这篇文章进行简单的配置，你的终端就会焕然一新。

Oh-My-Zsh 官方提供了两种方式进行安装：在终端输入下面的命令即可

  *  curl: 
  `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
 *  wget: 
  `sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
 
如果你能顺利安装自然好，但我在安装期间始终报错，我直接通过 `git clone https://github.com/ohmyzsh/ohmyzsh.git` 把项目下载到本地根目录下，这个过程，如果你的终端没有设置代理的话，速度会很慢，没关系，文章稍后会解决这个问题。然后创建一个新的 zsh 配置文件 `cp ~/ohmyzsh/templates/zshrc.zsh-template ~/.zshrc`
如果你不会用 vim，可以通过 Finder 输入 Command + Shift + G, 输入 ~/.zshrc 找到这个文件然后打开它。打开后的是一个配置文件模板，我们需要把最上面的路径修改为 `export ZSH=$HOME/ohmyzsh`，这是我们 clone 下来的正确文件目录，然后输入 `source ~/.zshrc` 或者重启终端你就可以看到它已经变得不一样了。

## 主题安装及简单配置

Oh-My-Zsh 本身提供了很多的主题可供选择，他们都在 ohmyzsh/themes 文件夹下，我使用的是 [Dracula](https://draculatheme.com/zsh) 主题，首先跟随其步骤为 zsh 设置好主题, 然后设置 iTerm 2 的主题 [iTerm](https://draculatheme.com/iterm), 同样很简单的跟随其步骤设置好。

然后设置语法高亮：使用 `homebrew` 安装 `zsh-syntax-highlighting` 插件 `brew install zsh-syntax-highlighting`, 然后在根目录下的 .zshrc 配置文件插入 
`source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh`

输入 `source ~/.zshrc` 或者重启终端，你终于可以对着电脑屏幕说一句 “你看起来真好看！”
![J1G0eK.png](https://s1.ax1x.com/2020/04/20/J1G0eK.png)
Oh-My-Zsh 还提供了很多人性化的功能，比如

 * 输入目录名即可进入，不用 cd，输入 .. 即可到上级目录，返回上次目录输入 -
* 输入 d 即可看到目录列表
* 连按两次 tab 会补全列表，补全项可以使用 ctrl+n/p/f/b 上下左右切换，和在 IDE 中移动光标一致

另外还有 zsh-autosuggestions，autojump 等高效的插件可供选择。

## 设置终端代理

通过对终端设置代理可以大大提高工作的效率，这里主要是针对基于 Socks5 通信的，使用 Shadowsocks 协议的科学上网服务进行配置。但无论是 socket 通信还是 http通信，端口不同但设置方式差别不大，如果你的情况与我不同，可自行查阅具体代码设置。

个人认为最好的设置方式就是直接在上文提到的 .zshrc 配置文件中写入代理，这样子既可以永久保存，下次直接使用，还可以设置 alias, 使用起来非常方便。编辑 .zshrc 文件，添加

`alias proxy="export ALL_PROXY=socks5://127.0.0.1:7891"
alias unproxy="unset ALL_PROXY"`

其中 7891 是我本地的 Socks5 代理端口，你自己的端口可以通过你的代理软件或者你的网络偏好设置查看。
可以用过 `curl ip.gs` 的方式进行验证，可以发现，输入 `proxy` 之后，IP地址已经变更，输入 `unproxy` 之后 IP 地址恢复。
![J1GDoD.png](https://s1.ax1x.com/2020/04/20/J1GDoD.png)
另外，还可以对 Git 进行单独设置：`open ~/.gitconfig` 打开 Git 配置文件，
添加 `[http] proxy = socks5://127.0.0.1:7891` 这种情况适用于 `git clone https://项目.git` 的情况，注意：是没有必要添加` [https] proxy` 设置的，git 是没有 https_proxy 这个 config section 的。
而对于 `git clone git@项目.git` 的情况，由于使用的是 SSH 协议，则需要在 ~/.ssh/config 目录下配置：

```ssh-config
Host github.com
ProxyCommand nc -X 5 -x 127.0.0.1:1080 %h %p
```

可以看到设置好的终端通过 SSH clone 大型项目的时候，速度轻松达到了 2.3MB/s
![J1GBdO.png](https://s1.ax1x.com/2020/04/20/J1GBdO.png)
## 总结

以上就是一个简单的，好看的，设置代理的 Oh-My-Zsh 终端的整个配置过程，踩了很多坑，终于达到了一个 “合格” 的效果。Oh-My-Zsh 框架还有很多值得去探索，工具的打磨到头来一定会提升自己的工作效率。















