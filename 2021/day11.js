const myInput = `7612648217
7617237672
2853871836
7214367135
1533365614
6258172862
5377675583
5613268278
8381134465
3445428733`
  .split("\n")
  .map((line) => line.split("").map((num) => parseInt(num)));

const sampleInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`
  .split("\n")
  .map((line) => line.split("").map((num) => parseInt(num)));

// ---- Part 1 ----
function incrementIfInRange(map, x, y) {
  if (!isInRange(x, y)) return map;
  const newVal = map[y][x] + 1;
  map[y][x] = newVal;
  return { map, newVal };
}

function isInRange(x, y) {
  return x >= 0 && y >= 0 && x < 10 && y < 10;
}

function incrementAdjacentCells(map, x, y) {
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      if (!(i === 0 && j === 0)) {
        map = incrementCells(map, x + i, y + j);
      }
    }
  }
  return map;
}

function incrementCells(map, x, y) {
  if (!isInRange(x, y)) return map;
  const { newVal } = incrementIfInRange(map, x, y);
  if (newVal === 10) {
    map = incrementAdjacentCells(map, x, y);
  }
  return map;
}

function takeStep(map) {
  let flashCount = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      map = incrementCells(map, x, y);
    }
  }
  map = map.map((line) =>
    line.map((energyReading) => {
      if (energyReading > 9) {
        flashCount++;
        return 0;
      }
      return energyReading;
    })
  );
  // console.log(map.map((line) => line.join(" ")).join("\n"));
  // console.log("---");

  return { map, flashCount };
}

function simulateSteps(map, stepCount) {
  let stepsTaken = 0;
  let flashCount = 0;
  while (stepsTaken < stepCount) {
    const result = takeStep(map);
    map = result.map;
    flashCount += result.flashCount;

    stepsTaken++;
  }
  console.log({ flashCount });
}

// simulateSteps(myInput, 100);
// ---- Part 2 ----

function findFirstAllFlashStep(map) {
  let stepsTaken = 0;
  let flashCount = 0;

  while (flashCount < 100) {
    const result = takeStep(map);
    map = result.map;
    flashCount = result.flashCount;
    stepsTaken++;
  }
  console.log(stepsTaken);
}

findFirstAllFlashStep(myInput);
