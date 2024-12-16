type Grid = number[][];

export class GameOfLife {
  private grid: Grid;
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createGrid();
  }

  private createGrid(): Grid {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  public reset(): void {
    this.grid = this.createGrid();
  }

  public nextGeneration(): void {
    const newGrid = this.createGrid();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const [aliveNeighbors, infectedNeighbors] = this.countNeighbors(row, col);

        if (this.grid[row][col] === 1) { // Alive
          if (aliveNeighbors === 2 || aliveNeighbors === 3) {
            newGrid[row][col] = 1; // Survive
          } else if (infectedNeighbors > aliveNeighbors) {
            newGrid[row][col] = 2; // Become infected
          } else {
            newGrid[row][col] = 0; // Die
          }
        } else if (this.grid[row][col] === 2) { // Infected
          if (infectedNeighbors + aliveNeighbors === 0) {
            newGrid[row][col] = 0; // Die
          } else if (infectedNeighbors === aliveNeighbors) {
            newGrid[row][col] = 2; // Stay infected
          } else if (aliveNeighbors > infectedNeighbors) {
            newGrid[row][col] = 1; // Recover to alive
          } else {
            newGrid[row][col] = 0; // Die
          }
        } else { // Dead
          if (aliveNeighbors === 3) {
            newGrid[row][col] = 1; // Become alive
          } else {
            newGrid[row][col] = 0; // Stay dead
          }
        }
      }
    }

    this.grid = newGrid;
  }

  private countNeighbors(row: number, col: number): [number, number] {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    let aliveCount = 0;
    let infectedCount = 0;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
        if (this.grid[newRow][newCol] === 1) aliveCount++;
        else if (this.grid[newRow][newCol] === 2) infectedCount++;
      }
    }

    return [aliveCount, infectedCount];
  }

  public toggleCell(row: number, col: number): void {
    this.grid[row][col] = (this.grid[row][col] + 1) % 3; // Cycle between states (0, 1, 2)
  }

  public getGrid(): Grid {
    return this.grid;
  }

  public randomize(): void {
    this.grid = this.grid.map(row => row.map(() => Math.floor(Math.random() * 3))); // Randomize between 0, 1, 2
  }

  public randomize20(): void {
    const startRow = Math.floor(this.rows / 2) - 10;
    const startCol = Math.floor(this.cols / 2) - 10;
    for (let row = startRow; row < startRow + 20; row++) {
      for (let col = startCol; col < startCol + 20; col++) {
        this.grid[row][col] = Math.floor(Math.random() * 3);
      }
    }
  }
}

export function renderGrid(canvas: HTMLCanvasElement, grid: Grid): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cellSize = 20;
  canvas.width = grid[0].length * cellSize;
  canvas.height = grid.length * cellSize;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) ctx.fillStyle = "black"; // Alive
      else if (cell === 2) ctx.fillStyle = "red"; // Infected
      else ctx.fillStyle = "white"; // Dead

      ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      ctx.strokeRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
    });
  });
}
