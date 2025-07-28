// src/components/input/SocketInput.ts
import { InputProvider, InputState } from "./InputProvider";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

let state: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
};

socket.on("connect", () => {
  console.log("[SocketInput] Conectado ao servidor:", socket.id);
});

socket.on("playerInput", (data: InputState) => {
  console.log("[SocketInput] Dados recebidos:", data);
  if (typeof data === "object") {
    state = {
      forward: !!data.forward,
      backward: !!data.backward,
      left: !!data.left,
      right: !!data.right,
      run: !!data.run,
    };
  }
});

export const SocketInput: InputProvider = {
  getInputState: () => ({ ...state }),
};
