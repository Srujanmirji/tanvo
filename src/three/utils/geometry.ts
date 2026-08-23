import * as THREE from "three";

/**
 * Creates an intricately beveled and fractured futuristic cube monolith geometry.
 * Displaces box face vertices along normals with tectonic fissure patterns to create
 * sharp geometric plates, fissures, and technological paneling.
 */
export function createFuturisticCubeGeometry(
  size: number = 3.2,
  segments: number = 24
): THREE.BufferGeometry {
  const baseGeom = new THREE.BoxGeometry(size, size, size, segments, segments, segments);
  const posAttr = baseGeom.getAttribute("position");
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // Normalize coordinates on [-1, 1] cube surface
    const nx = vertex.x / (size / 2);
    const ny = vertex.y / (size / 2);
    const nz = vertex.z / (size / 2);

    // Identify edges and corners for chamfer / bevel effect
    const edgeDistX = 1.0 - Math.abs(nx);
    const edgeDistY = 1.0 - Math.abs(ny);
    const edgeDistZ = 1.0 - Math.abs(nz);

    // Chamfer near cube edges
    const cornerFactor = Math.min(edgeDistX, edgeDistY, edgeDistZ);
    if (cornerFactor < 0.08) {
      vertex.multiplyScalar(0.96);
    }

    // Tectonic crack / fissure displacement patterns
    const crack1 = Math.sin(nx * 8.0 + ny * 6.0) * Math.cos(nz * 7.0);
    const crack2 = Math.cos(ny * 10.0 + nz * 8.0) * Math.sin(nx * 9.0);
    const fissure = Math.pow(Math.abs(crack1 * crack2), 2.2);

    // Surface paneling / tech engravings
    const panelGrid = Math.abs(Math.sin(nx * 12.0) * Math.sin(ny * 12.0) * Math.sin(nz * 12.0));
    const relief = panelGrid > 0.3 ? 0.05 : -0.08 * fissure;

    const normal = vertex.clone().normalize();
    vertex.addScaledVector(normal, relief);

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  baseGeom.computeVertexNormals();
  const nonIndexed = baseGeom.toNonIndexed();
  nonIndexed.computeVertexNormals();
  baseGeom.dispose();

  return nonIndexed;
}

/**
 * Creates fractured obsidian ground terrain beneath the monolith.
 */
export function createCraterTerrainGeometry(
  radius: number = 8.0,
  segments: number = 40
): THREE.BufferGeometry {
  const geom = new THREE.PlaneGeometry(radius * 2, radius * 2, segments, segments);
  geom.rotateX(-Math.PI / 2);

  const pos = geom.getAttribute("position");
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const distFromCenter = Math.sqrt(v.x * v.x + v.z * v.z);

    // Crater depression in center for the cube, rocky fractured ridges around
    const crater = Math.exp(-Math.pow(distFromCenter / 3.0, 2)) * -0.6;
    const rocks =
      Math.sin(v.x * 2.0 + v.z * 1.5) * 0.25 +
      Math.cos(v.x * 3.5 - v.z * 2.8) * 0.18 +
      Math.sin(v.z * 5.0) * 0.1;

    // Fade rocks at outer perimeter
    const edgeFade = Math.max(0, 1.0 - Math.pow(distFromCenter / radius, 2));

    v.y = (crater + rocks) * edgeFade - 2.8; // positioned beneath the cube
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  const nonIndexed = geom.toNonIndexed();
  nonIndexed.computeVertexNormals();
  geom.dispose();
  return nonIndexed;
}

/**
 * Creates sharp floating stone / obsidian shard geometries for orbital fragments.
 */
export function createShardGeometry(scale: number = 0.4): THREE.BufferGeometry {
  const geom = new THREE.DodecahedronGeometry(scale, 0);
  const pos = geom.getAttribute("position");
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.x *= 0.7 + Math.random() * 0.6;
    v.y *= 1.2 + Math.random() * 0.8;
    v.z *= 0.7 + Math.random() * 0.6;
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}
