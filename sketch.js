let sudokuGrid;

function setup() {
    createCanvas(500, 500);
    sudokuGrid = generateSudokuNumbers();
}

function draw() {
    background(220);

    // draw tiny grids with thin lines
    strokeWeight(1);
    for (let i = 1; i < 9; i++) {
        line((i * width) / 9, 0, (i * width) / 9, height);
        line(0, (i * height) / 9, width, (i * height) / 9);
    }

    // draw 3*3 grids with thick lines
    strokeWeight(3);
    line(width / 3, 0, width / 3, height);
    line((2 * width) / 3, 0, (2 * width) / 3, height);
    line(0, height / 3, width, height / 3);
    line(0, (2 * height) / 3, width, (2 * height) / 3);

    // display numbers in the grid
    if (sudokuGrid) {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20);

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuGrid[row][col] !== 0) {
                    // only display non-zero numbers
                    let x = (col * width) / 9 + width / 18;
                    let y = (row * height) / 9 + height / 18;
                    text(sudokuGrid[row][col], x, y);
                }
            }
        }
    }
}

function generateSudokuNumbers() {
    // create a 9x9 grid filled with zeros
    let grid = [];
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }

    // generate a Sudoku
    solveSudoku(grid);

    // create a puzzle by removing numbers (keeping only 20-30 numbers)
    let puzzle = [];
    for (let i = 0; i < 9; i++) {
        puzzle[i] = [];
        for (let j = 0; j < 9; j++) {
            puzzle[i][j] = grid[i][j];
        }
    }

    // remove numbers randomly
    let numbersToRemove = 55; // remove 55 numbers, leaving ~26 clues
    for (let i = 0; i < numbersToRemove; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
        } else {
            i--; // try again if cell is already empty
        }
    }

    return puzzle;
}

function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                // try numbers 1-9
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solveSudoku(grid)) {
                            return true;
                        }

                        grid[row][col] = 0; // backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(grid, row, col, num) {
    // check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    // check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }

    // check 3x3 box
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}
