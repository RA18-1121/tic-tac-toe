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

    const placetokener = (row, column, player) => {
        const selectedCell = board[row][column];
        if(selectedCell.getValue() !== null)
            return;
        selectedCell.addToken(player.token);
    }

    return {getBoard, placetokener};
}

function GameController(playerOne = "Player One", playerTwo = "Player Two"){
    const firstPlayer = Player(playerOne, "0");
    const secondPlayer = Player(playerTwo, "X");
    const board = Gameboard();
    let activePlayer = firstPlayer;

    const switchPlayer = () => activePlayer === firstPlayer ? (activePlayer = secondPlayer) : (activePlayer = firstPlayer);

    const getActivePlayer = () => activePlayer;

    const winCheck = () => {
        const boardArray = board.getBoard();
        let match;
outerRowLoop:  for(let i = 0; i < 3; i++)
                {
                    const token = boardArray[i][0].getValue();
                    for(let j = 1; j < 3; j++)
                    {
                        if(boardArray[i][j].getValue() === null)
                            continue outerRowLoop;
                        
                        if(token !== boardArray[i][j].getValue())
                            continue outerRowLoop;
                    }
                    match = `row${i}`;
                    return {activePlayer, match};
                }

outerColumnLoop:    for(let i = 0; i < 3; i++)
                    {
                        const token = boardArray[0][i].getValue();
                        for(let j = 1; j < 3; j++)
                        {
                            if(boardArray[j][i].getValue() === null)
                                continue outerColumnLoop; 
                            if(token !== boardArray[j][i].getValue())
                                continue outerColumnLoop;
                        }
                        match = `column${i}`
                        return {activePlayer, match};
                    }
        let token = boardArray[0][0].getValue();
        if(token === boardArray[1][1].getValue() && token === boardArray[2][2].getValue() && token !== null)
        {
            match = `diagonal1`;
            return {activePlayer, match};
        }

        token = boardArray[0][2].getValue();
        if(token === boardArray[1][1].getValue() && token === boardArray[2][0].getValue() && token !== null)
        {
            match = `diagonal2`;
            return {activePlayer, match};
        }
    }

    const drawCheck = () => {
        const boardArray = board.getBoard();
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                if(boardArray[i][j].getValue() === null)
                    return false;
            }
        }
        return true;
    }

    const playRound = (row, column) => {
        board.placetokener(row, column, getActivePlayer());
        if(winCheck() === undefined)
        {
            switchPlayer();
        }  
    }

    return {playRound, getActivePlayer, getBoard : board.getBoard, winCheck, drawCheck};
}

(function ScreenController(){
    let game = GameController();
    
    const boardContainer = document.querySelector(".board");
    const resultContainer = document.querySelector(".result");
    const turnContainer = document.querySelector(".turn");
    const startButton = document.querySelector(".start");
    const playerOneInput = document.querySelector("#name-one");
    const playerTwoInput = document.querySelector("#name-two");

    startButton.addEventListener("click", () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.disabled = false);

        const playerOne = (playerOneInput.value || "Player One");
        const playerTwo = (playerTwoInput.value || "Player Two");
        game = GameController(playerOne, playerTwo);
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
        
        checkresult();
    }

    const checkresult = () => {
        const result = game.winCheck();
        const activePlayer = game.getActivePlayer();

        if(result === undefined)
        {
            if(game.drawCheck())
            {
                resultContainer.textContent = `Game draw!`
                turnContainer.textContent = "Click Start to play again."
            }
            else
            {
                turnContainer.textContent = `${activePlayer.playerName}'s turn`;
                resultContainer.textContent = "";
            }
        }

        else
        {
            resultContainer.textContent = `${game.getActivePlayer().playerName} wins!`
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => {
                cell.disabled = true;
            })

            const index = result.match.at(-1);
            if(result.match.includes("row"))
            {
                cells.forEach((cell) => {
                    if(cell.dataset.row == index)
                    {
                        cell.style.backgroundColor = "yellow";
                    }
                })
            }

            if(result.match.includes("column"))
            {
                cells.forEach((cell) => {
                    if(cell.dataset.column == index)
                    {
                        cell.style.backgroundColor = "yellow";
                    }
                })
            }

            if(result.match.includes("diagonal1"))
            {
                cells.forEach((cell) => {
                    if(cell.dataset.row === cell.dataset.column)
                    {
                        cell.style.backgroundColor = "yellow";
                    }
                })
            }

            if(result.match.includes("diagonal2"))
            {
                cells.forEach((cell) => {
                    if(Number(cell.dataset.row) + Number(cell.dataset.column) === 2)
                    {
                        cell.style.backgroundColor = "yellow";
                    }
                })
            }

            turnContainer.textContent = "Click Start to play again."
        }
    }

    updateScreen();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => { 
        cell.disabled = true;
    })
    turnContainer.textContent = "Click Start to play."
})()