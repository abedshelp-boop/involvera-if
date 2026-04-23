"use client";

import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import Lenis from "lenis";
import BorderGlowButton from "@/components/ui/BorderGlowButton";
import BorderGlowCard from "@/components/ui/BorderGlowCard";

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

/* ── SPORT CARD DATA ────────────────────────────── */
const sportCards = [
  { icon: "⚽", label: "Fotboll", href: "/aktiviteter" },
  { icon: "♿", label: "Parasport", href: "/aktiviteter" },
  { icon: "💪", label: "Calisthenics", href: "/aktiviteter" },
];

/* ── MOSAIC SLOTS ───────────────────────────────── */
/* 12 surrounding slots (center is feature card with overlay, no image).
   Image numbers chosen so no duplicate sits adjacent. */
const mosaicSlots: { cls: string; img: number }[] = [
  { cls: "mosaic-r1-1", img: 1 },
  { cls: "mosaic-r1-2", img: 2 },
  { cls: "mosaic-r1-3", img: 3 },
  { cls: "mosaic-r1-4", img: 4 },
  { cls: "mosaic-r1-5", img: 5 },
  { cls: "mosaic-r2-1", img: 6 },
  { cls: "mosaic-r2-3", img: 7 },
  { cls: "mosaic-r3-1", img: 1 },
  { cls: "mosaic-r3-2", img: 3 },
  { cls: "mosaic-r3-3", img: 5 },
  { cls: "mosaic-r3-4", img: 2 },
  { cls: "mosaic-r3-5", img: 4 },
];

/* ── FAQ DATA ──────────────────────────────────── */
const faqItems = [
  {
    question: "Hur blir jag medlem i Involvera IF?",
    answer:
      "Du kan bli medlem genom att fylla i kontaktformuläret på vår hemsida eller kontakta oss direkt via e-post eller telefon. Vi välkomnar alla oavsett ålder, bakgrund eller erfarenhet.",
  },
  {
    question: "Vilka tider och dagar tränar vi?",
    answer:
      "Vi har träningar flera gånger i veckan. Fotboll: tisdagar och torsdagar kl 17–19. Calisthenics: måndagar och onsdagar kl 16–18. Parasport: lördagar kl 10–12. Kontakta oss för aktuellt schema.",
  },
  {
    question: "Var ligger våra träningsplaner och lokaler?",
    answer:
      "Vi tränar på flera platser i Helsingborg. Fotbollsträningarna sker på Olympia IP och våra calisthenics-pass hålls i utomhusparken vid Pålsjö. Kontakta oss för exakt adress och vägbeskrivning.",
  },
  {
    question: "Kostar det något att vara med?",
    answer:
      "Vi håller våra avgifter så låga som möjligt för att alla ska kunna delta. Medlemsavgiften är 200 kr per termin. Vi erbjuder även möjlighet till reducerad avgift vid behov — ingen ska behöva stå utanför.",
  },
  {
    question: "Behöver jag ha erfarenhet för att börja?",
    answer:
      "Absolut inte! Alla är välkomna oavsett nivå. Våra tränare anpassar övningarna efter varje deltagares förutsättningar. Det viktigaste är att du vill röra på dig och ha kul.",
  },
  {
    question: "Hur kan jag engagera mig som volontär eller tränare?",
    answer:
      "Vi söker alltid engagerade personer som vill bidra. Kontakta oss via kontakt@involvera.se eller ring 070-713 05 08 så berättar vi mer om hur du kan hjälpa till.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const homeCTARef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const signupRef = useRef<HTMLElement>(null);

  /* ── FAQ accordion ──────────────────────────────── */
  const [openFaq, setOpenFaq] = useState(0);
  const toggleFaq = useCallback((i: number) => {
    setOpenFaq((prev) => (prev === i ? -1 : i));
  }, []);

  /* ── Event signup form ─────────────────────────── */
  const [signupStatus, setSignupStatus] = useState("");
  const [signupStatusColor, setSignupStatusColor] = useState("var(--green)");
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const eventSignup = useMutation(api.eventSignups.signup);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("signup-name") as string).trim();
    const email = (formData.get("signup-email") as string).trim();
    const phone = (formData.get("signup-phone") as string).trim();
    const ageStr = (formData.get("signup-age") as string).trim();
    const age = parseInt(ageStr, 10);

    if (!name || !email || !phone || !ageStr) {
      setSignupStatus("Fyll i alla fält.");
      setSignupStatusColor("#ff5555");
      return;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      setSignupStatus("Ange en giltig ålder.");
      setSignupStatusColor("#ff5555");
      return;
    }

    setSignupSubmitting(true);
    setSignupStatus("");
    try {
      await eventSignup({ name, email, phone, age });
      form.reset();
      setSignupStatusColor("var(--green)");
      setSignupStatus("Anmälan skickad!");
      setTimeout(() => setSignupStatus(""), 4500);
    } catch {
      setSignupStatusColor("#ff5555");
      setSignupStatus("Något gick fel. Försök igen.");
    } finally {
      setSignupSubmitting(false);
    }
  };

  /* ── GSAP + Lenis Init ───────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Hero entrance animation */
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-label", { opacity: 1, y: 0, duration: 0.65, delay: 0.15 });
    tl.to(".word", { y: "0%", duration: 0.85, stagger: 0.1 }, "-=0.35");
    tl.to(".hero-tagline", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    tl.to(".hero-image-wrap", { opacity: 1, x: 0, duration: 0.9 }, "-=0.7");
    tl.to(".hero-card", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    tl.to(".hero-members", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    tl.to(".hero-watermark", { opacity: 1, scale: 1, duration: 0.8 }, "-=0.6");

    /* Scroll-driven animations */
    const container = scrollContainerRef.current;
    if (container) {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Hero fades out
          if (heroRef.current) {
            heroRef.current.style.opacity = String(Math.max(0, 1 - p * 15));
          }

          // Marquee opacity — only visible while sections are on screen
          if (marqueeRef.current) {
            let opacity = 0;
            if (p >= 0.05 && p < 0.10) opacity = (p - 0.05) / 0.05;
            else if (p >= 0.10 && p < 0.50) opacity = 1;
            else if (p >= 0.50 && p < 0.55) opacity = 1 - (p - 0.50) / 0.05;
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
        end: "+=150%",
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

    // Mosaic entrance animation — pinned + scroll-scrubbed reveal
    if (mosaicRef.current) {
      const mosaicItems = Array.from(
        mosaicRef.current.querySelectorAll<HTMLElement>(".mosaic-item")
      );
      gsap.set(mosaicItems, { opacity: 0, y: 60, filter: "blur(8px)" });

      ScrollTrigger.create({
        trigger: mosaicRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const count = mosaicItems.length;
          const spread = 0.75;
          const span = 0.35;
          mosaicItems.forEach((item, i) => {
            const staggerDelay =
              count > 1 ? (i / (count - 1)) * spread : 0;
            const raw = (progress - staggerDelay) / span;
            const e = easeOut(Math.max(0, Math.min(1, raw)));
            item.style.opacity = String(e);
            item.style.transform = `translateY(${(1 - e) * 60}px)`;
            item.style.filter = `blur(${(1 - e) * 8}px)`;
          });
        },
      });
    }

    // Home CTA fade-in
    if (homeCTARef.current) {
      const ctaChildren = Array.from(
        homeCTARef.current.children
      ) as HTMLElement[];
      ScrollTrigger.create({
        trigger: homeCTARef.current,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
        onUpdate: (self) => {
          ctaChildren.forEach((child, ci) => {
            const stagger = ci * 0.15;
            const raw = Math.max(0, (self.progress - stagger) / (1 - stagger));
            const e = easeOut(raw);
            child.style.opacity = String(e);
            child.style.transform = `translateY(${(1 - e) * 40}px)`;
          });
        },
      });
    }

    // FAQ staggered entrance
    if (faqRef.current) {
      const faqHeader = faqRef.current.querySelector(".faq-header");
      const faqItemEls = faqRef.current.querySelectorAll(".faq-item");

      ScrollTrigger.create({
        trigger: faqRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(faqHeader, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
          gsap.to(faqItemEls, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.2,
          });
        },
      });
    }

    // Event signup entrance
    if (signupRef.current) {
      const signupChildren = signupRef.current.querySelectorAll(
        ".event-signup-section > div > *"
      );

      ScrollTrigger.create({
        trigger: signupRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(signupChildren, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        className="hero-standalone"
        id="hero-section"
        ref={heroRef}
        aria-label="Hero"
      >
        {/* Watermark brand text behind everything */}
        <div className="hero-watermark" aria-hidden="true">
          INVOLVERA
        </div>

        {/* Left: text content */}
        <div className="hero-content">
          <p className="hero-label">Involvera IF</p>
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
              <span className="word-wrap">
                <span className="word hero-period">.</span>
              </span>
            </div>
          </h1>
          <p className="hero-tagline">
            En inkluderande idrottsförening i Helsingborg
          </p>
        </div>

        {/* Right: hero image */}
        <div className="hero-image-wrap">
          <div
            className="hero-image-placeholder"
            style={{
              backgroundImage: "url('/involvera-images/5.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="hero-image-overlay" />
        </div>

        {/* Bottom-left: sport card widget */}
        <div className="hero-card">
          <p className="hero-card-label">Involvera IF</p>
          <p className="hero-card-question">Vilken sport passar dig?</p>
          <div className="hero-card-pills">
            {sportCards.map((s) => (
              <Link key={s.label} href={s.href} className="hero-card-pill">
                <span className="hero-card-pill-icon">{s.icon}</span>
                {s.label}
              </Link>
            ))}
          </div>
          <Link href="/aktiviteter" className="hero-card-link">
            Utforska →
          </Link>
        </div>

        {/* Bottom-right: member badge */}
        <div className="hero-members">
          <div className="hero-members-avatars">
            <div className="hero-avatar" style={{ background: "#2ECC40" }} />
            <div className="hero-avatar" style={{ background: "#27ae32" }} />
            <div className="hero-avatar" style={{ background: "#1a8a25" }} />
          </div>
          <div className="hero-members-text">
            <span className="hero-members-count">200+</span>
            <span className="hero-members-label">Medlemmar</span>
          </div>
        </div>

        {/* Scroll indicator */}
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

        {/* MOSAIC COMMUNITY GRID */}
        <section className="mosaic-section" ref={mosaicRef}>
          <div className="mosaic-container">
            <div className="mosaic-grid">
              {mosaicSlots.slice(0, 6).map(({ cls, img }) => (
                <BorderGlowCard key={cls} className={`mosaic-item ${cls}`}>
                  <div
                    className="mosaic-img"
                    style={{
                      backgroundImage: `url('/involvera-images/${img}.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </BorderGlowCard>
              ))}

              {/* Center feature card — stays imageless, holds the overlay text */}
              <BorderGlowCard className="mosaic-item mosaic-feature">
                <div className="mosaic-img" />
                <div className="mosaic-feature-overlay">
                  <span className="mosaic-feature-text">GÅ MED I LAGET</span>
                </div>
              </BorderGlowCard>

              {mosaicSlots.slice(6).map(({ cls, img }) => (
                <BorderGlowCard key={cls} className={`mosaic-item ${cls}`}>
                  <div
                    className="mosaic-img"
                    style={{
                      backgroundImage: `url('/involvera-images/${img}.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </BorderGlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta" ref={homeCTARef}>
          <h2 className="home-cta-heading">
            REDO ATT
            <br />
            GÅ MED?
          </h2>
          <p className="home-cta-sub">Bli en del av Involvera IF idag.</p>
          <BorderGlowButton variant="primary" size="large" href="/kontakt">
            Kontakta Oss
          </BorderGlowButton>
          <div className="home-cta-contacts">
            <span>kontakt@involvera.se</span>
            <span className="home-cta-sep">|</span>
            <span>070-713 05 08</span>
          </div>
        </section>
      </div>

      {/* WhatsApp Group CTA Section */}
      <section className="whatsapp-section" aria-label="Gå med i vår WhatsApp-grupp">
        <div className="whatsapp-card">
          <div className="whatsapp-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.003 2.667C8.641 2.667 2.67 8.638 2.67 16c0 2.352.62 4.642 1.798 6.667L2.667 29.333l6.833-1.78A13.29 13.29 0 0 0 16 29.333h.003c7.362 0 13.333-5.971 13.333-13.333S23.365 2.667 16.003 2.667Zm0 24A10.63 10.63 0 0 1 10.5 25.12l-.395-.237-4.057 1.057 1.082-3.952-.258-.407A10.66 10.66 0 1 1 16.003 26.667Zm5.837-7.99c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.951-.849-1.592-1.895-1.779-2.215-.187-.32-.02-.493.14-.653.144-.144.32-.374.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.624-.524-.539-.72-.549l-.613-.011a1.17 1.17 0 0 0-.853.4c-.294.32-1.12 1.094-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.764.33 1.36.527 1.825.675.767.244 1.466.21 2.019.128.616-.092 1.893-.774 2.159-1.521.267-.747.267-1.387.187-1.52-.08-.133-.294-.213-.614-.373Z"/>
            </svg>
          </div>
          <div className="whatsapp-copy">
            <span className="whatsapp-eyebrow">Gemenskap</span>
            <h2 className="whatsapp-heading">GÅ MED I VÅR<br/>WHATSAPP-GRUPP</h2>
            <p className="whatsapp-body">
              Där listar vi alla sporter vi erbjuder. Gå med, välj vad du vill prova, och träffa andra som tränar med oss.
            </p>
          </div>
          {/* TODO: replace href="#" with real WhatsApp invite URL (chat.whatsapp.com/...) */}
          <a
            href="#"
            className="whatsapp-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gå med
            <span className="whatsapp-cta-arrow">→</span>
          </a>
        </div>
      </section>

      {/* Event Signup Section */}
      <section
        className="event-signup-section"
        ref={signupRef}
        style={{
          padding: "6rem 8vw",
          background: "var(--black)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--green)",
            marginBottom: "1.5rem",
            display: "block",
          }}>
            Kommande evenemang
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.92,
            color: "var(--white)",
            marginBottom: "1.2rem",
          }}>
            ANMÄL DIG
          </h2>
          <p style={{
            fontSize: "clamp(0.85rem, 1vw, 1rem)",
            fontWeight: 300,
            color: "var(--dim)",
            marginBottom: "3rem",
            lineHeight: 1.8,
          }}>
            Anmäl dig till våra kommande aktiviteter och evenemang.
            Fyll i formuläret så kontaktar vi dig med mer information.
          </p>

          <form className="contact-form" onSubmit={handleSignup} noValidate style={{ textAlign: "left" }}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="signup-name">Namn</label>
                <input type="text" id="signup-name" name="signup-name" placeholder="Ditt namn" required />
              </div>
              <div className="form-field">
                <label htmlFor="signup-email">E-post</label>
                <input type="email" id="signup-email" name="signup-email" placeholder="din@epost.se" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="signup-phone">Telefon</label>
                <input type="tel" id="signup-phone" name="signup-phone" placeholder="070-000 00 00" required />
              </div>
              <div className="form-field">
                <label htmlFor="signup-age">Ålder</label>
                <input type="number" id="signup-age" name="signup-age" placeholder="Din ålder" min="1" max="120" required />
              </div>
            </div>
            <div className="form-submit" style={{ justifyContent: "center" }}>
              <BorderGlowButton variant="primary" type="submit" disabled={signupSubmitting}>
                {signupSubmitting ? "SKICKAR…" : "ANMÄL DIG"}
              </BorderGlowButton>
              <span className="form-status" style={{ color: signupStatusColor }} aria-live="polite">
                {signupStatus}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" ref={faqRef}>
        <div className="faq-container">
          <div className="faq-header">
            <h2 className="faq-title">FAQ</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className="faq-answer-wrap">
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}
