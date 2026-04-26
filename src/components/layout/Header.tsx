"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Hem" },
  { href: "/aktiviteter", label: "Aktiviteter" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`iv-nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="iv-logo">
          INVOLVERA<span className="iv-logo-tm">IF</span>
        </Link>
        <div className="iv-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="iv-nav-cta">
          <Link href="/kontakt" className="pill">
            Bli medlem
            <ArrowRight />
          </Link>
        </div>
        <button
          className={`iv-burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`iv-mobile-menu${menuOpen ? " open" : ""}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/kontakt" className="iv-mobile-menu-cta">
          Bli medlem
        </Link>
      </div>
    </>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
