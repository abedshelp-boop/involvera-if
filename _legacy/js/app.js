/* ═══════════════════════════════════════════════════════════
   INVOLVERA IF — app.js
   Video-to-website scroll animation engine
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── CONFIG ──────────────────────────────────────────── */
  const FRAME_COUNT = 121;
  const FRAME_SPEED = 2.0;
  const IMAGE_SCALE = 0.85;
  const FRAME_PATH  = "frames/frame_";

  /* ── ELEMENTS ────────────────────────────────────────── */
  const loader      = document.getElementById("loader");
  const loaderBar   = document.getElementById("loader-bar");
  const loaderCount = document.getElementById("loader-count");
  const canvas      = document.getElementById("canvas");
  const canvasWrap  = document.getElementById("canvas-wrap");
  const heroSection = document.getElementById("hero-section");
  const marqueeWrap = document.querySelector(".marquee-wrap");
  const ctx         = canvas.getContext("2d");

  /* ── STATE ───────────────────────────────────────────── */
  const frames     = new Array(FRAME_COUNT).fill(null);
  let loadedCount  = 0;
  let currentFrame = 0;

  /* ═══════════════════════════════════════════════════════
     CANVAS
  ═══════════════════════════════════════════════════════ */
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);
    drawFrame(currentFrame);
  }

  function drawFrame(index) {
    const img = frames[index];
    const cw  = window.innerWidth;
    const ch  = window.innerHeight;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cw, ch);

    if (!img || !img.complete) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
    const dw    = iw * scale;
    const dh    = ih * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  window.addEventListener("resize", resizeCanvas);

  /* ═══════════════════════════════════════════════════════
     PRELOADER — two-phase
  ═══════════════════════════════════════════════════════ */
  function loadFrame(i) {
    return new Promise((resolve) => {
      const img = new Image();
      const num = String(i + 1).padStart(4, "0");
      img.src = FRAME_PATH + num + ".webp";
      img.onload = img.onerror = () => {
        frames[i] = img;
        loadedCount++;
        const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
        loaderBar.style.width = pct + "%";
        loaderCount.textContent = loadedCount + " / " + FRAME_COUNT;
        resolve();
      };
    });
  }

  async function preloadFrames() {
    resizeCanvas();

    // Phase 1: first 10 frames
    const phase1 = [];
    for (let i = 0; i < 10; i++) phase1.push(loadFrame(i));
    await Promise.all(phase1);
    drawFrame(0);

    // Phase 2: remaining frames in background
    const phase2 = [];
    for (let i = 10; i < FRAME_COUNT; i++) phase2.push(loadFrame(i));
    await Promise.all(phase2);

    // Hide loader and boot
    loader.classList.add("hidden");
    setTimeout(initApp, 700);
  }

  /* ═══════════════════════════════════════════════════════
     APP INIT
  ═══════════════════════════════════════════════════════ */
  function initApp() {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    animateHeroEntrance();
    initCanvasScroll();
    initHeroReveal();
    initScrollSections();
    initMarquee();
  }

  /* ═══════════════════════════════════════════════════════
     HERO ENTRANCE — word-split stagger
  ═══════════════════════════════════════════════════════ */
  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-label", { opacity: 1, y: 0, duration: 0.65, delay: 0.15 });
    tl.to(".word",       { y: "0%", duration: 0.85, stagger: 0.1 }, "-=0.35");
    tl.to(".hero-tagline", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    tl.to(".hero-buttons", { opacity: 1, y: 0, duration: 0.6 }, "-=0.35");
  }

  /* ═══════════════════════════════════════════════════════
     CANVAS FRAME SCROLL
  ═══════════════════════════════════════════════════════ */
  function initCanvasScroll() {
    ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
        const index = Math.min(
          Math.floor(accelerated * FRAME_COUNT),
          FRAME_COUNT - 1
        );
        if (index !== currentFrame) {
          currentFrame = index;
          requestAnimationFrame(() => drawFrame(currentFrame));
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     CIRCLE-WIPE + HERO FADE
  ═══════════════════════════════════════════════════════ */
  function initHeroReveal() {
    ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Hero fades out
        if (heroSection) heroSection.style.opacity = Math.max(0, 1 - p * 15);

        // Opening circle (0% to 6% scroll): circle expands 0% → 75%
        // Middle (6% to 85% scroll): circle stays at 75% (fully open)
        // Closing circle (85% to 95% scroll): circle collapses 75% → 0%
        let radius;
        if (p < 0.01) {
          radius = 0;
        } else if (p < 0.07) {
          const openProgress = (p - 0.01) / 0.06;
          radius = openProgress * 75;
        } else if (p < 0.85) {
          radius = 75;
        } else if (p < 0.95) {
          const closeProgress = (p - 0.85) / 0.10;
          radius = 75 * (1 - closeProgress);
        } else {
          radius = 0;
        }
        canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     SCROLL SECTIONS — animation system
  ═══════════════════════════════════════════════════════ */
  function initScrollSections() {
    const sections = document.querySelectorAll(".scroll-section");

    ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress * 100; // 0–100

        sections.forEach((section) => {
          const enter  = parseFloat(section.dataset.enter);
          const leave  = parseFloat(section.dataset.leave);
          const anim   = section.dataset.animation;
          const persist = section.dataset.persist === "true";
          const window  = 2.5; // fade window in % points

          let t = 0; // 0=hidden, 1=fully visible

          if (p < enter - window) {
            t = 0;
          } else if (p >= enter - window && p < enter) {
            t = (p - (enter - window)) / window;
          } else if (p >= enter && (persist || p < leave)) {
            t = 1;
          } else if (!persist && p >= leave && p < leave + window) {
            t = 1 - (p - leave) / window;
          } else if (!persist && p >= leave + window) {
            t = 0;
          }

          // section visibility
          section.style.opacity  = t > 0 ? 1 : 0;
          section.style.pointerEvents = t > 0.9 ? "auto" : "none";

          if (t <= 0) return;

          animateChildren(section, anim, t);
        });
      }
    });
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  }

  function animateChildren(section, anim, progress) {
    const children = getAnimChildren(section, anim);
    if (!children.length) return;

    children.forEach((child, i) => {
      // stagger: each child lags slightly behind
      const staggerDelay = i * 0.12;
      const totalRange   = 1 - staggerDelay * 0.3;
      const childRaw     = totalRange > 0
        ? (progress - staggerDelay * 0.3) / totalRange
        : progress;
      const e = easeOut(Math.max(0, childRaw));

      switch (anim) {
        case "fade-up":
          child.style.opacity   = e;
          child.style.transform = `translateY(${(1 - e) * 40}px)`;
          break;
        case "slide-right":
          child.style.opacity   = e;
          child.style.transform = `translateX(${(1 - e) * -50}px)`;
          break;
        case "slide-left":
          child.style.opacity   = e;
          child.style.transform = `translateX(${(1 - e) * 50}px)`;
          break;
        case "scale-up":
          child.style.opacity   = e;
          child.style.transform = `scale(${0.82 + e * 0.18})`;
          child.style.transformOrigin = "left center";
          break;
        case "stagger-up":
          child.style.opacity   = e;
          child.style.transform = `translateY(${(1 - e) * 50}px)`;
          break;
        case "clip-reveal":
          child.style.clipPath = `inset(0 ${(1 - e) * 100}% 0 0)`;
          child.style.opacity  = 1;
          break;
        case "rotate-in":
          child.style.opacity   = e;
          child.style.transform = `rotate(${(1 - e) * -8}deg) translateY(${(1 - e) * 30}px)`;
          break;
        default:
          child.style.opacity = e;
      }
    });
  }

  function getAnimChildren(section, anim) {
    if (anim === "stagger-up") {
      return Array.from(section.querySelectorAll(".stat-item"));
    }
    if (anim === "clip-reveal") {
      const inner = section.querySelector(".cta-inner");
      return inner ? [inner] : [];
    }
    const inner = section.querySelector(".section-inner");
    if (inner) return Array.from(inner.children);
    return Array.from(section.children);
  }

  /* ═══════════════════════════════════════════════════════
     MARQUEE
  ═══════════════════════════════════════════════════════ */
  function initMarquee() {
    // Horizontal scroll-driven movement
    gsap.to(".marquee-text", {
      xPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    // Opacity driven by scroll progress
    ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        let opacity = 0;
        if (p >= 0.28 && p < 0.33) {
          opacity = (p - 0.28) / 0.05;
        } else if (p >= 0.33 && p < 0.82) {
          opacity = 1;
        } else if (p >= 0.82 && p < 0.87) {
          opacity = 1 - (p - 0.82) / 0.05;
        }
        marqueeWrap.style.opacity = opacity;
      }
    });
  }

  /* ── KICK OFF ────────────────────────────────────────── */
  preloadFrames();

})();

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
(function() {
  var cursor     = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursor-ring');
  if (!cursor || !cursorRing) return;
  var rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e) {
    var mx = e.clientX, my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  });
  document.querySelectorAll('a, button, [onclick]').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.style.transform     = 'translate(-50%, -50%) scale(2.5)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorRing.style.borderColor = 'rgba(46, 204, 64, 0.7)';
    });
    el.addEventListener('mouseleave', function() {
      cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(46, 204, 64, 0.35)';
    });
  });
  // Smooth ring follow
  function animateRing() {
    rx += (parseFloat(cursor.style.left||0) - rx) * 0.12;
    ry += (parseFloat(cursor.style.top||0)  - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

/* ─── BURGER MENU ────────────────────────────────────────── */
(function() {
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', function() {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      burger.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();
