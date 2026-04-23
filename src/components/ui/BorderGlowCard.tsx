"use client";

import { useRef, useCallback, type ReactNode, type CSSProperties } from "react";

interface BorderGlowCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  borderRadius?: string;
}

export default function BorderGlowCard({
  children,
  className = "",
  style,
  borderRadius = "12px",
}: BorderGlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;

    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    let degrees = 0;
    if (dx !== 0 || dy !== 0) {
      const radians = Math.atan2(dy, dx);
      degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
    }

    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${degrees.toFixed(3)}deg`);
  }, []);

  const cardStyle: CSSProperties = {
    ["--border-radius" as string]: borderRadius,
    ...style,
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`bgc ${className}`}
      style={cardStyle}
    >
      <span className="bgc__edge-light" />
      {children}
    </div>
  );
}
