import { Fragment } from "react";

const items = [
  "FOTBOLL",
  "PARASPORT",
  "CALISTHENICS",
  "OCH MER",
  "FOTBOLL",
  "PARASPORT",
  "CALISTHENICS",
  "OCH MER",
];

export default function Marquee() {
  return (
    <div className="iv-marquee">
      <div className="iv-marquee-track">
        {[...items, ...items].map((it, i) => (
          <Fragment key={i}>
            <strong>{it}</strong>
            <span className="dot">●</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
