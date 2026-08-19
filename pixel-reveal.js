(function (global, factory) {
  "use strict";

  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.WindowPixelReveal = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var DEFAULT_PAUSE = 100;

  function assertStates(source, monitor, message) {
    if (!source || !monitor || !message || source.length !== monitor.length || source.length !== message.length) {
      throw new Error("Pixel states must have matching RGBA data.");
    }
    if (source.length % 4 !== 0) {
      throw new Error("Pixel state data must contain complete RGBA pixels.");
    }
  }

  function differingPixels(from, to) {
    var pixels = [];
    for (var offset = 0; offset < from.length; offset += 4) {
      if (
        from[offset] !== to[offset] ||
        from[offset + 1] !== to[offset + 1] ||
        from[offset + 2] !== to[offset + 2] ||
        from[offset + 3] !== to[offset + 3]
      ) {
        pixels.push(offset / 4);
      }
    }
    return pixels;
  }

  function scanPixels(pixels, width) {
    var ordered = pixels.slice();
    ordered.sort(function (left, right) {
      var leftRow = Math.floor(left / width);
      var rightRow = Math.floor(right / width);
      if (leftRow !== rightRow) return leftRow - rightRow;
      var leftColumn = left % width;
      var rightColumn = right % width;
      return leftRow % 2 ? rightColumn - leftColumn : leftColumn - rightColumn;
    });
    return ordered;
  }

  function replacePixel(frame, target, pixel) {
    var offset = pixel * 4;
    frame[offset] = target[offset];
    frame[offset + 1] = target[offset + 1];
    frame[offset + 2] = target[offset + 2];
    frame[offset + 3] = target[offset + 3];
  }

  function replacePixels(frame, target, orderedPixels, count) {
    for (var index = 0; index < count; index += 1) {
      replacePixel(frame, target, orderedPixels[index]);
    }
  }

  function createFrame(source, monitor, message, requestCount, options) {
    assertStates(source, monitor, message);
    options = options || {};

    var pause = Number.isFinite(options.pause) ? Math.max(0, Math.floor(options.pause)) : DEFAULT_PAUSE;
    var requests = Number.isFinite(requestCount) ? Math.max(0, Math.floor(requestCount)) : 0;
    var totalPixels = source.length / 4;
    var width = Number.isFinite(options.width) ? Math.max(1, Math.floor(options.width)) : totalPixels;
    var monitorPixels = scanPixels(differingPixels(source, monitor), width);
    var messagePixels = scanPixels(differingPixels(monitor, message), width);
    var monitorRevealed = Math.min(requests, monitorPixels.length);
    var requestsAfterMonitor = Math.max(0, requests - monitorPixels.length);
    var pauseElapsed = Math.min(pause, requestsAfterMonitor);
    var messageRevealed = Math.min(
      messagePixels.length,
      Math.max(0, requestsAfterMonitor - pause)
    );
    var frame = new Uint8ClampedArray(source);

    replacePixels(frame, monitor, monitorPixels, monitorRevealed);
    replacePixels(frame, message, messagePixels, messageRevealed);

    var phase = "monitor";
    if (monitorRevealed === monitorPixels.length) phase = "pause";
    if (messageRevealed > 0 || requestsAfterMonitor > pause) phase = "message";
    if (messageRevealed === messagePixels.length && messagePixels.length > 0) phase = "complete";

    return {
      data: frame,
      phase: phase,
      monitorRevealed: monitorRevealed,
      monitorTotal: monitorPixels.length,
      pauseElapsed: pauseElapsed,
      pauseRemaining: pause - pauseElapsed,
      messageRevealed: messageRevealed,
      messageTotal: messagePixels.length
    };
  }

  return {
    createFrame: createFrame,
    differingPixels: differingPixels,
    scanPixels: scanPixels,
    DEFAULT_PAUSE: DEFAULT_PAUSE
  };
});
