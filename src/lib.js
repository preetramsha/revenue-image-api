import { createCanvas, registerFont } from "canvas";
import { Readable } from "node:stream";
function createReadableStreamFromBase64URI(base64URI) {
  // Extract the base64 data
  const base64Data = base64URI.split(";base64,").pop();

  // Convert base64 data to a buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Create a readable stream from the buffer
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null); // Signal the end of the stream

  return readableStream;
}

export function generateImageWithText(
  amt,
  fontPath,
  width = 800,
  height = 250
) {
  // Register the custom font
  registerFont(fontPath, { family: "CustomFont" });

  //convert amt string from int to string formatted.
  amt = Number(amt);
  amt = amt.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (amt.endsWith(".00")) {
    amt = amt.slice(0, -3); // Remove the '.00' part
  }

  // Create a canvas
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Measure text metrics to calculate vertical centering
  function measureTextMetrics(fontSize) {
    context.font = `${fontSize}px CustomFont`;
    const metrics = context.measureText(amt);
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8; // Fallback for browsers not supporting actualBoundingBoxAscent
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2; // Fallback for browsers not supporting actualBoundingBoxDescent
    return { ascent, descent };
  }

  // Function to find the vertical position that centers the text within the canvas
  function findVerticalCenterPosition(fontSize) {
    const { ascent, descent } = measureTextMetrics(fontSize);
    return (height - (ascent + descent)) / 2 + ascent; // Adjusted position to center text
  }

  // Function to measure text width for a given font size
  function measureTextWidth(fontSize) {
    context.font = `${fontSize}px CustomFont`;
    return context.measureText(amt).width;
  }

  // Function to find the maximum font size that fits the text within the canvas
  function findMaxFontSize() {
    let fontSize = 1;
    let textWidth = measureTextWidth(fontSize);

    while (textWidth < width && fontSize < height) {
      fontSize++;
      textWidth = measureTextWidth(fontSize);
    }

    return fontSize - 1; // Return the previous font size that fit within the canvas
  }

  // Calculate the maximum font size
  const maxFontSize = findMaxFontSize();

  // Calculate the vertical center position
  const centerY = findVerticalCenterPosition(maxFontSize);

  // Set font properties with the maximum font size
  context.font = `${maxFontSize}px CustomFont`;
  context.fillStyle = "#6CC04A"; // Set font color to green

  // Set border properties
  const borderWidth = 1.1; // Border width in pixels
  context.strokeStyle = "black"; // Set border color to black

  // Position the text horizontally in the center
  const x = (width - measureTextWidth(maxFontSize)) / 2;

  // Draw the text with border
  for (let xOffset = -borderWidth; xOffset <= borderWidth; xOffset++) {
    for (let yOffset = -borderWidth; yOffset <= borderWidth; yOffset++) {
      if (xOffset !== 0 || yOffset !== 0) {
        context.strokeStyle = "black"; // Set border color to black
        context.strokeText(amt, x + xOffset, centerY + yOffset);
      }
    }
  }

  // Draw the main text on the canvas
  context.fillText(amt, x, centerY);

  // Convert canvas to a data URL
  const dataURL = canvas.toDataURL();
  const stream = createReadableStreamFromBase64URI(dataURL);
  return {
    readableStream: stream,
    dataURL: dataURL,
  };
}
