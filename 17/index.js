const input = 369;

class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// part 01
const initial = new Node(0);
initial.next = initial;

let current = initial;

for (let i = 1; i <= 2017; i++) {
  for (let j = 0; j < input; j++) {
    current = current.next;
  }

  let newNode = new Node(i, current.next);
  current.next = newNode;
  current = newNode;
}

console.log(`part 01 answer: ${current.next.val}`);

// part 02
let million = 0;
for (let i = 2018; i <= 50000000; i++) {
  for (let j = 0; j < input; j++) {
    current = current.next;
  }

  let newNode = new Node(i, current.next);
  current.next = newNode;
  current = newNode;

  if (i % 1000000 === 0) {
    console.log(`inserted ${++million} million nodes...`);
  }
}

console.log(`part 02 answer: ${initial.next.val}`); // 38 mins 42 secs
