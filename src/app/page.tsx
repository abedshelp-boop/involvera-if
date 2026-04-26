"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import Lenis from "lenis";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { api } from "../../convex/_generated/api";
import "./homepage.css";

/* ── DATA ─────────────────────────────────────── */

const PANELS = [
  {
    n: "01",
    tag: "Lagspel",
    title: "FOTBOLL",
    desc: "Tre åldersgrupper, tränare med UEFA-licens, två träningar i veckan på Olympia. Vi spelar för att vinna — och för att alla ska få speltid.",
    img: "/involvera-images/4.jpg",
    stats: [
      { v: "85", l: "Spelare" },
      { v: "3", l: "Lag" },
      { v: "Tis · Tor", l: "Träning" },
    ],
    flip: false,
  },
  {
    n: "02",
    tag: "Inkludering",
    title: "PARASPORT",
    desc: "Anpassad idrott för barn och unga med funktionsvariation. Egna pass, integrerat med övriga lag — för att gemenskap inte har några begränsningar.",
    img: "/involvera-images/3.jpg",
    stats: [
      { v: "40+", l: "Aktiva" },
      { v: "5", l: "Disciplin" },
      { v: "Mån · Ons", l: "Träning" },
    ],
    flip: true,
    isPara: true,
  },
  {
    n: "03",
    tag: "Styrka",
    title: "CALISTHENICS",
    desc: "Kroppsvikt, parkour-rigg och utomhusgym i Pålsjö. Från första pull-up till handstand — vi börjar där du står idag.",
    img: "/involvera-images/5.jpg",
    stats: [
      { v: "60", l: "Atleter" },
      { v: "2x", l: "Per vecka" },
      { v: "Utomhus", l: "Året om" },
    ],
    flip: false,
  },
  {
    n: "04",
    tag: "Föreningen",
    title: "OM OSS",
    desc: "Grundad av föräldrar i Helsingborg som ville se en förening där alla får plats — oavsett bakgrund, plånbok eller funktionsvariation.",
    img: "/involvera-images/6.jpg",
    stats: [
      { v: "200+", l: "Medlemmar" },
      { v: "100%", l: "Volontärdrivet" },
      { v: "200kr", l: "Årsavgift" },
    ],
    flip: true,
  },
];

/* Mosaic image order: 5 cells (top row), then 1 cell + CTA + 1 cell (middle), then 5 cells (bottom).
   The CTA spans grid-column 2/5 of row 2 via CSS. */
const MOSAIC_IMAGES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", // row 1
  "6.jpg",                                       // row 2 left
  "7.jpg",                                       // row 2 right
  "2.jpg", "5.jpg", "1.jpg", "3.jpg", "6.jpg",   // row 3
];

const FAQ_ITEMS = [
  {
    q: "VAD KOSTAR DET ATT VARA MEDLEM?",
    a: "Årsavgiften är 200kr för ungdomar under 18. Vi har stipendier för familjer som behöver det — fråga oss, ingen ska stå utanför av ekonomiska skäl.",
  },
  {
    q: "BEHÖVS NÅGON ERFARENHET?",
    a: "Nej. Alla våra grupper har plats för nybörjare. Du behöver bara ta dig hit.",
  },
  {
    q: "VILKA ÅLDRAR VÄLKOMNAR NI?",
    a: "8–18 år för fotboll och calisthenics. Parasport-grupperna sträcker sig upp till 25.",
  },
  {
    q: "VAR TRÄNAR NI?",
    a: "Olympia (fotboll), Pålsjö Friluftsgym (calisthenics) och Husensjö idrottshall (parasport).",
  },
  {
    q: "HUR ANMÄLER MAN SIG?",
    a: "Anmälan sker via formuläret nedan — eller direkt i WhatsApp-gruppen. Vi svarar inom 24h.",
  },
  {
    q: "FINNS DET LÄGER OCH RESOR?",
    a: "Ja. Två sommarläger per år och ett vinterläger. Subventionerade så att alla kan följa med.",
  },
];

const MARQUEE_ITEMS = [
  "FOTBOLL",
  "PARASPORT",
  "CALISTHENICS",
  "OCH MER",
  "FOTBOLL",
  "PARASPORT",
  "CALISTHENICS",
  "OCH MER",
];

/* ── PAGE ─────────────────────────────────────── */

export default function HomePage() {
  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollReveal />
      <Hero />
      <Marquee />
      <Panels />
      <Mosaic />
      <FAQ />
      <Signup />
      <Footer />
    </>
  );
}

/* ── HERO ─────────────────────────────────────── */

function Hero() {
  const router = useRouter();
  const [sport, setSport] = useState("");

  const handleNext = () => {
    router.push("/aktiviteter");
  };

  return (
    <section className="iv-hero">
      <div className="iv-hero-bg" />
      <div className="iv-hero-watermark">
        INVOLVERA<span className="tm">IF</span>
      </div>

      <div className="iv-hero-content">
        <div className="iv-hero-eyebrow">Helsingborg · Sedan 2014</div>
        <h1 className="iv-hero-title">
          IDROTT FÖR
          <br />
          <span className="green">ALLA</span>
          <span className="period">.</span>
        </h1>
        <p className="iv-hero-sub">
          En förening där alla kan vara med — fotboll, parasport och
          calisthenics för Helsingborgs ungdomar. Låga avgifter. Hög gemenskap.
        </p>

        <div className="iv-wa-hero-cta-row">
          {/* TODO: replace href="#" with real WhatsApp invite URL (chat.whatsapp.com/...) */}
          <a
            href="#"
            className="iv-wa-hero-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <WhatsappGlyph size={16} />
            </span>
            Gå med i WhatsApp-gruppen
          </a>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Direktkontakt med tränarna
          </span>
        </div>
      </div>

      <div className="iv-hero-bottom">
        <div className="iv-picker">
          <div className="iv-picker-step">
            <span>Steg 1/2</span>
            <span className="bar" />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>
              Hitta din sport
            </span>
          </div>
          <div className="iv-picker-q">Vilken idrott passar dig?</div>
          <div className="iv-picker-row">
            <select
              className="iv-picker-select"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              aria-label="Välj idrott"
            >
              <option value="">Välj idrott</option>
              <option value="fotboll">Fotboll</option>
              <option value="parasport">Parasport</option>
              <option value="calisthenics">Calisthenics</option>
              <option value="annat">Och mer</option>
            </select>
            <button
              type="button"
              className="iv-picker-next"
              onClick={handleNext}
            >
              Nästa <ArrowRight />
            </button>
          </div>
          <div className="iv-picker-foot">
            Tar 30 sekunder · Helt kostnadsfritt
          </div>
        </div>

        <div className="iv-hero-right">
          <div className="iv-members">
            <div className="iv-members-avatars">
              <div
                style={{
                  backgroundImage: "url(/involvera-images/1.jpg)",
                }}
              />
              <div
                style={{
                  backgroundImage: "url(/involvera-images/4.jpg)",
                }}
              />
              <div
                style={{
                  backgroundImage: "url(/involvera-images/2.jpg)",
                }}
              />
              <div
                style={{
                  backgroundImage: "url(/involvera-images/6.jpg)",
                }}
              />
            </div>
            <div>
              <div className="iv-members-count">200+</div>
              <div className="iv-members-label">medlemmar</div>
            </div>
          </div>
          <div className="iv-coach-bubble" title="Prata med en tränare" />
        </div>
      </div>
    </section>
  );
}

/* ── MARQUEE ──────────────────────────────────── */

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // duplicated for seamless loop
  return (
    <div className="iv-marquee" aria-hidden="true">
      <div className="iv-marquee-track">
        {items.map((it, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center", gap: "36px" }}
          >
            <strong>{it}</strong>
            <span className="dot">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── PANELS ───────────────────────────────────── */

function Panels() {
  return (
    <section className="iv-panels">
      {PANELS.map((p, i) => (
        <div
          key={i}
          className={`iv-panel${p.flip ? " flip" : ""}${
            p.isPara ? " para" : ""
          }`}
        >
          <div className="iv-panel-text">
            <div className="iv-panel-num">
              <span>{p.n}</span>
              <span className="dash" />
              <span>{p.tag}</span>
            </div>
            <h2 className="iv-panel-title">
              {p.title}
              <span className="green">.</span>
            </h2>
            <p className="iv-panel-desc">{p.desc}</p>
            <div className="iv-panel-stats">
              {p.stats.map((s, j) => (
                <div key={j} className="iv-panel-stat">
                  <div className="v">{s.v}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="iv-panel-img"
            style={{ backgroundImage: `url(${p.img})` }}
          >
            <div className="iv-panel-img-tag">
              <span className="dot" />
              {p.title}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── MOSAIC ───────────────────────────────────── */

function Mosaic() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const cell = target?.closest<HTMLElement>(".iv-mosaic-cell");
      if (!cell || !grid.contains(cell)) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--mx", `${e.clientX - r.left}px`);
      cell.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    grid.addEventListener("pointermove", onMove);
    return () => grid.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="iv-mosaic-section">
      <div className="iv-mosaic-head">
        <h2>
          EN FÖRENING.
          <br />
          FYRA <span className="green">VÄGAR</span> IN.
        </h2>
        <div className="meta">
          200+ medlemmar.
          <br />
          Tre stadsdelar.
          <br />
          Ingen lämnas utanför.
        </div>
      </div>

      <div className="iv-mosaic" ref={gridRef}>
        {/* Row 1 — 5 cells */}
        {MOSAIC_IMAGES.slice(0, 5).map((src, i) => (
          <div
            key={`r1-${i}`}
            className="iv-mosaic-cell"
            style={{ backgroundImage: `url(/involvera-images/${src})` }}
          />
        ))}

        {/* Row 2 — 1 cell + CTA + 1 cell */}
        <div
          className="iv-mosaic-cell"
          style={{ backgroundImage: `url(/involvera-images/${MOSAIC_IMAGES[5]})` }}
        />

        <a href="/kontakt" className="iv-mosaic-cta">
          <div className="iv-mosaic-cta-pre">
            <span className="dash" />
            Bli medlem · 200kr/år
          </div>
          <h3>
            GÅ MED I
            <br />
            LAGET
          </h3>
          <div className="iv-mosaic-cta-foot">
            <div className="meta">Plats till alla. Alltid.</div>
            <div className="arrow">
              <ArrowRight size={18} />
            </div>
          </div>
        </a>

        <div
          className="iv-mosaic-cell"
          style={{ backgroundImage: `url(/involvera-images/${MOSAIC_IMAGES[6]})` }}
        />

        {/* Row 3 — 5 cells */}
        {MOSAIC_IMAGES.slice(7, 12).map((src, i) => (
          <div
            key={`r3-${i}`}
            className="iv-mosaic-cell"
            style={{ backgroundImage: `url(/involvera-images/${src})` }}
          />
        ))}
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────── */

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="iv-faq-section">
      <div className="iv-faq-frame">
        <div className="iv-faq-glyph">
          <div className="word">FAQ</div>
          <div className="symbol">
            <span />
            <span />
          </div>
        </div>
        <div className="iv-faq-list">
          {FAQ_ITEMS.map((it, i) => (
            <div
              key={i}
              className={`iv-faq-row${open === i ? " open" : ""}`}
            >
              <button
                type="button"
                className="iv-faq-row-head"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="iv-faq-row-q">{it.q}</span>
                <span className="iv-faq-row-toggle" aria-hidden="true">
                  +
                </span>
              </button>
              <div className="iv-faq-row-body">
                <div>
                  <p>{it.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SIGNUP ───────────────────────────────────── */

function Signup() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("var(--green)");
  const eventSignup = useMutation(api.eventSignups.signup);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = (fd.get("firstName") as string).trim();
    const lastName = (fd.get("lastName") as string).trim();
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string).trim();
    const ageStr = (fd.get("age") as string).trim();
    const age = parseInt(ageStr, 10);

    if (!firstName || !lastName || !email || !phone || !ageStr) {
      setStatusColor("#ff5555");
      setStatus("Fyll i alla fält.");
      return;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      setStatusColor("#ff5555");
      setStatus("Ange en giltig ålder.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    try {
      await eventSignup({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        age,
      });
      form.reset();
      setStatusColor("var(--green)");
      setStatus("Anmälan skickad!");
      setTimeout(() => setStatus(""), 4500);
    } catch {
      setStatusColor("#ff5555");
      setStatus("Något gick fel. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="iv-signup">
      <div className="iv-signup-frame">
        <div className="iv-signup-img">
          <div className="iv-signup-quote">
            <span className="small">Nästa event · 18 maj</span>
            ÖPPET HUS
            <br />
            PÅ OLYMPIA.
          </div>
        </div>
        <div className="iv-signup-form">
          <div className="num">
            <span className="dash" />
            Anmäl dig
          </div>
          <h3>
            KOM OCH
            <br />
            TESTA <span className="green">GRATIS</span>.
          </h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid">
              <div className="iv-field">
                <label htmlFor="signup-firstName">Förnamn</label>
                <input
                  id="signup-firstName"
                  name="firstName"
                  type="text"
                  placeholder="Maja"
                  required
                />
              </div>
              <div className="iv-field">
                <label htmlFor="signup-lastName">Efternamn</label>
                <input
                  id="signup-lastName"
                  name="lastName"
                  type="text"
                  placeholder="Andersson"
                  required
                />
              </div>
              <div className="iv-field full">
                <label htmlFor="signup-email">E-post</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="maja@exempel.se"
                  required
                />
              </div>
              <div className="iv-field">
                <label htmlFor="signup-phone">Telefon</label>
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  placeholder="070 123 45 67"
                  required
                />
              </div>
              <div className="iv-field">
                <label htmlFor="signup-age">Ålder</label>
                <input
                  id="signup-age"
                  name="age"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="14"
                  required
                />
              </div>
            </div>
            <div className="iv-signup-submit">
              <button
                type="submit"
                className="iv-btn-primary"
                disabled={submitting}
              >
                {submitting ? "SKICKAR…" : "Anmäl dig"}{" "}
                {!submitting && <ArrowRight />}
              </button>
              <div className="iv-signup-foot">Vi ringer upp inom 24h.</div>
              <span
                className="iv-signup-status"
                style={{ color: statusColor }}
                aria-live="polite"
              >
                {status}
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── ICONS ────────────────────────────────────── */

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsappGlyph({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
