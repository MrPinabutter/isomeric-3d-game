import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { usePlayerMovement } from "../hooks/usePlayerMovement";

interface DebtorProps {
  position?: Vector3;
}

export const Player = ({ position }: DebtorProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const { forward, backward, left, right } = usePlayerMovement();

  const SPEED = 6;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const frontVector = new Vector3(0, Number(forward) - Number(backward), 0);
    const sideVector = new Vector3(Number(right) - Number(left), 0, 0);
    const direction = new Vector3();

    direction
      .addVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta * (active ? 2 : 1));

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
