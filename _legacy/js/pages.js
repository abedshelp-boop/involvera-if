/* =================================================
   INVOLVERA IF — pages.js
   Shared interactivity: cursor, nav, scroll reveals
   ================================================= */
(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────────── */
  var cursor     = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    var mx = -100, my = -100;
    var rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function trackRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(trackRing);
    })();

    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform     = 'translate(-50%, -50%) scale(2.5)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorRing.style.borderColor = 'rgba(46, 204, 64, 0.7)';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(46, 204, 64, 0.35)';
      });
    });
  }

  /* ── Nav Scroll Effect ─────────────────────────── */
  var nav = document.getElementById('page-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ── Scroll Reveal (Intersection Observer) ─────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stagger-reveal'
  ).forEach(function (el) {
    observer.observe(el);
  });

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

/* ─── INPUT HOVER CURSOR EFFECT ─────────────────────────── */
(function() {
  var cursor     = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursor-ring');
  if (!cursor || !cursorRing) return;
  document.querySelectorAll('input, textarea, select').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.style.transform     = 'translate(-50%, -50%) scale(0.3)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(2.2)';
      cursorRing.style.borderColor = '#2ECC40';
      cursorRing.style.borderWidth = '2px';
      cursorRing.style.background = 'rgba(46,204,64,0.08)';
    });
    el.addEventListener('mouseleave', function() {
      cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(46,204,64,0.35)';
      cursorRing.style.borderWidth = '1.5px';
      cursorRing.style.background = 'transparent';
    });
  });
})();
