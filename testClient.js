// testClient.js
const { io } = require("socket.io-client");

// Replace with your server URL if deployed, or localhost for local test
const SERVER_URL = "http://localhost:3000"; 
const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // Simulate sending patient data every 5 seconds
  setInterval(() => {
    const patientData = {
      name: "John Doe",
      pulse: Math.floor(Math.random() * 40) + 60, // 60–100
      heartRate: Math.floor(Math.random() * 40) + 60,
      notes: "Test patient"
    };
    socket.emit("patientData", patientData);
    console.log("📤 Sent patient data:", patientData);
  }, 5000);

  // Simulate sending ambulance location every 3 seconds
  setInterval(() => {
    const ambulanceLocation = {
      lat: 12.9716 + Math.random() * 0.01,
      lng: 77.5946 + Math.random() * 0.01
    };
    socket.emit("ambulanceLocation", ambulanceLocation);
    console.log("📤 Sent ambulance location:", ambulanceLocation);
  }, 3000);
});

// Listen for hospital updates
socket.on("hospitalUpdate", (data) => {
  console.log("🏥 Hospital received update:", data);
});

// Listen for ambulance location broadcast
socket.on("ambulanceLocation", (loc) => {
  console.log("🚑 Ambulance location broadcast:", loc);
});