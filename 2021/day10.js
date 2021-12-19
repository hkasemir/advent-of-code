const path = require("path");
const fs = require("fs");

const myInput = fs
  .readFileSync(path.join(__dirname, "day10-input.txt"), "utf8")
  .toString()
  .trim()
  .split("\n");

const sampleInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split("\n");

// ---- Part 1 ----
function getSyntaxErrorScore(input) {
  let score = 0;
  input.forEach((line) => {
    const illegalChar = findCorruptChar(line);
    if (illegalChar) score += getCharScore(illegalChar);
  });

  return score;
}

const bracketPairMap = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

function findCorruptChar(line) {
  const callStack = [];
  const openingChars = Object.keys(bracketPairMap);
  const illegalChar = line.split("").find((char) => {
    if (openingChars.includes(char)) {
      callStack.unshift(char);
      return false;
    }
    if (char === bracketPairMap[callStack[0]]) {
      callStack.shift();
      return false;
    }
    return true;
  });

  return illegalChar;
}

function getCharScore(char) {
  switch (char) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
    default:
      return 0;
  }
}

// console.log(getSyntaxErrorScore(myInput));

// ---- Part 2 ----
function getAutoCompleteScore(input) {
  const scores = input
    .map((line) => {
      return getLineAutoCompleteScore(line);
    })
    .filter(Boolean)
    .sort((first, second) => (first > second ? 1 : -1));

  return scores[(scores.length - 1) / 2];
}

function getCompletionChars(line) {
  const callStack = [];
  const openingChars = Object.keys(bracketPairMap);
  const isCorrupt = line.split("").some((char) => {
    if (openingChars.includes(char)) {
      callStack.unshift(char);
      return false;
    }
    if (char === bracketPairMap[callStack[0]]) {
      callStack.shift();
      return false;
    }
    return true;
  });
  if (isCorrupt) return [];
  return callStack.map((openingChar) => bracketPairMap[openingChar]);
}

function getLineAutoCompleteScore(line) {
  const completionChars = getCompletionChars(line);

  return getScoreFromCompletionChars(completionChars);
}

function getCharPointValue(char) {
  switch (char) {
    case ")":
      return 1;
    case "]":
      return 2;
    case "}":
      return 3;
    case ">":
      return 4;
    default:
      return 0;
  }
}

function getScoreFromCompletionChars(completionChars) {
  return completionChars.reduce(
    (score, currentChar) => score * 5 + getCharPointValue(currentChar),
    0
  );
}

console.log(getAutoCompleteScore(myInput));
