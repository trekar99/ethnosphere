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

// Elegant beam height
const BEAM_HEIGHT = 0.25;
const BEAM_HEIGHT_SELECTED = 0.4;

export function BeaconMarker({ item, globeRadius, isSelected, currentMode, onClick }: BeaconMarkerProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Base position on globe surface
  const basePosition = useMemo(() => {
    return latLngToVector3(item.coordinates.lat, item.coordinates.lng, globeRadius);
  }, [item.coordinates.lat, item.coordinates.lng, globeRadius]);

  // Normal (up direction) from the surface
  const normal = useMemo(() => basePosition.clone().normalize(), [basePosition]);

  // Rotation to align beam with surface normal
  const rotation = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [normal]);

  // Position slightly above surface
  const surfacePosition = useMemo(() => {
    return basePosition.clone().add(normal.clone().multiplyScalar(0.005));
  }, [basePosition, normal]);

  // Colors - clean neon blue
  const color = currentMode === 'instruments' ? '#00a8ff' : '#818cf8';
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  // Smooth animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Subtle beam breathing
    if (beamRef.current) {
      const breathe = 1 + Math.sin(t * 2) * 0.03;
      beamRef.current.scale.y = breathe;
      (beamRef.current.material as THREE.ShaderMaterial).uniforms.opacity.value = 
        isSelected ? 0.9 : hovered ? 0.7 : 0.5;
    }

    // Soft glow pulse
    if (glowRef.current) {
      const pulse = isSelected ? 0.4 : hovered ? 0.3 : 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        pulse + Math.sin(t * 1.5) * 0.05;
    }

    // Top dot gentle float
    if (dotRef.current) {
      const float = Math.sin(t * 1.5) * 0.008;
      const beamHeight = isSelected ? BEAM_HEIGHT_SELECTED : hovered ? BEAM_HEIGHT * 1.15 : BEAM_HEIGHT;
      dotRef.current.position.y = beamHeight + float;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(item);
  };

  // Elegant gradient beam shader
  const beamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: colorObj },
        opacity: { value: 0.5 },
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
          // Smooth gradient fade from bottom to top
          float gradient = pow(1.0 - vUv.y, 1.5);
          
          // Soft edge fade
          float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
          
          float alpha = gradient * edge * opacity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [colorObj]);

  const beamHeight = isSelected ? BEAM_HEIGHT_SELECTED : hovered ? BEAM_HEIGHT * 1.15 : BEAM_HEIGHT;
  const beamWidth = isSelected ? 0.012 : hovered ? 0.01 : 0.008;
  const dotSize = isSelected ? 0.022 : hovered ? 0.018 : 0.015;

  return (
    <group position={surfacePosition} rotation={rotation}>
      {/* Minimal base dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={isSelected ? 0.8 : 0.5} 
        />
      </mesh>

      {/* Clean vertical beam - front */}
      <mesh ref={beamRef} position={[0, beamHeight / 2, 0]}>
        <planeGeometry args={[beamWidth, beamHeight]} />
        <primitive object={beamMaterial} attach="material" />
      </mesh>

      {/* Clean vertical beam - side (perpendicular) */}
      <mesh position={[0, beamHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[beamWidth, beamHeight]} />
        <primitive object={beamMaterial.clone()} attach="material" />
      </mesh>

      {/* Subtle outer glow */}
      <mesh ref={glowRef} position={[0, beamHeight / 2, 0]}>
        <cylinderGeometry args={[beamWidth * 3, beamWidth * 4, beamHeight * 0.8, 8, 1, true]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Top indicator dot */}
      <mesh 
        ref={dotRef} 
        position={[0, beamHeight, 0]}
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[dotSize, 12, 12]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : colorObj} />
      </mesh>

      {/* Dot glow halo */}
      <mesh position={[0, beamHeight, 0]}>
        <sphereGeometry args={[dotSize * 2, 12, 12]} />
        <meshBasicMaterial 
          color={colorObj} 
          transparent 
          opacity={isSelected ? 0.4 : hovered ? 0.3 : 0.2} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Invisible clickable area */}
      <mesh
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.04, 0.04, beamHeight + 0.05, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}