const fs = require("fs");
const papa = require("papaparse");

const smallTestInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

fs.readFile("./day8-input.csv", { encoding: "utf-8" }, (err, data) => {
  const entries = papa.parse(data).data.map((row) => {
    const test = row[0].trim().split(" ");
    const output = row[1].trim().split(" ");
    return { test, output };
  });
  // const entries = smallTestInput.split("\n").map((line) => {
  //   const row = line.split("|");
  //   const test = row[0].trim().split(" ");
  //   const output = row[1].trim().split(" ");
  //   return { test, output };
  // });

  // console.log(getUniqCount(entries));
  console.log(getValueSum(entries));
});

function getUniqCount(entries) {
  let uniqOutputCount = 0;
  entries.forEach((entry) => {
    uniqOutputCount += entry.output.filter((num) =>
      [2, 3, 4, 7].includes(num.length)
    ).length;
  });

  return uniqOutputCount;
}

function convertSegmentsToNumber(segmentString, key) {
  const segments = segmentString.split("");
  const actualSegments = segments
    .map((garbledSegment) => key[garbledSegment])
    .sort()
    .join("");

  switch (actualSegments) {
    case "abcefg":
      return 0;
    case "cf":
      return 1;
    case "acdeg":
      return 2;
    case "acdfg":
      return 3;
    case "bcdf":
      return 4;
    case "abdfg":
      return 5;
    case "abdefg":
      return 6;
    case "acf":
      return 7;
    case "abcdefg":
      return 8;
    case "abcdfg":
      return 9;
  }
}

function getValueSum(entries) {
  return entries.reduce((sum, entry) => {
    const key = createKey(entry.test);
    const value = entry.output
      .map((segmentString) => convertSegmentsToNumber(segmentString, key))
      .join("");
    return sum + parseInt(value);
  }, 0);
}

function createKey(testInput) {
  const keyOptions = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
  };
  testInput
    .sort((first, second) => (first.length > second.length ? 1 : -1))
    .forEach((inputVal) => {
      const letters = inputVal.split("");
      if (letters.length == 2) {
        // must be 1
        keyOptions.c = letters;
        keyOptions.f = letters;
      }
      if (letters.length === 3) {
        // must be 7, so top is whatever isn't in 1
        keyOptions.a = letters.filter(
          (letter) => !keyOptions.c.includes(letter)
        );
        return;
      }
      if (letters.length === 4) {
        // must be 4, so the arm must be whatever isn't in 1
        keyOptions.b = letters.filter(
          (letter) => !keyOptions.c.includes(letter)
        );
        keyOptions.d = letters.filter(
          (letter) => !keyOptions.c.includes(letter)
        );
        return;
      }
      if (letters.length === 5) {
        // digit 3 is only one with five segments that also has the same segments as 1 digit
        const non1Letters = letters.filter(
          (letter) => !keyOptions.c.includes(letter)
        );
        const is3 = non1Letters.length === 3;
        if (is3) {
          non1Letters.forEach((letter) => {
            // we know the top already
            if (letter === keyOptions.a[0]) return;
            // check options on arm of 4, whatever matches is the horizontal one
            if (keyOptions.d.includes(letter)) {
              keyOptions.d = [letter];
              // deduction means we can define the vertical arm of 4
              keyOptions.b = keyOptions.b.filter(
                (bOption) => bOption !== letter
              );
              return;
            }
            // bottom is all wa have left
            keyOptions.g = [letter];
          });
        }
        return;
      }
      if (letters.length === 6) {
        if (keyOptions.c.length === 1) return; // already have a finished key
        // digit 6 is only one with six segments that doesn't include both segments of 1
        const oneSegments = letters.filter((letter) =>
          keyOptions.c.includes(letter)
        );
        const is6 = oneSegments.length === 1;
        if (is6) {
          keyOptions.f = oneSegments;
          keyOptions.c = keyOptions.c.filter(
            (cOption) => cOption !== keyOptions.f[0]
          );
        }
        return;
      }
      keyOptions.e = letters.filter(
        (letter) =>
          !Object.values(keyOptions)
            .reduce((mappedLetters, current) => {
              mappedLetters.push(current[0]);
              return mappedLetters;
            }, [])
            .includes(letter)
      );
    });
  const keyMap = Object.keys(keyOptions).reduce((final, key) => {
    final[keyOptions[key][0]] = key;
    return final;
  }, {});
  return keyMap;
}
