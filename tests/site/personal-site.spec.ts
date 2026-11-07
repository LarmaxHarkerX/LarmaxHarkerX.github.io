import { expect, test } from "@playwright/test";

const posts = [
	{
		slug: "ae-2026-red-giant-universe-fix",
		category: "软件排错",
	},
	{
		slug: "bpad-mini-se-crdroid-guide",
		category: "Android 刷机",
	},
	{
		slug: "huawei-m3-flashing-guide",
		category: "Android 刷机",
	},
] as const;

test("homepage publishes exactly the three migrated articles", async ({
	page,
}) => {
	await page.goto("/");
	const links = await page
		.locator('#swup-container a[href^="/posts/"]')
		.evaluateAll((elements) =>
			[
				...new Set(elements.map((element) => element.getAttribute("href"))),
			].sort(),
		);
	expect(links).toEqual(posts.map((post) => `/posts/${post.slug}/`).sort());
});

const personalPages = [
	{ path: "/moments/", selector: ".moment-card", count: 1 },
	{ path: "/projects/", selector: ".project-card", count: 1 },
	{ path: "/timeline/", selector: ".timeline-card", count: 1 },
	{ path: "/anime/", selector: ".anime-card", count: 12 },
	{ path: "/devices/", selector: ".device-card", count: 3 },
	{ path: "/games/", selector: ".game-card", count: 29 },
	{ path: "/skills/", selector: ".skill-card", count: 7 },
] as const;

for (const item of personalPages) {
	test(`${item.path} publishes only the owner's collection`, async ({
		page,
	}) => {
		await page.goto(item.path);
		await expect(page.locator(item.selector)).toHaveCount(item.count);
	});
}

test("the seven requested skills display full proficiency meters", async ({
	page,
}) => {
	await page.goto("/skills/");
	await expect(page.locator(".skill-card")).toHaveCount(7);
	await expect(page.locator(".skill-card__level")).toHaveCount(7);
	const meters = page.locator('.skill-card [role="meter"]');
	await expect(meters).toHaveCount(7);
	for (const meter of await meters.all()) {
		await expect(meter).toHaveAttribute("aria-valuenow", "4");
	}
	await expect(page.locator(".skill-card__segment--active")).toHaveCount(28);
	await expect(page.locator(".skill-card h2")).toHaveText([
		"Adobe After Effects",
		"Blender",
		"Adobe Photoshop",
		"Unreal Engine",
		"FL Studio",
		"REAPER",
		"VEGAS Pro",
	]);
});

test("movies without personal scores or progress do not show invented metadata", async ({
	page,
}) => {
	await page.goto("/anime/?q=继母与女儿的蓝调");
	await expect(page.locator(".anime-card")).toHaveCount(4);
	await expect(page.locator(".anime-card__rating")).toHaveCount(0);
	await expect(page.locator(".anime-card__status")).toHaveCount(0);
	await expect(page.locator(".anime-card__progress")).toHaveCount(0);
	await expect(page.locator(".anime-card__title")).toContainText([
		"继母与女儿的蓝调",
		"2020",
		"2022",
		"2024",
	]);
});

test("game collection does not carry demo ratings hours or inferred progress", async ({
	page,
}) => {
	await page.goto("/games/");
	await expect(page.locator(".game-card")).toHaveCount(29);
	await expect(page.locator(".game-card__cover")).toHaveCount(29);
	await expect(
		page.locator('[data-game="nte-neverness-to-everness"]'),
	).toHaveCount(0);
	await expect(page.locator(".game-card__rating")).toHaveCount(0);
	await expect(page.locator(".game-card__hours")).toHaveCount(0);
	await expect(page.locator(".game-card__status")).toHaveCount(0);
});

test("NHK case files are separate watched records and can all be loaded", async ({
	page,
}) => {
	await page.goto("/anime/?q=未解决事件");
	await expect(page.locator(".anime-section__count")).toContainText("29");
	const more = page.locator(".anime-section__more button");
	while (await more.isVisible()) {
		await more.click();
	}
	await expect(page.locator(".anime-card")).toHaveCount(29);
	await expect(page.locator(".anime-card__status")).toHaveCount(29);
	await expect(page.locator(".anime-card__rating")).toHaveCount(0);
	const titles = await page.locator(".anime-card__title").allTextContents();
	expect(new Set(titles).size).toBe(29);
	expect(titles.filter((title) => title.includes("NHK特别篇")).length).toBe(10);
	expect(titles.filter((title) => title.includes("新系列")).length).toBe(19);
});

test("compass groups the requested official creative and AI websites", async ({
	page,
}) => {
	await page.goto("/compass/");
	const design = page.locator('section[data-shelf="design"]');
	for (const href of [
		"https://www.pinterest.com/",
		"https://www.behance.net/",
		"https://dribbble.com/",
	]) {
		await expect(design.locator(`a[href="${href}"]`)).toHaveCount(1);
	}
	const assistants = page.locator('section[data-shelf="ai"]');
	for (const href of [
		"https://chatgpt.com/",
		"https://gemini.google.com/",
		"https://claude.ai/",
	]) {
		await expect(assistants.locator(`a[href="${href}"]`)).toHaveCount(1);
	}
});

for (const post of posts) {
	test(`article ${post.slug} has its category and public canonical URL`, async ({
		page,
	}) => {
		await page.goto(`/posts/${post.slug}/`);
		await expect(page.locator("#swup-container")).toContainText(post.category);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`https://larmaxharkerx.github.io/posts/${post.slug}/`,
		);
	});
}

test("friends page links to both migrated blogs", async ({ page }) => {
	await page.goto("/friends/");
	const cards = page.locator(".friend-card");
	await expect(cards).toHaveCount(2);
	await expect(cards.filter({ hasText: "艾了个拉" })).toHaveAttribute(
		"href",
		"https://aira.cafe/",
	);
	await expect(cards.filter({ hasText: "心水湛清" })).toHaveAttribute(
		"href",
		"https://xszq.xyz/",
	);
});

test("category navigation shows only articles in the selected category", async ({
	page,
}) => {
	await page.goto("/categories/");
	await page
		.locator('#swup-container a[href*="category="]')
		.filter({ hasText: "Android 刷机" })
		.click();
	await expect
		.poll(() =>
			page
				.locator('#swup-container a[href^="/posts/"]')
				.evaluateAll((elements) =>
					[
						...new Set(elements.map((element) => element.getAttribute("href"))),
					].sort(),
				),
		)
		.toEqual([
			"/posts/bpad-mini-se-crdroid-guide/",
			"/posts/huawei-m3-flashing-guide/",
		]);
});
