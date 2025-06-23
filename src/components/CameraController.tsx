import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

type CameraControllerProps = {
  targetRef: React.RefObject<THREE.Object3D>;
};
const DISTANCIA_DA_CAMERA = 10;

export default function CameraController({ targetRef }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const angles = useRef({ azimuth: 0, polar: 0.3 }); // polar: inclinação vertical
  const isDragging = useRef(false);
  const isPointerLocked = useRef(false);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      isDragging.current = true;
      // Request pointer lock for mouse trap
      gl.domElement.requestPointerLock();
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current && !isPointerLocked.current) return;

      angles.current.azimuth -= e.movementX * 0.005;
      angles.current.polar += e.movementY * 0.005;
      // Limitar ângulo vertical para não virar de ponta cabeça
      angles.current.polar = Math.min(
        Math.max(angles.current.polar, 0.1),
        Math.PI / 2 - 0.1
      );
    };

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
      if (!isPointerLocked.current) {
        isDragging.current = false;
      }
    };

    const onPointerLockError = () => {
      console.error("Pointer lock failed");
      isDragging.current = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && isPointerLocked.current) {
        document.exitPointerLock();
      }
    };

    // Add click event as backup
    const onClick = () => {
      if (!isPointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    // Mouse events
    gl.domElement.addEventListener("pointerdown", onPointerDown);
    gl.domElement.addEventListener("click", onClick);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // Pointer lock events
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);

    // Keyboard events
    window.addEventListener("keydown", onKeyDown);

    return () => {
      gl.domElement.removeEventListener("pointerdown", onPointerDown);
      gl.domElement.removeEventListener("click", onClick);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("pointerlockerror", onPointerLockError);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gl.domElement]);

  useFrame(() => {
    if (!targetRef.current) return;

    const radius = DISTANCIA_DA_CAMERA;
    const { azimuth, polar } = angles.current;

    function getCameraPosition(
      target: THREE.Object3D,
      radius: number,
      azimuth: number,
      polar: number
    ) {
      const x =
        target.position.x + radius * Math.sin(azimuth) * Math.cos(polar);
      const y = target.position.y + radius * Math.sin(polar) + 2; //+2 pra começar um pouco a cima do jogador
      const z =
        target.position.z + radius * Math.cos(azimuth) * Math.cos(polar);
      return { x, y, z };
    }

    const { x, y, z } = getCameraPosition(
      targetRef.current,
      radius,
      azimuth,
      polar
    );

    camera.position.set(x, y, z);
    camera.lookAt(
      targetRef.current.position.x,
      targetRef.current.position.y + 5,
      targetRef.current.position.z
    );
  });

  return null;
}
