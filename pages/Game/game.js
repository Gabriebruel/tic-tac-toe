let mode = null;
let difficulty = null;
let aiPlayer = 'O';
let humanPlayer = 'X';

const menu = document.getElementById('menu');
const game = document.getElementById('game');
const board = document.getElementById('board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');
const cells = Array.from(document.querySelectorAll('.cell'));

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

document.getElementById('twoPlayer').addEventListener('click', () => {
    mode = '2p';
    startGame();
});

document.getElementById('vsAI').addEventListener('click', () => {
    document.getElementById('twoPlayer').style.display = 'none';
    document.getElementById('vsAI').style.display = 'none';
    document.getElementById('difficulty').style.display = 'block';
});

document.getElementById('back').addEventListener('click', () => {
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('twoPlayer').style.display = 'inline-block';
    document.getElementById('vsAI').style.display = 'inline-block';
});

document.querySelectorAll('.diff').forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.dataset.diff;
        mode = 'ai';
        startGame();
    });
});

function startGame() {
    menu.style.display = 'none';
    game.style.display = 'block';
    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (mode === 'ai' && gameActive) {
        setTimeout(aiMove, 500); // delay for better UX
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Jogador ${currentPlayer} venceu!`;
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        message.textContent = 'Empate!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Vez do jogador ${currentPlayer}`;
}

function aiMove() {
    let move;
    if (difficulty === 'easy') {
        let available = [];
        for (let i = 0; i < 9; i++) if (gameState[i] === '') available.push(i);
        move = available[Math.floor(Math.random() * available.length)];
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.5) {
            let available = [];
            for (let i = 0; i < 9; i++) if (gameState[i] === '') available.push(i);
            move = available[Math.floor(Math.random() * available.length)];
        } else {
            move = bestMove();
        }
    } else {
        move = bestMove();
    }

    gameState[move] = aiPlayer;
    cells[move].textContent = aiPlayer;
    checkResult();
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = aiPlayer;
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let condition of winningConditions) {
        if (board[condition[0]] && board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]]) {
            return board[condition[0]];
        }
    }
    if (board.every(cell => cell !== '')) return 'tie';
    return null;
}

const scores = {
    'X': -1,
    'O': 1,
    'tie': 0
};

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    message.textContent = `Vez do jogador ${currentPlayer}`;
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);