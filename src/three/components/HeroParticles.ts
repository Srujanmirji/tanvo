import * as THREE from "three";

/**
 * Creates a circular soft glowing particle texture.
 */
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.25, "rgba(22, 139, 255, 0.85)");
  gradient.addColorStop(0.6, "rgba(22, 139, 255, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class HeroParticles {
  public points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private count: number;
  private initialPositions: Float32Array;
  private targetPositions: Float32Array;
  private velocities: Float32Array;
  private colors: Float32Array;
  private texture: THREE.Texture;

  constructor(count: number = 1600) {
    this.count = count;
    this.texture = createParticleTexture();

    const geometry = new THREE.BufferGeometry();
    this.initialPositions = new Float32Array(this.count * 3);
    this.targetPositions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);
    const currentPositions = new Float32Array(this.count * 3);

    const blueColor = new THREE.Color(0x168bff);
    const cyanColor = new THREE.Color(0x4de8ff);
    const whiteColor = new THREE.Color(0xf5faff);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      // Phase 1 (Rest): Particles clustered near crystal core and faceted surface
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const r = 0.8 + Math.random() * 2.6;

      const x0 = r * Math.sin(theta) * Math.cos(phi);
      const y0 = r * Math.cos(theta) * 1.3;
      const z0 = r * Math.sin(theta) * Math.sin(phi);

      this.initialPositions[i3] = x0;
      this.initialPositions[i3 + 1] = y0;
      this.initialPositions[i3 + 2] = z0;

      currentPositions[i3] = x0;
      currentPositions[i3 + 1] = y0;
      currentPositions[i3 + 2] = z0;

      // Phase 2 (Explosion target): Expansive spherical/vortex field
      const expandRadius = 6.0 + Math.random() * 16.0;
      const expPhi = Math.random() * Math.PI * 2;
      const expTheta = Math.acos(Math.random() * 2 - 1);

      this.targetPositions[i3] = expandRadius * Math.sin(expTheta) * Math.cos(expPhi);
      this.targetPositions[i3 + 1] = expandRadius * Math.cos(expTheta);
      this.targetPositions[i3 + 2] = expandRadius * Math.sin(expTheta) * Math.sin(expPhi);

      // Noise drift velocity
      this.velocities[i3] = (Math.random() - 0.5) * 0.4;
      this.velocities[i3 + 1] = 0.1 + Math.random() * 0.3; // subtle upward float
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.4;

      // Color distribution (70% electric blue, 20% cyan, 10% cool white)
      const rand = Math.random();
      const chosenColor = rand < 0.7 ? blueColor : rand < 0.9 ? cyanColor : whiteColor;

      this.colors[i3] = chosenColor.r;
      this.colors[i3 + 1] = chosenColor.g;
      this.colors[i3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: this.texture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
  }

  public update(time: number, scrollProgress: number = 0) {
    const positionAttr = this.points.geometry.attributes.position as THREE.BufferAttribute;
    const pos = positionAttr.array as Float32Array;
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Particle expansion power curve
    const expansionFactor = Math.pow(p, 1.4);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const initX = this.initialPositions[i3];
      const initY = this.initialPositions[i3 + 1];
      const initZ = this.initialPositions[i3 + 2];

      const targetX = this.targetPositions[i3];
      const targetY = this.targetPositions[i3 + 1];
      const targetZ = this.targetPositions[i3 + 2];

      // Idle drifting noise offset
      const driftX = Math.sin(time * 0.5 + i * 0.1) * 0.25;
      const driftY = Math.cos(time * 0.4 + i * 0.1) * 0.25 + (time * this.velocities[i3 + 1] * 0.2) % 2.0;
      const driftZ = Math.sin(time * 0.3 + i * 0.15) * 0.25;

      // Interpolate from crystal resting position to expanded particle galaxy
      pos[i3] = THREE.MathUtils.lerp(initX + driftX, targetX + driftX * 2, expansionFactor);
      pos[i3 + 1] = THREE.MathUtils.lerp(initY + driftY, targetY + driftY * 2, expansionFactor);
      pos[i3 + 2] = THREE.MathUtils.lerp(initZ + driftZ, targetZ + driftZ * 2, expansionFactor);
    }

    // Particle size expands on scroll
    this.points.material.size = THREE.MathUtils.lerp(0.12, 0.22, expansionFactor);

    // Overall field opacity increases as crystal dissolves into particle universe
    this.points.material.opacity = THREE.MathUtils.lerp(0.65, 1.0, expansionFactor);

    positionAttr.needsUpdate = true;
  }

  public dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.texture.dispose();
  }
}
