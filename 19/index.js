const fs = require('fs');

const input = 'input.txt';

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);

const map = fs.readFileSync(input)
  .toString()
  .split('\n')
  .map(i => i.split(''));

let grid = undefined;

const UP = Symbol();
const DOWN = Symbol();
const RIGHT = Symbol();
const LEFT = Symbol();

const DIRECTION = {
  UP: UP,
  DOWN: DOWN,
  RIGHT: RIGHT,
  LEFT: LEFT
};

const TYPE = {
  UP_DOWN: '|',
  LEFT_RIGHT: '-',
  CORNER: '+'
};

const TYPES = {
  ['|']: TYPE.UP_DOWN,
  ['-']: TYPE.LEFT_RIGHT,
  ['+']: TYPE.CORNER,
};

class Position {
  constructor(top, left) {
    this.top = top;
    this.left = left;
  }

  get key() {
    return Position.makeKey(this.top, this.left);
  }

  static makeKey(top, left) {
    return `${top}|${left}`;
  }
}

class Node {
  constructor(position, type) {
    this.position = position;
    this.type = type;
  }

  get topNeighbor() {
    return grid.map.get(Position.makeKey(this.position.top - 1, this.position.left));
  }

  get rightNeighbor() {
    return grid.map.get(Position.makeKey(this.position.top, this.position.left + 1));
  }

  get bottomNeighbor() {
    return grid.map.get(Position.makeKey(this.position.top + 1, this.position.left));
  }

  get leftNeighbor() {
    return grid.map.get(Position.makeKey(this.position.top, this.position.left - 1));
  }
}

class Grid {
  constructor(map) {
    const height = map.length;
    const width = Math.max(...map.map(l => l.length));

    this.height = height;
    this.width = width;

    this.map = new Map();

    this.currentNode = null;
    this.direction = DIRECTION.DOWN;

    this.atFinalNode = false;

    this.stepsCount = 0;

    this.initialize(map);
  }

  initialize(map) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const type = map[y][x];

        if (x < map[y].length && type !== ' ') {
          const position = new Position(y, x);
          const node = new Node(position, type);
          this.map.set(position.key, node);

          if (y === 0 && type === TYPE.UP_DOWN) {
            this.currentNode = node;
          }
        }
      }
    }
  }

  move() {
    switch (this.direction) {
      case DIRECTION.DOWN:
        this.currentNode = this.currentNode.bottomNeighbor;
        if (this.currentNode.type === TYPE.CORNER) {
          this.direction = this.currentNode.rightNeighbor != null ? DIRECTION.RIGHT : DIRECTION.LEFT;
        } else {
          this.atFinalNode = !this.currentNode.rightNeighbor && !this.currentNode.bottomNeighbor && !this.currentNode.leftNeighbor;
        }
        break;
      case DIRECTION.UP:
        this.currentNode = this.currentNode.topNeighbor;
        if (this.currentNode.type === TYPE.CORNER) {
          this.direction = this.currentNode.rightNeighbor != null ? DIRECTION.RIGHT : DIRECTION.LEFT;
        } else {
          this.atFinalNode = !this.currentNode.rightNeighbor && !this.currentNode.topNeighbor && !this.currentNode.leftNeighbor;
        }
        break;
      case DIRECTION.LEFT:
        this.currentNode = this.currentNode.leftNeighbor;
        if (this.currentNode.type === TYPE.CORNER) {
          this.direction = this.currentNode.topNeighbor != null ? DIRECTION.UP : DIRECTION.DOWN;
        } else {
          this.atFinalNode = !this.currentNode.topNeighbor && !this.currentNode.leftNeighbor && !this.currentNode.bottomNeighbor;
        }
        break;
      case DIRECTION.RIGHT:
        this.currentNode = this.currentNode.rightNeighbor;
        if (this.currentNode.type === TYPE.CORNER) {
          this.direction = this.currentNode.topNeighbor != null ? DIRECTION.UP : DIRECTION.DOWN;
        } else {
          this.atFinalNode = !this.currentNode.topNeighbor && !this.currentNode.rightNeighbor && !this.currentNode.bottomNeighbor;
        }
        break;
    }
    this.stepsCount++;
  }
}

grid = new Grid(map);

let path = '';
while (!grid.atFinalNode) {
  grid.move();
  path += grid.currentNode.type.replace('|', '').replace('+', '').replace('-', '');
}

console.log(`part 01 answer: ${path}`);
console.log(`part 02 answer: ${grid.stepsCount + 1}`);