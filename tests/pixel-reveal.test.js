"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const reveal = require("../pixel-reveal.js");

function rgba(pixels) {
  return new Uint8ClampedArray(pixels.flat());
}

function changedPixelCount(left, right) {
  let changed = 0;
  for (let offset = 0; offset < left.length; offset += 4) {
    if (
      left[offset] !== right[offset] ||
      left[offset + 1] !== right[offset + 1] ||
      left[offset + 2] !== right[offset + 2] ||
      left[offset + 3] !== right[offset + 3]
    ) {
      changed += 1;
    }
  }
  return changed;
}

function paeth(left, above, upperLeft) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  if (aboveDistance <= upperLeftDistance) return above;
  return upperLeft;
}

function decodeRgbaPng(filename) {
  const png = fs.readFileSync(filename);
  assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  let offset = 8;
  let header;
  const compressed = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12]
      };
    } else if (type === "IDAT") {
      compressed.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }

  assert.ok(header);
  assert.equal(header.bitDepth, 8);
  assert.equal(header.colorType, 6);
  assert.equal(header.interlace, 0);

  const bytesPerPixel = 4;
  const stride = header.width * bytesPerPixel;
  const filtered = zlib.inflateSync(Buffer.concat(compressed));
  const pixels = Buffer.alloc(header.height * stride);
  let sourceOffset = 0;

  for (let row = 0; row < header.height; row += 1) {
    const filter = filtered[sourceOffset];
    sourceOffset += 1;
    const rowOffset = row * stride;
    for (let column = 0; column < stride; column += 1) {
      const encoded = filtered[sourceOffset + column];
      const left = column >= bytesPerPixel ? pixels[rowOffset + column - bytesPerPixel] : 0;
      const above = row > 0 ? pixels[rowOffset - stride + column] : 0;
      const upperLeft = row > 0 && column >= bytesPerPixel
        ? pixels[rowOffset - stride + column - bytesPerPixel]
        : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = above;
      else if (filter === 3) predictor = Math.floor((left + above) / 2);
      else if (filter === 4) predictor = paeth(left, above, upperLeft);
      else assert.equal(filter, 0);
      pixels[rowOffset + column] = (encoded + predictor) & 255;
    }
    sourceOffset += stride;
  }

  return { width: header.width, height: header.height, data: pixels };
}

function spritePanel(sprite, panel) {
  const width = 96;
  const panelData = new Uint8ClampedArray(width * sprite.height * 4);
  for (let row = 0; row < sprite.height; row += 1) {
    const sourceStart = (row * sprite.width + panel * width) * 4;
    const targetStart = row * width * 4;
    panelData.set(sprite.data.subarray(sourceStart, sourceStart + width * 4), targetStart);
  }
  return panelData;
}

const source = rgba([
  [0, 0, 0, 0],
  [0, 0, 0, 255],
  [10, 10, 10, 255],
  [20, 20, 20, 255],
  [30, 30, 30, 255],
  [40, 40, 40, 255]
]);

const monitor = rgba([
  [5, 5, 5, 255],
  [0, 0, 0, 255],
  [12, 12, 12, 255],
  [20, 20, 20, 255],
  [32, 32, 32, 255],
  [40, 40, 40, 255]
]);

const message = rgba([
  [5, 5, 5, 255],
  [0, 80, 170, 255],
  [12, 12, 12, 255],
  [240, 250, 255, 255],
  [32, 32, 32, 255],
  [40, 40, 40, 255]
]);

test("reveals exactly one monitor pixel for each request", () => {
  const initial = reveal.createFrame(source, monitor, message, 0);
  assert.equal(initial.monitorTotal, 3);

  for (let request = 0; request < initial.monitorTotal; request += 1) {
    const before = reveal.createFrame(source, monitor, message, request);
    const after = reveal.createFrame(source, monitor, message, request + 1);
    assert.equal(changedPixelCount(before.data, after.data), 1);
  }
});

test("holds the completed black monitor for 100 full requests", () => {
  const monitorTotal = reveal.createFrame(source, monitor, message, 0).monitorTotal;
  const completedMonitor = reveal.createFrame(source, monitor, message, monitorTotal);

  assert.equal(completedMonitor.phase, "pause");
  assert.equal(completedMonitor.pauseRemaining, 100);

  for (let wait = 1; wait <= 100; wait += 1) {
    const frame = reveal.createFrame(source, monitor, message, monitorTotal + wait);
    assert.equal(changedPixelCount(completedMonitor.data, frame.data), 0);
    assert.equal(frame.messageRevealed, 0);
    assert.equal(frame.pauseRemaining, 100 - wait);
  }
});

test("starts the corrupted blue screen on request 101 after the monitor completes", () => {
  const first = reveal.createFrame(source, monitor, message, 0);
  const finalWait = reveal.createFrame(source, monitor, message, first.monitorTotal + 100);
  const firstMessage = reveal.createFrame(source, monitor, message, first.monitorTotal + 101);

  assert.equal(finalWait.phase, "pause");
  assert.equal(firstMessage.phase, "message");
  assert.equal(firstMessage.messageRevealed, 1);
  assert.equal(changedPixelCount(finalWait.data, firstMessage.data), 1);
});

test("reveals exactly one message pixel for each request until complete", () => {
  const initial = reveal.createFrame(source, monitor, message, 0);
  const messageStart = initial.monitorTotal + 100;

  for (let request = 0; request < initial.messageTotal; request += 1) {
    const before = reveal.createFrame(source, monitor, message, messageStart + request);
    const after = reveal.createFrame(source, monitor, message, messageStart + request + 1);
    assert.equal(changedPixelCount(before.data, after.data), 1);
  }

  const complete = reveal.createFrame(
    source,
    monitor,
    message,
    messageStart + initial.messageTotal
  );
  assert.equal(complete.phase, "complete");
});

test("uses a stable reveal order", () => {
  const left = reveal.createFrame(source, monitor, message, 2);
  const right = reveal.createFrame(source, monitor, message, 2);
  assert.deepEqual(left.data, right.data);
});

test("uses a top-to-bottom serpentine raster scan", () => {
  assert.deepEqual(reveal.scanPixels([0, 1, 2, 3, 4, 5], 3), [0, 1, 2, 5, 4, 3]);
});

test("the committed sprite preserves the documented request counts", () => {
  const sprite = decodeRgbaPng(path.join(__dirname, "..", "assets", "window-monitor-states.png"));
  assert.equal(sprite.width, 288);
  assert.equal(sprite.height, 72);

  const frame = reveal.createFrame(
    spritePanel(sprite, 0),
    spritePanel(sprite, 1),
    spritePanel(sprite, 2),
    0,
    { width: 96 }
  );
  assert.equal(frame.monitorTotal, 3765);
  assert.equal(frame.messageTotal, 2183);
  assert.equal(frame.monitorTotal + reveal.DEFAULT_PAUSE + frame.messageTotal, 6048);
});
