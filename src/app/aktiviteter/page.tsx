"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
    image: "/assets/shooting_ball.jpg",
  },
  {
    title: "PARASPORT",
    label: "Inkludering",
    desc: "Genom vårt samarbete med Mitt speciella barn erbjuder vi anpassade aktiviteter för barn och unga med funktionsnedsättning. Vi tror på idrottens kraft att inkludera alla.",
    image: "/assets/celebrating_goal.jpg",
  },
  {
    title: "CALISTHENICS",
    label: "Pull & Dip",
    desc: "Utomhusträning med kroppsvikt med fokus på styrka, uthållighet, kroppskontroll och mental toughness. Pull & Dip.",
    image: "/assets/ready_to_shoot.jpg",
  },
  {
    title: "OCH MER",
    label: "Flexibelt utbud",
    desc: "Vi utvärderar och anpassar kontinuerligt våra aktiviteter efter ungdomarnas behov för att erbjuda ett brett, relevant och spännande utbud.",
    image: "/assets/ball.jpg",
  },
];

// Placeholder images for DomeGallery (user will provide real ones later)
const domeImages = [
  { src: "/assets/celebrating_goal.jpg", alt: "Firande" },
  { src: "/assets/shooting_ball.jpg", alt: "Fotboll" },
  { src: "/assets/ready_to_shoot.jpg", alt: "Redo" },
  { src: "/assets/boss_shooting_ref.jpg", alt: "Träning" },
  { src: "/assets/ball.jpg", alt: "Bollen" },
  { src: "/assets/boss.jpg", alt: "Involvera" },
];

export default function ActivitiesPage() {
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

  return (
    <>
      <ScrollReveal />

      {/* Page Hero */}
      <section className="page-hero">
        <span className="hero-eyebrow">Sport för alla</span>
        <h1 className="page-title">
          <span className="title-line">
            <span>AKTIVITETER</span>
          </span>
        </h1>
      </section>

      <div className="divider" />

      {/* BounceCards Section */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6rem 8vw",
        gap: "3rem",
        position: "relative",
        minHeight: "80vh",
      }}>
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          <BounceCards
            images={activities.map((a) => a.image)}
            containerWidth={500}
            containerHeight={400}
            enableHover={true}
            onHover={(index) => setHoveredActivity(index)}
          />
        </div>

        {/* Activity info overlay */}
        <div style={{
          textAlign: "center",
          minHeight: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.3s ease",
          opacity: hoveredActivity !== null ? 1 : 0.5,
        }}>
          {hoveredActivity !== null ? (
            <>
              <span className="activity-label" style={{ marginBottom: "0.8rem" }}>
                {activities[hoveredActivity].label}
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                lineHeight: 0.92,
                color: "var(--white)",
                marginBottom: "1rem",
              }}>
                {activities[hoveredActivity].title}
              </h2>
              <p style={{
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "rgba(255, 255, 255, 0.5)",
                maxWidth: "52ch",
              }}>
                {activities[hoveredActivity].desc}
              </p>
            </>
          ) : (
            <p style={{
              fontSize: "0.85rem",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.35)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Håll musen över ett kort för att se mer
            </p>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* DomeGallery Section */}
      <section style={{
        height: "80vh",
        minHeight: 500,
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--green)",
          }}>
            Våra aktiviteter i bild
          </span>
        </div>
        <DomeGallery
          images={domeImages}
          overlayBlurColor="#0a0a0a"
          imageBorderRadius="12px"
          openedImageBorderRadius="16px"
          grayscale={false}
        />
      </section>

      <div className="divider" />

      <Footer />
    </>
  );
}
