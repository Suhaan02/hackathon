const io = require("socket.io-client");

const socket = io("https://your-render-url");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  socket.emit("patientData", {
    pulse: 85,
    heartRate: 100,
    notes: "Test case"
  });
});