import * as THREE from "three";
import { Crystal } from "./Crystal";
import { CrystalFragments } from "./CrystalFragments";
import { HeroParticles } from "./HeroParticles";
import { StoryParticleField } from "./StoryParticleField";
import { WireframeLandscape } from "./WireframeLandscape";
import { FloatingInterfaces } from "./FloatingInterfaces";
import { BuildEnvironment } from "./BuildEnvironment";
import { LaunchEnvironment } from "./LaunchEnvironment";
import { ImpactEnvironment } from "./ImpactEnvironment";
import { disposeThreeHierarchy } from "../utils/disposal";

const CAMERA_POSITIONS_DESKTOP = [
  [0, 0, 7.6],
  [0, 0.04, 7.6],
  [0.12, 0.32, 7.2],
  [0.08, 0.24, 6.8],
  [0.12, 0.08, 7.0],
  [0, 0.02, 7.4],
  [0, 0.18, 8.2],
] as const;

const CAMERA_POSITIONS_MOBILE = [
  [0, 0, 9.2],
  [0, 0.04, 9.2],
  [0.12, 0.32, 8.4],
  [0.08, 0.24, 8.0],
  [0.12, 0.08, 8.2],
  [0, 0.02, 8.5],
  [0, 0.18, 9.0],
] as const;

const CAMERA_TARGETS = [
  [0, 0, 0],
  [0.9, 0, -0.5],
  [1.1, -0.55, -4],
  [1.35, 0.05, -0.8],
  [1.2, 0, -2],
  [1.35, 0, 0],
  [1.25, 0.1, -2],
] as const;

export interface HeroCrystalSceneConfig {
  container: HTMLDivElement;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

export class HeroCrystalScene {
  private container: HTMLDivElement;
  private isMobile: boolean;
  private prefersReducedMotion: boolean;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private sceneGroup: THREE.Group;
  private heroGroup: THREE.Group;
  private storyGroup: THREE.Group;
  private crystal: Crystal;
  private fragments: CrystalFragments;
  private heroParticles: HeroParticles;

  // Story Environments
  private storyParticles: StoryParticleField;
  private wireframeLandscape: WireframeLandscape;
  private floatingInterfaces: FloatingInterfaces;
  private buildEnv: BuildEnvironment;
  private launchEnv: LaunchEnvironment;
  private impactEnv: ImpactEnvironment;

  private topSpotLight: THREE.SpotLight;
  private keyLight: THREE.DirectionalLight;
  private blueRimLight: THREE.DirectionalLight;
  private cyanRimLight: THREE.DirectionalLight;

  private mouseTarget: { x: number; y: number } = { x: 0, y: 0 };
  private mouseCurrent: { x: number; y: number } = { x: 0, y: 0 };
  private storyProgress: number = 0;
  private cameraStart = new THREE.Vector3();
  private cameraEnd = new THREE.Vector3();
  private cameraTargetStart = new THREE.Vector3();
  private cameraTargetEnd = new THREE.Vector3();
  private cameraLookTarget = new THREE.Vector3();

  private animFrameId: number | null = null;
  private clock: THREE.Clock;
  private isDestroyed: boolean = false;

  constructor(config: HeroCrystalSceneConfig) {
    this.container = config.container;
    this.isMobile = config.isMobile;
    this.prefersReducedMotion = config.prefersReducedMotion;
    this.clock = new THREE.Clock();

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup (FOV 40 for cinematic hero framing)
    this.camera = new THREE.PerspectiveCamera(
      this.isMobile ? 44 : 40,
      width / height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, this.isMobile ? 8.6 : 7.2);

    // 3. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // 4. Dramatic Cinematic Lighting System (Matching reference image)
    const ambientLight = new THREE.AmbientLight(0x20283c, 2.2);
    this.scene.add(ambientLight);

    // Top Dramatic Spotlight shining directly onto the cyber-cube
    this.topSpotLight = new THREE.SpotLight(0xf5faff, 10.0, 35, Math.PI / 3.0, 0.4, 1.0);
    this.topSpotLight.position.set(1.2, 8.0, 4.0);
    this.scene.add(this.topSpotLight);

    // Key Light (Cool crisp white from front-right)
    this.keyLight = new THREE.DirectionalLight(0xf5faff, 4.5);
    this.keyLight.position.set(4.5, 4.5, 5.0);
    this.scene.add(this.keyLight);

    // Electric blue rim light from the official TANVO mark.
    this.blueRimLight = new THREE.DirectionalLight(0x168bff, 7.0);
    this.blueRimLight.position.set(-5.5, 2.0, -3.0);
    this.scene.add(this.blueRimLight);

    // Cyan rim light adds the logo's bright folded-edge highlight.
    this.cyanRimLight = new THREE.DirectionalLight(0x4de8ff, 4.0);
    this.cyanRimLight.position.set(5.5, 2.5, -2.5);
    this.scene.add(this.cyanRimLight);

    // 5. Visual Hierarchy Assembly
    this.sceneGroup = new THREE.Group();
    this.scene.add(this.sceneGroup);
    this.heroGroup = new THREE.Group();
    this.storyGroup = new THREE.Group();
    this.sceneGroup.add(this.heroGroup, this.storyGroup);

    // Hero Systems
    this.crystal = new Crystal();
    this.heroGroup.add(this.crystal.group);

    const fragmentCount = this.isMobile ? 14 : 26;
    this.fragments = new CrystalFragments(fragmentCount);
    this.heroGroup.add(this.fragments.mesh);

    const particleCount = this.isMobile ? 350 : 1000;
    this.heroParticles = new HeroParticles(particleCount);
    this.heroGroup.add(this.heroParticles.points);

    // Story Subsystems
    const storyParticleCount = this.isMobile ? 600 : 1800;
    this.storyParticles = new StoryParticleField(storyParticleCount);
    this.storyGroup.add(this.storyParticles.points);

    this.wireframeLandscape = new WireframeLandscape();
    this.storyGroup.add(this.wireframeLandscape.group);

    this.floatingInterfaces = new FloatingInterfaces();
    this.storyGroup.add(this.floatingInterfaces.group);

    this.buildEnv = new BuildEnvironment();
    this.storyGroup.add(this.buildEnv.group);

    this.launchEnv = new LaunchEnvironment();
    this.storyGroup.add(this.launchEnv.group);

    this.impactEnv = new ImpactEnvironment();
    this.storyGroup.add(this.impactEnv.group);

    this.updateLayoutPosition();

    // 6. Bind Listeners & Start Loop
    this.bindEvents();
    this.renderLoop();
  }

  private updateLayoutPosition() {
    this.sceneGroup.position.set(0, 0, 0);
    this.sceneGroup.scale.setScalar(1);

    if (this.isMobile) {
      this.sceneGroup.rotation.set(0, 0, 0);
      this.heroGroup.position.set(0.9, -1.75, 0);
      this.heroGroup.scale.setScalar(0.44);
      this.storyGroup.position.set(0.55, -0.32, 0);
      this.storyGroup.scale.setScalar(0.55);

      this.storyParticles.points.scale.setScalar(0.72);
      this.wireframeLandscape.group.scale.setScalar(0.86);
      this.floatingInterfaces.group.position.set(0.5, -2.3, 0);
      this.floatingInterfaces.group.scale.setScalar(0.7);
      this.buildEnv.group.scale.setScalar(0.72);
      this.launchEnv.group.scale.setScalar(0.62);
      this.launchEnv.group.position.set(1.7, -0.95, 0);
      this.impactEnv.group.scale.setScalar(0.56);
      this.impactEnv.group.position.set(1.9, -0.75, -2.4);
    } else {
      this.heroGroup.position.set(1.75, 0.06, 0);
      this.heroGroup.scale.setScalar(0.66);
      this.storyGroup.position.set(1.1, -0.08, 0);
      this.storyGroup.scale.setScalar(0.78);

      this.storyParticles.points.scale.setScalar(0.82);
      this.wireframeLandscape.group.scale.setScalar(0.95);
      this.floatingInterfaces.group.position.set(1.0, 0.02, 0);
      this.floatingInterfaces.group.scale.setScalar(0.72);
      this.buildEnv.group.scale.setScalar(0.78);
      this.launchEnv.group.scale.setScalar(0.58);
      this.launchEnv.group.position.set(1.45, 0.12, 0);
      this.impactEnv.group.scale.setScalar(0.55);
      this.impactEnv.group.position.set(2.05, -0.1, -2);
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMobile || this.prefersReducedMotion) return;
    const { innerWidth, innerHeight } = window;
    this.mouseTarget.x = (e.clientX / innerWidth - 0.5) * 2;
    this.mouseTarget.y = (e.clientY / innerHeight - 0.5) * 2;
  };

  public setStoryProgress(progress: number) {
    this.storyProgress = Math.max(0, Math.min(6.5, progress));
  }

  public onResize = (isMobile: boolean) => {
    if (this.isDestroyed || !this.container) return;
    this.isMobile = isMobile;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.fov = this.isMobile ? 44 : 40;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 2.0));

    this.updateLayoutPosition();
  };

  private bindEvents() {
    window.addEventListener("mousemove", this.onMouseMove, { passive: true });
  }

  private renderLoop = () => {
    if (this.isDestroyed) return;

    const elapsedTime = this.clock.getElapsedTime();
    const p = this.storyProgress;

    // Subtle, smooth mouse parallax
    const parallaxDampening = Math.max(0.15, 1.0 - p * 0.2);
    if (!this.prefersReducedMotion && !this.isMobile) {
      this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.04;
      this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.04;

      this.sceneGroup.rotation.y = this.mouseCurrent.x * 0.16 * parallaxDampening;
      this.sceneGroup.rotation.x = this.mouseCurrent.y * 0.10 * parallaxDampening;
    }

    // 1. Hero Monolith & Particles
    if (p <= 1.2) {
      this.crystal.group.visible = true;
      this.fragments.mesh.visible = true;
      this.heroParticles.points.visible = true;

      const heroP = Math.min(1.0, p);
      const speedMultiplier = 1.0 + heroP * 2.0;

      this.crystal.update(elapsedTime, speedMultiplier);
      this.crystal.setScrollProgress(heroP);
      this.fragments.update(elapsedTime, heroP);
      this.heroParticles.update(elapsedTime, heroP);
    } else {
      this.crystal.group.visible = false;
      this.fragments.mesh.visible = false;
      this.heroParticles.points.visible = false;
    }

    // 2. Continuous Story Particle Field
    if (p >= 0.55) {
      this.storyParticles.points.visible = true;
      this.storyParticles.update(elapsedTime, p);
      this.storyParticles.points.material.size *= this.isMobile ? 0.62 : 0.82;
      this.storyParticles.points.material.opacity = this.isMobile ? 0.52 : 0.72;
    } else {
      this.storyParticles.points.visible = false;
    }

    // 3. Stage-Specific Visual Subsystems
    this.wireframeLandscape.update(elapsedTime, p);
    this.floatingInterfaces.update(elapsedTime, p);
    this.buildEnv.update(elapsedTime, p);
    this.launchEnv.update(elapsedTime, p);
    this.impactEnv.update(elapsedTime, p);

    // 4. Central Camera Director
    this.updateCameraPath(p);

    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.renderLoop);
  };

  private updateCameraPath(p: number) {
    const clampedProgress = THREE.MathUtils.clamp(p, 0, 6);
    const startIndex = Math.min(5, Math.floor(clampedProgress));
    const endIndex = Math.min(6, startIndex + 1);
    const segmentProgress = THREE.MathUtils.smootherstep(
      clampedProgress,
      startIndex,
      endIndex
    );

    this.setCameraPositionKeyframe(startIndex, this.cameraStart);
    this.setCameraPositionKeyframe(endIndex, this.cameraEnd);
    this.camera.position.lerpVectors(
      this.cameraStart,
      this.cameraEnd,
      segmentProgress
    );

    const parallaxStrength = Math.max(0, 1 - clampedProgress / 2);
    this.camera.position.x += this.mouseCurrent.x * 0.18 * parallaxStrength;
    this.camera.position.y -= this.mouseCurrent.y * 0.1 * parallaxStrength;

    this.setCameraTargetKeyframe(startIndex, this.cameraTargetStart);
    this.setCameraTargetKeyframe(endIndex, this.cameraTargetEnd);
    this.cameraLookTarget.lerpVectors(
      this.cameraTargetStart,
      this.cameraTargetEnd,
      segmentProgress
    );
    this.camera.lookAt(this.cameraLookTarget);
  }

  private setCameraPositionKeyframe(index: number, target: THREE.Vector3) {
    const positions = this.isMobile
      ? CAMERA_POSITIONS_MOBILE
      : CAMERA_POSITIONS_DESKTOP;
    const position = positions[index] ?? positions[positions.length - 1];
    target.set(position[0], position[1], position[2]);
  }

  private setCameraTargetKeyframe(index: number, target: THREE.Vector3) {
    const cameraTarget =
      CAMERA_TARGETS[index] ?? CAMERA_TARGETS[CAMERA_TARGETS.length - 1];
    target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }

    window.removeEventListener("mousemove", this.onMouseMove);

    this.heroParticles.dispose();
    this.storyParticles.dispose();
    this.wireframeLandscape.dispose();
    this.floatingInterfaces.dispose();
    this.buildEnv.dispose();
    this.launchEnv.dispose();
    this.impactEnv.dispose();

    disposeThreeHierarchy(this.scene);

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
