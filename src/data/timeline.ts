/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "个人博客成立，开始写作与发布",
		date: "2026.11",
		category: "milestone",
		subtitle: "唐辫小二 · Larmax Harker",
		description:
			"把自己的文章、想法和折腾记录放到一个小站里。博客基于 Astro 与 Shirone 搭建，在 GitHub Pages 上发布，从这里开始慢慢积累。",
		highlights: [
			"整理并发布已有的软件排错与 Android 刷机文章",
			"搭起个人站，开始记录生活与小项目",
			"通过 GitHub Actions 自动构建与发布",
		],
		tags: ["博客", "写作", "Astro", "GitHub Pages"],
		links: [
			{
				label: "访问博客",
				url: "https://larmaxharkerx.github.io/",
				icon: "material-symbols:open-in-new-rounded",
			},
		],
		icon: "material-symbols:rocket-launch-rounded",
		featured: true,
	},
];

export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
