"use client";

import dynamic from "next/dynamic";

const ProfileCard = dynamic(
  () => import("@/components/ui/ProfileCard"),
  { ssr: false }
);

export default function FounderCard() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "5rem 8vw",
        minHeight: "70vh",
      }}
    >
      <ProfileCard
        avatarUrl="/assets/boss.jpg"
        name="Grundare"
        title="Involvera IF"
        handle="involvera"
        status="Helsingborg"
        contactText="Kontakt"
        showUserInfo={true}
        enableTilt={true}
        behindGlowColor="rgba(46, 204, 64, 0.5)"
        innerGradient="linear-gradient(145deg, #1a3a1a8c 0%, #2ECC4044 100%)"
        onContactClick={() => {
          window.location.href = "/kontakt";
        }}
      />
    </section>
  );
}
