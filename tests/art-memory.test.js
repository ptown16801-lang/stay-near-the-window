"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const memoryKey = "near-window.memory.v1";
const artSource = fs.readFileSync(path.join(__dirname, "..", "art.js"), "utf8");

function localMemory(initial) {
  const values = new Map(Object.entries(initial || {}));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    keys() {
      return Array.from(values.keys());
    }
  };
}

function loadArtwork(storage) {
  const root = {
    innerHTML: "",
    addEventListener() {},
    querySelector() { return null; }
  };
  const quietNode = {
    textContent: "",
    addEventListener() {}
  };
  const document = {
    body: { dataset: {} },
    getElementById(id) {
      if (id === "artwork") return root;
      return quietNode;
    },
    addEventListener() {}
  };
  const window = {
    WindowPixelReveal: null,
    location: { hash: "" },
    history: { back() {} },
    setTimeout() { return 0; },
    clearTimeout() {},
    addEventListener() {}
  };

  vm.runInNewContext(artSource, {
    document,
    window,
    localStorage: storage,
    requestAnimationFrame() {},
    Number,
    Set,
    Uint8ClampedArray
  });
}

test("migrates an existing two-integer record without inventing a device identifier", () => {
  const storage = localMemory({
    [memoryKey]: JSON.stringify({ visits: 9, completed: 2 })
  });

  loadArtwork(storage);

  assert.deepEqual(JSON.parse(storage.getItem(memoryKey)), {
    visits: 10,
    completed: 2,
    windowRequests: 1
  });
  assert.deepEqual(storage.keys(), [memoryKey]);
});

test("increments the pixel request exactly once per full document load", () => {
  const storage = localMemory();

  loadArtwork(storage);
  assert.equal(JSON.parse(storage.getItem(memoryKey)).windowRequests, 1);

  loadArtwork(storage);
  const remembered = JSON.parse(storage.getItem(memoryKey));
  assert.equal(remembered.visits, 2);
  assert.equal(remembered.windowRequests, 2);
});
