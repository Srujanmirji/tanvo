# TANVO QA Checklist

## Functional

- [ ] Application starts without errors
- [ ] Navigation works
- [ ] Mobile menu works
- [ ] All section anchors work
- [ ] CTA buttons work
- [ ] Project links are configurable
- [ ] Footer links work or are clearly placeholders

## WebGL

- [ ] Hero crystal renders
- [ ] Mouse interaction works
- [ ] Scroll transformation works
- [ ] Particle system works
- [ ] Wireframe transition works
- [ ] UI transition works
- [ ] Data/build scene works
- [ ] Launch scene works
- [ ] Final portal works
- [ ] WebGL fallback works

## GSAP

- [ ] ScrollTrigger timelines initialize
- [ ] ScrollTrigger cleanup works
- [ ] No duplicate timelines
- [ ] Resizing does not break animations
- [ ] Fast scrolling does not cause broken states

## Lenis

- [ ] Smooth scrolling works
- [ ] No scroll lock
- [ ] Anchor navigation works
- [ ] Mobile scrolling remains natural

## Responsive

- [ ] 1440px
- [ ] 1280px
- [ ] 1024px
- [ ] 768px
- [ ] 390px
- [ ] 375px

Check:

- [ ] no horizontal overflow
- [ ] no clipped text
- [ ] no overlapping content
- [ ] buttons remain accessible

## Accessibility

- [ ] keyboard navigation
- [ ] visible focus states
- [ ] semantic headings
- [ ] accessible buttons
- [ ] image alt text
- [ ] reduced motion support
- [ ] sufficient contrast

## Performance

- [ ] no obvious memory leaks
- [ ] no repeated WebGL initialization
- [ ] no unnecessary React rerenders
- [ ] particle counts adapt
- [ ] DPR is capped
- [ ] heavy assets are lazy loaded

## Final visual review

The site should not look like:

- a generic agency template
- a SaaS dashboard
- an AI-generated landing page
- a collection of unrelated sections

It should feel like one continuous TANVO experience.

The final question to ask:

Does the website make someone believe TANVO can turn their idea into reality?
