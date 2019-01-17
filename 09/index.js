const fs = require('fs');

const stream = fs.readFileSync('input.txt').toString();
// const stream = '{{<a!>},{<a!>},{<a!>},{<ab>}}';

// part 01 & 02
const stack = [];
const groups = [];

let ignoreNext = false;
let isGarbage = false;

const getGarbageCharsCount = garbage => {
  let chars = garbage.substring(1, garbage.length - 1);
  let ignoreNext = false;
  let result = 0;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (!ignoreNext) {
      if (char === '!') {
        ignoreNext = true;
      } else {
        result += 1;
      }
    } else {
      ignoreNext = false;
    }
  }

  return result;
};

/*
console.log(getGarbageCharsCount('<>'));
console.log(getGarbageCharsCount('<random characters>'));
console.log(getGarbageCharsCount('<<<<>'));
console.log(getGarbageCharsCount('<{!>}>'));
console.log(getGarbageCharsCount('<!!>'));
console.log(getGarbageCharsCount('<!!!>>'));
console.log(getGarbageCharsCount('<{o"i!a,<{i<a>'));
process.exit(0);
*/

let garbageStart = -1;
let part02answer = 0;

for (let i = 0; i < stream.length; i++) {
  const char = stream[i];
  if (!ignoreNext && !isGarbage) {
    if (char === '!') {
      ignoreNext = true;
    } else if (char === '<') {
      garbageStart = i;
      isGarbage = true;
    } else if (char === '{') {
      stack.push(i);
    } else if (char === '}') {
      groups.push({score : stack.length, text : stream.substring(stack.pop(), i + 1)});
    }
  } else {
    if (ignoreNext) {
      ignoreNext = false;
    } else if (char === '!') {
      ignoreNext = true;
    } else if (isGarbage && char === '>') {
      part02answer += getGarbageCharsCount(stream.substring(garbageStart, i + 1));
      isGarbage = false;
    }
  }
}

const part01answer = groups.map(g => g.score).reduce((p, c) => p + c, 0);
console.log(`part 01 answer: ${part01answer}`);

console.log(`part 02 answer: ${part02answer}`);
