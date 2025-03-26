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

// Set Worker
const timerWorker = new Worker("timer.js");
// VARS
let timer = 120;
let totalTime = 120;
let countdown;
let day = new Date().getDate();
let month = new Date().getMonth();

headerOne.innerText += "SA Weekly " + parseInt(month + 1) + "/" + day;

let namesListToGo = [
  "Aleksey",
  "Amar",
  "Ben",
  "Blaise",
  "Eragam",
  "Frank",
  "Brent",
  "Jay",
  "Kate",
  // "Monica",
  "Ryan",
  "TJ",
];

let namesListDone = [];

const pickRandom = () => {
  return Math.floor(Math.random() * namesListToGo.length);
};

const updateLists = () => {
  toGo.innerHTML = "";
  for (let i = 0; i < namesListToGo.length; i++) {
    let li = document.createElement("li");
    li.innerText = namesListToGo[i];
    toGo.appendChild(li);
  }

  done.innerHTML = "";
  for (let i = 0; i < namesListDone.length - 1; i++) {
    // -1 so in flight doesn't appear in "done"
    let li = document.createElement("li");
    li.innerText = namesListDone[i];
    done.appendChild(li);
  }
};
updateLists();
timerWorker.onmessage = (event) => {
  if (event.data === "tick") {
    timer = timer - 0.1;
    timerDOM.innerHTML = timer.toFixed();
    fill.style.width = "" + 100 - (timer / totalTime) * 100 + "%";
    timer < 10 ? fill.classList.add("flashing-bar") : null;
    timer < 0 ? fill.classList.remove("flashing-bar") : null;
    timer < 0 ? document.body.classList.add("flashing") : null;
    timer < -30 ? document.body.classList.add("flashing-fast") : null;
  } else if (event.data === "paused") {
    pauseButton.textContent = "Resume";
    pauseButton.classList.add("paused");
  } else if (event.data === "resumed") {
    pauseButton.textContent = "Pause";
    pauseButton.classList.remove("paused");
  }
};
const startTimer = () => {
  timerWorker.postMessage("start");
  pauseButton.style.display = "block";
  pauseButton.textContent = "Pause";
  pauseButton.classList.remove("paused");
};

const reset = () => {
  document.body.classList.remove("flashing");
  document.body.classList.remove("flashing-fast");
  fill.classList.remove("flashing-bar");
  fill.style.width = "0%";
  timerDOM.innerHTML = totalTime;
  timer = totalTime;
  document.body.style.backgroundColor = "black";
  timerWorker.postMessage("stop");
  pauseButton.style.display = "none";
};

nextButton.addEventListener("click", () => {
  if (namesListToGo.length > 0) {
    reset();
    nextButton.innerHTML = "Next";
    let nameIndex = pickRandom();
    headerNames.textContent = namesListToGo[nameIndex];
    namesListDone.push(namesListToGo[nameIndex]);
    namesListToGo.splice(nameIndex, 1);
    updateLists();
    startTimer();
  } else {
    timerWorker.postMessage("stop");
    fill.style.width = "0%";
    headerOne.innerText = "SA Weekly " + parseInt(month + 1) + " / " + day;
    timerDOM.innerText = "DONE ! ";
    document.body.classList.remove("flashing");
    document.body.classList.add("flashing-fast");
    nextButton.style.visibility = "hidden";
    pauseButton.style.visibility = "hidden";
    lists.style.visibility = "hidden";
    timerDOM.style.fontSize = "8em";
  }
});

toGo.addEventListener("click", (item) => {
  reset();
  nextButton.innerHTML = "Next";
  let nameIndex = namesListToGo.indexOf(item.target.innerText);
  headerNames.textContent = namesListToGo[nameIndex];
  namesListDone.push(namesListToGo[nameIndex]);
  namesListToGo.splice(nameIndex, 1);
  updateLists();
  startTimer();
});

done.addEventListener("click", (item) => {
  let nameIndex = namesListDone.indexOf(item.target.innerText);
  namesListToGo.push(namesListDone[nameIndex]);
  namesListDone.splice(nameIndex, 1);
  updateLists();
});

pauseButton.addEventListener("click", () => {
  timerWorker.postMessage("pause");
});
