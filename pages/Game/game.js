let mode = null;
let difficulty = null;
let aiPlayer = 'O';
let humanPlayer = 'X';

const menu = document.getElementById('menu');
const game = document.getElementById('game');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');
const cells = Array.from(document.querySelectorAll('.cell'));

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// 🔥 ATUALIZA MENSAGEM COM COR
function updateMessage() {
    message.textContent = `Vez do jogador ${currentPlayer}`;

    message.classList.remove('x', 'o');

    if (currentPlayer === 'X') {
        message.classList.add('x');
    } else {
        message.classList.add('o');
    }
}

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
    const index = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (mode === 'ai' && gameActive) {
        setTimeout(aiMove, 400);
    }
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;

        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;

            // 🎉 animação nas células vencedoras
            cells[a].classList.add('win');
            cells[b].classList.add('win');
            cells[c].classList.add('win');

            break;
        }
    }

    if (roundWon) {
        message.textContent = `🎉 Jogador ${currentPlayer} venceu!`;
        message.classList.remove('x', 'o');
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = 'Empate!';
        message.classList.remove('x', 'o');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateMessage();
}

function aiMove() {
    let available = gameState
        .map((v,i) => v === '' ? i : null)
        .filter(v => v !== null);

    let move = available[Math.floor(Math.random() * available.length)];

    gameState[move] = aiPlayer;
    cells[move].textContent = aiPlayer;

    checkResult();
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];

    updateMessage();

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);