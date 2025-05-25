import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

interface ShineProjectileProps {
  position: Vector3;
  scaleMultiplier?: number;
  onHit?: () => void;
}

export const ShineProjectile = ({
  position,
  onHit,
  scaleMultiplier = 1,
}: ShineProjectileProps) => {
  const meshRef = useRef<Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 2;
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.rotation.z += delta;

      if (position) {
        meshRef.current.position.copy(position);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => {
        setActive(!active);
        if (onHit) onHit();
      }}
      position={position}
    >
      <sphereGeometry args={[0.3 * scaleMultiplier]} />
      <meshStandardMaterial emissive="red" emissiveIntensity={2} />
      <pointLight color="red" intensity={10} distance={5} />
    </mesh>
  );
};
