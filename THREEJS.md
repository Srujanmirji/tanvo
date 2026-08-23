# TANVO Three.js and WebGL Specification

## Objective

The WebGL layer should feel like a premium digital art installation while remaining performant.

## Hero crystal

Create an irregular crystalline object.

Characteristics:

- dark metallic outer surface
- fractured geometry
- internal violet energy
- subtle reflections
- small fragments
- atmospheric haze

Avoid a simple sphere.

The crystal should occupy a large portion of the hero.

## Crystal interaction

Idle:

slow rotation and float.

Pointer:

subtle parallax and rotation.

Scroll:

rotation increases.

Fragments separate.

Core reveals.

Object dissolves into particles.

## Particle field

Use InstancedMesh or BufferGeometry.

Do not create thousands of React components.

Particles should have:

- position
- velocity or noise movement
- size variation
- opacity variation
- subtle glow

Use shaders if useful.

## Wireframe landscape

Create a procedural or generated terrain.

Use:

- deep navy
- violet lines
- subtle fog

Allow camera movement through the landscape.

## Floating interfaces

Use planes or 3D panels.

Keep perspective subtle.

Avoid excessive depth.

The UI should remain readable.

## Data stream

Create abstract code/data streams.

Do not show huge blocks of actual source code.

Use:

- particles
- lines
- glyph-like fragments
- moving points
- geometry

## Launch

The launch visual should feel like a product coming into reality.

Use controlled light.

Avoid cartoon rocket imagery.

## Final portal

Create a large circular architectural portal.

Use:

- dark environment
- warm white center
- gold edge light
- subtle particles
- atmospheric depth

## Performance

- cap DPR
- reduce particle counts on mobile
- reduce post-processing on mobile
- lazy load heavy assets
- use compressed textures
- avoid unnecessary render loops
- dispose resources
- use instancing
- avoid expensive transparent materials everywhere

## Fallback

If WebGL is unavailable, display a static visual background and preserve all HTML content and navigation.
