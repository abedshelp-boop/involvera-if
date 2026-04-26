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
const TOTAL = TILES.length * TILE_W;
const SPEED = 0.4;
const REPEATED = [...TILES, ...TILES];

const INITIAL_FOCAL = Math.round(TILES.length / 2 - 0.5);

export default function OmOrbit() {
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
