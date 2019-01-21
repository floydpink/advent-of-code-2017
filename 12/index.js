const fs = require('fs');

const inputPath = 'input.txt';

class Program {
  constructor(id) {
    this.id = id;
    this.deps = [];
  }

  toString() {
    return ` ${this.id}: (${this.deps.map(d => d.id)}) `;
  }
}

class Village {
  constructor() {
    this.programMap = new Map();
  }

  getOrCreateProgram(id, deps = null) {
    if (!this.programMap.has(id)) {
      this.programMap.set(id, new Program(id));
    }

    const pgm = this.programMap.get(id);

    if (deps != null) {
      for (let dep of deps) {
        pgm.deps.push(this.getOrCreateProgram(dep));
      }
    }

    return pgm;
  }
}

let village = new Village();

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(line => {
    let [pgmIdStr, depsStr] = line.split('<->').map(trimFunc);
    const pgmId = parseIntFunc(pgmIdStr);
    const deps = depsStr.split(',').map(trimFunc).map(parseIntFunc);
    village.getOrCreateProgram(pgmId, deps);
  });

const traverseProgramGroup = function (program, seen) {
  const queue = [program];

  while (queue.length > 0) {
    let current = queue.shift();
    seen.add(current);
    for (let d of current.deps) {
      if (!seen.has(d)) {
        queue.push(d);
      }
    }
  }
};

const program0 = village.getOrCreateProgram(0);
const part01Seen = new Set();
traverseProgramGroup(program0, part01Seen);
console.log(`part 01 answer: ${part01Seen.size}`);

let groupsCount = 0;
const part02Seen = new Set();
for (let pgm of village.programMap.values()) {
  if (!part02Seen.has(pgm)) {
    traverseProgramGroup(pgm, part02Seen);
    groupsCount++;
  }
}
console.log(`part 02 answer: ${groupsCount}`);