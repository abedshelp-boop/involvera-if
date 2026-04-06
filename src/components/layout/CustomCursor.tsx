"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ mx: -100, my: -100, rx: -100, ry: -100 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    let rafId: number;
    const trackRing = () => {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.12;
      p.ry += (p.my - p.ry) * 0.12;
      ring.style.left = p.rx + "px";
      ring.style.top = p.ry + "px";
      rafId = requestAnimationFrame(trackRing);
    };

    const onEnterInteractive = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
      ring.style.transform = "translate(-50%, -50%) scale(1.6)";
      ring.style.borderColor = "rgba(46, 204, 64, 0.7)";
    };

    const onLeaveInteractive = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.borderColor = "rgba(46, 204, 64, 0.35)";
    };

    const onEnterInput = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.3)";
      ring.style.transform = "translate(-50%, -50%) scale(2.2)";
      ring.style.borderColor = "#2ECC40";
      ring.style.borderWidth = "2px";
      ring.style.background = "rgba(46,204,64,0.08)";
    };

    const onLeaveInput = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.borderColor = "rgba(46,204,64,0.35)";
      ring.style.borderWidth = "1.5px";
      ring.style.background = "transparent";
    };

    document.addEventListener("mousemove", onMouseMove);
    trackRing();

    const bindHovers = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      document.querySelectorAll("input, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", onEnterInput);
        el.addEventListener("mouseleave", onLeaveInput);
      });
    };

    // Bind now and re-bind on DOM changes
    bindHovers();
    const observer = new MutationObserver(bindHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
