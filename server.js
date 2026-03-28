const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("patientData", async (data) => {
    try {
      const newData = {
        ...data,
        time: new Date()
      };

      await db.collection("Data").add(newData);

      io.emit("hospitalUpdate", newData);

      console.log("✅ Data stored:", newData);

    } catch (err) {
      console.error("❌ Firebase error:", err);
    }
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});