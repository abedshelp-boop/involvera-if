"use client";

import { useRef, useCallback, type ReactNode, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import "./BorderGlowButton.css";

/* ── helpers ─────────────────────────────────── */

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: readonly string[]) {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

/* ── variant presets ─────────────────────────── */

const VARIANTS = {
  primary: {
    glowColor: "140 70 55",
    colors: ["#2ECC40", "#27ae32", "#38bdf8"],
    backgroundColor: "transparent",
  },
  outline: {
    glowColor: "0 0 90",
    colors: ["#ffffff", "#c0c0c0", "#38bdf8"],
    backgroundColor: "transparent",
  },
} as const;

/* ── component ───────────────────────────────── */

interface BorderGlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "large";
  href?: string;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: () => void;
}

export default function BorderGlowButton({
  children,
  variant = "primary",
  size = "default",
  href,
  className = "",
  type,
  disabled,
  onClick,
}: BorderGlowButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const preset = VARIANTS[variant];

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2] as const;
  }, []);

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      if (dx === 0 && dy === 0) return 0;
      const radians = Math.atan2(dy, dx);
      let degrees = radians * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      return degrees;
    },
    [getCenterOfElement],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);
      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    },
    [getEdgeProximity, getCursorAngle],
  );

  const glowVars = buildGlowVars(preset.glowColor, 1.0);
  const gradientVars = buildGradientVars(preset.colors);

  const sizeClass = size === "large" ? "bgb--large" : "";
  const variantClass = variant === "primary" ? "bgb--primary" : "bgb--outline";

  const style: React.CSSProperties = {
    "--card-bg": preset.backgroundColor,
    "--edge-sensitivity": 30,
    "--border-radius": "4px",
    "--glow-padding": "20px",
    "--cone-spread": 25,
    "--fill-opacity": 0.5,
    ...glowVars,
    ...gradientVars,
  } as React.CSSProperties;

  const inner = href ? (
    <Link href={href} className="bgb__inner">
      {children}
    </Link>
  ) : (
    <button
      type={type || "button"}
      disabled={disabled}
      onClick={onClick}
      className="bgb__inner"
    >
      {children}
    </button>
  );

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`bgb ${variantClass} ${sizeClass} ${className}`}
      style={style}
    >
      <span className="bgb__edge-light" />
      {inner}
    </div>
  );
}
