/**
 * BFS flood fill on canvas ImageData.
 * Fills a region starting from (startX, startY) with fillColor,
 * stopping at dark pixels (outlines).
 */
export function floodFill(ctx, startX, startY, fillColor, tolerance = 50) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data, width, height } = imageData;

  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];
  const startA = data[startIdx + 3];

  // Don't fill if clicking on a dark outline
  if (isDark(startR, startG, startB)) return;

  // Don't fill if the target color is the same as fill color
  const [fR, fG, fB] = fillColor;
  if (
    Math.abs(startR - fR) < 3 &&
    Math.abs(startG - fG) < 3 &&
    Math.abs(startB - fB) < 3
  ) {
    return;
  }

  const visited = new Uint8Array(width * height);
  const queue = [[startX, startY]];
  visited[startY * width + startX] = 1;

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const idx = (y * width + x) * 4;

    data[idx] = fR;
    data[idx + 1] = fG;
    data[idx + 2] = fB;
    data[idx + 3] = 255;

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const nPixel = ny * width + nx;
      if (visited[nPixel]) continue;
      visited[nPixel] = 1;

      const nIdx = nPixel * 4;
      const nR = data[nIdx];
      const nG = data[nIdx + 1];
      const nB = data[nIdx + 2];

      // Stop at dark pixels (outlines)
      if (isDark(nR, nG, nB)) continue;

      // Check if pixel color is similar to starting color
      if (
        Math.abs(nR - startR) <= tolerance &&
        Math.abs(nG - startG) <= tolerance &&
        Math.abs(nB - startB) <= tolerance
      ) {
        queue.push([nx, ny]);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function isDark(r, g, b) {
  // A pixel is considered a dark outline if its luminance is low
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 80;
}
