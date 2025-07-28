import { useEffect } from "react";
import { io } from "socket.io-client";

// Cria o socket
const socket = io("http://localhost:3000"); 

export default function SendInputPage() {
  useEffect(() => {
    const inputState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      run: false,
    };

    const updateKey = (key: string, pressed: boolean) => {
      switch (key.toLowerCase()) {
        case "w":
          inputState.forward = pressed;
          break;
        case "s":
          inputState.backward = pressed;
          break;
        case "a":
          inputState.left = pressed;
          break;
        case "d":
          inputState.right = pressed;
          break;
        case "shift":
          inputState.run = pressed;
          break;
        default:
          return;
      }

      socket.emit("playerInput", inputState);
    };

    const handleKeyDown = (e: KeyboardEvent) => updateKey(e.key, true);
    const handleKeyUp = (e: KeyboardEvent) => updateKey(e.key, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return 323;
}
    