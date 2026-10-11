import * as THREE from 'three';

/**
 * Procedural Wormhole / Hyperspace Tunnel
 * Generates concentric pulsating rings and particle speed streaks for Scene 02 transition.
 */
export class WormholeTunnel {
  public group: THREE.Group;
  private rings: THREE.Mesh[] = [];
  private ringCount: number = 24;
  private streakGeometry: THREE.BufferGeometry;
  private streakMaterial: THREE.LineBasicMaterial;
  private streakLines: THREE.LineSegments;
  private streakCount: number = 240;
  private tunnelActive: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    // Create concentric portal rings
    const ringGeo = new THREE.TorusGeometry(3.5, 0.08, 16, 64);

    for (let i = 0; i < this.ringCount; i++) {
      const hue = i % 2 === 0 ? '#00f2fe' : '#a855f7';
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hue),
        transparent: true,
        opacity: 0.65,
        wireframe: i % 3 === 0,
        blending: THREE.AdditiveBlending,
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = -i * 8;
      const scale = 1 + i * 0.12;
      ringMesh.scale.set(scale, scale, 1);
      this.rings.push(ringMesh);
      this.group.add(ringMesh);
    }

    // High velocity hyperspace light streaks
    const linePositions = new Float32Array(this.streakCount * 6);
    for (let i = 0; i < this.streakCount; i++) {
      const i6 = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 8.0;
      const z = -Math.random() * 200;
      const length = 15 + Math.random() * 25;

      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      linePositions[i6] = x;
      linePositions[i6 + 1] = y;
      linePositions[i6 + 2] = z;

      linePositions[i6 + 3] = x;
      linePositions[i6 + 4] = y;
      linePositions[i6 + 5] = z + length;
    }

    this.streakGeometry = new THREE.BufferGeometry();
    this.streakGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.streakMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    this.streakLines = new THREE.LineSegments(this.streakGeometry, this.streakMaterial);
    this.group.add(this.streakLines);
  }

  public setActive(active: boolean) {
    this.tunnelActive = active;
    this.group.visible = active;
  }

  public update(delta: number) {
    if (!this.tunnelActive) return;

    // Move rings toward viewer for infinite wormhole glide
    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      ring.position.z += delta * 45;
      ring.rotation.z += (i % 2 === 0 ? 1 : -1) * delta * 1.5;

      if (ring.position.z > 10) {
        ring.position.z -= this.ringCount * 8;
      }
    }

    // Move light streaks
    const posAttr = this.streakGeometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const speed = delta * 120;

    for (let i = 0; i < this.streakCount; i++) {
      const i6 = i * 6;
      arr[i6 + 2] += speed;
      arr[i6 + 5] += speed;

      if (arr[i6 + 2] > 10) {
        arr[i6 + 2] -= 200;
        arr[i6 + 5] -= 200;
      }
    }
    posAttr.needsUpdate = true;
  }

  public dispose() {
    this.rings.forEach(r => {
      r.geometry.dispose();
      (r.material as THREE.Material).dispose();
    });
    this.streakGeometry.dispose();
    this.streakMaterial.dispose();
  }
}
