import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

type PosteComLuzProps = {
  position: [number, number, number] 
  intensity?: number
  distance?: number
  decay?: number
  color?: string
  offset?: [number, number, number] 
  debug?: boolean
}

export const PosteComLuz = ({
  position,
  intensity = 100,
  distance = 20,
  decay = 0,
  color = 'yellow',
  offset = [3.5, 16, 0],
  debug = false,
}: PosteComLuzProps) => {
  const { scene: posteScene } = useGLTF('/assets/poste.glb')

  const poste = useMemo(() => posteScene.clone(true), [posteScene])

  const luzPosition: [number, number, number] = [
    position[0] + offset[0],
    position[1] + offset[1],
    position[2] + offset[2],
  ]

  return (
    <>
      <primitive object={poste} scale={2} position={position} />
      <pointLight
        position={luzPosition}
        intensity={intensity}
        distance={distance}
        decay={decay}
        color={color}
        castShadow
      />
      {debug && (
        <mesh position={luzPosition}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </>
  )
}
