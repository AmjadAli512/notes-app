import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceList from '../components/ServiceList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function ServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/services', { method: 'GET' }, token);

      if (!res.ok) throw new Error(res.error || 'Failed to fetch services');

      setServices(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="services-page">
      <h1>Our Services</h1>
      {!token && (
        <div className="login-message">
          <p>Please log in to see our services.</p>
          <Link to="/login">Login</Link>
          {' or '}
          <Link to="/signup">Signup</Link>
        </div>
      )}
      {token && loading && <LoadingSpinner />}
      {token && error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={fetchServices} className="retry-btn">Retry</button>
        </div>
      )}
      {token && !loading && !error && (
        <ServiceList services={services} onDelete={undefined} />
      )}
      <style>{`
        .services-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 20px;
        }
        .services-page h1 {
          margin-bottom: 24px;
          color: #333;
        }
        .login-message {
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          color: #555;
          text-align: center;
        }
        .login-message p {
          margin: 0 0 12px;
        }
        .login-message a {
          color: #4f46e5;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}

export default ServicesPage;
