import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

export default function HomePage() {
  const user = WebApp.initDataUnsafe.user;

  return (
    <>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Welcome{user ? `, ${user.first_name}` : ""}</h2>
        <p className="hint">
          Launch a personalized demo campaign in under 30 seconds, then track
          basic engagement metrics.
        </p>
        <Link to="/demo" className="btn" style={{ textAlign: "center", marginTop: 12 }}>
          Start demo campaign
        </Link>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>What you get in V1</h3>
        <ul className="hint" style={{ paddingLeft: 18 }}>
          <li>Interactive ad preview (mock personalization)</li>
          <li>Engagement rate over 50% in demo scenarios</li>
          <li>7-day basic analytics snapshot</li>
        </ul>
      </section>
    </>
  );
}
