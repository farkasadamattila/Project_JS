const WORDS = ["apple", "brave", "dance", "eagle", "field", "grape", "heart", "house", 
    "ideal", "joker", "lemon", "mango", "night", "olive", "peach", "queen", "river", 
    "shine", "tiger", "unity", "vivid", "world", "zebra", "berry", "cloud", "dream", 
    "flame", "grass", "humor", "input", "joyed", "koala", "lucky", "maple", "naval", 
    "ocean", "polar", "quirk", "radar", "salty", "tempo", "urban", "verse", "wings", 
    "xerox", "yacht", "zesty", "amber", "crisp", "frost", "gorge", "haste", "ivory", 
    "jolly", "kneel", "laser", "milky", "novel", "ozone", "pearl", "quest", "royal", 
    "spark", "trace", "angel", "beach", "coral", "drink", "eagle", "flora", "ghost", 
    "hinge", "index", "joint", "knife", "light", "magic", "noble", "orbit", "panic", 
    "quiet", "rapid", "scout", "trick", "widen", "yield", "zebra", "actor", 
    "beads", "clean", "dress", "exact", "frame", "glory", "haste", "inner", "judge", 
    "knead", "lunar", "motor", "nylon", "onion", "paper", "quick", "rocky", "share", 
    "trust", "unbox", "vapor", "weave", "xenon", "yield", "zebra", "alarm", "brave", 
    "crisp", "diver", "earth", "flora", "grasp", "honor", "ivory", "jewel", "kneel", 
    "liver", "medal", "noble", "orbit", "freak", "silly"];
let targetWord; // The word to guess
let currentRow; // The current row on the game board
let currentCol; // The current column on the game board
let guess; // The current guess

const board = document.getElementById("board"); // The game board element
const keyboard = document.querySelector(".keyboard"); // The on-screen keyboard element
const newGameButton = document.getElementById("new-game-button"); // The new game button element

function initializeGame() {
    document.getElementById("board").focus(); // Focus on the game board
    board.innerHTML = ""; // Clear the game board
    clearKeyboardColors(); // Clear the colors on the keyboard
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(); // Select a random target word
    currentRow = 0; // Reset the current row
    currentCol = 0; // Reset the current column
    guess = ""; // Reset the current guess

    // Create tiles on the game board
    for (let i = 0; i < 6 * 5; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        board.appendChild(tile);
    }

    // Add event listeners for keyboard input
    document.addEventListener("keydown", handlePhysicalKeyboard);
    keyboard.addEventListener("click", handleOnScreenKeyboard);
}

function handlePhysicalKeyboard(e) {
    const key = e.key.toUpperCase();
    if (key === "BACKSPACE") {
        removeLetter(); // Handle backspace key
    } else if (key === "ENTER") {
        submitGuess(); // Handle enter key
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key); // Handle letter keys
    }
}

function handleOnScreenKeyboard(e) {
    const key = e.target.dataset.key;
    if (!key) return;

    if (key === "Backspace") {
        removeLetter(); // Handle backspace key
    } else if (key === "Enter") {
        submitGuess(); // Handle enter key
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key); // Handle letter keys
    }
}

function addLetter(letter) {
    if (currentCol < 5) {
        const tiles = board.querySelectorAll(".tile");
        tiles[currentRow * 5 + currentCol].textContent = letter; // Add letter to the current tile
        currentCol++; // Move to the next column
        guess += letter; // Add letter to the current guess
    }
}

function removeLetter() {
    if (currentCol > 0) {
        const tiles = board.querySelectorAll(".tile");
        currentCol--; // Move to the previous column
        guess = guess.slice(0, -1); // Remove the last letter from the guess
        tiles[currentRow * 5 + currentCol].textContent = ""; // Clear the current tile
    }
}

function submitGuess() {
    if (guess.length !== 5) {
        alert("Not enough letters!"); // Alert if the guess is not complete
        return;
    }

    const tiles = board.querySelectorAll(".tile");
    const guessedLetters = {};

    // Check each letter in the guess
    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentRow * 5 + i];
        const letter = guess[i];

        if (targetWord[i] === letter) {
            tile.classList.add("correct"); // Mark letter as correct
            updateKeyboard(letter, "correct"); // Update keyboard color
        } else if (targetWord.includes(letter)) {
            tile.classList.add("present"); // Mark letter as present
            guessedLetters[letter] = "present";
        } else {
            tile.classList.add("absent"); // Mark letter as absent
            updateKeyboard(letter, "absent"); // Update keyboard color
        }
    }

    // Update keyboard for present letters
    for (const [letter, status] of Object.entries(guessedLetters)) {
        if (!targetWord.split("").filter((l) => l === letter).length) {
            updateKeyboard(letter, "present");
        }
    }

    if (guess === targetWord) {
        setTimeout(() => alert("You won!"), 100); // Alert if the guess is correct
        endGame(); // End the game
        return;
    }

    if (currentRow === 5) {
        setTimeout(() => alert(`Game over! The word was ${targetWord}`), 100); // Alert if the game is over
        endGame(); // End the game
        return;
    }

    currentRow++; // Move to the next row
    currentCol = 0; // Reset the column
    guess = ""; // Reset the guess
}

function updateKeyboard(letter, status) {
    const keyButton = document.querySelector(`button[data-key="${letter}"]`);
    if (!keyButton) return;

    if (status === "correct") {
        keyButton.classList.remove("present", "absent");
        keyButton.classList.add("correct"); // Mark key as correct
    } else if (status === "present" && !keyButton.classList.contains("correct")) {
        keyButton.classList.remove("absent");
        keyButton.classList.add("present"); // Mark key as present
    } else if (!keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
        keyButton.classList.add("absent"); // Mark key as absent
    }
}

function clearKeyboardColors() {
    const keys = keyboard.querySelectorAll("button");
    keys.forEach((key) => {
        key.classList.remove("correct", "present", "absent"); // Clear all key colors
    });
}

function endGame() {
    document.removeEventListener("keydown", handlePhysicalKeyboard); // Remove keyboard event listener
    keyboard.removeEventListener("click", handleOnScreenKeyboard); // Remove on-screen keyboard event listener
}

newGameButton.addEventListener("click", initializeGame); // Add event listener to the new game button
initializeGame(); // Initialize the game when the page loads
