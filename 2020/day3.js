const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day3-input.csv", { encoding: "utf-8" }, (err, data) => {
  const topo = papa.parse(data).data.map((row) => {
    return row[0].split("");
  });
  const rowCount = topo.length;
  const colCount = topo[0].length;
  const slopes = [
    { dx: 1, dy: 1 },
    { dx: 3, dy: 1 },
    { dx: 5, dy: 1 },
    { dx: 7, dy: 1 },
    { dx: 1, dy: 2 },
  ];
  const answer = slopes.reduce((treeProduct, slope) => {
    let currentRow = 0;
    let currentCol = 0;
    let treeCount = 0;
    while (currentRow < rowCount) {
      currentCol = currentCol % colCount;
      if (topo[currentRow][currentCol] === "#") {
        treeCount++;
      }
      currentCol += slope.dx;
      currentRow += slope.dy;
    }
    console.log({ treeCount });
    return treeProduct * treeCount;
  }, 1);

  console.log(answer);
});
