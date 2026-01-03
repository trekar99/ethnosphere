import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
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
