import * as THREE from "three";

export class WireframeLandscape {
  public group: THREE.Group;
  private lineMesh: THREE.LineSegments<THREE.WireframeGeometry, THREE.LineBasicMaterial>;
  private planeGeom: THREE.PlaneGeometry;
  private width: number = 28;
  private depth: number = 36;
  private segmentsX: number = 32;
  private segmentsY: number = 40;

  constructor() {
    this.group = new THREE.Group();

    this.planeGeom = new THREE.PlaneGeometry(
      this.width,
      this.depth,
      this.segmentsX,
      this.segmentsY
    );
    this.planeGeom.rotateX(-Math.PI / 2);

    // Displace vertices to form subtle architectural terrain dunes
    const pos = this.planeGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Create an undulating valley in the middle for the camera trajectory
      const valley = Math.pow(Math.abs(x) / 10.0, 1.8) * 2.2;
      const hills = Math.sin(x * 0.35 + z * 0.2) * Math.cos(z * 0.25) * 1.5;
      const microNoise = Math.sin(x * 1.2) * 0.2;

      pos.setY(i, hills + valley + microNoise - 2.8);
    }
    this.planeGeom.computeVertexNormals();

    const wireframeGeom = new THREE.WireframeGeometry(this.planeGeom);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });

    this.lineMesh = new THREE.LineSegments(wireframeGeom, lineMaterial);
    this.group.add(this.lineMesh);

    // Initial position
    this.group.position.set(1.2, -0.25, -6);
  }

  public update(time: number, stageProgress: number) {
    // stageProgress = 1.0 -> 2.0 (Vision phase)
    // Enters at 1.0 (opacity 0 -> 0.75)
    // Full at 2.0
    // Morphs/rises towards Design at 2.0 -> 3.0 (lines rise)

    if (stageProgress < 0.6 || stageProgress > 3.4) {
      this.lineMesh.material.opacity = 0;
      this.group.visible = false;
      return;
    }

    this.group.visible = true;

    if (stageProgress <= 2.0) {
      // Vision entrance
      const p = Math.max(0, (stageProgress - 0.8) / 1.2);
      this.lineMesh.material.opacity = p * 0.38;
      this.group.position.y = -0.5 - (1 - p) * 2.0;
    } else {
      // Transition from Vision into Design (wires elevate to form interface frames)
      const p = (stageProgress - 2.0) / 1.0;
      this.lineMesh.material.opacity = Math.max(0, (1 - p) * 0.38);
      this.group.position.y = -0.5 + p * 1.5;
    }

    // Gentle terrain wave
    this.group.position.z = -6 - (stageProgress - 1.0) * 4.0;
    this.lineMesh.rotation.y = Math.sin(time * 0.1) * 0.03;
  }

  public dispose() {
    this.lineMesh.geometry.dispose();
    this.lineMesh.material.dispose();
    this.planeGeom.dispose();
  }
}
