import * as THREE from "three";

/**
 * Creates a circular soft particle alpha texture for glowing rendering.
 */
function createGlowParticleTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(22, 139, 255, 0.9)");
  gradient.addColorStop(0.55, "rgba(22, 139, 255, 0.25)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class StoryParticleField {
  public points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private count: number;
  private currentPos: Float32Array;
  private ideaPos: Float32Array;
  private visionPos: Float32Array;
  private designPos: Float32Array;
  private buildPos: Float32Array;
  private launchPos: Float32Array;
  private impactPos: Float32Array;
  private colors: Float32Array;
  private texture: THREE.Texture;

  constructor(count: number = 2000) {
    this.count = count;
    this.texture = createGlowParticleTexture();

    const geometry = new THREE.BufferGeometry();
    this.currentPos = new Float32Array(this.count * 3);
    this.ideaPos = new Float32Array(this.count * 3);
    this.visionPos = new Float32Array(this.count * 3);
    this.designPos = new Float32Array(this.count * 3);
    this.buildPos = new Float32Array(this.count * 3);
    this.launchPos = new Float32Array(this.count * 3);
    this.impactPos = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);

    const blueColor = new THREE.Color(0x168bff);
    const cyanColor = new THREE.Color(0x4de8ff);
    const whiteColor = new THREE.Color(0xf5faff);
    const navyColor = new THREE.Color(0x3a4d7a);

    // Initialize stage positions for each particle
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      // 1. IDEA: Spherical breathing nebula
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const rIdea = 1.5 + Math.random() * 4.5;
      this.ideaPos[i3] = rIdea * Math.sin(theta) * Math.cos(phi) + 1.2;
      this.ideaPos[i3 + 1] = rIdea * Math.cos(theta) * 0.9;
      this.ideaPos[i3 + 2] = rIdea * Math.sin(theta) * Math.sin(phi);

      // 2. VISION: Particles settling onto a 3D terrain grid
      const u = (i % 45) / 44 - 0.5;
      const v = Math.floor(i / 45) / (this.count / 45) - 0.5;
      this.visionPos[i3] = u * 18.0 + 1.0;
      this.visionPos[i3 + 1] = -1.8 + Math.sin(u * 5.0) * Math.cos(v * 4.0) * 0.8;
      this.visionPos[i3 + 2] = v * 22.0 - 2.0;

      // 3. DESIGN: Particles forming interface bounding boxes and highlights
      const panelIndex = i % 4;
      const panelOffsetX = (panelIndex - 1.5) * 2.8 + 1.2;
      const panelOffsetY = Math.sin(panelIndex) * 0.8;
      const panelOffsetZ = panelIndex * -1.5;
      this.designPos[i3] = panelOffsetX + (Math.random() - 0.5) * 2.2;
      this.designPos[i3 + 1] = panelOffsetY + (Math.random() - 0.5) * 3.0;
      this.designPos[i3 + 2] = panelOffsetZ + (Math.random() - 0.5) * 0.5;

      // 4. BUILD: Vertical data streams and cyber matrix vectors
      this.buildPos[i3] = (Math.random() - 0.5) * 14.0 + 1.0;
      this.buildPos[i3 + 1] = (Math.random() - 0.5) * 16.0;
      this.buildPos[i3 + 2] = (Math.random() - 0.5) * 12.0 - 2.0;

      // 5. LAUNCH: High-density focal sphere with radiant burst rays
      const rLaunch = (i % 10 === 0) ? 0.2 + Math.random() * 0.8 : 2.5 + Math.random() * 8.0;
      this.launchPos[i3] = rLaunch * Math.sin(theta) * Math.cos(phi) + 1.0;
      this.launchPos[i3 + 1] = rLaunch * Math.cos(theta);
      this.launchPos[i3 + 2] = rLaunch * Math.sin(theta) * Math.sin(phi);

      // 6. IMPACT: Constellation ecosystem spanning deep orbital space
      const cluster = i % 4;
      const clusterAngle = (cluster / 4) * Math.PI * 2;
      const cRadius = 4.2 + (i % 8) * 0.4;
      this.impactPos[i3] = Math.cos(clusterAngle) * cRadius + (Math.random() - 0.5) * 2.0 + 0.8;
      this.impactPos[i3 + 1] = Math.sin(clusterAngle) * 2.0 + (Math.random() - 0.5) * 2.0;
      this.impactPos[i3 + 2] = Math.sin(clusterAngle) * cRadius - 3.0 + (Math.random() - 0.5) * 2.0;

      // Default start = idea
      this.currentPos[i3] = this.ideaPos[i3];
      this.currentPos[i3 + 1] = this.ideaPos[i3 + 1];
      this.currentPos[i3 + 2] = this.ideaPos[i3 + 2];

      // Particle color palette
      const rand = Math.random();
      const c = rand < 0.65 ? blueColor : rand < 0.85 ? cyanColor : rand < 0.95 ? whiteColor : navyColor;
      this.colors[i3] = c.r;
      this.colors[i3 + 1] = c.g;
      this.colors[i3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(this.currentPos, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: this.texture,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
  }

  public update(time: number, storyProgress: number) {
    // storyProgress ranges from 0.0 (Hero) to 6.0 (End of Impact)
    // 0 -> 1: Hero to Idea
    // 1 -> 2: Idea to Vision
    // 2 -> 3: Vision to Design
    // 3 -> 4: Design to Build
    // 4 -> 5: Build to Launch
    // 5 -> 6: Launch to Impact

    const positionAttr = this.points.geometry.attributes.position as THREE.BufferAttribute;
    const pos = positionAttr.array as Float32Array;

    const stage = Math.max(0, Math.min(5.999, storyProgress));
    const stageIndex = Math.floor(stage);
    const stageT = stage - stageIndex;

    let srcArray: Float32Array;
    let dstArray: Float32Array;

    if (stageIndex === 0) {
      srcArray = this.ideaPos;
      dstArray = this.ideaPos;
    } else if (stageIndex === 1) {
      srcArray = this.ideaPos;
      dstArray = this.visionPos;
    } else if (stageIndex === 2) {
      srcArray = this.visionPos;
      dstArray = this.designPos;
    } else if (stageIndex === 3) {
      srcArray = this.designPos;
      dstArray = this.buildPos;
    } else if (stageIndex === 4) {
      srcArray = this.buildPos;
      dstArray = this.launchPos;
    } else {
      srcArray = this.launchPos;
      dstArray = this.impactPos;
    }

    // Smooth smoothstep interpolation
    const t = stageT * stageT * (3 - 2 * stageT);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      // Micro noise drift
      const noiseX = Math.sin(time * 0.4 + i * 0.2) * 0.12;
      const noiseY = Math.cos(time * 0.35 + i * 0.15) * 0.12;
      const noiseZ = Math.sin(time * 0.3 + i * 0.25) * 0.12;

      // Special stream motion during Build stage
      let streamY = 0;
      if (stage >= 3.0 && stage < 4.0) {
        streamY = (time * 2.0 + i * 0.05) % 12.0 - 6.0;
      }

      pos[i3] = THREE.MathUtils.lerp(srcArray[i3], dstArray[i3], t) + noiseX;
      pos[i3 + 1] = THREE.MathUtils.lerp(srcArray[i3 + 1], dstArray[i3 + 1], t) + noiseY + streamY;
      pos[i3 + 2] = THREE.MathUtils.lerp(srcArray[i3 + 2], dstArray[i3 + 2], t) + noiseZ;
    }

    // Dynamic particle sizing based on stage intensity
    if (stage >= 4.0 && stage < 5.0) {
      // Launch flare: particles glow larger
      this.points.material.size = THREE.MathUtils.lerp(0.14, 0.26, Math.sin(stageT * Math.PI));
    } else {
      this.points.material.size = 0.14;
    }

    positionAttr.needsUpdate = true;
  }

  public dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.texture.dispose();
  }
}
