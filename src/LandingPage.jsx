import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const IMAGES = {
  hero: "/images/hero.jpg",
  cta: "/images/gallery2.jpg",
};

function VerifiedTag() {
  return (
    <span className="verified-tag">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      VERIFIED
    </span>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bb-root">
      {/* ===== HEADER ===== */}
      <header>
        <div className="navbar">
          <a href="/" className="brand">
            <span className="dot"></span>BloodBridge
          </a>
          <nav className="nav-links">
            <a href="#how">How it works</a>
            <a href="#audiences">For hospitals</a>
            <a href="#roles">Roles</a>
            <a href="#features">Features</a>
          </nav>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/login")}
              type="button"
            >
              Log in
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/emergency-request")}
              type="button"
            >
              Emergency request
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Live across 40+ verified facilities</div>
            <h1>
              When blood is out of stock, <span>the search shouldn't be manual.</span>
            </h1>
            <p className="lead">
              BloodBridge connects hospitals, blood banks and verified volunteer donors in one live network — so an empty shelf turns into a matched unit in minutes, not phone calls.
            </p>
            <div className="hero-ctas">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/emergency-request")}
              >
                Request blood now — no login
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/donor")}
              >
                Become a donor
              </button>
            </div>
            <p className="hero-note">
              <b>No hospital name is ever typed manually</b> — every request links to a pre-verified facility, so donors always arrive somewhere real.
            </p>
          </div>

          <div className="hero-media">
            <img src={IMAGES.hero} alt="Emergency response team" className="hero-photo" />
            <div className="hero-float-card hero-stat-card">
              <div className="hero-stat-num">
                08<span>min</span>
              </div>
              <div className="hero-stat-lbl">Average time to match a unit</div>
            </div>
            <div className="hero-float-card hero-verify-card">
              <VerifiedTag />
              <span>312 donors on standby nearby</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats">
        <div className="wrap stats-grid">
          <div className="stat">
            <div className="num">
              08<span className="unit">min</span>
            </div>
            <div className="lbl">Average time to match a unit</div>
          </div>
          <div className="stat">
            <div className="num">312</div>
            <div className="lbl">Verified donors on standby nearby</div>
          </div>
          <div className="stat">
            <div className="num">
              96<span className="unit">%</span>
            </div>
            <div className="lbl">Requests resolved without transfer</div>
          </div>
          <div className="stat">
            <div className="num">24/7</div>
            <div className="lbl">Emergency request line, no login</div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="wrap cta-wrap" id="emergency">
        <div className="cta-band" style={{ backgroundImage: `url(${IMAGES.cta})` }}>
          <div className="cta-band-overlay"></div>
          <div className="cta-band-content">
            <div>
              <h3>Need blood right now?</h3>
              <p>Submit an emergency request without an account. Select a verified facility, and the search starts immediately.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/emergency-request")}
            >
              Start emergency request →
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="wrap foot-grid">
          <div className="foot-col">
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="dot"></span>BloodBridge
            </div>
            <p style={{ color: "var(--ink-dim)", fontSize: 13.5, maxWidth: 280 }}>
              A coordination layer for blood emergencies — not a replacement for hospital systems, blood-bank protocol, or medical judgment.
            </p>
          </div>
          <div className="foot-col">
            <h5>Platform</h5>
            <a href="#how">How it works</a>
            <a href="#roles">Roles</a>
            <a href="#features">Features</a>
          </div>
          <div className="foot-col">
            <h5>Get started</h5>
            <a href="#">Hospital registration</a>
            <a href="#">Blood bank registration</a>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                font: "inherit",
                padding: 0,
              }}
              onClick={() => navigate("/donor")}
            >
              Become a volunteer
            </button>
          </div>
          <div className="foot-col">
            <h5>Support</h5>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
            <a href="#">Privacy &amp; terms</a>
          </div>
        </div>
        <div className="wrap foot-bottom">
          <span>© 2026 BloodBridge. All facilities are independently verified.</span>
          <span>Built for hospitals, blood banks &amp; volunteers.</span>
        </div>
      </footer>
    </div>
  );
}
