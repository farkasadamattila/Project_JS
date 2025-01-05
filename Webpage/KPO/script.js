const gameContainer = document.querySelector(".container"), // Kiválasztja a játék konténer elemét
  userResult = document.querySelector(".user_result img"), // Kiválasztja a felhasználó eredmény kép elemét
  cpuResult = document.querySelector(".cpu_result img"), // Kiválasztja a CPU eredmény kép elemét
  result = document.querySelector(".result"), // Kiválasztja az eredmény szöveg elemét
  optionImages = document.querySelectorAll(".option_image"); // Kiválasztja az összes opció kép elemet

optionImages.forEach((image, index) => {
  image.addEventListener("click", (e) => {
    image.classList.add("active"); // Hozzáadja az "active" osztályt a kiválasztott képhez

    userResult.src = cpuResult.src = "images/rock.png"; // Alapértelmezett képek beállítása
    result.textContent = "Wait..."; // Eredmény szöveg beállítása "Wait..."-re

    optionImages.forEach((image2, index2) => {
      index !== index2 && image2.classList.remove("active"); // Eltávolítja az "active" osztályt a többi képről
    });

    gameContainer.classList.add("start"); // Hozzáadja a "start" osztályt a játék konténerhez

    let time = setTimeout(() => {
      gameContainer.classList.remove("start"); // Eltávolítja a "start" osztályt a játék konténerből

      let imageSrc = e.target.querySelector("img").src; // Kiválasztja a felhasználó által választott kép forrását
      userResult.src = imageSrc; // Beállítja a felhasználó eredmény kép forrását

      let randomNumber = Math.floor(Math.random() * 3); // Generál egy véletlenszámot 0 és 2 között
      let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"]; // CPU képek tömbje
      cpuResult.src = cpuImages[randomNumber]; // Beállítja a CPU eredmény kép forrását

      let cpuValue = ["R", "P", "S"][randomNumber]; // CPU értékének meghatározása
      let userValue = ["R", "P", "S"][index]; // Felhasználó értékének meghatározása

      let outcomes = {
        RR: "Draw",
        RP: "Cpu",
        RS: "User",
        PP: "Draw",
        PR: "User",
        PS: "Cpu",
        SS: "Draw",
        SR: "Cpu",
        SP: "User",
      }; // Lehetséges kimenetelek objektuma

      let outComeValue = outcomes[userValue + cpuValue]; // Kimenetel meghatározása

      result.textContent = userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`; // Eredmény szöveg beállítása
    }, 2500); // 2,5 másodperces késleltetés
  });
});
