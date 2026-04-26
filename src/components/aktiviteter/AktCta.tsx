import Link from "next/link";

export default function AktCta() {
  return (
    <section className="iv-akt-cta-block">
      <div className="iv-akt-cta-eyebrow">Klar att börja?</div>
      <h2>
        REDO ATT<br />BÖR<span className="green">JA?</span>
      </h2>
      <p className="iv-akt-cta-sub">
        Oavsett om du vill spela fotboll, träna calisthenics eller delta i
        parasport — vi har plats för dig.
      </p>
      <Link href="/kontakt" className="iv-akt-cta-btn">
        Kontakta oss <span style={{ fontSize: 16 }}>→</span>
      </Link>
      <div className="iv-akt-cta-foot">
        Svar inom 24 timmar · Helsingborg
      </div>
    </section>
  );
}
