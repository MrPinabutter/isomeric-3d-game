import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { Player } from './components/Player'
import CameraController from './components/CameraController'
import { Chao } from './components/Chao'
import { useThree } from '@react-three/fiber'

export default function App() {
  const playerRef = useRef(null)

  return (
    <Canvas camera={{ fov: 60 }} >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <Chao />
=      <PlayerWithCamera playerRef={playerRef} />
      {/* esse target ta quebrado, mas ta funcionando, nao sei explicar como
       TODO: arruamr depois kkkkk */}
      <CameraController targetRef={playerRef} />
    </Canvas>
  )
}

// Esse componente roda dentro do Canvas, aqui pode usar useThree()
function PlayerWithCamera({ playerRef }: { playerRef: React.RefObject<any> }) {
  const { camera } = useThree()  // <-- aqui funciona porque está dentro do Canvas
  return <Player ref={playerRef} camera={camera} />
}
