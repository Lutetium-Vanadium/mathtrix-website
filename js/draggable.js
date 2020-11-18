const controller = document.getElementById("controller");

let wrapperRect = undefined;

controller.addEventListener("dragstart", (e) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 50;

  wrapperRect = document
    .getElementById("controller-wrapper")
    .getBoundingClientRect();

  // Requires this because otherwise it shows document
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 50, 50);
  e.dataTransfer.setDragImage(canvas, 0, 0);
  e.dataTransfer.effectAllowed = "move";
});

controller.addEventListener("touchstart", () => {
  wrapperRect = document
    .getElementById("controller-wrapper")
    .getBoundingClientRect();
});

const moveController = (clientX, clientY) => {
  const radius = (3 * window.innerHeight) / 100;

  const radiusDelta = wrapperRect.width / 2 - radius;

  const centerX = clientX - wrapperRect.left - wrapperRect.width / 2;
  const centerY = clientY - wrapperRect.top - wrapperRect.height / 2;

  const ratio = clamp(
    Math.sqrt(centerX ** 2 + centerY ** 2) / radius,
    1,
    Infinity
  );

  controller.style.left = `${centerX / ratio + radiusDelta}px`;
  controller.style.top = `${centerY / ratio + radiusDelta}px`;
};

document.ondragover = (e) => {
  if (wrapperRect) {
    moveController(e.clientX, e.clientY);
  }
};

controller.addEventListener("touchmove", (e) => {
  if (wrapperRect && e.touches.length > 0) {
    moveController(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
    e.stopPropagation();
  }
});

controller.addEventListener("touchend", () => {
  wrapperRect = undefined;
});

controller.addEventListener("dragend", () => {
  wrapperRect = undefined;
});

const getDirection = () => {
  const x = controller.offsetLeft - controller.offsetWidth / 2;
  const y = -controller.offsetTop + controller.offsetHeight / 2;
  console.log({ x, y });

  return (
    Math.PI -
    (Math.PI / 2) * (1 + Math.sign(x)) * (1 - Math.sign(y ** 2)) -
    (Math.PI / 4) * (2 + Math.sign(x)) * Math.sign(y) -
    Math.sign(x * y) *
      Math.atan((Math.abs(x) - Math.abs(y)) / Math.abs(x) + Math.abs(y))
  );
};

// Register handlers to move blob
const clamp = (value, start, end) => {
  if (value < start) {
    return start;
  } else if (value > end) {
    return end;
  } else {
    return value;
  }
};

if (window.innerWidth < 750) {
  const launch = document.getElementById("launch");
  launch.parentElement.parentElement.appendChild(launch);
}
