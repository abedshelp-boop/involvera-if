"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import Lenis from "lenis";

/* ── CONFIG ────────────────────────────────────── */
const FRAME_COUNT = 121;
const FRAME_SPEED = 2.0;
const IMAGE_SCALE = 0.85;

/* ── SCROLL SECTIONS DATA ──────────────────────── */
const sections = [
  {
    id: "fotboll",
    label: "001 / FOTBOLL",
    heading: "Träna.\nTävla.\nVäxa.",
    body: "Regelbunden träning, turneringar och aktiviteter som bygger laganda, kondition och disciplin.",
    align: "left" as const,
    animation: "fade-up" as const,
  },
  {
    id: "parasport",
    label: "002 / PARASPORT",
    heading: "Sport För Alla\nKroppar.",
    body: "Parasport är idrott anpassad för personer med funktionsnedsättning. Genom vårt partnerskap med Mitt speciella barn erbjuder vi anpassade aktiviteter för barn och unga.",
    align: "right" as const,
    animation: "slide-right" as const,
  },
  {
    id: "calisthenics",
    label: "003 / CALISTHENICS",
    heading: "Styrka Utan\nGränser.",
    body: "Utomhusträning med kroppsvikt. Pull & Dip. Bygg styrka, uthållighet och mental toughness.",
    align: "left" as const,
    animation: "slide-left" as const,
  },
  {
    id: "om-oss",
    label: "004 / OM OSS",
    heading: "Vår\nMission.",
    body: "Vårt syfte är att engagera och vägleda ungdomar mot idrott och en positiv miljö. Vi skapar en trygg, aktiv och utvecklande miljö för unga, oavsett bakgrund eller fysiska förutsättningar.",
    align: "left" as const,
    animation: "scale-up" as const,
  },
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const currentFrameRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadCount, setLoadCount] = useState(0);

  /* ── Draw Frame ──────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = framesRef.current[index];
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cw, ch);

    if (!img || !img.complete) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /* ── Resize Canvas ───────────────────────────── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  /* ── Preload Frames ──────────────────────────── */
  useEffect(() => {
    let count = 0;

    const loadFrame = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const num = String(i + 1).padStart(4, "0");
        img.src = `/frames/frame_${num}.webp`;
        img.onload = img.onerror = () => {
          framesRef.current[i] = img;
          count++;
          setLoadCount(count);
          setLoadProgress(Math.round((count / FRAME_COUNT) * 100));
          resolve();
        };
      });
    };

    const preload = async () => {
      resizeCanvas();

      // Phase 1: first 10 frames
      const phase1 = [];
      for (let i = 0; i < 10; i++) phase1.push(loadFrame(i));
      await Promise.all(phase1);
      drawFrame(0);

      // Phase 2: remaining
      const phase2 = [];
      for (let i = 10; i < FRAME_COUNT; i++) phase2.push(loadFrame(i));
      await Promise.all(phase2);

      setTimeout(() => setLoaded(true), 700);
    };

    preload();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas, drawFrame]);

  /* ── GSAP + Lenis Init ───────────────────────── */
  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Hero entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-label", { opacity: 1, y: 0, duration: 0.65, delay: 0.15 });
    tl.to(".word", { y: "0%", duration: 0.85, stagger: 0.1 }, "-=0.35");
    tl.to(".hero-tagline", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    tl.to(".hero-buttons", { opacity: 1, y: 0, duration: 0.6 }, "-=0.35");

    // Canvas frame scroll + circle wipe + hero fade
    const container = scrollContainerRef.current;
    if (container) {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Frame scrubber
          const accelerated = Math.min(p * FRAME_SPEED, 1);
          const index = Math.min(
            Math.floor(accelerated * FRAME_COUNT),
            FRAME_COUNT - 1
          );
          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            requestAnimationFrame(() => drawFrame(currentFrameRef.current));
          }

          // Hero fades out
          if (heroRef.current) {
            heroRef.current.style.opacity = String(Math.max(0, 1 - p * 15));
          }

          // Circle wipe
          let radius: number;
          if (p < 0.01) radius = 0;
          else if (p < 0.07) radius = ((p - 0.01) / 0.06) * 75;
          else if (p < 0.85) radius = 75;
          else if (p < 0.95) radius = 75 * (1 - (p - 0.85) / 0.1);
          else radius = 0;

          if (canvasWrapRef.current) {
            canvasWrapRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;
          }

          // Marquee opacity
          if (marqueeRef.current) {
            let opacity = 0;
            if (p >= 0.28 && p < 0.33) opacity = (p - 0.28) / 0.05;
            else if (p >= 0.33 && p < 0.82) opacity = 1;
            else if (p >= 0.82 && p < 0.87) opacity = 1 - (p - 0.82) / 0.05;
            marqueeRef.current.style.opacity = String(opacity);
          }
        },
      });

      // Marquee horizontal scroll
      gsap.to(".marquee-text", {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

    // Pin each scroll section
    sectionRefs.current.forEach((section, i) => {
      if (!section) return;
      const inner = section.querySelector(".section-inner");
      if (!inner) return;

      const animChildren = Array.from(inner.children) as HTMLElement[];
      const anim = sections[i].animation;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          section.style.pointerEvents =
            progress > 0.1 && progress < 0.9 ? "auto" : "none";

          animChildren.forEach((child, ci) => {
            const staggerDelay = ci * 0.12;
            const totalRange = 1 - staggerDelay * 0.3;
            const childRaw =
              totalRange > 0
                ? (progress - staggerDelay * 0.3) / totalRange
                : progress;
            const e = easeOut(Math.max(0, childRaw));

            switch (anim) {
              case "fade-up":
                child.style.opacity = String(e);
                child.style.transform = `translateY(${(1 - e) * 40}px)`;
                break;
              case "slide-right":
                child.style.opacity = String(e);
                child.style.transform = `translateX(${(1 - e) * -50}px)`;
                break;
              case "slide-left":
                child.style.opacity = String(e);
                child.style.transform = `translateX(${(1 - e) * 50}px)`;
                break;
              case "scale-up":
                child.style.opacity = String(e);
                child.style.transform = `scale(${0.82 + e * 0.18})`;
                child.style.transformOrigin = "left center";
                break;
            }
          });
        },
      });
    });

    // CTA section pin
    if (ctaRef.current) {
      const ctaInner = ctaRef.current.querySelector(
        ".cta-inner"
      ) as HTMLElement;
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top top",
        end: "+=80%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          if (ctaInner) {
            const e = easeOut(self.progress);
            ctaInner.style.clipPath = `inset(0 ${(1 - e) * 100}% 0 0)`;
            ctaInner.style.opacity = "1";
          }
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, [loaded, drawFrame]);

  return (
    <>
      {/* LOADER */}
      <div
        id="loader"
        className={loaded ? "hidden" : ""}
        aria-hidden="true"
      >
        <div className="loader-brand">
          INVOLVERA<span>&nbsp;IF</span>
        </div>
        <div className="loader-progress-wrap">
          <div id="loader-bar" style={{ width: `${loadProgress}%` }} />
        </div>
        <div className="loader-count">
          {loadCount} / {FRAME_COUNT}
        </div>
      </div>

      {/* HERO */}
      <section
        className="hero-standalone"
        id="hero-section"
        ref={heroRef}
        aria-label="Hero"
      >
        <div className="hero-content">
          <p className="hero-label">INVOLVERA IF</p>
          <h1 className="hero-heading">
            <div className="word-line">
              <span className="word-wrap">
                <span className="word">IDROTT</span>
              </span>
            </div>
            <div className="word-line">
              <span className="word-wrap accent-word">
                <span className="word">FÖR</span>
              </span>{" "}
              <span className="word-wrap accent-word">
                <span className="word">ALLA</span>
              </span>
            </div>
          </h1>
          <p className="hero-tagline">
            En inkluderande idrottsförening i Helsingborg
          </p>
          <div className="hero-buttons">
            <Link href="/kontakt" className="btn btn-primary">
              Bli Medlem
            </Link>
            <Link href="/om-oss" className="btn btn-outline">
              Läs Mer
            </Link>
          </div>
        </div>

        <div className="scroll-arrow" aria-hidden="true">
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="22"
              height="34"
              rx="11"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle
              className="scroll-dot"
              cx="12"
              cy="10"
              r="3"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* CANVAS */}
      <div className="canvas-wrap" ref={canvasWrapRef}>
        <canvas id="home-canvas" ref={canvasRef} />
      </div>

      {/* MARQUEE */}
      <div className="marquee-wrap" ref={marqueeRef} aria-hidden="true">
        <div className="marquee-text">
          FOTBOLL&nbsp;&bull;&nbsp;PARASPORT&nbsp;&bull;&nbsp;CALISTHENICS&nbsp;&bull;&nbsp;INTEGRATION&nbsp;&bull;&nbsp;HELSINGBORG&nbsp;&bull;&nbsp;FOTBOLL&nbsp;&bull;&nbsp;PARASPORT&nbsp;&bull;&nbsp;CALISTHENICS&nbsp;&bull;&nbsp;INTEGRATION&nbsp;&bull;&nbsp;HELSINGBORG&nbsp;&bull;&nbsp;FOTBOLL&nbsp;&bull;&nbsp;PARASPORT&nbsp;&bull;&nbsp;CALISTHENICS&nbsp;&bull;&nbsp;INTEGRATION&nbsp;&bull;&nbsp;HELSINGBORG&nbsp;&bull;
        </div>
      </div>

      {/* SCROLL CONTAINER */}
      <div id="scroll-container" ref={scrollContainerRef}>
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={`scroll-section align-${s.align}`}
            data-animation={s.animation}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          >
            <div className="section-inner">
              <p className="section-label">{s.label}</p>
              <h2 className="section-heading">
                {s.heading.split("\n").map((line, li) => (
                  <span key={li}>
                    {line}
                    {li < s.heading.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="section-body">{s.body}</p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div
          className="scroll-section cta-section"
          data-animation="clip-reveal"
          ref={ctaRef}
        >
          <div className="cta-inner">
            <h2 className="cta-heading">
              REDO ATT
              <br />
              GÅ MED?
            </h2>
            <p className="cta-sub">Bli en del av Involvera IF idag.</p>
            <Link href="/kontakt" className="btn btn-primary btn-large">
              Kontakta Oss
            </Link>
            <div className="cta-contacts">
              <span>kontakt@involvera.se</span>
              <span className="cta-sep">|</span>
              <span>070-713 05 08</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}
