import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { create } from "zustand";

const usePlayerControls = create(() => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
}));

const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  ShiftLeft: "run",
};

//TODO: separar em um arquivo diferente os inpuit, fazer um esquema tipo observador, https://refactoring.guru/pt-br/design-patterns/observer

type PlayerProps = {
  camera: THREE.Camera;
};

document.addEventListener("keydown", (e) => {
  const control = keys[e.code as keyof typeof keys];
  if (control) usePlayerControls.setState({ [control]: true });
});

document.addEventListener("keyup", (e) => {
  const control = keys[e.code as keyof typeof keys];
  if (control) usePlayerControls.setState({ [control]: false });
});

export const Player = forwardRef<THREE.Group, PlayerProps>(
  ({ camera }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/assets/robo.glb");
    //virando levemente personagem pra ele nao ficar de lado TODO: exportar certo do blender
    scene.rotation.y = -Math.PI / 2;
    const velocity = new THREE.Vector3();

    useImperativeHandle(ref, () => localRef.current!);

    useFrame((_, delta) => {
      const { forward, backward, left, right, run } =
        usePlayerControls.getState();

      const camDirection = new THREE.Vector3();
      camera.getWorldDirection(camDirection);
      camDirection.y = 0; // ignorar componente vertical
      camDirection.normalize();

      const camRight = new THREE.Vector3();
      camRight
        .crossVectors(new THREE.Vector3(0, 1, 0), camDirection)
        .normalize();

      const moveDir = setDirectionMove();

      if (moveDir.length() > 0) {
        const SPEED = 8;
        moveDir.normalize().multiplyScalar(SPEED * (run ? 2 : 1));
        velocity.lerp(moveDir, 0.2);
        localRef.current?.lookAt(
          localRef.current.position.clone().add(moveDir)
        );
      } else {
        velocity.lerp(new THREE.Vector3(0, 0, 0), 0.2);
      }

      localRef.current?.position.addScaledVector(velocity, delta);

      function setDirectionMove() {
        const moveDir = new THREE.Vector3();
        if (forward) moveDir.add(camDirection);
        if (backward) moveDir.sub(camDirection);
        if (left) moveDir.add(camRight);
        if (right) moveDir.sub(camRight);
        if (run) moveDir.multiplyScalar(2);

        return moveDir;
      }
    });

    return (
      <group ref={localRef} position={[0, -0.6, 0]}>
        <primitive object={scene} scale={1} position={[0.9, 0, 0]} />
      </group>
    );
  }
);
