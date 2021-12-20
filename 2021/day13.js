const path = require("path");
const fs = require("fs");

const myInput = fs
  .readFileSync(path.join(__dirname, "day13-input.txt"), "utf8")
  .toString()
  .trim()
  .split("\n");

const transitionIdx = myInput.findIndex((item) => item === "");

const myCoords = myInput
  .slice(0, transitionIdx)
  .map((line) => line.split(",").map((num) => parseInt(num)));

const myFolds = myInput.slice(transitionIdx + 1).map((line) => {
  const [_, foldLine] = line.split("=");
  return { foldLine: parseInt(foldLine), isX: line.includes("x") };
});

// .map((line) => line.split("").map((num) => parseInt(num)));

const sampleInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0`
  .split("\n")
  .map((line) => line.split(",").map((num) => parseInt(num)));

const sampleFolds = `fold along y=7
fold along x=5`
  .split("\n")
  .map((line) => {
    const [_, foldLine] = line.split("=");
    return { foldLine: parseInt(foldLine), isX: line.includes("x") };
  });

// ---- Part 1 ----
function getFoldedCoordinate(coord, lineLocation) {
  const diff = coord - lineLocation;
  return lineLocation - diff;
}

function foldAround(points, isX, lineLocation) {
  const newPoints = new Set();
  points.forEach(([x, y]) => {
    const shouldTransform = isX ? x > lineLocation : y > lineLocation;
    if (shouldTransform) {
      const newX = isX ? getFoldedCoordinate(x, lineLocation) : x;
      const newY = isX ? y : getFoldedCoordinate(y, lineLocation);
      newPoints.add([newX, newY].join(","));
      return;
    }
    newPoints.add([x, y].join(","));
  });
  return newPoints;
}
// console.log(foldAround(myCoords, myFolds[0].isX, myFolds[0].foldLine).size);

// ----- Part 2 ------------

function convertToCoords(pointSet) {
  return Array.from(pointSet).map((line) =>
    line.split(",").map((num) => parseInt(num))
  );
}

function processFolds(coordinates, folds) {
  let finalPoints = new Set(coordinates.map((coord) => coord.join(",")));
  folds.forEach((fold) => {
    finalPoints = foldAround(
      convertToCoords(finalPoints),
      fold.isX,
      fold.foldLine
    );
  });
  return finalPoints;
}

const points = processFolds(myCoords, myFolds);
function printPoints(points) {
  const coords = convertToCoords(points);
  const printout = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 50; j++) {
      row.push(".");
    }
    printout.push(row);
  }
  console.log(printout);
  coords.forEach(([x, y]) => {
    console.log({ x, y });
    printout[y][x] = "#";
  });

  console.log(printout.map((line) => line.join("")).join("\n"));
}
printPoints(points);
