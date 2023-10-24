let timerId;
let letters = [];
let correctCount = 0;
let errorCount = 0;
let limitedAccuracy = 0;
const container = document.querySelector(".container");
const endDisplay = document.querySelector(".endDisplay");

const init = async () => {
  // RANDOM SENTENCE
  let oui = "";
  await fetch("https://api.quotable.io/random")
    .then((res) => res.json())
    .then((data) => {
      oui = data.content;
    });
  oui = oui
    .toLowerCase()
    .replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/[^\w\sàáâäéèêëíìîïóòôöúùûü]/g, "");
  let story = oui.split("");

  const storyContainer = document.querySelector(".story");

  // DISPLAY SENTENCE ON SCREEN

  oui.split(" ").forEach((mot) => {
    let fullMot = document.createElement("div");
    mot.split("").forEach((letter) => {
      let div = document.createElement("span");
      div.innerHTML = letter;
      fullMot.appendChild(div);
      letters.push(div);
    });
    let space = document.createElement("span");
    space.innerHTML = "&nbsp;";
    letters.push(space);
    fullMot.appendChild(space);
    storyContainer.appendChild(fullMot);
  });

  endDisplay.style.display = "none";
  container.style.display = "flex";
  game();
};

let gameStart;

const game = () => {
  letters.pop();
  let index = 0;
  let currentLetter = letters[index];
  currentLetter.classList.add("current");

  document.addEventListener("keypress", (e) => {
    gameStart = true;
    if (gameStart && !timerId) {
      startTimer();
    }
    if (!currentLetter) {
      return;
    }
    if (
      e.key === currentLetter.innerHTML ||
      (e.key === " " && currentLetter.innerHTML === "&nbsp;")
    ) {
      currentLetter.classList.remove("current");
      currentLetter.classList.remove("badLetter");
      currentLetter.classList.add("goodLetter");
      index++;
      correctCount++;
      currentLetter = letters[index];
      accuracy(correctCount, errorCount);
      calcSpeed();
      if (currentLetter) {
        currentLetter.classList.add("current");
      } else {
        stopTimer();
        endGame();
      }
    } else {
      // currentLetter.classList.remove("current");
      currentLetter.classList.add("badLetter");
      errorCount++;
      calcSpeed();
      if (currentLetter) {
        currentLetter.classList.add("current");
      } else {
        stopTimer();
        endGame();
      }
    }
  });
};

let count = 60;
function startTimer() {
  timerId = setInterval(function () {
    document.getElementById("timer").textContent = "Time : " + count + " sec";
    count--;
    if (count < 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

const accuracy = () => {
  const accuracyLabel = document.querySelector(".accuracyLabel");

  if (correctCount + errorCount === 0) {
    accuracyLabel.textContent = "Accuracy : 0 %";
  } else {
    const rawAccuracy =
      ((correctCount - errorCount) / (correctCount + errorCount)) * 100;
    limitedAccuracy = Math.max(0, parseFloat(rawAccuracy.toFixed(0)));
    accuracyLabel.textContent = `Accuracy : ${limitedAccuracy} %`;
    return limitedAccuracy;
  }
};

const endGame = () => {
  endDisplay.style.display = "flex";
  container.style.display = "none";
  const calcTPM = (endDisplay.innerHTML = `
<h1>🤖 Finish !</h1>
<p id="timer">Your speed : ${(
    (correctCount + errorCount) /
    ((60 - count) / 60)
  ).toFixed(2)} LPM</p>
<p class="speedLabel">Your acuracy : ${limitedAccuracy} %</p>
<div class="btn-container">
<button id="againButton" class="again">Again</button>
</div>`);

  const againButton = document.getElementById("againButton");

  againButton.addEventListener("click", () => {
    location.reload();
  });
};

const calcSpeed = () => {
  const speedLabel = document.querySelector(".speedLabel");
  speedLabel.textContent = `Your speed : ${(
    (correctCount + errorCount) /
    ((60 - count) / 60)
  ).toFixed(2)} LPM`;
};

const againButtons = document.querySelectorAll(".again");
againButtons.forEach((button) => {
  button.addEventListener("click", () => {
    location.reload();
  });
});

init();
