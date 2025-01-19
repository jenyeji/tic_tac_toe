function initTicTacToe() {
  const table = document.querySelector("table");

  Array.from({ length: 3 }).forEach((_, rowIndex) => {
    const row = document.createElement("tr");
    Array.from({ length: 3 }).forEach((_, colIndex) => {
      const cell = document.createElement("td");
      const button = document.createElement("button");
      button.id = `${rowIndex}.${colIndex}`;
      cell.append(button);
      row.append(cell);
    });
    table.append(row);
  });
}

function resetBoard(board) {
  board.forEach((row, r) => {
    row.forEach((_, c) => {
      board[r][c] = null; // Clear the logical board
      const button = document.getElementById(`${r}.${c}`);
      button.textContent = ""; // Clear the visual button
      button.disabled = false; // Enable the button
      button.style.cursor = "pointer"; // Enable cursor
    });
  });
}

function gameWon(board, r, c) {
  const player = board[r][c];

  // Check row
  if (board[r].every(cell => cell === player)) return true;

  // Check column
  if (board.every(row => row[c] === player)) return true;

  // Check diagonals
  const isMainDiagonal = r === c;
  const isAntiDiagonal = r + c === 2;

  if (isMainDiagonal && board.every((_, i) => board[i][i] === player)) return true;
  if (isAntiDiagonal && board.every((_, i) => board[i][2 - i] === player)) return true;

  return false;
}

function isDraw(board) {
  return board.every(row => row.every(cell => cell !== null));
}

function play() {
  const board = Array.from({ length: 3 }, () => Array(3).fill(null));
  const statusEl = document.querySelector("#game-status");
  const resetButton = document.querySelector("#reset");
  const players = ["X", "O"];
  let currentPlayer = players[0];
  let gameOver = false;

  // Initialize the game
  statusEl.textContent = `Player ${currentPlayer}'s Turn`;

  // Reset button functionality
  resetButton.addEventListener("click", () => {
    resetBoard(board);
    gameOver = false;
    currentPlayer = players[0];
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
  });

  // Handle button clicks for each cell
  const buttons = document.querySelectorAll("td button");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      if (gameOver) return;

      // Update the board state
      const [row, col] = button.id.split(".").map(Number);
      board[row][col] = currentPlayer;
      button.textContent = currentPlayer;
      button.disabled = true;
      button.style.cursor = "default";

      // Check for a win or draw
      if (gameWon(board, row, col)) {
        statusEl.textContent = `Player ${currentPlayer} Won!`;
        gameOver = true;
      } else if (isDraw(board)) {
        statusEl.textContent = "It's a Draw!";
        gameOver = true;
      } else {
        // Switch players
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        statusEl.textContent = `Player ${currentPlayer}'s Turn`;
      }
    });
  });
}

initTicTacToe();
play();
