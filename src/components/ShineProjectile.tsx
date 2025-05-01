import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { Vector3 } from "three";

interface ShineProjectileProps {
  position?: Vector3;
}

export const ShineProjectile = ({ position }: ShineProjectileProps) => {
  const meshRef = useRef<Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta;
  });

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      position={position}
    >
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial emissive={"red"} emissiveIntensity={1} />
      <pointLight color="red" intensity={50} distance={1000} />
    </mesh>
  );
};
