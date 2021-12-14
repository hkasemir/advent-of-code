const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day7-input.csv", { encoding: "utf-8" }, (err, data) => {
  const positions = papa
    .parse(data)
    .data[0].map((num) => parseInt(num))
    .sort((first, second) => (first > second ? 1 : -1));
  const min = positions[0];
  const max = positions[positions.length - 1];
  let minGas = 1000000000000000;
  let minGasStep = 1000000000000000;
  for (let step = min; step <= max; step++) {
    const gasUsed = positions.reduce((total, position) => {
      const steps = Math.abs(position - step);
      return getGas(steps) + total;
    }, 0);
    if (gasUsed < minGas) {
      minGasStep = step;
      minGas = gasUsed;
    }
  }

  console.log({ minGas, minGasStep, test: getGas(11) });
});

function getGas(steps) {
  let total = 0;
  for (let i = 1; i <= steps; i++) {
    total += i;
  }
  return total;
}
