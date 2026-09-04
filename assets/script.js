/**
 * TANVO Digital Agency - Interactive Scripts
 * Handles scroll-spy navigation, interactive services accordion,
 * project inquiry modal, case study preview modal, and mobile drawer.
 */

/* --------------------------------------------------------------------------
   Contact form delivery — Google Sheets via Apps Script.
   SET FORM_ENDPOINT BEFORE GOING LIVE.

   Deploy google-apps-script/Code.gs as a Web App ("Execute as: Me",
   "Who has access: Anyone") and paste its /exec URL below. Full steps are in
   the header comment of that file.

   FORM_SHARED_SECRET must match SHARED_SECRET in Code.gs. It travels in the
   client bundle, so it is NOT authentication — it only stops drive-by bots
   that scrape the endpoint URL. The real spam filter is the honeypot field.

   The request is deliberately sent as text/plain, not application/json:
   application/json is not a CORS-safelisted Content-Type, so the browser would
   fire an OPTIONS preflight that Apps Script does not answer, and the POST
   would never arrive. text/plain skips the preflight while still letting us
   read the response — which is what makes real error handling possible.

   While FORM_ENDPOINT is empty the form tells people to email us instead of
   pretending the inquiry was sent. Never let it silently swallow a lead.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxUXB3v3_kDpt2XCIk9PZuHiXt_PqEVp7bvyLxdx0q4sNV8zVV5f1Us99RpFO7TnaXM/exec';
const FORM_SHARED_SECRET = '0B78yDedGVSpYfLwZxQXux8yuUhWbYW9';
const CONTACT_EMAIL = 'support@tanvo.in';

document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initServicesAccordion();
  initProjectModal();
  initCaseStudyModal();
  initMobileDrawer();
  initHeaderScroll();
  initScrollAnimations();
  initProcessStorytelling();
  initMagneticCursorAndSpotlight();
  init3DCardTilt();
  initHeadlineWordReveal();
});

/* ==========================================================================
   1. Navigation Scroll-Spy
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-35% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetId = entry.target.getAttribute('id');
        
        // Update top nav links
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   2. Interactive Services Accordion & Laptop Preview Sync
   ========================================================================== */
function initServicesAccordion() {
  const serviceItems = document.querySelectorAll('.service-item');
  const laptopImage = document.getElementById('services-laptop-img');

  const serviceImages = {
    '01': 'assets/images/laptop-mockup.webp',
    '02': 'assets/images/case-furniture.webp',
    '03': 'assets/images/manifesto-sketches.webp',
    '04': 'assets/images/service-branding.webp',
    '05': 'assets/images/service-webapp.webp'
  };

  serviceItems.forEach((item) => {
    const header = item.querySelector('.service-header');
    const body = item.querySelector('.service-body');
    const num = item.getAttribute('data-service');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      serviceItems.forEach((other) => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.service-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';

        // Synchronize laptop preview image with smooth fade
        if (laptopImage && serviceImages[num]) {
          laptopImage.style.opacity = '0.4';
          setTimeout(() => {
            laptopImage.src = serviceImages[num];
            laptopImage.style.opacity = '1';
          }, 180);
        }
      }
    });
  });

  // Open first item by default
  const firstItem = document.querySelector('.service-item.active');
  if (firstItem) {
    const firstBody = firstItem.querySelector('.service-body');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }
}

/* ==========================================================================
   3. "Start a Project" Inquiry Modal
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeButton = modal ? modal.querySelector('.modal-close-btn') : null;
  const projectForm = document.getElementById('project-inquiry-form');
  const successState = document.getElementById('modal-success-state');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form after exit transition
    setTimeout(() => {
      if (projectForm && successState) {
        projectForm.style.display = 'block';
        successState.style.display = 'none';
        projectForm.reset();
        const errorBox = document.getElementById('form-error');
        if (errorBox) errorBox.hidden = true;
        document.querySelectorAll('.pill-option').forEach(p => p.classList.remove('selected'));
      }
    }, 350);
  }

  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element) || !e.target.closest('[data-open-modal="project"]')) return;
    e.preventDefault();
    openModal();
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Pill option selections
  document.querySelectorAll('.pill-group').forEach((group) => {
    const isSingleSelect = group.getAttribute('data-select-mode') === 'single';
    const pills = group.querySelectorAll('.pill-option');

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        if (isSingleSelect) {
          pills.forEach((p) => p.classList.remove('selected'));
          pill.classList.add('selected');
        } else {
          pill.classList.toggle('selected');
        }
      });
    });
  });

  // Form submission handling
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const errorBox = document.getElementById('form-error');
      const idleLabel = 'Send project inquiry &rarr;';

      const showError = (msg) => {
        if (!errorBox) return;
        errorBox.innerHTML = msg;
        errorBox.hidden = false;
      };
      const setBusy = (busy) => {
        if (!submitBtn) return;
        submitBtn.disabled = busy;
        submitBtn.innerHTML = busy ? 'Sending inquiry...' : idleLabel;
        submitBtn.style.opacity = busy ? '0.75' : '1';
      };

      if (errorBox) errorBox.hidden = true;

      if (!FORM_ENDPOINT) {
        showError(
          'The inquiry form is not connected yet. Please email us at ' +
          '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> and we will reply within 24 hours.'
        );
        return;
      }

      const selected = (mode) =>
        [...document.querySelectorAll('.pill-group[data-select-mode="' + mode + '"] .pill-option.selected')]
          .map((pill) => pill.textContent.trim());

      // The honeypot rides along verbatim. It is NOT short-circuited here: a
      // browser autofilling it would silently bin a genuine inquiry. The server
      // still records every submission and only flags the suspicious ones.
      const payload = Object.fromEntries(new FormData(projectForm));
      payload.capabilities = selected('multi').join(', ') || 'Not specified';
      payload.subject = 'New project inquiry from ' + (payload.name || 'the TANVO site');
      payload.secret = FORM_SHARED_SECRET;
      payload.pageUrl = window.location.href;

      setBusy(true);
      try {
        // text/plain keeps this a CORS "simple request" — see the note by
        // FORM_ENDPOINT for why this must not be application/json.
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Request failed with status ' + res.status);

        // Apps Script answers 200 even when the script itself threw, so trust
        // the body, not just the status line.
        const result = await res.json().catch(() => null);
        if (!result || result.status !== 'ok') {
          throw new Error('Endpoint rejected the inquiry: ' + (result && result.message || 'unknown error'));
        }

        projectForm.style.display = 'none';
        if (successState) successState.style.display = 'flex';
        setBusy(false);
      } catch (err) {
        console.error('Project inquiry submission failed:', err);
        setBusy(false);
        showError(
          'We could not send your inquiry just now. Please try again, or email us directly at ' +
          '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.'
        );
      }
    });
  }
}

/* ==========================================================================
   4. Case Study Quick View Modal
   ========================================================================== */
function initCaseStudyModal() {
  const caseModal = document.getElementById('case-modal');
  const triggerLinks = document.querySelectorAll('[data-open-case]');
  const closeButton = caseModal ? caseModal.querySelector('.modal-close-btn') : null;

  const caseData = {
    'buy-n-build': {
      title: 'Buy N Build',
      category: 'Architectural Platform & CRM',
      stat: '3D Configurator & CRM Sync',
      headline: 'Modern digital storefront with real-time architectural configurators.',
      image: 'assets/images/case-architecture.webp',
      overview: 'Buy N Build is an ambitious architectural developer redefining residential living. We built a sub-second, immersive 3D-integrated web platform featuring instant floor plan exploration, real-time material previews, and automated lead ingestion.',
      deliverables: ['3D Spatial Viewport', 'Next.js 14 Platform', 'Automated CRM Sync', 'Interactive Floor Plans']
    },
    'the-slow-house': {
      title: 'The Slow House',
      category: 'Headless E-Commerce Flagship',
      stat: 'Sub-second Speed & Custom Cart',
      headline: 'Tactile Scandinavian editorial design paired with instant headless checkout.',
      image: 'assets/images/case-furniture.webp',
      overview: 'The Slow House crafts timeless, sustainable home furnishings. We designed a headless Shopify Plus storefront focused on tactile editorial storytelling, instant catalog filtering, and custom modular product configurations.',
      deliverables: ['Headless Shopify Plus', 'Editorial Art Direction', 'Custom Variant Customizer', 'Sub-second Navigation']
    },
    'shivakrupa': {
      title: 'Shivakrupa',
      category: 'Heritage Brand & Digital Archive',
      stat: 'Bespoke Catalog & VIP Booking',
      headline: 'Cinematic heritage jewelry archive and private consultation engine.',
      image: 'assets/images/case-jewelry.webp',
      overview: 'Shivakrupa is a storied legacy jeweller known for handcrafted bridal ornaments. We delivered a regal, dark-mode digital flagship highlighting fine craft, certified hallmark transparency, and private VIP consultation booking.',
      deliverables: ['Digital Craftsmanship Archive', 'Private VIP Booking', 'High-Res Hallmark Zoom', 'Custom CMS Architecture']
    }
  };

  if (!caseModal) return;

  function openCase(caseKey) {
    const data = caseData[caseKey];
    if (!data) return;

    document.getElementById('case-modal-title').textContent = data.title;
    document.getElementById('case-modal-category').textContent = data.category;
    document.getElementById('case-modal-stat').textContent = data.stat;
    document.getElementById('case-modal-headline').textContent = data.headline;
    document.getElementById('case-modal-overview').textContent = data.overview;
    document.getElementById('case-modal-image').src = data.image;

    const tagsContainer = document.getElementById('case-modal-deliverables');
    tagsContainer.innerHTML = '';
    data.deliverables.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'service-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    caseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCase() {
    caseModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const caseKey = link.getAttribute('data-open-case');
      openCase(caseKey);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeCase);
  }

  caseModal.addEventListener('click', (e) => {
    if (e.target === caseModal) closeCase();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseModal.classList.contains('active')) {
      closeCase();
    }
  });
}

/* ==========================================================================
   5. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn-primary');

  if (!menuToggle || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   6. Header Glassmorphism Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.background = 'rgba(11, 11, 14, 0.95)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(11, 11, 14, 0.85)';
      header.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   7. Premium Scroll Animation System
   ========================================================================== */
function initScrollAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const progressBar = document.getElementById('scrollProgressBar');
  const parallaxImages = document.querySelectorAll('.hero-image-wrapper img, .manifesto-image-wrapper img, .about-center-img img');

  // If user prefers reduced motion, reveal everything immediately and exit
  if (isReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // Check native CSS feature support
  const hasScrollDrivenTimeline = window.CSS && CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const hasScrollProgressTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');

  // Reveal elements on scroll using IntersectionObserver (fallback or progressive trigger)
  if (!hasScrollDrivenTimeline) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      // If element is already in viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // For native scroll-driven, ensure elements have is-revealed as a safe base state
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Smooth scroll progress indicators & parallax fallback
  let ticking = false;

  function onScrollFrame() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    // Top progress bar (if not handled natively by CSS scroll timeline)
    if (!hasScrollProgressTimeline && progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // Parallax drift fallback for photography if native scroll-timeline is absent
    if (!hasScrollDrivenTimeline && parallaxImages.length) {
      const windowHeight = window.innerHeight;
      parallaxImages.forEach(img => {
        const parent = img.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          const relativeCenter = (rect.top + rect.height / 2) - (windowHeight / 2);
          const drift = Math.max(-28, Math.min(28, relativeCenter * 0.08));
          img.style.transform = `translateY(${drift}px) scale(1.05)`;
        }
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation
  onScrollFrame();
}

/* ==========================================================================
   8. Custom Magnetic Cursor & Ambient Spotlight Glow
   ========================================================================== */
function initMagneticCursorAndSpotlight() {
  // A cursor that lerps after the pointer is the most disorienting motion on the
  // page for anyone with vestibular sensitivity — respect the OS setting first.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Disable completely on mobile touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  if (!hasFinePointer) return;

  const dot = document.getElementById('cursorDot');
  const follower = document.getElementById('cursorFollower');
  const label = document.getElementById('cursorLabel');
  if (!dot || !follower) return;

  let mouseX = -500;
  let mouseY = -500;
  let followerX = -500;
  let followerY = -500;
  let magneticTarget = null;
  let isHoveringCard = false;

  // Track global pointer move
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    wakeCursor();

    if (!document.body.classList.contains('has-cursor')) {
      document.body.classList.add('has-cursor');
    }

    // Update ambient spotlight CSS variables on documentElement
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
  }, { passive: true });

  // Update card relative coordinates for card border illumination
  const cards = document.querySelectorAll('.work-card, .work-featured-card, .service-item, .process-card, .about-stat-item');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    }, { passive: true });
  });

  // Attach magnetic snap and hover behaviors
  const magneticElements = document.querySelectorAll(
    'button, a, .pill-option, .menu-toggle, .service-header'
  );

  magneticElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      magneticTarget = el;
      follower.classList.add('is-hovering');
      wakeCursor();
    });

    el.addEventListener('mouseleave', () => {
      magneticTarget = null;
      follower.classList.remove('is-hovering');
      wakeCursor();
    });
  });

  // Work card hover: expand follower with "VIEW" badge
  const workCards = document.querySelectorAll('.work-card, .work-featured-card');
  workCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      isHoveringCard = true;
      follower.classList.add('is-card-hovering');
      wakeCursor();
      dot.classList.add('is-card-hovering');
      if (label) label.textContent = 'View';
    });

    card.addEventListener('mouseleave', () => {
      isHoveringCard = false;
      follower.classList.remove('is-card-hovering');
      wakeCursor();
      dot.classList.remove('is-card-hovering');
      if (label) label.textContent = '';
    });
  });

  // Mouse down / up click compression
  window.addEventListener('mousedown', () => {
    follower.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    follower.classList.remove('is-clicking');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-cursor');
  });

  // Smooth 60fps render loop with linear interpolation (lerp).
  // Parks itself once the follower catches up so an idle page costs no frames;
  // pointermove wakes it again. Same pattern as init3DCardTilt.
  let cursorRafId = null;

  function wakeCursor() {
    if (!cursorRafId) cursorRafId = requestAnimationFrame(renderCursor);
  }

  function renderCursor() {
    let targetX;
    let targetY;

    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      // Soft magnetic attraction
      const magnetStrength = 0.35;
      targetX = targetCenterX + (mouseX - targetCenterX) * magnetStrength;
      targetY = targetCenterY + (mouseY - targetCenterY) * magnetStrength;

      followerX += (targetX - followerX) * 0.22;
      followerY += (targetY - followerY) * 0.22;
    } else {
      // Normal smooth fluid follow
      const speed = isHoveringCard ? 0.22 : 0.18;
      targetX = mouseX;
      targetY = mouseY;
      followerX += (targetX - followerX) * speed;
      followerY += (targetY - followerY) * speed;
    }

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Park once the follower has caught its target — including a magnetic one,
    // so resting the pointer on a button costs nothing either.
    if (Math.abs(targetX - followerX) < 0.1 && Math.abs(targetY - followerY) < 0.1) {
      // Snap away the sub-pixel remainder so we resume from an exact position.
      followerX = targetX;
      followerY = targetY;
      cursorRafId = null;
    } else {
      cursorRafId = requestAnimationFrame(renderCursor);
    }
  }

  wakeCursor();
}

/* ==========================================================================
   9. Process Sticky Scroll Storytelling
   ========================================================================== */
function initProcessStorytelling() {
  const processCards = document.querySelectorAll('.process-card[data-process-step]');
  const trackItems = document.querySelectorAll('.process-track-item[data-step-target]');

  if (!processCards.length || !trackItems.length) return;

  function setActiveStep(stepId) {
    processCards.forEach(card => {
      if (card.getAttribute('data-process-step') === stepId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    trackItems.forEach(item => {
      if (item.getAttribute('data-step-target') === stepId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Click on tracker bullet to smoothly scroll to corresponding step
  trackItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = item.getAttribute('data-step-target');
      const targetCard = document.querySelector(`.process-card[data-process-step="${targetStep}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveStep(targetStep);
      }
    });
  });

  // IntersectionObserver to highlight current active step during scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -30% 0px',
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepId = entry.target.getAttribute('data-process-step');
        if (stepId) {
          setActiveStep(stepId);
        }
      }
    });
  }, observerOptions);

  processCards.forEach(card => observer.observe(card));
}

/* ==========================================================================
   10. 3D Perspective Tilt on Work Cards
   ========================================================================== */
function init3DCardTilt() {
  // Completely disable tilt on touch devices or reduced motion
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;

  if (isReducedMotion || !isFinePointer) return;

  const cards = document.querySelectorAll('.work-card, .work-featured-card');
  cards.forEach((card) => {
    const frame = card.querySelector('.mockup-frame');
    const glare = card.querySelector('.card-glare');
    if (!frame) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isHovered = false;
    let rafId = null;

    function animateTilt() {
      // Smooth lerp rotation for buttery 60fps tilt
      currentRotateX += (targetRotateX - currentRotateX) * 0.15;
      currentRotateY += (targetRotateY - currentRotateY) * 0.15;

      if (isHovered || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
        frame.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        rafId = requestAnimationFrame(animateTilt);
      } else {
        frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    card.addEventListener('pointerenter', () => {
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(animateTilt);
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normalizedX = (x / rect.width) * 2 - 1; // -1 to 1
      const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1

      // Max tilt angle 7.5 degrees
      const maxAngle = 7.5;
      targetRotateX = -normalizedY * maxAngle;
      targetRotateY = normalizedX * maxAngle;

      // Update glare reflection position
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.setProperty('--glare-x', `${glareX}%`);
        glare.style.setProperty('--glare-y', `${glareY}%`);
      }
    });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRotateX = 0;
      targetRotateY = 0;
      if (!rafId) rafId = requestAnimationFrame(animateTilt);
    });
  });
}


/* ==========================================================================
   11. Headline Word Reveal
   Each word rises out of its own clipped mask as the heading scrolls in — the
   same masked-line language the hero entrance already uses, extended down the
   page so the whole site reads as one motion system rather than a hero plus a
   collection of fades.

   Time-based cascade on entry rather than a scroll-scrubbed one: scrubbing a
   headline ties legibility to scroll speed, and a fast flick leaves words
   half-risen. The cascade always completes.
   ========================================================================== */
function initHeadlineWordReveal() {
  const headings = document.querySelectorAll('.section-title, [data-reveal-words]');
  if (!headings.length) return;

  // No masks at all under reduced motion — leave the markup untouched so the
  // text keeps its normal line wrapping and copy/paste behaviour.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const WORD = 'hw-word';
  const INNER = 'hw-word-inner';

  /** Wrap each word in its own mask, preserving <br> and inline markup. */
  function splitWords(heading) {
    let index = 0;

    const wrapTextNode = (node) => {
      const frag = document.createDocumentFragment();
      // Split on whitespace but keep the gaps, so spacing survives exactly.
      node.textContent.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        const mask = document.createElement('span');
        mask.className = WORD;
        mask.style.setProperty('--hw-i', String(index++));
        const inner = document.createElement('span');
        inner.className = INNER;
        inner.textContent = chunk;
        mask.appendChild(inner);
        frag.appendChild(mask);
      });
      return frag;
    };

    const walk = (parent) => {
      [...parent.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) parent.replaceChild(wrapTextNode(node), node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          walk(node);
        }
      });
    };

    walk(heading);
    heading.classList.add('hw-split');
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('hw-revealed');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

  headings.forEach((heading) => {
    if (heading.classList.contains('hw-split')) return;
    splitWords(heading);

    // Already on screen at load: reveal without waiting for a scroll that may
    // never come.
    if (heading.getBoundingClientRect().top < window.innerHeight * 0.9) {
      heading.classList.add('hw-revealed');
    } else {
      observer.observe(heading);
    }
  });
}
