import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function HomePage() {
  const { token } = useAuth();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setFeaturedServices([]);
      setLoading(false);
      return;
    }

    fetchFeaturedServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/services', { method: 'GET' }, token);

      if (!res.ok) throw new Error(res.error || 'Failed to fetch services');

      const services = Array.isArray(res.data) ? res.data : [];
      setFeaturedServices(services.filter((service) => service.featured === true).slice(0, 3));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <h1>DevSKD</h1>
        <p>We build software that ships.</p>
        <div className="hero-actions">
          <Link to="/services" className="primary-cta">Explore Services</Link>
          <Link to="/contact" className="secondary-cta">Contact Us</Link>
        </div>
      </section>

      <section className="featured-section">
        <h2>What We Do</h2>
        {!token && (
          <div className="login-banner">
            Log in to see our services. <Link to="/login">Login</Link> or{' '}
            <Link to="/signup">Signup</Link>
          </div>
        )}
        {token && loading && <LoadingSpinner />}
        {token && error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={fetchFeaturedServices} className="retry-btn">Retry</button>
          </div>
        )}
        {token && !loading && !error && featuredServices.length === 0 && (
          <p className="coming-soon">Coming soon...</p>
        )}
        {token && !loading && !error && featuredServices.length > 0 && (
          <div className="service-grid">
            {featuredServices.map((service) => (
              <Link
                to={`/services/${service._id}`}
                key={service._id}
                className="preview-card"
              >
                <span className="preview-icon">{service.icon || '💡'}</span>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="contact-cta">
        <h2>Have a project in mind?</h2>
        <p>Let's build something together.</p>
        <Link to="/contact" className="primary-cta">Contact Us</Link>
      </section>

      <style>{`
        .home-page {
          color: #333;
        }
        .hero-section {
          padding: 88px 20px;
          text-align: center;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hero-section h1 {
          margin: 0;
          font-size: clamp(3rem, 10vw, 5.5rem);
          letter-spacing: 0.04em;
        }
        .hero-section p {
          margin: 16px 0 32px;
          font-size: clamp(1.1rem, 3vw, 1.5rem);
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .primary-cta,
        .secondary-cta {
          display: inline-block;
          padding: 12px 22px;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .primary-cta {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hero-section .primary-cta {
          background: white;
          color: #5b5bd6;
        }
        .secondary-cta {
          color: white;
          border: 2px solid rgba(255,255,255,0.8);
        }
        .primary-cta:hover,
        .secondary-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        }
        .featured-section,
        .contact-cta {
          max-width: 1000px;
          margin: 0 auto;
          padding: 56px 20px;
          text-align: center;
        }
        .featured-section h2,
        .contact-cta h2 {
          margin: 0 0 24px;
          font-size: 1.8rem;
        }
        .login-banner,
        .coming-soon {
          padding: 16px;
          color: #666;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .login-banner a {
          color: #4f46e5;
          font-weight: 600;
        }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: left;
        }
        .preview-card {
          padding: 24px;
          color: inherit;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .preview-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 16px rgba(0,0,0,0.14);
        }
        .preview-icon {
          display: block;
          margin-bottom: 14px;
          font-size: 2rem;
        }
        .preview-card h3 {
          margin: 0 0 8px;
        }
        .preview-card p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }
        .contact-cta {
          max-width: none;
          background: #f8f9ff;
        }
        .contact-cta p {
          margin: 0 0 24px;
          color: #666;
        }
        @media (max-width: 700px) {
          .service-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default HomePage;
