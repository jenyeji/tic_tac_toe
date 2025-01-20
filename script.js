class TicTacToe {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.players = ['X', 'O'];
    this.resetGame();

    // Listen for reset event
    document
      .querySelector('#reset')
      .addEventListener('click', () => this.resetGame());

    // Listen for board size change event
    document.getElementById('board-size').addEventListener('change', (e) => {
      const newSize = Number(e.target.value);
      if (newSize !== this.boardSize) {
        this.boardSize = newSize;
        this.resetGame();
      }
    });
  }

  resetGame() {
    this.board = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }).fill(null)
    );
    this.gameOver = false;
    this.currentPlayer = this.players[0];
    this.updateStatus();

    // Reset table display
    const table = document.querySelector('table');
    // Clear any old Tic Tac Toe table
    table.replaceChildren();

    // Generate new Tic Tac Toe display
    Array.from({ length: this.boardSize }).forEach((_, rowIndex) => {
      const row = document.createElement('tr');
      Array.from({ length: this.boardSize }).forEach((_, colIndex) => {
        const td = document.createElement('td');
        const button = document.createElement('button');
        button.id = `${rowIndex}.${colIndex}`;
        button.addEventListener('click', () =>
          this.handleCellClick(rowIndex, colIndex, button)
        );
        td.append(button);
        row.append(td);
      });
      table.append(row);
    });
  }

  updateStatus(message = null) {
    document.querySelector('#game-status').textContent =
      message ?? `Player ${this.currentPlayer}'s Turn`;
  }

  handleCellClick(row, col, button) {
    if (this.gameOver) return;

    // Update the board state
    this.board[row][col] = this.currentPlayer;
    button.textContent = this.currentPlayer;
    button.disabled = true;
    button.style.cursor = 'default';

    // Check for a win or draw
    if (this.gameWon(row, col)) {
      this.updateStatus(`Player ${this.currentPlayer} Won!`);
      this.gameOver = true;
    } else if (this.isDraw()) {
      this.updateStatus("It's a Draw!");
      this.gameOver = true;
    } else {
      // Switch players
      this.currentPlayer =
        this.currentPlayer === this.players[0]
          ? this.players[1]
          : this.players[0];
      this.updateStatus();
    }
  }

  gameWon(row, col) {
    const player = this.board[row][col];

    // Check row
    if (this.board[row].every((cell) => cell === player)) return true;
    // Check column
    if (this.board.every((r) => r[col] === player)) return true;
    // Check diagonals
    const isMainDiagonal = row === col;
    const isAntiDiagonal = row + col === this.boardSize - 1;
    if (
      isMainDiagonal &&
      this.board.every((_, i) => this.board[i][i] === player)
    )
      return true;
    if (
      isAntiDiagonal &&
      this.board.every(
        (_, i) => this.board[i][this.boardSize - 1 - i] === player
      )
    )
      return true;

    return false;
  }

  isDraw() {
    return this.board.every((row) => row.every((cell) => cell !== null));
  }
}

function initGame() {
  const initialBoardSize = Number(document.getElementById('board-size').value);
  const game = new TicTacToe(initialBoardSize);
}

initGame();
