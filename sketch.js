let sudokuGrid; // current state of the Sudoku grid
let fixedCells; // track pre-generated grids
let selectedRow = -1; // currently selected cell (row)
let selectedCol = -1; // currently selected cell (column)

function setup() {
    createCanvas(500, 500); // create a 500x500 pixel canvas

    let result = generateSudokuNumbers(); // run the function and parse results to variable

    // assign parsed results to global variables
    sudokuGrid = result.puzzle;
    fixedCells = result.fixed;
}

function draw() {
    background(220); // set background color

    drawSudokuGrid(); // draw the Sudoku grid

    highlightSelectedCell(); // highlight the selected cell

    drawNumbers(); // draw the numbers in the grid
}

function drawSudokuGrid() {
    // draw tiny 3*3 grids with thin lines
    stroke(0);
    strokeWeight(1);
    for (let i = 1; i < 9; i++) {
        line((i * width) / 9, 0, (i * width) / 9, height);
        line(0, (i * height) / 9, width, (i * height) / 9);
    }

    // draw big 3*3 grids with thick lines
    stroke(0);
    strokeWeight(3);
    line(width / 3, 0, width / 3, height);
    line((2 * width) / 3, 0, (2 * width) / 3, height);
    line(0, height / 3, width, height / 3);
    line(0, (2 * height) / 3, width, (2 * height) / 3);
}

function highlightSelectedCell() {
    // highlight on selected cell
    if (selectedRow >= 0 && selectedCol >= 0) {
        fill(173);
        noStroke();

        let cellWidth = width / 9;
        let cellHeight = height / 9;

        // draw rectangle on selected cell
        rect(
            selectedCol * cellWidth,
            selectedRow * cellHeight,
            cellWidth,
            cellHeight
        );
    }
}

function drawNumbers() {
    // display numbers in the grid
    if (sudokuGrid) {
        noStroke(); // remove stroke for text
        textAlign(CENTER, CENTER); // align text to center of cell
        textSize(20); // set text size

        for (let row = 0; row < 9; row++) {
            // loop through rows
            for (let col = 0; col < 9; col++) {
                // loop through columns
                if (sudokuGrid[row][col] !== 0) {
                    // if number is not zero
                    if (fixedCells && fixedCells[row][col]) {
                        fill(0); // black for fixed numbers
                    } else {
                        fill(29, 78, 216); // blue for user numbers
                    }

                    // calculate position from width and height of rows and columns
                    let x = (col * width) / 9 + width / 18;
                    let y = (row * height) / 9 + height / 18;
                    text(sudokuGrid[row][col], x, y); // place number in cell
                }
            }
        }
    }
}

// p5js event function when mouse is pressed
function mousePressed() {
    // calculate which cell was clicked (mouse position)
    let cellWidth = width / 9;
    let cellHeight = height / 9;
    selectedCol = Math.floor(mouseX / cellWidth);
    selectedRow = Math.floor(mouseY / cellHeight);

    // if the mouse isn't inside the grid will reset the selection
    if (
        selectedRow < 0 ||
        selectedRow >= 9 ||
        selectedCol < 0 ||
        selectedCol >= 9
    ) {
        selectedRow = -1;
        selectedCol = -1;
    }
}

// p5js event function when a keyboard is pressed
function keyPressed() {
    // check if a cell is selected
    if (selectedRow >= 0 && selectedCol >= 0) {
        // check if the cell is not a fixed numbers
        if (!fixedCells || !fixedCells[selectedRow][selectedCol]) {
            if (key >= "1" && key <= "9") {
                // if key is a number between 1-9
                let num = parseInt(key);
                sudokuGrid[selectedRow][selectedCol] = num; // set the cell (array) to input number
            } else if (
                // if key is delete, backspace, or space
                keyCode === DELETE ||
                keyCode === BACKSPACE ||
                keyCode === " "
            ) {
                // clear the cell
                sudokuGrid[selectedRow][selectedCol] = 0;
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

    // create a puzzle by removing some numbers (but keeping only 20-30 numbers)
    let puzzle = []; // copy of original grid
    let fixed = []; // copy of fixed numbers in cells
    for (let i = 0; i < 9; i++) {
        puzzle[i] = [];
        fixed[i] = [];
        for (let j = 0; j < 9; j++) {
            puzzle[i][j] = grid[i][j]; // copy the number
            fixed[i][j] = true; // initially make all cells to be fixed numbers
        }
    }

    // remove numbers randomly
    let numbersToRemove = 55; // remove 55 numbers
    for (let i = 0; i < numbersToRemove; i++) {
        let row = Math.floor(Math.random() * 9); // random row
        let col = Math.floor(Math.random() * 9); // random column
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            fixed[row][col] = false; // Mark as not fixed (editable)
        } else {
            i--; // try again if cell is already empty
        }
    }

    // console.log(puzzle);
    return { puzzle: puzzle, fixed: fixed };
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

                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(grid, row, col, num) {
    // check all rows
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    // check all columns
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
