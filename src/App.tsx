import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { Player } from "./components/Player";
import { Debtor } from "./components/Debtor";
import { ShineProjectile } from "./components/ShineProjectile";

function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <Debtor position={new Vector3(1.2, 0, 0)} />
      <Player position={new Vector3(-1.2, 0, 0)} />
      <ShineProjectile position={new Vector3(0, 0, 1)} />
    </Canvas>
  );
}

export default App;
