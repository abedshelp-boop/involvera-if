import Link from "next/link";

export default function Footer() {
  return (
    <footer className="page-footer">
      <div>
        <div className="footer-brand">Involvera IF</div>
        <div className="footer-meta">
          Org.nr 802546-0307
          <br />
          Helsingborg, Sverige
          <br />
          kontakt@involvera.se
        </div>
      </div>
      <nav className="footer-nav">
        <Link href="/om-oss">Om Oss</Link>
        <Link href="/aktiviteter">Aktiviteter</Link>
        <Link href="/kontakt">Kontakt</Link>
      </nav>
    </footer>
  );
}
