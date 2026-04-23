"use client";

import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const height = isMobile ? 320 : 500;
  const bend = isMobile ? 1 : 3;
  const font = isMobile ? "bold 18px DM Sans" : "bold 24px DM Sans";

  return (
    <section style={{ height, width: "100%", background: "#0a0a0a", pointerEvents: "none" }}>
      <CircularGallery
        items={galleryItems}
        bend={bend}
        textColor="#ffffff"
        borderRadius={0.05}
        font={font}
        autoScroll={true}
        autoScrollSpeed={0.03}
      />
    </section>
  );
}
