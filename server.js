// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");


// --------------------
// 1️⃣ Firebase Setup
// --------------------
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("✅ Firebase connected");

// --------------------
// 2️⃣ Express + Socket.IO Setup
// --------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow all origins for simplicity
});

// --------------------
// 3️⃣ Socket.IO events
// --------------------
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Receive data from frontend
  socket.on("patientData", async (data) => {
    console.log("📥 Received data:", data);

    // Save to Firebase Firestore
    const docRef = db.collection("patients").doc();
    await docRef.set(data);

    // Broadcast to all connected clients
    io.emit("hospitalUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// --------------------
// 4️⃣ Start server
// --------------------
const PORT = process.env.PORT || 3000;
// CORRECT — use PORT variable
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));
