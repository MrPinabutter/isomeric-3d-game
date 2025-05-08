import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, PerspectiveCamera, Vector3 } from "three";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useProjectiles } from "../hooks/useProjectlles";
import { ShineProjectile } from "./ShineProjectile";

interface PlayerProps {
  position?: Vector3;
}

export const Player = ({ position }: PlayerProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [dodgeDirection, setDodgeDirection] = useState<Vector3 | null>(null);
  const [dodgeTimeRemaining, setDodgeTimeRemaining] = useState(0);

  const DODGE_TIMEOUT = 1000 * 1;
  const DODGE_DURATION = 300;

  const { forward, backward, left, right, run, dodge } = usePlayerMovement();

  const { projectiles, updateProjectiles } = useProjectiles({
    maxDistance: 15,
    projectileSpeed: 15,
    lifetime: 5 * 1000,
    shooterRef: meshRef,
  });

  const SPEED = 6;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update camera position based on mouse movement
    const mouseOffsetX = state.pointer.x * 0.5;
    const mouseOffsetY = state.pointer.y * 0.5;

    const newCameraPosition = new Vector3(
      meshRef.current.position.x + mouseOffsetX,
      meshRef.current.position.y + 0.5 + mouseOffsetY,
      state.camera.position.z
    );

    state.camera.position.lerp(newCameraPosition, 0.15);

    // Update camera FOV based on run state
    const targetFov = run ? 100 : 80;
    (state.camera as PerspectiveCamera).fov =
      (state.camera as PerspectiveCamera).fov +
      (targetFov - (state.camera as PerspectiveCamera).fov) * 0.05;
    state.camera.updateProjectionMatrix();

    // Handle player movement
    if (dodgeTimeRemaining > 0) {
      if (dodgeDirection) {
        const progress = 1 - dodgeTimeRemaining / DODGE_DURATION;
        const easeOutStrength = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const dodgeSpeed = 40 * (1 - easeOutStrength) + 5 * easeOutStrength;

        const moveDelta = dodgeDirection
          .clone()
          .multiplyScalar(dodgeSpeed * delta);
        meshRef.current.position.add(moveDelta);
      }

      setDodgeTimeRemaining((prev) => Math.max(0, prev - delta * 1000));

      if (dodgeTimeRemaining <= 0) {
        setDodgeDirection(null);
      }
    } else {
      const frontVector = new Vector3(0, Number(forward) - Number(backward), 0);
      const sideVector = new Vector3(Number(right) - Number(left), 0, 0);
      const direction = new Vector3();

      if (dodge && !isDodging) {
        const moveDirection = new Vector3();
        moveDirection.addVectors(frontVector, sideVector);

        if (moveDirection.length() === 0) {
          const forwardDir = new Vector3();
          meshRef.current.getWorldDirection(forwardDir);
          forwardDir.z = 0;
          setDodgeDirection(forwardDir.normalize());
        } else {
          setDodgeDirection(moveDirection.normalize());
        }

        setIsDodging(true);
        setDodgeTimeRemaining(DODGE_DURATION);

        setTimeout(() => {
          setIsDodging(false);
        }, DODGE_TIMEOUT);
      } else {
        direction
          .addVectors(frontVector, sideVector)
          .normalize()
          .multiplyScalar(SPEED * delta * (active || run ? 2 : 1));

        meshRef.current.position.add(direction);
      }
    }

    // Update player rotation based on mouse position
    const lookAtTarget = new Vector3(
      state.pointer.x + meshRef.current.position.x,
      state.pointer.y + meshRef.current.position.y,
      meshRef.current.position.z
    );

    const currentLookAt = new Vector3();
    meshRef.current.getWorldDirection(currentLookAt);

    currentLookAt
      .lerp(lookAtTarget.sub(meshRef.current.position), 0.5)
      .normalize();
    meshRef.current.lookAt(meshRef.current.position.clone().add(currentLookAt));

    updateProjectiles(delta, meshRef.current.position);
  });

  return (
    <>
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
        <meshStandardMaterial
          color={isDodging ? "hotpink" : "orange"}
          opacity={hovered ? 0.2 : 1}
        />
      </mesh>

      {projectiles.map((projectile) => (
        <ShineProjectile key={projectile.id} position={projectile.position} />
      ))}
    </>
  );
};
