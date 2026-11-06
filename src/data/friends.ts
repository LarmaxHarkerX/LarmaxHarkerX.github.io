/**
 * 友情链接数据配置（结构与 Mizuki 同款，便于互相迁移）。
 * 用于管理友情链接页面的数据：src/pages/friends.astro → organisms/FriendSection。
 *
 * 添加友链：在 friendsData 中追加一项即可，页面 / 筛选标签自动生成。
 * tags 会聚合为页面顶部的筛选 chip（OR 命中：选中多个标签时命中任一即显示）。
 */
export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "艾了个拉",
		imgurl:
			"https://aira.cafe/_vercel/image?url=%2Fimages%2Favatar.webp&w=640&q=100",
		desc: "Kind and Kawaii, Forever!~\n\n艾了个拉，Kind and Kawaii, Forever!~",
		siteurl: "https://aira.cafe/",
		// GitHub：https://github.com/aira
		tags: [],
	},
	{
		id: 2,
		title: "心水湛清",
		imgurl: "https://avatars.githubusercontent.com/u/18241776?v=4",
		desc: "Otomad Maker / Rhythm Game Player\n\n心水湛清是一位 Otokomaker 和音游玩家，活跃于音 MAD 创作社区。",
		siteurl: "https://xszq.xyz/",
		// GitHub：https://github.com/xszqxszq
		tags: [],
	},
];

// 获取所有友情链接数据（稳定顺序，测试可复现）
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据（避免固定排序，按需使用）
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
