let url = "http://192.168.68.106:5000";

if (window.location.hostname === "mathtrix") {
  // TODO change to server URL
  url = "https://example.com";
}

const socket = io(url);

const canvas = document.getElementById("canvas");
const w = canvas.getBoundingClientRect().width;
const h = w;

canvas.width = w;
canvas.height = h;

const scale = canvas.width / 100;
const ctx = canvas.getContext("2d");

const events = [
  "abstraction",
  "desolate-planet",
  "maximus",
  "rhythm-x",
  "segfault",
];

const images = events.reduce((obj, evt) => {
  let image = new Image(scale * 5, scale * 5);
  image.src = `favicons/${evt}.png`;
  obj[evt] = image;
  return obj;
}, {});

const insideSpan = document.getElementById("inside");
const totalSpan = document.getElementById("total");
const piSpan = document.getElementById("pi");

socket.on("test", console.log);

socket.emit("join", 50, 50, "segfault");

socket.on("update", (blobs) => {
  ctx.clearRect(0, 0, w, h);

  let numInCircle = 0;

  blobs.forEach((blob) => {
    if ((blob.x - 53) ** 2 + (blob.y - 53) ** 2 <= 2500) {
      numInCircle += 1;
    }

    ctx.drawImage(
      images[blob.evtName],
      blob.x * scale,
      blob.y * scale,
      scale * 6,
      scale * 6
    );
  });

  if (blobs.length > 0) {
    totalSpan.innerText = blobs.length.toString();
    insideSpan.innerText = numInCircle.toString();
    piSpan.innerText = (4 * numInCircle) / blobs.length;
  }
});

const rect = canvas.getBoundingClientRect();
const deltaX = rect.left;
const deltaY = rect.top;

const clamp = (value, start, end) => {
  if (value < start) {
    return start;
  } else if (value > end) {
    return end;
  } else {
    return value;
  }
};

const handler = (e) => {
  const x = (e.clientX - deltaX) / scale - 3;
  const y = (e.clientY - deltaY) / scale - 3;
  socket.emit("update:pos", clamp(x, 0, 94), clamp(y, 0, 94));
};

if (window.orientation !== undefined) {
  window.addEventListener("touchmove", handler);
} else {
  window.addEventListener("mousemove", handler);
}
