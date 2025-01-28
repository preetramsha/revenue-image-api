import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { generateImageWithText } from "./src/lib";
const app = new Hono();

app.get("readable-stream/:amount", (c) => {
  const amount = c.req.param("amount");
  const resp = generateImageWithText(amount, "./pricedow.ttf");
  return c.text(resp.readableStream);
});

app.get("dataurl/:amount", (c) => {
  const amount = c.req.param("amount");
  const resp = generateImageWithText(amount, "./pricedow.ttf");
  return c.text(resp.dataURL);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
