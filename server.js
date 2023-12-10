const express = require('express');
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const path = require('path');


app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'public', 'index.html')
)});

const io = new Server(server);

io.on("connection", (socket) => {
    //lắng nghe từ client
    socket.on("chat message", (msg)=>{
        console.log("Message:" + msg);

        //gửi tin nhắn đến all client khác
        io.emit('chat message' , msg);
    });
     socket.on("typing", () => {
       socket.broadcast.emit("typing", "Someone is typing...");
     });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});



