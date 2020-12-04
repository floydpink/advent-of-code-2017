const fs = require('fs');
const {Node, Graph} = require('../lib/graph');

const path = 'input.txt';

const UP = Symbol();
const DOWN = Symbol();
const RIGHT = Symbol();
const LEFT = Symbol();

const DIRECTION = {
  UP: UP,
  DOWN: DOWN,
  RIGHT: RIGHT,
  LEFT: LEFT,
  reverse: (direction) => {
    switch (direction) {
      case DIRECTION.UP:
        return DIRECTION.DOWN;
      case DIRECTION.LEFT:
        return DIRECTION.RIGHT;
      case DIRECTION.DOWN:
        return DIRECTION.UP;
      case DIRECTION.RIGHT:
        return DIRECTION.LEFT;
    }
  },
  turnLeft: (direction) => {
    switch (direction) {
      case DIRECTION.UP:
        return DIRECTION.LEFT;
      case DIRECTION.LEFT:
        return DIRECTION.DOWN;
      case DIRECTION.DOWN:
        return DIRECTION.RIGHT;
      case DIRECTION.RIGHT:
        return DIRECTION.UP;
    }
  },
  turnRight: (direction) => {
    switch (direction) {
      case DIRECTION.UP:
        return DIRECTION.RIGHT;
      case DIRECTION.RIGHT:
        return DIRECTION.DOWN;
      case DIRECTION.DOWN:
        return DIRECTION.LEFT;
      case DIRECTION.LEFT:
        return DIRECTION.UP;
    }
  }
};

const STATE = {
  CLEAN: '.',
  WEAKENED: 'W',
  INFECTED: '#',
  FLAGGED: 'F'
}

class GridNode extends Node {
  constructor(left, top, graph, content) {
    super(left, top, graph, content);
  }

  get isClean() {
    return this.content === STATE.CLEAN;
  }

  get isInfected() {
    return this.content === STATE.INFECTED;
  }

  getNeighborNode(key) {
    if (!grid.has(key)) {
      const [left, top] = key.split('|').map(c => parseInt(c, 10));
      const node = new GridNode(left, top, grid, '.');
      grid.add(node);
    }

    return grid.get(key);
  }

  get upNode() {
    return this.getNeighborNode(this.upNeighborKey);
  }

  get downNode() {
    return this.getNeighborNode(this.downNeighborKey);
  }

  get leftNode() {
    return this.getNeighborNode(this.leftNeighborKey);
  }

  get rightNode() {
    return this.getNeighborNode(this.rightNeighborKey);
  }

  getNextNode(direction) {
    switch (direction) {
      case DIRECTION.UP:
        return this.upNode;
      case DIRECTION.RIGHT:
        return this.rightNode;
      case DIRECTION.DOWN:
        return this.downNode;
      case DIRECTION.LEFT:
        return this.leftNode;
    }
  }
}

const input = fs.readFileSync(path)
  .toString()
  .split('\n')
  .filter(l => !!l)
  .map(s => s.split(''));

const initializeGrid = () => {
  const graph = new Graph();
  for (let t = 0; t < input.length; t++) {
    for (let l = 0; l < input[0].length; l++) {
      const node = new GridNode(l, t, graph, input[t][l]);
      graph.add(node);
    }
  }

  return graph;
}

let grid = initializeGrid();

// console.log(grid.nodes.length);
// console.log(grid.nodes.filter(n => n.isClean).length);
// console.log(grid.nodes.filter(n => n.isInfected).length);

const start = path === 'input.txt' ? 12 : 1;
let current = grid.get(GridNode.makeKey(start, start));
let direction = DIRECTION.UP;

let infectionBursts = 0;
const doBurst = () => {
  if (current.isClean) {
    direction = DIRECTION.turnLeft(direction);
    infectionBursts++
    current.content = STATE.INFECTED;
  } else {
    direction = DIRECTION.turnRight(direction);
    current.content = STATE.CLEAN;
  }
  current = current.getNextNode(direction);
}

for (let i = 0; i < 10000; i++) {
  doBurst();
}

const part01Answer = infectionBursts;
console.log(`part 01 answer: ${part01Answer}`);

grid = initializeGrid();
// grid.paint(r => console.log(r), (k, c) => {
//   return k === current.key ? `[${c}]` : ` ${c} `;
// });
// console.log('------------------')

current = grid.get(GridNode.makeKey(start, start));
direction = DIRECTION.UP;
infectionBursts = 0;
const doBurst02 = () => {
  switch (current.content) {
    case STATE.CLEAN:
      direction = DIRECTION.turnLeft(direction);
      current.content = STATE.WEAKENED;
      break;
    case STATE.WEAKENED:
      infectionBursts++;
      current.content = STATE.INFECTED;
      break;
    case STATE.INFECTED:
      direction = DIRECTION.turnRight(direction);
      current.content = STATE.FLAGGED;
      break;
    case STATE.FLAGGED:
      direction = DIRECTION.reverse(direction);
      current.content = STATE.CLEAN;
      break;
  }
  current = current.getNextNode(direction);
  // grid.paint(r => console.log(r), (k, c) => {
  //   return k === current.key ? `[${c}]` : ` ${c} `;
  // });
  // console.log('------------------')
}

for (let i = 0; i < 10000000; i++) {
  doBurst02();
}

const part02Answer = infectionBursts;
console.log(`part 02 answer: ${part02Answer}`);
