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
  const clouds2Ref = useRef<THREE.Mesh>(null);
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
      globeRef.current.rotation.y += delta * 0.015;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }
    if (clouds2Ref.current) {
      clouds2Ref.current.rotation.y -= delta * 0.008;
    }
  });

  const handleMarkerClick = (item: EthnoItem) => {
    setSelectedItem(item);
  };

  return (
    <group ref={globeRef}>
      {/* Main Earth - using MeshStandardMaterial for stability */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={diffuseMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughnessMap={specularMap}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Night lights layer */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.001, 128, 128]} />
        <meshBasicMaterial
          map={nightMap}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cloud layer 1 */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.5}
          depthWrite={false}
          alphaTest={0.1}
        />
      </mesh>

      {/* Cloud layer 2 for depth */}
      <mesh ref={clouds2Ref} rotation={[0.1, 2, 0]}>
        <sphereGeometry args={[GLOBE_RADIUS + 0.035, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Markers - outside the mesh to avoid z-fighting */}
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
      <Atmosphere radius={GLOBE_RADIUS + 0.08} />
      <InnerGlow radius={GLOBE_RADIUS + 0.01} />
    </group>
  );
}
