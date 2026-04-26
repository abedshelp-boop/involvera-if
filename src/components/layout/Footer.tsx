import Link from "next/link";

export default function Footer() {
  return (
    <footer className="iv-footer">
      <div className="iv-footer-grid">
        <div>
          <div className="iv-footer-logo">
            INVOLVERA<span className="iv-logo-tm">IF</span>
          </div>
          <div className="iv-footer-tag">
            Idrott för alla i Helsingborg. Fotboll, parasport, calisthenics —
            och allt däremellan.
          </div>
        </div>
        <div>
          <div className="iv-footer-col-label">Sporter</div>
          <div className="iv-footer-col">
            <Link href="/aktiviteter">Fotboll</Link>
            <Link href="/aktiviteter">Parasport</Link>
            <Link href="/aktiviteter">Calisthenics</Link>
            <Link href="/aktiviteter">Och mer</Link>
          </div>
        </div>
        <div>
          <div className="iv-footer-col-label">Föreningen</div>
          <div className="iv-footer-col">
            <Link href="/om-oss">Om oss</Link>
            <Link href="/om-oss">Tränare</Link>
            <Link href="/om-oss">Stadgar</Link>
            <Link href="/kontakt">Sponsra</Link>
          </div>
        </div>
        <div>
          <div className="iv-footer-col-label">Kontakt</div>
          <div className="iv-footer-col">
            <span>Helsingborg, Sverige</span>
            <a href="mailto:kontakt@involvera.se">kontakt@involvera.se</a>
            <a href="tel:0707130508">070-713 05 08</a>
          </div>
        </div>
      </div>
      <div className="iv-footer-bottom">
        <div>© 2026 Involvera IF · Org. 802546-0307</div>
        <div>
          Made with <span style={{ color: "#2ECC40" }}>♥</span> in Helsingborg
        </div>
      </div>
    </footer>
  );
}
