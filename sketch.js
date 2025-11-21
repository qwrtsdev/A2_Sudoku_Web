let sudokuGrid; // current state of the Sudoku grid
let selectedRow = -1; // currently selected cell (row)
let selectedCol = -1; // currently selected cell (column)
let statusMessage = "Please load a puzzle"; // status message to display
let fileLoadedStatus = false; // flag to check if a file is loaded
let sudokuPlayStatus = false; // status of the sudoku game (playable or not)
let currentQuizRow = 0; // current row for empty cells quiz

function setup() {
    // get quiz div element
    const quizDiv = document.getElementById("quiz-input");
    quizDiv.classList.add("hidden"); // hide the quiz input div
    quizDiv.classList.remove("block");

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

    // if player is in play mode
    if (sudokuPlayStatus) {
        highlightSelectedCell(); // highlight the selected cell
    } else {
        emptyCellsQuizEnd(); // if not, check if quiz has ended
    }

    drawNumbers(20); // draw the numbers in the grid

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

    // if in quiz mode, highlight the current quiz row
    if (!sudokuPlayStatus) {
        highlightEmptyCells(currentQuizRow);
    }
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

function drawNumbers(size, xAxis = 0, yAxis = 0) {
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
                    textSize(size); // set text size from parameter

                    if (sudokuGrid[1][row][col] === false) {
                        fill(0); // black for un-editable numbers
                    } else {
                        fill(29, 78, 216); // blue for user input numbers (editable)
                    }

                    // calculate position to draw the number + offset by xAxis and yAxis parameter
                    let x = (col + xAxis) * cellWidth + cellWidth / 2;
                    let y = (row + yAxis) * cellHeight + cellHeight / 2;

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
    // select status text element in HTML
    const statusElement = document.querySelector(".status_text");
    statusElement.innerHTML = statusMessage;

    // check sudokuGrid[0] for any zeros
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudokuGrid[0][r][c] === 0) {
                return;
            }
        }
    }

    // if no zeros found, player will win
    statusElement.innerHTML = "You win!";

    // lock every cell so player can't edit
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

    statusMessage = "Save Successful.";
}

function loadFile() {
    // create an input element for selecting a file
    const input = document.createElement("input");
    input.type = "file"; // specify input type
    input.accept = ".sudoku"; // specify accepted file type for only .sudoku

    // event listener for when a file is selected
    input.onchange = async (event) => {
        const file = event.target.files[0]; // get the first selected file

        // if a file is selected
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

            // change status message to quiz mode
            statusMessage = `Enter the number of empty cells in row ${
                currentQuizRow + 1
            }`;

            // get quiz input div element
            const quizDiv = document.getElementById("quiz-input");
            quizDiv.classList.add("block"); // show the quiz input div
            quizDiv.classList.remove("hidden");

            fileLoadedStatus = true; // set file loaded status to true

            // get main element in HTML for adding empty cells answers
            const mainElement = document.getElementsByTagName("main")[0];
            const subElement = document.createElement("div"); // create sub element for inside main
            mainElement.classList.add("flex", "flex-row");
            subElement.classList.add("flex", "flex-col", "items-center");

            // create 9 div elements for displaying answers
            for (let i = 0; i < 9; i++) {
                const space = document.createElement("div");
                space.classList.add(
                    `max-h-[${height / 9}px]`,
                    "h-full",
                    "justify-center",
                    "flex",
                    "items-center"
                );
                space.id = `col-${i}`;
                subElement.appendChild(space);
            }

            mainElement.appendChild(subElement); // append sub element to be inside main
        } else {
            statusMessage = "Load Failed."; // update status message if load failed
        }
    };
    input.click(); // simulate a click to open file dialog
}

function countEmptyCells(row) {
    let cellCount = 0; // initialize count of empty cells in the row

    for (let col = 0; col < 9; col++) {
        if (sudokuGrid[0][row][col] === 0) {
            // check if cell is empty
            cellCount++; // if yes, increment count
        }
    }

    return cellCount; // return the total count of empty cells in the row
}

function highlightEmptyCells(row) {
    // if file is loaded
    if (fileLoadedStatus) {
        fill(0, 0, 0, 0);
        stroke(255, 0, 0);
        strokeWeight(4);

        let cellHeight = height / 9;

        // draw a frame that stretch across the entire row
        rect(0, row * cellHeight, width, cellHeight);
    }
}

function answerCheck() {
    // get the answer value from input field element
    const answerElement = document.getElementById("input-number");
    const answer = parseInt(answerElement.value);

    // check if the answer is correct
    if (answer === countEmptyCells(currentQuizRow)) {
        // get the right side text element in HTML
        const colNumberElement = document.getElementById(
            `col-${currentQuizRow}`
        );
        colNumberElement.classList.add("pl-8");
        colNumberElement.innerHTML = `${answer}`; // display the correct answer on the right side
        currentQuizRow++; // move to the next row

        statusMessage = `Enter the number of empty cells in row ${
            currentQuizRow + 1
        }`; // update status message
    } else {
        // if the answer is wrong
        statusMessage = "Wrong answer try again."; // update status message
    }

    answerElement.value = ""; // clear the input field element
}

function emptyCellsQuizEnd() {
    // check if all rows have been answered
    if (currentQuizRow > 8) {
        // get the quiz input div element
        const quizElement = document.getElementById("quiz-input");
        quizElement.classList.add("hidden"); // hide the quiz input div
        quizElement.classList.remove("block");

        statusMessage = "Status : ..."; // reset status message to normal status

        noStroke();
        sudokuPlayStatus = true; // change state to be able to play normal sudoku
    }
}
