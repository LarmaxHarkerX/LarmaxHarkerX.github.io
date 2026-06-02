# Ultrawork Notepad — Vue Terminal Blog
Started: 2026-06-02

## Plan (exhaustive, atomic)
## Scenarios (the contract)
## Now (single step in progress)
## Todo (remaining, ordered)
## Findings (non-obvious facts with file:line refs)
## Learnings (patterns / pitfalls for next turn)

---

## Findings

### 技术栈决策
- **框架**：Vue 3 + Vite SPA（非VitePress），因为终端风格需要高度自定义UI
- **Markdown渲染**：`vite-plugin-md` + `markdown-it`
- **SSG**：`vite-ssg` 生成静态站点
- **终端UI**：自定义CSS + xterm.js（交互式终端组件）
- **动画**：GSAP + Vue Transition
- **图标**：Phosphor Icons（终端风格）
- **字体**：JetBrains Mono（主字体）+ Inter（辅助字体）
- **搜索**：FlexSearch（客户端搜索）
- **RSS**：`feed` npm包
- **部署**：GitHub Actions + GitHub Pages

### 项目结构
```
LARMAX_BLOG/
├── public/
├── src/
│   ├── assets/styles/
│   ├── components/
│   │   ├── layout/
│   │   ├── blog/
│   │   ├── terminal/
│   │   └── ui/
│   ├── composables/
│   ├── pages/
│   ├── router/
│   ├── stores/
│   ├── types/
│   └── utils/
├── posts/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 页面结构
- 主页：终端提示符欢迎界面
- 博客页：`ls`风格的文章列表
- 文章详情：`cat <filename>`风格
- 分类：`find`风格
- 标签：`grep`风格
- 归档：`history`风格
- 关于：`whoami`风格

### 关键组件
- TerminalWindow：终端窗口外壳（标题栏、按钮）
- TerminalNav：命令行风格导航
- PostList：`ls`风格文章列表
- PostCard：单篇文章卡片
- CommandLine：交互式终端输入
- TypewriterText：打字机动画效果
- CursorBlink：闪烁光标组件

### 假设（用户要求直接开始，不问问题）
1. **GitHub Pages URL**：使用`/LARMAX_BLOG/`作为base path
2. **内容语言**：UI中文，内容中英文混合
3. **"说说"页面**：使用JSON文件作为数据源
4. **"朋友"页面**：使用JSON配置文件
5. **交互式终端**：先使用自定义CSS实现视觉效果，如果需要再添加xterm.js
6. **数学公式**：包括KaTeX
7. **图表**：包括Mermaid.js

### 执行计划
Wave 1（并行）：
- T1: Project Scaffold + Git Init ✅ 完成
- T2: Design System (CSS Variables, Fonts, Theme) ✅ 完成

Wave 2（T1完成后）：
- T3: Vite Config + SSG Setup ✅ 完成

Wave 3（T2、T3完成后）：
- T4: Router + Layout Shell ✅ 完成
- T6: Markdown Content Pipeline 🔄 进行中

Wave 2（T1完成后）：
- T3: Vite Config + SSG Setup

Wave 3（T2、T3完成后）：
- T4: Router + Layout Shell
- T6: Markdown Content Pipeline

Wave 4（T4、T6完成后）：
- T5: Terminal UI Components
- T15: Loading Animation
- T16: Page Transitions

Wave 5（T5、T6完成后，并行）：
- T7: Blog Pages (List + Detail)
- T8: Home Page
- T9: Shuoshuo Page
- T10: Friends Page
- T11: About Page

Wave 6（T7完成后）：
- T12: Search Integration
- T13: RSS Generation
- T14: SEO + Meta Tags

Wave 7（所有完成后）：
- T17: Build + Deploy Config