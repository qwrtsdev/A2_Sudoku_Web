let sudokuGrid; // current state of the Sudoku grid
let fixedCells; // track pre-generated grids
let selectedRow = -1; // currently selected cell (row)
let selectedCol = -1; // currently selected cell (column)

function setup() {
    createCanvas(500, 500);

    sudokuGrid = [
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true],
        ],
    ];
}

function draw() {
    background(220); // set background color

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

    highlightSelectedCell(); // highlight the selected cell

    drawNumbers(); // draw the numbers in the grid
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
    if (sudokuGrid && sudokuGrid[0] && sudokuGrid[1]) {
        noStroke(); // remove stroke for text
        textAlign(CENTER, CENTER); // align text to center of cell
        textSize(20); // set text size

        for (let row = 0; row < 9; row++) {
            // loop through rows
            for (let col = 0; col < 9; col++) {
                // loop through columns
                if (sudokuGrid[0][row][col] !== 0) {
                    // if number is not zero from sudokuGrid[0]
                    if (sudokuGrid[1][row][col] === false) {
                        fill(0); // black for un-editable numbers
                    } else {
                        fill(29, 78, 216); // blue for user input numbers (editable)
                    }

                    // calculate position from width and height of rows and columns
                    let x = (col * width) / 9 + width / 18;
                    let y = (row * height) / 9 + height / 18;
                    text(sudokuGrid[0][row][col], x, y); // place number from sudokuGrid[0]
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
        // check if the cell is editable (true means editable)
        if (sudokuGrid[1][selectedRow][selectedCol] === true) {
            if (key >= "1" && key <= "9") {
                // if key is a number between 1-9
                let num = parseInt(key);
                sudokuGrid[0][selectedRow][selectedCol] = num; // set the cell in sudokuGrid[0]
            } else if (
                // if key is delete, backspace, or space
                keyCode === DELETE ||
                keyCode === BACKSPACE ||
                keyCode === " "
            ) {
                // clear the cell
                sudokuGrid[0][selectedRow][selectedCol] = 0;
            }
        }
    }
}

function saveFile() {
    console.log(sudokuGrid);
    let content = sudokuGrid
        .map((row) => row.join(" "))
        .join("\n")
        .trim();
    console.log(content);

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date();
    a.download = `sudoku_${date.toISOString()}.sudoku`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".sudoku";

    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const text = await file.text();
            sudokuGrid = text
                .trim()
                .split("\n")
                .map((line) =>
                    line
                        .trim()
                        .split(" ")
                        .map((num) => parseInt(num))
                );
            fixedCells = sudokuGrid.map((row) => row.map((num) => num !== 0));
            console.log(sudokuGrid);
        }
    };
    input.click();
}
