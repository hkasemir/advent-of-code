const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day1-input.csv", { encoding: "utf-8" }, (err, data) => {
  let increaseCount = 0;
  let currentDepth = 0;
  const depths = papa.parse(data).data.map((row) => parseInt(row[0]) || 0);
  // const depths = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];
  depths.forEach((depth, i) => {
    if (i + 3 > depths.length) return;
    if (i === 0) {
      currentDepth = sumSlice(0, 3, depths);
    }
    const nextDepth = sumSlice(i, i + 3, depths);
    if (nextDepth > currentDepth) increaseCount++;
    currentDepth = nextDepth;
  });
  console.log({ increaseCount });
});

function sumSlice(startingIdx, endingIdx, array) {
  let sum = 0;
  for (let i = startingIdx; i < endingIdx; i++) {
    sum += array[i];
  }
  return sum;
}
