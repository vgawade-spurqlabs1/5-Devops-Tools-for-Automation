const axios = require("axios");

const baseUrl = process.env.BASE_URL;

describe("API smoke", () => {
  test("BASE_URL must be set", () => {
    expect(baseUrl).toBeTruthy();
  });

  test("/health returns ok", async () => {
    const res = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("status", "ok");
  });

  test("/api/hello returns a message", async () => {
    const res = await axios.get(`${baseUrl}/api/hello`, { timeout: 5000 });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("message", "Hello from demo-app");
    expect(res.data).toHaveProperty("timestamp");
  });
});
