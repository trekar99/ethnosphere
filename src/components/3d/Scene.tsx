import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { Globe } from './Globe';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="#061018" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

// Hyperrealistic deep space environment
function SpaceEnvironment() {
  return (
    <>
      {/* Dense distant stars */}
      <Stars
        radius={300}
        depth={100}
        count={2000}
        factor={4}
        saturation={0.1}
        fade
        speed={0.02}
      />
      {/* Sparse bright stars */}
      <Stars
        radius={150}
        depth={60}
        count={200}
        factor={8}
        saturation={0}
        fade
        speed={0.01}
      />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45, near: 0.1, far: 1000 }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
      style={{ background: '#000000' }}
    >
      {/* Deep space black */}
      <color attach="background" args={['#000004']} />
      <fog attach="fog" args={['#000004', 100, 500]} />

      {/* Realistic space lighting */}
      <ambientLight intensity={0.03} color="#0a1525" />
      
      {/* Main sunlight - warm and intense */}
      <directionalLight
        position={[12, 5, 8]}
        intensity={3.5}
        color="#fff5e6"
      />
      
      {/* Subtle earthshine - blue fill */}
      <directionalLight
        position={[-6, -4, -4]}
        intensity={0.12}
        color="#2244aa"
      />
      
      {/* Rim light for depth */}
      <directionalLight
        position={[-8, 2, -6]}
        intensity={0.08}
        color="#334466"
      />

      {/* Space environment */}
      <SpaceEnvironment />

      {/* Globe */}
      <Suspense fallback={<LoadingFallback />}>
        <Globe />
        <Preload all />
      </Suspense>

      {/* Cinematic post-processing */}
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.4}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      {/* Camera controls - smooth and cinematic */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.8}
        maxDistance={10}
        autoRotate={false}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        enableDamping={true}
        dampingFactor={0.04}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </Canvas>
  );
}
