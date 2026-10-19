import * as THREE from 'three';

/**
 * High-performance instanced multi-layer starfield
 * Includes distant stars, bright foreground stars, and warp acceleration support.
 */
export class Starfield {
  public group: THREE.Group;
  private starGeometry: THREE.BufferGeometry;
  private starMaterial: THREE.PointsMaterial;
  private starPoints: THREE.Points;
  private shootingStarGeometry: THREE.BufferGeometry;
  private shootingStarMaterial: THREE.LineBasicMaterial;
  private shootingStar: THREE.Line;
  private shootingStarActive: boolean = false;
  private shootingStarTimer: number = 0;
  private count: number;
  private initialPositions: Float32Array;

  constructor(count: number = 2200) {
    this.group = new THREE.Group();
    this.count = count;

    // Multi-layer star coordinates and colors
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.initialPositions = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#e0f2fe'), // Soft icy blue
      new THREE.Color('#38bdf8'), // Electric cyan
      new THREE.Color('#c084fc'), // Cosmic violet
      new THREE.Color('#fef08a'), // Distant stellar gold
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cylindrical / spherical spread along z-axis for deep travel
      const radius = 35 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 800;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(theta) * radius;
      positions[i3 + 2] = z;

      this.initialPositions[i3] = positions[i3];
      this.initialPositions[i3 + 1] = positions[i3 + 1];
      this.initialPositions[i3 + 2] = positions[i3 + 2];

      // Assign realistic celestial color distribution
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    this.starGeometry = new THREE.BufferGeometry();
    this.starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circle particle texture procedurally generated
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.3, 'rgba(224,242,254,0.6)');
      gradient.addColorStop(0.7, 'rgba(56,189,248,0.15)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const starTexture = new THREE.CanvasTexture(canvas);

    this.starMaterial = new THREE.PointsMaterial({
      size: 1.25,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.starPoints = new THREE.Points(this.starGeometry, this.starMaterial);
    this.group.add(this.starPoints);

    // Shooting Star effect
    this.shootingStarGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    this.shootingStarGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.shootingStarMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.shootingStar = new THREE.Line(this.shootingStarGeometry, this.shootingStarMaterial);
    this.group.add(this.shootingStar);
  }

  public update(delta: number, speedMultiplier: number = 1.0) {
    const positionAttr = this.starGeometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    const zSpeed = (speedMultiplier > 2 ? 65 : 0.45) * speedMultiplier * delta * 60;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      array[i3 + 2] += zSpeed;

      // Wrap around when passing camera
      if (array[i3 + 2] > 200) {
        array[i3 + 2] = -600;
        // slightly jitter radial positions for variety
        const radius = 25 + Math.random() * 240;
        const theta = Math.random() * Math.PI * 2;
        array[i3] = Math.cos(theta) * radius;
        array[i3 + 1] = Math.sin(theta) * radius;
      }
    }
    positionAttr.needsUpdate = true;

    // Twinkle & size stretch during warp
    if (speedMultiplier > 2) {
      this.starMaterial.size = Math.min(3.0, 1.25 * (speedMultiplier * 0.4));
    } else {
      this.starMaterial.size = 1.25;
      this.group.rotation.z += 0.00015 * delta * 60;
    }

    // Occasional shooting star
    this.updateShootingStar(delta);
  }

  private updateShootingStar(delta: number) {
    this.shootingStarTimer += delta;
    if (this.shootingStarTimer > 5 && !this.shootingStarActive) {
      this.shootingStarActive = true;
      this.shootingStarTimer = 0;

      const sx = (Math.random() - 0.5) * 80;
      const sy = 20 + Math.random() * 40;
      const sz = -40 + Math.random() * 20;

      const pos = this.shootingStarGeometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      arr[0] = sx;
      arr[1] = sy;
      arr[2] = sz;
      arr[3] = sx - 15;
      arr[4] = sy - 10;
      arr[5] = sz + 8;
      pos.needsUpdate = true;
      this.shootingStarMaterial.opacity = 0.85;
    }

    if (this.shootingStarActive) {
      this.shootingStarMaterial.opacity -= delta * 1.5;
      if (this.shootingStarMaterial.opacity <= 0.02) {
        this.shootingStarMaterial.opacity = 0;
        this.shootingStarActive = false;
      }
    }
  }

  public dispose() {
    this.starGeometry.dispose();
    this.starMaterial.dispose();
    this.shootingStarGeometry.dispose();
    this.shootingStarMaterial.dispose();
  }
}
