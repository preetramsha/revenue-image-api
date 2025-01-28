import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { generateImageWithText } from "./src/lib";
const app = new Hono();

app.get("/", (c) => {
  return c.text(`
    Welcome! There are 2 routes you can access:
    
    1. /readable-stream/:amount - This route generates an image with text and returns a readable stream.
    2. /dataurl/:amount - This route generates an image with text and returns the image as a data URL.

    Example usage:
    - /readable-stream/100
    - /dataurl/100
  `);
});

app.get("readable-stream/:amount", (c) => {
  let amount = c.req.param("amount");
  // Remove dollar symbol and commas
  amount = amount.replace(/[$,]/g, "");
  const resp = generateImageWithText(amount, "./pricedow.ttf");
  return c.text(resp.readableStream);
});

app.get("dataurl/:amount", (c) => {
  let amount = c.req.param("amount");
  // Remove dollar symbol and commas
  amount = amount.replace(/[$,]/g, "");
  const resp = generateImageWithText(amount, "./pricedow.ttf");
  return c.text(resp.dataURL);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
