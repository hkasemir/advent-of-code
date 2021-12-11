const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day3-input.csv", { encoding: "utf-8" }, (err, data) => {
  const rows = papa.parse(data).data.map(([row]) => row);
  console.log(getPowerConsumtion(rows));
  console.log(getLifeSupportRating(rows));
});

function getLifeSupportRating(rows) {
  const oxGenRating = getOxGenRating(rows, 0);
  const co2ScrubRating = getco2ScrubRating(rows, 0);
  const oxGenInt = parseInt(oxGenRating, 2);
  const co2ScrubInt = parseInt(co2ScrubRating, 2);
  const lifeSupportRating = oxGenInt * co2ScrubInt;
  return lifeSupportRating;
}

function getOxGenRating(rows, idx) {
  if (!rows.length) throw "no rows left for oxGen";
  if (rows.length === 1) return rows[0];
  const [oneVals, zeroVals] = filterListsByIdxVal(rows, idx);
  if (oneVals.length >= rows.length / 2) {
    return getOxGenRating(oneVals, idx + 1);
  }
  return getOxGenRating(zeroVals, idx + 1);
}

function getco2ScrubRating(rows, idx) {
  if (!rows.length) throw "no rows left for co2Scrub";
  if (rows.length === 1) return rows[0];
  const [oneVals, zeroVals] = filterListsByIdxVal(rows, idx);
  if (zeroVals.length <= rows.length / 2) {
    return getco2ScrubRating(zeroVals, idx + 1);
  }
  return getco2ScrubRating(oneVals, idx + 1);
}

function filterListsByIdxVal(rows, idx) {
  return rows.reduce(
    ([oneBits, zeroBits], row) => {
      if (row[idx] === "1") {
        oneBits.push(row);
      } else {
        zeroBits.push(row);
      }
      return [oneBits, zeroBits];
    },
    [[], []]
  );
}

function getPowerConsumtion(rows) {
  const bitCounts = getBitCounts(rows);
  const gammaRateBits = [];
  const epsilonRateBits = [];
  const bitLength = Object.keys(bitCounts).length;
  for (let i = 0; i < bitLength; i++) {
    const bitCount = bitCounts[i];
    if (bitCount > rows.length / 2) {
      gammaRateBits.push("1");
      epsilonRateBits.push("0");
    } else {
      gammaRateBits.push("0");
      epsilonRateBits.push("1");
    }
  }
  const gammaRate = parseInt(gammaRateBits.join(""), 2);
  const epsilonRate = parseInt(epsilonRateBits.join(""), 2);
  const powerConsumption = gammaRate * epsilonRate;
  return powerConsumption;
}

function getBitCounts(rows) {
  return rows.reduce((oneCounts, row) => {
    const bits = row.split("");
    bits.forEach((bit, idx) => {
      oneCounts[idx] =
        bit === "1" ? (oneCounts[idx] || 0) + 1 : oneCounts[idx] || 0;
    });
    return oneCounts;
  }, {});
}
