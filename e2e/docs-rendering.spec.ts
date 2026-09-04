import { expect, test } from "@playwright/test";

test("a docs page renders custom MDX components", async ({ page }) => {
  await page.goto("/docs/workflows-and-agents/overview");

  await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();

  // fumadocs-ui gives <Steps>/<Step> a stable, documented class name.
  await expect(page.locator(".fd-steps .fd-step").first()).toBeVisible();

  // <Callout type="info"> content from this page.
  await expect(page.getByText("This reading order is a suggestion")).toBeVisible();
});
