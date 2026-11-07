/**
 * 个人创作工具清单。熟练度按站长要求统一使用最高档。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	{
		name: "Adobe After Effects",
		level: "expert",
		description: "视频合成、动态图形与视觉特效。",
		icon: "simple-icons:adobeaftereffects",
		category: "video",
	},
	{
		name: "Blender",
		level: "expert",
		description: "三维建模、动画与渲染。",
		icon: "simple-icons:blender",
		category: "3d",
	},
	{
		name: "Adobe Photoshop",
		level: "expert",
		description: "图像编辑、修图与视觉设计。",
		icon: "simple-icons:adobephotoshop",
		category: "design",
	},
	{
		name: "Unreal Engine",
		level: "expert",
		description: "实时三维、场景搭建与交互内容。",
		icon: "simple-icons:unrealengine",
		category: "3d",
	},
	{
		name: "FL Studio",
		level: "expert",
		description: "音乐制作、编曲与声音创作。",
		icon: "material-symbols:music-note-rounded",
		category: "audio",
	},
	{
		name: "REAPER",
		level: "expert",
		description: "音频录制、编辑与混音。",
		icon: "material-symbols:graphic-eq-rounded",
		category: "audio",
	},
	{
		name: "VEGAS Pro",
		level: "expert",
		description: "视频剪辑与音画编辑。",
		icon: "simple-icons:vegas",
		category: "video",
	},
];

export function getSkillsList(): SkillItem[] {
	return skillsData;
}
