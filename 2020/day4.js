const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day4-input.csv", { encoding: "utf-8" }, (err, data) => {
  const rawData = papa.parse(data).data.map((row) => {
    return row[0];
  });

  const passports = [];
  let i = 0;
  let validCount = 0;
  rawData.forEach((row) => {
    if (row) {
      const passportData = passports[i] || [];
      passportData.push(row);
      passports[i] = passportData;
    } else {
      passports[i] = passports[i].join(" ");
      const isValid = isPassportValid(passports[i]);
      if (isValid) validCount++;
      i++;
    }
  });

  console.log(validCount);
});

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

function isPassportValid(credsString) {
  const fields = credsString.split(" ").reduce((totalCreds, cred) => {
    const [key, value] = cred.split(":");
    totalCreds[key] = value;
    return totalCreds;
  }, {});
  const hasInvalidField = requiredFields.some((fieldName) => {
    const isValid = isFieldValid(fieldName, fields);
    return !isValid;
  });
  return !hasInvalidField;
}

const eyeColors = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);
function isFieldValid(fieldName, fields) {
  switch (fieldName) {
    case "byr": {
      const yearNum = Number(fields.byr);
      const isValid = yearNum >= 1920 && yearNum <= 2002;
      return isValid;
    }
    case "iyr": {
      const yearNum = Number(fields.iyr);
      const isValid = yearNum >= 2010 && yearNum <= 2020;
      return isValid;
    }
    case "eyr": {
      const yearNum = Number(fields.eyr);
      const isValid = yearNum >= 2020 && yearNum <= 2030;
      return isValid;
    }
    case "hgt": {
      const valRE = /^([0-9]+)(cm|in)$/;
      const matches = (fields.hgt || "").match(valRE);
      if (matches) {
        const heightNum = Number(matches[1]);
        const heightUnit = matches[2];
        if (heightUnit === "cm") {
          return heightNum >= 150 && heightNum <= 193;
        } else if (heightUnit === "in") {
          return heightNum >= 59 && heightNum <= 76;
        }
      }
      return false;
    }
    case "hcl": {
      const isValid = Boolean((fields.hcl || "").match(/^#([0-9]|[a-f]){6}$/));
      return isValid;
    }
    case "ecl": {
      const isValid = eyeColors.has(fields.ecl);
      return isValid;
    }
    case "pid": {
      const isValid = Boolean((fields.pid || "").match(/^[0-9]{9}$/));
      return isValid;
    }
    default:
      return true;
  }
}
