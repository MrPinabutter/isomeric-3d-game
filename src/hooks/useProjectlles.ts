import { RefObject, useEffect, useRef, useState } from "react";
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from "three";

interface Projectile {
  id: number;
  position: Vector3;
  direction: Vector3;
  createdAt: number;
}

interface UseProjectilesOptions {
  maxDistance?: number;
  projectileSpeed?: number;
  lifetime?: number;
  shooterRef: RefObject<Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  > | null>;
}

export const useProjectiles = ({
  maxDistance = 100,
  projectileSpeed = 15,
  lifetime = 5 * 1000, // 5 seconds
  shooterRef,
}: UseProjectilesOptions) => {
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);

  const nextProjectileId = useRef(0);

  const shootProjectile = (origin: Vector3, direction: Vector3) => {
    const newProjectile: Projectile = {
      id: nextProjectileId.current,
      position: origin.clone(),
      direction: direction.clone().normalize(),
      createdAt: Date.now(),
    };

    setProjectiles((prev) => [...prev, newProjectile]);
    nextProjectileId.current += 1;

    return newProjectile.id;
  };

  const updateProjectiles = (delta: number, playerPosition: Vector3) => {
    const now = Date.now();

    setProjectiles((prev) => {
      return prev
        .map((projectile) => {
          // Calculate new position
          const newPosition = projectile.position
            .clone()
            .add(
              projectile.direction
                .clone()
                .multiplyScalar(projectileSpeed * delta)
            );

          // Check if projectile has expired by time
          const age = now - projectile.createdAt;
          if (lifetime > 0 && age > lifetime) {
            return null;
          }

          // Check if projectile has traveled too far
          const distanceFromPlayer = newPosition.distanceTo(playerPosition);

          if (distanceFromPlayer > maxDistance) {
            return null;
          }

          return {
            ...projectile,
            position: newPosition,
          };
        })
        .filter((p): p is Projectile => p !== null);
    });
  };

  const removeProjectile = (id: number) => {
    setProjectiles((prev) => prev.filter((p) => p.id !== id));
  };

  const clearProjectiles = () => {
    setProjectiles([]);
  };

  const handleShoot = () => {
    if (!shooterRef.current) return;

    const direction = new Vector3();
    shooterRef.current.getWorldDirection(direction);

    const startPosition = shooterRef.current.position
      .clone()
      .add(direction.clone().multiplyScalar(1.5));

    shootProjectile(startPosition, direction);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleShoot);
    return () => {
      document.removeEventListener("mousedown", handleShoot);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projectiles,
    shootProjectile,
    updateProjectiles,
    removeProjectile,
    clearProjectiles,
  };
};
