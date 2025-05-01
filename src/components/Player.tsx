import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { usePlayerMovement } from "../hooks/usePlayerMovement";

interface DebtorProps {
  position?: Vector3;
}

export const Player = ({ position }: DebtorProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const { forward, backward, left, right, run } = usePlayerMovement();

  const SPEED = 6;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const mouseOffsetX = state.pointer.x * 0.5;
    const mouseOffsetY = state.pointer.y * 0.5;

    const newCameraPosition = new Vector3(
      meshRef.current.position.x + mouseOffsetX,
      meshRef.current.position.y + 0.5 + mouseOffsetY,
      state.camera.position.z
    );

    state.camera.position.lerp(newCameraPosition, 0.15);

    const frontVector = new Vector3(0, Number(forward) - Number(backward), 0);
    const sideVector = new Vector3(Number(right) - Number(left), 0, 0);
    const direction = new Vector3();

    direction
      .addVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta * (active || run ? 2 : 1));

    meshRef.current.position.add(direction);
  });

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      type="Dynamic"
      position={position}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};
