import * as THREE from 'three';
import { multiverseWorlds } from '../../data/multiverseWorlds';
import type { MultiverseWorldId } from '../../types/portfolio';

export interface WorldMeshItem {
  id: MultiverseWorldId;
  group: THREE.Group;
  sphere: THREE.Mesh;
  glow: THREE.Mesh;
  rings: THREE.Group;
  baseScale: number;
}

/**
 * 4 Interactive Celestial Worlds representing the AI Multiverse domains
 */
export class CelestialWorlds {
  public group: THREE.Group;
  public worldItems: WorldMeshItem[] = [];
  private hoveredWorldId: MultiverseWorldId | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    // Create each world
    multiverseWorlds.forEach((world) => {
      const worldGroup = new THREE.Group();
      worldGroup.position.set(...world.position);

      const color = new THREE.Color(world.themeColor);

      // Core planet sphere with surface geometry
      const sphereGeo = new THREE.SphereGeometry(world.radius, 48, 48);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color.clone().multiplyScalar(0.7),
        roughness: 0.4,
        metalness: 0.8,
        emissive: color.clone().multiplyScalar(0.2),
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      worldGroup.add(sphere);

      // Wireframe / Neural layer slightly above surface
      const wireGeo = new THREE.SphereGeometry(world.radius * 1.03, 24, 24);
      const wireMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const wireSphere = new THREE.Mesh(wireGeo, wireMat);
      worldGroup.add(wireSphere);

      // Atmospheric outer glow
      const glowGeo = new THREE.SphereGeometry(world.radius * 1.25, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      worldGroup.add(glow);

      // Orbital Rings & Data nodes
      const ringsGroup = new THREE.Group();
      const ringGeo = new THREE.RingGeometry(world.radius * 1.4, world.radius * 1.7, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.45;
      ringsGroup.add(ring);

      // Orbiting node particles on ring
      const nodeCount = 8;
      const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const theta = (i / nodeCount) * Math.PI * 2;
        node.position.set(
          Math.cos(theta) * (world.radius * 1.55),
          Math.sin(theta) * (world.radius * 1.55) * Math.sin(Math.PI * 0.45),
          Math.sin(theta) * (world.radius * 1.55) * Math.cos(Math.PI * 0.45)
        );
        ringsGroup.add(node);
      }
      worldGroup.add(ringsGroup);

      // Store in world items
      this.worldItems.push({
        id: world.id,
        group: worldGroup,
        sphere,
        glow,
        rings: ringsGroup,
        baseScale: 1.0,
      });

      this.group.add(worldGroup);
    });
  }

  public setActive(active: boolean) {
    this.group.visible = active;
  }

  public update(delta: number) {
    if (!this.group.visible) return;

    this.worldItems.forEach((item) => {
      // Rotate planet on its axis
      item.group.rotation.y += delta * 0.25;
      item.rings.rotation.z += delta * 0.15;

      // Smooth hover scale & glow interpolation
      const isHovered = item.id === this.hoveredWorldId;
      const targetScale = isHovered ? 1.15 : 1.0;
      item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

      const mat = item.sphere.material as THREE.MeshStandardMaterial;
      const glowMat = item.glow.material as THREE.MeshBasicMaterial;

      if (isHovered) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 1.2, delta * 6);
        glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, 0.4, delta * 6);
      } else {
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.2, delta * 6);
        glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, 0.18, delta * 6);
      }
    });
  }

  public setHoveredWorld(worldId: MultiverseWorldId | null) {
    this.hoveredWorldId = worldId;
  }

  public getHoveredWorld(): MultiverseWorldId | null {
    return this.hoveredWorldId;
  }

  public hitTest(raycaster: THREE.Raycaster): MultiverseWorldId | null {
    if (!this.group.visible) return null;

    for (const item of this.worldItems) {
      const intersects = raycaster.intersectObject(item.sphere, true);
      if (intersects.length > 0) {
        return item.id;
      }
    }
    return null;
  }

  public getWorldPosition(worldId: MultiverseWorldId): THREE.Vector3 | null {
    const item = this.worldItems.find((w) => w.id === worldId);
    return item ? item.group.position.clone() : null;
  }

  public dispose() {
    this.worldItems.forEach((item) => {
      item.sphere.geometry.dispose();
      (item.sphere.material as THREE.Material).dispose();
      item.glow.geometry.dispose();
      (item.glow.material as THREE.Material).dispose();
    });
  }
}
