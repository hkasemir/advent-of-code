const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day2-input.csv", { encoding: "utf-8" }, (err, data) => {
  let validPasswords1 = 0;
  let validPasswords2 = 0;
  papa.parse(data).data.forEach((row) => {
    const ruleAndPass = row[0];
    const [minMax, letterColon, password] = ruleAndPass.split(" ");
    const letter = letterColon[0];
    const [min, max] = minMax.split("-").map((numStr) => {
      return parseInt(numStr);
    });
    const timesLetterInPass = (password.match(new RegExp(letter, "g")) || [])
      .length;
    if (timesLetterInPass >= min && timesLetterInPass <= max) {
      validPasswords1++;
    }

    const isFirstIdxLetter = password[min - 1] === letter;
    const isSecondIdxLetter = password[max - 1] === letter;
    if (isFirstIdxLetter || isSecondIdxLetter) {
      if (!(isFirstIdxLetter && isSecondIdxLetter)) {
        validPasswords2++;
      }
    }
  });
  console.log({ validPasswords1, validPasswords2 });
});
