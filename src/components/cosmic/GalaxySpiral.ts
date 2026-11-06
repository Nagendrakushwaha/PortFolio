import * as THREE from 'three';

/**
 * Procedural Logarithmic Spiral Galaxy with core bulge, nebula dust particles,
 * and intelligent cursor particle interaction.
 */
export class GalaxySpiral {
  public group: THREE.Group;
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: THREE.PointsMaterial;
  private points: THREE.Points;
  private count: number;
  private originalPositions: Float32Array;
  private currentPositions: Float32Array;
  private velocities: Float32Array;

  constructor(particleCount: number = 3800) {
    this.group = new THREE.Group();
    this.count = particleCount;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.originalPositions = new Float32Array(particleCount * 3);
    this.currentPositions = new Float32Array(particleCount * 3);
    this.velocities = new Float32Array(particleCount * 3);

    const galaxyRadius = 45;
    const branches = 3;
    const spin = 1.35;
    const randomness = 0.45;
    const power = 3.6;

    const insideColor = new THREE.Color('#38bdf8'); // Cyan-white core
    const coreBulgeColor = new THREE.Color('#e0f2fe'); // Soft luminous center
    const outsideColor = new THREE.Color('#8b5cf6'); // Cosmic violet outer arms

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position along spiral arms
      const radius = Math.random() * galaxyRadius;
      const spinAngle = radius * spin;
      const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));

      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.35;
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;

      const px = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const py = randomY;
      const pz = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;

      this.originalPositions[i3] = px;
      this.originalPositions[i3 + 1] = py;
      this.originalPositions[i3 + 2] = pz;

      this.currentPositions[i3] = px;
      this.currentPositions[i3 + 1] = py;
      this.currentPositions[i3 + 2] = pz;

      // Color interpolation: Core is soft radiant cyan, edges are deep violet
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / galaxyRadius);

      if (radius < 5.0) {
        mixedColor.lerp(coreBulgeColor, 0.4);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite with gentle falloff
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1.0)');
      grad.addColorStop(0.35, 'rgba(56,189,248,0.7)');
      grad.addColorStop(0.7, 'rgba(139,92,246,0.25)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    this.particleMaterial = new THREE.PointsMaterial({
      size: 1.25,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.75,
    });

    this.points = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.group.add(this.points);

    // Initial orientation: angled to frame the view cleanly
    this.group.rotation.x = Math.PI * 0.24;
    this.group.rotation.y = -Math.PI * 0.10;
    this.group.position.set(0, -4.0, -32);
  }

  public setOpacity(val: number) {
    this.particleMaterial.opacity = val;
  }

  /**
   * Update galaxy rotation and respond to mouse cursor interaction
   */
  public update(delta: number, mouseWorldPos?: THREE.Vector3, speedMultiplier: number = 1.0) {
    // Dynamic continuous galaxy rotation - energetic cosmic swirl around the Earth
    this.points.rotation.y += delta * 0.22 * speedMultiplier;
    this.group.rotation.z += delta * 0.025 * speedMultiplier;

    // If mouse world position is supplied, gently push nearby particles
    if (mouseWorldPos) {
      const posAttr = this.particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      
      // Transform mouse position to local space of galaxy points
      const localMouse = mouseWorldPos.clone();
      this.points.worldToLocal(localMouse);

      const interactionRadius = 9.0;
      const interactionRadiusSq = interactionRadius * interactionRadius;
      let changed = false;

      // Sample every 2nd particle to maximize performance while retaining 1900 interactive stars
      for (let i = 0; i < this.count; i += 2) {
        const i3 = i * 3;
        const px = this.currentPositions[i3];
        const py = this.currentPositions[i3 + 1];
        const pz = this.currentPositions[i3 + 2];

        const dx = px - localMouse.x;
        const dy = py - localMouse.y;
        const dz = pz - localMouse.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < interactionRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1.0 - dist / interactionRadius) * 4.5 * delta;
          
          this.velocities[i3] += (dx / dist) * force;
          this.velocities[i3 + 1] += (dy / dist) * force;
          this.velocities[i3 + 2] += (dz / dist) * force;
        }

        // Apply friction and spring back to original orbit
        this.velocities[i3] *= 0.88;
        this.velocities[i3 + 1] *= 0.88;
        this.velocities[i3 + 2] *= 0.88;

        const origX = this.originalPositions[i3];
        const origY = this.originalPositions[i3 + 1];
        const origZ = this.originalPositions[i3 + 2];

        // Spring restore force
        this.currentPositions[i3] += this.velocities[i3] + (origX - px) * delta * 2.0;
        this.currentPositions[i3 + 1] += this.velocities[i3 + 1] + (origY - py) * delta * 2.0;
        this.currentPositions[i3 + 2] += this.velocities[i3 + 2] + (origZ - pz) * delta * 2.0;

        posArray[i3] = this.currentPositions[i3];
        posArray[i3 + 1] = this.currentPositions[i3 + 1];
        posArray[i3 + 2] = this.currentPositions[i3 + 2];
        changed = true;
      }

      if (changed) {
        posAttr.needsUpdate = true;
      }
    }
  }

  public dispose() {
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
  }
}
