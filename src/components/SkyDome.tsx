import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function SkyDome() {
  const texture = useLoader(THREE.TextureLoader, '/sky.png') // caminho da imagem

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}