import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Starfield } from './Starfield';
import { GalaxySpiral } from './GalaxySpiral';
import { WormholeTunnel } from './WormholeTunnel';
import { CelestialWorlds } from './CelestialWorlds';
import { HolographicEarth } from './HolographicEarth';
import type { SceneType, MultiverseWorldId } from '../../types/portfolio';

interface CosmicCanvasProps {
  activeScene: SceneType;
  selectedWorld: MultiverseWorldId | null;
  hoveredWorld: MultiverseWorldId | null;
  onSelectWorld: (worldId: MultiverseWorldId) => void;
  onHoverWorld: (worldId: MultiverseWorldId | null) => void;
  onEnterGalaxy?: () => void;
  reducedMotion?: boolean;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  activeScene,
  selectedWorld,
  hoveredWorld,
  onSelectWorld,
  onHoverWorld,
  onEnterGalaxy,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // References to persistent Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starfieldRef = useRef<Starfield | null>(null);
  const galaxyRef = useRef<GalaxySpiral | null>(null);
  const wormholeRef = useRef<WormholeTunnel | null>(null);
  const worldsRef = useRef<CelestialWorlds | null>(null);
  const earthRef = useRef<HolographicEarth | null>(null);

  // Fresh prop refs for event handlers
  const activeSceneRef = useRef(activeScene);
  activeSceneRef.current = activeScene;
  const onEnterGalaxyRef = useRef(onEnterGalaxy);
  onEnterGalaxyRef.current = onEnterGalaxy;

  // Interaction tracking
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const speedMultiplierRef = useRef<number>(1.0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Setup Three.js environment
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-10, -10, 5);
    scene.add(dirLight2);

    // 5. Cosmic Objects
    const starfield = new Starfield(2200);
    scene.add(starfield.group);
    starfieldRef.current = starfield;

    const galaxy = new GalaxySpiral(3600);
    scene.add(galaxy.group);
    galaxyRef.current = galaxy;

    const wormhole = new WormholeTunnel();
    scene.add(wormhole.group);
    wormholeRef.current = wormhole;

    const worlds = new CelestialWorlds();
    scene.add(worlds.group);
    worldsRef.current = worlds;

    const earth = new HolographicEarth();
    scene.add(earth.group);
    earthRef.current = earth;

    // Pointer event listeners for 3D Earth dragging / roaming & planet selection
    let isDragging = false;
    let dragDistance = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (activeSceneRef.current === 'awakening' && earthRef.current) {
        isDragging = true;
        dragDistance = 0;
        earthRef.current.onPointerDown(e.clientX, e.clientY);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseRef.current.set(x, y);

      // 3D Earth interaction during awakening
      if (activeSceneRef.current === 'awakening' && earthRef.current) {
        if (isDragging) {
          dragDistance += Math.hypot(e.movementX, e.movementY);
          earthRef.current.onPointerMove(e.clientX, e.clientY);
          container.style.cursor = 'grabbing';
        } else if (cameraRef.current) {
          raycasterRef.current.setFromCamera(targetMouseRef.current, cameraRef.current);
          const isHit = earthRef.current.hitTest(raycasterRef.current);
          earthRef.current.setHovered(isHit);
          container.style.cursor = isHit ? 'grab' : 'default';
        }
      }

      // Raycast test for planets if multiverse is active
      if (activeSceneRef.current === 'multiverse' && worldsRef.current && cameraRef.current) {
        raycasterRef.current.setFromCamera(targetMouseRef.current, cameraRef.current);
        const hitId = worldsRef.current.hitTest(raycasterRef.current);
        onHoverWorld(hitId);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (activeSceneRef.current === 'awakening' && earthRef.current) {
        if (isDragging) {
          earthRef.current.onPointerUp();
          isDragging = false;
          container.style.cursor = 'default';

          // Click detection without significant drag: enter profile
          if (dragDistance < 8 && cameraRef.current && onEnterGalaxyRef.current) {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
            if (earthRef.current.hitTest(raycasterRef.current)) {
              onEnterGalaxyRef.current();
            }
          }
        }
      }
    };

    const handleClick = () => {
      if (activeSceneRef.current === 'multiverse' && worldsRef.current && cameraRef.current) {
        raycasterRef.current.setFromCamera(targetMouseRef.current, cameraRef.current);
        const hitId = worldsRef.current.hitTest(raycasterRef.current);
        if (hitId) {
          onSelectWorld(hitId);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // Resize listener
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      // Smooth mouse lerp for parallax
      mouseRef.current.lerp(targetMouseRef.current, delta * 3);

      // Compute mouse ray point in 3D space for particle interaction
      let mouseWorldPoint: THREE.Vector3 | undefined;
      if (cameraRef.current && !reducedMotion) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        mouseWorldPoint = new THREE.Vector3();
        raycasterRef.current.ray.at(32, mouseWorldPoint);
      }

      // Starfield update with cursor depth parallax
      if (starfieldRef.current && !reducedMotion) {
        starfieldRef.current.update(
          delta, 
          speedMultiplierRef.current, 
          mouseRef.current.x, 
          mouseRef.current.y
        );
      }

      // Galaxy update with intelligent cursor particle deflection & accelerated cosmic speed
      if (galaxyRef.current && !reducedMotion) {
        galaxyRef.current.update(delta, mouseWorldPoint, speedMultiplierRef.current);
      }

      // Wormhole update
      if (wormholeRef.current) {
        wormholeRef.current.update(delta);
      }

      // Multiverse worlds update
      if (worldsRef.current) {
        worldsRef.current.update(delta);
      }

      // 3D Holographic Earth update (Earth roams & rotates in space)
      if (earthRef.current && activeSceneRef.current === 'awakening') {
        earthRef.current.update(delta);
      }

      // Subtle mouse camera parallax (unless reduced motion is active)
      if (cameraRef.current && !reducedMotion) {
        cameraRef.current.rotation.y = -mouseRef.current.x * 0.035;
        cameraRef.current.rotation.x = mouseRef.current.y * 0.035;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      starfield.dispose();
      galaxy.dispose();
      wormhole.dispose();
      worlds.dispose();
      earth.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onHoverWorld, onSelectWorld, reducedMotion]);

  // Sync hovered world with 3D meshes
  useEffect(() => {
    if (worldsRef.current) {
      worldsRef.current.setHoveredWorld(hoveredWorld);
    }
  }, [hoveredWorld]);

  // Handle Scene Transitions & GSAP Camera Choreography
  useEffect(() => {
    const camera = cameraRef.current;
    const wormhole = wormholeRef.current;
    const worlds = worldsRef.current;
    const galaxy = galaxyRef.current;
    const earth = earthRef.current;
    if (!camera || !wormhole || !worlds || !galaxy) return;

    if (activeScene === 'awakening') {
      wormhole.setActive(false);
      worlds.setActive(false);
      if (earth) earth.setVisible(true);
      galaxy.setOpacity(0.7); // Vivid, energetic galaxy roaming around 3D Earth

      gsap.to(speedMultiplierRef, { current: 1.5, duration: 1.2 });
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 14.2,
        duration: reducedMotion ? 0.1 : 2.0,
        ease: 'power2.out',
      });
    } else if (activeScene === 'wormhole') {
      if (earth) earth.setVisible(false);
      wormhole.setActive(true);
      worlds.setActive(false);
      galaxy.setOpacity(0.2);

      // Accelerate speed for hyperspace
      gsap.to(speedMultiplierRef, { current: 6.5, duration: 1.2, ease: 'power2.in' });
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: -25,
        duration: reducedMotion ? 0.1 : 3.0,
        ease: 'power2.inOut',
      });
    } else if (activeScene === 'multiverse') {
      if (earth) earth.setVisible(false);
      wormhole.setActive(false);
      worlds.setActive(true);
      galaxy.setOpacity(0.4);

      gsap.to(speedMultiplierRef, { current: 1.0, duration: 1.0 });

      // Target world approach if a world is selected, otherwise view all worlds
      if (selectedWorld && worldsRef.current) {
        const targetPos = worldsRef.current.getWorldPosition(selectedWorld);
        if (targetPos) {
          gsap.to(camera.position, {
            x: targetPos.x * 0.7,
            y: targetPos.y * 0.7,
            z: targetPos.z + 5.5,
            duration: reducedMotion ? 0.1 : 1.8,
            ease: 'power3.out',
          });
        }
      } else {
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 8.5,
          duration: reducedMotion ? 0.1 : 2.0,
          ease: 'power2.out',
        });
      }
    } else if (activeScene === 'laboratory') {
      if (earth) earth.setVisible(false);
      wormhole.setActive(false);
      worlds.setActive(false);
      galaxy.setOpacity(0.22);

      gsap.to(speedMultiplierRef, { current: 0.5, duration: 1.0 });
      gsap.to(camera.position, {
        x: 0,
        y: 1.2,
        z: 14,
        duration: reducedMotion ? 0.1 : 1.8,
        ease: 'power2.out',
      });
    }
  }, [activeScene, selectedWorld, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full z-0 overflow-hidden ${
        activeScene === 'multiverse' || activeScene === 'awakening' ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ touchAction: 'none' }}
    />
  );
};
