type Card = {
  id: "fotboll" | "parasport" | "calisthenics" | "mer";
  n: string;
  tag: string;
  title: string;
  sub: string;
  desc: string;
  img: string;
};

const cards: Card[] = [
  {
    id: "fotboll",
    n: "01",
    tag: "Lagspel & Tävling",
    title: "FOTBOLL",
    sub: "Lagspel & tävling",
    desc: "Regelbunden träning, turneringar och aktiviteter utomhus och inomhus som bygger laganda, kondition och disciplin.",
    img: "/involvera-images/4.jpg",
  },
  {
    id: "parasport",
    n: "02",
    tag: "Inkludering",
    title: "PARASPORT",
    sub: "Mitt speciella barn",
    desc: "Genom vårt samarbete med Mitt speciella barn erbjuder vi anpassade aktiviteter för barn och unga med funktionsnedsättning. Vi tror på idrottens kraft att inkludera alla.",
    img: "/involvera-images/3.jpg",
  },
  {
    id: "calisthenics",
    n: "03",
    tag: "Pull & Dip",
    title: "CALISTHENICS",
    sub: "Kroppsvikt · Utomhus",
    desc: "Utomhusträning med kroppsvikt med fokus på styrka, uthållighet, kroppskontroll och mental toughness. Pull & Dip.",
    img: "/involvera-images/5.jpg",
  },
  {
    id: "mer",
    n: "04",
    tag: "Flexibelt utbud",
    title: "OCH MER",
    sub: "Vi växer med er",
    desc: "Vi utvärderar och anpassar kontinuerligt våra aktiviteter efter ungdomarnas behov för att erbjuda ett brett, relevant och spännande utbud.",
    img: "/involvera-images/6.jpg",
  },
];

export default function AktCards() {
  return (
    <section className="iv-akt-cards-section">
      <div className="iv-akt-cards-head">
        <h2>
          VAD VI<br />GÖR <span className="green">TILLSAMMANS.</span>
        </h2>
        <div className="iv-akt-cards-hint">
          <span className="pulse" />Håll muspekaren över korten
        </div>
      </div>
      <div className="iv-akt-cards">
        {cards.map((c) => (
          <div key={c.id} className={`iv-akt-card c-${c.id}`}>
            <div
              className="iv-akt-card-img"
              style={{ backgroundImage: `url(${c.img})` }}
            />
            <div className="iv-akt-card-overlay" />
            <div className="iv-akt-card-num">{c.n}</div>
            <div className="iv-akt-card-tag">{c.tag}</div>
            <div className="iv-akt-card-bottom">
              <div className="iv-akt-card-subtitle">{c.sub}</div>
              <h3 className="iv-akt-card-title">
                {c.title}
                <span className="period">.</span>
              </h3>
              <p className="iv-akt-card-desc">{c.desc}</p>
              <div className="iv-akt-card-cta">
                Läs mer <span className="arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
