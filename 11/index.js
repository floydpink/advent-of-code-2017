const fs = require('fs');

const inputPath = `input${process.argv[2] || ''}.txt`;

// https://stackoverflow.com/questions/5084801/manhattan-distance-between-tiles-in-a-hexagonal-grid/5085274#5085274
// http://althenia.net/svn/stackoverflow/hexgrid.png?usemime=1&rev=3
// https://stackoverflow.com/questions/5084801/manhattan-distance-between-tiles-in-a-hexagonal-grid#comment13632041_5085274
const DELTA = {
  'n'  : [0, -1],
  'ne' : [1, 0],
  'se' : [1, 1],
  's'  : [0, 1],
  'sw' : [-1, 0],
  'nw' : [-1, -1]
};

let grid;

let nodeId = 0;

class Node {
  constructor(x, y) {
    this.id = nodeId++;
    this.x = x;
    this.y = y;
    this.distance = 0;
  }

  get key() {
    return Node.key(this.x, this.y);
  }

  static key(x, y) {
    return `${x}|${y}`;
  }

  manhattanDistanceTo(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    if ((dx < 0 && dy > 0) || (dx > 0 && dy < 0)) {
      return Math.abs(dx) + Math.abs(dy);
    }
    return Math.max(Math.abs(dx), Math.abs(dy));
  }
}

class Grid {
  constructor() {
    this.nodeMap = new Map();
  }

  getOrCreateNode(x, y, origin = null) {
    const key = Node.key(x, y);
    if (!this.nodeMap.has(key)) {
      const newNode = new Node(x, y);
      if (origin) {
        newNode.distance = newNode.manhattanDistanceTo(origin);
      }
      this.nodeMap.set(key, newNode);
    }

    return this.nodeMap.get(key);
  }

}

grid = new Grid();
const origin = grid.getOrCreateNode(0, 0, 0);

let previous = origin;

const trimFunc = i => i.trim();
fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(trimFunc)
  .forEach(n => {
    let [dx, dy] = DELTA[n];
    previous = grid.getOrCreateNode(previous.x + dx, previous.y + dy, origin);
  });

const part01Answer = previous.manhattanDistanceTo(origin);
console.log(`part 01 answer: ${part01Answer}`);

const part02Answer = Math.max.apply(null, [...grid.nodeMap.values()].map(n => n.distance));
console.log(`part 02 answer: ${part02Answer}`);
