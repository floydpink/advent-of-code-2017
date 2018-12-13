const fs = require('fs');

let inputPath = 'input.txt';

let trimFunc = i => i.trim();
const passPhrases = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(i => i.split(' ').map(trimFunc));

// part 01
let validPassPhrasesCount = 0;
for (let phrase of passPhrases) {
  let map = new Map();
  let isValid = true;
  for (let word of phrase) {
    if (map.has(word)) {
      isValid = false;
      break;
    }
    map.set(word, true);
  }
  if (isValid) {
    validPassPhrasesCount++;
  }
}

console.log(`part 01 answer: ${validPassPhrasesCount}`);

// part 02
validPassPhrasesCount = 0;
for (let phrase of passPhrases) {
  let map = new Map();
  let isValid = true;
  for (let word of phrase) {
    let key = word.split('').sort().join('');
    if (map.has(key)) {
      isValid = false;
      break;
    }
    map.set(key, true);
  }
  if (isValid) {
    validPassPhrasesCount++;
  }
}

console.log(`part 02 answer: ${validPassPhrasesCount}`);