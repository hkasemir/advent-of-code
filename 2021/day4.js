const fs = require("fs");
const papa = require("papaparse");

fs.readFile("./day4-input.csv", { encoding: "utf-8" }, (err, data) => {
  const rows = papa.parse(data).data;
  const numbersToCall = rows.shift();
  console.log({ numbersToCall });
  const boards = [];
  let currentBoard = [];
  for (let i = 1; i < rows.length; i++) {
    const inputStr = rows[i][0];
    if (inputStr) {
      currentBoard.push(inputStr);
    } else {
      currentBoard.length && boards.push(new BingoBoard(currentBoard));
      currentBoard = [];
    }
  }
  // findFirstWinner(boards, numbersToCall);
  findLastWinner(boards, numbersToCall);
});

function findLastWinner(boards, numbersToCall) {
  let lastWinner;
  for (let i = 0; i < numbersToCall.length; i++) {
    const number = numbersToCall[i];
    const nonWinners = boards.filter((board) => !board.callNumber(number));
    console.log(nonWinners.length);
    if (nonWinners.length === 1) {
      lastWinner = nonWinners[0];
    }
    if (!nonWinners.length) {
      console.log(lastWinner.board);
      console.log(lastWinner.calculateScore(number));
      break;
    }
  }
}

function findFirstWinner(boards, numbersToCall) {
  for (let i = 0; i < numbersToCall.length; i++) {
    const number = numbersToCall[i];
    const winner = boards.find((board) => board.callNumber(number));
    if (winner) {
      console.log(winner.board);
      console.log(winner.calculateScore(number));
      break;
    }
  }
}

class BingoBoard {
  board = [
    ["x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x"],
  ];

  constructor(boardInput) {
    this.board.forEach((row, idx) => {
      const inputRow = boardInput[idx].split(" ").filter(Boolean);
      this.board[idx] = inputRow;
    });
  }

  callNumber(number) {
    this.board = this.board.map((row) => replaceWith(row, number, "x"));
    return this.checkWin();
  }

  checkWin() {
    return this.board.some((row, idx) => {
      return isRowWin(row) || isColWin(this.board, idx);
    });
  }

  calculateScore(number) {
    const sumOfValsLeft = this.board.reduce((total, row) => {
      const rowScore = row.reduce(
        (score, val) => score + (parseInt(val) || 0),
        0
      );
      return total + rowScore;
    }, 0);

    return sumOfValsLeft * number;
  }
}

function replaceWith(array, valToReplace, newVal) {
  return array.map((value) => (value === valToReplace ? newVal : value));
}

function isRowWin(row) {
  return row.every((val) => val === "x");
}

function isColWin(board, idx) {
  return board.every((row) => row[idx] === "x");
}
