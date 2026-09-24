import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveBackground from '../components/InteractiveBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

const capabilities = [
  {
    icon: '🌐',
    title: 'Modern Websites',
    description: 'Responsive business websites and landing pages designed for credibility, speed, and conversion.',
  },
  {
    icon: '⚙️',
    title: 'Web Applications',
    description: 'Full-stack dashboards, portals, internal tools, customer platforms, and custom web products.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Solutions',
    description: 'AI chatbots, intelligent assistants, document workflows, and AI-enhanced products.',
  },
  {
    icon: '⚡',
    title: 'Business Automation',
    description: 'Automate repetitive tasks, connect tools, and streamline operational workflows.',
  },
  {
    icon: '🧩',
    title: 'Custom Software',
    description: 'Software tailored around specific business processes, requirements, and growth plans.',
  },
  {
    icon: '🎨',
    title: 'UI/UX & Optimization',
    description: 'Redesign, performance improvements, bug fixes, responsive improvements, and usability refinement.',
  },
];

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      const result = await apiRequest('/services', { method: 'GET' });

      if (!result.ok) {
        throw new Error(result.error || 'Failed to fetch services');
      }

      const services = Array.isArray(result.data) ? result.data : [];
      setFeaturedServices(
        services.filter((service) => service.featured === true).slice(0, 3),
      );
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedServices();
    // The retry button intentionally reuses this same request handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="home-page" data-authenticated={isAuthenticated}>
      <section className="home-hero">
        <InteractiveBackground intensity="hero" />
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">DEVSKD</p>
          <h1 className="home-hero-title">
            Building Digital Products
            <br />
            That Move Businesses Forward
          </h1>
          <p className="home-hero-subtitle">
            We design and build modern websites, web applications, AI-powered
            solutions, automations, and custom software that help businesses
            work smarter and grow.
          </p>
          <div className="home-hero-actions">
            <Link to="/contact" className="btn-primary">Start a Project →</Link>
            <Link to="/services" className="btn-ghost">Explore Our Work</Link>
          </div>
          <p className="home-hero-trust">
            Built with modern technology. Designed for real users. Ready to
            grow with your business.
          </p>
        </div>
      </section>

      <section className="section-container home-capabilities">
        <p className="section-eyebrow">What We Build</p>
        <h2 className="section-title">Services That Solve Real Problems</h2>
        <p className="section-subtitle">
          From company websites to AI-powered workflows, we build practical
          digital solutions for real business needs.
        </p>

        <div className="home-capabilities-grid">
          {capabilities.map((capability) => (
            <article className="card-surface" key={capability.title}>
              <span className="home-capability-icon">{capability.icon}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container home-featured">
        <p className="section-eyebrow">Selected Work</p>
        <h2 className="section-title">Featured Services</h2>
        <p className="section-subtitle">
          Explore selected projects across web development, AI, automation,
          and custom software.
        </p>

        {loading && <LoadingSpinner />}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button type="button" onClick={fetchFeaturedServices} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        {!loading && !error && featuredServices.length === 0 && (
          <p className="home-empty">More work coming soon.</p>
        )}
        {!loading && !error && featuredServices.length > 0 && (
          <div className="home-featured-grid">
            {featuredServices.map((service) => (
              <Link
                to={`/services/${service._id}`}
                className="card-surface home-featured-card"
                key={service._id}
              >
                <span className="home-capability-icon">{service.icon || '💡'}</span>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section-container home-process">
        <p className="section-eyebrow">How We Develop</p>
        <h2 className="section-title">A Structured Engineering Process</h2>
        <p className="section-subtitle">
          Every project follows a clear path — from understanding the business
          problem to delivering a production system.
        </p>

        <ol className="home-process-list">
          <li className="home-process-step">
            <span className="home-process-number">01</span>
            <div className="home-process-body">
              <h3>Discovery &amp; Requirements</h3>
              <p>Understand goals, users, current problems, and project scope.</p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">02</span>
            <div className="home-process-body">
              <h3>Planning &amp; Architecture</h3>
              <p>
                Define user flows, data structure, APIs, technology choices,
                and milestones.
              </p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">03</span>
            <div className="home-process-body">
              <h3>UI/UX Design</h3>
              <p>Create the interface, components, and responsive experience.</p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">04</span>
            <div className="home-process-body">
              <h3>Development</h3>
              <p>Build the product in focused modules with clean, maintainable code.</p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">05</span>
            <div className="home-process-body">
              <h3>Testing &amp; Refinement</h3>
              <p>
                Validate functionality, responsiveness, performance, and edge
                cases.
              </p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">06</span>
            <div className="home-process-body">
              <h3>Deployment</h3>
              <p>Configure the production environment and launch the product.</p>
            </div>
          </li>
          <li className="home-process-step">
            <span className="home-process-number">07</span>
            <div className="home-process-body">
              <h3>Support &amp; Improvement</h3>
              <p>Fix issues, maintain the system, and add agreed improvements.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section-container home-why">
        <p className="section-eyebrow">Why DevSKD</p>
        <h2 className="section-title">Why Businesses Work With DevSKD</h2>
        <p className="section-subtitle">
          Six reasons companies choose us as their engineering partner.
        </p>

        <div className="home-why-grid">
          <article className="card-surface home-why-card">
            <span className="home-why-number">01</span>
            <h3>Practical Engineering</h3>
            <p>We focus on useful solutions, not technology for its own sake.</p>
          </article>
          <article className="card-surface home-why-card">
            <span className="home-why-number">02</span>
            <h3>Modern &amp; Scalable</h3>
            <p>
              We build with maintainability, performance, and future growth in
              mind.
            </p>
          </article>
          <article className="card-surface home-why-card">
            <span className="home-why-number">03</span>
            <h3>Clear Communication</h3>
            <p>
              Requirements, milestones, progress, and expectations stay
              understandable.
            </p>
          </article>
          <article className="card-surface home-why-card">
            <span className="home-why-number">04</span>
            <h3>Product Mindset</h3>
            <p>
              We consider the user, workflow, business objective, and technical
              system together.
            </p>
          </article>
          <article className="card-surface home-why-card">
            <span className="home-why-number">05</span>
            <h3>Flexible for Growing Businesses</h3>
            <p>
              Solutions can start focused and expand as requirements become
              clearer.
            </p>
          </article>
          <article className="card-surface home-why-card">
            <span className="home-why-number">06</span>
            <h3>Long-Term Partnership</h3>
            <p>
              Support, fixes, improvements, and future features can continue
              after launch.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div className="section-container">
          <h2 className="section-title">Have an Idea? Let's Build It.</h2>
          <p className="section-subtitle home-cta-subtitle">
            Tell us what you're trying to build, and we'll help you define a
            practical path forward.
          </p>
          <div className="home-cta-actions">
            <Link to="/contact" className="btn-primary">Start a Project →</Link>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          color: var(--text-primary);
          background: var(--bg-primary);
        }

        .home-hero {
          position: relative;
          min-height: 600px;
          overflow: hidden;
          padding: 120px 24px 100px;
          background: var(--bg-primary);
        }

        .home-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .home-hero-eyebrow {
          color: var(--brand-primary);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
        }

        .home-hero-title {
          color: var(--text-primary);
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .home-hero-subtitle {
          max-width: 700px;
          margin: 0 auto 32px;
          color: var(--text-secondary);
          font-size: clamp(1rem, 2vw, 1.2rem);
          line-height: 1.6;
        }

        .home-hero-actions,
        .home-cta-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .home-hero-actions {
          margin-bottom: 32px;
        }

        .home-hero-trust {
          color: var(--text-tertiary);
          font-size: 0.85rem;
          letter-spacing: 0.02em;
        }

        .home-capabilities,
        .home-featured,
        .home-process,
        .home-why {
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .home-capabilities-grid,
        .home-featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 40px;
        }

        .home-capability-icon {
          display: block;
          margin-bottom: 12px;
          font-size: 1.8rem;
        }

        .home-capabilities-grid h3,
        .home-featured-card h3 {
          color: var(--text-primary);
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .home-capabilities-grid p,
        .home-featured-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .home-featured-card {
          color: var(--text-primary);
          text-decoration: none;
        }

        .home-empty {
          margin-top: 40px;
          color: var(--text-tertiary);
        }

        .home-process-list {
          list-style: none;
          margin: 48px 0 0;
          padding: 0;
          display: grid;
          gap: 0;
        }

        .home-process-step {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }

        .home-process-step:last-child {
          border-bottom: none;
        }

        .home-process-number {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--brand-primary);
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          padding-top: 4px;
        }

        .home-process-body h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .home-process-body p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .home-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 40px;
        }

        .home-why-number {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--brand-primary);
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          font-variant-numeric: tabular-nums;
        }

        .home-why-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .home-why-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .home-cta {
          padding: 80px 24px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }

        .home-cta .section-title {
          margin-bottom: 16px;
        }

        .home-cta-subtitle {
          margin: 0 auto 32px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .home-capabilities-grid,
          .home-featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .home-why-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .home-hero {
            min-height: 0;
            padding: 80px 20px 60px;
          }

          .home-capabilities,
          .home-featured,
          .home-process,
          .home-why {
            padding-top: 60px;
            padding-bottom: 60px;
          }

          .home-capabilities-grid,
          .home-featured-grid {
            grid-template-columns: 1fr;
          }

          .home-process-step {
            grid-template-columns: 60px 1fr;
            gap: 16px;
          }

          .home-process-number {
            font-size: 1.2rem;
          }

          .home-why-grid {
            grid-template-columns: 1fr;
          }

          .home-cta {
            padding: 60px 20px;
          }
        }
      `}</style>
    </main>
  );
}

export default HomePage;
