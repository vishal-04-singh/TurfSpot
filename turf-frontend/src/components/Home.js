import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-page">
      
      <section className="hero">
        <div className="hero-content">
          <span className="section-label">Turf Booking System</span>
          <h1 className="display-hero">
            Book Your <span className="text-neon">Perfect</span> Turf
          </h1>
          <p className="body-large">
            Discover and book the best turf fields in your area.
            Whether you're planning a casual game or a tournament,
            TurfSpot has got you covered.
          </p>
          
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-neon">Get Started</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="caption">Turf Grounds</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="caption">Happy Players</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="caption">Booking Access</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="caption">Availability</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <span className="section-label">Why Choose TurfSpot</span>
        <h2 className="feature-heading">Premium Turf Booking</h2>
        
        <div className="features-grid">
          <div className="card">
            <h3 className="sub-heading">Easy Booking</h3>
            <p className="body-large">Book your preferred turf in just a few clicks. Simple, fast, and hassle-free.</p>
          </div>
          
          <div className="card">
            <h3 className="sub-heading">Real-time Availability</h3>
            <p className="body-large">See live slot availability and book instantly without waiting.</p>
          </div>
          
          <div className="card">
            <h3 className="sub-heading">Multiple Sports</h3>
            <p className="body-large">Find turfs for football, cricket, and more at the best venues.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="feature-heading">Ready to Play?</h2>
        <p className="body-large">Join thousands of players booking their favorite turfs every day.</p>
        <Link to="/register" className="btn btn-forest">Get Started</Link>
      </section>

    </div>
  );
}

export default Home;