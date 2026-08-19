(function () {
  "use strict";

  var root = document.getElementById("artwork");
  var status = document.getElementById("status");
  var reset = document.getElementById("reset-memory");
  var memoryKey = "near-window.memory.v1";
  var pixelReveal = window.WindowPixelReveal;
  var pixelStatePromise;
  var pixelWidth = 96;
  var pixelHeight = 72;
  var timers = [];
  var memory = readMemory();
  var session = {
    attempts: 0,
    marks: [],
    counterLoops: 0,
    roomPokes: 0,
    chairs: new Set(),
    corridorLoops: 0
  };
  var markWords = ["WAIT", "NEAR", "THE", "WINDOW", "STILL", "HERE"];
  var chairWords = ["THIS SEAT WAS SAVED", "FOR THE PERSON", "WHO KEPT MOVING", "TO MAKE ROOM"];

  memory.visits += 1;
  memory.windowRequests += 1;
  writeMemory();

  function storedCount(value) {
    var count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  }

  function readMemory() {
    try {
      var saved = JSON.parse(localStorage.getItem(memoryKey) || "{}");
      return {
        visits: storedCount(saved.visits),
        completed: storedCount(saved.completed),
        windowRequests: storedCount(saved.windowRequests)
      };
    } catch (_) {
      return { visits: 0, completed: 0, windowRequests: 0 };
    }
  }

  function writeMemory() {
    try {
      localStorage.setItem(memoryKey, JSON.stringify(memory));
    } catch (_) {}
  }

  function loadPixelStates() {
    if (pixelStatePromise) return pixelStatePromise;
    pixelStatePromise = new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () {
        try {
          var stateCanvas = document.createElement("canvas");
          var stateContext = stateCanvas.getContext("2d", { willReadFrequently: true });
          var states = [];
          stateCanvas.width = pixelWidth;
          stateCanvas.height = pixelHeight;
          stateContext.imageSmoothingEnabled = false;

          for (var panel = 0; panel < 3; panel += 1) {
            stateContext.clearRect(0, 0, pixelWidth, pixelHeight);
            stateContext.drawImage(
              image,
              panel * pixelWidth,
              0,
              pixelWidth,
              pixelHeight,
              0,
              0,
              pixelWidth,
              pixelHeight
            );
            states.push(new Uint8ClampedArray(
              stateContext.getImageData(0, 0, pixelWidth, pixelHeight).data
            ));
          }
          resolve(states);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = reject;
      image.src = "/assets/window-monitor-states.png";
    });
    return pixelStatePromise;
  }

  function describePixelFrame(frame) {
    if (frame.phase === "pause") {
      return "A black Dell monitor. Its screen remains blank.";
    }
    if (frame.phase === "complete") {
      return "A black Dell monitor displaying a complete, garbled blue system error.";
    }
    if (frame.phase === "message") {
      return "A black Dell monitor. A garbled blue system error is appearing on its screen.";
    }
    return "A closed service window. Its surface is changing one point at a time.";
  }

  function drawProgressiveWindow() {
    var button = root.querySelector(".service-window");
    var canvas = button && button.querySelector(".window-progress");
    if (!button || !canvas || !pixelReveal) return;

    loadPixelStates().then(function (states) {
      if (!canvas.isConnected) return;
      var frame = pixelReveal.createFrame(
        states[0],
        states[1],
        states[2],
        memory.windowRequests,
        { pause: 100, width: pixelWidth }
      );
      var context = canvas.getContext("2d");
      var imageData = context.createImageData(pixelWidth, pixelHeight);
      imageData.data.set(frame.data);
      context.imageSmoothingEnabled = false;
      context.putImageData(imageData, 0, 0);

      button.classList.add("pixel-ready");
      button.dataset.pixelPhase = frame.phase;
      button.dataset.monitorPixels = frame.monitorRevealed + "/" + frame.monitorTotal;
      button.dataset.pauseRemaining = String(frame.pauseRemaining);
      button.dataset.messagePixels = frame.messageRevealed + "/" + frame.messageTotal;
      button.setAttribute("aria-label", describePixelFrame(frame));
    }).catch(function () {
      button.classList.remove("pixel-ready");
    });
  }

  function say(message) {
    status.textContent = "";
    requestAnimationFrame(function () {
      status.textContent = message;
    });
  }

  function route() {
    return window.location.hash.replace(/^#\/?/, "") || "threshold";
  }

  function go(next) {
    if (route() === next) render();
    else window.location.hash = next;
  }

  function later(fn, delay) {
    timers.push(window.setTimeout(fn, delay));
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function thresholdView() {
    var title = "PLEASE STAY<br>NEAR THE WINDOW";
    var position = "POSITION: NOT YET ASSIGNED";
    if (memory.completed) {
      title = "YOUR PLACE WAS<br>NOT RELEASED";
      position = "THE ROOM REMEMBERS " + memory.completed + " COMPLETED WAIT" + (memory.completed === 1 ? "" : "S");
    } else if (memory.visits > 1) {
      title = "PLEASE STAY NEAR<br>THE SAME WINDOW";
      position = "VISIT " + String(memory.visits).padStart(3, "0") + " / POSITION UNCHANGED";
    }

    return [
      '<section class="threshold scene" aria-labelledby="threshold-title">',
      '<p class="agency">PUBLIC UTILITY / WINDOW 0</p>',
      '<h1 id="threshold-title">' + title + "</h1>",
      '<button class="service-window" data-action="window-knock" type="button" aria-label="A closed service window">',
      '<canvas class="window-progress" width="96" height="72" aria-hidden="true"></canvas>',
      "</button>",
      '<div class="mark-field" aria-hidden="true"></div>',
      '<button class="seam" data-action="enter-room" type="button" hidden>there is a seam in the wall</button>',
      '<button class="ticket-button" data-action="ticket" type="button">TAKE A NUMBER</button>',
      '<p class="position">' + position + "</p>",
      '<p class="idle-message" aria-hidden="true">WE CAN HEAR YOU WAITING</p>',
      "</section>"
    ].join("");
  }

  function counterView() {
    var now = String(session.counterLoops + 1).padStart(3, "0");
    var thin = session.counterLoops > 1
      ? '<button class="paper-thin" data-action="enter-room" type="button">the paper is thin here</button>'
      : "";
    return [
      '<section class="counter scene" aria-labelledby="counter-title">',
      '<div class="receipt">',
      '<p>PUBLIC UTILITY / WINDOW 0</p>',
      '<h1 id="counter-title">NOW SERVING<br><strong>' + now + "</strong></h1>",
      '<p class="your-number">YOUR NUMBER<br><strong><a class="record-link" href="/record/000.md">000</a></strong></p>',
      '<p>PLEASE WAIT UNTIL<br>THE DIFFERENCE<br>IS RESOLVED.</p>',
      '<button data-action="another-number" type="button">TAKE ANOTHER</button>',
      '<button data-action="enter-room" type="button">LOOK AT THE WALL</button>',
      thin,
      "</div>",
      '<p class="counter-shadow" aria-hidden="true">000 000 000 000 000</p>',
      "</section>"
    ].join("");
  }

  function roomView() {
    var whisper = session.roomPokes > 1
      ? "THE FLOOR REMEMBERS A PERSON."
      : session.roomPokes
        ? "SOMETHING MOVED AFTER YOU TOUCHED NOTHING."
        : "";
    return [
      '<section class="room scene" aria-labelledby="room-title">',
      '<header><p>WAITING AREA / NO APPOINTMENT</p><h1 id="room-title">THERE ARE FOUR PLACES.<br>NONE ARE YOURS.</h1></header>',
      '<figure class="room-figure" data-action="room-poke">',
      '<img src="/assets/waiting-room.webp" alt="A harsh photocopy of an institutional waiting room. Four empty chairs face away from a high, black service window. A narrow corridor folds into the right wall.">',
      '<button class="hotspot hs-chair" data-action="chairs" type="button" aria-label="The shadows beneath four empty chairs"></button>',
      '<button class="hotspot hs-window" data-action="window" type="button" aria-label="The black service window set too high in the wall"></button>',
      '<button class="hotspot hs-corridor" data-action="corridor" type="button" aria-label="The narrow corridor on the right"></button>',
      "</figure>",
      '<p class="room-whisper">' + whisper + "</p>",
      '<button class="back-edge" data-action="back" type="button">use the wall behind you</button>',
      "</section>"
    ].join("");
  }

  function chairsView() {
    var buttons = chairWords.map(function (word, index) {
      var touched = session.chairs.has(index);
      return [
        '<button class="chair chair-' + (index + 1) + (touched ? " touched" : "") + '"',
        ' data-action="chair" data-chair="' + index + '" type="button"',
        ' aria-label="Chair ' + (index + 1) + (touched ? ": " + word : "") + '">',
        touched ? '<span>' + word + "</span>" : "",
        "</button>"
      ].join("");
    }).join("");
    var exit = session.chairs.size === chairWords.length
      ? '<button class="chairs-exit" data-action="window" type="button">THE WINDOW HAS BEEN WATCHING THE EMPTY SEAT</button>'
      : "";
    return [
      '<section class="chairs-scene scene" aria-labelledby="chairs-title">',
      '<h1 id="chairs-title">PLEASE CHOOSE<br>A PLACE ALREADY CHOSEN</h1>',
      '<div class="chairs-image">',
      '<img src="/assets/waiting-room.webp" alt="The four molded chairs, enlarged until their dark undersides resemble open mouths.">',
      buttons,
      "</div>",
      exit,
      '<button class="back-edge" data-action="back" type="button">return without surrendering the seat</button>',
      "</section>"
    ].join("");
  }

  function corridorView() {
    var phrases = [
      "THE HALL IS SHORTER FROM THE OTHER END.",
      "YOU HAVE RETURNED WITHOUT TURNING.",
      "THE WALL HAS LEARNED YOUR WIDTH.",
      "A DOOR WAS ADDED WHILE YOU WERE INSIDE IT."
    ];
    var index = Math.min(session.corridorLoops, phrases.length - 1);
    var slices = [0, 1, 2].map(function (slice) {
      return '<button class="corridor-slice slice-' + slice + '" data-action="corridor-step" type="button" aria-label="Continue through the repeated corridor"></button>';
    }).join("");
    var exit = session.corridorLoops > 2
      ? '<button class="corridor-exit" data-action="window" type="button">USE THE DOOR THAT WAS NOT HERE</button>'
      : "";
    return [
      '<section class="corridor scene loops-' + session.corridorLoops + '" aria-labelledby="corridor-title">',
      '<h1 id="corridor-title">' + phrases[index] + "</h1>",
      '<div class="corridor-grid">' + slices + "</div>",
      exit,
      '<button class="back-edge" data-action="back" type="button">the room is behind every wall</button>',
      "</section>"
    ].join("");
  }

  function windowView() {
    return [
      '<section class="window-scene scene" aria-labelledby="window-title">',
      '<img src="/assets/waiting-room.webp" alt="The service window fills the frame. Its interior is entirely black.">',
      '<div class="window-black" aria-hidden="true"></div>',
      '<h1 id="window-title">YOU WERE SERVED.</h1>',
      '<p>NO ONE CAME TO THE WINDOW.</p>',
      '<button class="finish" data-action="finish" type="button" hidden aria-label="Touch the empty service window"></button>',
      "</section>"
    ].join("");
  }

  function endView() {
    return [
      '<section class="end scene" aria-labelledby="end-title">',
      '<p class="agency">SERVICE COMPLETE / RECORD RETAINED LOCALLY</p>',
      '<h1 id="end-title">WE KEPT THE SHAPE<br>YOU MADE<br>WHILE WAITING.</h1>',
      '<div class="seat-residue" aria-hidden="true"><i></i><i></i><i></i><i></i></div>',
      '<button data-action="restart" type="button">stand elsewhere</button>',
      "</section>"
    ].join("");
  }

  function render() {
    clearTimers();
    var current = route();
    var views = {
      threshold: thresholdView,
      counter: counterView,
      room: roomView,
      chairs: chairsView,
      corridor: corridorView,
      window: windowView,
      end: endView
    };
    if (!views[current]) current = "threshold";
    document.body.dataset.route = current;
    root.innerHTML = views[current]();

    if (current === "threshold") {
      drawProgressiveWindow();
      later(function () {
        var scene = root.querySelector(".threshold");
        if (!scene) return;
        scene.classList.add("awake");
        scene.querySelector(".idle-message").setAttribute("aria-hidden", "false");
        say("The closed window says: We can hear you waiting.");
      }, 6500);
    }

    if (current === "window") {
      later(function () {
        var scene = root.querySelector(".window-scene");
        if (scene) scene.classList.add("answered");
        say("You were served. No one came to the window.");
      }, 1700);
      later(function () {
        var finish = root.querySelector(".finish");
        if (finish) finish.hidden = false;
      }, 3200);
    }
  }

  function evade(button) {
    var positions = [
      ["74%", "18%"],
      ["17%", "72%"],
      ["70%", "78%"]
    ];
    var position = positions[Math.min(session.attempts, positions.length - 1)];
    session.attempts += 1;
    button.style.left = position[0];
    button.style.top = position[1];
    button.classList.add("evading");
    if (session.attempts >= positions.length) {
      button.classList.add("settled");
      button.textContent = "TAKE THIS NUMBER";
      say("The button has stopped avoiding you.");
    } else {
      say("The useful control moved away.");
    }
  }

  function addMark(event) {
    if (session.marks.length >= markWords.length) return;
    var field = root.querySelector(".mark-field");
    if (!field) return;
    var bounds = field.getBoundingClientRect();
    var mark = document.createElement("span");
    var word = markWords[session.marks.length];
    var x = Math.max(6, Math.min(90, ((event.clientX - bounds.left) / bounds.width) * 100));
    var y = Math.max(8, Math.min(88, ((event.clientY - bounds.top) / bounds.height) * 100));
    session.marks.push({ word: word, x: x, y: y });
    mark.className = "stamp stamp-" + session.marks.length;
    mark.textContent = word;
    mark.style.left = x + "%";
    mark.style.top = y + "%";
    field.appendChild(mark);
    say(word.toLowerCase() + ".");
    if (session.marks.length >= 4) {
      var seam = root.querySelector(".seam");
      seam.hidden = false;
      later(function () { seam.classList.add("visible"); }, 40);
      say("A seam has appeared in the wall.");
    }
  }

  document.addEventListener("pointerdown", function (event) {
    var ticket = event.target.closest('[data-action="ticket"]');
    if (ticket && session.attempts < 3) {
      event.preventDefault();
      evade(ticket);
    }
  });

  root.addEventListener("click", function (event) {
    var actionNode = event.target.closest("[data-action]");
    var action = actionNode && actionNode.dataset.action;

    if (!action && route() === "threshold") {
      addMark(event);
      return;
    }
    if (!action) return;

    if (action === "ticket") {
      if (session.attempts < 3) evade(actionNode);
      else go("counter");
    } else if (action === "window-knock") {
      if (actionNode.dataset.pixelPhase === "pause") {
        say("The black screen does not sound hollow.");
      } else if (actionNode.dataset.pixelPhase === "message" || actionNode.dataset.pixelPhase === "complete") {
        say("The message does not answer.");
      } else {
        say(session.marks.length > 2 ? "The glass is warmer now." : "The glass does not sound hollow.");
      }
      actionNode.classList.add("knocked");
    } else if (action === "enter-room") {
      go("room");
    } else if (action === "another-number") {
      session.counterLoops += 1;
      say("Your number remains zero.");
      render();
    } else if (action === "room-poke") {
      session.roomPokes += 1;
      render();
    } else if (action === "chairs") {
      go("chairs");
    } else if (action === "chair") {
      session.chairs.add(Number(actionNode.dataset.chair));
      say(chairWords[Number(actionNode.dataset.chair)]);
      render();
    } else if (action === "corridor") {
      go("corridor");
    } else if (action === "corridor-step") {
      session.corridorLoops += 1;
      render();
    } else if (action === "window") {
      go("window");
    } else if (action === "finish") {
      memory.completed += 1;
      writeMemory();
      go("end");
    } else if (action === "restart") {
      go("threshold");
    } else if (action === "back") {
      window.history.back();
    }
  });

  reset.addEventListener("click", function () {
    try { localStorage.removeItem(memoryKey); } catch (_) {}
    window.location.hash = "";
    window.location.reload();
  });

  window.addEventListener("hashchange", render);
  render();
})();
