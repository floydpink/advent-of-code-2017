const fs = require('fs');

const inputPath = 'input.txt';

let programId = 0;

class Program {
  constructor(name) {
    this.id = programId++;
    this.name = name;
    this.weight = 0;
    this.deps = [];
    this.parent = null;
  }

  get effectiveWeight() {
    return this.weight + this.deps.reduce((p, c) => p + c.effectiveWeight, 0);
  }

  get isBalanced() {
    if (this.deps.length === 0) {
      return true;
    }
    const dep1Weight = this.deps[0].effectiveWeight;
    return this.deps.every(d => d.effectiveWeight === dep1Weight);
  }
}

class Tower {
  constructor() {
    this.programMap = new Map();
  }

  getOrCreatePgm(name, weight = -1) {
    if (!this.programMap.has(name)) {
      this.programMap.set(name, new Program(name));
    }
    const pgm = this.programMap.get(name);
    if (weight !== -1) {
      pgm.weight = weight;
    }
    return pgm;
  }

  addProgram(name, weight, deps) {
    const pgm = this.getOrCreatePgm(name, weight);
    for (let d of deps) {
      const dep = this.getOrCreatePgm(d);
      pgm.deps.push(dep);
      dep.parent = pgm;
    }
  }
}

let tower = new Tower();

let trimFunc = i => !!i ? i.trim() : i;
let parseIntFunc = i => parseInt(i, 10);
fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc)
  .forEach(line => {
    let [pgmStr, depsStr] = line.split('->').map(trimFunc);
    let [name, weightStr] = pgmStr.split(' ');
    let weight = parseIntFunc(weightStr.substring(1, weightStr.length - 1));
    let deps = !!depsStr ? depsStr.split(',').map(trimFunc) : [];
    tower.addProgram(name, weight, deps);
  });

const bottomProgram = Array.from(tower.programMap.values()).find(p => p.parent === null);

// part 01
const part01Answer = bottomProgram.name;
console.log(`part 01 answer: ${part01Answer}`);

// part 02
let current = bottomProgram;
while (true) {
  let unbalancedDeps = current.deps.filter(c => !c.isBalanced);
  if (unbalancedDeps.length > 1) throw new Error('something\'s wrong!');
  const next = unbalancedDeps[0];
  if (!next) {
    // console.log(current.name);
    break
  } else {
    current = next;
  }
}

const firstDep = current.deps[0];
const otherDeps = current.deps.filter(c => c.id !== firstDep.id);
let culprit = firstDep;
if (!otherDeps.every(d => d.effectiveWeight !== firstDep.effectiveWeight)) {
  culprit = otherDeps.find(d => d.effectiveWeight !== firstDep.effectiveWeight);
}

const validDependent = current.deps.find(d => d.id !== culprit.id);
const part02Answer = culprit.weight - (culprit.effectiveWeight - validDependent.effectiveWeight);
console.log(`part 02 answer: ${part02Answer}`);
