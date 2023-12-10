const HOST = "103.167.88.241";
const avatars = ["avatar1.jpg", "avatar2.png", "avatar4.png"]; // Danh sách các avatar

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const io = new Server(server);

io.on("connection", (socket) => {
  const userAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  //chat
  socket.on("chat message", (msg) => {
    io.emit("chat message", { msg, userAvatar, sender: socket.id });
  });

  //typing
  socket.on("typing", () => {
    socket.broadcast.emit("typing", "Someone is typing...");
  });

  //stop-typing
  socket.on("stop-typing", () => {
    socket.broadcast.emit("stop-typing", "");
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(HOST, () => {
  console.log(`Server is running on http://localhost:3001`);
});
