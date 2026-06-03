# LARMAX Desktop Blog

一个基于 `Vue 3 + TypeScript + Vite` 的桌面式博客。界面模拟 Windows 桌面体验，文章、友链和碎碎念都通过 Markdown 内容源驱动。

## 目录结构

- `src/App.vue`: 只负责桌面编排和窗口内容分发。
- `src/composables/useBootSequence.ts`: BIOS/启动画面与时钟逻辑。
- `src/composables/useWindowSession.ts`: 窗口打开、聚焦、最小化、历史记录。
- `src/modules/windows/*`: 桌面程序注册表与共享窗口类型。
- `src/modules/content/*`: Markdown 内容索引与组件加载。
- `src/components/layout/*`: 桌面壳层与窗口容器。
- `src/components/windows/*`: 每个“程序窗口”的实际 UI。
- `posts/`, `friends/`, `moments/`: 博客文章、友链、碎碎念内容源。

## 开发命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 内容约定

- `posts/**/*.md`: 文章内容，使用 frontmatter 的 `title`、`date`、`description`、`tags`。
- `friends/*.md`: 友链名片，使用 `name`、`avatar`、`description`、`blog`、`github`。
- `moments/*.md`: 碎碎念条目，使用 `date`、`tags`。

文章窗口会按 `path` 直接加载 Markdown 组件，不再依赖文件管理器先完成预加载。

## 架构约束

- 桌面程序入口统一定义在 `src/modules/windows/registry.ts`。
- 窗口共享状态统一定义在 `src/modules/windows/types.ts`。
- 内容加载逻辑放在 composable 和 `src/modules/content`，不要把 `import.meta.glob()` 重新散落回窗口组件里。
- 全局 Win31 风格优先放在 `src/assets/styles/`，窗口组件只保留必要的局部布局样式。

## GitHub Pages

生产构建通过 `VITE_BASE_PATH` 控制基础路径。

- 本地默认使用 `/`
- GitHub Actions 部署时自动设置为 `/${repo-name}/`

如果未来绑定自定义域名，可以把部署环境里的 `VITE_BASE_PATH` 改回 `/`。
