import { Canvas } from '@react-three/fiber'
import { forwardRef, useRef } from 'react'
import { Player } from './components/Player'
import CameraController from './components/CameraController'
import { Chao } from './components/Chao'
import { useThree } from '@react-three/fiber'
import SkyDome from './components/SkyDome'
 import { KeyboardInput } from "./components/input/KeyboardInput"
 import { SocketInput } from "./components/input/SocketInput";
import { SocketPlayer } from './components/SocketPlayer'



export default function App() { 
  const playerRef = useRef(null)
  return (
    <Canvas camera={{ fov: 60 }}  style={{ width: '100vw', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
   
      <Chao />
      <SkyDome />
      <PlayerWithCamera playerRef={playerRef} />
      <CameraController targetRef={playerRef} />

      <SocketPlayer  debug />

    </Canvas>
  )
}

// Esse componente roda dentro do Canvas, aqui pode usar useThree()
function PlayerWithCamera({ playerRef }: { playerRef: React.RefObject<any> }) {
  const { camera } = useThree() 
  return <Player ref={playerRef} camera={camera} input={KeyboardInput}  />
}

function RemotePlayer({ playerRef }: { playerRef: React.RefObject<any> }) {
  return <Player ref={playerRef} camera={null} input={SocketInput}  />;
};