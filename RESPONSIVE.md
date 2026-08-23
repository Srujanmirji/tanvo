# TANVO Responsive Specification

## Desktop

Primary experience at:

1440px

Also test:

1280px
1024px

Desktop gets:

- full WebGL experience
- cinematic camera movement
- full particle systems
- custom cursor
- asymmetric layouts
- large typography

## Tablet

Reduce:

- particle count
- post-processing
- camera movement
- number of floating screens

Preserve:

- typography hierarchy
- section order
- storytelling
- navigation usability

## Mobile

Test:

390px
375px

Mobile should preserve the narrative but simplify the WebGL.

Hero:

TANVO

WE BUILD
WHAT YOU
IMAGINE.

3D object below or beside the headline depending on viewport.

Reduce:

- particle count
- geometry complexity
- post-processing
- camera movement

Disable:

- custom cursor
- expensive hover interactions

## Rules

No horizontal overflow.

No clipped text.

No overlapping buttons.

Touch targets should be comfortable.

Navigation becomes a mobile menu.

All content remains accessible.

## Reduced motion

Respect prefers-reduced-motion at every breakpoint.
