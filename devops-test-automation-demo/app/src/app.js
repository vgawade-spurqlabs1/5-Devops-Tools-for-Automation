const express = require("express");

function createApp() {
  const app = express();

  // Health endpoint for readiness/liveness probes
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Simple API endpoint used by API tests and E2E checks
  app.get("/api/hello", (_req, res) => {
    res.json({
      message: "Hello from demo-app",
      timestamp: new Date().toISOString()
    });
  });

  // Minimal UI page for E2E smoke tests
  app.get("/", (_req, res) => {
    res.type("html").send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>Demo App</title>
        </head>
        <body>
          <main>
            <h1>Demo App</h1>
            <p>This page exists to demonstrate Playwright smoke tests.</p>
          </main>
        </body>
      </html>
    `);
  });

  return app;
}

module.exports = { createApp };
