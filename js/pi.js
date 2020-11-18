let url = "http://192.168.68.106:5000";

if (window.location.hostname === "mathtrix.online") {
  url = "https://server.mathtrix.online";
}

let pastPi = [];
let blobs = {};

// All the different blobs they can choose
const events = [
  "abstraction",
  "desolate-planet",
  "maximus",
  "rhythm-x",
  "segfault",
];

const insideSpan = document.getElementById("inside");
const totalSpan = document.getElementById("total");
const cpiSpan = document.getElementById("cpi");
const apiSpan = document.getElementById("api");

let evt = events[Math.floor(Math.random() * events.length)];
document.getElementById(evt).classList.add("sel");

// Initiate socket
const socket = io(url);

socket.on("init-blobs", (initBlobs) => {
  Object.keys(initBlobs).map((id) => {
    blobs[id] = new EventBlob(initBlobs[id].evtName, initBlobs[id].direction);
  });
});

socket.on("join", (id, evtName, direction) => {
  blobs[id] = new EventBlob(evtName, direction);
});

socket.on("update:evt", (id, evtName) => {
  blobs[id].evtName = evtName;
});
socket.on("leave", (id) => {
  delete blobs[id];
});

setInterval(() => {
  ctx.clearRect(0, 0, w, h);

  let total = 0;
  let numInCircle = 0;

  Object.values(blobs).forEach((blob) => {
    blob.move();

    if ((blob.x - w / 2) ** 2 + (blob.y - h / 2) ** 2 <= (w * h) / 4) {
      numInCircle += 1;
    }
    total += 1;

    ctx.drawImage(
      images[blob.evtName],
      blob.x - blobWidth / 2,
      blob.y - blobWidth / 2,
      blobWidth,
      blobWidth
    );
  });

  if (total > 0) {
    totalSpan.innerText = total.toString();
    insideSpan.innerText = numInCircle.toString();
    const pi = Math.round((40000 * numInCircle) / total) / 10000;
    cpiSpan.innerText = pi;
    pastPi.unshift(pi);
    if (pastPi.length > 250) {
      pastPi.pop();
    }
    apiSpan.innerText = Math.round(1000 * avg(pastPi)) / 1000;
  }
}, 20);

// Setup canvas to draw
const canvas = document.getElementById("canvas");
const w = canvas.getBoundingClientRect().width;
const h = w;

canvas.width = w;
canvas.height = h;

canvas.parentElement.style.height = `${h}px`;

const blobWidth = (3 * canvas.width) / 50;
const ctx = canvas.getContext("2d");

// Change the event when click on the event
events.forEach((e) => {
  document.getElementById(e).addEventListener("click", () => {
    document.getElementById(evt).classList.remove("sel");
    document.getElementById(e).classList.add("sel");
    evt = e;
    socket.emit("update:evt", e);
  });
});

// Load all blob images
const images = events.reduce((obj, evt) => {
  let image = new Image(blobWidth, blobWidth);
  image.src = `favicons/${evt}.png`;
  obj[evt] = image;
  return obj;
}, {});

document.getElementById("launch").addEventListener("click", () => {
  socket.emit("join", evt, getDirection());
  document.getElementById("launch").remove();
  document.getElementById("controller-wrapper").remove();
});

const velocity = w / 100;

class EventBlob {
  constructor(evtName, direction) {
    this.evtName = evtName;
    this.vx = velocity * Math.cos(direction);
    this.vy = velocity * Math.sin(direction);
    this.x = w * Math.random();
    this.y = h * Math.random();
  }

  move() {
    this.x += this.vx;
    if (this.x < 0 || this.x > h) {
      this.vx *= -1;
    }

    this.y += this.vy;
    if (this.y < 0 || this.y > h) {
      this.vy *= -1;
    }
  }
}

const avg = (l) => {
  return l.reduce((avg, el) => avg + el, 0) / l.length;
};
