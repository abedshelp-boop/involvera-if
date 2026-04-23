"use client";

type Activity = {
  title: string;
  label: string;
  desc: string;
  image: string;
};

export default function ActivityCardsMobile({ activities }: { activities: Activity[] }) {
  return (
    <div className="activity-cards-mobile-grid">
      {activities.map((a) => (
        <article
          key={a.title}
          className="activity-card-mobile"
          style={{ backgroundImage: `url('${a.image}')` }}
        >
          <div className="activity-card-mobile-overlay" />
          <div className="activity-card-mobile-body">
            <span className="activity-card-mobile-label">{a.label}</span>
            <h3 className="activity-card-mobile-title">{a.title}</h3>
            <p className="activity-card-mobile-desc">{a.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
