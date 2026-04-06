"use client";

import dynamic from "next/dynamic";

const CircularGallery = dynamic(
  () => import("@/components/ui/CircularGallery"),
  { ssr: false, loading: () => <div style={{ height: 500, background: "#0a0a0a" }} /> }
);

const galleryItems = [
  { image: "/assets/celebrating_goal.jpg", text: "Firande" },
  { image: "/assets/shooting_ball.jpg", text: "Fotboll" },
  { image: "/assets/ready_to_shoot.jpg", text: "Redo" },
  { image: "/assets/ball.jpg", text: "Bollen" },
  { image: "/assets/boss_shooting_ref.jpg", text: "Träning" },
  { image: "/assets/boss.jpg", text: "Involvera" },
];

export default function AboutGallery() {
  return (
    <section style={{ height: 500, width: "100%", background: "#0a0a0a" }}>
      <CircularGallery
        items={galleryItems}
        bend={3}
        textColor="#ffffff"
        borderRadius={0.05}
        font="bold 24px DM Sans"
      />
    </section>
  );
}
