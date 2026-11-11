---
title: install win10 in Mac 采坑记录
date: 2019-06-14 18:55:33
tags: [工具折腾]
description: 之前由于一些原因，想在 Mac 中安装一个 win10 的双系统，本来是一个相对不麻烦的事情，但是我却在第一步卡了很久。
---

之前由于一些原因，想在 Mac 中安装一个 win10 的双系统，本来是一个相对不麻烦的事情，但是我却在第一步卡了很久。特此记录一下一个小坑。
首先，在 Mac 上通过 Boot Camp Assistant 安装 Win10, 要先确保您的 Mac 是支持 Win10 的机型，其次需要判断您的 Mac 机型是否需要通过一个外部闪存驱动器来安装，这些都可以从 [Apple官网](https://support.apple.com/zh-cn/HT201468) 找到。
我的机型是 Macbook Pro Mid 2014, 是需要连接一个U盘作为驱动器来安装的，但是试了很多次，Boot Camp 总说分区失败，网上试了很多方法都没有解决问题。
后来我想，Boot Camp 提示分区失败，那我就试着自己分区试试，于是我就用 Mac 自带的磁盘工具试着将磁盘分区，果然也分区失败了，但是通过 Detail 提示，我看到了 time machine 这个关键的提示。网上一查发现，Time Machine 的本地快照会导致分区失败的问题，具体如何导致的我也不关心，只要知道把它删掉就好了！不过TimeMachine 本地快照从 macOS 10.13 开始便关不掉了，只能逐条清理。执行命令：

```bash
sudo tmutil listlocalsnapshots /
```
会显示你最近的备份，每一条备份当中的「com.apple.TimeMachine.」字串删除（所有小数点都得删），剩下的日期字串就是每一条备份的认证码，然后执行

```bash
tmutil deletelocalsnapshots 认证码
```
就可以删掉 TM 备份，然后我的 Boot Camp 分区也成功了，Win10 也顺利的安装好了！


Reference: 

1. https://zhuanlan.zhihu.com/p/39689057
2. https://sspai.com/post/44023


