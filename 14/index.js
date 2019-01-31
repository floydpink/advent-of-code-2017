const knotHash = require('./knot-hash');
// part 01

const input = 'jxqlasbh';
// const input = 'flqrgnkx';

let parseIntFunc = i => parseInt(i, 10);

const flattenArray = function (array) {
  let result = [];
  for (let item of array) {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  }
  return result;
};

const hex2bin = function (hex) {
  return (parseInt(hex, 16).toString(2))
    .padStart(4, '0')
    .split('')
    .map(parseIntFunc)
};

const diskGrid = [];
for (let i = 0; i < 128; i++) {
  diskGrid.push(flattenArray(knotHash(`${input}-${i}`).toString().split('').map(hex2bin)));
}

// part 01
console.log(`part 01 answer: ${flattenArray(diskGrid).reduce((p, c) => p + c)}`);

// part 02
const visited = new Set();
const regions = new Map();

let regionId = 0;
const delta = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const getArrayFromKey = function (key) {
  return key.split('|').map(parseIntFunc);
};

const getKey = function (row, col) {
  return `${row}|${col}`;
};

const isValid = function (row, col) {
  return row >= 0 && row < 128 && col >= 0 && col < 128;
};

const getUnexploredNeighbors = function (key) {
  let [row, col] = getArrayFromKey(key);
  return delta.map(d => [row + d[0], col + d[1]])
    .filter(n => isValid(n[0], n[1]))
    .map(n => getKey(n[0], n[1]))
    .filter(k => !visited.has(k));
};

const discoverNodeRegion = function (row, col) {
  const key = getKey(row, col);
  if (visited.has(key)) {
    return;
  }

  if (diskGrid[row][col] === 0) {
    visited.add(key);
    return;
  }

  let queue = [key];

  regions.set(++regionId, new Set());

  while (queue.length > 0) {
    let current = queue.shift();

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    [row, col] = getArrayFromKey(current);

    if (diskGrid[row][col] === 1) {
      regions.get(regionId).add(current);
      for (let n of getUnexploredNeighbors(current)) {
        queue.push(n);
      }
    }
  }
};

for (let row = 0; row < 128; row++) {
  for (let col = 0; col < 128; col++) {
    discoverNodeRegion(row, col);
  }
}

console.log(`part 02 answer: ${regionId}`);