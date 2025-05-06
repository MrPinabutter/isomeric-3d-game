import { useEffect, useState } from "react";

export const usePlayerMovement = () => {
  const keys = {
    KeyW: "forward",
    KeyS: "backward",
    KeyA: "left",
    KeyD: "right",
    Space: "jump",
    ShiftLeft: "run",
  };

  const moveFieldByKey = (key: keyof typeof keys) => keys[key];

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setMovement((m) => ({
        ...m,
        [moveFieldByKey(e.code as keyof typeof keys)]: true,
      }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setMovement((m) => ({
        ...m,
        [moveFieldByKey(e.code as keyof typeof keys)]: false,
      }));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return movement;
};
