import * as THREE from "three";

interface InterfacePanelConfig {
  title: string;
  type: string;
  width: number;
  height: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

/**
 * Creates high-fidelity canvas texture for a dark luxury digital product UI.
 */
function createInterfaceCanvasTexture(title: string, category: string, accentColor: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#04101F";
  ctx.fillRect(0, 0, 1024, 680);

  // Top header bar
  ctx.fillStyle = "rgba(245, 250, 255, 0.05)";
  ctx.fillRect(0, 0, 1024, 64);

  // Window dots
  ctx.fillStyle = "rgba(245, 250, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(36, 32, 5, 0, Math.PI * 2);
  ctx.arc(56, 32, 5, 0, Math.PI * 2);
  ctx.arc(76, 32, 5, 0, Math.PI * 2);
  ctx.fill();

  // Header Title
  ctx.fillStyle = "#F5FAFF";
  ctx.font = "bold 18px 'Space Grotesk', sans-serif";
  ctx.fillText(title, 110, 38);

  ctx.fillStyle = accentColor;
  ctx.font = "bold 12px 'Space Grotesk', sans-serif";
  ctx.fillText(category, 880, 38);

  // Subtle border line
  ctx.strokeStyle = "rgba(245, 250, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, 1023, 679);

  // Left sidebar
  ctx.fillStyle = "rgba(6, 17, 31, 0.8)";
  ctx.fillRect(24, 88, 220, 560);
  ctx.strokeRect(24.5, 88.5, 220, 560);

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i === 0 ? accentColor : "rgba(245, 250, 255, 0.2)";
    ctx.fillRect(44, 120 + i * 44, i === 0 ? 120 : 90 + (i % 3) * 20, 10);
  }

  // Main Canvas / Chart area
  ctx.fillStyle = "rgba(6, 17, 31, 0.5)";
  ctx.fillRect(268, 88, 732, 340);
  ctx.strokeRect(268.5, 88.5, 732, 340);

  // Dynamic Chart line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 360);
  ctx.bezierCurveTo(450, 340, 500, 180, 650, 240);
  ctx.bezierCurveTo(750, 290, 850, 140, 950, 160);
  ctx.stroke();

  // Gradient below chart
  const chartGrad = ctx.createLinearGradient(0, 140, 0, 428);
  chartGrad.addColorStop(0, accentColor === "#168BFF" ? "rgba(22, 139, 255, 0.2)" : "rgba(77, 232, 255, 0.2)");
  chartGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
  ctx.fillStyle = chartGrad;
  ctx.lineTo(950, 428);
  ctx.lineTo(300, 428);
  ctx.closePath();
  ctx.fill();

  // Bottom Cards
  for (let c = 0; c < 3; c++) {
    const cardX = 268 + c * 252;
    ctx.fillStyle = "rgba(7, 26, 48, 0.6)";
    ctx.fillRect(cardX, 452, 228, 196);
    ctx.strokeStyle = "rgba(245, 250, 255, 0.08)";
    ctx.strokeRect(cardX + 0.5, 452.5, 228, 196);

    ctx.fillStyle = "#F5FAFF";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText(`${(c + 1) * 34.2}%`, cardX + 24, 500);

    ctx.fillStyle = "rgba(133, 133, 133, 0.8)";
    ctx.font = "12px sans-serif";
    ctx.fillText(c === 0 ? "Neural Latency" : c === 1 ? "System Throughput" : "Active Nodes", cardX + 24, 530);

    ctx.fillStyle = accentColor;
    ctx.fillRect(cardX + 24, 560, 180 * (0.4 + c * 0.25), 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class FloatingInterfaces {
  public group: THREE.Group;
  private panels: {
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    border: THREE.LineSegments;
    basePos: THREE.Vector3;
    baseRot: THREE.Euler;
    texture: THREE.Texture;
  }[] = [];

  constructor() {
    this.group = new THREE.Group();

    const configs: InterfacePanelConfig[] = [
      {
        title: "TANVO // NOVA AI CORE",
        type: "GENERATIVE ENGINE",
        width: 4.8,
        height: 3.2,
        position: new THREE.Vector3(1.2, 0.2, 0.5), // Primary foreground panel
        rotation: new THREE.Euler(0.08, -0.18, 0.02),
      },
      {
        title: "ARC // QUANTUM LIQUIDITY",
        type: "INSTITUTIONAL FINTECH",
        width: 4.2,
        height: 2.8,
        position: new THREE.Vector3(4.5, 1.4, -2.5),
        rotation: new THREE.Euler(0.12, -0.32, -0.05),
      },
      {
        title: "ORBIT // SPATIAL OS",
        type: "COLLABORATIVE CLOUD",
        width: 4.0,
        height: 2.7,
        position: new THREE.Vector3(-1.15, -1.2, -1.8),
        rotation: new THREE.Euler(-0.06, 0.22, 0.04),
      },
      {
        title: "MONO // COMMERCE FLAGSHIP",
        type: "EXPERIENTIAL WEB",
        width: 3.4,
        height: 2.3,
        position: new THREE.Vector3(2.5, -1.8, -3.2),
        rotation: new THREE.Euler(-0.15, -0.12, 0.08),
      },
    ];

    configs.forEach((cfg, idx) => {
      const accent = idx % 2 === 0 ? "#168BFF" : "#4DE8FF";
      const texture = createInterfaceCanvasTexture(cfg.title, cfg.type, accent);

      const geom = new THREE.PlaneGeometry(cfg.width, cfg.height);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(cfg.position);
      mesh.rotation.copy(cfg.rotation);

      const wireframe = new THREE.WireframeGeometry(geom);
      const borderMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x168bff : 0x4de8ff,
        transparent: true,
        opacity: 0.0,
      });
      const border = new THREE.LineSegments(wireframe, borderMat);
      mesh.add(border);

      this.group.add(mesh);
      this.panels.push({
        mesh,
        border,
        basePos: cfg.position.clone(),
        baseRot: cfg.rotation.clone(),
        texture,
      });
    });
  }

  public update(time: number, stageProgress: number) {
    // stageProgress = 2.0 -> 4.0 (Design phase is centered at ~3.0)
    if (stageProgress < 1.8 || stageProgress > 4.2) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;

    const entrance = THREE.MathUtils.smootherstep(stageProgress, 2.0, 3.0);
    const exit = 1 - THREE.MathUtils.smootherstep(stageProgress, 3.28, 4.05);
    const opacity = entrance * exit;

    this.panels.forEach((p, idx) => {
      p.mesh.material.opacity = opacity * 0.78;
      (p.border.material as THREE.LineBasicMaterial).opacity = opacity * 0.28;

      // Float hovering
      const hoverY = Math.sin(time * 0.62 + idx * 1.5) * 0.06;
      const hoverRot = Math.cos(time * 0.48 + idx * 1.2) * 0.012;

      p.mesh.position.y = p.basePos.y + hoverY;
      p.mesh.rotation.x = p.baseRot.x + hoverRot;

      // Retire the primary panel without the previous full-screen camera rush.
      if (idx === 0 && stageProgress > 3.0) {
        const passT = THREE.MathUtils.smootherstep(stageProgress, 3.0, 4.0);
        p.mesh.position.z = p.basePos.z + passT * 1.6;
        p.mesh.scale.setScalar(1.0 - passT * 0.12);
      } else {
        p.mesh.position.z = p.basePos.z;
        p.mesh.scale.setScalar(1.0);
      }
    });
  }

  public dispose() {
    this.panels.forEach((p) => {
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      p.border.geometry.dispose();
      (p.border.material as THREE.Material).dispose();
      p.texture.dispose();
    });
  }
}
