import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SocketInput } from "../components/input/SocketInput";

type SocketPlayerProps = {
  debug?: boolean;
};

export function SocketPlayer({ debug = false }: SocketPlayerProps) {
  const localRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/assets/robo.glb");
  const model = scene.clone(true);
  model.rotation.y = -Math.PI / 2;
  const velocity = new THREE.Vector3();

  useFrame((_, delta) => {
    const { forward, backward, left, right, run } = SocketInput.getInputState();

    const forwardVec = new THREE.Vector3(0, 0, -1);
    const rightVec = new THREE.Vector3(1, 0, 0);

    const moveDir = new THREE.Vector3();
    if (forward) moveDir.add(forwardVec);
    if (backward) moveDir.sub(forwardVec);
    if (left) moveDir.sub(rightVec);
    if (right) moveDir.add(rightVec);
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
          <meshStandardMaterial color="blue" />
        </mesh>
      )}
    </group>
  );
}
