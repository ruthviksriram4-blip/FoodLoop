import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">REDUCE FOOD WASTE • SHARE HOPE</p>

          <h1>
            Share Surplus Food.
            <span> Feed Those in Need.</span>
          </h1>

          <p>
            FoodLoop connects food donors, NGOs and volunteers to
            redistribute surplus food to people who need it.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started
            </Link>

            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="food-icon">🥗</div>
          <h2>Good Food. Better Future.</h2>
          <p>Every meal shared makes a difference.</p>
        </div>
      </section>

      <section className="features">
        <h2>How FoodLoop Works</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🍱</div>
            <h3>Donors</h3>
            <p>Share surplus food with organizations that need it.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>NGOs</h3>
            <p>Discover available food and request donations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Volunteers</h3>
            <p>Collect and deliver food to complete the journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;