import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { BeaconMarker } from './BeaconMarker';
import { getItemsByCategory } from '../../data/ethnoData';
import type { EthnoItem } from '../../data/ethnoData';
import { useAppStore } from '../../store';

const GLOBE_RADIUS = 2;

// High-quality texture URLs with CORS support (GitHub raw files)
const TEXTURE_URLS = {
  // Earth day texture
  diffuse: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  // Normal map for terrain relief
  bump: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  // Specular map (water/land mask)
  specular: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  // City lights at night
  night: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
  // Clouds
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
};

// Hyperrealistic Earth shader with advanced lighting
function createEarthMaterial(
  diffuseMap: THREE.Texture,
  bumpMap: THREE.Texture,
  specularMap: THREE.Texture,
  nightMap: THREE.Texture
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: diffuseMap },
      nightTexture: { value: nightMap },
      bumpTexture: { value: bumpMap },
      specularTexture: { value: specularMap },
      sunDirection: { value: new THREE.Vector3(1.0, 0.4, 0.6).normalize() },
      bumpScale: { value: 0.05 },
      nightIntensity: { value: 1.8 },
      atmosphereColor: { value: new THREE.Color('#4da6ff') },
      fresnelPower: { value: 4.0 },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform sampler2D bumpTexture;
      uniform sampler2D specularTexture;
      uniform vec3 sunDirection;
      uniform float bumpScale;
      uniform float nightIntensity;
      uniform vec3 atmosphereColor;
      uniform float fresnelPower;
      uniform float time;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      
      void main() {
        // Sample textures
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);
        float specularMask = texture2D(specularTexture, vUv).r;
        
        // Perturb normal with bump map for terrain detail
        vec3 bumpNormal = texture2D(bumpTexture, vUv).rgb * 2.0 - 1.0;
        vec3 normal = normalize(vNormal + bumpNormal * bumpScale);
        
        // Calculate sun angle
        float sunAngle = dot(normal, sunDirection);
        
        // Smooth day/night terminator
        float dayFactor = smoothstep(-0.25, 0.35, sunAngle);
        float nightFactor = smoothstep(0.1, -0.35, sunAngle);
        
        // Mix day and night with city lights
        vec3 color = dayColor.rgb * dayFactor;
        
        // City lights with subtle glow
        vec3 cityGlow = nightColor.rgb * nightIntensity;
        cityGlow = cityGlow + cityGlow * cityGlow * 0.4;
        color += cityGlow * nightFactor * (1.0 - dayFactor);
        
        // Very subtle warm glow at terminator (sunrise/sunset feel)
        float terminator = smoothstep(-0.15, 0.05, sunAngle) * smoothstep(0.3, 0.0, sunAngle);
        vec3 warmGlow = vec3(1.0, 0.85, 0.7) * terminator * 0.08;
        color += warmGlow * dayColor.rgb;
        
        // Ocean specular reflection
        vec3 halfDir = normalize(sunDirection + vViewDir);
        float specular = pow(max(dot(normal, halfDir), 0.0), 256.0);
        float specularSoft = pow(max(dot(normal, halfDir), 0.0), 32.0);
        color += vec3(1.0, 0.98, 0.95) * (specular * 1.2 + specularSoft * 0.08) * specularMask * dayFactor;
        
        // Fresnel rim lighting - subtle blue atmospheric glow at edges
        float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), fresnelPower);
        color += atmosphereColor * fresnel * 0.12 * (0.6 + dayFactor * 0.4);
        
        // Subtle ambient
        color += dayColor.rgb * 0.025;
        
        // Tone mapping
        color = color / (color + vec3(1.0)) * 1.08;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

// Subtle atmosphere rim glow
function RealisticAtmosphere({ radius }: { radius: number }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: new THREE.Vector3(1.0, 0.4, 0.6).normalize() },
        atmosphereColor: { value: new THREE.Color('#5599cc') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        uniform vec3 atmosphereColor;
        
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vWorldNormal;
        
        void main() {
          // Very thin rim effect only at the edge
          float viewAngle = dot(vNormal, vViewDir);
          float rim = pow(1.0 - clamp(viewAngle, 0.0, 1.0), 6.0);
          
          // Sun influence
          float sunFacing = max(dot(vWorldNormal, sunDirection), 0.0);
          
          // Very subtle color
          vec3 color = atmosphereColor * (0.6 + sunFacing * 0.4);
          
          // Very low alpha - just a hint of atmosphere
          float alpha = rim * 0.25 * (0.5 + sunFacing * 0.5);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });
  }, []);

  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Inner atmosphere glow - very subtle
function InnerGlow({ radius }: { radius: number }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#4488aa') },
        sunDirection: { value: new THREE.Vector3(1.0, 0.4, 0.6).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform vec3 sunDirection;
        
        varying vec3 vNormal;
        varying vec3 vViewDir;
        
        void main() {
          float viewDot = dot(vNormal, vViewDir);
          // Very thin edge glow
          float intensity = pow(clamp(0.4 - viewDot, 0.0, 1.0), 4.0);
          float sunFacing = max(dot(vNormal, sunDirection), 0.0);
          vec3 color = glowColor * (0.5 + sunFacing * 0.5);
          gl_FragColor = vec4(color, intensity * 0.1);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.03, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { currentMode, selectedItem, setSelectedItem, setGlobeLoaded } = useAppStore();
  const { gl } = useThree();
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Load all textures with error handling
  const textures = useLoader(
    TextureLoader, 
    [
      TEXTURE_URLS.diffuse,
      TEXTURE_URLS.bump,
      TEXTURE_URLS.specular,
      TEXTURE_URLS.night,
      TEXTURE_URLS.clouds,
    ],
    undefined,
    (error) => {
      console.warn('Texture loading error:', error);
      // Still mark as loaded even if some textures fail
      setGlobeLoaded(true);
    }
  );
  
  const [diffuseMap, bumpMap, specularMap, nightMap, cloudsMap] = textures;

  // Configure textures with max quality
  useEffect(() => {
    if (!diffuseMap) return;
    
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    
    [diffuseMap, bumpMap, specularMap, nightMap, cloudsMap].forEach((tex, i) => {
      if (tex) {
        tex.anisotropy = maxAnisotropy;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        // Proper color space
        if (i === 0 || i === 3 || i === 4) {
          tex.colorSpace = THREE.SRGBColorSpace;
        } else {
          tex.colorSpace = THREE.LinearSRGBColorSpace;
        }
      }
    });
    
    setTexturesLoaded(true);
  }, [diffuseMap, bumpMap, specularMap, nightMap, cloudsMap, gl]);

  // Create custom Earth material
  const earthMaterial = useMemo(() => {
    if (texturesLoaded && diffuseMap && bumpMap && specularMap && nightMap) {
      return createEarthMaterial(diffuseMap, bumpMap, specularMap, nightMap);
    }
    return null;
  }, [texturesLoaded, diffuseMap, bumpMap, specularMap, nightMap]);

  // Loading complete
  useEffect(() => {
    if (texturesLoaded) {
      const timer = setTimeout(() => setGlobeLoaded(true), 300);
      return () => clearTimeout(timer);
    }
  }, [texturesLoaded, setGlobeLoaded]);

  // Get items for current mode
  const items = useMemo(() => {
    return getItemsByCategory(currentMode);
  }, [currentMode]);

  // Rotation animation
  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.008;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.012;
    }
  });

  const handleMarkerClick = (item: EthnoItem) => {
    setSelectedItem(item);
  };

  return (
    <group ref={globeRef}>
      {/* Main Earth with custom shader */}
      {earthMaterial && (
        <mesh ref={earthRef}>
          <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
          <primitive object={earthMaterial} attach="material" />
        </mesh>
      )}

      {/* Fallback while shader loads */}
      {!earthMaterial && diffuseMap && (
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshStandardMaterial map={diffuseMap} />
        </mesh>
      )}

      {/* Cloud layer */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.015, 64, 64]} />
          <meshBasicMaterial
            map={cloudsMap}
            transparent
            opacity={0.4}
            depthWrite={false}
            alphaMap={cloudsMap}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {/* Outer realistic atmosphere - render first for proper blending */}
      <RealisticAtmosphere radius={GLOBE_RADIUS} />

      {/* Inner atmosphere glow */}
      <InnerGlow radius={GLOBE_RADIUS} />

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
    </group>
  );
}