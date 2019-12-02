const fs = require('fs');

const input = 'input.txt';

const trimFunc = i => i.trim();
const inputLines = fs.readFileSync(input)
  .toString()
  .split('\n')
  .map(trimFunc);

class Vector {
  constructor(x, y, z, type) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;
  }

  toString() {
    return `${this.type}<${this.x},${this.y},${this.z}>`
  }
}

class Position extends Vector {
  constructor(x, y, z) {
    super(x, y, z, 'P');
  }
}

class Velocity extends Vector {
  constructor(x, y, z) {
    super(x, y, z, 'V');
  }
}

class Acceleration extends Vector {
  constructor(x, y, z) {
    super(x, y, z, 'A');
  }
}

class Particle {
  constructor(id, position, velocity, acceleration) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;

    this.hasCollided = false;
  }

  toString() {
    return `${this.position}|${this.velocity}|${this.acceleration}|${this.distanceFromOrigin}${this.hasCollided ? ' ' : '*'}|`;
  }

  tick() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.z += this.acceleration.z;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  get distanceFromOrigin() {
    return Math.abs(0 - this.position.x) +
      Math.abs(0 - this.position.y) +
      Math.abs(0 - this.position.z)
  }

  get key() {
    return `${this.position}`;
  }
}

let id = 0;
const particles = inputLines.map(i => {
  const parts = i.split('=');

  const positions = parts[1].substring(1, parts[1].length - 4).split(',').map(trimFunc).map(Number);
  const position = new Position(positions[0], positions[1], positions[2]);

  const velocities = parts[2].substring(1, parts[2].length - 4).split(',').map(trimFunc).map(Number);
  const velocity = new Velocity(velocities[0], velocities[1], velocities[2]);

  const accelerations = parts[3].substring(1, parts[3].length - 1).split(',').map(trimFunc).map(Number);
  const acceleration = new Acceleration(accelerations[0], accelerations[1], accelerations[2]);

  return new Particle(id++, position, velocity, acceleration);
});

let ticks = 0;
let minDistance = Number.POSITIVE_INFINITY;
let particleMap = new Map();
while (ticks < 500) {
  particleMap = new Map();
  particles.forEach(p => {
    // console.log(`${p}`);
    p.tick();
    minDistance = Math.min.apply(null, particles.map(p => p.distanceFromOrigin));

    // part 02 - set up particles for marking collisions
    if (!p.hasCollided) {
      if (!particleMap.has(p.key)) {
        particleMap.set(p.key, new Set());
      }
      particleMap.get(p.key).add(p);
    }
  });
  ticks++;
  // console.log(`minDistance: ${minDistance}`);
  // console.log(`ticks: ${ticks}, minDistance: ${minDistance}, !movingAway: ${particles.filter(p => !p.isMovingAway).length}`);

  // part 02 - mark collisions
  [...particleMap.values()].filter(s => s.size > 1).forEach(s => [...s.values()].forEach(p => p.hasCollided = true));
}

console.log(`part 01 answer: ${particles.find(p => p.distanceFromOrigin === minDistance).id}`);

console.log(`part 02 answer: ${particles.filter(p => !p.hasCollided).length}`);

// 5.06 seconds!