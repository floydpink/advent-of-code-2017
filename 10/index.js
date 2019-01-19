const fs = require('fs');

const inputPath = 'input.txt';

const listSize = inputPath === 'input.txt' ? 256 : 5;
let list = [...Array(listSize).keys()];
let currentPosition = 0;
let skipSize = 0;

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
const lengths = fs.readFileSync(inputPath)
  .toString()
  .split(',')
  .map(trimFunc)
  .map(parseIntFunc);

/*
console.log(`listSize     : ${listSize}`);
console.log(`list         : ${list}`);
console.log(`lengths size : ${lengths.length}`);
console.log(`lengths      : ${lengths}`);
*/

const getSubarray = (list, currentPosition, len) => {
  const subArrayEndIndex = currentPosition + len;
  if (subArrayEndIndex < list.length) {
    return list.slice(currentPosition, subArrayEndIndex);
  }

  const wrappedIndex = subArrayEndIndex % list.length;
  return list.slice(currentPosition).concat(list.slice(0, wrappedIndex));
};

const replaceWithReversedSubArray = (list, reversedSubarray, currentPosition) => {
  const subArrayEndIndex = currentPosition + reversedSubarray.length;
  if (subArrayEndIndex < list.length) {
    return list.slice(0, currentPosition).concat(reversedSubarray).concat(list.slice(subArrayEndIndex));
  }

  const wrappedIndex = subArrayEndIndex - list.length;
  return reversedSubarray.slice(-wrappedIndex).concat(list.slice(wrappedIndex, currentPosition)).concat(reversedSubarray.slice(0, -wrappedIndex));
};

// part 01

for (let len of lengths) {
  const subArray = getSubarray(list, currentPosition, len);
  subArray.reverse();
  list = replaceWithReversedSubArray(list, subArray, currentPosition);
  currentPosition = currentPosition + len + skipSize;
  if (currentPosition >= list.length) {
    currentPosition = currentPosition - list.length;
  }
  skipSize++;
}

const part01answer = list[0] * list[1];
console.log(`part 01 answer: ${part01answer}`);