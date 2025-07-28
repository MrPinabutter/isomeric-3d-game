// src/components/Player.tsx
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
// Update the import path below if InputProvider is located elsewhere, or create the file if missing.
import type { InputProvider } from "../components/input/InputProvider";
import { bool } from "three/tsl";

type PlayerProps = {
  camera: THREE.Camera | null;
  input: InputProvider;
  debug?: boolean;
};

export const Player = forwardRef<THREE.Group, PlayerProps>(
  ({ camera, input, debug = false }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/assets/robo.glb");
    const model = scene.clone(true);
    model.rotation.y = -Math.PI / 2;
    const velocity = new THREE.Vector3();

    useImperativeHandle(ref, () => localRef.current!);

    useFrame((_, delta) => {
      const { forward, backward, left, right, run } = input.getInputState();

      const camDirection = new THREE.Vector3();
      if (camera){
         camera.getWorldDirection(camDirection);
      }
      camDirection.y = 0;
      camDirection.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(new THREE.Vector3(0, 1, 0), camDirection).normalize();

      const moveDir = new THREE.Vector3();
      if (forward) moveDir.add(camDirection);
      if (backward) moveDir.sub(camDirection);
      if (left) moveDir.add(camRight);
      if (right) moveDir.sub(camRight);
      if (run) moveDir.multiplyScalar(2);

      if (moveDir.length() > 0) {
        const SPEED = 8;
        moveDir.normalize().multiplyScalar(SPEED);
        velocity.lerp(moveDir, 0.2);
        localRef.current?.lookAt(
          localRef.current.position.clone().add(moveDir)
        );
      } else {
        velocity.lerp(new THREE.Vector3(0, 0, 0), 0.2);
      }

      localRef.current?.position.addScaledVector(velocity, delta);
    });

    return (
      <group ref={localRef} position={[0, -0.6, 0]}>
        <primitive object={model} scale={1} position={[0.9, 0, 0]} />

        {debug && (
        <mesh position={[0.9, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
      </group>
    );
  }
);
