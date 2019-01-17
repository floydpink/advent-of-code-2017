const fs = require('fs');

const inputPath = 'input.txt';

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
const instructions = fs.readFileSync(inputPath)
  .toString()
  .split('\n');

// part 01 & 02
const registers = new Map();

let part02Answer = 0;

const getRegisterValue = name => {
  if (!registers.has(name)) {
    registers.set(name, 0);
  }

  return registers.get(name);
};

const setRegisterValue = (name, value) => {
  part02Answer = Math.max(part02Answer, value);
  registers.set(name, value);
};

for (let i of instructions) {
  const [operationString, conditionString] = i.split(' if ').map(trimFunc);

  const [conditionReg, conditionOperator, conditionValueStr] = conditionString.split(' ').map(trimFunc);
  const conditionRegValue = getRegisterValue(conditionReg);
  const conditionValue = parseIntFunc(conditionValueStr);

  let conditionPassed = false;
  if (conditionOperator === '>') {
    conditionPassed = conditionRegValue > conditionValue;
  } else if (conditionOperator === '>=') {
    conditionPassed = conditionRegValue >= conditionValue;
  } else if (conditionOperator === '<') {
    conditionPassed = conditionRegValue < conditionValue;
  } else if (conditionOperator === '<=') {
    conditionPassed = conditionRegValue <= conditionValue;
  } else if (conditionOperator === '==') {
    conditionPassed = conditionRegValue === conditionValue;
  } else if (conditionOperator === '!=') {
    conditionPassed = conditionRegValue !== conditionValue;
  }

  if (conditionPassed) {
    const [operationReg, operator, operationValueStr] = operationString.split(' ').map(trimFunc);
    const operationValue = parseIntFunc(operationValueStr);
    let operationRegValue = getRegisterValue(operationReg);
    if (operator === 'inc') {
      operationRegValue += operationValue;
    } else if (operator === 'dec') {
      operationRegValue -= operationValue
    }

    setRegisterValue(operationReg, operationRegValue);
  }
}

const part01Answer = Math.max.apply(null, Array.from(registers.values()));
console.log(`part 01 answer: ${part01Answer}`);

console.log(`part 02 answer: ${part02Answer}`);