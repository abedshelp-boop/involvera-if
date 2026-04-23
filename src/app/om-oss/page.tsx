import type { Metadata } from "next";
import Link from "next/link";
import BorderGlowButton from "@/components/ui/BorderGlowButton";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import AboutGallery from "@/components/about/AboutGallery";

export const metadata: Metadata = {
  title: "Om Oss",
  description:
    "Lär känna Involvera IF — en inkluderande idrottsförening i Helsingborg med fokus på fotboll, parasport och calisthenics.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />

      {/* Section 1: Hero + Gallery (lighter black) */}
      <div style={{ background: "#111111" }}>
        {/* Page Hero */}
        <section className="page-hero">
          <span className="hero-eyebrow">Involvera IF — Helsingborg</span>
          <h1 className="page-title">
            <span className="title-line">
              <span>OM OSS</span>
            </span>
          </h1>
        </section>

        {/* Circular Gallery */}
        <AboutGallery />
      </div>

      {/* Gradient transition 1→2 */}
      <div style={{ height: "12rem", background: "linear-gradient(to bottom, #111111, #0d0d0d)" }} />

      {/* Section 2: Intro + Info (medium black) */}
      <div style={{ background: "#0d0d0d" }}>
        {/* Intro */}
        <section className="about-intro">
          <p className="about-subheading reveal">
            En inkluderande idrottsförening i Helsingborg
          </p>
          <div className="about-body-cols">
            <p className="reveal delay-1">
              Vårt syfte är att engagera och vägleda ungdomar mot idrott och en
              positiv miljö. Vi syftar till att fylla deras fritid med
              meningsfulla aktiviteter som främjar hälsa, gemenskap och personlig
              utveckling. Baserat på vår starka grund och tidigare erfarenhet under
              Framtidens Ungdom tar vi nu nästa professionella steg för att
              organisera hållbara sportaktiviteter i Helsingborg.
            </p>
            <p className="reveal delay-2">
              Vi har ett särskilt fokus på fysisk idrott, tävlingsaktiviteter och
              Parasport. Vi bygger en plattform där ungdomar kan växa, ta ansvar
              och bli framtida ledare.
            </p>
          </div>
        </section>

        {/* Official info + affiliations */}
        <section className="about-info">
          <div className="about-info-grid">
            <div className="reveal-left">
              <span className="info-label">Organisation</span>
              <ul className="info-list">
                <li>
                  <span className="info-key">Org.nr</span>
                  <span className="info-val">802546-0307</span>
                </li>
                <li>
                  <span className="info-key">Plats</span>
                  <span className="info-val">Helsingborgs kommun</span>
                </li>
                <li>
                  <span className="info-key">E-post</span>
                  <span className="info-val">kontakt@involvera.se</span>
                </li>
              </ul>
            </div>

            <div className="reveal-right">
              <span className="info-label">Anslutningar</span>
              <ul className="affiliation-list stagger-reveal">
                <li>Svenska Fotbollförbundet</li>
                <li>Svenska Parasportförbundet</li>
                <li>RF-SISU Skåne</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Gradient transition 2→3 */}
      <div style={{ height: "12rem", background: "linear-gradient(to bottom, #0d0d0d, #000000)" }} />

      {/* Section 3: CTA (pitch black) */}
      <div style={{ background: "#000000" }}>
        <section style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 8vw",
          textAlign: "center",
          minHeight: "40vh",
        }}>
          <h2 className="reveal" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.92,
            color: "var(--white)",
            marginBottom: "1.2rem",
          }}>
            VILL DU VETA MER?
          </h2>
          <p className="reveal delay-1" style={{
            fontSize: "clamp(0.85rem, 1vw, 1rem)",
            fontWeight: 300,
            color: "var(--dim)",
            marginBottom: "2.5rem",
            maxWidth: "48ch",
            lineHeight: 1.8,
          }}>
            Kontakta oss för att lära dig mer om vår förening eller hur du kan engagera dig.
          </p>
          <div className="reveal delay-2" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <BorderGlowButton variant="primary" href="/kontakt">Kontakta Oss</BorderGlowButton>
            <BorderGlowButton variant="outline" href="/aktiviteter">Våra Aktiviteter</BorderGlowButton>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
