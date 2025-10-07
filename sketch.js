let sudokuGrid; // current state of the Sudoku grid
let selectedRow = -1; // currently selected cell (row)
let selectedCol = -1; // currently selected cell (column)
let statusMessage = "Status :"; // status message to display

function setup() {
    createCanvas(500, 500); // create a 500x500 pixel canvas

    // initialize a 9x9 grid with all zeros and all editable cells
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

    gameEvent();

    highlightSelectedCell(); // highlight the selected cell

    drawNumbers(); // draw the numbers in the grid

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
        fill(150);
        noStroke();

        let cellWidth = width / 9;
        let cellHeight = height / 9;

        // draw rectangle background on selected cell
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
        let cellWidth = width / 9;
        let cellHeight = height / 9;

        for (let row = 0; row < 9; row++) {
            // loop through rows
            for (let col = 0; col < 9; col++) {
                // loop through columns

                // add grey background for un-editable cells
                if (sudokuGrid[1][row][col] === false) {
                    fill(180); // grey background for un-editable cells
                    noStroke();
                    rect(
                        col * cellWidth,
                        row * cellHeight,
                        cellWidth,
                        cellHeight
                    );
                }

                // draw numbers
                if (sudokuGrid[0][row][col] !== 0) {
                    // if number is not zero from sudokuGrid[0]
                    noStroke(); // remove stroke for text
                    textAlign(CENTER, CENTER); // align text to center of cell
                    textSize(20); // set text size

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

                // Check if this number would be valid at this position
                if (isValidNumber(num, selectedRow, selectedCol)) {
                    statusMessage = "Status : Okay :)";
                } else {
                    statusMessage = "Status : Not Okay :(";
                }

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

function isValidNumber(num, row, col) {
    // Check row for duplicates
    for (let c = 0; c < 9; c++) {
        if (c !== col && sudokuGrid[0][row][c] === num) {
            return false; // Duplicate found in row
        }
    }

    // Check column for duplicates
    for (let r = 0; r < 9; r++) {
        if (r !== row && sudokuGrid[0][r][col] === num) {
            return false; // Duplicate found in column
        }
    }

    // Check 3x3 subgrid for duplicates
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== row || c !== col) && sudokuGrid[0][r][c] === num) {
                return false; // Duplicate found in 3x3 box
            }
        }
    }

    return true; // Number is valid at this position
}

function gameEvent() {
    const statusElement = document.querySelector(".status_text");
    statusElement.innerHTML = statusMessage;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudokuGrid[0][r][c] === 0) {
                return;
            }
        }
    }

    statusElement.innerHTML = "You win!";

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            sudokuGrid[1][r][c] = false;
        }
    }
}

function saveFile() {
    // create a string of the sudokuGrid
    let content = sudokuGrid
        .map((row) => row.join("*"))
        .join("\n#\n")
        .trim();

    // create a blob and a link with metadeta
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date();
    a.download = `${date.toISOString()}.sudoku`;

    // simulate a click to download the file
    document.body.appendChild(a);
    a.click();

    // remove the link
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadFile() {
    // create an input element for selecting a file
    const input = document.createElement("input");
    input.type = "file"; // specify input type
    input.accept = ".sudoku"; // specify accepted file type for only .sudoku

    // event listener for when a file is selected
    input.onchange = async (event) => {
        const file = event.target.files[0]; // get the first selected file

        if (file) {
            const text = await file.text(); // read the file content as text string
            // split the string into lines
            const loadedData = text
                .trim()
                .split("\n#\n")
                .map((line) =>
                    line
                        .trim()
                        .split("*")
                        .map((row) => row.split(","))
                );

            // parse the numbers into sudokuGrid
            sudokuGrid[0] = loadedData[0].map((row) =>
                row.map((num) => parseInt(num))
            );

            // parse the booleans into sudokuGrid
            sudokuGrid[1] = loadedData[1].map((row) =>
                row.map((bool) => {
                    if (bool === "true") return true;
                    else return false;
                })
            );

            // reset selected cell
            selectedRow = -1;
            selectedCol = -1;
        }
    };
    input.click(); // simulate a click to open file dialog
}
