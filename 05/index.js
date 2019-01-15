const fs = require('fs');

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
const offsetsOriginal = fs.readFileSync('input.txt')
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(parseIntFunc);

// part 01

let offsets = offsetsOriginal.slice();
let current = 0;
let part01Answer = 0;
while (true) {
  if (current < 0 || current >= offsets.length) {
    break;
  }
  const jumpBy = offsets[current];
  offsets[current] += 1;
  current += jumpBy;
  part01Answer++;
}

console.log(`part 01 answer: ${part01Answer}`);

// part 02

offsets = offsetsOriginal.slice();
current = 0;
let part02Answer = 0;
while (true) {
  if (current < 0 || current >= offsets.length) {
    break;
  }
  const jumpBy = offsets[current];
  if (offsets[current] >= 3) {
    offsets[current] -= 1;
  } else {
    offsets[current] += 1;
  }
  current += jumpBy;
  part02Answer++;
}

console.log(`part 02 answer: ${part02Answer}`);
