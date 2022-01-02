const path = require("path");
const fs = require("fs");

const myInput = fs
  .readFileSync(path.join(__dirname, "day14-input.txt"), "utf8")
  .toString()
  .trim()
  .split("\n");

const sampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split("\n");

function processInput(inputArray) {
  const startingString = inputArray[0];

  const insertionMap = inputArray.slice(2).reduce((mapObj, currentLine) => {
    const [between, arrow, insert] = currentLine.split(" ");
    mapObj[between] = insert;
    return mapObj;
  }, {});
  return { startingString, insertionMap };
}
const { startingString, insertionMap } = processInput(myInput);

function takeStep(startingString, insertionMap) {
  const newStringChars = [];
  for (let i = 0; i < startingString.length - 1; i++) {
    newStringChars.push(startingString[i]);
    const between = startingString.slice(i, i + 2);
    const insertionChar = insertionMap[between];
    newStringChars.push(insertionChar);
  }

  newStringChars.push(startingString[startingString.length - 1]);

  return newStringChars.join("");
}

function getPairAndCharCounts(startingString) {
  const counts = startingString.split("").reduce(
    (counts, currentEl, idx) => {
      if (idx < startingString.length - 1) {
        const currentPair = startingString.substring(idx, idx + 2);
        counts.pairs[currentPair] = (counts.pairs[currentPair] || 0) + 1;
      }
      counts.elements[currentEl] = (counts.elements[currentEl] || 0) + 1;
      return counts;
    },
    { pairs: {}, elements: {} }
  );
  return counts;
}

function takeStepCount(startingCounts, insertionMap) {
  const pairs = { ...startingCounts.pairs };
  const elements = { ...startingCounts.elements };
  Object.keys(startingCounts.pairs).forEach((pair) => {
    const count = startingCounts.pairs[pair];
    const insertChar = insertionMap[pair];
    const newPair1 = pair[0] + insertChar;
    const newPair2 = insertChar + pair[1];
    elements[insertChar] = (elements[insertChar] || 0) + count;
    pairs[pair] = (pairs[pair] || 0) - count;
    pairs[newPair1] = (pairs[newPair1] || 0) + count;
    pairs[newPair2] = (pairs[newPair2] || 0) + count;
  });
  return { pairs, elements };
}

function takeSteps(count, startingString, insertionMap) {
  let stepsTaken = 0;
  let newString = startingString;
  while (stepsTaken < count) {
    newString = takeStep(newString, insertionMap);
    stepsTaken++;
  }
  return newString;
}

function takeStepsCount(count, startingString, insertionMap) {
  let startingCounts = getPairAndCharCounts(startingString);
  let stepsTaken = 0;
  while (stepsTaken < count) {
    startingCounts = takeStepCount(startingCounts, insertionMap);
    stepsTaken++;
  }
  return startingCounts;
}

function findElementCounts(polymerString) {
  return polymerString.split("").reduce((elementCounts, currentEl) => {
    elementCounts[currentEl] = (elementCounts[currentEl] || 0) + 1;
    return elementCounts;
  }, {});
}

function getMostCommon(elementCounts) {
  let mostCommonCount = 0;
  let mostCommonEl;
  for (el in elementCounts) {
    if (elementCounts[el] > mostCommonCount) {
      mostCommonCount = elementCounts[el];
      mostCommonEl = el;
    }
  }
  return mostCommonEl;
}

function getLeastCommon(elementCounts) {
  let leastCommonCount = Infinity;
  let leastCommonEl;
  for (el in elementCounts) {
    if (elementCounts[el] < leastCommonCount) {
      leastCommonCount = elementCounts[el];
      leastCommonEl = el;
    }
  }
  return leastCommonEl;
}

function part1(startingString, insertionMap) {
  const polymerString = takeSteps(10, startingString, insertionMap);
  const elementCounts = findElementCounts(polymerString);
  console.log({ elementCounts });
  const mostCommon = getMostCommon(elementCounts);
  const leastCommon = getLeastCommon(elementCounts);
  return elementCounts[mostCommon] - elementCounts[leastCommon];
}

function part2(startingString, insertionMap) {
  const { elements } = takeStepsCount(40, startingString, insertionMap);
  const mostCommon = getMostCommon(elements);
  const leastCommon = getLeastCommon(elements);
  return elements[mostCommon] - elements[leastCommon];
}

console.log(part2(startingString, insertionMap));
