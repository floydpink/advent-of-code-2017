const fs = require('fs');

const inputPath = 'input.txt'
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n');

class Operation {
  constructor(write, move, next) {
    this.write = write;
    this.move = move;
    this.next = next;
  }
}

class State {
  constructor(name) {
    this.name = name;
    this.operations = new Map();
  }
}

const states = new Map();
const getState = (name) => {
  if (!states.has(name)) {
    states.set(name, new State(name));
  }
  return states.get(name);
}

let diagnosticAfter = 0;
let startState;
for (let i = 0; i < input.length; i++) {
  if (i === 0) {
    const start = input[i].replace('Begin in state ', '').substr(0, 1);
    startState = getState(start);
  } else if (i === 1) {
    diagnosticAfter = Number(input[i].replace('Perform a diagnostic checksum after ', '').replace(' steps.', ''));
  } else if (input[i].startsWith('In state ')) {
    const name = input[i].replace('In state ', '').substr(0, 1);
    const state = states.get(name);
    for (let j = 0; j < 2; j++) {
      const zeroOrOne = Number(input[i + j * 4 + 1].replace('  If the current value is ', '').substr(0, 1));
      const write = Number(input[i + j * 4 + 2].replace('    - Write the value ', '').substr(0, 1));
      const move = input[i + j * 4 + 3].replace('    - Move one slot to the ', '').startsWith('right') ? 1 : -1;
      const next = input[i + j * 4 + 4].replace('    - Continue with state ', '').substr(0, 1);
      const nextState = getState(next);
      state.operations.set(zeroOrOne, new Operation(write, move, nextState));
    }
  }
}

// console.log(states);

const tape = new Map();
const getTapePosition = (n) => {
  if (!tape.has(n)) {
    tape.set(n, 0);
  }
  return tape.get(n);
};

let steps = 0;
let current = 0;
let state = startState;
while (steps < diagnosticAfter) {
  const value = getTapePosition(current);
  const operation = state.operations.get(value);
  tape.set(current, operation.write);
  current += operation.move;
  state = operation.next;
  steps++;
}

console.log(`part 01 answer: ${[...tape.values()].filter(n => n === 1).length}`);
