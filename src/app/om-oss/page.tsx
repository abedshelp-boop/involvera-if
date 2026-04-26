import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import OmOrbit from "@/components/about/OmOrbit";

export const metadata: Metadata = {
  title: "Om Oss",
  description:
    "Lär känna Involvera IF — en inkluderande idrottsförening i Helsingborg med fokus på fotboll, parasport och calisthenics.",
};

export default function AboutPage() {
  return (
    <div className="iv-omoss-page">
      <section className="iv-om-hero-section">
        <div className="iv-om-hero">
          <div className="iv-om-hero-eyebrow">Involvera IF — Helsingborg</div>
          <h1 className="iv-om-hero-title">
            OM OSS<span className="green">.</span>
          </h1>
          <p className="iv-om-hero-sub">
            En idrottsförening grundad av föräldrar i Drottninghög. Idag —
            fotboll, parasport och calisthenics för Helsingborgs ungdomar. Detta
            är vår historia.
          </p>
        </div>
        <OmOrbit />
      </section>

      <div className="iv-om-grad-1" />

      <section className="iv-om-intro-section">
        <div className="iv-om-intro-frame">
          <div className="iv-om-intro-eyebrow">Föreningen</div>
          <h2 className="iv-om-intro-head">
            En inkluderande idrotts<span className="green">förening</span> i
            Helsingborg
          </h2>

          <div className="iv-om-intro-cols">
            <div className="iv-om-intro-col">
              <p>
                Vårt syfte är att engagera och vägleda ungdomar mot idrott och
                en positiv miljö. Vi syftar till att fylla deras fritid med
                meningsfulla aktiviteter som främjar hälsa, gemenskap och
                personlig utveckling. Baserat på vår starka grund och tidigare
                erfarenhet under Framtidens Ungdom tar vi nu nästa
                professionella steg för att organisera hållbara
                sportaktiviteter i Helsingborg.
              </p>
            </div>
            <div className="iv-om-intro-col">
              <p>
                Vi har ett särskilt fokus på fysisk idrott, tävlingsaktiviteter
                och Parasport. Vi bygger en plattform där ungdomar kan växa, ta
                ansvar och bli framtida ledare.
              </p>
            </div>
          </div>

          <div className="iv-om-info">
            <div className="iv-om-info-col">
              <div className="iv-om-info-col-label">Organisation</div>
              <div className="iv-om-info-rows">
                <div className="iv-om-info-row">
                  <div className="k">Org.nr</div>
                  <div className="v">802546-0307</div>
                </div>
                <div className="iv-om-info-row">
                  <div className="k">Plats</div>
                  <div className="v body">Helsingborgs kommun</div>
                </div>
                <div className="iv-om-info-row">
                  <div className="k">E-post</div>
                  <div className="v body">kontakt@involvera.se</div>
                </div>
              </div>
            </div>

            <div className="iv-om-info-divider" />

            <div className="iv-om-info-col">
              <div className="iv-om-info-col-label">Anslutningar</div>
              <div className="iv-om-aff">
                <div className="iv-om-aff-row">
                  <div className="badge">SvFF</div>
                  <div>
                    <div className="name">Svenska Fotbollförbundet</div>
                    <div className="meta">Medlem · 2024</div>
                  </div>
                </div>
                <div className="iv-om-aff-row">
                  <div className="badge">SPF</div>
                  <div>
                    <div className="name">Svenska Parasportförbundet</div>
                    <div className="meta">Medlem · 2024</div>
                  </div>
                </div>
                <div className="iv-om-aff-row">
                  <div className="badge">RF</div>
                  <div>
                    <div className="name">RF-SISU Skåne</div>
                    <div className="meta">Distriktsanslutning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="iv-om-grad-2" />

      <section className="iv-om-cta">
        <div className="iv-om-cta-eyebrow">Nästa steg</div>
        <h2>
          VILL DU
          <br />
          VETA <span className="green">MER</span>
          <span style={{ color: "var(--green)" }}>?</span>
        </h2>
        <p className="iv-om-cta-sub">
          Kontakta oss för att lära dig mer om vår förening eller hur du kan
          engagera dig.
        </p>
        <div className="iv-om-cta-row">
          <Link href="/kontakt" className="iv-om-btn-primary">
            Kontakta oss
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/aktiviteter" className="iv-om-btn-outline">
            Våra aktiviteter
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
