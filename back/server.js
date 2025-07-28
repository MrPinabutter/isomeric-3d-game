"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // ajuste conforme necessário
    },
});
var lastInput = {};
io.on("connection", function (socket) {
    console.log("Cliente conectado:", socket.id);
    // Quando receber input de um cliente
    socket.on("playerInput", function (data) {
        lastInput = data;
        console.log("Input recebido:", data);
        io.emit("playerInput", data);
    });
    socket.on("disconnect", function () {
        console.log("Cliente desconectado:", socket.id);
    });
});
httpServer.listen(3000, function () {
    console.log("Socket.IO server rodando na porta 3000");
});
