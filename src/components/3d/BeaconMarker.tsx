import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { EthnoItem, Mode } from '../../data/ethnoData';

interface BeaconMarkerProps {
  item: EthnoItem;
  globeRadius: number;
  isSelected: boolean;
  currentMode: Mode;
  onClick: (item: EthnoItem) => void;
}

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export function BeaconMarker({ item, globeRadius, isSelected, currentMode, onClick }: BeaconMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pinRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Base position on globe surface
  const basePosition = useMemo(() => {
    return latLngToVector3(item.coordinates.lat, item.coordinates.lng, globeRadius);
  }, [item.coordinates.lat, item.coordinates.lng, globeRadius]);

  // Normal direction from surface
  const normal = useMemo(() => basePosition.clone().normalize(), [basePosition]);

  // Rotation to align with surface normal
  const rotation = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [normal]);

  // Position at surface
  const surfacePosition = useMemo(() => {
    return basePosition.clone().add(normal.clone().multiplyScalar(0.002));
  }, [basePosition, normal]);

  // Color
  const color = currentMode === 'instruments' ? '#00a8ff' : '#818cf8';
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  // Sizes based on state
  const pinHeight = isSelected ? 0.10 : hovered ? 0.08 : 0.06;
  const pinRadius = isSelected ? 0.014 : hovered ? 0.012 : 0.010;

  // Animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Gentle floating animation for pin
    if (pinRef.current) {
      const float = Math.sin(t * 1.5 + item.coordinates.lat * 0.1) * 0.003;
      pinRef.current.position.y = pinHeight + float;
    }

    // Pulse ring when selected
    if (ringRef.current && isSelected) {
      const scale = 1 + (t % 1.5) * 0.8;
      const opacity = 1 - (t % 1.5) / 1.5;
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(item);
  };

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group ref={groupRef} position={surfacePosition} rotation={rotation}>
      {/* Base anchor point - tiny dot */}
      <mesh>
        <circleGeometry args={[0.008, 16]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={isSelected ? 0.9 : hovered ? 0.7 : 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thin stem line */}
      <mesh position={[0, pinHeight / 2, 0]}>
        <cylinderGeometry args={[0.002, 0.002, pinHeight, 8]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={isSelected ? 0.8 : hovered ? 0.6 : 0.4}
        />
      </mesh>

      {/* Pin head - elegant sphere */}
      <mesh
        ref={pinRef}
        position={[0, pinHeight, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[pinRadius, 24, 24]} />
        <meshBasicMaterial 
          color={isSelected ? '#ffffff' : colorObj}
        />
      </mesh>

      {/* Glow around pin head */}
      <mesh position={[0, pinHeight, 0]}>
        <sphereGeometry args={[pinRadius * 2.2, 16, 16]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={isSelected ? 0.4 : hovered ? 0.25 : 0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Selection ring pulse */}
      {isSelected && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.015, 0.018, 32]} />
          <meshBasicMaterial 
            color={colorObj} 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Invisible larger hit area */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <cylinderGeometry args={[0.025, 0.025, pinHeight + 0.03, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}