const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: window.innerWidth / 3,
  y: window.innerHeight / 3,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

const gravity = 1;
const friction = 0.9;

/**-------------------------------------------------------------- */

/**
 *  Utility Functions
 */

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(xDist ** 2 + yDist ** 2);
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

/**-------------------------------------------------------------------- */

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

class Particle {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: dx,
      y: dy,
    };
    this.radius = radius;
    this.color = color;
    this.mass = radius;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.lineWidth = 2;
    c.closePath();
  }

  update(particles) {
    if (this.x > innerWidth - this.radius || this.x < 0 + this.radius) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y > innerHeight - this.radius || this.y < 0 + this.radius) {
      this.velocity.y = -this.velocity.y;
    }
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;

      if (
        getDistance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <=
        0
      ) {
        console.log("collided");
        resolveCollision(this, particles[i]);
      }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

let particles;

function init() {
  particles = [];

  const maxAttempts = 1000; // Maximum attempts to find non-overlapping positions
  const radius = 15;
  const maxParticles = 100; // Maximum particles you want to add

  for (let i = 0; i < maxParticles; i++) {
    if (particles.length >= maxParticles) {
      break; // Stop adding particles if maxParticles is reached
    }

    let x, y, dx, dy, color;

    let attempts = 0;
    let overlapping = true;

    while (overlapping && attempts < maxAttempts) {
      x = Math.random() * (window.innerWidth - radius * 2) + radius;
      y = Math.random() * (window.innerHeight - radius * 2) + radius;
      dx = (Math.random() - 0.5) * 15;
      dy = (Math.random() - 0.5) * 5;
      color = getRandomColor();

      overlapping = false;

      for (let j = 0; j < particles.length; j++) {
        if (
          getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          overlapping = true;
          break;
        }
      }

      attempts++;
    }

    if (!overlapping) {
      particles.push(new Particle(x, y, dx, dy, radius, color));
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => particle.update(particles));
}

init();
animate();
