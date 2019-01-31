let previousA = 679;
let previousB = 771;

const factorA = 16807;
const factorB = 48271;

const modulo = 2147483647;

const generatorA = (isPart2 = false) => {
  do {
    previousA = (previousA * factorA) % modulo;
  } while (isPart2 && previousA % 4 !== 0);
};

const generatorB = (isPart2 = false) => {
  do {
    previousB = (previousB * factorB) % modulo;
  } while (isPart2 && previousB % 8 !== 0);
};

let counter = 0;
let matchCount = 0;
// console.log(`--Gen. A--\t--Gen. B--`);

const judge = () => {
  let partA = previousA.toString(2).slice(-16);
  let partB = previousB.toString(2).slice(-16);

  if (partA === partB) {
    matchCount++;
    // console.log(`match found at ${counter}`);
  }
};

const format = n => {
  return n.toString().padStart(10, ' ');
};

let million = 0;
while (counter < 40000000) {
  generatorA();
  generatorB();

  // console.log(`${format(previousA)}\t${format(previousB)}`);

  judge();

  counter = counter + 1;

/*
  if (counter % 1000000 === 0) {
    console.log(`performed ${++million} million calculations`);
  }
*/
}

console.log(`part 01 answer: ${matchCount}`);

// part 02

previousA = 679;
previousB = 771;

million = 0;
counter = 0;
matchCount = 0;
while (counter < 5000000) {
  generatorA(true);
  generatorB(true);

  // console.log(`${format(previousA)}\t${format(previousB)}`);

  judge();

  counter = counter + 1;

/*
  if (counter % 1000000 === 0) {
    console.log(`performed ${++million} million calculations`);
  }
*/
}

console.log(`part 02 answer: ${matchCount}`);