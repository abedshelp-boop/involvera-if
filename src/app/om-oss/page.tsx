import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import AboutGallery from "@/components/about/AboutGallery";
import FounderCard from "@/components/about/FounderCard";

export const metadata: Metadata = {
  title: "Om Oss",
  description:
    "Lär känna Involvera IF — en inkluderande idrottsförening i Helsingborg med fokus på fotboll, parasport och calisthenics.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />

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

      <div className="divider" />

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

      <div className="divider" />

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

      <div className="divider" />

      {/* Founder Profile Card */}
      <FounderCard />

      <Footer />
    </>
  );
}
