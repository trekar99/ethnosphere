import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Atmosphere, InnerGlow } from './Atmosphere';
import { BeaconMarker } from './BeaconMarker';
import { getItemsByCategory } from '../../data/ethnoData';
import type { EthnoItem } from '../../data/ethnoData';
import { useAppStore } from '../../store';

const GLOBE_RADIUS = 2;

// High-quality texture URLs
const TEXTURE_URLS = {
  diffuse: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  night: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
};

export function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const { currentMode, selectedItem, setSelectedItem } = useAppStore();

  // Load all textures
  const [diffuseMap, normalMap, specularMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    TEXTURE_URLS.diffuse,
    TEXTURE_URLS.normal,
    TEXTURE_URLS.specular,
    TEXTURE_URLS.night,
    TEXTURE_URLS.clouds,
  ]);

  // Configure textures properly
  useMemo(() => {
    if (diffuseMap) {
      diffuseMap.colorSpace = THREE.SRGBColorSpace;
      diffuseMap.anisotropy = 16;
    }
    if (normalMap) {
      normalMap.colorSpace = THREE.LinearSRGBColorSpace;
      normalMap.anisotropy = 16;
    }
    if (specularMap) {
      specularMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (nightMap) {
      nightMap.colorSpace = THREE.SRGBColorSpace;
    }
    if (cloudsMap) {
      cloudsMap.colorSpace = THREE.SRGBColorSpace;
    }
  }, [diffuseMap, normalMap, specularMap, nightMap, cloudsMap]);

  // Loading progress simulation
  useEffect(() => {
    if (diffuseMap && normalMap && specularMap && nightMap && cloudsMap) {
      // Textures loaded, animate progress to 100
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoaded(true), 300);
            return 100;
          }
          return prev + 8;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [diffuseMap, normalMap, specularMap, nightMap, cloudsMap]);

  // Get items for current mode
  const items = useMemo(() => {
    return getItemsByCategory(currentMode);
  }, [currentMode]);

  // Slow rotation animation
  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.012;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.018;
    }
  });

  const handleMarkerClick = (item: EthnoItem) => {
    setSelectedItem(item);
  };

  return (
    <group ref={globeRef}>
      {/* Loading overlay */}
      {!isLoaded && (
        <Html center>
          <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-black z-50">
            {/* Animated glow */}
            <div 
              className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-25"
              style={{
                background: 'radial-gradient(circle, #00a8ff 0%, transparent 70%)',
                animation: 'pulse 2.5s ease-in-out infinite',
              }}
            />
            
            {/* Globe SVG */}
            <div className="relative w-28 h-28 mb-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#00a8ff" strokeWidth="0.5" opacity="0.2" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="#00a8ff" strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${loadProgress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 0.15s ease' }}
                />
                <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#00a8ff" strokeWidth="0.4" opacity="0.3" />
                <ellipse cx="50" cy="50" rx="18" ry="45" fill="none" stroke="#00a8ff" strokeWidth="0.4" opacity="0.3" />
                <circle cx="50" cy="50" r="4" fill="#00a8ff" opacity="0.6">
                  <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-light tracking-[0.4em] mb-3">
              <span className="text-[#00a8ff]">ETHNO</span>
              <span className="text-white/90">SPHERE</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-10">
              Interactive World Music Atlas
            </p>
            
            {/* Progress bar */}
            <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00a8ff] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            
            {/* Percentage */}
            <p className="mt-4 text-white/40 text-sm font-mono tracking-wider">
              {loadProgress}%
            </p>
            
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.2; }
                50% { transform: scale(1.15); opacity: 0.35; }
              }
            `}</style>
          </div>
        </Html>
      )}

      {/* Main Earth - high quality physically based material */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 256, 256]} />
        <meshPhysicalMaterial
          map={diffuseMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughnessMap={specularMap}
          roughness={0.85}
          metalness={0.05}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Night lights layer - subtle glow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.002, 128, 128]} />
        <meshBasicMaterial
          map={nightMap}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Single cloud layer - cleaner look */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.015, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
          alphaTest={0.05}
        />
      </mesh>

      {/* Markers */}
      {items.map((item) => (
        <BeaconMarker
          key={item.id}
          item={item}
          globeRadius={GLOBE_RADIUS}
          isSelected={selectedItem?.id === item.id}
          currentMode={currentMode}
          onClick={handleMarkerClick}
        />
      ))}

      {/* Atmospheric glow */}
      <Atmosphere radius={GLOBE_RADIUS + 0.06} />
      <InnerGlow radius={GLOBE_RADIUS + 0.008} />
    </group>
  );
}
