---
title: Arch Linux 常用软件
title-en: Arch Linux softwares recommendation
date: 2021-10-17 23:33:00
tags: [Arch Linux, Linux]
categories:
- Arch Linux
---

- **输入法**
```shell
# 安装拼音输入法 fcitx5

# 1.安装fcitx5相关包
$ sudo pacman -S fcitx5 fcitx5-configtool fcitx5-qt fcitx5-gtk fcitx5-chinese-addons fcitx5-material-color
<!-- more -->
# 2.配置环境变量
$ vim ~/.pam_environment
# set fcitx5
INPUT_METHOD  DEFAULT=fcitx5
GTK_IM_MODULE DEFAULT=fcitx5
QT_IM_MODULE  DEFAULT=fcitx5
XMODIFIERS    DEFAULT=@im=fcitx5

# 3.添加自启
System Settings / Startup and shutdown / Autostart：点击 Add / Add Application，搜索 fcitx5，并添加 /usr/bin/fcitx5。

# 4.重启，生效

# 5.添加输入法
# System Setting / 搜索 Input method：点击 Add Input Method，搜索 pinyin，并添加。
```

- **KDE 应用**
```shell
$ sudo pacman -S kdeconnect
```

- **字体**
```shell
# 安装字体
$ sudo pacman -S noto-fonts-cjk noto-fonts-emoji noto-fonts-extra
$ sudo pacman -S adobe-source-han-serif-cn-fonts wqy-zenhei
$ sudo pacman -S ttf-dejavu wqy-microhei
```

- **浏览器**
```shell
# 谷歌浏览器 chrome
$ yay -S google-chrome

# 微软 Edge 浏览器
$ yay -S microsoft-edge-dev-bin

# 谷歌开元浏览器 chromium
$ sudo pacman -S chromium

# 火狐浏览器 firefox
$ sudo pacman -S firefox
```

- **系统工具**
```shell
$ sudo pacman -S dialog

# ssh 工具
$ sudo pacman -S openssh

# latte dock
$ sudo pacman -S latte-dock

# 查看系统绝大部分硬件信息，包括较难得到的内存频率，主板 BIOS 等等。
$ sudo pacman -Ss dmidecode

# Linux下电源管理，可为笔记本节省电量
# TLP Wiki: https://wiki.archlinux.org/title/TLP_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)
$ sudo pacman -S tlp
$ sudo systemctl enable --now tlp

# 主题配合 Kvantum Manager 可以达到更好的效果
$ sudo pacman -S kvantum-qt5


# 软件降级
$ yay -S downgrade

```

- **墙外的世界**
```shell
# ssr
# yay -S electron-ssr

# proxychains
$ sudo pacman -S proxychains
$ sudo vim /etc/proxychains.conf
# 编辑 /etc/proxychains.conf，将最后一行改成: 
socks5 127.0.0.1 1080
```

- **聊天沟通软件**
```shell
# telegram
$ sudo pacman -S telegram-desktop

# 团队协作工具 slack
$ sudo pacman -S slack-desktop 


```

- **笔记软件**
```shell
# Obsidian 笔记软件
$ sudo pacman -S obsidian

# Joplin 笔记软件
# cli
yay -S joplin
# desktop
yay -S joplin-desktop

# Trilium 开源的 electron 笔记软件
yay -S trilium-bin
yay -S trilium-server-bin
```

- **解压缩软件**
```shell
# ark 属于 kde-utilities 软件包组
$ sudo pacman -S ark

# unar, lsar
$ audo pacman -S unarchiver
```

- **图片查看软件**
```shell
# gwenview 属于 kde-graphics 软件组
$ sudo pacman -S gwenview 

# 火焰截图
sudo pacman -S flameshot

```

- **视频播放**
```shell
# 跨平台视频资源播放器，整合全网视频资源
yay -S zy-player

```


- **办公软件**
```shell
# libreoffice 稳定版
$ sudo pacman -S libreoffice-still

```

oh-my-zsh: https://www.jianshu.com/p/eeb3104384a1

```shell
# 小部件

# Netspeed Widget：依赖 ksysguard，不然不显示
$ sudo pacman -S ksysguard

```

```shell
# 支持识别 ntfs 格式的硬盘
$ sudo pacman -S ntfs-3g
```

- **开发工具**
```shell
# vscode
$ yay -S visual-studio-code-bin

# nodejs npm
$ sudo pacman -S nodejs npm
# 配置
$ npm config set prefix "/home/wxr/.nodejs"
$ npm config set cache "/home/wxr/.nodejs/cache"
```


# 常见问题

1. 文件夹单击打开改成双击打开？
> 系统设置 / 工作区行为 / 常规行为：在 “点击文件或文件夹时” 选中 “选中它们（双击打开文件/文件夹）”。
