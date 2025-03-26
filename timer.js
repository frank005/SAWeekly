x = null;
let isPaused = false;
onmessage = (event) => {
  if (event.data === "start") {
    clearInterval(x);
    isPaused = false;
    x = setInterval(() => {
      if (!isPaused) {
        postMessage("tick");
      }
    }, 100);
  } else if (event.data === "stop") {
    clearInterval(x);
    console.log("STOP received by worker");
  } else if (event.data === "pause") {
    isPaused = !isPaused;
    postMessage(isPaused ? "paused" : "resumed");
  }
  // console.log("Worker: Message received from main script", event.data);
  // postMessage(`Hi, ${event.data}`);
};
