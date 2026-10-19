import * as THREE from 'three';

/**
 * Procedural Logarithmic Spiral Galaxy with core bulge and nebula dust particles
 */
export class GalaxySpiral {
  public group: THREE.Group;
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: THREE.PointsMaterial;
  private points: THREE.Points;

  constructor(particleCount: number = 3800) {
    this.group = new THREE.Group();

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const galaxyRadius = 45;
    const branches = 3;
    const spin = 1.35;
    const randomness = 0.45;
    const power = 3.6;

    const insideColor = new THREE.Color('#38bdf8'); // Cyan-white core
    const coreBulgeColor = new THREE.Color('#e0f2fe'); // Soft luminous center
    const outsideColor = new THREE.Color('#7928ca'); // Cosmic violet outer arms

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position along spiral arms
      const radius = Math.random() * galaxyRadius;
      const spinAngle = radius * spin;
      const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));

      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.35;
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color interpolation: Core is soft radiant cyan, edges are deep violet
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / galaxyRadius);

      if (radius < 5.0) {
        mixedColor.lerp(coreBulgeColor, 0.35);
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
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.35, 'rgba(56,189,248,0.5)');
      grad.addColorStop(0.7, 'rgba(147,51,234,0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    this.particleMaterial = new THREE.PointsMaterial({
      size: 1.15,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.7,
    });

    this.points = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.group.add(this.points);

    // Initial orientation: angled to frame the lower half cleanly without text obstruction
    this.group.rotation.x = Math.PI * 0.26;
    this.group.rotation.y = -Math.PI * 0.12;
    this.group.position.set(0, -4.5, -34);
  }

  public update(delta: number) {
    this.points.rotation.y += delta * 0.025;
  }

  public setOpacity(opacity: number) {
    this.particleMaterial.opacity = opacity;
  }

  public dispose() {
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
  }
}
