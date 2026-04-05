/* ==============================================
   INVOLVERA IF — main.js
   Lenis smooth scroll + GSAP ScrollTrigger
   ============================================== */

/* ── Register GSAP plugins ──────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   LENIS SMOOTH SCROLL — MANDATORY
   ────────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ──────────────────────────────────────────────
   LOADER
   ────────────────────────────────────────────── */
const loader = document.getElementById('loader');

if (loader) {
  const wordmark = loader.querySelector('.loader-wordmark');
  const bar      = loader.querySelector('.loader-bar');

  const loaderTl = gsap.timeline({
    onComplete: () => {
      loader.style.pointerEvents = 'none';
      initAnimations();
    }
  });

  loaderTl
    .to(wordmark, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
    .to(bar,      { width: '100%', duration: 1.1, ease: 'power2.inOut' }, 0.25)
    .to(loader,   { opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.6)
    .set(loader,  { display: 'none' });

  gsap.set(wordmark, { opacity: 0, y: 12 });
} else {
  // No loader on inner pages — init immediately
  initAnimations();
}

/* ──────────────────────────────────────────────
   NAV SCROLL EFFECT
   ────────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  ScrollTrigger.create({
    start: '100px top',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
}

/* ──────────────────────────────────────────────
   MAIN ANIMATION INIT
   ────────────────────────────────────────────── */
function initAnimations() {
  initHero();
  initPinSection();
  initMarquee();
  initStats();
  initRevealAnimations();
  initScrollHint();
}

/* ──────────────────────────────────────────────
   HERO — circle-wipe image + staggered text
   ────────────────────────────────────────────── */
function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const lines    = hero.querySelectorAll('.line-wrap .line');
  const tagline  = hero.querySelector('.hero-tagline');
  const ctaBtns  = hero.querySelectorAll('.hero-cta .btn');
  const eyebrow  = hero.querySelector('.hero-eyebrow');
  const heroImg  = hero.querySelector('.hero-img-wrap img');
  const hint     = hero.querySelector('.scroll-hint');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Image — clip-path circle-wipe from bottom centre
  if (heroImg) {
    gsap.set(heroImg, { clipPath: 'circle(0% at 70% 100%)' });
    tl.to(heroImg, {
      clipPath: 'circle(120% at 70% 100%)',
      duration: 1.3,
      ease: 'power4.inOut'
    }, 0);
  }

  // Eyebrow label
  if (eyebrow) {
    gsap.set(eyebrow, { opacity: 0, y: 16 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
  }

  // Lines — slide up from overflow:hidden wrapper
  if (lines.length) {
    gsap.set(lines, { y: '110%' });
    tl.to(lines, {
      y: '0%',
      duration: 1.0,
      stagger: 0.12,
    }, 0.3);
  }

  // Tagline
  if (tagline) {
    gsap.set(tagline, { opacity: 0, y: 24 });
    tl.to(tagline, { opacity: 1, y: 0, duration: 0.7 }, 0.8);
  }

  // CTA buttons
  if (ctaBtns.length) {
    gsap.set(ctaBtns, { opacity: 0, y: 18 });
    tl.to(ctaBtns, {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.1
    }, 0.95);
  }

  // Scroll hint fades in last
  if (hint) {
    tl.to(hint, { opacity: 1, duration: 0.6 }, 1.4);
  }
}

/* ──────────────────────────────────────────────
   SCROLL HINT ANIMATION
   ────────────────────────────────────────────── */
function initScrollHint() {
  // Hide on scroll past hero
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return;

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80%',
    onEnter:     () => gsap.to(hint, { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to(hint, { opacity: 1, duration: 0.4 }),
  });
}

/* ──────────────────────────────────────────────
   PIN SECTION — 3-image crossfade + text blocks
   ────────────────────────────────────────────── */
function initPinSection() {
  const pin = document.querySelector('.pin-section');
  if (!pin) return;

  const img1 = pin.querySelector('.simg-1');
  const img2 = pin.querySelector('.simg-2');
  const img3 = pin.querySelector('.simg-3');
  const tb1  = pin.querySelector('.tb-1');
  const tb2  = pin.querySelector('.tb-2');
  const tb3  = pin.querySelector('.tb-3');

  if (!img1 || !img2 || !img3 || !tb1) return;

  // ── Initial states ──────────────────────────
  gsap.set([img2, img3], { opacity: 0 });
  gsap.set([tb2, tb3],   { opacity: 0 });
  gsap.set(tb1,          { opacity: 1 });

  // ── Pinned timeline ─────────────────────────
  // Timeline runs 0 → 3 units  →  mapped to 300vh of scroll
  // Phase boundaries: 1.0 (33%)  and  2.0 (66%)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:      pin,
      start:        'top top',
      end:          '+=300vh',
      pin:          true,
      scrub:        0.8,
      anticipatePin: 1,
    },
    defaults: { ease: 'none' }
  });

  tl
    // ── Phase 1 → 2 (transition near t=1) ──────
    .to(tb1,  { opacity: 0, y: -28, duration: 0.3 }, 0.85)
    .to(img1, { opacity: 0, duration: 0.4 },         0.85)
    .to(img2, { opacity: 1, duration: 0.45 },        0.95)
    .fromTo(tb2,
      { opacity: 0, x: -55 },
      { opacity: 1, x: 0, duration: 0.4 },
      1.05
    )

    // ── Phase 2 → 3 (transition near t=2) ──────
    .to(tb2,  { opacity: 0, y: -28, duration: 0.3 }, 1.85)
    .to(img2, { opacity: 0, duration: 0.4 },         1.85)
    .to(img3, { opacity: 1, duration: 0.45 },        1.95)
    .fromTo(tb3,
      { opacity: 0, x: 55 },
      { opacity: 1, x: 0, duration: 0.4 },
      2.05
    )

    // ── Pad timeline to exactly 3 units ─────────
    .to({}, {}, 3.0);
}

/* ──────────────────────────────────────────────
   MARQUEE — scroll-driven horizontal move
   ────────────────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate content so it wraps seamlessly
  const originalWidth = track.scrollWidth;

  gsap.to(track, {
    x: () => -(originalWidth / 2),
    ease: 'none',
    scrollTrigger: {
      trigger: '.marquee-section',
      start:   'top bottom',
      end:     'bottom top',
      scrub:   1.2,
    }
  });
}

/* ──────────────────────────────────────────────
   STATS COUNTERS
   ────────────────────────────────────────────── */
function initStats() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  // Stagger-in the whole section header
  const header = statsSection.querySelector('.stats-header');
  if (header) {
    gsap.from(header, {
      opacity: 0, x: -50, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 88%', once: true }
    });
  }

  // Counter + slide-in per stat item
  const items = statsSection.querySelectorAll('.stat-item');
  items.forEach((item, i) => {
    const counterEl = item.querySelector('.counter-val');
    const target    = counterEl ? parseInt(counterEl.dataset.target, 10) : 0;

    gsap.from(item, {
      opacity: 0, y: 50, duration: 0.8, ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: { trigger: item, start: 'top 88%', once: true }
    });

    if (counterEl && !isNaN(target)) {
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        onUpdate() {
          counterEl.textContent = Math.round(proxy.val).toLocaleString('sv-SE');
        }
      });
    }
  });
}

/* ──────────────────────────────────────────────
   GENERAL REVEAL ANIMATIONS
   5 types: fade-up, slide-left, slide-right, scale-up, clip-reveal
   ────────────────────────────────────────────── */
function initRevealAnimations() {

  // ── fade up ──
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.from(el, {
      y: 55, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ── slide from left ──
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.from(el, {
      x: -75, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ── slide from right ──
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.from(el, {
      x: 75, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ── scale up ──
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.from(el, {
      scale: 0.86, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ── clip reveal (horizontal wipe) ──
  gsap.utils.toArray('.reveal-clip').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.15, ease: 'power4.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ── stagger groups — label → heading → body → cta ──
  gsap.utils.toArray('.stagger-group').forEach(group => {
    const children = Array.from(group.children);
    gsap.from(children, {
      y: 38, opacity: 0,
      duration: 0.75,
      stagger: 0.13,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 86%', once: true }
    });
  });

  // ── partner badges stagger ──
  const partnersRow = document.querySelector('.partners-row');
  if (partnersRow) {
    gsap.from(partnersRow.querySelectorAll('.partner-badge'), {
      opacity: 0, y: 24, scale: 0.95,
      duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: partnersRow, start: 'top 88%', once: true }
    });
  }

  // ── CTA title dramatic scale ──
  const ctaTitle = document.querySelector('.cta-title');
  if (ctaTitle) {
    gsap.from(ctaTitle, {
      scale: 0.7, opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: ctaTitle, start: 'top 85%', once: true }
    });
  }

  // ── value items stagger ──
  const valuesGrid = document.querySelector('.values-grid');
  if (valuesGrid) {
    gsap.from(valuesGrid.querySelectorAll('.value-item'), {
      opacity: 0, y: 40, duration: 0.75, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: valuesGrid, start: 'top 85%', once: true }
    });
  }

  // ── activity blocks alternate directions ──
  document.querySelectorAll('.activity-block').forEach((block, i) => {
    const dir = i % 2 === 0 ? -60 : 60;
    const text   = block.querySelector('.act-text');
    const visual = block.querySelector('.act-visual');
    if (text) {
      gsap.from(text, {
        x: dir, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 85%', once: true }
      });
    }
    if (visual) {
      gsap.from(visual, {
        x: -dir, opacity: 0, scale: 0.94, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 85%', once: true }
      });
    }
  });

  // ── contact form fields stagger ──
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    gsap.from(contactForm.querySelectorAll('.form-field, .form-row'), {
      opacity: 0, y: 25, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: contactForm, start: 'top 85%', once: true }
    });
  }
}
