import { expect, test } from "@playwright/test";

test("home redirects to the docs section", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/docs/);
});

test("docs sidebar navigation loads a linked page", async ({ page }) => {
  await page.goto("/docs");

  const sidebar = page.getByRole("complementary").first();
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Docs" })).toBeVisible();

  await page.getByRole("link", { name: "Workflows & Agents", exact: false }).first().click();

  await expect(page).toHaveURL(/\/docs\/workflows-and-agents\/overview/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
