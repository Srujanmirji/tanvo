import * as THREE from "three";

export class BuildEnvironment {
  public group: THREE.Group;
  private dataGrid: THREE.LineSegments;
  private streamLines: THREE.LineSegments;
  private glyphPoints: THREE.Points;
  private centralCoreMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  private coreWire: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;

  constructor() {
    this.group = new THREE.Group();

    // 1. Orthogonal Architectural Data Grid Box
    const boxGeom = new THREE.BoxGeometry(16, 12, 14, 8, 6, 7);
    const boxWire = new THREE.WireframeGeometry(boxGeom);
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x1f2e4d,
      transparent: true,
      opacity: 0.0,
    });
    this.dataGrid = new THREE.LineSegments(boxWire, gridMat);
    this.group.add(this.dataGrid);

    // 2. High-speed Vertical Data Streams
    const streamCount = 64;
    const streamGeom = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamCount * 2 * 3);
    const streamColors = new Float32Array(streamCount * 2 * 3);

    const blueColor = new THREE.Color(0x168bff);
    const cyanColor = new THREE.Color(0x4de8ff);

    for (let i = 0; i < streamCount; i++) {
      const idx = i * 6;
      const x = (Math.random() - 0.5) * 12.0;
      const z = (Math.random() - 0.5) * 10.0;
      const y0 = (Math.random() - 0.5) * 8.0;
      const len = 1.5 + Math.random() * 3.5;

      streamPositions[idx] = x;
      streamPositions[idx + 1] = y0;
      streamPositions[idx + 2] = z;

      streamPositions[idx + 3] = x;
      streamPositions[idx + 4] = y0 + len;
      streamPositions[idx + 5] = z;

      const c = Math.random() > 0.85 ? cyanColor : blueColor;
      streamColors[idx] = c.r;
      streamColors[idx + 1] = c.g;
      streamColors[idx + 2] = c.b;
      streamColors[idx + 3] = c.r * 0.2;
      streamColors[idx + 4] = c.g * 0.2;
      streamColors[idx + 5] = c.b * 0.2;
    }

    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    streamGeom.setAttribute("color", new THREE.BufferAttribute(streamColors, 3));

    const streamMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });

    this.streamLines = new THREE.LineSegments(streamGeom, streamMat);
    this.group.add(this.streamLines);

    // 3. Floating Code / Glyph Matrices (Instanced Points)
    const glyphCount = 400;
    const glyphGeom = new THREE.BufferGeometry();
    const glyphPos = new Float32Array(glyphCount * 3);
    for (let i = 0; i < glyphCount; i++) {
      glyphPos[i * 3] = (Math.random() - 0.5) * 14.0;
      glyphPos[i * 3 + 1] = (Math.random() - 0.5) * 10.0;
      glyphPos[i * 3 + 2] = (Math.random() - 0.5) * 10.0;
    }
    glyphGeom.setAttribute("position", new THREE.BufferAttribute(glyphPos, 3));
    const glyphMat = new THREE.PointsMaterial({
      color: 0x168bff,
      size: 0.08,
      transparent: true,
      opacity: 0.0,
    });
    this.glyphPoints = new THREE.Points(glyphGeom, glyphMat);
    this.group.add(this.glyphPoints);

    // 4. Central Compiling Structure (Nested Dodecahedron)
    const coreGeom = new THREE.DodecahedronGeometry(1.2, 0);
    const coreWire = new THREE.WireframeGeometry(coreGeom);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    // Solid black body so the core occludes the data rain behind it and reads
    // as a mass, with the emissive edges carrying the colour.
    this.centralCoreMesh = new THREE.Mesh(
      coreGeom,
      new THREE.MeshBasicMaterial({ color: 0x02060d, transparent: true, opacity: 0 })
    );
    this.coreWire = new THREE.LineSegments(coreWire, coreMat);
    // Sit the edges just outside the solid body so they don't z-fight with it.
    this.coreWire.scale.setScalar(1.02);
    this.centralCoreMesh.add(this.coreWire);
    this.group.add(this.centralCoreMesh);

    this.group.position.set(1.3, -0.1, -2.5);
  }

  public update(time: number, stageProgress: number) {
    // Active between 3.2 and 5.2 (Build is centered around 4.0)
    if (stageProgress < 3.2 || stageProgress > 5.2) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;

    let opacity = 0;
    if (stageProgress <= 4.0) {
      opacity = (stageProgress - 3.2) / 0.8;
    } else {
      opacity = Math.max(0, 1.0 - (stageProgress - 4.2) / 0.9);
    }

    (this.dataGrid.material as THREE.LineBasicMaterial).opacity = opacity * 0.24;
    (this.streamLines.material as THREE.LineBasicMaterial).opacity = opacity * 0.55;
    (this.glyphPoints.material as THREE.PointsMaterial).opacity = opacity * 0.4;
    this.centralCoreMesh.material.opacity = opacity * 0.92;
    this.coreWire.material.opacity = opacity * (0.85 + Math.sin(time * 2.2) * 0.12);

    // Animate vertical data streams flowing upwards
    const streamPos = this.streamLines.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 64; i++) {
      const yIdx = i * 6 + 1;
      const yLenIdx = i * 6 + 4;
      const speed = 4.0 + (i % 5) * 1.5;

      let y = streamPos[yIdx] + speed * 0.016;
      if (y > 6.0) y = -6.0;

      const len = 2.0;
      streamPos[yIdx] = y;
      streamPos[yLenIdx] = y + len;
    }
    this.streamLines.geometry.attributes.position.needsUpdate = true;

    // Rotate core structure
    this.centralCoreMesh.rotation.x = time * 0.4;
    this.centralCoreMesh.rotation.y = time * 0.6;
    this.centralCoreMesh.scale.setScalar(
      0.58 + Math.sin(time * 2.2) * 0.08 + (stageProgress - 3.2) * 0.16
    );
  }

  public dispose() {
    this.dataGrid.geometry.dispose();
    (this.dataGrid.material as THREE.Material).dispose();
    this.streamLines.geometry.dispose();
    (this.streamLines.material as THREE.Material).dispose();
    this.glyphPoints.geometry.dispose();
    (this.glyphPoints.material as THREE.Material).dispose();
    this.centralCoreMesh.geometry.dispose();
    this.centralCoreMesh.material.dispose();
    this.coreWire.geometry.dispose();
    this.coreWire.material.dispose();
  }
}
