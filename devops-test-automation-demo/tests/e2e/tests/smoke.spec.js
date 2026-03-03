const { test, expect } = require("@playwright/test");

test("Home page loads and shows title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Demo App/);
  await expect(page.locator("h1")).toHaveText("Demo App");
});

test("API endpoint responds (via Playwright request)", async ({ request }) => {
  const res = await request.get("/api/hello");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.message).toBe("Hello from demo-app");
});
