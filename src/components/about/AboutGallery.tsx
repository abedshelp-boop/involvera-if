"use client";

import dynamic from "next/dynamic";

const CircularGallery = dynamic(
  () => import("@/components/ui/CircularGallery"),
  { ssr: false, loading: () => <div style={{ height: 500, background: "#0a0a0a" }} /> }
);

const galleryItems = [
  { image: "/involvera-images/1.jpg", text: "" },
  { image: "/involvera-images/2.jpg", text: "" },
  { image: "/involvera-images/3.jpg", text: "" },
  { image: "/involvera-images/4.jpg", text: "" },
  { image: "/involvera-images/5.jpg", text: "" },
  { image: "/involvera-images/6.jpg", text: "" },
  { image: "/involvera-images/7.jpg", text: "" },
];

export default function AboutGallery() {
  return (
    <section style={{ height: 500, width: "100%", background: "#0a0a0a", pointerEvents: "none" }}>
      <CircularGallery
        items={galleryItems}
        bend={3}
        textColor="#ffffff"
        borderRadius={0.05}
        font="bold 24px DM Sans"
        autoScroll={true}
        autoScrollSpeed={0.03}
      />
    </section>
  );
}
