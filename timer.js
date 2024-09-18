x = null;
onmessage = (event) => {
  if (event.data === "start") {
    clearInterval(x);
    x = setInterval(() => {
      postMessage("tick");
    }, 100);
  } else if (event.data === "stop") {
    clearInterval(x);
    console.log("STOP received by worker");
  }
  // console.log("Worker: Message received from main script", event.data);
  // postMessage(`Hi, ${event.data}`);
};
