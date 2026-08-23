# TANVO Technical Architecture

## Application structure

```text
src/
  components/
    layout/
    navigation/
    hero/
    story/
    work/
    services/
    approach/
    trust/
    cta/
    footer/

  three/
    components/
    scenes/
    materials/
    shaders/
    utils/

  animations/
    hero/
    story/
    transitions/
    text/

  hooks/
    useLenis.ts
    useReducedMotion.ts
    useMediaQuery.ts
    useIsMobile.ts

  data/
    site.ts
    navigation.ts
    projects.ts
    services.ts
    metrics.ts

  pages/
    Home.tsx

  styles/
    globals.css

  App.tsx
  main.tsx
```

## Component rules

Keep components focused.

Do not create one giant Home component.

UI components should not contain large amounts of Three.js logic.

Animation timelines should live in animation modules where practical.

Content should live in data files.

## Three.js rules

Create reusable visual systems:

- CrystalScene
- ParticleField
- WireframeLandscape
- FloatingScreens
- DataStream
- LaunchScene
- ProductEnvironment
- FinalPortal

Use InstancedMesh for large repeated objects.

Use shader materials when they provide meaningful visual value.

Limit device pixel ratio.

Dispose geometries, materials and textures.

## Animation rules

Use GSAP for:

- ScrollTrigger
- timeline sequencing
- text reveals
- camera choreography
- section transitions
- UI transitions

Use CSS transitions for tiny UI-only interactions where GSAP is unnecessary.

## State

Avoid unnecessary global state.

Use local React state for UI.

Use refs for Three.js and animation objects.

Keep configuration in data files.

## Cleanup

Every animation component must clean up:

- ScrollTriggers
- GSAP timelines
- event listeners
- Lenis listeners
- Three.js resources
