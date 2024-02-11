var misPiezas = new Array(7).fill(0).map(() => new Array(7).fill(0)); 
var turno1 = false;  
var play = true;
var falling = false;
const BOARD_ID = "board";
const YELLOW_COLOR = "var(--yellow)";
const RED_COLOR = "var(--red)";
const GREY_COLOR  = "var(--background-page)";
const HOVERING_ID = "hovering";
const BLUE_COLOR  = "var(--board-color)";

window.onload = async function() {
    createHoverCells(HOVERING_ID);
    await createDivsForCells(misPiezas, BOARD_ID); 
    const button = document.getElementById("play-button");
    button.addEventListener("click", async function(event){
        misPiezas = new Array(7).fill(0).map(() => new Array(7).fill(0)); 
        turno1 = false;
        falling = false;
        play = true;
        await createDivsForCells(misPiezas, BOARD_ID); 
        const button = document.getElementById("play-button");
        button.setAttribute("hidden", true);
        const message = document.getElementById("head-message");
        message.textContent = "";
    } );
};

function createHoverCells(containerId) {
    const container = document.getElementById(containerId);

    // Iterate over each element in the 2D array
    for (let i = 0; i < 7; i++) {
        // Create a div element for the cell
        const cellDiv = document.createElement('div');
        cellDiv.className = `cell`; // Add class 'hover' and 'cell-i' to the div
        
        // Set its ID to represent the coordinates
        cellDiv.id = `hover-${i}`;
        
        // Append the cell div to the hover div
        container.appendChild(cellDiv);
    }
}

async function createDivsForCells(twoDArray, containerId) {
    const container = document.getElementById(containerId);
    
    while (container.firstChild) {
        // Remove the first child of the container
        container.removeChild(container.firstChild);
    }

    // Iterate over each row in the 2D array
    for (let i = 0; i < twoDArray.length; i++) {
        // Create a div element for the row
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row'; // Add class 'row' to the div

        // Iterate over each cell in the row
        for (let j = 0; j < twoDArray[i].length; j++) {
            // Create a div element for the cell
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell'; // Add class 'cell' to the div
            
            // Set its ID to represent the coordinates
            cellDiv.id = `cell-${i}-${j}`;

            if(twoDArray[i][j] == 0){
                cellDiv.style.backgroundColor=GREY_COLOR;
            }else if(twoDArray[i][j] == 1){
                cellDiv.style.backgroundColor=RED_COLOR;
            }else{
                cellDiv.style.backgroundColor=YELLOW_COLOR;
            }
            
            cellDiv.addEventListener("mouseover",function(event) {
                const hoverdiv = document.getElementById(`hover-${j}`);
                if(play && !falling){
                    if(turno1){
                        hoverdiv.style.backgroundColor=RED_COLOR;
                    }else{
                        hoverdiv.style.backgroundColor=YELLOW_COLOR;
                    }
                }
            } );

            cellDiv.addEventListener("mouseout",function(event) {
                const hoverdiv = document.getElementById(`hover-${j}`);
                    hoverdiv.style.backgroundColor=GREY_COLOR;
            } );

            cellDiv.addEventListener("click",async function(event) {
                console.log(twoDArray);
                if(play && !falling){
                    if(twoDArray[0][j] === 0){
                        if(turno1){
                            twoDArray[0][j] = 1; // Change the value in the array
                        }else{
                            twoDArray[0][j] = 2; // Change the value in the array
                        }
                    } else {
                        document.getElementById('board').style.backgroundColor = RED_COLOR; // Change board color to red
                        setTimeout(function() {
                            document.getElementById('board').style.backgroundColor = BLUE_COLOR; // Change board color to green after 2 seconds
                        }, 2000);
                    }
                    await createDivsForCells(twoDArray, containerId);
                    
                    falling = true;

                    while(moveOneDown(twoDArray)){
                        await new Promise(resolve => setTimeout(resolve, 100));
                        createDivsForCells(twoDArray, containerId);
                    }
    
                    falling = false;

                    if(checkFourInARow(twoDArray)){
                        play = false;
                        const message = document.getElementById("head-message");
                        if(!turno1){
                            message.textContent = "Amarillas ganan";
                        }else{
                            message.textContent = "Rojas ganan";
                        }
                        
                        const button = document.getElementById("play-button");
                        button.removeAttribute("hidden");
;                    }else{                
                        turno1 = !turno1;
                    }
                }
            });
            // Append the cell div to the row div
            rowDiv.appendChild(cellDiv);
        }
        
        // Append the row div to the container
        container.appendChild(rowDiv);
    
    }

    
}

function checkFourInARow(array) {
    const rows = array.length;
    const cols = array[0].length;

    // Check horizontally
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            if (array[row][col] !== 0 &&
                array[row][col] === array[row][col + 1] &&
                array[row][col] === array[row][col + 2] &&
                array[row][col] === array[row][col + 3]) {
                return true;
            }
        }
    }

    // Check vertically
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            if (array[row][col] !== 0 &&
                array[row][col] === array[row + 1][col] &&
                array[row][col] === array[row + 2][col] &&
                array[row][col] === array[row + 3][col]) {
                return true;
            }
        }
    }

    // Check diagonally (from top-left to bottom-right)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= cols - 4; col++) {
            if (array[row][col] !== 0 &&
                array[row][col] === array[row + 1][col + 1] &&
                array[row][col] === array[row + 2][col + 2] &&
                array[row][col] === array[row + 3][col + 3]) {
                return true;
            }
        }
    }

    // Check diagonally (from top-right to bottom-left)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = cols - 1; col >= 3; col--) {
            if (array[row][col] !== 0 &&
                array[row][col] === array[row + 1][col - 1] &&
                array[row][col] === array[row + 2][col - 2] &&
                array[row][col] === array[row + 3][col - 3]) {
                return true;
            }
        }
    }

    return false;
}

function moveOneDown(array) {
    const rows = array.length;
    const cols = array[0].length;
    let moved = false;

    for (let row = rows - 2; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
            if ((array[row][col] === 1 || array[row][col] === 2) && array[row + 1][col] === 0) {
                array[row + 1][col] = array[row][col];
                array[row][col] = 0;
                moved = true;
            }
        }
    }

    return moved;
}