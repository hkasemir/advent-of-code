const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day2-input.csv", { encoding: "utf-8" }, (err, data) => {
  const directions = papa.parse(data).data.map((row) => {
    const directionStrings = (row[0] || " ").split(" ");
    return {
      direction: directionStrings[0],
      amount: parseInt(directionStrings[1]) || 0,
    };
  });
  let distance = 0;
  let depth = 0;
  let aim = 0;
  directions.forEach((movement) => {
    const { amount, direction } = movement;
    if (direction === "up") aim -= amount;
    else if (direction === "down") aim += amount;
    else if (direction === "forward") {
      distance += amount;
      depth += aim * amount;
    } else console.log("unknown direction", direction);
  });
  console.log({ distance, depth, product: distance * depth });
});
