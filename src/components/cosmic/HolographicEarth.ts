import * as THREE from 'three';

/**
 * 3D Holographic Digital Earth
 * Inspired by neural-network global data visualization:
 * - Glowing continental dot-matrix point cloud
 * - Neural network geodesic arcs connecting global tech hubs
 * - Core dark sphere with subtle specular sheen
 * - Fresnel atmospheric electric-cyan glowing halo
 * - Orbiting satellite nodes and data dust
 * - Interactive 3D drag-to-roam rotation with smooth momentum
 */

// Major global technology & data hubs with coordinates
const GLOBAL_HUBS = [
  { name: 'Bhopal (HQ)', lat: 23.25, lng: 77.41, color: '#22d3ee', size: 1.3 },
  { name: 'New York', lat: 40.71, lng: -74.0, color: '#38bdf8', size: 1.0 },
  { name: 'San Francisco', lat: 37.77, lng: -122.41, color: '#818cf8', size: 1.1 },
  { name: 'London', lat: 51.5, lng: -0.12, color: '#38bdf8', size: 1.0 },
  { name: 'Tokyo', lat: 35.67, lng: 139.65, color: '#22d3ee', size: 1.1 },
  { name: 'Singapore', lat: 1.35, lng: 103.81, color: '#38bdf8', size: 1.0 },
  { name: 'Sydney', lat: -33.86, lng: 151.2, color: '#818cf8', size: 1.0 },
  { name: 'Dubai', lat: 25.2, lng: 55.27, color: '#38bdf8', size: 1.0 },
  { name: 'Berlin', lat: 52.52, lng: 13.4, color: '#38bdf8', size: 0.9 },
  { name: 'Sao Paulo', lat: -23.55, lng: -46.63, color: '#818cf8', size: 0.9 },
  { name: 'Toronto', lat: 43.65, lng: -79.38, color: '#38bdf8', size: 1.0 },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59, color: '#22d3ee', size: 1.2 },
];

// Global network connections between hubs (indices in GLOBAL_HUBS)
const HUB_CONNECTIONS: [number, number][] = [
  [0, 1], // Bhopal -> NY
  [0, 3], // Bhopal -> London
  [0, 4], // Bhopal -> Tokyo
  [0, 5], // Bhopal -> Singapore
  [0, 7], // Bhopal -> Dubai
  [0, 11], // Bhopal -> Bengaluru
  [1, 2], // NY -> SF
  [1, 3], // NY -> London
  [1, 10], // NY -> Toronto
  [2, 4], // SF -> Tokyo
  [3, 8], // London -> Berlin
  [4, 6], // Tokyo -> Sydney
  [5, 6], // Singapore -> Sydney
  [1, 9], // NY -> Sao Paulo
  [7, 3], // Dubai -> London
];

// Simplified continent bounding polygons [lng, lat] for procedural point sampling
const CONTINENT_POLYGONS: [number, number][][] = [
  // North America
  [[-165, 65], [-140, 70], [-60, 75], [-55, 48], [-75, 25], [-82, 8], [-105, 20], [-125, 35], [-125, 50], [-165, 65]],
  // South America
  [[-80, 10], [-50, -5], [-35, -5], [-40, -22], [-65, -55], [-75, -45], [-80, -5], [-80, 10]],
  // Europe
  [[-10, 36], [-10, 60], [30, 70], [45, 60], [35, 40], [25, 35], [0, 38], [-10, 36]],
  // Africa
  [[-17, 15], [-5, 36], [32, 32], [50, 12], [42, -12], [28, -34], [18, -35], [10, 4], [-17, 15]],
  // Asia
  [[35, 40], [45, 60], [70, 75], [170, 68], [140, 35], [105, 20], [100, 5], [75, 10], [60, 25], [35, 40]],
  // India Subcontinent
  [[68, 24], [73, 32], [80, 30], [88, 27], [85, 20], [80, 8], [77, 8], [72, 16], [68, 24]],
  // Australia
  [[113, -22], [115, -35], [135, -35], [153, -28], [150, -12], [130, -12], [113, -22]],
  // Japan / East Archipelago
  [[130, 30], [135, 38], [142, 45], [145, 42], [138, 35], [130, 30]],
];

function pointInPolygon(point: [number, number], vs: [number, number][]): boolean {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export class HolographicEarth {
  public group: THREE.Group;
  public coreSphere: THREE.Mesh;
  public atmosphere: THREE.Mesh;
  public dotPoints: THREE.Points;
  public networkLines: THREE.Group;
  public hubsGroup: THREE.Group;
  public satellitesGroup: THREE.Group;

  public radius = 3.65;
  private autoRotateSpeed = 0.0022;
  private isHovered = false;

  // Drag & Roam physics
  public rotationVelocity = { x: 0, y: 0 };
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, -0.2, 0);

    // 1. Procedural Surface Texture for Core Sphere
    const earthCanvas = this.createEarthTextureCanvas();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 2. Core Sphere Mesh (Dark obsidian with glowing cyan continents & city lights)
    const sphereGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissiveMap: earthTexture,
      emissive: new THREE.Color(0x06b6d4),
      emissiveIntensity: 0.65,
      roughness: 0.35,
      metalness: 0.85,
      color: new THREE.Color(0x020817),
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreSphere);

    // 3. 3D Continental Point Cloud (Glittering cyan dots for landmasses)
    this.dotPoints = this.createContinentalPointCloud();
    this.group.add(this.dotPoints);

    // 4. Global Synaptic Network Mesh & Great-Circle Arcs
    this.networkLines = this.createNetworkArcs();
    this.group.add(this.networkLines);

    // 5. Hub Nodes with glowing pulses
    this.hubsGroup = this.createHubNodes();
    this.group.add(this.hubsGroup);

    // 6. Atmospheric Fresnel Glowing Outer Halo
    this.atmosphere = this.createAtmosphereHalo();
    this.group.add(this.atmosphere);

    // 7. Orbiting Satellites and Micro-data particles
    this.satellitesGroup = this.createSatellites();
    this.group.add(this.satellitesGroup);

    // Initial slight axial tilt (Earth is tilted 23.5 degrees)
    this.group.rotation.z = THREE.MathUtils.degToRad(12);
  }

  /**
   * Generates a high-tech 2048x1024 procedural texture with continents, dot-matrix landmass,
   * latitude/longitude rings, and glowing city constellations.
   */
  private createEarthTextureCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Deep ocean dark fill
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle latitude & longitude grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Equator highlight
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw continent silhouettes
    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;

    CONTINENT_POLYGONS.forEach((poly) => {
      ctx.beginPath();
      poly.forEach(([lng, lat], idx) => {
        const x = ((lng + 180) / 360) * canvas.width;
        const y = ((90 - lat) / 180) * canvas.height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Draw dense digital dots across landmasses
    ctx.fillStyle = '#22d3ee';
    for (let lat = -80; lat <= 80; lat += 2) {
      for (let lng = -180; lng <= 180; lng += 2) {
        const onLand = CONTINENT_POLYGONS.some((p) => pointInPolygon([lng, lat], p));
        if (onLand) {
          const x = ((lng + 180) / 360) * canvas.width;
          const y = ((90 - lat) / 180) * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Glowing city light clusters
    GLOBAL_HUBS.forEach((hub) => {
      const x = ((hub.lng + 180) / 360) * canvas.width;
      const y = ((90 - hub.lat) / 180) * canvas.height;
      const grad = ctx.createRadialGradient(x, y, 1, x, y, 12);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, hub.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * Generates a 3D point cloud over the landmasses slightly elevated above the core sphere
   */
  private createContinentalPointCloud(): THREE.Points {
    const points: number[] = [];
    const colors: number[] = [];
    const colorCyan = new THREE.Color('#22d3ee');
    const colorSky = new THREE.Color('#38bdf8');
    const colorIndigo = new THREE.Color('#818cf8');

    for (let lat = -78; lat <= 78; lat += 2.2) {
      for (let lng = -180; lng <= 180; lng += 2.2) {
        if (CONTINENT_POLYGONS.some((p) => pointInPolygon([lng, lat], p))) {
          // Add slight natural jitter
          const r = this.radius * (1.012 + Math.random() * 0.012);
          const v = latLngToVector3(lat, lng, r);
          points.push(v.x, v.y, v.z);

          // Color variance
          const chosen = Math.random() > 0.6 ? colorCyan : Math.random() > 0.3 ? colorSky : colorIndigo;
          colors.push(chosen.r, chosen.g, chosen.b);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  /**
   * Creates glowing curved Great-Circle arcs between global technology hubs
   */
  private createNetworkArcs(): THREE.Group {
    const group = new THREE.Group();

    HUB_CONNECTIONS.forEach(([fromIdx, toIdx]) => {
      const h1 = GLOBAL_HUBS[fromIdx];
      const h2 = GLOBAL_HUBS[toIdx];
      if (!h1 || !h2) return;

      const v1 = latLngToVector3(h1.lat, h1.lng, this.radius * 1.02);
      const v2 = latLngToVector3(h2.lat, h2.lng, this.radius * 1.02);

      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      // Elevate arc peak relative to distance
      const elevation = Math.min(distance * 0.28, 1.2);
      mid.normalize().multiplyScalar(this.radius * 1.02 + elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const curvePoints = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(fromIdx === 0 ? 0x22d3ee : 0x38bdf8),
        transparent: true,
        opacity: fromIdx === 0 ? 0.75 : 0.45,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      group.add(line);
    });

    return group;
  }

  /**
   * Creates glowing 3D node markers at each global hub
   */
  private createHubNodes(): THREE.Group {
    const group = new THREE.Group();

    GLOBAL_HUBS.forEach((hub, idx) => {
      const pos = latLngToVector3(hub.lat, hub.lng, this.radius * 1.025);

      // Node sphere
      const dotGeo = new THREE.SphereGeometry(0.055 * hub.size, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.color),
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      group.add(dot);

      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(0.08 * hub.size, 0.12 * hub.size, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === 0 ? 0.9 : 0.6,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.002));
      ring.lookAt(new THREE.Vector3(0, -0.2, 0));
      group.add(ring);
    });

    return group;
  }

  /**
   * Creates electric cyan/blue atmospheric Fresnel glowing halo
   */
  private createAtmosphereHalo(): THREE.Mesh {
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 glowColor;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(0.68 - dot(vNormal, viewDir), 2.8);
        intensity = clamp(intensity, 0.0, 1.0);
        gl_FragColor = vec4(glowColor, intensity * 0.95);
      }
    `;

    const haloGeo = new THREE.SphereGeometry(this.radius * 1.18, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(0x06b6d4) },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    return new THREE.Mesh(haloGeo, haloMat);
  }

  /**
   * Creates orbiting data satellites and micro-particles
   */
  private createSatellites(): THREE.Group {
    const group = new THREE.Group();

    // 1. Orbiting elliptical ring
    const orbitGeo = new THREE.RingGeometry(this.radius * 1.35, this.radius * 1.37, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    orbitRing.rotation.y = Math.PI / 6;
    group.add(orbitRing);

    // 2. Micro data particles
    const particleCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const dist = this.radius * (1.15 + Math.random() * 0.55);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      pPos.push(
        dist * Math.cos(phi) * Math.sin(theta),
        dist * Math.sin(phi),
        dist * Math.cos(phi) * Math.cos(theta)
      );
    }

    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    return group;
  }

  /**
   * Mouse/touch drag handlers for roaming around the 3D Earth
   */
  public onPointerDown(clientX: number, clientY: number) {
    this.isDragging = true;
    this.previousMousePosition = { x: clientX, y: clientY };
  }

  public onPointerMove(clientX: number, clientY: number) {
    if (!this.isDragging) return;

    const deltaX = clientX - this.previousMousePosition.x;
    const deltaY = clientY - this.previousMousePosition.y;

    this.rotationVelocity.y = deltaX * 0.005;
    this.rotationVelocity.x = deltaY * 0.005;

    this.group.rotation.y += this.rotationVelocity.y;
    this.group.rotation.x += this.rotationVelocity.x;

    // Clamp pitch so Earth does not flip upside down
    this.group.rotation.x = THREE.MathUtils.clamp(
      this.group.rotation.x,
      -Math.PI / 3,
      Math.PI / 3
    );

    this.previousMousePosition = { x: clientX, y: clientY };
  }

  public onPointerUp() {
    this.isDragging = false;
  }

  public setHovered(hovered: boolean) {
    this.isHovered = hovered;
  }

  public hitTest(raycaster: THREE.Raycaster): boolean {
    const intersects = raycaster.intersectObject(this.coreSphere);
    return intersects.length > 0;
  }

  /**
   * Frame update with smooth inertia damping and auto-rotation
   */
  public update(_delta: number) {
    if (!this.isDragging) {
      // Inertia damping
      this.rotationVelocity.x *= 0.94;
      this.rotationVelocity.y *= 0.94;

      this.group.rotation.x += this.rotationVelocity.x;
      this.group.rotation.y += this.rotationVelocity.y;

      // Gentle continuous auto-rotation
      this.group.rotation.y += this.autoRotateSpeed * (this.isHovered ? 0.4 : 1.0);
    }

    // Slowly rotate satellites ring
    if (this.satellitesGroup) {
      this.satellitesGroup.rotation.y += 0.0035;
      this.satellitesGroup.rotation.z += 0.0015;
    }
  }

  public setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  public dispose() {
    this.coreSphere.geometry.dispose();
    if (Array.isArray(this.coreSphere.material)) {
      this.coreSphere.material.forEach((m) => m.dispose());
    } else {
      this.coreSphere.material.dispose();
    }
    this.dotPoints.geometry.dispose();
    (this.dotPoints.material as THREE.Material).dispose();
    this.atmosphere.geometry.dispose();
    (this.atmosphere.material as THREE.Material).dispose();
  }
}

