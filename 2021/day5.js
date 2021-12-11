const fs = require("fs");
const papa = require("papaparse");

const testdata = [
  "0,9 -> 5,9",
  "8,0 -> 0,8",
  "9,4 -> 3,4",
  "2,2 -> 2,1",
  "7,0 -> 7,4",
  "6,4 -> 2,0",
  "0,9 -> 2,9",
  "3,4 -> 1,4",
  "0,0 -> 8,8",
  "5,5 -> 8,2",
];
fs.readFile("./day5-input.csv", { encoding: "utf-8" }, (err, data) => {
  const coordinates = papa.parse(data).data.map((row) => {
    const x1 = parseInt(row[0]);
    const y2 = parseInt(row[2]);
    const [y1, arrow, x2] = row[1].split(" ");
    return {
      x1,
      y1: parseInt(y1),
      x2: parseInt(x2),
      y2,
    };
  });
  // const coordinates = testdata.map((row) => {
  //   const rowsplit = row.split(",");
  //   const x1 = parseInt(rowsplit[0]);
  //   const y2 = parseInt(rowsplit[2]);
  //   const [y1, arrow, x2] = rowsplit[1].split(" ");
  //   return {
  //     x1,
  //     y1: parseInt(y1),
  //     x2: parseInt(x2),
  //     y2,
  //   };
  // });
  // console.log(coordinates);
  const field = new VentField(1000);
  coordinates.forEach((coord) => field.drawVent(coord));
  // console.log(field.field.map((row) => row.join("")));
  console.log(field.countDangerousPoints());
});

class VentField {
  field = [];
  size = 0;
  constructor(size) {
    this.size = size;
    for (let i = 0; i < size; i++) {
      this.field.push(new Array(size).fill(0));
    }
  }

  drawVent({ x1, x2, y1, y2 }) {
    if (x1 === x2 || y1 === y2) {
      for (let i = min(x1, x2); i <= max(x1, x2); i++) {
        for (let j = min(y1, y2); j <= max(y1, y2); j++) {
          this.field[j][i] += 1;
        }
      }
    } else if (Math.abs(x1 - x2) === Math.abs(y1 - y2)) {
      let lengthLeft = Math.abs(x1 - x2);
      let i = x1;
      let j = y1;
      while (lengthLeft >= 0) {
        this.field[j][i] += 1;
        x1 < x2 ? i++ : i--;
        y1 < y2 ? j++ : j--;
        lengthLeft--;
      }
    } else {
      console.log("not a horizontal or vertical line", { x1, x2, y1, y2 });
    }
  }

  countDangerousPoints() {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j <= this.size; j++) {
        if (this.field[i][j] > 1) count++;
      }
    }
    return count;
  }
}

function min(num1, num2) {
  return num1 < num2 ? num1 : num2;
}

function max(num1, num2) {
  return num1 > num2 ? num1 : num2;
}
