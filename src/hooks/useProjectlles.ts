import { RefObject, useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";

interface Projectile {
  id: number;
  position: Vector3;
  direction: Vector3;
  createdAt: number;
  scale: number;
}

interface UseProjectilesOptions {
  maxDistance?: number;
  projectileSpeed?: number;
  lifetime?: number;
  shooterRef: RefObject<Group | null>;
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
      scale: 1,
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

          const percentage = Math.min(age / lifetime, 1);

          // Check if projectile has traveled too far
          const distanceFromPlayer = newPosition.distanceTo(playerPosition);

          if (distanceFromPlayer > maxDistance) {
            return null;
          }

          return {
            ...projectile,
            position: newPosition,
            scale: 1 - percentage,
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
    const shooter = shooterRef.current;
    if (!shooter) return;

    // Create a direction vector for the forward axis in local space
    const forward = new Vector3(-1, 0, 0);

    // Convert the rotation (Euler) to a quaternion, then apply to forward vector
    const direction = forward.clone().applyEuler(shooter.rotation).normalize();

    direction.applyAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2); // 90 degrees

    // Compute the start position in front of the shooter
    const startPosition = shooter.position
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
