function initTable(n) {
  const table = document.querySelector('table');
  // clean up any previous table
  table.replaceChildren();

  Array.from({ length: n }).forEach((_, rowIndex) => {
    const row = document.createElement('tr');
    Array.from({ length: n }).forEach((_, colIndex) => {
      const td = document.createElement('td');
      const button = document.createElement('button');
      button.id = `${rowIndex}.${colIndex}`;
      td.append(button);
      row.append(td);
    });
    table.append(row);
  });
}

function resetBoard(board) {
  board.forEach((row, r) => {
    row.forEach((_, c) => {
      board[r][c] = null;
      const cell = document.getElementById(`${r}.${c}`);
      if (!cell) {
        console.log(r, c);
        console.log(board);
      }
      cell.textContent = '';
      cell.disabled = false;
      cell.style.cursor = 'pointer';
    });
  });
}

function gameWon(board, r, c, n) {
  const player = board[r][c];

  // Check row
  if (board[r].every((cell) => cell === player)) return true;
  // Check column
  if (board.every((row) => row[c] === player)) return true;
  // Check diagonals
  const isMainDiagonal = r === c;
  const isAntiDiagonal = r + c === n - 1;
  if (isMainDiagonal && board.every((_, i) => board[i][i] === player))
    return true;
  if (isAntiDiagonal && board.every((_, i) => board[i][n - 1 - i] === player))
    return true;

  return false;
}

function isDraw(board) {
  return board.every((row) => row.every((cell) => cell !== null));
}

function play(n) {
  initTable(n);

  const board = Array.from({ length: n }, () =>
    Array.from({ length: n }).fill(null)
  );
  const statusEl = document.querySelector('#game-status');
  const resetButton = document.querySelector('#reset');
  const players = ['X', 'O'];
  let currentPlayer = players[0];
  let gameOver = false;

  statusEl.textContent = `Player ${currentPlayer}'s Turn`;

  // Clear all previous event listeners by cloning the reset button
  const newResetButton = resetButton.cloneNode(true);
  newResetButton.addEventListener('click', () => {
    resetBoard(board);
    gameOver = false;
    currentPlayer = players[0];
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
  });
  resetButton.parentNode.replaceChild(newResetButton, resetButton);

  const cells = document.querySelectorAll('td button');
  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      if (gameOver) return;

      // Update the board state
      const [row, col] = cell.id.split('.').map(Number);
      board[row][col] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.disabled = true;
      cell.style.cursor = 'default';

      // Check for a win or draw
      if (gameWon(board, row, col, n)) {
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

let boardSize = Number(document.getElementById('board-size').value);
play(boardSize);

// if board size changes, play the game using the new size
document.getElementById('board-size').addEventListener('change', (e) => {
  const newSize = Number(e.target.value);
  if (newSize !== boardSize) {
    boardSize = newSize;
    play(boardSize);
  }
});
