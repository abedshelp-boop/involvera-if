"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tile = { x: number; y: number; z: number; img: string };

const N = 56;
const R = 420;

function buildTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    // Restrict to upper hemisphere: phi from ~12° down to ~88°
    const phi = ((12 + 76 * t) * Math.PI) / 180;
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = R * Math.sin(phi) * Math.cos(theta);
    const y = -R * Math.cos(phi) * 0.85;
    const z = R * Math.sin(phi) * Math.sin(theta);
    const img = `/involvera-images/${(i % 7) + 1}.jpg`;
    tiles.push({ x, y, z, img });
  }
  return tiles;
}

const mobileItems = Array.from(
  { length: 12 },
  (_, i) => `/involvera-images/${(i % 7) + 1}.jpg`
);

export default function Dome() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  // Render the heavy 3D content only after mount. The Fibonacci-sphere
  // math produces tiny ULP-level precision differences between Node SSR
  // and the V8 client, which causes hydration mismatches on inline
  // transform strings and data-* attributes. Deferring to client-only
  // is cheaper than rounding 56 tiles' positions everywhere.
  const [mounted, setMounted] = useState(false);

  const domeRef = useRef<HTMLDivElement>(null);

  // Auto-rotate yaw drift; pitch stays at neutral.
  const rot = useRef({ yaw: 0, pitch: -10, vy: 0.06 });

  const tiles = useMemo(() => buildTiles(), []);

  // Mark mounted + detect mobile
  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(max-width: 768px)");
    const onChange = () => setMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Auto-rotate animation (desktop only, after mount). No pointer/drag handling.
  useEffect(() => {
    if (!mounted || mobile) return;
    const dome = domeRef.current;
    if (!dome) return;

    const tileEls = dome.querySelectorAll<HTMLDivElement>(".iv-dome-tile");
    const tileData = Array.from(tileEls).map((el) => ({
      el,
      tx: parseFloat(el.dataset.tx ?? "0"),
      ty: parseFloat(el.dataset.ty ?? "0"),
      tz: parseFloat(el.dataset.tz ?? "0"),
    }));

    let raf = 0;
    const tick = () => {
      const r = rot.current;
      r.yaw += r.vy;
      if (r.yaw > 360) r.yaw -= 360;
      if (r.yaw < -360) r.yaw += 360;

      dome.style.transform = `translate(-50%, -50%) rotateX(${r.pitch}deg) rotateY(${r.yaw}deg)`;

      // Counter-rotate every tile so it always faces camera (billboard).
      // The parent rotateX(pitch) rotateY(yaw) rotates the tile's frame;
      // appending rotateY(-yaw) rotateX(-pitch) on the tile cancels that
      // rotation in orientation space — tile positions still orbit but
      // their faces stay parallel to the screen.
      const cy = -r.yaw;
      const cx = -r.pitch;
      for (let i = 0; i < tileData.length; i++) {
        const td = tileData[i];
        td.el.style.transform = `translate3d(${td.tx}px, ${td.ty}px, ${td.tz}px) rotateY(${cy}deg) rotateX(${cx}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [mounted, mobile]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="iv-dome-section">
      <div className="iv-dome-head">
        <h2>
          EN BLICK <span className="green">INIFRÅN.</span>
        </h2>
        <div className="meta">
          {mobile ? (
            <>
              Träningar, tävlingar, läger.<br />
              Mestadels utomhus. Alltid tillsammans.
            </>
          ) : (
            <>
              Träningar, tävlingar, läger.<br />
              Klicka på en bild för att förstora.
            </>
          )}
        </div>
      </div>

      {!mounted ? (
        // SSR + first client render: show an empty stage so layout stabilises
        // before the heavy 3D mounts (avoids hydration mismatch on float math).
        <div className="iv-dome-stage" />
      ) : mobile ? (
        <div className="iv-dome-stage">
          <div className="iv-dome-mobile-carousel">
            {mobileItems.map((src, i) => (
              <div
                key={i}
                className="iv-dome-mtile"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          <div className="iv-dome-controls">
            <span className="label">Galleri · 7 foton</span>
          </div>
        </div>
      ) : (
        <div className="iv-dome-stage">
          <div ref={domeRef} className="iv-dome">
            {tiles.map((t, i) => (
              <div
                key={i}
                className="iv-dome-tile"
                onClick={() => setOpen(t.img)}
                data-tx={t.x}
                data-ty={t.y}
                data-tz={t.z}
                style={{
                  transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px)`,
                  backgroundImage: `url(${t.img})`,
                }}
              >
                <div className="iv-dome-tile-glow" />
              </div>
            ))}
          </div>
          <div className="iv-dome-vignette" />
          <div className="iv-dome-controls">
            <span className="label">{tiles.length} foton · Klicka för att förstora</span>
          </div>
        </div>
      )}

      <div
        className={`iv-dome-lightbox ${open ? "open" : ""}`}
        onClick={() => setOpen(null)}
      >
        {open && (
          <img
            src={open}
            alt=""
            className="iv-dome-lightbox-img"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
        <button
          type="button"
          className="iv-dome-lightbox-close"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(null);
          }}
          aria-label="Stäng"
        >
          ✕
        </button>
      </div>
    </section>
  );
}
