# 唐辫小二 · Larmax Harker

我的个人站，记录软件排错、Android 刷机、生活碎片和自己的小项目。

- 网站：https://larmaxharkerx.github.io/
- 作者：https://github.com/LarmaxHarkerX
- 技术：Astro 7、Svelte 5、Shirone、GitHub Pages

## 本地运行

需要 pnpm 11.28.2。项目会自动获取 Node 26.13.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Windows 可双击 `start-dev.cmd`。构建后双击 `start-preview.cmd` 体验全文搜索。
两个启动脚本都使用端口 4321，同一时间只运行一个。

## 内容位置

| 内容 | 路径 |
| --- | --- |
| 文章 | `src/content/posts/` |
| 说说 | `src/content/moments/` |
| 关于 | `src/content/spec/about.md` |
| 友链 | `src/data/friends.ts` |
| 作者资料 | `src/config/profileConfig.ts` |
| 站点配置 | `src/config/siteConfig.ts` |
| 主题演示文档归档 | `docs/theme-examples/` |

创建文章：`pnpm new-post <filename>`。文章的发布日期使用 `published`，分类使用 `category`。

## 检查与发布

```sh
pnpm check
pnpm type-check
pnpm check:manifest
pnpm build
pnpm exec playwright test tests/site/personal-site.spec.ts
```

推送到 `main` 后，GitHub Actions 自动检查、测试、构建并发布至 GitHub Pages。
详见 [部署说明](docs/deployment.md)。`.env`、凭据、AI 会话状态、缓存和构建产物不提交。

## 致谢与许可

使用 [Shirone](https://github.com/LyraVoid/Shirone) 主题，保留其原有 MIT 许可与版权声明。
主题源自 [Fuwari](https://github.com/saicaca/fuwari)，感谢原作者与贡献者。
字体及其他资源的许可保留在原有目录中。文章版权以站点页面声明为准。
