import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // ajuste conforme necessário
  },
});

let lastInput: any = {};

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Quando receber input de um cliente
  socket.on("playerInput", (data) => {
    lastInput = data;
    console.log("Input recebido:", data);
    io.emit("playerInput", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("Socket.IO server rodando na porta 3000");
});
