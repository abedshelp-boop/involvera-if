"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import BorderGlowButton from "@/components/ui/BorderGlowButton";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";

const BounceCards = dynamic(
  () => import("@/components/ui/BounceCards"),
  { ssr: false }
);

const DomeGallery = dynamic(
  () => import("@/components/ui/DomeGallery"),
  { ssr: false, loading: () => <div style={{ height: 600, background: "#0a0a0a" }} /> }
);

const activities = [
  {
    title: "FOTBOLL",
    label: "Lagspel & Tävling",
    desc: "Regelbunden träning, turneringar och aktiviteter utomhus och inomhus som bygger laganda, kondition och disciplin.",
    image: "/involvera-images/3.jpg",
  },
  {
    title: "PARASPORT",
    label: "Inkludering",
    desc: "Genom vårt samarbete med Mitt speciella barn erbjuder vi anpassade aktiviteter för barn och unga med funktionsnedsättning. Vi tror på idrottens kraft att inkludera alla.",
    image: "/involvera-images/2.jpg",
  },
  {
    title: "CALISTHENICS",
    label: "Pull & Dip",
    desc: "Utomhusträning med kroppsvikt med fokus på styrka, uthållighet, kroppskontroll och mental toughness. Pull & Dip.",
    image: "/involvera-images/1.jpg",
  },
  {
    title: "OCH MER",
    label: "Flexibelt utbud",
    desc: "Vi utvärderar och anpassar kontinuerligt våra aktiviteter efter ungdomarnas behov för att erbjuda ett brett, relevant och spännande utbud.",
    image: "/involvera-images/7.jpg",
  },
];

const domeImages = [
  { src: "/involvera-images/1.jpg", alt: "" },
  { src: "/involvera-images/2.jpg", alt: "" },
  { src: "/involvera-images/3.jpg", alt: "" },
  { src: "/involvera-images/4.jpg", alt: "" },
  { src: "/involvera-images/5.jpg", alt: "" },
  { src: "/involvera-images/6.jpg", alt: "" },
  { src: "/involvera-images/7.jpg", alt: "" },
];

export default function ActivitiesPage() {
  return (
    <>
      <ScrollReveal />

      {/* Page Hero — sticky so it stays fixed until next section scrolls over */}
      <section className="page-hero" style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        background: "var(--black)",
      }}>
        <span className="hero-eyebrow">Sport för alla</span>
        <h1 className="page-title">
          <span className="title-line">
            <span>AKTIVITETER</span>
          </span>
        </h1>
      </section>

      {/* BounceCards Section */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6rem 8vw",
        gap: "3rem",
        position: "relative",
        zIndex: 2,
        background: "var(--black)",
        minHeight: "80vh",
      }}>
        <p style={{
          fontSize: "clamp(0.8rem, 0.95vw, 0.95rem)",
          fontWeight: 300,
          color: "var(--dim)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
          margin: 0,
        }}>
          Håll muspekaren över korten
        </p>
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          <BounceCards
            images={activities.map((a) => a.image)}
            titles={activities.map((a) => a.title)}
            descriptions={activities.map((a) => a.desc)}
            containerWidth={700}
            containerHeight={550}
            enableHover={true}
          />
        </div>
      </section>

      {/* DomeGallery Section */}
      <section style={{
        height: "80vh",
        minHeight: 500,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
        background: "var(--black)",
      }}>
        <DomeGallery
          images={domeImages}
          overlayBlurColor="#0a0a0a"
          imageBorderRadius="12px"
          openedImageBorderRadius="16px"
          grayscale={false}
          autoRotate={true}
          autoRotateSpeed={0.12}
        />
      </section>

      {/* CTA Section */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 8vw",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
        background: "var(--black)",
      }}>
        <h2 className="reveal" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          lineHeight: 0.92,
          color: "var(--white)",
          marginBottom: "1.2rem",
        }}>
          REDO ATT BÖRJA?
        </h2>
        <p className="reveal delay-1" style={{
          fontSize: "clamp(0.85rem, 1vw, 1rem)",
          fontWeight: 300,
          color: "var(--dim)",
          marginBottom: "2.5rem",
          maxWidth: "48ch",
          lineHeight: 1.8,
        }}>
          Oavsett om du vill spela fotboll, träna calisthenics eller delta i parasport — vi har plats för dig.
        </p>
        <BorderGlowButton variant="primary" size="large" href="/kontakt">Kontakta Oss</BorderGlowButton>
      </section>

      <Footer />
    </>
  );
}
