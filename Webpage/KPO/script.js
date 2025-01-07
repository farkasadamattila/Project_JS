const gameContainer = document.querySelector(".container"), // Select the game container element
  userResult = document.querySelector(".user_result img"), // Select the user's result image element
  cpuResult = document.querySelector(".cpu_result img"), // Select the CPU's result image element
  result = document.querySelector(".result"), // Select the result text element
  optionImages = document.querySelectorAll(".option_image"); // Select all option image elements

optionImages.forEach((image, index) => {
  image.addEventListener("click", (e) => {
    image.classList.add("active"); // Add the "active" class to the selected image

    userResult.src = cpuResult.src = "images/rock.png"; // Set default images
    result.textContent = "Wait..."; // Set result text to "Wait..."

    optionImages.forEach((image2, index2) => {
      index !== index2 && image2.classList.remove("active"); // Remove the "active" class from other images
    });

    gameContainer.classList.add("start"); // Add the "start" class to the game container

    let time = setTimeout(() => {
      gameContainer.classList.remove("start"); // Remove the "start" class from the game container

      let imageSrc = e.target.querySelector("img").src; // Get the source of the selected image
      userResult.src = imageSrc; // Set the user's result image source

      let randomNumber = Math.floor(Math.random() * 3); // Generate a random number between 0 and 2
      let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"]; // Array of CPU images
      cpuResult.src = cpuImages[randomNumber]; // Set the CPU's result image source

      let cpuValue = ["R", "P", "S"][randomNumber]; // Determine the CPU's choice
      let userValue = ["R", "P", "S"][index]; // Determine the user's choice

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
      }; // Possible outcomes

      let outComeValue = outcomes[userValue + cpuValue]; // Determine the outcome

      result.textContent = userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`; // Set the result text
    }, 2500); // 2.5 seconds delay
  });
});
