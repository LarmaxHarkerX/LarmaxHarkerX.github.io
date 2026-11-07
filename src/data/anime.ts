/**
 * 番剧收藏数据（本地数据源）。
 * 用于番剧页：src/pages/anime.astro → organisms/AnimeSection → molecules/AnimeCard。
 *
 * 添加条目：在 animeData 中追加一项即可，状态筛选 chips 与计数自动生成。
 * - cover 省略时卡片显示主题色渐变占位（补图前不破版）；
 * - link 省略时封面不可点；rating 为 0-10 个人评分；
 * - progress 是结构化追番进度，watching 状态在卡片上渲染进度条。
 * JSON 数据源（外部收藏服务拉取）见 utils/anime-data.ts 的 AnimeSource 分发。
 */

import type { AnimeIdentity } from "../types/animeConfig.ts";

/** 收藏状态（Bangumi 领域通行五态） */
export type AnimeStatus =
	| "watching"
	| "completed"
	| "planned"
	| "onHold"
	| "dropped";

export interface AnimeItem {
	title: string;
	/** 封面图地址（相对 /public 或绝对 URL）；省略 = 渐变占位 */
	cover?: string;
	/** 条目外链（Bangumi/官方站等）；省略则封面不可点 */
	link?: string;
	/** 未提供观看状态时省略。 */
	status?: AnimeStatus;
	/** 个人评分 0-10；未评分时省略，不显示评分徽标。 */
	rating?: number;
	/** 追番进度：已看 / 总集数（未知时可选省略） */
	progress?: { watched: number; total: number };
	/** 一句话感想 */
	description?: string;
	/** 放送年份（展示用） */
	year: string;
	/** 制作公司 */
	studio?: string;
	/** 题材标签 */
	genres: string[];
	/** 观看时间段（年-月） */
	period?: { start: string; end: string };
	/** 条目来源身份标识（可选，用于跨源去重与归档） */
	identity?: AnimeIdentity;
}

export const animeData: AnimeItem[] = [
	{
		title: "2012",
		cover: "/assets/personal-media/2012.jpg",
		link: "https://tv.apple.com/us/movie/2012/umc.cmc.2wq140jo9jd1ut59m0cfukrit",
		description:
			"罗兰·艾默里奇执导的灾难电影。链接前往 Apple TV 的影片页面，播放情况以所在地区为准。",
		year: "2009",
		studio: "Columbia Pictures",
		genres: ["电影", "灾难", "科幻"],
	},
	{
		title: "继母与女儿的蓝调",
		cover: "/assets/personal-media/gibomusu-2018.jpg",
		link: "https://www.tbs.co.jp/gibomusu_blues/2020/intro/2018.html",
		description:
			"2018 年播出的正剧，讲述继母与女儿共同生活、逐渐成为家人的故事。",
		year: "2018",
		studio: "TBS Television",
		genres: ["日剧", "家庭"],
	},
	{
		title: "继母与女儿的蓝调 2020 贺岁特别篇",
		cover: "/assets/personal-media/gibomusu-2020.jpg",
		link: "https://www.tbs.co.jp/gibomusu_blues/2020/",
		description: "承接正剧的 2020 年新年特别篇，属于特别篇而非第二季。",
		year: "2020",
		studio: "TBS Television",
		genres: ["日剧", "家庭", "贺岁特别篇"],
	},
	{
		title: "继母与女儿的蓝调 2022 贺岁特别篇",
		cover: "/assets/personal-media/gibomusu-2022.jpg",
		link: "https://www.tbs.co.jp/gibomusu_blues/intro/2022.html",
		description: "2022 年播出的新年特别篇，继续记录这个家庭的故事。",
		year: "2022",
		studio: "TBS Television",
		genres: ["日剧", "家庭", "贺岁特别篇"],
	},
	{
		title: "继母与女儿的蓝调 2024 FINAL 贺岁特别篇",
		cover: "/assets/personal-media/gibomusu-2024.png",
		link: "https://www.video.unext.jp/title/SID0097699",
		description:
			"系列最终篇，2024 年新年播出。链接前往 TBS 官网指向的 U-NEXT 正版页面。",
		year: "2024",
		studio: "TBS Television",
		genres: ["日剧", "家庭", "贺岁特别篇", "完结篇"],
	},
	{
		title: "火星生活（韩国版）",
		cover: "/assets/personal-media/life-on-mars-2018.jpg",
		link: "https://ocn.cjenm.com/ko/lifeonmars/",
		description:
			"2018 年 OCN 播出的韩国刑侦剧。韩泰柱在追查案件时意外来到 1988 年，与当时的刑警队共同调查案件。",
		year: "2018",
		studio: "OCN / Studio Dragon",
		genres: ["韩剧", "刑侦", "悬疑"],
	},
	{
		title: "LA 92",
		cover: "/assets/personal-media/la-92.jpg",
		link: "https://www.netflix.com/title/80184131",
		description:
			"国家地理出品的 2017 年纪录片，以档案影像回顾 1992 年洛杉矶骚乱及其背景。",
		year: "2017",
		studio: "National Geographic / Lightbox",
		genres: ["纪录片", "社会", "历史"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.01 グリコ・森永事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-01.png",
		link: "https://web.archive.org/web/20111104214100/http://www.nhk.or.jp/mikaiketsu/",
		status: "completed",
		description:
			"2011年7月29日・30日放送。劇場型犯罪として世間を震撼させたグリコ・森永事件を、当時の取材記録と関係者の証言から検証する。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2011",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.02 オウム真理教 17年目の真実",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-02.jpg",
		link: "https://web.archive.org/web/20241007194343/https://www.nhk.or.jp/mikaiketsu/file002/index.html",
		status: "completed",
		description:
			"2012年5月26日・27日放送。オウム真理教の一連の事件を、教団内部の証言と警察の攻防から17年目の視点で描く。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2012",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.03 尼崎殺人死体遺棄事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-03.jpg",
		link: "https://web.archive.org/web/20241008055506/https://www.nhk.or.jp/mikaiketsu/file003/index.html",
		status: "completed",
		description:
			"2013年6月9日放送。16年以上にわたり家族が巻き込まれながら見過ごされた尼崎事件を、加害者と被害者の関係から検証する。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2013",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.04 オウム真理教 地下鉄サリン事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-04.png",
		link: "https://web.archive.org/web/20241008055507/https://www.nhk.or.jp/mikaiketsu/file004/index.html",
		status: "completed",
		description:
			"2015年3月20日放送。地下鉄サリン事件から20年、当時の捜査資料と実行犯の証言から事件の全体像に迫る。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2015",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.05 ロッキード事件 40年目の真実",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-05.png",
		link: "https://web.archive.org/web/20250214103834/https://www.nhk.or.jp/mikaiketsu/file005/index.html",
		status: "completed",
		description:
			"2016年7月23日・24日放送。戦後最大の疑獄とされるロッキード事件を、日米の極秘資料から40年目の視点で検証する。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2016",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.06 赤報隊事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-06.png",
		link: "https://web.archive.org/web/20250611110105/http://www.nhk.or.jp/mikaiketsu/file006/index.html",
		status: "completed",
		description:
			"2018年1月27日・28日放送。朝日新聞阪神支局襲撃事件の真相と、未解決のまま残された赤報隊事件の闇を追う。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2018",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.07 警察庁長官狙撃事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-07.png",
		link: "https://web.archive.org/web/20241007221554/https://www.nhk.or.jp/mikaiketsu/file007/index.html",
		status: "completed",
		description:
			"2018年9月2日・8日放送。1995年の警察庁長官狙撃事件を、容疑者と刑事の15年にわたる攻防から描く。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2018",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.08 JFK暗殺",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-08.png",
		link: "https://web.archive.org/web/20241007221553/https://www.nhk.or.jp/mikaiketsu/file008/index.html",
		status: "completed",
		description:
			"2020年4月29日・5月2日放送。シリーズ初の海外特別編。オズワルドの視点からケネディ大統領暗殺事件の真相に迫る。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2020",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.09 松本清張と帝銀事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-09.png",
		link: "https://web.archive.org/web/20241007201212/https://www.nhk.or.jp/mikaiketsu/file009/index.html",
		status: "completed",
		description:
			"2022年12月29日・30日放送。帝銀事件を題材にした松本清張の「小説帝銀事件」を通して、戦後最大の冤罪疑惑を検証する。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2022",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · NHK特别篇 File.10 下山事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-special-10.png",
		link: "https://web.archive.org/web/20250115154116/https://www.nhk.or.jp/mikaiketsu/index.html",
		status: "completed",
		description:
			"2024年3月30日放送。国鉄総裁・下山定則の怪死をめぐる占領期最大の未解決事件に、新資料から迫る。（NHK特别篇时期作品。官方原页面已下线，链接与封面均采用互联网档案馆存档的官方内容。）",
		year: "2024",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "NHK特别篇"],
	},
	{
		title: "未解决事件 · 新系列 File.01 八王子スーパー強盗殺人事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-01.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/1ZZ8KXLXJ5",
		status: "completed",
		description:
			"2025年10月4日・11日放送（前後編）。1995年に3人が殺害された八王子スーパー強盗殺人事件を、30年目の捜査資料から検証する。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.02 北朝鮮 拉致事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-02.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/1J7XZ8KM47",
		status: "completed",
		description:
			"2025年10月18日放送。ドラマパートとドキュメンタリーパートの二部構成で、北朝鮮による日本人拉致事件と警察の捜査を描く。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.03 大手ハウスメーカー地面師詐欺事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-03.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/4L93YKWYLL",
		status: "completed",
		description:
			"2025年10月25日放送。大手ハウスメーカーを巻き込んだ地面師詐欺事件の手口と、被害が拡大した背景を追う。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.04 逃亡犯へ 遺族からの言葉",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-04.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/Z597399PVM",
		status: "completed",
		description:
			"2025年11月1日放送。別府ひき逃げ事件、名古屋市西区主婦殺害事件、熊谷男児死亡ひき逃げ事件を、遺族の言葉から検証する。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title:
			"未解决事件 · 新系列 File.05 “存在しない子どもたち” 大阪女児コンクリート詰め事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-05.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/ZWWVRGNP7G",
		status: "completed",
		description:
			"2025年11月8日放送。大阪女児コンクリート詰め事件を、存在を記録されなかった子どもたちという視点から描く。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.06 詐欺村 国際トクリュウ事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-06.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/GXPNJ6LWN2",
		status: "completed",
		description:
			"2025年11月15日放送。匿名・流動型犯罪グループによる国際的な詐欺拠点の実態と、その支配構造を追う。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title:
			"未解决事件 · 新系列 File.07 ベルトラッキ贋作事件〜世界をだました希代の詐欺師〜",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-07.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/N5KN735QQV",
		status: "completed",
		description:
			"2025年11月22日放送。世界の美術市場を騙したベルトラッキの贋作事件を、本人への取材から検証する。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.08 日本赤軍 vs 日本警察 知られざる攻防",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-08.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/NJ9MJJMZM5",
		status: "completed",
		description:
			"2025年11月29日・12月6日放送（前後編）。日本赤軍と警察の半世紀にわたる攻防を、関係者の証言から描く。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.09 年末特別編 世田谷一家殺害事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-09.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/W3PVX7W2MG",
		status: "completed",
		description:
			"2025年12月30日放送。事件から25年を迎えた世田谷一家殺害事件について、特命捜査対策室の継続捜査に密着する。",
		year: "2025",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.10 三億円事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-10.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/7RJG53J6N4",
		status: "completed",
		description:
			"2026年1月10日放送。1968年の三億円事件を、当時の捜査資料と新たな証言から再検証する。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.11 消えた470億円 ビットコイン巨額窃盗事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-11.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/Q2GP48ZNZ5",
		status: "completed",
		description:
			"2026年1月17日放送。マウントゴックス事件で消失した約470億円相当のビットコインをめぐる巨額窃盗の真相を追う。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.12 ストーカー殺人 なぜ繰り返されるのか",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-12.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/N8K9MGL1K8",
		status: "completed",
		description:
			"2026年1月24日放送。小金井ストーカー殺人未遂事件や川崎ストーカー殺人事件などを通して、被害が繰り返される構造を検証する。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.13 新宿 歌舞伎町ビル火災",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-13.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/P3XVR8Y7M1",
		status: "completed",
		description:
			"2026年2月28日放送。2001年の歌舞伎町ビル火災で44人が亡くなった事故の背景と、防災上の教訓を検証する。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.14 赤ちゃん取り違えの深層",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-14.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/8Q8JLN3R72",
		status: "completed",
		description:
			"2026年3月14日放送。新生児取り違え事件を、医療現場の管理体制と家族が負った苦悩から描く。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title:
			"未解决事件 · 新系列 File.15 冤(えん)罪 40年の深層〜福井中学生殺害事件〜",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-15.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/KN8NQMWK2Y",
		status: "completed",
		description:
			"2026年3月21日放送。福井中学生殺害事件で40年にわたり争われた冤罪を、再審請求の歩みから検証する。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.16 旧統一教会 なぜ見過ごされたのか",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-16.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/VGY1RP1QW1",
		status: "completed",
		description:
			"2026年3月28日放送。旧統一教会をめぐる不法行為に、警察がなぜ長く介入できなかったのかを元教団幹部の証言から追う。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title:
			"未解决事件 · 新系列 File.17 パリ同時テロ事件 若者たちはなぜ豹変したのか",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-17.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/Z89Z37M2K6",
		status: "completed",
		description:
			"2026年7月17日放送。2015年のパリ同時多発テロを実行した若者たちの変容を、関係者の証言から追う。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.18 上智大生殺害放火事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-18.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/YRKMWQY8R9",
		status: "completed",
		description:
			"2026年9月11日放送。1996年の上智大生殺害放火事件について、30年目の検証を行う。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
	{
		title: "未解决事件 · 新系列 File.19 北関東連続幼女誘拐・殺人事件",
		cover: "/assets/personal-media/nhk/nhk-mikaiketsu-series-19.jpg",
		link: "https://www.web.nhk/tv/an/mikaiketsu/pl/series-tep-57615R8KYY/ep/R8NN785AWQ",
		status: "completed",
		description:
			"2026年9月23日放送。北関東連続幼女誘拐・殺人事件を、DNA型鑑定の限界と捜査の課題から検証する。",
		year: "2026",
		studio: "NHK",
		genres: ["纪录片", "未解决事件", "新系列"],
	},
];
