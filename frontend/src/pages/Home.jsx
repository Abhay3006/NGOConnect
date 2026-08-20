import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const token = localStorage.getItem("token");

  if (token) return null; // Hide hero if logged in

  return (
    <>
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="dot" />
            Make a difference today
          </span>

          <h1>
            Where compassion meets <span className="accent">community action</span>.
          </h1>

          <p>
            NGOConnect empowers citizens and verified NGOs to collaborate on
            real-world change â€” donate essentials, raise local issues, and
            volunteer your time. Every action counts.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started â€” It's Free
            </Link>
            <Link to="/login" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>

          <div className="trust-strip" aria-label="Trust signals">
            <span className="trust-pill">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              Verified NGOs
            </span>
            <span className="trust-pill">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              100% Secure Donations
            </span>
            <span className="trust-pill">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </span>
              Instant Updates
            </span>
            <span className="trust-pill">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              Trusted Community
            </span>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Impact stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="impact-section">
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="impact-num">10,000+</div>
            <p className="impact-label">Volunteers ready to help</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <div className="impact-num">â‚¹5L+</div>
            <p className="impact-label">Donations facilitated</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </div>
            <div className="impact-num">2,500+</div>
            <p className="impact-label">Community issues resolved</p>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="impact-num">120+</div>
            <p className="impact-label">Cities & towns served</p>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Features â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="features-section">
        <div className="section-head">
          <span className="eyebrow">What you can do</span>
          <h2>Three simple ways to create impact</h2>
          <p>
            Whether you have time, resources, or a voice â€” there's a meaningful
            way to contribute right here on NGOConnect.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card f1">
            <div className="ico">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <h3>Raise a complaint</h3>
            <p>
              Report sanitation, drainage, or civic issues in your area.
              Track resolution in real-time.
            </p>
          </div>
          <div className="feature-card f2">
            <div className="ico">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h3>Donate easily</h3>
            <p>
              Contribute money, food, clothes, or medical supplies â€” securely,
              with full transparency.
            </p>
          </div>
          <div className="feature-card f3">
            <div className="ico">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Volunteer your time</h3>
            <p>
              Join NGO drives near you. Share your skills and become part of
              something bigger.
            </p>
          </div>
          <div className="feature-card f4">
            <div className="ico">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3>See real impact</h3>
            <p>
              Live analytics show every complaint resolved, every rupee
              donated, every life touched.
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Testimonials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="testimonials">
        <div className="section-head">
          <span className="eyebrow">Stories of change</span>
          <h2>Real people. Real impact.</h2>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="quote">
              I reported a long-standing drainage issue in our colony, and it
              was resolved within a week. NGOConnect actually works.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">PS</div>
              <div className="testimonial-meta">
                <strong>Priya Sharma</strong>
                <span>Resident, Pune</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="quote">
              Donating clothes used to feel complicated. Here it took two
              minutes â€” and I know exactly where they went.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">RK</div>
              <div className="testimonial-meta">
                <strong>Rahul Kapoor</strong>
                <span>Donor, Bengaluru</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="quote">
              I signed up to volunteer on weekends and was matched with a
              teaching drive in 3 days. So fulfilling. â¤ï¸
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">AM</div>
              <div className="testimonial-meta">
                <strong>Ananya Mehta</strong>
                <span>Volunteer, Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Final CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="cta-banner">
        <h2>Ready to be part of the change?</h2>
        <p>
          Join thousands of citizens and NGOs creating measurable impact â€”
          one action at a time.
        </p>
        <Link to="/register" className="btn">
          Join NGOConnect Today â†’
        </Link>
      </section>
    </>
  );
}

export default Home;