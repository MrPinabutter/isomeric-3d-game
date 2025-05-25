import { useGLTF } from "@react-three/drei"; // Import useGLTF
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { Group, PerspectiveCamera, Plane, Raycaster, Vector3 } from "three";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import { useProjectiles } from "../hooks/useProjectlles";
import { ShineProjectile } from "./ShineProjectile";

interface PlayerProps {
  position?: Vector3;
}

export const Player = ({ position }: PlayerProps) => {
  const groupRef = useRef<Group>(null);
  const { scene: gltfScene } = useGLTF("/assets/cube.glb");

  // const [hovered, setHover] = useState(false);
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
    lifetime: 1 * 1000,
    shooterRef: groupRef,
  });

  const SPEED = 6;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const mesh = groupRef.current;

    // Calculate mouse position in world space
    const raycaster = new Raycaster();
    raycaster.setFromCamera(state.pointer, state.camera);

    // Create a plane at the player's Y position to intersect with the mouse ray
    const plane = new Plane(new Vector3(0, 0, 1), -mesh.position.z);
    const mouseWorldPosition = new Vector3();
    raycaster.ray.intersectPlane(plane, mouseWorldPosition);

    // Make the mesh look towards the mouse position (constrained to Z-axis rotation)
    const mouseDirection = new Vector3();
    if (mouseWorldPosition) {
      mouseDirection.subVectors(mouseWorldPosition, mesh.position).normalize();

      // Calculate angle only on the XY plane to avoid mirroring
      const angle = Math.atan2(mouseDirection.y, mouseDirection.x);
      mesh.rotation.z = angle - Math.PI / 2; // Subtract PI/2 if your model faces up by default
    }

    const mouseOffsetX = state.pointer.x * 0.5;
    const mouseOffsetY = state.pointer.y * 0.5;

    const newCameraPosition = new Vector3(
      mesh.position.x + mouseOffsetX,
      mesh.position.y + 0.5 + mouseOffsetY,
      state.camera.position.z
    );
    state.camera.position.lerp(newCameraPosition, 0.15);

    const targetFov = run ? 100 : 80;
    (state.camera as PerspectiveCamera).fov +=
      (targetFov - (state.camera as PerspectiveCamera).fov) * 0.05;
    state.camera.updateProjectionMatrix();

    if (dodgeTimeRemaining > 0) {
      if (dodgeDirection) {
        const progress = 1 - dodgeTimeRemaining / DODGE_DURATION;
        const easeOutStrength = 1 - Math.pow(1 - progress, 3);
        const dodgeSpeed = 40 * (1 - easeOutStrength) + 5 * easeOutStrength;
        const moveDelta = dodgeDirection
          .clone()
          .multiplyScalar(dodgeSpeed * delta);
        mesh.position.add(moveDelta);
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
        const moveDirection = new Vector3().addVectors(frontVector, sideVector);

        if (moveDirection.length() === 0) {
          const forwardDir = new Vector3();
          mesh.getWorldDirection(forwardDir);
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

        mesh.position.add(direction);
      }
    }

    updateProjectiles(delta, mesh.position);
  });

  return (
    <>
      <Suspense fallback={null}>
        <group
          ref={groupRef}
          scale={active ? 1.5 : 1}
          position={position}
          onClick={() => setActive(!active)}
          // onPointerOver={() => setHover(true)}
          // onPointerOut={() => setHover(false)}
        >
          <primitive object={gltfScene} />
        </group>
      </Suspense>

      {projectiles.map((projectile) => (
        <ShineProjectile
          key={projectile.id}
          position={projectile.position}
          scaleMultiplier={projectile.scale}
        />
      ))}
    </>
  );
};

useGLTF.preload("/assets/cube.glb");
