import * as THREE from "three";

/**
 * Recursively disposes geometries, materials, and textures within a Three.js Object3D hierarchy.
 */
export function disposeThreeHierarchy(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) {
        obj.geometry.dispose();
      }

      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => disposeMaterial(mat));
      } else if (obj.material) {
        disposeMaterial(obj.material);
      }
    } else if (obj instanceof THREE.Points) {
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      if (obj.material) {
        disposeMaterial(obj.material);
      }
    }
  });
}

function disposeMaterial(mat: THREE.Material) {
  // Dispose all potential texture maps
  const materialWithTextures = mat as unknown as Record<string, unknown>;
  for (const key of Object.keys(materialWithTextures)) {
    const val = materialWithTextures[key];
    if (val && typeof val === "object" && "isTexture" in val && typeof (val as THREE.Texture).dispose === "function") {
      (val as THREE.Texture).dispose();
    }
  }
  mat.dispose();
}
