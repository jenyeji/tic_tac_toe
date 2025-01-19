class TicTacToe {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
    this.players = ['X', 'O'];
    this.currentPlayer = this.players[0];
    this.gameOver = false;

    this.table = document.querySelector('table');
    this.statusEl = document.querySelector('#game-status');
    this.resetButton = document.querySelector('#reset');
    this.boardSizeInput = document.getElementById('board-size');

    this.init();
  }

  // Initialize the game
  init() {
    this.initBoard();
    this.initTableDisplay();
    this.initResetButton();
    this.initBoardSizeListener();
    this.updateStatus();
  }

  initBoard() {
    this.board = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }).fill(null)
    );
  }

  initTableDisplay() {
    // Clear any old Tic Tac Toe table
    this.table.replaceChildren();

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
      this.table.append(row);
    });
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
      this.statusEl.textContent = `Player ${this.currentPlayer} Won!`;
      this.gameOver = true;
    } else if (this.isDraw()) {
      this.statusEl.textContent = "It's a Draw!";
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

  resetBoard() {
    this.initBoard();
    Array.from(document.querySelectorAll('td button')).forEach((button) => {
      button.textContent = '';
      button.disabled = false;
      button.style.cursor = 'pointer';
    });
    this.gameOver = false;
    this.currentPlayer = this.players[0];
    this.updateStatus();
  }

  initResetButton() {
    const newResetButton = this.resetButton.cloneNode(true);
    newResetButton.addEventListener('click', () => this.resetBoard());
    this.resetButton.parentNode.replaceChild(newResetButton, this.resetButton);
    this.resetButton = newResetButton;
  }

  initBoardSizeListener() {
    this.boardSizeInput.addEventListener('change', (e) => {
      const newSize = Number(e.target.value);
      if (newSize !== this.boardSize) {
        this.boardSize = newSize;
        this.playNewGame();
      }
    });
  }

  playNewGame() {
    this.initBoard();
    this.initTableDisplay();
    this.resetBoard();
  }

  updateStatus() {
    this.statusEl.textContent = `Player ${this.currentPlayer}'s Turn`;
  }
}

const initialBoardSize = Number(document.getElementById('board-size').value);
const game = new TicTacToe(initialBoardSize);
