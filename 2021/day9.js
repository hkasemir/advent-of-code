const fs = require("fs");
const papa = require("papaparse");

const smallTestInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;

fs.readFile("./day9-input.csv", { encoding: "utf-8" }, (err, data) => {
  const rows = papa.parse(data).data.map(([row]) => {
    return row.split("").map((digit) => parseInt(digit));
  });
  // const rows = smallTestInput.split("\n").map((line) => {
  //   return line.split("").map((digit) => parseInt(digit));
  // });
  const lowPoints = findLowPoints(rows);
  console.log(getRiskLevel(rows, lowPoints));
  const basinSizes = findBasinSizes(rows, lowPoints);

  const top3 = getTop(3, basinSizes);
  console.log(top3);
  console.log(product(top3));
});

function product(arr) {
  return arr.reduce((total, val) => val * total, 1);
}

function getTop(count, arr) {
  // sort descending
  const arrayClone = [...arr];
  arrayClone.sort((first, second) => (first > second ? -1 : 1));

  return arrayClone.slice(0, count);
}

function isLowPoint(height, adjacentHeights) {
  return adjacentHeights.every((adjacent) => adjacent > height);
}

function findLowPoints(rows) {
  const lowPoints = [];
  rows.forEach((row, rowIdx) => {
    row.forEach((height, heightIdx) => {
      const adjacentHeights = [
        getSafe(row, heightIdx - 1, 10),
        getSafe(row, heightIdx + 1, 10),
        getSafe(rows[rowIdx - 1], heightIdx, 10),
        getSafe(rows[rowIdx + 1], heightIdx, 10),
      ];
      if (isLowPoint(height, adjacentHeights)) {
        lowPoints.push({ rowIdx, heightIdx });
      }
    });
  });

  return lowPoints;
}

function getPointKey(x, y) {
  return `${x},${y}`;
}

function getBasinSize(rows, rowIdx, heightIdx) {
  const points = new Set();

  gatherPoints(rows, rowIdx, heightIdx, points);
  return points.size;
}

function gatherPoints(rows, rowIdx, heightIdx, points) {
  const pointKey = getPointKey(rowIdx, heightIdx);
  const pointVal = getSafe(rows[rowIdx], heightIdx);
  if (pointVal === undefined || pointVal === 9 || points.has(pointKey)) return;
  points.add(pointKey);
  gatherPoints(rows, rowIdx - 1, heightIdx, points);
  gatherPoints(rows, rowIdx + 1, heightIdx, points);
  gatherPoints(rows, rowIdx, heightIdx - 1, points);
  gatherPoints(rows, rowIdx, heightIdx + 1, points);
}

function findBasinSizes(rows, lowPoints) {
  const basinSizes = [];
  lowPoints.forEach((coordinates) => {
    const basinSize = getBasinSize(
      rows,
      coordinates.rowIdx,
      coordinates.heightIdx
    );
    basinSizes.push(basinSize);
  });

  return basinSizes;
}

function getRiskLevel(map, lowPoints) {
  return lowPoints.reduce(
    (sum, point) => sum + map[point.rowIdx][point.heightIdx] + 1,
    0
  );
}

function getSafe(obj, key, defaultVal) {
  if (obj === undefined || obj[key] === undefined) return defaultVal;
  return obj[key];
}
