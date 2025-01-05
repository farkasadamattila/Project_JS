const wordText = document.querySelector(".word"), // Kiválasztja a szó megjelenítésére szolgáló elemet
    hintText = document.querySelector(".hint span"), // Kiválasztja a tipp megjelenítésére szolgáló elemet
    timeText = document.querySelector(".time b"), // Kiválasztja az idő megjelenítésére szolgáló elemet
    inputField = document.querySelector("input"), // Kiválasztja a felhasználói bemenet mezőt
    refreshBtn = document.querySelector(".refresh-word"), // Kiválasztja a frissítés gombot
    checkBtn = document.querySelector(".check-word"); // Kiválasztja az ellenőrzés gombot

let correctWord, timer; // Deklarálja a helyes szót és az időzítőt

const initTimer = maxTime => { // Időzítő inicializálása
    clearInterval(timer); // Meglévő időzítő törlése
    timer = setInterval(() => { // Új időzítő beállítása
        if (maxTime > 0) { // Ha van még idő
            maxTime--; // Csökkenti az időt
            return timeText.innerText = maxTime; // Frissíti az idő megjelenítését
        }
        timeText.innerText = `Time off! ${correctWord.toUpperCase()} was the correct word`; // Idő lejárt üzenet megjelenítése
        initGame(); // Új játék indítása
    }, 1000); // Időzítő 1 másodperces intervallummal
}

const initGame = () => { // Játék inicializálása
    initTimer(30); // Időzítő beállítása 30 másodpercre
    let randomObj = words[Math.floor(Math.random() * words.length)]; // Véletlenszerű szó kiválasztása
    let wordArray = randomObj.word.split(""); // Szó karakterekre bontása
    for (let i = wordArray.length - 1; i > 0; i--) { // Karakterek összekeverése
        let j = Math.floor(Math.random() * (i + 1)); // Véletlenszerű index kiválasztása
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Karakterek cseréje
    }
    wordText.innerText = wordArray.join(""); // Összekevert szó megjelenítése
    hintText.innerText = randomObj.hint; // Tipp megjelenítése
    correctWord = randomObj.word.toLowerCase();; // Helyes szó mentése
    inputField.value = ""; // Bemeneti mező ürítése
    inputField.setAttribute("maxlength", correctWord.length); // Bemeneti mező maximális hosszának beállítása
}
initGame(); // Játék indítása

const checkWord = () => { // Szó ellenőrzése
    let userWord = inputField.value.toLowerCase(); // Felhasználói bemenet lekérése
    if (!userWord) { // Ha nincs bemenet
        timeText.innerText = "Please enter the word to check!"; // Üzenet megjelenítése
        return;
    }
    if (userWord !== correctWord) { // Ha a bemenet nem egyezik a helyes szóval
        timeText.innerText = `Oops! ${userWord} is not a correct word`; // Hibaüzenet megjelenítése
        return;
    }
    timeText.innerText = `Congrats! ${correctWord.toUpperCase()} is the correct word`; // Sikerüzenet megjelenítése
    initGame(); // Új játék indítása
}

refreshBtn.addEventListener("click", initGame); // Frissítés gomb eseménykezelő hozzáadása
checkBtn.addEventListener("click", checkWord); // Ellenőrzés gomb eseménykezelő hozzáadása