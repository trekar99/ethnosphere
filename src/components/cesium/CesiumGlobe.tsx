import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Viewer, 
  Entity, 
  BillboardGraphics,
  LabelGraphics,
  ImageryLayer,
} from 'resium';
import { 
  Cartesian3, 
  Color,
  Viewer as CesiumViewer,
  UrlTemplateImageryProvider,
  EllipsoidTerrainProvider,
  VerticalOrigin,
  HorizontalOrigin,
  NearFarScalar,
  CameraEventType,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useAppStore } from '../../store';
import { getItemsByCategory, type EthnoItem } from '../../data/ethnoData';

// Create satellite imagery provider (ArcGIS World Imagery - free, no token needed)
const satelliteImagery = new UrlTemplateImageryProvider({
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  maximumLevel: 19,
});

// Simple ellipsoid terrain (no token needed)
const terrainProvider = new EllipsoidTerrainProvider();

// Create a glowing marker SVG as data URI
function createMarkerSvg(color: string, isSelected: boolean): string {
  const size = isSelected ? 32 : 20;
  const glowSize = isSelected ? 48 : 30;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${glowSize}" height="${glowSize}" viewBox="0 0 ${glowSize} ${glowSize}">
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>
      <circle cx="${glowSize/2}" cy="${glowSize/2}" r="${glowSize/2 - 2}" fill="url(#glow)"/>
      <circle cx="${glowSize/2}" cy="${glowSize/2}" r="${size/4}" fill="${isSelected ? '#ffffff' : color}" filter="${isSelected ? '' : 'url(#blur)'}"/>
      <circle cx="${glowSize/2}" cy="${glowSize/2}" r="${size/4 - 1}" fill="${isSelected ? '#ffffff' : color}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function CesiumGlobe() {
  const viewerRef = useRef<CesiumViewer | null>(null);
  const { currentMode, selectedItem, setSelectedItem, setGlobeLoaded } = useAppStore();
  const [points, setPoints] = useState<EthnoItem[]>([]);

  // Update points when mode changes
  useEffect(() => {
    const items = getItemsByCategory(currentMode);
    setPoints(items);
  }, [currentMode]);

  // Configure viewer when ready
  const handleViewerReady = useCallback((viewer: CesiumViewer) => {
    viewerRef.current = viewer;
    
    // Configure scene for best visuals
    const scene = viewer.scene;
    const globe = scene.globe;
    
    // Smooth rendering
    scene.requestRenderMode = false;
    scene.maximumRenderTimeChange = Infinity;
    
    // Enable atmospheric effects
    globe.enableLighting = true;
    globe.showGroundAtmosphere = true;
    globe.atmosphereLightIntensity = 10;
    globe.atmosphereRayleighCoefficient = new Cartesian3(5.5e-6, 13.0e-6, 28.4e-6);
    globe.atmosphereMieCoefficient = new Cartesian3(21e-6, 21e-6, 21e-6);
    
    if (scene.skyAtmosphere) {
      scene.skyAtmosphere.show = true;
      scene.skyAtmosphere.atmosphereLightIntensity = 20;
    }
    
    // Space background with stars
    scene.backgroundColor = Color.BLACK;
    if (scene.skyBox) {
      scene.skyBox.show = true;
    }
    scene.sun!.show = true;
    scene.moon!.show = true;
    
    // Fog for depth
    scene.fog.enabled = true;
    scene.fog.density = 2.5e-4;
    
    // High quality rendering
    scene.highDynamicRange = true;
    scene.postProcessStages.fxaa.enabled = true;
    globe.maximumScreenSpaceError = 1.0; // Higher quality tiles
    globe.tileCacheSize = 1000;
    
    // Smooth camera controls
    scene.screenSpaceCameraController.minimumZoomDistance = 250000;
    scene.screenSpaceCameraController.maximumZoomDistance = 50000000;
    scene.screenSpaceCameraController.inertiaZoom = 0.9;
    scene.screenSpaceCameraController.inertiaSpin = 0.9;
    scene.screenSpaceCameraController.inertiaTranslate = 0.9;
    scene.screenSpaceCameraController.zoomEventTypes = [
      CameraEventType.WHEEL,
      CameraEventType.PINCH,
    ];
    
    // Set initial camera position - zoomed out view with smooth animation
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(0, 20, 20000000),
      duration: 0,
    });

    // Start auto-rotation
    let lastTime = Date.now();
    const rotateGlobe = () => {
      if (!viewerRef.current) return;
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      if (!scene.screenSpaceCameraController.enableInputs) return;
      
      // Only rotate if not interacting
      const camera = viewer.camera;
      camera.rotate(Cartesian3.UNIT_Z, -delta * 0.02);
      
      requestAnimationFrame(rotateGlobe);
    };
    requestAnimationFrame(rotateGlobe);

    setTimeout(() => setGlobeLoaded(true), 1000);
  }, [setGlobeLoaded]);

  // Handle marker click
  const handleMarkerClick = useCallback((item: EthnoItem) => {
    setSelectedItem(item);
    
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          item.coordinates.lng,
          item.coordinates.lat,
          3000000
        ),
        duration: 1.5,
        easingFunction: (time: number) => {
          // Smooth ease-in-out
          return time < 0.5 
            ? 4 * time * time * time 
            : 1 - Math.pow(-2 * time + 2, 3) / 2;
        },
      });
    }
  }, [setSelectedItem]);

  // Fly to selected item
  useEffect(() => {
    if (selectedItem && viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          selectedItem.coordinates.lng,
          selectedItem.coordinates.lat,
          3000000
        ),
        duration: 1.5,
      });
    }
  }, [selectedItem]);

  const accentColorHex = currentMode === 'instruments' ? '#00a8ff' : '#818cf8';

  return (
    <div className="w-full h-full cesium-container">
      <Viewer
        full
        ref={(e) => {
          if (e?.cesiumElement && !viewerRef.current) {
            handleViewerReady(e.cesiumElement);
          }
        }}
        // Disable all default UI for clean look
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        fullscreenButton={false}
        vrButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        // Scene options
        scene3DOnly={true}
        shadows={false}
        // Use free terrain (ellipsoid, no token required)
        terrainProvider={terrainProvider}
        // Better context options
        contextOptions={{
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
          },
        }}
      >
        {/* Free ArcGIS World Imagery - high quality satellite tiles */}
        <ImageryLayer imageryProvider={satelliteImagery} />
        
        {/* Markers with billboard (better rendering) */}
        {points.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <Entity
              key={item.id}
              position={Cartesian3.fromDegrees(
                item.coordinates.lng,
                item.coordinates.lat,
                0
              )}
              onClick={() => handleMarkerClick(item)}
            >
              <BillboardGraphics
                image={createMarkerSvg(accentColorHex, isSelected)}
                verticalOrigin={VerticalOrigin.CENTER}
                horizontalOrigin={HorizontalOrigin.CENTER}
                scale={isSelected ? 1.5 : 1.0}
                scaleByDistance={new NearFarScalar(1e6, 1.5, 1e8, 0.3)}
                translucencyByDistance={new NearFarScalar(1e6, 1.0, 5e7, 0.6)}
                disableDepthTestDistance={Number.POSITIVE_INFINITY}
              />
              {isSelected && (
                <LabelGraphics
                  text={item.name}
                  font="bold 14px 'Space Grotesk', sans-serif"
                  fillColor={Color.WHITE}
                  outlineColor={Color.BLACK}
                  outlineWidth={3}
                  style={2}
                  verticalOrigin={VerticalOrigin.BOTTOM}
                  horizontalOrigin={HorizontalOrigin.CENTER}
                  pixelOffset={new Cartesian3(0, -30, 0) as any}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  scaleByDistance={new NearFarScalar(1e6, 1.0, 5e7, 0.5)}
                />
              )}
            </Entity>
          );
        })}
      </Viewer>

      {/* Custom CSS to style Cesium */}
      <style>{`
        .cesium-container {
          background: #000;
        }
        .cesium-viewer {
          font-family: inherit;
        }
        .cesium-widget-credits,
        .cesium-viewer-bottom,
        .cesium-viewer .cesium-widget-credits {
          display: none !important;
          visibility: hidden !important;
        }
        .cesium-viewer-cesiumWidgetContainer {
          cursor: grab;
        }
        .cesium-viewer-cesiumWidgetContainer:active {
          cursor: grabbing;
        }
        .cesium-widget canvas {
          image-rendering: auto;
        }
      `}</style>
    </div>
  );
}
