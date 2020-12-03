const fs = require('fs');

const input = 'input.txt';

const trimFunc = i => i.trim();
const rules = fs.readFileSync(input)
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(s => s.split('=>').map(trimFunc));

const initialState = '.#./..#/###';
// const initialState = '#..#/..../..../#..#';

// test arrays
// const initialState = '#.#.#/#...#/..#../#.##./#####';
// const initialState = '#..../##.../###../####./#####';

const stringToArray = (str) => {
  return str.split('/').map(r => r.split(''));
};

const arrayToString = (arr) => {
  return arr.map(r => r.join('')).join('/');
};

// console.log(stringToArray(initialState));
// console.log(arrayToString(stringToArray(initialState)));

const rotateArray = (arr) => {
  const size = arr.length;
  for (let x = 0; x < size / 2; x++) {
    for (let y = x; y < size - 1 - x; y++) {
      const temp = arr[x][y];
      arr[x][y] = arr[y][size - 1 - x];
      arr[y][size - 1 - x] = arr[size - 1 - x][size - 1 - y];
      arr[size - 1 - x][size - 1 - y] = arr[size - 1 - y][x];
      arr[size - 1 - y][x] = temp;
    }
  }
  return arr;
};

const flipArray = (arr) => {
  const str = arrayToString(arr);
  const flippedStr = str.split('/').map(s => s.split('').reverse().join('')).join('/');
  return stringToArray(flippedStr);
};

const flipString = (str) => arrayToString(flipArray(stringToArray(str)));
const rotateString = (str) => arrayToString(rotateArray(stringToArray(str)));

const printArray = (arr) => {
  const size = arr.length;
  console.log(''.padStart(size, '-'));
  for (let x = 0; x < size; x++) {
    let row = '';
    for (let y = 0; y < size; y++) {
      row += arr[x][y];
    }
    console.log(row);
  }
  console.log(''.padStart(size, '-'));
};

// verify rotateArray works
// printArray(stringToArray(initialState));
// printArray(rotateArray(stringToArray(initialState)));
// printArray(rotateArray(rotateArray(stringToArray(initialState))));

// verify flipArray works
// printArray(stringToArray(initialState));
// printArray(flipArray(stringToArray(initialState)));
// printArray(flipArray(flipArray(stringToArray(initialState))));

// console.log(rules);

const rulesMap = new Map();
const checkAndAddRule = (input, output) => {
  if (!rulesMap.has(input)) {
    rulesMap.set(input, output);
  }
};

for (const rule of rules) {
  const input = rule[0];
  const output = rule[1];
  let current = input;
  do {
    checkAndAddRule(current, output);
    checkAndAddRule(flipString(current), output);
    current = rotateString(current);
  } while (current !== input);
}

// console.log([...rulesMap.entries()]);

const joinArray = (arr) => {
  if (arr.length === 1) {
    return arrayToString([arr]);
  }

  let rows = [];
  for (const row of arr) {
    const slices = row.map(r => stringToArray(r));
    const sliceSize = slices.length;
    const height = slices[0].length;
    const width = slices[0][0].length;
    for (let r = 0; r < height; r++) {
      let cells = [];
      for (let m = 0; m < sliceSize; m++) {
        for (let c = 0; c < width; c++) {
          cells.push(slices[m][r][c]);
        }
      }
      rows.push(cells);
    }
  }
  return arrayToString(rows);
};

const enhance = (current) => {
  const size = current.split('/').length;
  let enhanceSize = 0;
  if (size % 2 === 0) {
    enhanceSize = 2;
  } else if (size % 3 === 0) {
    enhanceSize = 3;
  }
  const currArray = stringToArray(current);
  const multiplier = size / enhanceSize;
  let cells = [];
  for (let rowIter = 0; rowIter < multiplier; rowIter++) {
    let sliceRows = [];

    for (let cellIter = 0; cellIter < multiplier; cellIter++) {
      let sliceStrRow = '';
      let sliceCells = [];
      for (let x = rowIter * enhanceSize; x < (rowIter + 1) * enhanceSize; x++) {
        let sliceStrCell = '';
        for (let y = cellIter * enhanceSize; y < (cellIter + 1) * enhanceSize; y++) {
          sliceStrCell += currArray[x][y];
        }
        sliceCells.push(sliceStrCell);
      }
      sliceStrRow += sliceCells.join('/');
      sliceRows.push(rulesMap.get(sliceStrRow));
    }

    // cells.push(sliceRows.map(r => r.split('/')).reduce((c1, c2) => zip(c1, c2)));
    cells.push(sliceRows);
  }
  return joinArray(cells);
};

const iterate = (iterations) => {
  let current = initialState;

  for (let i = 0; i < iterations; i++) {
    current = enhance(current);
    // console.log(current);
  }
  return current.split('').filter(c => c === '#').join('').length;
}

const part01Answer = iterate(5);
console.log(`part 01 answer: ${part01Answer}`);

const part02Answer = iterate(18);
console.log(`part 02 answer: ${part02Answer}`);
