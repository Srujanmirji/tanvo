import * as THREE from "three";
import { generateCyberTextures } from "../utils/textureGenerator";

export class Crystal {
  public group: THREE.Group;
  private cubeGroup: THREE.Group;
  private outerMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private innerCoreMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  private coreLight: THREE.PointLight;
  private groundMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private textures: ReturnType<typeof generateCyberTextures>;

  constructor() {
    this.group = new THREE.Group();
    this.cubeGroup = new THREE.Group();

    // Pure isometric tilt: Corner pointing forward (Top, Left, Right faces all visible)
    this.cubeGroup.rotation.order = "YXZ";
    this.cubeGroup.rotation.set(0.615, 0.785, 0.0);
    this.group.add(this.cubeGroup);

    // 1. Generate High-Res Procedural Cyber Textures
    this.textures = generateCyberTextures();

    // 2. Monolithic Cyber-Cube with Beveled Chamfers
    const cubeGeom = new THREE.BoxGeometry(3.1, 3.1, 3.1, 8, 8, 8);
    const pos = cubeGeom.getAttribute("position");
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const nx = Math.abs(v.x) / 1.55;
      const ny = Math.abs(v.y) / 1.55;
      const nz = Math.abs(v.z) / 1.55;
      const corner = Math.min(1.0 - nx, 1.0 - ny, 1.0 - nz);
      if (corner < 0.08) {
        v.multiplyScalar(0.96);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    cubeGeom.computeVertexNormals();

    const outerMaterial = new THREE.MeshPhysicalMaterial({
      map: this.textures.diffuseMap,
      roughnessMap: this.textures.roughnessMap,
      emissiveMap: this.textures.emissiveMap,
      normalMap: this.textures.normalMap,
      emissive: new THREE.Color(0x168bff),
      emissiveIntensity: 2.8,
      roughness: 0.22,
      metalness: 0.88,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });

    this.outerMesh = new THREE.Mesh(cubeGeom, outerMaterial);
    this.outerMesh.castShadow = true;
    this.outerMesh.receiveShadow = true;
    this.cubeGroup.add(this.outerMesh);

    // 3. Central Pulsing Singularity Core
    const coreGeom = new THREE.IcosahedronGeometry(0.85, 1);
    coreGeom.computeVertexNormals();
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x168bff),
      emissive: new THREE.Color(0x0b5cff),
      emissiveIntensity: 5.0,
      roughness: 0.15,
      metalness: 0.1,
      flatShading: true,
    });

    this.innerCoreMesh = new THREE.Mesh(coreGeom, coreMaterial);
    this.cubeGroup.add(this.innerCoreMesh);

    // 4. Internal electric-blue radiant point light
    this.coreLight = new THREE.PointLight(0x168bff, 6.0, 16, 1.3);
    this.cubeGroup.add(this.coreLight);

    // 5. Shattered Obsidian Ground Terrain (Low, dark base beneath cube)
    const groundGeom = new THREE.PlaneGeometry(28, 28, 48, 48);
    groundGeom.rotateX(-Math.PI / 2);
    const gPos = groundGeom.getAttribute("position");
    const gv = new THREE.Vector3();

    for (let i = 0; i < gPos.count; i++) {
      gv.fromBufferAttribute(gPos, i);
      const dist = Math.sqrt(gv.x * gv.x + gv.z * gv.z);
      const crater = Math.exp(-Math.pow(dist / 4.0, 2)) * -0.9;
      const rocks =
        Math.sin(gv.x * 1.5 + gv.z * 1.2) * 0.25 +
        Math.cos(gv.x * 2.8 - gv.z * 2.2) * 0.18 +
        Math.sin(gv.z * 4.0) * 0.08;
      gv.y = crater + rocks - 2.8;
      gPos.setXYZ(i, gv.x, gv.y, gv.z);
    }
    groundGeom.computeVertexNormals();

    const groundMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x06080e),
      roughness: 0.38,
      metalness: 0.85,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    });

    this.groundMesh = new THREE.Mesh(groundGeom, groundMat);
    this.groundMesh.receiveShadow = true;
    this.group.add(this.groundMesh);
  }

  public update(time: number, speedMultiplier: number = 1.0) {
    // Gentle levitation float & slow hypnotic rotation
    const levitate = Math.sin(time * 1.4) * 0.1;
    this.cubeGroup.position.y = levitate;

    this.cubeGroup.rotation.y = 0.785 + time * 0.12 * speedMultiplier;
    this.cubeGroup.rotation.x = 0.615 + Math.sin(time * 0.18) * 0.03;
    this.cubeGroup.rotation.z = Math.cos(time * 0.14) * 0.03;

    // Counter-rotation of inner core
    this.innerCoreMesh.rotation.y = -time * 0.35 * speedMultiplier;

    // Emissive breathing pulsation
    const pulse = Math.sin(time * 2.4) * 0.8 + 2.8;
    this.outerMesh.material.emissiveIntensity = pulse;
    this.coreLight.intensity = pulse * 1.8;
  }

  public setScrollProgress(progress: number) {
    if (progress < 0.15) {
      this.outerMesh.material.opacity = 1.0;
      this.outerMesh.scale.setScalar(1.0);
      this.groundMesh.material.opacity = 0.85;
    } else if (progress < 0.6) {
      const p = (progress - 0.15) / 0.45;
      this.outerMesh.material.opacity = Math.max(0.2, 1.0 - p * 0.8);
      this.outerMesh.scale.setScalar(1.0 + p * 0.35);
      this.groundMesh.material.opacity = Math.max(0, 0.85 * (1.0 - p * 1.2));
      this.coreLight.intensity = 5.0 + p * 8.0;
    } else if (progress < 0.85) {
      const p = (progress - 0.6) / 0.25;
      this.outerMesh.material.opacity = Math.max(0, 0.2 * (1.0 - p));
      this.outerMesh.scale.setScalar(1.35 + p * 0.4);
      this.groundMesh.material.opacity = 0;
    } else {
      this.outerMesh.material.opacity = 0;
      this.groundMesh.material.opacity = 0;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.group.position;
  }
}
