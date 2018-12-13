const fs = require('fs');

const inputPath = 'input.txt';
let separator = inputPath === 'input.txt' ? '\t' : ' ';

const trimFunc = i => i.trim();
const parseIntFunc = i => parseInt(i, 10);
const spreadSheetRows = fs.readFileSync(inputPath)
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(line => line.split(separator).map(trimFunc).map(parseIntFunc));

// console.log(`rows count: ${spreadSheetRows.length}`);

let part01answer = 0;
for (let row of spreadSheetRows) {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  for (let cell of row) {
    min = Math.min(min, cell);
    max = Math.max(max, cell);
  }
  part01answer += (max - min);
}

console.log(`part 01 answer: ${part01answer}`);

let part02answer = 0;
for (let row of spreadSheetRows) {
  let quotient = 0;

  for (let i = 0; i < row.length; i++) {
    let divisor = row[i];

    for (let j = 0; j < row.length; j++) {
      if (i === j) {
        continue;
      }

      let dividend = row[j];
      quotient = dividend / divisor;

      if (quotient === Math.floor(quotient)) {
        i = row.length;
        break;
      }

    }
  }
  part02answer += quotient;
}

console.log(`part 02 answer: ${part02answer}`);

