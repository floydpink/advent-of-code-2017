const fs = require('fs');

const inputPath = 'input.txt';

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);

let list = [...Array(256).keys()];
let currentPosition = 0;
let skipSize = 0;

const input = fs.readFileSync(inputPath).toString();

const part01Lengths = input
  .split(',')
  .map(trimFunc)
  .map(parseIntFunc);

const part02Lengths = input
  .split('')
  .map(a => a.charCodeAt(0))
  .concat([17, 31, 73, 47, 23]);

const getSubarray = (list, currentPosition, len) => {
  const subArrayEndIndex = currentPosition + len;
  if (subArrayEndIndex <= list.length) {
    return list.slice(currentPosition, subArrayEndIndex);
  }

  const wrappedIndex = subArrayEndIndex % list.length;
  return list.slice(currentPosition).concat(list.slice(0, wrappedIndex));
};

const replaceWithReversedSubArray = (list, reversedSubarray, currentPosition) => {
  const subArrayEndIndex = currentPosition + reversedSubarray.length;
  if (subArrayEndIndex <= list.length) {
    return list.slice(0, currentPosition).concat(reversedSubarray).concat(list.slice(subArrayEndIndex));
  }

  const wrappedIndex = subArrayEndIndex % list.length;
  return reversedSubarray.slice(-wrappedIndex).concat(list.slice(wrappedIndex, currentPosition)).concat(reversedSubarray.slice(0, -wrappedIndex));
};

const hash = (list, lengths, currentPosition, skipSize) => {
  for (let len of lengths) {
    const subArray = getSubarray(list, currentPosition, len);
    subArray.reverse();
    list = replaceWithReversedSubArray(list, subArray, currentPosition);
    currentPosition = (currentPosition + len + skipSize) % list.length;
    skipSize++;
  }
  return [list, currentPosition, skipSize];
};

// part 01
const [part01List] = hash(list, part01Lengths, currentPosition, skipSize);
const part01Answer = part01List[0] * part01List[1];
console.log(`part 01 answer: ${part01Answer}`);

for (let i = 0; i < 64; i++) {
  [list, currentPosition, skipSize] = hash(list, part02Lengths, currentPosition, skipSize);
}

const sparseHash = list;
const denseHash = [];
for (let i = 0; i < 16; i++) {
  const blockStart = 16 * i;
  const blockEnd = blockStart + 16;
  const block = sparseHash.slice(blockStart, blockEnd);
  const xor = block.reduce((p, c) => p ^ c);
  denseHash.push(xor);
}

const part02Answer = denseHash
  .map(n => {
    const hex = Number(n).toString(16);
    return hex.length < 2 ? `0${hex}` : hex;
  })
  .join('');
console.log(`part 02 answer: ${part02Answer}`);