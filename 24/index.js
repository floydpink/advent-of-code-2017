const fs = require('fs');

const inputPath = 'input.txt';
const input = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .filter(l => !!l);

// console.log(input);
// console.log(input.length);

class Component {
  constructor(str) {
    const [left, right] = str.split('/').map(i => parseInt(i, 10));
    this.left = left;
    this.right = right;
  }

  get key() {
    return `${this.left}|${this.right}`;
  }

  get strength() {
    return this.left + this.right;
  }
}

class Bridge {
  constructor() {
    this.components = [];
    this.edge = 0
  }

  isValid(component) {
    return this.edge === component.left || this.edge === component.right;
  }

  push(component) {
    this.components.push(component);
    this.setEdge(component)
  }

  pop() {
    if (this.components.length) {
      const pop = this.components.pop();
      this.setEdge(pop);
      return pop;
    }
  }

  setEdge(component) {
    this.edge = component.left === this.edge ? component.right : component.left;
  }

  get key() {
    return this.components.map(c => c.key).join('-');
  }

  get strength() {
    return this.components.map(c => c.strength).reduce((a, b) => a + b);
  }
}

const except = (bridge, components) => {
  return components.filter(c => !bridge.components.includes(c));
}

const bridges = new Map();
const components = input.map(l => new Component(l));
let strongest = -1;
let longest = -1;
const strengthMaps = new Map();

const permute = (bridge, components) => {
  const nexts = components.filter(c => bridge.isValid(c));
  for (let i = 0; i < nexts.length; i++) {
    const next = nexts[i];
    bridge.push(next);
    bridges.set(bridge.key, bridge.strength);
    if (bridge.strength > strongest) {
      strongest = bridge.strength;
    }
    const bridgeLength = bridge.components.length;
    if (!strengthMaps.has(bridgeLength)) {
      strengthMaps.set(bridgeLength, -1);
      if (bridgeLength > longest) {
        longest = bridgeLength;
      }
    }
    if (bridge.strength > strengthMaps.get(bridgeLength)) {
      strengthMaps.set(bridgeLength, bridge.strength);
    }
    permute(bridge, except(bridge, components));
    bridge.pop();
  }
};

permute(new Bridge(), components);

console.log(`part 01 answer: ${strongest}`);
console.log(`part 02 answer: ${strengthMaps.get(longest)}`);
