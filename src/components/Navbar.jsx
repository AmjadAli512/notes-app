import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const navigationLinks = (
    <>
      <Link to="/" className="navbar-link" onClick={closeMobileMenu}>Home</Link>
      <Link to="/services" className="navbar-link" onClick={closeMobileMenu}>Services</Link>
      <Link to="/contact" className="navbar-link" onClick={closeMobileMenu}>Contact</Link>
      {isAuthenticated && user?.role === 'admin' && (
        <Link to="/admin" className="navbar-link" onClick={closeMobileMenu}>Admin</Link>
      )}
    </>
  );

  const authLinks = isAuthenticated ? (
    <>
      <span className="navbar-email">{user?.email}</span>
      <button type="button" onClick={handleLogout} className="navbar-logout">Logout</button>
    </>
  ) : (
    <>
      <Link to="/login" className="navbar-link" onClick={closeMobileMenu}>Login</Link>
      <Link to="/signup" className="navbar-link" onClick={closeMobileMenu}>Signup</Link>
    </>
  );

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>DevSKD</Link>

        <div className="navbar-links">{navigationLinks}</div>

        <div className="navbar-right">
          <Link to="/contact" className="btn-primary" onClick={closeMobileMenu}>
            Start a Project
          </Link>
          <div className="navbar-auth">{authLinks}</div>
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
  <div className="navbar-mobile-panel">
    <div className="navbar-mobile-links">{navigationLinks}</div>
    <div className="navbar-mobile-auth">{authLinks}</div>
    <Link
      to="/contact"
      className="btn-primary"
      onClick={closeMobileMenu}
      style={{ textAlign: 'center' }}
    >
      Start a Project
    </Link>
  </div>
)}
      </nav>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 32px;
          min-height: 64px;
          padding: 0 24px;
          background: rgba(10, 14, 39, 0.75);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .navbar-brand {
          color: var(--brand-primary);
          font-weight: 700;
          font-size: 1.2rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .navbar-links,
        .navbar-auth,
        .navbar-right {
          display: flex;
          align-items: center;
        }

        .navbar-links {
          gap: 24px;
        }

        .navbar-right {
          gap: 16px;
          margin-left: auto;
        }

        .navbar-auth {
          gap: 16px;
        }

        .navbar-link {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .navbar-link:hover {
          color: var(--text-primary);
        }

        .navbar-email {
          color: var(--text-tertiary);
          font-size: 0.85rem;
        }

        .navbar-logout {
          padding: 7px 14px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font: inherit;
          font-size: 0.85rem;
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }

        .navbar-logout:hover {
          border-color: var(--brand-primary);
          color: var(--text-primary);
        }

        .navbar-mobile-toggle {
          display: none;
          padding: 6px 10px;
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
        }

        .navbar-mobile-panel {
          display: none;
        }

        @media (max-width: 767px) {
          .navbar {
            min-height: 64px;
            padding: 12px 16px;
            flex-wrap: wrap;
          }

          .navbar-links,
          .navbar-auth {
            display: none;
          }

          .navbar-right {
            gap: 10px;
          }

          .navbar-mobile-toggle {
            display: block;
          }

          .navbar-mobile-panel {
            display: flex;
            flex-basis: 100%;
            flex-direction: column;
            gap: 12px;
            margin: 0 -16px -12px;
            padding: 16px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-subtle);
          }

          .navbar-mobile-links,
          .navbar-mobile-auth {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .navbar-mobile-auth {
            padding-top: 12px;
            border-top: 1px solid var(--border-subtle);
          }

          .navbar-mobile-panel .navbar-email {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
