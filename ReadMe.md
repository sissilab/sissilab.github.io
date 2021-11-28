
# 个人博客构建 | Hexo 操作 笔记

- 目录名: sissilab.github.io
- github url: https://github.com/sissilab/sissilab.github.io
    > 分支分为 dev（默认） 和 master：dev 分支为编写文章和配置 hexo；master 分支为发布（deploy）时内容，配置在 hexo 的配置文件中。

- 在 dev 进行编写文章时，需切换至 node15 环境：
    ```shell
    # 切换到node15
    nvm use 15
    ```

- 常用 hexo 命令：
    ```shell
    # 清除缓存文件（删除public目录）
    hexo clean

    # 生成静态文件
    hexo g 
    hexo generate

    # 启动本地服务预览/调试
    hexo s
    hexo server

    # 部署站点，本地生成.deploy_git文件夹，并将编译后的文件发布到github
    hexo d
    hexo deploy

    # 生成并发布到github
    hexo g -d
    ```