const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const serverSocket = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

serverSocket.on("connection", (socket) => {
  socket.on("sender-join", function (data) {
    socket.join(data.uid);
  });
  socket.on("reciever-join", function (data) {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta", function (data) {
    socket.in(data.uid).emit("fs-meta", data.metadata);
  });
  socket.on("fs-start", function (data) {
    socket.in(data.uid).emit("fs-share", {});
  });
  socket.on("file-raw", function (data) {
    socket.in(data.uid).emit("fs-share", data.buffer);
  });
});

server.listen(5000);
