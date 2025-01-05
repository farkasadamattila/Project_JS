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
let targetWord; // A kitalálandó szó
let currentRow; // Jelenlegi sor a játéktáblán
let currentCol; // Jelenlegi oszlop a játéktáblán
let guess; // Jelenlegi tipp

const board = document.getElementById("board"); // Játéktábla elem
const keyboard = document.querySelector(".keyboard"); // Képernyőn megjelenő billentyűzet elem
const newGameButton = document.getElementById("new-game-button"); // Új játék gomb elem

function initializeGame() {
    document.getElementById("board").focus(); // Fókusz a játéktáblán
    board.innerHTML = ""; // Játéktábla törlése
    clearKeyboardColors(); // Billentyűzet színeinek törlése
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(); // Véletlenszerű cél szó kiválasztása
    currentRow = 0; // Jelenlegi sor visszaállítása
    currentCol = 0; // Jelenlegi oszlop visszaállítása
    guess = ""; // Jelenlegi tipp visszaállítása

    // Csempék létrehozása a játéktáblán
    for (let i = 0; i < 6 * 5; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        board.appendChild(tile);
    }

    // Eseménykezelők hozzáadása a billentyűzet beviteléhez
    document.addEventListener("keydown", handlePhysicalKeyboard);
    keyboard.addEventListener("click", handleOnScreenKeyboard);
}

function handlePhysicalKeyboard(e) {
    const key = e.key.toUpperCase();
    if (key === "BACKSPACE") {
        removeLetter(); // Backspace billentyű kezelése
    } else if (key === "ENTER") {
        submitGuess(); // Enter billentyű kezelése
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key); // Betű billentyűk kezelése
    }
}

function handleOnScreenKeyboard(e) {
    const key = e.target.dataset.key;
    if (!key) return;

    if (key === "Backspace") {
        removeLetter(); // Backspace billentyű kezelése
    } else if (key === "Enter") {
        submitGuess(); // Enter billentyű kezelése
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key); // Betű billentyűk kezelése
    }
}

function addLetter(letter) {
    if (currentCol < 5) {
        const tiles = board.querySelectorAll(".tile");
        tiles[currentRow * 5 + currentCol].textContent = letter; // Betű hozzáadása az aktuális csempéhez
        currentCol++; // Következő oszlopra lépés
        guess += letter; // Betű hozzáadása az aktuális tipphez
    }
}

function removeLetter() {
    if (currentCol > 0) {
        const tiles = board.querySelectorAll(".tile");
        currentCol--; // Előző oszlopra lépés
        guess = guess.slice(0, -1); // Utolsó betű eltávolítása a tippből
        tiles[currentRow * 5 + currentCol].textContent = ""; // Aktuális csempe törlése
    }
}

function submitGuess() {
    if (guess.length !== 5) {
        alert("Nem elég betű!"); // Figyelmeztetés, ha a tipp nem teljes
        return;
    }

    const tiles = board.querySelectorAll(".tile");
    const guessedLetters = {};

    // Minden betű ellenőrzése a tippben
    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentRow * 5 + i];
        const letter = guess[i];

        if (targetWord[i] === letter) {
            tile.classList.add("correct"); // Betű megjelölése helyesként
            updateKeyboard(letter, "correct"); // Billentyűzet színének frissítése
        } else if (targetWord.includes(letter)) {
            tile.classList.add("present"); // Betű megjelölése jelenlévőként
            guessedLetters[letter] = "present";
        } else {
            tile.classList.add("absent"); // Betű megjelölése hiányzóként
            updateKeyboard(letter, "absent"); // Billentyűzet színének frissítése
        }
    }

    // Billentyűzet frissítése a jelenlévő betűk esetén
    for (const [letter, status] of Object.entries(guessedLetters)) {
        if (!targetWord.split("").filter((l) => l === letter).length) {
            updateKeyboard(letter, "present");
        }
    }

    if (guess === targetWord) {
        setTimeout(() => alert("Nyertél!"), 100); // Figyelmeztetés, ha a tipp helyes
        endGame(); // Játék befejezése
        return;
    }

    if (currentRow === 5) {
        setTimeout(() => alert(`Játék vége! A szó ${targetWord} volt`), 100); // Figyelmeztetés, ha a játék véget ért
        endGame(); // Játék befejezése
        return;
    }

    currentRow++; // Következő sorra lépés
    currentCol = 0; // Oszlop visszaállítása
    guess = ""; // Tipp visszaállítása
}

function updateKeyboard(letter, status) {
    const keyButton = document.querySelector(`button[data-key="${letter}"]`);
    if (!keyButton) return;

    if (status === "correct") {
        keyButton.classList.remove("present", "absent");
        keyButton.classList.add("correct"); // Billentyű megjelölése helyesként
    } else if (status === "present" && !keyButton.classList.contains("correct")) {
        keyButton.classList.remove("absent");
        keyButton.classList.add("present"); // Billentyű megjelölése jelenlévőként
    } else if (!keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
        keyButton.classList.add("absent"); // Billentyű megjelölése hiányzóként
    }
}

function clearKeyboardColors() {
    const keys = keyboard.querySelectorAll("button");
    keys.forEach((key) => {
        key.classList.remove("correct", "present", "absent"); // Minden billentyű színének törlése
    });
}

function endGame() {
    document.removeEventListener("keydown", handlePhysicalKeyboard); // Billentyűzet eseménykezelő eltávolítása
    keyboard.removeEventListener("click", handleOnScreenKeyboard); // Képernyőn megjelenő billentyűzet eseménykezelő eltávolítása
}

newGameButton.addEventListener("click", initializeGame); // Eseménykezelő hozzáadása az új játék gombhoz
initializeGame(); // Játék inicializálása az oldal betöltésekor
