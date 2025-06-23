import { useGLTF } from '@react-three/drei'
import { PosteComLuz } from './PosteComLuz'

export const Chao = () => {
  const { scene: chaoScene } = useGLTF('/assets/chao.glb')

  return (
    <>
      <primitive object={chaoScene} scale={90} position={[0, -91, 0]} />

      <PosteComLuz position={[-6.5, -2, 6]}  color="#FFB74C"/>
      <PosteComLuz position={[-8, -2, -27]} intensity={80} color="#FFB74C"  />
    </>
  )
}