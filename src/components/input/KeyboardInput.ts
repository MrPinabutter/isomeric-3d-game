// src/inputs/KeyboardInput.ts
import { InputProvider, InputState } from "./InputProvider";

const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "run",
} as const;

type KeyMap = typeof keys[keyof typeof keys];

const state: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
};

document.addEventListener("keydown", (e) => {
  const key = keys[e.code as keyof typeof keys];
  if (key) state[key as KeyMap] = true;
});

document.addEventListener("keyup", (e) => {
  const key = keys[e.code as keyof typeof keys];
  if (key) state[key as KeyMap] = false;
});

export const KeyboardInput: InputProvider = {
  getInputState: () => ({ ...state }),
};
// 