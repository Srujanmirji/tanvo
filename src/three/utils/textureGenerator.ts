import * as THREE from "three";

/**
 * Generates high-res procedural cyber/obsidian textures with tech engravings,
 * tectonic fissures, and electric blue/cyan veins for the 3D monolith.
 */
export function generateCyberTextures(): {
  diffuseMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
} {
  const size = 1024;

  // 1. Diffuse / Base Color Canvas
  const dCanvas = document.createElement("canvas");
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext("2d")!;

  // Base dark obsidian / graphite
  dCtx.fillStyle = "#07111e";
  dCtx.fillRect(0, 0, size, size);

  // Geometric Tech Panels & Plates
  const panelCols = 6;
  const tileSize = size / panelCols;

  dCtx.strokeStyle = "rgba(245, 250, 255, 0.12)";
  dCtx.lineWidth = 2;

  for (let i = 0; i < panelCols; i++) {
    for (let j = 0; j < panelCols; j++) {
      const px = i * tileSize;
      const py = j * tileSize;

      // Color variation across plates
      const shade = ((i * 3 + j * 7) % 5);
      if (shade === 0) dCtx.fillStyle = "#141c28";
      else if (shade === 1) dCtx.fillStyle = "#0a0e16";
      else if (shade === 2) dCtx.fillStyle = "#182232";
      else dCtx.fillStyle = "#0f1520";

      dCtx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
      dCtx.strokeRect(px + 4, py + 4, tileSize - 8, tileSize - 8);

      // Inner tech grooves
      dCtx.strokeStyle = "rgba(22, 139, 255, 0.15)";
      dCtx.strokeRect(px + 12, py + 12, tileSize - 24, tileSize - 24);

      // Corner notch details
      dCtx.fillStyle = "rgba(77, 232, 255, 0.3)";
      dCtx.fillRect(px + 8, py + 8, 4, 4);
      dCtx.fillRect(px + tileSize - 12, py + 8, 4, 4);
    }
  }

  // 2. Emissive Map Canvas (Intricate blue/cyan energy fissures)
  const eCanvas = document.createElement("canvas");
  eCanvas.width = size;
  eCanvas.height = size;
  const eCtx = eCanvas.getContext("2d")!;

  eCtx.fillStyle = "#000000";
  eCtx.fillRect(0, 0, size, size);

  // Central glowing core energy vortex (focused, radius ~80px)
  const grad = eCtx.createRadialGradient(size / 2, size / 2, 5, size / 2, size / 2, 90);
  grad.addColorStop(0, "#D6F8FF");
  grad.addColorStop(0.3, "#168BFF");
  grad.addColorStop(0.7, "#0D4FD4");
  grad.addColorStop(1, "#000000");

  eCtx.fillStyle = grad;
  eCtx.beginPath();
  eCtx.arc(size / 2, size / 2, 90, 0, Math.PI * 2);
  eCtx.fill();

  // Intricate glowing lightning fissures radiating outward along plate seams
  eCtx.strokeStyle = "#67DFFF";
  eCtx.lineWidth = 5;
  eCtx.shadowColor = "#168BFF";
  eCtx.shadowBlur = 12;

  const fissurePaths = [
    [[512, 512], [420, 340], [340, 340], [340, 180], [170, 170]],
    [[512, 512], [600, 380], [680, 380], [680, 200], [850, 170]],
    [[512, 512], [440, 640], [340, 680], [340, 850], [170, 850]],
    [[512, 512], [620, 600], [680, 680], [680, 850], [850, 850]],
    [[512, 512], [340, 512], [170, 512], [50, 480]],
    [[512, 512], [680, 512], [850, 512], [970, 530]],
    [[512, 512], [512, 340], [512, 170], [520, 40]],
    [[512, 512], [512, 680], [512, 850], [500, 980]],
  ];

  fissurePaths.forEach((path) => {
    eCtx.beginPath();
    eCtx.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) {
      eCtx.lineTo(path[i][0], path[i][1]);
    }
    eCtx.stroke();
  });

  // Secondary fine lightning micro-cracks
  eCtx.strokeStyle = "#D6F8FF";
  eCtx.lineWidth = 2;
  eCtx.shadowBlur = 6;

  fissurePaths.forEach((path) => {
    eCtx.beginPath();
    eCtx.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length; i++) {
      eCtx.lineTo(path[i][0] + (Math.random() - 0.5) * 4, path[i][1] + (Math.random() - 0.5) * 4);
    }
    eCtx.stroke();
  });

  // 3. Roughness Map Canvas
  const rCanvas = document.createElement("canvas");
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext("2d")!;
  rCtx.fillStyle = "#333333";
  rCtx.fillRect(0, 0, size, size);

  // Shiny plate surfaces
  rCtx.fillStyle = "#1c1c1c";
  for (let i = 0; i < panelCols; i++) {
    for (let j = 0; j < panelCols; j++) {
      rCtx.fillRect(i * tileSize + 6, j * tileSize + 6, tileSize - 12, tileSize - 12);
    }
  }

  // 4. Normal Map Canvas
  const nCanvas = document.createElement("canvas");
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext("2d")!;
  nCtx.fillStyle = "#8080ff"; // neutral normal
  nCtx.fillRect(0, 0, size, size);

  // Bevel borders
  nCtx.strokeStyle = "#4040ff";
  nCtx.lineWidth = 3;
  for (let i = 0; i < panelCols; i++) {
    for (let j = 0; j < panelCols; j++) {
      nCtx.strokeRect(i * tileSize + 4, j * tileSize + 4, tileSize - 8, tileSize - 8);
    }
  }

  const diffuseMap = new THREE.CanvasTexture(dCanvas);
  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  const emissiveMap = new THREE.CanvasTexture(eCanvas);
  const normalMap = new THREE.CanvasTexture(nCanvas);

  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  return { diffuseMap, roughnessMap, emissiveMap, normalMap };
}
