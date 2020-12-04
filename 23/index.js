const fs = require('fs');

const inputPath = 'input.txt';

const debug = (...args) => {
  if (false) {
    console.log(...args);
  }
};

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);

const rawInstructions = fs.readFileSync(inputPath)
  .toString()
  .split('\n');


let mulInstructionCounter = 0;

let insId = 1;

class Instruction {
  constructor(pgmId, type, a, b = null) {
    this.id = insId++;
    this.pgmId = pgmId;
    this.isPart2 = pgmId > 0;
    this.type = type;
    this.a = a;
    this.b = b;
  }

  toString() {
    return `${this.type} ${this.a} ${this.b}`;
  }

  run(registers, instrNumber) {
    const programId = this.pgmId - 1;
    debug(`[${programId}] running instr #${this.id} - ${this.type} ${this.a} ${this.b}...`);

    debug(`registers (B): ${[...registers.entries()]}`);

    debug(`instruction #${instrNumber}: ${this}`);

    let next = 1;
    const b = this.b != null
      ? (registers.has(this.b) ? registers.get(this.b) : parseIntFunc(this.b))
      : null;
    switch (this.type) {
      case 'set':
        registers.set(this.a, b);
        break;
      case 'sub':
        registers.set(this.a, registers.get(this.a) - b);
        break;
      case 'mul':
        mulInstructionCounter++;
        registers.set(this.a, registers.get(this.a) * b);
        break;
      case 'jnz':
        const valB = registers.has(this.a) ? registers.get(this.a) : parseIntFunc(this.a);
        if (valB !== 0) {
          next = b;
        }
        break;
    }

    debug(`registers (A): ${[...registers.entries()]}`);
    debug(`next instruction offset: ${next}\n`);

    return next;
  }
}

class Program {
  constructor(id, rawInstructions) {
    this.id = id;
    this.pgmId = id - 1;
    this.isPart2 = id > 1;

    this.registers = new Map();
    this.instructions = [];

    this.waiting = false;

    this.next = 0;

    this.incomplete = false;

    insId = 1;
    this.parseInstructions(rawInstructions);
  }

  parseInstructions(rawInstructions) {
    for (let instr of rawInstructions) {
      const [type, a, b] = instr.split(' ').map(trimFunc);
      if (!Number.isInteger(parseIntFunc(a)) && !this.registers.has(a)) {
        if (this.isPart2 && a === 'a') {
          this.registers.set(a, 1);
        } else {
          this.registers.set(a, 0);
        }
      }
      this.instructions.push(new Instruction(this.id, type, a, b));
    }

    /*
            debug(`[${this.id}] > registers:`);
            debug(this.instructions);
            debug('');
    */

    this.print();
  }

  print() {
    // debug(`[${this.id}] > registers:`);
    // debug([...this.registers.entries()]);
    // debug('');
  }

  runProgram(other = null) {
    if (other && this.waiting && other.waiting) { // deadlock
      console.log(`\nREALLY!?\n`);
      return;
    }

    debug(`running program id: ${this.id}`);

    while (this.next >= 0 && this.next < this.instructions.length) {
      let prevInstr = this.instructions[this.next];
      let next = prevInstr.run(this.registers, this.next);
      this.next += next;
      this.waiting = next === 0;
      this.print();
    }

    if (!this.incomplete) {
      debug(`${this.pgmId} completed successfully...\n`);
    }
  }
}

// part 01
const program0 = new Program(1, rawInstructions);
program0.runProgram();

console.log(`part 01 answer: ${mulInstructionCounter}`);

// THIS DID NOT WORK!
// // part 02
// const program1 = new Program(2, rawInstructions);
// program1.runProgram();
//
// console.log(`part 02 answer: ${program1}`);
/*
  BORROWED THIS FROM HERE:
    https://www.reddit.com/r/adventofcode/comments/7lms6p/2017_day_23_solutions/drngit2/?utm_source=reddit&utm_medium=web2x&context=3
    # Begin Python #
    h = 0
    for x in range(105700,122700 + 1,17):
      for i in range(2,x):
        if x % i == 0:
          h += 1
          break
    print(h)
    # End Python #
 */
let h = 0;
for (let x = 106700; x <= (106700 + 17000); x += 17) {
  for (let i = 2; i < x; i++) {
    if (x % i === 0) {
      h += 1;
      break;
    }
  }
}
console.log(`part 02 answer: ${h}`);
