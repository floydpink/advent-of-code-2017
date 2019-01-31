const fs = require('fs');

const inputPath = 'input.txt';

const programs = (inputPath === 'input.txt' ? 'abcdefghijklmnop' : 'abcde').split('');

const debug = (...args) => {
  if (false) {
    console.log(...args);
  }
};

const MOVES = {
  SPIN     : 's',
  EXCHANGE : 'x',
  PARTNER  : 'p'
};

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);
const moves = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(trimFunc);

class DanceMove {
  constructor(type, left, right = null) {
    this.type = type;
    this.left = left;
    this.right = right;
  }

  apply(programs) {
    if (this.type === MOVES.SPIN) {
      for (let i = 0; i < this.left; i++) {
        programs = programs.slice(-1).concat(programs.slice(0, -1));
      }
    } else if (this.type === MOVES.EXCHANGE) {
      const temp = programs[this.left];
      programs[this.left] = programs[this.right];
      programs[this.right] = temp;
    } else if (this.type === MOVES.PARTNER) {
      const left = programs.findIndex(p => p === this.left);
      const right = programs.findIndex(p => p === this.right);
      const temp = programs[left];
      programs[left] = programs[right];
      programs[right] = temp;
    }

    return programs;
  }
}

const danceMoves = [];
for (let moveStr of moves) {
  const move = moveStr[0];
  moveStr = moveStr.substring(1);

  if (move === MOVES.SPIN) {
    danceMoves.push(new DanceMove(MOVES.SPIN, parseIntFunc(moveStr)));
  } else if (move === MOVES.EXCHANGE) {
    const [left, right] = moveStr.split('/').map(parseIntFunc);
    danceMoves.push(new DanceMove(MOVES.EXCHANGE, left, right));
  } else if (move === MOVES.PARTNER) {
    const [left, right] = moveStr.split('/');
    danceMoves.push(new DanceMove(MOVES.PARTNER, left, right));
  }
}

// debug(danceMoves.length);

// part 01
let part01List = programs.slice();
for (let move of danceMoves) {
  part01List = move.apply(part01List);
}

console.log(`part 01 answer: ${part01List.join('')}`);

// part 02
const endStates = new Map();
const endStatesArray = [];
let part02List = programs.slice();
for (let t = 1; t <= 121; t++) {
  for (let move of danceMoves) {
    part02List = move.apply(part02List);
  }

  const endState = part02List.join('');

  if (!endStates.has(endState)) {
    endStates.set(endState, []);
    endStatesArray.push(endState);
  } else {
    debug(`found repeating endStates after ${t} dances: clashes with ${endStates.get(endState)[0]}`);
  }
  endStates.get(endState).push(t);
}

let c = 0;
for (let clashes of endStates.entries()) {
  debug(`clash at ${clashes[1].join(', ')} are all ${clashes[0]} [${endStatesArray[c++]}]`);
}

console.log(`part 02 answer: ${[...endStates.keys()][(1000000000 % 120) - 1]}`);
