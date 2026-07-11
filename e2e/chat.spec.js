import { test, expect } from "@playwright/test";

test("user sends a message and sees the assistant's reply", async ({ page }) => {
  // Intercept the AI route so this test never touches the real API.
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ reply: "Hello! How can I help you today?" })
    });
  });

  await page.goto("/");

  await page.getByLabel("Message").fill("Hi there");
  await page.getByRole("button", { name: "Send" }).click();

  // The user's own message appears immediately.
  await expect(
    page.getByRole("article", { name: "user message" })
  ).toContainText("Hi there");

  // A pending state shows briefly before the reply resolves.
  await expect(page.getByRole("status", { name: /message pending/i })).toBeVisible();

  // The assistant reply eventually replaces the pending state.
  await expect(
    page.getByRole("article", { name: "assistant message" })
  ).toContainText("Hello! How can I help you today?");
});

test("shows an error state when the AI route fails", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({ status: 500, body: "Internal Server Error" });
  });

  await page.goto("/");

  await page.getByLabel("Message").fill("This will fail");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByRole("alert")).toBeVisible();
});
