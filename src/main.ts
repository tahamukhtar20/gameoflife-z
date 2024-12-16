import './index.css'
import { GameOfLife, renderGrid } from './setup';

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
const stopButton = document.getElementById("stopButton") as HTMLButtonElement;
const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
const randomizeButton = document.getElementById("randomizeButton") as HTMLButtonElement;
const randomize20Button = document.getElementById("randomize20Button") as HTMLButtonElement;
const speedRange = document.getElementById("speedRange") as HTMLInputElement;
const speedValue = document.getElementById("speedValue") as HTMLSpanElement;

let interval: any = null;
let speed = parseInt(speedRange.value);

speedRange.addEventListener("input", () => {
  speed = parseInt(speedRange.value);
  speedValue.textContent = `${speed}ms`;

  if (interval) {
    clearInterval(interval);
    interval = setInterval(simulate, speed);
  }
});


const rows = 30;
const cols = 75;
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

randomize20Button.addEventListener("click", () => {
  game.randomize20();
  update();
});

update();
