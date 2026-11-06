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
