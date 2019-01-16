const fs = require('fs');

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
const banks = fs.readFileSync('input.txt')
  .toString()
  .split('\t')
  .map(trimFunc)
  .map(parseIntFunc);

const findFirstDensestBank = b => {
  const max = Math.max.apply(null, b);
  return b.findIndex(v => v === max);
};

let memoryBanks = banks.slice();
let seen = new Map();
let part01Answer = 0;
let part02Answer = 0;
while (true) {
  let state = memoryBanks.join('|');
  if (seen.has(state)) {
    part02Answer = part01Answer - seen.get(state);
    break;
  }
  seen.set(state, part01Answer);
  const densestBank = findFirstDensestBank(memoryBanks);
  const blocks = memoryBanks[densestBank];
  memoryBanks[densestBank] = 0;
  let previous = densestBank;
  for (let i = 0; i < blocks; i++) {
    let current = (previous + 1) === memoryBanks.length ? 0 : (previous + 1);
    memoryBanks[current] = memoryBanks[current] + 1;
    previous = current;
  }
  part01Answer++;
}

console.log(`part 01 answer: ${part01Answer}`);
console.log(`part 02 answer: ${part02Answer}`);
