import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} className="app-navbar">
      <Link to="/" style={styles.brand} className="brand">DevSKD</Link>

      <div style={styles.links} className="links">
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/services" style={styles.link}>Services</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
        {isAuthenticated && user?.role === 'admin' && (
          <Link to="/admin" style={styles.link}>Admin</Link>
        )}
      </div>

      <div style={styles.right} className="right">
        {isAuthenticated ? (
          <>
            <span style={styles.email}>{user?.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .app-navbar {
            justify-content: center;
          }
          .app-navbar .brand {
            flex-basis: 100%;
            text-align: center;
          }
          .app-navbar .links {
            order: 2;
            flex-basis: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          .app-navbar .right {
            order: 3;
            margin-left: 0;
          }
        }
      `}</style>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexWrap: 'wrap',
    gap: '20px',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#667eea',
    textDecoration: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginLeft: 'auto',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  email: {
    color: '#555',
    fontSize: '0.9rem',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '6px 14px',
    background: '#fc8181',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default Navbar;