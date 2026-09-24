import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand-col">
        <h3 className="footer-brand">DevSKD</h3>
        <p className="footer-tagline">Building Ideas, Creating Impact</p>
      </div>

      <div className="footer-links-col">
        <h4>Company</h4>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="footer-links-col">
        <h4>Contact</h4>
        <a href="mailto:hrdevskd@gmail.com">hrdevskd@gmail.com</a>
      </div>
    </div>

    <div className="footer-bottom">
      © {new Date().getFullYear()} DevSKD. All rights reserved.
    </div>

    <style>{`
      .footer {
        background: var(--bg-secondary);
        border-top: 1px solid var(--border-subtle);
        padding: 60px 24px 24px;
      }

      .footer-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
        max-width: 1100px;
        margin: 0 auto;
      }

      .footer-links-col h4 {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 12px;
        font-size: 0.95rem;
      }

      .footer-brand {
        color: var(--brand-primary);
        font-size: 1.4rem;
        margin-bottom: 6px;
      }

      .footer-tagline {
        color: var(--text-tertiary);
        font-size: 0.85rem;
      }

      .footer-links-col a {
        display: block;
        color: var(--text-secondary);
        margin-bottom: 8px;
        font-size: 0.9rem;
        text-decoration: none;
        transition: color var(--transition-fast);
      }

      .footer-links-col a:hover {
        color: var(--brand-primary);
      }

      .footer-bottom {
        max-width: 1100px;
        margin: 40px auto 0;
        padding-top: 24px;
        border-top: 1px solid var(--border-subtle);
        text-align: center;
        color: var(--text-tertiary);
        font-size: 0.8rem;
      }

      @media (max-width: 767px) {
        .footer {
          padding: 40px 24px 24px;
        }

        .footer-container {
          grid-template-columns: 1fr;
          gap: 28px;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
