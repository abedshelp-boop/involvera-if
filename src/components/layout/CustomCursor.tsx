"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   INVOLVERA IF — Custom cursor
   - Leader dot: tight smoothing, near 1:1
   - Trailer ring: heavy smoothing, lags with weight
   - Magnetises onto interactive surfaces (buttons, pills, bubbles)
   - Different states for links / buttons / fields / images / draggables
   - Click ripple
   - Hides native cursor while active; auto-disables on touch devices

   Ported verbatim from Claude Design's cursor.js. Wrapped in a useEffect
   so it runs once after hydration. The IIFE inside is idempotent
   (`__ivCursorBooted` guard) so a Fast Refresh re-run is safe.
   ═══════════════════════════════════════════════════════════ */
export default function CustomCursor() {
  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const w = window as any;
    if (w.__ivCursorBooted) return;
    w.__ivCursorBooted = true;

    // Touch / coarse pointer → bail, leave native cursor.
    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const GREEN = "#2ECC40";

    // ───────────────────────────────────────────────────────────
    // STYLES
    // ───────────────────────────────────────────────────────────
    const css = `
      :root { --iv-cur-accent: var(--iv-cursor-accent, ${GREEN}); }
      html.iv-cursor-on, html.iv-cursor-on * { cursor: none !important; }

      .iv-cur {
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        z-index: 2147483646;
        will-change: transform, width, height, border-radius, opacity;
        mix-blend-mode: normal;
      }

      /* Trailer ring */
      .iv-cur-ring {
        width: 34px; height: 34px;
        border: 1.25px solid rgba(255,255,255,0.55);
        border-radius: 999px;
        transform: translate(-50%, -50%);
        transition:
          width 380ms cubic-bezier(0.16,1,0.3,1),
          height 380ms cubic-bezier(0.16,1,0.3,1),
          border-radius 380ms cubic-bezier(0.16,1,0.3,1),
          border-color 240ms ease,
          background-color 240ms ease,
          opacity 240ms ease;
      }

      /* Leader dot */
      .iv-cur-dot {
        width: 5px; height: 5px;
        background: var(--iv-cur-accent);
        border-radius: 999px;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px color-mix(in srgb, var(--iv-cur-accent) 55%, transparent),
                    0 0 22px color-mix(in srgb, var(--iv-cur-accent) 25%, transparent);
        transition:
          width 220ms cubic-bezier(0.16,1,0.3,1),
          height 220ms cubic-bezier(0.16,1,0.3,1),
          opacity 200ms ease,
          background 200ms ease;
      }

      /* Optional label that hangs off the cursor on hover */
      .iv-cur-label {
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(14px, 14px);
        font-family: "DM Sans", system-ui, sans-serif;
        font-size: 10px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        font-weight: 500;
        color: #0a0a0a;
        background: var(--iv-cur-accent);
        padding: 5px 9px 4px;
        border-radius: 100px;
        opacity: 0;
        transition: opacity 200ms ease, transform 280ms cubic-bezier(0.16,1,0.3,1);
        white-space: nowrap;
      }
      .iv-cur-label.show { opacity: 1; transform: translate(18px, 18px); }

      /* ── States ─────────────────────────────── */

      /* Link / generic interactive — ring grows, dot fades */
      .iv-cur.link .iv-cur-ring {
        width: 52px; height: 52px;
        border-color: var(--iv-cur-accent);
        background: color-mix(in srgb, var(--iv-cur-accent) 6%, transparent);
      }
      .iv-cur.link .iv-cur-dot {
        width: 3px; height: 3px;
        opacity: 0.85;
      }

      /* Button / pill — magnetised rectangle */
      .iv-cur.button .iv-cur-ring {
        border-color: var(--iv-cur-accent);
        background: color-mix(in srgb, var(--iv-cur-accent) 10%, transparent);
        border-width: 1px;
        mix-blend-mode: normal;
      }
      .iv-cur.button .iv-cur-dot { opacity: 0; }

      /* Form field — I-beam */
      .iv-cur.field .iv-cur-ring {
        width: 2px; height: 22px;
        border-radius: 1px;
        border: none;
        background: var(--iv-cur-accent);
        animation: iv-ibeam 1s steps(2) infinite;
      }
      .iv-cur.field .iv-cur-dot { opacity: 0; }
      @keyframes iv-ibeam { 50% { opacity: 0.25; } }

      /* Image / large surface — viewfinder */
      .iv-cur.view .iv-cur-ring {
        width: 92px; height: 92px;
        border-color: rgba(255,255,255,0.5);
        border-radius: 6px;
        background: transparent;
      }
      .iv-cur.view .iv-cur-dot {
        width: 3px; height: 3px;
        background: #fff;
        box-shadow: none;
      }

      /* Drag */
      .iv-cur.drag .iv-cur-ring {
        width: 60px; height: 60px;
        border-color: var(--iv-cur-accent);
        background: color-mix(in srgb, var(--iv-cur-accent) 8%, transparent);
        border-style: dashed;
      }

      /* Disabled */
      .iv-cur.disabled .iv-cur-ring {
        border-color: rgba(255,80,80,0.6);
        background: rgba(255,80,80,0.04);
      }
      .iv-cur.disabled .iv-cur-dot { background: #ff5050; box-shadow: 0 0 10px rgba(255,80,80,0.5); }

      /* Mouse pressed — quick contract */
      .iv-cur.down .iv-cur-ring {
        transform: translate(-50%, -50%) scale(0.7);
      }
      .iv-cur.down .iv-cur-dot {
        transform: translate(-50%, -50%) scale(1.4);
      }

      /* Hidden when leaving window */
      .iv-cur.gone { opacity: 0; }

      /* Click ripple */
      .iv-cur-ripple {
        position: fixed;
        top: 0; left: 0;
        pointer-events: none;
        z-index: 2147483645;
        width: 18px; height: 18px;
        border-radius: 999px;
        border: 1.5px solid var(--iv-cur-accent);
        transform: translate(-50%, -50%) scale(0.4);
        opacity: 0.85;
        animation: iv-ripple 600ms cubic-bezier(0.16,1,0.3,1) forwards;
      }
      @keyframes iv-ripple {
        to { transform: translate(-50%, -50%) scale(3.4); opacity: 0; }
      }
    `;
    const styleEl = document.createElement("style");
    styleEl.id = "iv-cur-style";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ───────────────────────────────────────────────────────────
    // ELEMENTS
    // ───────────────────────────────────────────────────────────
    const ring = document.createElement("div");
    ring.className = "iv-cur iv-cur-ring-host";
    ring.innerHTML = '<div class="iv-cur-ring"></div>';
    document.body.appendChild(ring);

    const dot = document.createElement("div");
    dot.className = "iv-cur iv-cur-dot-host";
    dot.innerHTML = '<div class="iv-cur-dot"></div>';
    document.body.appendChild(dot);

    const label = document.createElement("div");
    label.className = "iv-cur-label";
    document.body.appendChild(label);

    document.documentElement.classList.add("iv-cursor-on");

    // ───────────────────────────────────────────────────────────
    // STATE
    // ───────────────────────────────────────────────────────────
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    const dotPos = { x: target.x, y: target.y };

    // Spring constants (lower = more lag/weight)
    const RING_EASE = 0.18; // trailer
    const DOT_EASE = 0.42; // leader

    let magnetEl: Element | null = null;
    let magnetRect: DOMRect | null = null;
    let stateClass = "";

    // ───────────────────────────────────────────────────────────
    // CLASSIFY ELEMENT
    // ───────────────────────────────────────────────────────────
    const FIELD_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
    const FIELD_TYPES_NON_TEXT = new Set([
      "checkbox",
      "radio",
      "submit",
      "button",
      "reset",
      "range",
      "color",
      "file",
    ]);

    type Kind =
      | "idle"
      | "link"
      | "button"
      | "field"
      | "view"
      | "drag"
      | "disabled";
    type Classification = { kind: Kind; el: Element | null; label: string | null };

    function classify(el: Element | null): Classification {
      if (!el) return { kind: "idle", el: null, label: null };

      let cur: Element | null = el;
      let hops = 0;
      while (cur && cur !== document.body && hops < 6) {
        const tag = cur.tagName;
        const anyEl = cur as any;

        if (
          cur.hasAttribute &&
          cur.hasAttribute("aria-disabled") &&
          cur.getAttribute("aria-disabled") === "true"
        ) {
          return { kind: "disabled", el: cur, label: null };
        }
        if (tag === "BUTTON" && anyEl.disabled) {
          return { kind: "disabled", el: cur, label: null };
        }

        if (FIELD_TAGS.has(tag)) {
          const t = (anyEl.type || "").toLowerCase();
          if (FIELD_TYPES_NON_TEXT.has(t)) {
            return { kind: "button", el: cur, label: null };
          }
          return { kind: "field", el: cur, label: null };
        }

        if (anyEl.isContentEditable) {
          return { kind: "field", el: cur, label: null };
        }

        if (
          tag === "BUTTON" ||
          (cur.getAttribute && cur.getAttribute("role") === "button") ||
          (cur.classList &&
            (cur.classList.contains("pill") ||
              cur.classList.contains("iv-wa-bubble") ||
              cur.classList.contains("iv-wa-floater") ||
              cur.classList.contains("iv-picker-next") ||
              cur.classList.contains("iv-picker-select") ||
              cur.classList.contains("iv-wa-hero-cta") ||
              cur.classList.contains("iv-btn-primary") ||
              cur.classList.contains("iv-mobile-menu-cta") ||
              cur.classList.contains("whatsapp-fab") ||
              /* Sub-page CTA buttons that render as <a> via next/link.
                 Without these, classify falls through to the link branch
                 and the cursor doesn't magnetise onto the button shape. */
              cur.classList.contains("iv-om-btn-primary") ||
              cur.classList.contains("iv-om-btn-outline") ||
              cur.classList.contains("iv-akt-cta-btn") ||
              cur.classList.contains("iv-kt-btn") ||
              cur.classList.contains("iv-kt-cta-btn") ||
              cur.classList.contains("pc-contact-btn") ||
              cur.classList.contains("bgb__inner")))
        ) {
          const lab = cur.getAttribute("data-cursor-label");
          return { kind: "button", el: cur, label: lab };
        }

        if (tag === "A") {
          const lab = cur.getAttribute("data-cursor-label");
          return { kind: "link", el: cur, label: lab };
        }

        // Opt-in only: an element must explicitly carry data-cursor="view"
        // to get the viewfinder cursor. We used to also treat IMG tags and
        // .iv-hero-bg as "view" surfaces, but that implied clickability
        // where there was none — confusing on the homepage hero.
        if (cur.getAttribute && cur.getAttribute("data-cursor") === "view") {
          return {
            kind: "view",
            el: cur,
            label: cur.getAttribute("data-cursor-label") || "View",
          };
        }

        if (cur.getAttribute && cur.getAttribute("data-cursor") === "drag") {
          return {
            kind: "drag",
            el: cur,
            label: cur.getAttribute("data-cursor-label") || "Drag",
          };
        }

        hops++;
        cur = cur.parentElement;
      }
      return { kind: "idle", el: null, label: null };
    }

    function setState(kind: Kind, el: Element | null, lab: string | null) {
      if (kind === stateClass && el === magnetEl) return;
      stateClass = kind;

      [ring, dot].forEach((host) => {
        host.classList.remove(
          "link",
          "button",
          "field",
          "view",
          "drag",
          "disabled"
        );
        if (kind && kind !== "idle") host.classList.add(kind);
      });

      if (kind === "button" && el) {
        magnetEl = el;
        magnetRect = el.getBoundingClientRect();
      } else {
        magnetEl = null;
        magnetRect = null;
      }

      if (lab) {
        label.textContent = lab;
        label.classList.add("show");
      } else {
        label.classList.remove("show");
      }
    }

    // ───────────────────────────────────────────────────────────
    // MOVE
    // ───────────────────────────────────────────────────────────
    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      ring.classList.remove("gone");
      dot.classList.remove("gone");

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const c = classify(el);
      setState(c.kind, c.el, c.label);

      if (magnetEl) {
        magnetRect = magnetEl.getBoundingClientRect();
      }
    }

    function onLeave() {
      ring.classList.add("gone");
      dot.classList.add("gone");
      label.classList.remove("show");
    }

    function onEnter() {
      ring.classList.remove("gone");
      dot.classList.remove("gone");
    }

    function onDown() {
      ring.classList.add("down");
      dot.classList.add("down");

      const r = document.createElement("div");
      r.className = "iv-cur-ripple";
      r.style.left = target.x + "px";
      r.style.top = target.y + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 650);
    }

    function onUp() {
      ring.classList.remove("down");
      dot.classList.remove("down");
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onLeave);

    // ───────────────────────────────────────────────────────────
    // RAF LOOP
    // ───────────────────────────────────────────────────────────
    let rafId = 0;
    function tick() {
      let rx = target.x;
      let ry = target.y;

      if (magnetRect) {
        const cx = magnetRect.left + magnetRect.width / 2;
        const cy = magnetRect.top + magnetRect.height / 2;
        rx = cx + (target.x - cx) * 0.22;
        ry = cy + (target.y - cy) * 0.22;
      }

      ringPos.x += (rx - ringPos.x) * RING_EASE;
      ringPos.y += (ry - ringPos.y) * RING_EASE;
      dotPos.x += (target.x - dotPos.x) * DOT_EASE;
      dotPos.y += (target.y - dotPos.y) * DOT_EASE;

      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;

      const ringChild = ring.firstElementChild as HTMLElement | null;
      if (ringChild) {
        if (magnetRect && stateClass === "button" && magnetEl) {
          const padX = 18,
            padY = 14;
          ringChild.style.width = magnetRect.width + padX + "px";
          ringChild.style.height = magnetRect.height + padY + "px";
          const cs = getComputedStyle(magnetEl);
          let br = cs.borderRadius;
          if (br === "0px" || !br) br = "8px";
          ringChild.style.borderRadius = br;
        } else {
          if (ringChild.style.width) ringChild.style.width = "";
          if (ringChild.style.height) ringChild.style.height = "";
          if (ringChild.style.borderRadius) ringChild.style.borderRadius = "";
        }
      }

      label.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (label.classList.contains("show")) {
        label.style.transform = `translate3d(${target.x + 18}px, ${
          target.y + 18
        }px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // ───────────────────────────────────────────────────────────
    // PUBLIC API — let pages toggle the cursor on/off (for tweaks)
    // ───────────────────────────────────────────────────────────
    w.IvCursor = {
      enable() {
        document.documentElement.classList.add("iv-cursor-on");
        ring.style.display = "";
        dot.style.display = "";
      },
      disable() {
        document.documentElement.classList.remove("iv-cursor-on");
        ring.style.display = "none";
        dot.style.display = "none";
        label.classList.remove("show");
      },
    };

    return () => {
      // Defensive cleanup if the component unmounts (rare in Next app router).
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onLeave);
      ring.remove();
      dot.remove();
      label.remove();
      styleEl.remove();
      document.documentElement.classList.remove("iv-cursor-on");
      w.__ivCursorBooted = false;
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }, []);

  return null;
}
