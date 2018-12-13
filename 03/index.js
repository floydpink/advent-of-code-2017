const number = 265149;

const largestSquareRoot = Math.floor(Math.sqrt(number));

let part01answer = 0;
const largestSquare = largestSquareRoot * largestSquareRoot;

if (largestSquare === number) {
  part01answer = largestSquareRoot - 1;
} else {
  const firstCorner = largestSquare + 1;
  const middleCorner = largestSquare + largestSquareRoot + 1;
  if ((number === firstCorner || number === middleCorner) && (largestSquareRoot % 2 === 0)) {
    part01answer = largestSquareRoot;
  } else if (largestSquareRoot % 2 !== 0 && number === firstCorner) {
    part01answer = largestSquareRoot;
  } else if (largestSquareRoot % 2 !== 0 && number === middleCorner) {
    part01answer = largestSquareRoot + 1;
  } else {
    const delta = Math.abs(number - middleCorner);
    if (delta > Math.floor(largestSquareRoot / 2)) {
      part01answer = delta;
    } else {
      part01answer = largestSquareRoot % 2 !== 0 ? largestSquareRoot - delta + 1 : largestSquareRoot - delta;
    }
  }
}

console.log(part01answer); // => 438

/*
*
*

https://stackoverflow.com/a/33701500/218882

    37  36  35  34  33  32  31

    38  17  16  15  14  13  30

    39  18   5   4   3  12  29

    40  19   6   1   2  11  28

    41  20   7   8   9  10  27

    42  21  22  23  24  25  26

    43  44  45  46  47  48  49


4x4 =>
    Start   = 2,1
    End     = 0,0

5x5 =>
    Start   = 2,2
    End     = 4,4

6x6 =>
    Start   = 3,2
    End     = 0,0

7x7 =>
    Start   = 3,3
    End     = 6,6


*
*
*
*/

// part 02 answer => 266330

// https://i.imgur.com/skN94lH.png
// cheated a little and solved it manually using a Numbers spreadsheet and formulas
