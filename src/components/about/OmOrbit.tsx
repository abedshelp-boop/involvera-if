"use client";

import { useEffect, useRef, useState } from "react";

const TILES = [
  { src: "/involvera-images/1.jpg", cap: "Olympia · Träning" },
  { src: "/involvera-images/4.jpg", cap: "Lagspel · U15" },
  { src: "/involvera-images/2.jpg", cap: "Pålsjö · Calisthenics" },
  { src: "/involvera-images/3.jpg", cap: "Husensjö · Parasport" },
  { src: "/involvera-images/5.jpg", cap: "Sommarläger 2025" },
  { src: "/involvera-images/6.jpg", cap: "Drottninghög · Klubbhus" },
  { src: "/involvera-images/7.jpg", cap: "Cup-final · Maj" },
  { src: "/involvera-images/2.jpg", cap: "Vinterträning" },
  { src: "/involvera-images/4.jpg", cap: "Tränarmöte" },
  { src: "/involvera-images/1.jpg", cap: "Öppet hus" },
];

const TILE_W = 240 + 28;
const SPEED = 0.4;
const REPEATED = [...TILES, ...TILES];
const INITIAL_FOCAL = Math.round(TILES.length / 2 - 0.5);
const TOTAL = TILES.length * TILE_W;

const COVERFLOW_IMAGES = Array.from(
  { length: 7 },
  (_, i) => `/involvera-images/${i + 1}.jpg`
);

export default function OmOrbit() {
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(max-width: 768px)");
    const apply = () => setMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // SSR + first client render: render desktop orbit shell so the layout is stable
  // (matches existing behaviour). The mobile coverflow only mounts after we've
  // detected the viewport, avoiding a mismatched render on hydration.
  if (!mounted) {
    return <DesktopOrbit />;
  }

  return mobile ? <MobileCoverflow /> : <DesktopOrbit />;
}

function DesktopOrbit() {
  const [offset, setOffset] = useState(0);
  const [focalIdx, setFocalIdx] = useState(INITIAL_FOCAL);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      let next = offsetRef.current - SPEED;
      if (next <= -TOTAL) next += TOTAL;
      offsetRef.current = next;
      setOffset(next);

      const focalDoubled = Math.round(TILES.length / 2 - 0.5 - next / TILE_W);
      const wrapped = ((focalDoubled % REPEATED.length) + REPEATED.length) % REPEATED.length;
      setFocalIdx(wrapped);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="iv-om-orbit">
      <div
        className="iv-om-orbit-track"
        style={{
          transform: `translate(calc(-50% + ${TOTAL / 2}px + ${offset}px), -50%)`,
        }}
      >
        {REPEATED.map((t, i) => {
          const dist = Math.abs(i - focalIdx);
          const arcY = Math.min(dist, 4) * 8;
          const cls =
            i === focalIdx
              ? "iv-om-orbit-tile is-focal"
              : dist === 1
                ? "iv-om-orbit-tile is-near"
                : "iv-om-orbit-tile";
          return (
            <div
              key={i}
              className={cls}
              style={{
                backgroundImage: `url(${t.src})`,
                marginTop: `${arcY}px`,
              }}
            >
              <div className="iv-om-orbit-tile-cap">{t.cap}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileCoverflow() {
  const items = COVERFLOW_IMAGES;
  const [active, setActive] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const [openLightbox, setOpen] = useState<string | null>(null);
  const drag = useRef({ active: false, startX: 0, startActive: 0, moved: 0 });
  const auto = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance every 3.6s while idle.
  useEffect(() => {
    if (isDragging || openLightbox) return;
    auto.current = setTimeout(() => {
      setActive((a) => (a + 1) % items.length);
    }, 3600);
    return () => {
      if (auto.current) clearTimeout(auto.current);
    };
  }, [active, isDragging, openLightbox, items.length]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    drag.current.active = true;
    drag.current.startX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    drag.current.startActive = active;
    drag.current.moved = 0;
    setDragging(true);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drag.current.active) return;
      const x =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;
      const dx = x - drag.current.startX;
      drag.current.moved = Math.abs(dx);
      const step = 90; // px per tile
      const delta = -dx / step;
      const newIdx = drag.current.startActive + delta;
      setActive(Math.max(0, Math.min(items.length - 1, newIdx)));
    };
    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setDragging(false);
      setActive((a) => Math.round(a));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [items.length]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!openLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openLightbox]);

  const activeRounded = Math.round(active);

  return (
    <div className="mg-coverflow">
      <div
        className="mg-cf-stage"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <div className="mg-cf-floor" />
        <div className="mg-cf-track">
          {items.map((src, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const sign = Math.sign(offset);
            const tx = offset * 78;
            const tz = -abs * 90;
            const ry = -sign * Math.min(abs, 3) * 28;
            const ty = abs * 6;
            const opacity = abs > 3 ? 0 : 1 - abs * 0.18;
            const scale = abs === 0 ? 1.04 : 1 - abs * 0.04;
            return (
              <div
                key={i}
                className={`mg-cf-tile${i === activeRounded ? " is-active" : ""}`}
                style={{
                  transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  opacity,
                  zIndex: 100 - Math.round(abs * 10),
                }}
                onClick={() => {
                  if (drag.current.moved > 6) return;
                  if (i === activeRounded) setOpen(src);
                  else setActive(i);
                }}
              >
                <div className="mg-cf-img" style={{ backgroundImage: `url(${src})` }} />
                <div className="mg-cf-shine" />
                <div
                  className="mg-cf-reflect"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </div>
            );
          })}
        </div>

        <div className="mg-cf-hud">
          <div className="mg-cf-counter">
            <span className="cur">{String(activeRounded + 1).padStart(2, "0")}</span>
            <span className="sep">/</span>
            <span className="tot">{String(items.length).padStart(2, "0")}</span>
          </div>
          <div className="mg-cf-dots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`mg-cf-dot${i === activeRounded ? " on" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Bild ${i + 1}`}
              />
            ))}
          </div>
          <div className="mg-cf-hint">DRA · TRYCK FÖR ATT FÖRSTORA</div>
        </div>
      </div>

      {openLightbox && (
        <div className="mg-lightbox" onClick={() => setOpen(null)}>
          <div
            className="mg-lightbox-img"
            style={{ backgroundImage: `url(${openLightbox})` }}
          />
          <button
            type="button"
            className="mg-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(null);
            }}
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
