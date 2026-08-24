import * as THREE from "three";

interface ProductOrbitalConfig {
  name: string;
  category: string;
  shape: "dodecahedron" | "octahedron" | "tetrahedron" | "torus";
  color: number;
  emissive: number;
  radius: number;
  angle: number;
}

export class ImpactEnvironment {
  public group: THREE.Group;
  private products: {
    group: THREE.Group;
    mesh: THREE.Mesh;
    wireframe: THREE.LineSegments;
    orbitRadius: number;
    orbitAngle: number;
    orbitSpeed: number;
  }[] = [];
  private connectionArcs: THREE.LineSegments;

  constructor() {
    this.group = new THREE.Group();

    const configs: ProductOrbitalConfig[] = [
      {
        name: "NOVA",
        category: "AI PRODUCT",
        shape: "dodecahedron",
        color: 0x0c1017,
        emissive: 0x168bff,
        radius: 4.2,
        angle: 0,
      },
      {
        name: "ARC",
        category: "FINTECH PLATFORM",
        shape: "octahedron",
        color: 0x0c1017,
        emissive: 0x4de8ff,
        radius: 4.8,
        angle: (Math.PI * 2) / 3,
      },
      {
        name: "ORBIT",
        category: "SAAS PLATFORM",
        shape: "tetrahedron",
        color: 0x0c1017,
        emissive: 0x168bff,
        radius: 3.8,
        angle: (Math.PI * 4) / 3,
      },
      {
        name: "MONO",
        category: "E-COMMERCE",
        shape: "torus",
        color: 0x0c1017,
        emissive: 0xf5faff,
        radius: 5.1,
        angle: Math.PI / 4,
      },
    ];

    configs.forEach((cfg) => {
      const prodGroup = new THREE.Group();
      let geom: THREE.BufferGeometry;

      if (cfg.shape === "dodecahedron") {
        geom = new THREE.DodecahedronGeometry(1.0, 0);
      } else if (cfg.shape === "octahedron") {
        geom = new THREE.OctahedronGeometry(1.1, 0);
      } else if (cfg.shape === "tetrahedron") {
        geom = new THREE.TetrahedronGeometry(1.2, 0);
      } else {
        geom = new THREE.TorusGeometry(0.9, 0.25, 16, 32);
      }

      if (geom.index) {
        const indexedGeometry = geom;
        geom = indexedGeometry.toNonIndexed();
        indexedGeometry.dispose();
      }
      geom.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 1.3,
        metalness: 0.9,
        roughness: 0.2,
        flatShading: true,
        transparent: true,
        opacity: 0.0,
      });

      const mesh = new THREE.Mesh(geom, mat);
      prodGroup.add(mesh);

      const wire = new THREE.WireframeGeometry(geom);
      const wireMat = new THREE.LineBasicMaterial({
        color: cfg.emissive,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const wireframe = new THREE.LineSegments(wire, wireMat);
      prodGroup.add(wireframe);

      // Add a subtle point light to each product node
      const nodeLight = new THREE.PointLight(cfg.emissive, 0.65, 7, 2);
      prodGroup.add(nodeLight);

      this.group.add(prodGroup);

      this.products.push({
        group: prodGroup,
        mesh,
        wireframe,
        orbitRadius: cfg.radius,
        orbitAngle: cfg.angle,
        orbitSpeed: 0.08 + Math.random() * 0.04,
      });
    });

    // Constellation Inter-connection Network Lines
    const arcGeom = new THREE.BufferGeometry();
    const arcPos = new Float32Array(configs.length * (configs.length - 1) * 3);
    arcGeom.setAttribute("position", new THREE.BufferAttribute(arcPos, 3));
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    this.connectionArcs = new THREE.LineSegments(arcGeom, arcMat);
    this.group.add(this.connectionArcs);

    this.group.position.set(1.3, -0.1, -2);
  }

  public update(time: number, stageProgress: number) {
    // Impact is active from 5.2 to 7.0 (Impact is centered around 6.0)
    if (stageProgress < 5.2) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;

    // Fade in at 5.2 -> 6.0, remains gracefully visible through the transition to work
    const opacity = Math.min(1.0, (stageProgress - 5.2) / 0.8);

    const positions: THREE.Vector3[] = [];

    this.products.forEach((p, idx) => {
      const currentAngle = p.orbitAngle + time * p.orbitSpeed;
      const x = Math.cos(currentAngle) * p.orbitRadius;
      const y = Math.sin(time * 0.42 + idx) * 0.7;
      const z = Math.sin(currentAngle) * p.orbitRadius - 1.0;

      p.group.position.set(x, y, z);
      positions.push(p.group.position);

      p.mesh.rotation.x = time * 0.18;
      p.mesh.rotation.y = time * 0.24;

      (p.mesh.material as THREE.MeshStandardMaterial).opacity = opacity * 0.72;
      (p.wireframe.material as THREE.LineBasicMaterial).opacity = opacity * 0.24;
    });

    // Update connection network lines
    const linePos = this.connectionArcs.geometry.attributes.position.array as Float32Array;
    let lineIdx = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        linePos[lineIdx++] = positions[i].x;
        linePos[lineIdx++] = positions[i].y;
        linePos[lineIdx++] = positions[i].z;

        linePos[lineIdx++] = positions[j].x;
        linePos[lineIdx++] = positions[j].y;
        linePos[lineIdx++] = positions[j].z;
      }
    }
    this.connectionArcs.geometry.attributes.position.needsUpdate = true;
    (this.connectionArcs.material as THREE.LineBasicMaterial).opacity = opacity * 0.14;
  }

  public dispose() {
    this.products.forEach((p) => {
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
      p.wireframe.geometry.dispose();
      (p.wireframe.material as THREE.Material).dispose();
    });
    this.connectionArcs.geometry.dispose();
    (this.connectionArcs.material as THREE.Material).dispose();
  }
}
