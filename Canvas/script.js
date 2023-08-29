const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// ctx.fillStyle = "darkblue";
// ctx.fillRect(45, 45, 100, 100);
// ctx.fillStyle = "red";
// ctx.fillRect(245, 45, 100, 100);
// ctx.fillStyle = "green";
// ctx.fillRect(45, 245, 100, 100);
// ctx.fillStyle = "yellow";
// ctx.fillRect(245, 245, 100, 100);

// Line

// ctx.beginPath();
// ctx.moveTo(160, 800);
// ctx.lineTo(800, 30);
// // ctx.lineTo(800, 600);
// // ctx.lineTo(1800, 200);
// ctx.strokeStyle = "red";
// ctx.stroke();

// Arc
// ctx.beginPath();
// ctx.arc(500, 500, 100, 0, Math.PI * 2, false);
// ctx.strokeStyle = "grey";
// ctx.stroke();

// for (let i = 0; i < 100; i++) {
//   let x = Math.random() * window.innerWidth;
//   let y = Math.random() * window.innerHeight;
//   ctx.beginPath();
//   ctx.arc(x, y, 100, 0, Math.PI * 2, false);
//   ctx.strokeStyle = `${getRandomColor()}`;
//   ctx.stroke();
// }

// ??
// let x = window.innerWidth * Math.random();
// let y = window.innerHeight / 2;
// let dx = 4;
// let dy = 4;
// let radius = 30;
// let color = `${getRandomColor()}`;
// function animate() {
//   requestAnimationFrame(animate);
//   ctx.clearRect(0, 0, innerWidth, innerHeight);
//   circle.draw();
//   ctx.beginPath();
//   ctx.arc(x, y, radius, 0, Math.PI * 2, false);
//   ctx.lineWidth = 5;
//   ctx.strokeStyle = color;
//   ctx.stroke();

//   if (x > innerWidth - radius || x < 0 + radius) {
//     dx = -dx;
//   }

//   if (y > innerHeight - radius || y < 0 + radius) {
//     dy = -dy;
//   }

//   x += dx;
//   y += dy;
// }

// animate();

// Adding Event Listener

let mouse = {
  x: undefined,
  y: undefined,
};
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = getRandomColor();

    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      // ctx.strokeStyle = this.color;
      // ctx.lineWidth = 4;
      ctx.fill();
      ctx.fillStyle = this.color;
      // ctx.stroke();
    };

    this.update = function () {
      if (this.x > innerWidth - this.radius || this.x < 0 + radius) {
        this.dx = -this.dx;
      }

      if (this.y > innerHeight - this.radius || this.y < 0 + radius) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      // Interactivity
      if (
        mouse.x - this.x < 150 &&
        mouse.x - this.x > -150 &&
        mouse.y - this.y < 150 &&
        mouse.y - this.y > -150
      ) {
        if (this.radius < 50) this.radius += 1;
      } else {
        if (this.radius > this.minRadius) this.radius -= 1;
      }
      this.draw();
    };
  }
}

// let x = window.innerWidth * Math.random();
// let y = window.innerHeight / 2;
// let dx = 4;
// let dy = 4;
// let radius = 30;

let circleArr = [];

function init() {
  circleArr = [];
  let circle = new Circle(200, 200, 1, 1, 30);

  for (let i = 0; i < 1800; i++) {
    const radius = Math.random() * 3 + 1;
    circleArr.push(
      new Circle(
        radius + Math.random() * (window.innerWidth - 2 * radius), // Random x position within canvas width
        radius + Math.random() * (window.innerHeight - 2 * radius),
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        radius
      )
    );
  }
}

init();

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArr.length; i++) {
    circleArr[i].update();
  }
}

animate();
