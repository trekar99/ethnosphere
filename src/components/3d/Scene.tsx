import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { Globe } from './Globe';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="#061018" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

// Subtle star field
function SpaceDust() {
  return (
    <>
      {/* Sparse star field - cleaner look */}
      <Stars
        radius={100}
        depth={60}
        count={1200}
        factor={3}
        saturation={0}
        fade
        speed={0.1}
      />
      {/* Far background stars */}
      <Stars
        radius={200}
        depth={100}
        count={800}
        factor={5}
        saturation={0}
        fade
        speed={0.05}
      />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42, near: 0.1, far: 1000 }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}
      style={{ background: '#000000' }}
    >
      {/* Pure black space background */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 60, 300]} />

      {/* Realistic lighting */}
      <ambientLight intensity={0.08} color="#334466" />
      
      {/* Main sun light - positioned for good Earth illumination */}
      <directionalLight
        position={[8, 3, 6]}
        intensity={2.2}
        color="#fff8f0"
      />
      
      {/* Subtle fill light */}
      <directionalLight
        position={[-6, -2, -4]}
        intensity={0.08}
        color="#4488cc"
      />

      {/* Space environment */}
      <SpaceDust />

      {/* Globe */}
      <Suspense fallback={<LoadingFallback />}>
        <Globe />
        <Preload all />
      </Suspense>

      {/* Subtle post-processing */}
      <EffectComposer>
        {/* Gentle bloom for the markers */}
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        {/* Subtle vignette */}
        <Vignette
          offset={0.35}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.35}
        zoomSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.03}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </Canvas>
  );
}
