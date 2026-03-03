const { createApp } = require("./app");

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const app = createApp();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`demo-app listening on port ${port}`);
});
