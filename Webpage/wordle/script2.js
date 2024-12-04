const WORDS = ["apple", "brave", "cherry", "dance", "eagle", "field", "grape", "heart", "house", 
    "ideal", "joker", "lemon", "mango", "night", "olive", "peach", "queen", "river", 
    "shine", "tiger", "unity", "vivid", "world", "zebra", "berry", "cloud", "dream", 
    "flame", "grass", "humor", "input", "joyed", "koala", "lucky", "maple", "naval", 
    "ocean", "polar", "quirk", "radar", "salty", "tempo", "urban", "verse", "wings", 
    "xerox", "yacht", "zesty", "amber", "crisp", "frost", "gorge", "haste", "ivory", 
    "jolly", "kneel", "laser", "milky", "novel", "ozone", "pearl", "quest", "royal", 
    "spark", "trace", "angel", "beach", "coral", "drink", "eagle", "flora", "ghost", 
    "hinge", "index", "joint", "knife", "light", "magic", "noble", "orbit", "panic", 
    "quiet", "rapid", "scout", "trick", "unveil", "widen", "yield", "zebra", "actor", 
    "beads", "clean", "dress", "exact", "frame", "glory", "haste", "inner", "judge", 
    "knead", "lunar", "motor", "nylon", "onion", "paper", "quick", "rocky", "share", 
    "trust", "unbox", "vapor", "weave", "xenon", "yield", "zebra", "alarm", "brave", 
    "crisp", "diver", "earth", "flora", "grasp", "honor", "ivory", "jewel", "kneel", 
    "liver", "medal", "noble", "orbit"];
    let targetWord;
    let currentRow;
    let currentCol;
    let guess;
    
    const board = document.getElementById("board");
    const keyboard = document.querySelector(".keyboard");
    const newGameButton = document.getElementById("new-game-button");
    
    function initializeGame() {
        document.getElementById("board").focus();
        board.innerHTML = ""; // Clear the board
        clearKeyboardColors(); // Reset keyboard highlights
        targetWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
        currentRow = 0;
        currentCol = 0;
        guess = "";
    
        // Create tiles for the board
        for (let i = 0; i < 6 * 5; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            board.appendChild(tile);
        }
    
        document.addEventListener("keydown", handlePhysicalKeyboard); // Enable typing
        keyboard.addEventListener("click", handleOnScreenKeyboard); // Enable on-screen keyboard
    }
    
    function handlePhysicalKeyboard(e) {
        const key = e.key.toUpperCase();
        if (key === "BACKSPACE") {
            removeLetter();
        } else if (key === "ENTER") {
            submitGuess();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    function handleOnScreenKeyboard(e) {
        const key = e.target.dataset.key;
        if (!key) return;
    
        if (key === "Backspace") {
            removeLetter();
        } else if (key === "Enter") {
            submitGuess();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    function addLetter(letter) {
        if (currentCol < 5) {
            const tiles = board.querySelectorAll(".tile");
            tiles[currentRow * 5 + currentCol].textContent = letter;
            currentCol++;
            guess += letter;
        }
    }
    
    function removeLetter() {
        if (currentCol > 0) {
            const tiles = board.querySelectorAll(".tile");
            currentCol--;
            guess = guess.slice(0, -1);
            tiles[currentRow * 5 + currentCol].textContent = "";
        }
    }
    
    function submitGuess() {
        if (guess.length !== 5) {
            alert("Not enough letters!");
            return;
        }
    
        const tiles = board.querySelectorAll(".tile");
        const guessedLetters = {};
    
        // Mark tiles for correctness
        for (let i = 0; i < 5; i++) {
            const tile = tiles[currentRow * 5 + i];
            const letter = guess[i];
    
            if (targetWord[i] === letter) {
                tile.classList.add("correct");
                updateKeyboard(letter, "correct");
            } else if (targetWord.includes(letter)) {
                tile.classList.add("present");
                guessedLetters[letter] = "present";
            } else {
                tile.classList.add("absent");
                updateKeyboard(letter, "absent");
            }
        }
    
        // Ensure yellow marking doesn’t override green
        for (const [letter, status] of Object.entries(guessedLetters)) {
            if (!targetWord.split("").filter((l) => l === letter).length) {
                updateKeyboard(letter, "present");
            }
        }
    
        if (guess === targetWord) {
            setTimeout(() => alert("You win!"), 100);
            endGame();
            return;
        }
    
        if (currentRow === 5) {
            setTimeout(() => alert(`Game over! The word was ${targetWord}`), 100);
            endGame();
            return;
        }
    
        // Move to the next row
        currentRow++;
        currentCol = 0;
        guess = "";
    }
    
    function updateKeyboard(letter, status) {
        const keyButton = document.querySelector(`button[data-key="${letter}"]`);
        if (!keyButton) return;
    
        if (status === "correct") {
            keyButton.classList.remove("present", "absent");
            keyButton.classList.add("correct");
        } else if (status === "present" && !keyButton.classList.contains("correct")) {
            keyButton.classList.remove("absent");
            keyButton.classList.add("present");
        } else if (!keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
            keyButton.classList.add("absent");
        }
    }
    
    function clearKeyboardColors() {
        const keys = keyboard.querySelectorAll("button");
        keys.forEach((key) => {
            key.classList.remove("correct", "present", "absent");
        });
    }
    
    function endGame() {
        document.removeEventListener("keydown", handlePhysicalKeyboard);
        keyboard.removeEventListener("click", handleOnScreenKeyboard);
    }
    
    newGameButton.addEventListener("click", initializeGame);
    initializeGame(); // Start the game initially
    
