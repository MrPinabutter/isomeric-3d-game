// components/Chao.tsx
import { useGLTF } from '@react-three/drei'

export const Chao = () => {
  const { scene } = useGLTF('/assets/chao.glb')

  return (
    <primitive object={scene} scale={90} position={[0, -91, 0]} />
  )
}
