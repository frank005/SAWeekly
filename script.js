"use strict";

// DOM
const nextButton = document.getElementById("nextButton");
const pauseButton = document.getElementById("pauseButton");
const headerOne = document.getElementById("headerNames");
const timerDOM = document.getElementById("timer");
const toGo = document.getElementById("togo");
const done = document.getElementById("done");
const lists = document.getElementById("lists");
const fill = document.getElementById("fill");

// Timer
const TOTAL_TIME = 120;
let timeRemaining = TOTAL_TIME;

const timerWorker = new Worker("timer.js");

// Date header
const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;

headerOne.textContent = `SA Weekly ${month}/${day}`;

// Names
let namesListToGo = [
  "Aleksey",
  "Ben",
  "Blaise",
  "Frank",
  "Brent",
  "Jay",
  "Kate",
  "TJ",
  // Teams Past Ryan, Amar, Monica, Rahul, Ansab, Joe
];

let namesListDone = [];

const pickRandom = () => {
  return Math.floor(Math.random() * namesListToGo.length);
};

const updateLists = () => {
  toGo.textContent = "";
  done.textContent = "";

  namesListToGo.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    toGo.appendChild(li);
  });

  // Exclude current in-flight speaker from "done"
  namesListDone.slice(0, -1).forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    done.appendChild(li);
  });
};

const reset = () => {
  document.body.classList.remove("flashing", "flashing-fast");
  fill.classList.remove("flashing-bar");

  fill.style.width = "0%";
  timerDOM.textContent = TOTAL_TIME;
  timeRemaining = TOTAL_TIME;

  document.body.style.backgroundColor = "black";

  timerWorker.postMessage("stop");

  pauseButton.style.display = "none";
  pauseButton.textContent = "Pause";
  pauseButton.classList.remove("paused");
};

const startTimer = () => {
  timerWorker.postMessage("start");

  pauseButton.style.display = "block";
  pauseButton.textContent = "Pause";
  pauseButton.classList.remove("paused");
};

const startNameByIndex = (nameIndex) => {
  if (nameIndex < 0 || nameIndex >= namesListToGo.length) return;

  reset();

  nextButton.textContent = "Next";

  const selectedName = namesListToGo[nameIndex];

  headerOne.textContent = selectedName;
  namesListDone.push(selectedName);
  namesListToGo.splice(nameIndex, 1);

  updateLists();
  startTimer();
};

const finishMeeting = () => {
  timerWorker.postMessage("stop");

  fill.style.width = "0%";
  headerOne.textContent = `SA Weekly ${month}/${day}`;
  timerDOM.textContent = "DONE !";

  document.body.classList.remove("flashing");
  document.body.classList.add("flashing-fast");

  nextButton.style.visibility = "hidden";
  pauseButton.style.visibility = "hidden";
  lists.style.visibility = "hidden";

  timerDOM.style.fontSize = "8em";
};

updateLists();

timerWorker.onmessage = (event) => {
  if (event.data === "tick") {
    timeRemaining -= 0.1;

    timerDOM.textContent = timeRemaining.toFixed();

    const progress = 100 - (timeRemaining / TOTAL_TIME) * 100;
    fill.style.width = `${Math.min(progress, 100)}%`;

    if (timeRemaining < 10) {
      fill.classList.add("flashing-bar");
    }

    if (timeRemaining < 0) {
      fill.classList.remove("flashing-bar");
      document.body.classList.add("flashing");
    }

    if (timeRemaining < -30) {
      document.body.classList.add("flashing-fast");
    }
  }

  if (event.data === "paused") {
    pauseButton.textContent = "Resume";
    pauseButton.classList.add("paused");
  }

  if (event.data === "resumed") {
    pauseButton.textContent = "Pause";
    pauseButton.classList.remove("paused");
  }
};

nextButton.addEventListener("click", () => {
  if (namesListToGo.length > 0) {
    startNameByIndex(pickRandom());
  } else {
    finishMeeting();
  }
});

toGo.addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return;

  const nameIndex = namesListToGo.indexOf(event.target.textContent);
  startNameByIndex(nameIndex);
});

done.addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return;

  const nameIndex = namesListDone.indexOf(event.target.textContent);
  if (nameIndex === -1) return;

  namesListToGo.push(namesListDone[nameIndex]);
  namesListDone.splice(nameIndex, 1);

  updateLists();
});

pauseButton.addEventListener("click", () => {
  timerWorker.postMessage("pause");
});
