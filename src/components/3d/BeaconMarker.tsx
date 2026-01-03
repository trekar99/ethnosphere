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
  const lineRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
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
    return basePosition.clone().add(normal.clone().multiplyScalar(0.003));
  }, [basePosition, normal]);

  // Color
  const color = currentMode === 'instruments' ? '#00a8ff' : '#818cf8';
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  // Line height based on state
  const lineHeight = isSelected ? 0.18 : hovered ? 0.14 : 0.12;
  const tipSize = isSelected ? 0.018 : hovered ? 0.015 : 0.012;

  // Subtle animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.opacity.value = isSelected ? 0.85 : hovered ? 0.65 : 0.45;
    }

    if (tipRef.current) {
      // Gentle pulse
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      tipRef.current.scale.setScalar(isSelected ? pulse : 1);
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

  // Ultra-clean gradient line shader
  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: colorObj },
        opacity: { value: 0.45 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          // Clean vertical gradient - stronger at bottom
          float gradient = pow(1.0 - vUv.y, 2.0);
          // Thin center line
          float center = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 0.5);
          float alpha = gradient * center * opacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [colorObj]);

  return (
    <group position={surfacePosition} rotation={rotation}>
      {/* Thin vertical line - plane 1 */}
      <mesh ref={lineRef} position={[0, lineHeight / 2, 0]}>
        <planeGeometry args={[0.006, lineHeight]} />
        <primitive object={lineMaterial} attach="material" />
      </mesh>

      {/* Thin vertical line - plane 2 (perpendicular) */}
      <mesh position={[0, lineHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.006, lineHeight]} />
        <primitive object={lineMaterial.clone()} attach="material" />
      </mesh>

      {/* Top tip point */}
      <mesh
        ref={tipRef}
        position={[0, lineHeight, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[tipSize, 16, 16]} />
        <meshBasicMaterial 
          color={isSelected ? '#ffffff' : colorObj} 
        />
      </mesh>

      {/* Tip glow */}
      <mesh position={[0, lineHeight, 0]}>
        <sphereGeometry args={[tipSize * 1.8, 12, 12]} />
        <meshBasicMaterial
          color={colorObj}
          transparent
          opacity={isSelected ? 0.5 : hovered ? 0.35 : 0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Invisible hit area */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <cylinderGeometry args={[0.03, 0.03, lineHeight + 0.04, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}