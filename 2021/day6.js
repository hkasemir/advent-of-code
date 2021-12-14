const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day6-input.csv", { encoding: "utf-8" }, (err, data) => {
  const initDays = papa.parse(data).data[0].map((num) => parseInt(num));
  // const initDays = "3,4,3,1,2".split(",").map((num) => parseInt(num));
  const childCounts = initDays.map((daysLeftToSpawn) => {
    const count = getChildCount(daysLeftToSpawn, 256);
    return count;
  });
  const childCount = childCounts.reduce((tot, val) => tot + val, 0);
  const total = initDays.length + childCount;
  console.log(total);
  // let lanternFishes = initDays.map((days) => new LanternFish(days));
  // let count = 0;
  // while (count <= 256) {
  //   console.log("day", count, ":", lanternFishes.length);
  //   let newFishes = [];
  //   lanternFishes.forEach((fish) => {
  //     const newFish = fish.finishDay();
  //     if (newFish) newFishes.push(newFish);
  //   });
  //   lanternFishes = lanternFishes.concat(newFishes);
  //   newFishes = [];
  //   count++;
  // }
});

class LanternFish {
  daysLeftToSpawn = 0;
  constructor(daysLeftToSpawn) {
    this.daysLeftToSpawn = daysLeftToSpawn;
  }

  finishDay() {
    this.daysLeftToSpawn--;
    if (this.daysLeftToSpawn < 0) {
      this.daysLeftToSpawn = 6;
      return new LanternFish(8);
    }
  }
}

const memo = {};

function getChildCount(daysLeftToSpawn, daysLeftInTimeframe) {
  const memokey = `${daysLeftToSpawn}_${daysLeftInTimeframe}`;
  if (memo[memokey]) return memo[memokey];
  let daysLeft = daysLeftInTimeframe - daysLeftToSpawn;
  if (daysLeft < 0) return 0;
  let childCount = Math.ceil(daysLeft / 7);
  daysLeft--;
  while (daysLeft > 0) {
    const thisChildsChildren = getChildCount(8, daysLeft);
    childCount += thisChildsChildren;
    daysLeft -= 7;
  }
  memo[memokey] = childCount;
  return childCount;
}
