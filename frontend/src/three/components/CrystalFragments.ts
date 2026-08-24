import * as THREE from "three";
import { createShardGeometry } from "../utils/geometry";

interface ShardData {
  basePos: THREE.Vector3;
  direction: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  rotationSpeed: number;
  scale: number;
  matrix: THREE.Matrix4;
}

export class CrystalFragments {
  public mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private count: number;
  private shards: ShardData[] = [];
  private dummy: THREE.Object3D;

  constructor(count: number = 24) {
    this.count = count;
    this.dummy = new THREE.Object3D();

    const geometry = createShardGeometry(0.28);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0c1018),
      emissive: new THREE.Color(0x020815),
      roughness: 0.24,
      metalness: 0.86,
      clearcoat: 0.85,
      flatShading: true,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Initialize shard positions tightly framing the crystal
    for (let i = 0; i < this.count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / this.count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const radius = 2.5 + (i % 4) * 0.3 + (Math.random() - 0.5) * 0.25;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 1.35; // elongated along Y axis
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const basePos = new THREE.Vector3(x, y, z);
      const direction = basePos.clone().normalize().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      ).normalize();

      const scale = 0.45 + Math.random() * 0.55;
      const rotationAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const shard: ShardData = {
        basePos,
        direction,
        rotationAxis,
        rotationSpeed: 0.35 + Math.random() * 1.0,
        scale,
        matrix: new THREE.Matrix4(),
      };

      this.shards.push(shard);
    }
  }

  public update(time: number, scrollProgress: number = 0) {
    const p = Math.max(0, Math.min(1, scrollProgress));

    let separationDistance = 0;
    if (p > 0.2) {
      const normalizedP = (p - 0.2) / 0.8;
      separationDistance = Math.pow(normalizedP, 1.8) * 14.0;
    }

    const fadeOut = p > 0.75 ? Math.max(0, 1.0 - (p - 0.75) / 0.25) : 1.0;
    this.mesh.material.opacity = 0.95 * fadeOut;

    for (let i = 0; i < this.count; i++) {
      const shard = this.shards[i];

      const hoverAngle = time * 0.25 * (i % 2 === 0 ? 1 : -1) + i * 0.25;
      const hoverOffset = new THREE.Vector3(
        Math.sin(hoverAngle) * 0.1,
        Math.cos(hoverAngle * 1.2) * 0.1,
        Math.sin(hoverAngle * 0.7) * 0.1
      );

      const currentPos = shard.basePos
        .clone()
        .add(hoverOffset)
        .addScaledVector(shard.direction, separationDistance);

      this.dummy.position.copy(currentPos);
      this.dummy.scale.setScalar(shard.scale * (1.0 + p * 0.3) * fadeOut);

      const currentRotation = time * shard.rotationSpeed + p * 3.5;
      this.dummy.quaternion.setFromAxisAngle(shard.rotationAxis, currentRotation);

      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
