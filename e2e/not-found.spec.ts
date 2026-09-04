import { expect, test } from "@playwright/test";

test("an unknown docs slug renders a 404", async ({ page }) => {
  const response = await page.goto("/docs/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
});
