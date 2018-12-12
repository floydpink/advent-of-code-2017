const fs = require('fs');

let trimFunc = i => i.trim();
let parseIntFunc = i => parseInt(i, 10);
const captchaDigitsArray = fs.readFileSync('input.txt')
  .toString()
  .split('\n')
  .map(trimFunc)
  .map(i => i.split('').map(parseIntFunc));

// part 01

let counter = 0;
for (let captchaDigits of captchaDigitsArray) {
  // console.log(`captcha digits length: ${captchaDigits.length}`);
  const candidateDigits = [];

  let length = captchaDigits.length;
  for (let i = 0; i < length - 1; i++) {
    if (captchaDigits[i] === captchaDigits[i + 1]) {
      candidateDigits.push(captchaDigits[i]);
    }
  }
  if (captchaDigits[length - 1] === captchaDigits[0]) {
    candidateDigits.push(captchaDigits[length - 1]);
  }

  const part01answer = candidateDigits.reduce((p, c) => p + c, 0);
  console.log(`part 01 answer (${++counter}): ${part01answer}`);
}

// part 02

counter = 0;
for (let captchaDigits of captchaDigitsArray) {
  // console.log(`captcha digits length: ${captchaDigits.length}`);
  const candidateDigits = [];

  let length = captchaDigits.length;
  for (let i = 0; i < length; i++) {

    let nextIndex = i + length / 2;
    if (nextIndex >= length) {
      nextIndex = nextIndex - length;
    }

    if (captchaDigits[i] === captchaDigits[nextIndex]) {
      candidateDigits.push(captchaDigits[i]);
    }
  }

  const part02answer = candidateDigits.reduce((p, c) => p + c, 0);
  console.log(`part 02 answer (${++counter}): ${part02answer}`);
}