function Cell(){
    let value = null;
    const addToken = (token) => value = token;
    const getValue = () => value;
    return {addToken, getValue};
}

function Player(name, token){ 
    const playerName = name;
    return {playerName, token};
}

function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];
    for(let i = 0; i < rows; i++)
    {
        board[i] = [];
        for(let j = 0; j < columns; j++)
        {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, column, player) => {
        const selectedCell = board[row][column];
        if(selectedCell.getValue() !== null)
            return;
        selectedCell.addToken(player.token);
    }

    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    }

    return {getBoard, placeMarker, printBoard};
}

function GameController(playerOne = "Player One", playerTwo = "Player Two"){
    const firstPlayer = Player(playerOne, "0");
    const secondPlayer = Player(playerTwo, "X");

    const board = Gameboard();

    let activePlayer = firstPlayer;
    const switchPlayer = () => activePlayer === firstPlayer ? (activePlayer = secondPlayer) : (activePlayer = firstPlayer);
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().playerName}'s turn`);
    }

    const winCheck = () => {
        const boardArray = board.getBoard();
outerRowLoop:  for(let i = 0; i < 3; i++)
            {
                const mark = boardArray[i][0].getValue();
                for(let j = 1; j < 3; j++)
                {
                    if(boardArray[i][j].getValue() === null)
                        continue outerRowLoop;
                    
                    if(mark !== boardArray[i][j].getValue())
                        continue outerRowLoop;
                }
                console.log(`${activePlayer.playerName} wins!`);
                return activePlayer;
            }

outerColumnLoop:    for(let i = 0; i < 3; i++)
                    {
                        const mark = boardArray[0][i].getValue();
                        for(let j = 1; j < 3; j++)
                        {
                            if(boardArray[j][i].getValue() === null)
                                continue outerColumnLoop; 
                            if(mark !== boardArray[j][i].getValue())
                                continue outerColumnLoop;
                        }
                        console.log(`${activePlayer.playerName} wins!`);
                        return activePlayer;
                    }
        let mark = boardArray[0][0].getValue();
        if(mark === boardArray[1][1].getValue() && mark === boardArray[2][2].getValue() && mark !== null)
        {
            console.log(`${activePlayer.playerName} wins!`);
            return activePlayer;
        }

        mark = boardArray[0][2].getValue();
        if(mark === boardArray[1][1].getValue() && mark === boardArray[2][0].getValue() && mark !== null)
        {
            console.log(`${activePlayer.playerName} wins!`);
            return activePlayer;
        }
    }

    const playRound = (row, column) => {
        console.log(`Dropping ${getActivePlayer().playerName}'s token on ${row} row and ${column} column`);
        board.placeMarker(row, column, getActivePlayer());
        if(winCheck() === undefined)
        {
            switchPlayer();
            printNewRound();
        }  
    }

    printNewRound();

    return {playRound, getActivePlayer, getBoard : board.getBoard, winCheck};
}

function ScreenController(){
    let game = GameController();

    const turnContainer = document.querySelector(".turn");
    const boardContainer = document.querySelector(".board");
    const resultContainer = document.querySelector(".result");
    const startButton = document.querySelector(".start");
    const playerOneInput = document.querySelector("#name-one");
    const playerTwoInput = document.querySelector("#name-two");

    startButton.addEventListener("click", () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.disabled = false);
        const playerOneName = (playerOneInput.value || "Player One");
        const playerTwoName = (playerTwoInput.value || "Player Two");
        game = GameController(playerOneName, playerTwoName);
        playerOneInput.value = "";
        playerTwoInput.value = "";
        updateScreen();
    })

    const updateScreen = () => {
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                if(cell.getValue() !== null)
                {
                    cellButton.textContent = `${cell.getValue()}`;
                    cellButton.disabled = true;
                }
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = cellIndex;
                cellButton.classList.add("cell");
                cellButton.addEventListener("click", (e) => {
                    game.playRound(e.target.dataset.row, e.target.dataset.column);
                    updateScreen();
                })
                boardContainer.appendChild(cellButton);
            })
        })

        if(game.winCheck() === undefined)
        {
            turnContainer.textContent = `${activePlayer.playerName}'s turn`;
            resultContainer.textContent = "";
        }

        else{
            resultContainer.textContent = `${game.getActivePlayer().playerName} wins!`
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                cell.disabled = true;
            })
        }
    }

    updateScreen();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => { 
        cell.disabled = true;
    })
}

ScreenController();