const fs = require('fs');

const inputPath = 'input.txt';

const paint = false;
const debug = (...message) => {
  if (false) {
    console.log(...message)
  }
};


class FirewallLayer {
  constructor(depth, range) {
    this.depth = depth;
    this.range = range;
    this.currentLevel = 0;
    this.direction = +1;
  }

  toString() {
    return ` [${this.depth}:${this.range}, l:${this.currentLevel}${(this.canDetectPacket ? '*' : ' ')}]`;
  }

  move() {
    this.currentLevel = this.currentLevel + (this.direction);
    if (this.currentLevel === 0) {
      this.direction = 1;
    } else if (this.currentLevel === this.range - 1) {
      this.direction = -1;
    }
  }

  get canDetectPacket() {
    return this.currentLevel === 0;
  }

  get detectionSeverity() {
    return this.depth * this.range;
  }

  canDetectPacketWithStart(start) {
    const time = start + this.depth;
    const offset = time % ((this.range - 1) * 2);

    return (offset > this.range - 1 ? (this.range - 1) * 2 - offset : offset) === 0;
  }
}

class Firewall {
  constructor() {
    this.layers = new Map();
    this.finalLayerDepth = -1;
    this.maxLevel = -1;
    this.timeElapsed = -1;
  }

  createLayer(depth, range) {
    this.layers.set(depth, new FirewallLayer(depth, range));
    this.finalLayerDepth = depth;
    this.maxLevel = Math.max(this.maxLevel, range);
  }

  getLayer(depth) {
    if (this.layers.has(depth)) {
      return this.layers.get(depth);
    }

    return null;
  }

  get layersArray() {
    return [...this.layers.values()];
  }

  moveScanners(packetDepth) {
    if (packetDepth != null) {
      debug(`packet is at: ${packetDepth}`);
    }
    this.paint('B', packetDepth);
    this.timeElapsed++;
    for (let l of this.layers.values()) {
      l.move();
    }
    this.paint('A');
  }

  paint(state, packetDepth) {
    if (!paint) {
      return;
    }
    let line = '';
    for (let i = 0; i <= this.finalLayerDepth; i++) {
      const packIsHere = i === packetDepth;
      const l = this.getLayer(i);
      line += `${(!!l ? `${l}` : ` [${i}:]`)}${packIsHere ? '# ' : '  '}`;
    }
    debug(`${state} move (${this.timeElapsed} ps): ${line}\n`);
  }

}

const initializeFirewall = function () {
  let firewall = new Firewall();

  let trimFunc = i => i.trim();
  let parseIntFunc = i => parseInt(i, 10);
  fs.readFileSync(inputPath)
    .toString()
    .split('\n')
    .map(trimFunc)
    .map(line => {
      const [depth, range] = line.split(':').map(trimFunc).map(parseIntFunc);
      firewall.createLayer(depth, range);
    });
  return firewall;
};

// part 01
let firewall = initializeFirewall();
let timeElapsed = -1;
let currentLayerDepth = timeElapsed;
let tripSeverity = 0;
while (currentLayerDepth < firewall.finalLayerDepth) {
  timeElapsed++;
  currentLayerDepth = timeElapsed;
  const currentLayer = firewall.getLayer(currentLayerDepth);
  if (currentLayer && currentLayer.canDetectPacket) {
    tripSeverity += currentLayer.detectionSeverity;
  }

  firewall.moveScanners(currentLayerDepth > -1 ? currentLayerDepth : null);
}

console.log(`part 01 answer: ${tripSeverity}\n\n`);

// part 02

// this naive, brute force did not work
/*let delay = 0;
while (true) {
  firewall = initializeFirewall();
  let timeElapsed = -1;
  let currentLayerDepth = timeElapsed >= delay ? (timeElapsed - delay) : -1;
  let detected = false;
  while (currentLayerDepth < firewall.finalLayerDepth && !detected) {
    timeElapsed++;
    if (timeElapsed >= delay) {
      currentLayerDepth = timeElapsed - delay;
      const currentLayer = firewall.getLayer(currentLayerDepth);
      if (currentLayer && currentLayer.canDetectPacket) {
        detected = true;
        debug(`detected at depth : ${currentLayerDepth}\n`);
      }
    }

    if (!detected) {
      let depth = currentLayerDepth > -1 ? currentLayerDepth : null;
      firewall.moveScanners(depth);
    }
  }

  if (!detected) {
    break;
  }

  delay++;
  debug(`delay bumped to: ${delay}\n\n`);
}*/


// inspired from the solution at
//    https://www.reddit.com/r/adventofcode/comments/7jgyrt/2017_day_13_solutions/dr6bxce/
let i = 0;
firewall = initializeFirewall();

while ((firewall.layersArray.some(l => l.canDetectPacketWithStart(i)))) {
  i++;
  firewall = initializeFirewall();
  if (i % 10000 === 0) {
    console.log(`delay is now: ${i}`);
  }
}

console.log(`part 02 answer: ${i}`); // ran for 4 mins 37 secs :(
