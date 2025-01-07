// Select the game canvas and set up the 2D context
const gameCanvas = document.querySelector("#gameCanvas");
const ctx = gameCanvas.getContext("2d");

// Select the score display and reset button
const scoreDisplay = document.querySelector("#scoreDisplay");
const resetButton = document.querySelector("#resetButton");
const highScoreDisplay = document.querySelector("#highScoreDisplay");

// Set canvas dimensions and colors
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;
const backgroundColor = "#1e1e1e";
const snakeBodyColor = "#1db954";
const snakeBorderColor = "#111";
const foodColor = "#ff3e3e";
const unitSize = 25;

// Initialize game state and starting values
let gameRunning = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// Add event listeners for keyboard and reset button
window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

// Handle touch events
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

gameCanvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

gameCanvas.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
    handleSwipe();
});

// Start the game
startGame();

function startGame() {
    gameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    createFood();
    drawFood();
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (gameRunning) {
        setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            gameLoop();
        }, 100);
    } else {
        showGameOver();
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Create food at random coordinates
function createFood() {
    function randomCoordinate(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomCoordinate(0, canvasWidth - unitSize);
    foodY = randomCoordinate(0, canvasHeight - unitSize);
}

// Draw the food on the canvas
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        createFood();
    } else {
        snake.pop();
    }
}

// Draw the snake on the canvas
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = snakeBodyColor;
        ctx.strokeStyle = snakeBorderColor;
        ctx.fillRect(segment.x, segment.y, unitSize, unitSize);
        ctx.strokeRect(segment.x, segment.y, unitSize, unitSize);
    });
}

// Handle direction change with keyboard
function changeDirection(event) {
    const keyPressed = event.key.toLowerCase();

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    if (keyPressed === "arrowleft" || keyPressed === "a") {
        if (!goingRight) {
            xVelocity = -unitSize;
            yVelocity = 0;
        }
    }
    if (keyPressed === "arrowup" || keyPressed === "w") {
        if (!goingDown) {
            xVelocity = 0;
            yVelocity = -unitSize;
        }
    }
    if (keyPressed === "arrowright" || keyPressed === "d") {
        if (!goingLeft) {
            xVelocity = unitSize;
            yVelocity = 0;
        }
    }
    if (keyPressed === "arrowdown" || keyPressed === "s") {
        if (!goingUp) {
            xVelocity = 0;
            yVelocity = unitSize;
        }
    }
}

// Handle swipe direction change
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && !goingLeft) {
            xVelocity = unitSize;
            yVelocity = 0;
        } else if (deltaX < 0 && !goingRight) {
            xVelocity = -unitSize;
            yVelocity = 0;
        }
    } else {
        if (deltaY > 0 && !goingUp) {
            xVelocity = 0;
            yVelocity = unitSize;
        } else if (deltaY < 0 && !goingDown) {
            xVelocity = 0;
            yVelocity = -unitSize;
        }
    }
}

// Check if the game is over
function checkGameOver() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvasWidth ||
        snake[0].y < 0 ||
        snake[0].y >= canvasHeight
    ) {
        gameRunning = false;
    }

    snake.slice(1).forEach(segment => {
        if (segment.x === snake[0].x && segment.y === snake[0].y) {
            gameRunning = false;
        }
    });
}

// Display game over message
function showGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px 'Press Start 2P', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
    ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 40);
}

// Reset the game
function resetGame() {
    gameRunning = true;
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    startGame();
}
