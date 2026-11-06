import * as THREE from 'three';

/**
 * 3D Holographic Cyber Network Earth
 * Precisely crafted to match the neural network digital globe reference:
 * - High-density continental dot-matrix point cloud with authentic coastlines
 * - 3D Spherical cyber plexus network with interconnected nodes & luminous lines
 * - Long-distance geodesic synaptic arcs connecting global technology hubs
 * - Deep obsidian core sphere with dark-matter oceanic grid and glowing landmasses
 * - Brilliant electric-cyan Fresnel atmosphere rim glow
 * - Orbiting data particles and cyber-bokeh
 * - Full interactive 3D drag-to-roam physics with momentum damping
 */

// Major global technology & data hubs with coordinates
const GLOBAL_HUBS = [
  { name: 'Bhopal (HQ)', lat: 23.25, lng: 77.41, color: '#22d3ee', size: 1.4 },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59, color: '#06b6d4', size: 1.2 },
  { name: 'New York', lat: 40.71, lng: -74.0, color: '#38bdf8', size: 1.1 },
  { name: 'San Francisco', lat: 37.77, lng: -122.41, color: '#818cf8', size: 1.2 },
  { name: 'London', lat: 51.5, lng: -0.12, color: '#38bdf8', size: 1.1 },
  { name: 'Tokyo', lat: 35.67, lng: 139.65, color: '#22d3ee', size: 1.2 },
  { name: 'Singapore', lat: 1.35, lng: 103.81, color: '#38bdf8', size: 1.0 },
  { name: 'Sydney', lat: -33.86, lng: 151.2, color: '#818cf8', size: 1.0 },
  { name: 'Dubai', lat: 25.2, lng: 55.27, color: '#38bdf8', size: 1.0 },
  { name: 'Berlin', lat: 52.52, lng: 13.4, color: '#38bdf8', size: 1.0 },
  { name: 'Sao Paulo', lat: -23.55, lng: -46.63, color: '#818cf8', size: 0.9 },
  { name: 'Toronto', lat: 43.65, lng: -79.38, color: '#38bdf8', size: 1.0 },
  { name: 'Paris', lat: 48.85, lng: 2.35, color: '#38bdf8', size: 1.0 },
  { name: 'Seoul', lat: 37.56, lng: 126.97, color: '#22d3ee', size: 1.0 },
];

// Global network connections between hubs (indices in GLOBAL_HUBS)
const HUB_CONNECTIONS: [number, number][] = [
  [0, 1], // Bhopal -> Bengaluru
  [0, 2], // Bhopal -> NY
  [0, 4], // Bhopal -> London
  [0, 5], // Bhopal -> Tokyo
  [0, 6], // Bhopal -> Singapore
  [0, 8], // Bhopal -> Dubai
  [1, 6], // Bengaluru -> Singapore
  [2, 3], // NY -> SF
  [2, 4], // NY -> London
  [2, 11], // NY -> Toronto
  [3, 5], // SF -> Tokyo
  [4, 9], // London -> Berlin
  [4, 12], // London -> Paris
  [5, 13], // Tokyo -> Seoul
  [5, 7], // Tokyo -> Sydney
  [6, 7], // Singapore -> Sydney
  [2, 10], // NY -> Sao Paulo
  [8, 4], // Dubai -> London
];

// High-detail continent bounding polygons [lng, lat]
const CONTINENT_POLYGONS: [number, number][][] = [
  // North America (Mainland, Alaska, Canada, US, Mexico)
  [
    [-168, 65], [-160, 71], [-140, 70], [-130, 69], [-100, 70], [-80, 74], 
    [-60, 60], [-55, 48], [-65, 44], [-75, 38], [-80, 25], [-82, 8], 
    [-90, 15], [-105, 20], [-118, 32], [-124, 38], [-125, 48], [-135, 58], 
    [-165, 60], [-168, 65]
  ],
  // Greenland
  [
    [-55, 60], [-40, 60], [-20, 70], [-25, 80], [-50, 82], [-60, 75], [-55, 60]
  ],
  // South America
  [
    [-80, 10], [-75, 12], [-60, 6], [-50, -2], [-35, -5], [-35, -9], 
    [-40, -22], [-50, -32], [-65, -55], [-75, -50], [-72, -40], [-80, -5], [-80, 10]
  ],
  // Europe (UK, Scandinavia, Central Europe, Mediterranean)
  [
    [-10, 36], [-9, 43], [-1, 46], [-5, 48], [5, 54], [10, 58], [12, 65], 
    [18, 70], [28, 71], [40, 65], [35, 50], [28, 42], [22, 38], [14, 37], 
    [0, 38], [-10, 36]
  ],
  // British Isles
  [
    [-6, 50], [1, 51], [0, 58], [-5, 58], [-6, 54], [-6, 50]
  ],
  // Africa
  [
    [-17, 15], [-17, 21], [-5, 36], [10, 37], [25, 32], [32, 32], [35, 28], 
    [44, 12], [51, 11], [42, -12], [36, -20], [28, -34], [18, -35], [12, -18], 
    [9, 4], [-5, 5], [-17, 15]
  ],
  // Madagascar
  [
    [43, -12], [50, -13], [48, -25], [44, -25], [43, -12]
  ],
  // Asia & Northern Eurasia
  [
    [30, 42], [35, 32], [45, 40], [50, 40], [60, 60], [70, 72], [100, 77], 
    [140, 72], [170, 66], [180, 65], [160, 50], [140, 45], [130, 35], [120, 30], 
    [110, 20], [105, 10], [98, 10], [90, 22], [80, 15], [75, 10], [68, 24], 
    [60, 25], [50, 30], [35, 35], [30, 42]
  ],
  // Indian Subcontinent
  [
    [68, 24], [73, 32], [78, 32], [88, 27], [85, 20], [80, 10], [77, 8], [72, 16], [68, 24]
  ],
  // Southeast Asia / Indochina
  [
    [98, 10], [108, 10], [109, 21], [103, 21], [98, 16], [98, 10]
  ],
  // Japanese Archipelago
  [
    [130, 31], [135, 34], [141, 43], [144, 44], [140, 36], [131, 31]
  ],
  // Australia
  [
    [113, -22], [115, -35], [130, -32], [138, -36], [150, -37], [153, -28], 
    [148, -19], [142, -11], [130, -13], [113, -22]
  ],
  // New Zealand
  [
    [166, -46], [174, -41], [178, -37], [173, -35], [168, -43], [166, -46]
  ],
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
  public plexusGroup: THREE.Group;
  public networkLines: THREE.Group;
  public hubsGroup: THREE.Group;
  public satellitesGroup: THREE.Group;

  public radius = 3.65;
  private autoRotateSpeed = 0.0048;
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

    // 2. Core Sphere Mesh (Deep cosmic dark matter sphere with glowing cyan continent outlines)
    const sphereGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissiveMap: earthTexture,
      emissive: new THREE.Color(0x06b6d4),
      emissiveIntensity: 0.75,
      roughness: 0.3,
      metalness: 0.9,
      color: new THREE.Color(0x020817),
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreSphere);

    // 3. 3D Continental Point Cloud (Glittering cyan & sky blue dots for landmasses)
    this.dotPoints = this.createContinentalPointCloud();
    this.group.add(this.dotPoints);

    // 4. 3D Cyber Plexus Mesh wrapping the globe (Interconnected nodes and lines, matching reference image)
    this.plexusGroup = this.createPlexusMesh();
    this.group.add(this.plexusGroup);

    // 5. Global Synaptic Network Great-Circle Arcs
    this.networkLines = this.createNetworkArcs();
    this.group.add(this.networkLines);

    // 6. Hub Nodes with glowing pulses
    this.hubsGroup = this.createHubNodes();
    this.group.add(this.hubsGroup);

    // 7. Atmospheric Fresnel Glowing Outer Halo
    this.atmosphere = this.createAtmosphereHalo();
    this.group.add(this.atmosphere);

    // 8. Orbiting Satellites and Micro-data particles
    this.satellitesGroup = this.createSatellites();
    this.group.add(this.satellitesGroup);

    // Initial slight axial tilt
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

    // Latitude & longitude grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.09)';
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
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Continent landmass fill & glowing borders
    ctx.fillStyle = '#041d33';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.0;

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

    // High density digital dots across landmasses
    ctx.fillStyle = '#38bdf8';
    for (let lat = -80; lat <= 80; lat += 1.8) {
      for (let lng = -180; lng <= 180; lng += 1.8) {
        const onLand = CONTINENT_POLYGONS.some((p) => pointInPolygon([lng, lat], p));
        if (onLand) {
          const x = ((lng + 180) / 360) * canvas.width;
          const y = ((90 - lat) / 180) * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Glowing city light clusters
    GLOBAL_HUBS.forEach((hub) => {
      const x = ((hub.lng + 180) / 360) * canvas.width;
      const y = ((90 - hub.lat) / 180) * canvas.height;
      const grad = ctx.createRadialGradient(x, y, 1, x, y, 14);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, hub.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * Generates a dense 3D point cloud over the landmasses slightly elevated above the core sphere
   */
  private createContinentalPointCloud(): THREE.Points {
    const points: number[] = [];
    const colors: number[] = [];
    const colorCyan = new THREE.Color('#22d3ee');
    const colorSky = new THREE.Color('#38bdf8');
    const colorWhite = new THREE.Color('#e0f2fe');
    const colorIndigo = new THREE.Color('#818cf8');

    for (let lat = -78; lat <= 78; lat += 1.6) {
      for (let lng = -180; lng <= 180; lng += 1.6) {
        if (CONTINENT_POLYGONS.some((p) => pointInPolygon([lng, lat], p))) {
          // Elevated dot surface
          const r = this.radius * (1.015 + Math.random() * 0.015);
          const v = latLngToVector3(lat, lng, r);
          points.push(v.x, v.y, v.z);

          // Color variance (electric cyan / sky blue / white accents)
          const rand = Math.random();
          const chosen = rand > 0.65 ? colorCyan : rand > 0.35 ? colorSky : rand > 0.15 ? colorWhite : colorIndigo;
          colors.push(chosen.r, chosen.g, chosen.b);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.062,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  /**
   * Generates the 3D Cyber Plexus Network:
   * A geodesic spherical mesh of nodes and connecting lines hovering around the Earth,
   * faithfully reproducing the cyber/neural mesh in the user's reference image.
   */
  private createPlexusMesh(): THREE.Group {
    const plexusGroup = new THREE.Group();
    const nodeCount = 260;
    const sphereRadius = this.radius * 1.045;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    const nodePositions: THREE.Vector3[] = [];
    const nodePositionsFlat: number[] = [];

    // Fibonacci sphere distribution for uniform spherical coverage
    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const r = sphereRadius * (0.985 + Math.random() * 0.05);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);
      nodePositionsFlat.push(x, y, z);
    }

    // Connect neighboring nodes with lines if distance is within threshold
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxConnectionDistance = 1.35;
    const cyanColor = new THREE.Color('#00f2fe');
    const skyColor = new THREE.Color('#38bdf8');

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxConnectionDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );

          // Alpha fade by distance
          const color = dist < 0.9 ? cyanColor : skyColor;
          lineColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });

    const plexusLines = new THREE.LineSegments(lineGeo, lineMat);
    plexusGroup.add(plexusLines);

    // Glowing node points at vertices
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositionsFlat, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.075,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const plexusNodes = new THREE.Points(nodeGeo, nodeMat);
    plexusGroup.add(plexusNodes);

    return plexusGroup;
  }

  /**
   * Creates glowing curved Great-Circle synaptic arcs between global technology hubs
   */
  private createNetworkArcs(): THREE.Group {
    const group = new THREE.Group();

    HUB_CONNECTIONS.forEach(([fromIdx, toIdx]) => {
      const h1 = GLOBAL_HUBS[fromIdx];
      const h2 = GLOBAL_HUBS[toIdx];
      if (!h1 || !h2) return;

      const v1 = latLngToVector3(h1.lat, h1.lng, this.radius * 1.03);
      const v2 = latLngToVector3(h2.lat, h2.lng, this.radius * 1.03);

      const distance = v1.distanceTo(v2);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      // Elevate arc peak relative to distance
      const elevation = Math.min(distance * 0.3, 1.25);
      mid.normalize().multiplyScalar(this.radius * 1.03 + elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const curvePoints = curve.getPoints(45);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(fromIdx === 0 ? 0x22d3ee : 0x38bdf8),
        transparent: true,
        opacity: fromIdx === 0 ? 0.85 : 0.5,
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
      const pos = latLngToVector3(hub.lat, hub.lng, this.radius * 1.03);

      // Node sphere
      const dotGeo = new THREE.SphereGeometry(0.06 * hub.size, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.color),
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      group.add(dot);

      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(0.08 * hub.size, 0.13 * hub.size, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === 0 ? 0.95 : 0.65,
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
        float intensity = pow(0.72 - dot(vNormal, viewDir), 2.5);
        intensity = clamp(intensity, 0.0, 1.0);
        gl_FragColor = vec4(glowColor, intensity * 0.98);
      }
    `;

    const haloGeo = new THREE.SphereGeometry(this.radius * 1.2, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00f2fe) },
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
    const orbitGeo = new THREE.RingGeometry(this.radius * 1.35, this.radius * 1.38, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    orbitRing.rotation.y = Math.PI / 6;
    group.add(orbitRing);

    // 2. Micro data particles
    const particleCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const dist = this.radius * (1.15 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.85;
      pPos.push(
        dist * Math.cos(phi) * Math.sin(theta),
        dist * Math.sin(phi),
        dist * Math.cos(phi) * Math.cos(theta)
      );
    }

    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.048,
      transparent: true,
      opacity: 0.7,
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
      this.group.rotation.y += this.autoRotateSpeed * (this.isHovered ? 0.35 : 1.0);
    }

    // Rotate satellites ring and micro-particles
    if (this.satellitesGroup) {
      this.satellitesGroup.rotation.y += 0.006;
      this.satellitesGroup.rotation.z += 0.002;
    }

    // Subtle counter-rotation for plexus to create parallax depth
    if (this.plexusGroup) {
      this.plexusGroup.rotation.y += 0.0008;
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
