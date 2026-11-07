/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "larmax-blog",
		title: "唐辫小二 · Larmax Harker 的博客",
		summary:
			"记录软件排错、Android 刷机、生活碎片和自己的小项目。小站已经上线，内容和页面还在继续建设。",
		category: "website",
		phase: "building",
		technologies: ["Astro", "Shirone", "Svelte", "GitHub Pages"],
		icon: "material-symbols:edit-note-rounded",
		featured: true,
		website: "https://larmaxharkerx.github.io/",
		repository: "https://github.com/LarmaxHarkerX/LarmaxHarkerX.github.io",
		year: "2026",
	},
];

export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
