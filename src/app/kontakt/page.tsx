"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import BorderGlowButton from "@/components/ui/BorderGlowButton";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("var(--green)");
  const [submitting, setSubmitting] = useState(false);

  const sendMessage = useMutation(api.contactMessages.send);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string)?.trim() || undefined;
    const message = (formData.get("message") as string).trim();

    if (!name || !email || !message) {
      setStatus("Fyll i alla obligatoriska fält.");
      setStatusColor("#ff5555");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      await sendMessage({ name, email, phone, message });
      form.reset();
      setStatusColor("var(--green)");
      setStatus("Meddelande skickat!");
      setTimeout(() => setStatus(""), 4500);
    } catch {
      setStatusColor("#ff5555");
      setStatus("Något gick fel. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollReveal />

      {/* Page Hero */}
      <section className="page-hero">
        <span className="hero-eyebrow">Hör av dig</span>
        <h1 className="page-title">
          <span className="title-line">
            <span>KONTAKT</span>
          </span>
        </h1>
      </section>

      <div className="divider" />

      {/* Contact layout */}
      <div className="contact-layout">
        {/* Left: contact info */}
        <div className="reveal-left">
          <span className="contact-info-label">Kontaktuppgifter</span>
          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="detail-label">E-post</span>
              <a href="mailto:kontakt@involvera.se" className="detail-value">
                kontakt@involvera.se
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="detail-label">Telefon</span>
              <a href="tel:+46707130508" className="detail-value">
                070-713 05 08
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="detail-label">Plats</span>
              <span className="detail-value">Helsingborg, Sverige</span>
            </div>
            <div className="contact-detail-item">
              <span className="detail-label">Org.nr</span>
              <span className="detail-value">802546-0307</span>
            </div>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="reveal-right">
          <span className="form-label-group">Skicka ett meddelande</span>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Namn</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ditt namn"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">E-post</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="din@epost.se"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="070-000 00 00"
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Meddelande</label>
              <textarea
                id="message"
                name="message"
                placeholder="Skriv ditt meddelande här..."
                required
              />
            </div>

            <div className="form-submit">
              <BorderGlowButton
                variant="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "SKICKAR…" : "SKICKA"}
              </BorderGlowButton>
              <span
                className="form-status"
                style={{ color: statusColor }}
                aria-live="polite"
              >
                {status}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* CTA */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 8vw",
        textAlign: "center",
      }}>
        <p className="reveal" style={{
          fontSize: "clamp(0.85rem, 1vw, 1rem)",
          fontWeight: 300,
          color: "var(--dim)",
          marginBottom: "2rem",
          maxWidth: "48ch",
          lineHeight: 1.8,
        }}>
          Vill du se vad vi erbjuder innan du hör av dig?
        </p>
        <BorderGlowButton variant="outline" href="/aktiviteter">Se Våra Aktiviteter</BorderGlowButton>
      </section>

      <Footer />
    </>
  );
}
