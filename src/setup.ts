type Grid = number[][];

export class GameOfLife {
  private grid: Grid;
  public rows: number;
  public cols: number;
  public infectionEnabled: boolean; // Flag to enable/disable infection behavior

  constructor(rows: number, cols: number, infectionEnabled: boolean = false) {
    this.rows = rows;
    this.cols = cols;
    this.infectionEnabled = infectionEnabled; // Set default value to true (infection enabled)
    this.grid = this.createGrid();
  }

  private createGrid(): Grid {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  public reset(): void {
    this.grid = this.createGrid();
  }

  public placeRandomPatterns(): void {
    this.placePattern(this.glider(), 5);
    this.placePattern(this.blinker(), 5);
    this.placePattern(this.rPentomino(), 5);
  }

  private placePattern(pattern: number[][], amount: number): void {
    for (let i = 0; i < amount; i++) {
      const startRow = Math.floor(Math.random() * (this.rows - pattern.length));
      const startCol = Math.floor(Math.random() * (this.cols - pattern[0].length));

      for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[0].length; col++) {
          this.grid[startRow + row][startCol + col] = pattern[row][col];
        }
      }
    }
  }

  private glider(): number[][] {
    return [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1]
    ];
  }

  private blinker(): number[][] {
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ];
  }

  private rPentomino(): number[][] {
    return [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ];
  }

  public nextGeneration(): void {
    const newGrid = this.createGrid();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const [aliveNeighbors, infectedNeighbors] = this.countNeighbors(row, col);

        if (this.grid[row][col] === 1) { // Alive
          if (aliveNeighbors === 2 || aliveNeighbors === 3) {
            newGrid[row][col] = 1; // Survive
          } else if (this.infectionEnabled && infectedNeighbors > aliveNeighbors) {
            newGrid[row][col] = 2; // Become infected
          } else if (aliveNeighbors === 0) {
            newGrid[row][col] = 0; // Die
          }
          if (Math.random() < 0.02 && this.infectionEnabled) {
            newGrid[row][col] = 2; // Become infected
          }
        } else if (this.grid[row][col] === 2) { // Infected
          if (this.infectionEnabled) {
            if (infectedNeighbors + aliveNeighbors === 0) {
              newGrid[row][col] = 0; // Die
            } else if (infectedNeighbors === aliveNeighbors) {
              newGrid[row][col] = 2; // Stay infected
            } else if (aliveNeighbors > infectedNeighbors) {
              newGrid[row][col] = 1; // Recover to alive
            } else {
              newGrid[row][col] = 0; // Die
            }
            if (Math.random() < 0.02) {
              newGrid[row][col] = 1; // Recover to alive
            }
            if (Math.random() < 0.1) {
              newGrid[row][col] = 0; // Die
            }
          } else {
            newGrid[row][col] = 1; // Stay alive if infection is disabled
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
    if (this.infectionEnabled)
      this.grid = this.grid.map(row => row.map(() => Math.floor(Math.random() * 3)));
    else
      this.grid = this.grid.map(row => row.map(() => Math.floor(Math.random() * 2)));
  }
}

export function renderGrid(canvas: HTMLCanvasElement, grid: Grid): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 700
  const cellSize = canvas.width / grid[0].length;
  canvas.height = grid.length * cellSize;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.2;

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
