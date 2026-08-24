import * as THREE from "three";

/**
 * A restrained launch beacon: a faceted product capsule, precision rings and a
 * vertical energy trail. The tall silhouette keeps the LAUNCH chapter legible
 * as a moment of lift-off instead of reading as another generic floating orb.
 */
export class LaunchEnvironment {
  public group: THREE.Group;

  private vehicle: THREE.Group;
  private solidMeshes: THREE.Mesh[] = [];
  private edgeLines: THREE.LineSegments[] = [];
  private groundRings: THREE.Mesh[] = [];
  private energyBeam: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
  private plume: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private plumeSeeds: Float32Array;
  private plumeAngles: Float32Array;
  private launchLight: THREE.PointLight;

  constructor() {
    this.group = new THREE.Group();
    this.vehicle = new THREE.Group();
    this.group.add(this.vehicle);

    const shellMaterial = new THREE.MeshStandardMaterial({
      color: 0x06162e,
      emissive: 0x0d5bff,
      emissiveIntensity: 1,
      metalness: 0.92,
      roughness: 0.2,
      flatShading: true,
      transparent: true,
      opacity: 0,
    });
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x092f68,
      emissive: 0x168bff,
      emissiveIntensity: 1.7,
      metalness: 0.72,
      roughness: 0.12,
      transparent: true,
      opacity: 0,
    });

    const addPart = (
      geometry: THREE.BufferGeometry,
      material: THREE.MeshStandardMaterial,
      position: [number, number, number]
    ) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      this.vehicle.add(mesh);
      this.solidMeshes.push(mesh);

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x8beaff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
      mesh.add(edges);
      this.edgeLines.push(edges);
      return mesh;
    };

    addPart(new THREE.CylinderGeometry(0.46, 0.64, 2.35, 6, 1), shellMaterial, [0, 0.42, 0]);
    addPart(new THREE.ConeGeometry(0.47, 1.05, 6, 1), shellMaterial, [0, 2.1, 0]);
    addPart(new THREE.CylinderGeometry(0.13, 0.2, 2.72, 8, 1), coreMaterial, [0, 0.46, 0]);

    for (let index = 0; index < 3; index += 1) {
      const fin = addPart(new THREE.ConeGeometry(0.42, 1.05, 3, 1), shellMaterial, [0, -0.92, 0]);
      fin.rotation.z = Math.PI;
      fin.rotation.y = (index / 3) * Math.PI * 2;
      fin.translateX(0.52);
    }

    for (let index = 0; index < 3; index += 1) {
      const radius = 0.9 + index * 0.64;
      const material = new THREE.MeshBasicMaterial({
        color: index === 1 ? 0x4de8ff : 0x168bff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 10, 96), material);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -2.4;
      this.group.add(ring);
      this.groundRings.push(ring);
    }

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x16b8ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.energyBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.52, 4.2, 12, 1, true),
      beamMaterial
    );
    this.energyBeam.position.y = -2.85;
    this.group.add(this.energyBeam);

    const plumeCount = 120;
    const plumePositions = new Float32Array(plumeCount * 3);
    this.plumeSeeds = new Float32Array(plumeCount);
    this.plumeAngles = new Float32Array(plumeCount);
    for (let index = 0; index < plumeCount; index += 1) {
      this.plumeSeeds[index] = index / plumeCount;
      this.plumeAngles[index] = (index * 2.399963) % (Math.PI * 2);
    }
    const plumeGeometry = new THREE.BufferGeometry();
    plumeGeometry.setAttribute("position", new THREE.BufferAttribute(plumePositions, 3));
    const plumeMaterial = new THREE.PointsMaterial({
      color: 0x76e8ff,
      size: 0.055,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.plume = new THREE.Points(plumeGeometry, plumeMaterial);
    this.group.add(this.plume);

    this.launchLight = new THREE.PointLight(0x168bff, 0, 12, 1.7);
    this.launchLight.position.set(0, -0.9, 0.5);
    this.group.add(this.launchLight);
  }

  public update(time: number, stageProgress: number) {
    if (stageProgress < 4.2 || stageProgress > 6.0) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;
    const entrance = THREE.MathUtils.smootherstep(stageProgress, 4.2, 5.0);
    const exit = 1 - THREE.MathUtils.smootherstep(stageProgress, 5.2, 6.0);
    const opacity = entrance * exit;

    this.vehicle.position.y = -0.22 + entrance * 0.28 + Math.sin(time * 1.4) * 0.035;
    this.vehicle.rotation.y = time * 0.2;
    this.vehicle.scale.setScalar(0.9 + entrance * 0.1);

    this.solidMeshes.forEach((mesh, index) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = opacity * (index === 2 ? 0.88 : 0.78);
      material.emissiveIntensity = (index === 2 ? 1.55 : 0.96) + Math.sin(time * 2 + index) * 0.12;
    });
    this.edgeLines.forEach((line) => {
      (line.material as THREE.LineBasicMaterial).opacity = opacity * 0.56;
    });

    this.groundRings.forEach((ring, index) => {
      (ring.material as THREE.MeshBasicMaterial).opacity = opacity * (0.28 - index * 0.045);
      const pulse = 0.94 + Math.sin(time * 1.15 - index * 0.7) * 0.055;
      ring.scale.setScalar(pulse);
      ring.rotation.z = time * (index % 2 === 0 ? 0.06 : -0.05);
    });

    this.energyBeam.material.opacity = opacity * (0.22 + Math.sin(time * 2.1) * 0.04);
    const positionAttribute = this.plume.geometry.getAttribute("position") as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    for (let index = 0; index < this.plumeSeeds.length; index += 1) {
      const age = (this.plumeSeeds[index] + time * 0.22) % 1;
      const radius = 0.06 + age * 0.48;
      positions[index * 3] = Math.cos(this.plumeAngles[index]) * radius;
      positions[index * 3 + 1] = -0.85 - age * 4.05;
      positions[index * 3 + 2] = Math.sin(this.plumeAngles[index]) * radius;
    }
    positionAttribute.needsUpdate = true;
    this.plume.material.opacity = opacity * 0.62;
    this.launchLight.intensity = opacity * (2.7 + Math.sin(time * 2.2) * 0.35);
  }

  public dispose() {
    this.solidMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.edgeLines.forEach((line) => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    this.groundRings.forEach((ring) => {
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
    });
    this.energyBeam.geometry.dispose();
    this.energyBeam.material.dispose();
    this.plume.geometry.dispose();
    this.plume.material.dispose();
  }
}
