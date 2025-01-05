const wordDisplay = document.querySelector(".word-display"); // Kiválasztja a szó megjelenítő elemet
const guessesText = document.querySelector(".guesses-text b"); // Kiválasztja a találgatások szövegét
const keyboardDiv = document.querySelector(".keyboard"); // Kiválasztja a billentyűzet div-et
const hangmanImage = document.querySelector(".hangman-box img"); // Kiválasztja az akasztófa képet
const gameModal = document.querySelector(".game-modal"); // Kiválasztja a játék modált
const playAgainBtn = gameModal.querySelector("button"); // Kiválasztja az újra játszás gombot a modálban

// Játék változók inicializálása
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Játék változók és UI elemek visszaállítása
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Véletlenszerű szó és tipp kiválasztása a wordList-ből
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Az aktuális szó beállítása véletlenszerű szóra
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // Játék vége után a modál megjelenítése releváns részletekkel
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Ellenőrzi, hogy a kattintott betű létezik-e az aktuális szóban
    if(currentWord.includes(clickedLetter)) {
        // Az összes helyes betű megjelenítése a szó megjelenítőn
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Ha a kattintott betű nem létezik, frissíti a hibás találgatások számát és az akasztófa képet
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // A kattintott gomb letiltása, hogy a felhasználó ne kattinthasson újra
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // A gameOver függvény hívása, ha bármelyik feltétel teljesül
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Billentyűzet gombok létrehozása és eseményfigyelők hozzáadása
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);