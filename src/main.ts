import './index.css'
import { GameOfLife, renderGrid } from './setup';

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
const stopButton = document.getElementById("stopButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const randomizeButton = document.getElementById("randomizeButton") as HTMLButtonElement;
const randomPatternButton = document.getElementById("randomPatternButton") as HTMLButtonElement;
const speedRange = document.getElementById("speedRange") as HTMLInputElement;
const speedValue = document.getElementById("speedValue") as HTMLSpanElement;
const toggleInfection = document.getElementById("toggleInfection") as HTMLInputElement;

// Sliders for rows and columns
const rowsRange = document.getElementById("rowsRange") as HTMLInputElement;
const colsRange = document.getElementById("colsRange") as HTMLInputElement;
const rowsValue = document.getElementById("rowsValue") as HTMLSpanElement;
const colsValue = document.getElementById("colsValue") as HTMLSpanElement;

let interval: any = null;
let speed = parseInt(speedRange.value);
let rows = parseInt(rowsRange.value);
let cols = parseInt(colsRange.value);

speedRange.addEventListener("input", () => {
  speed = parseInt(speedRange.value);
  speedValue.textContent = `${speed}ms`;

  if (interval) {
    clearInterval(interval);
    interval = setInterval(simulate, speed);
  }
});

rowsRange.addEventListener("input", () => {
  rows = parseInt(rowsRange.value);
  rowsValue.textContent = rows.toString();
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  game.reset();
  game.rows = rows;
  update();

});

colsRange.addEventListener("input", () => {
  cols = parseInt(colsRange.value);
  colsValue.textContent = cols.toString();
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  game.reset();
  game.cols = cols;
  update();
});

const game = new GameOfLife(rows, cols);

function update() {
  renderGrid(canvas, game.getGrid());
}

function simulate() {
  game.nextGeneration();
  update();
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const cellSize = canvas.width / cols;
  const col = Math.floor((event.clientX - rect.left) / cellSize);
  const row = Math.floor((event.clientY - rect.top) / cellSize);

  game.toggleCell(row, col);
  update();
});

stopButton.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

startButton.addEventListener("click", () => {
  if (!interval) {
    interval = setInterval(simulate, speed);
  }
});

resetButton.addEventListener("click", () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  game.reset();
  update();
});

randomizeButton.addEventListener("click", () => {
  game.randomize();
  update();
});

randomPatternButton.addEventListener("click", () => {
  game.placeRandomPatterns();
  update();
});

toggleInfection.addEventListener("change", () => {
  if (toggleInfection.checked) {
    game.infectionEnabled = true;
  } else {
    game.infectionEnabled = false;
  }
  update();
});

update();
