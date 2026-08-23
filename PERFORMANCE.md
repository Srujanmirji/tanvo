# TANVO Performance Requirements

## Target

Aim for smooth interaction and approximately 60 FPS on capable desktop hardware.

## WebGL

- cap renderer pixel ratio
- use InstancedMesh for repeated particles
- avoid unnecessary transparent materials
- avoid excessive post-processing
- use frustum culling where practical
- dispose unused assets
- reuse materials
- reuse geometries

## Assets

- compress images
- prefer modern formats
- lazy load below-the-fold heavy assets
- avoid huge textures
- preload only critical hero assets

## Animation

- use GSAP timelines instead of many independent loops
- avoid layout-triggering animation
- animate transform and opacity where possible
- avoid continuous React state updates for animation
- use refs for high-frequency animation values

## Mobile

Reduce WebGL quality automatically.

Recommended:

- lower DPR
- fewer particles
- fewer lights
- simpler materials
- less post-processing

## Loading

The initial page should render useful HTML quickly.

The WebGL scene may initialize progressively.

Do not block the whole page on non-critical assets.

## Monitoring

During development check:

- frame rate
- memory
- console errors
- network size
- long tasks
- image sizes
