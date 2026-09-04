import { expect, test } from "@playwright/test";

test("search opens and returns results for a known query", async ({ page }) => {
  await page.goto("/docs");

  await page
    .getByRole("button", { name: /search/i })
    .first()
    .click();

  const input = page.getByPlaceholder("Search");
  await expect(input).toBeVisible();
  await input.fill("orchestration");

  await expect(
    page
      .getByRole("dialog", { name: "Search" })
      .getByRole("button", { name: /orchestration/i })
      .first(),
  ).toBeVisible();
});
