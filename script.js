function Cell(){
    let value = null;
    const addToken = (token) => value = token;
    const getValue = () => value;
    return {addToken, getValue};
}

function Player(){
    let token = -1;
    return function newPlayer(name){
        token++;
        const playerName = name;
        return {playerName, token};
    }
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

function GameController(){
    const createPlayer = Player();
    const firstPlayer = createPlayer("Rachit");
    const secondPlayer = createPlayer("Agrawal");

    const board = Gameboard();

    let activePlayer = firstPlayer;
    const switchPlayer = () => activePlayer === firstPlayer ? (activePlayer = secondPlayer) : (activePlayer = firstPlayer);
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().playerName}'s turn`);
    }

    const playRound = (row, column) => {
        console.log(`Dropping ${getActivePlayer().playerName}'s token on ${row} row and ${column} column`);
        board.placeMarker(row, column, getActivePlayer());
        switchPlayer();
        printNewRound();
    }

    printNewRound();

    return {playRound, getActivePlayer, getBoard : board.getBoard};
}

function ScreenController(){
    const game = GameController();

    const turnContainer = document.querySelector(".turn");
    const boardContainer = document.querySelector(".board");

    const updateScreen = () => {
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                if(cell.getValue() !== null)
                    cellButton.textContent = `${cell.getValue()}`;
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = cellIndex;
                cellButton.addEventListener("click", (e) => {
                    game.playRound(e.target.dataset.row, e.target.dataset.column);
                    updateScreen();
                })
                boardContainer.appendChild(cellButton);
            })
        })

        turnContainer.textContent = `${activePlayer.playerName}'s turn`;
    }

    updateScreen();
}

ScreenController();