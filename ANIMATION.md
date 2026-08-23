# TANVO Animation System

## Philosophy

Animation should communicate transformation.

Do not animate elements randomly.

The entire site represents an idea becoming reality.

## Global motion

Use smooth easing.

Prefer:

power2.out
power3.out
expo.out
circ.out

Use longer durations for cinematic transitions.

Avoid excessive bounce.

## Hero timeline

Initial:

- crystal floats
- subtle rotation
- particles drift
- text is stable

Scroll:

0 to 20 percent:
crystal rotates more.

20 to 40 percent:
fragments begin separating.

40 to 60 percent:
core becomes visible.

60 to 80 percent:
crystal breaks into particles.

80 to 100 percent:
particles spread into the IDEA environment.

## Story transformation

IDEA:

point → particles

VISION:

particles → network → wireframe

DESIGN:

wireframe → components → product interfaces

BUILD:

interfaces → fragments → code/data

LAUNCH:

data → product → light burst

IMPACT:

product → ecosystem of finished products

## Text

Use:

- line reveal
- clip-path reveal
- blur-to-sharp
- subtle y translation
- opacity

Do not animate every paragraph.

Headlines get the strongest treatment.

## ScrollTrigger

Prefer scrubbed timelines for the main story.

Pin only major cinematic sequences.

Do not pin every section.

Do not break normal browser scrolling.

## Hover

Keep hover transitions under roughly 500ms for UI.

Use larger cinematic timing for WebGL transformations.

## Reduced motion

When prefers-reduced-motion is active:

- remove camera choreography
- reduce particle movement
- disable custom cursor
- reduce scrub intensity
- use simple opacity/transform transitions

Content and navigation must remain fully usable.
