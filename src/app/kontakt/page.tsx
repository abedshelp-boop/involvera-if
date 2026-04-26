"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import Footer from "@/components/layout/Footer";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; text: string }
  | { kind: "err"; text: string };

function useReveal<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh - 40 && r.bottom > 0) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    let cleanedUp = false;
    const onScroll = () => {
      if (check()) cleanup();
    };
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      clearTimeout(safety);
    };

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);

    let io: IntersectionObserver | undefined;
    try {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setVisible(true);
              cleanup();
            }
          });
        },
        { threshold: 0.01 },
      );
      io.observe(el);
    } catch {
      // IntersectionObserver unavailable — scroll handler still runs.
    }

    const safety = setTimeout(() => {
      setVisible(true);
      cleanup();
    }, 1500);

    return cleanup;
  }, []);

  return [ref, visible];
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

function KtHero() {
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <section className="iv-kt-hero">
      <div className="iv-kt-hero-grid" />
      <div
        ref={ref}
        className={`iv-kt-hero-inner iv-kt-reveal up ${visible ? "in" : ""}`}
      >
        <div className="iv-kt-hero-eyebrow">Hör av dig</div>
        <h1 className="iv-kt-hero-title">
          KONTAK<span className="green">T</span>
        </h1>
        <div className="iv-kt-hero-divider" />
      </div>
    </section>
  );
}

type DetailRow = {
  label: string;
  value: string;
  href?: string;
};

const detailRows: DetailRow[] = [
  { label: "E-post", value: "kontakt@involvera.se", href: "mailto:kontakt@involvera.se" },
  { label: "Telefon", value: "070-713 05 08", href: "tel:+46707130508" },
  { label: "Plats", value: "Helsingborg, Sverige" },
  { label: "Org.nr", value: "802546-0307" },
];

function KtDetails() {
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`iv-kt-reveal ${visible ? "in" : ""}`}>
      <div className="iv-kt-col-label">
        <span className="dash" /> Kontaktuppgifter
      </div>
      <div className="iv-kt-details">
        {detailRows.map((r) => (
          <div key={r.label} className="iv-kt-detail">
            <div className="iv-kt-detail-label">{r.label}</div>
            {r.href ? (
              <a href={r.href} className="iv-kt-detail-value link">
                {r.value}
              </a>
            ) : (
              <div className="iv-kt-detail-value">{r.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function KtForm() {
  const [ref, visible] = useReveal<HTMLFormElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sendMessage = useMutation(api.contactMessages.send);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "loading") return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus({ kind: "err", text: "Fyll i alla obligatoriska fält." });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      await sendMessage({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        message: trimmedMessage,
      });
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setStatus({ kind: "ok", text: "Meddelande skickat!" });
    } catch {
      setStatus({ kind: "err", text: "Något gick fel. Försök igen." });
    }
  };

  const loading = status.kind === "loading";
  const statusText =
    status.kind === "ok" || status.kind === "err" ? status.text : "";
  const statusCls =
    status.kind === "ok"
      ? "iv-kt-status ok"
      : status.kind === "err"
        ? "iv-kt-status err"
        : "iv-kt-status";

  return (
    <form
      ref={ref}
      className={`iv-kt-form iv-kt-reveal from-right ${visible ? "in" : ""}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className="iv-kt-col-label">
        <span className="dash" /> Skicka ett meddelande
      </div>

      <div className="iv-kt-form-grid">
        <div className="iv-kt-fld">
          <label htmlFor="kt-name">
            Namn <span className="req">*</span>
          </label>
          <input
            id="kt-name"
            type="text"
            placeholder="Ditt namn"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="iv-kt-fld">
          <label htmlFor="kt-email">
            E-post <span className="req">*</span>
          </label>
          <input
            id="kt-email"
            type="email"
            placeholder="din@epost.se"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="iv-kt-fld full">
          <label htmlFor="kt-phone">Telefon</label>
          <input
            id="kt-phone"
            type="tel"
            placeholder="070-000 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="iv-kt-fld full">
          <label htmlFor="kt-message">
            Meddelande <span className="req">*</span>
          </label>
          <textarea
            id="kt-message"
            placeholder="Skriv ditt meddelande här..."
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="iv-kt-submit-row">
        <button type="submit" className="iv-kt-btn" disabled={loading}>
          {loading ? "SKICKAR…" : <>SKICKA <ArrowRight /></>}
        </button>
        <span className={statusCls} aria-live="polite">
          {statusText && <span className="dot" />}
          {statusText}
        </span>
      </div>
    </form>
  );
}

function KtCta() {
  const [ref, visible] = useReveal<HTMLDivElement>();
  return (
    <section className="iv-kt-cta">
      <div
        ref={ref}
        className={`iv-kt-cta-inner iv-kt-reveal up ${visible ? "in" : ""}`}
      >
        <div className="iv-kt-cta-line">
          Vill du se vad vi erbjuder innan du hör av dig?
        </div>
        <Link href="/aktiviteter" className="iv-kt-cta-btn">
          Se Våra Aktiviteter <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

function KtLayout({ children }: { children: ReactNode }) {
  return (
    <section className="iv-kt-layout">
      <div className="iv-kt-grid">{children}</div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <KtHero />
      <KtLayout>
        <KtDetails />
        <KtForm />
      </KtLayout>
      <KtCta />
      <Footer />
    </>
  );
}
