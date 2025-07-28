export type InputState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
};

export interface InputProvider {
  getInputState(): InputState;
}