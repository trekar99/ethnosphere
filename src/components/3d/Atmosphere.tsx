import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface AtmosphereProps {
  radius?: number;
}

// Subtle neon blue atmospheric glow - cyberpunk style
export function Atmosphere({ radius = 2.08 }: AtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uAtmosphereColor: { value: new THREE.Color('#0a4a6e') },
        uAtmosphereColor2: { value: new THREE.Color('#00a8ff') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDirection = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uAtmosphereColor;
        uniform vec3 uAtmosphereColor2;
        
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          // Soft fresnel rim glow
          float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 3.5);
          
          // Subtle color gradient
          vec3 atmosphereColor = mix(uAtmosphereColor, uAtmosphereColor2, fresnel * 0.5);
          
          // Very soft intensity
          float intensity = fresnel * 0.6;
          
          // Soft alpha falloff
          float alpha = smoothstep(0.0, 0.6, fresnel) * 0.35;
          
          gl_FragColor = vec4(atmosphereColor * intensity, alpha);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 128, 128]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// Subtle inner glow - neon blue accent
export function InnerGlow({ radius = 2.01 }: AtmosphereProps) {
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#00a8ff') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDirection = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 4.0);
          float alpha = fresnel * 0.12;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      side: THREE.FrontSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[radius, 128, 128]} />
      <primitive object={glowMaterial} attach="material" />
    </mesh>
  );
}

// Additional outer atmosphere ring
export function OuterAtmosphere({ radius = 2.25 }: AtmosphereProps) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#00aaff') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDirection = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 6.0);
          float alpha = fresnel * 0.2;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
