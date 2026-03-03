const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080",
    headless: true,
    trace: "on-first-retry"
  },

  reporter: [
    ["html", { outputFolder: "e2e-report", open: "never" }],
    ["list"]
  ]
});
