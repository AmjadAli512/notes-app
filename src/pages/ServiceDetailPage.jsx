import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function ServiceDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`/services/${id}`, { method: 'GET' }, token);

      if (!res.ok) {
        setService(null);
        return;
      }

      setService(res.data);
    } catch {
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return (
      <main className="service-detail-page service-not-found">
        <h1>Service not found</h1>
        <Link to="/services">Back to Services</Link>
        <style>{`
          .service-not-found {
            text-align: center;
            padding: 60px 20px;
          }
          .service-not-found a {
            color: #4f46e5;
            font-weight: 600;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="service-detail-page">
      <article className="service-detail">
        <div className="service-detail-icon" aria-label="Service icon">
          {service.icon || '💡'}
        </div>
        <h1>{service.title}</h1>
        {service.featured === true && <span className="featured-badge">Featured</span>}
        <p className="service-description">{service.description}</p>
        <p className="service-meta">Added on {formatDate(service.createdAt)}</p>
        <Link to="/services" className="back-link">Back to Services</Link>
      </article>
      <style>{`
        .service-detail-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .service-detail {
          background: white;
          padding: 40px 32px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }
        .service-detail-icon {
          font-size: 4rem;
          line-height: 1;
          margin-bottom: 20px;
        }
        .service-detail h1 {
          margin: 0 0 12px;
          color: #333;
        }
        .featured-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 999px;
          background: #fef3c7;
          color: #92400e;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .service-description {
          margin: 28px 0 16px;
          color: #555;
          line-height: 1.7;
          text-align: left;
          white-space: pre-wrap;
        }
        .service-meta {
          color: #999;
          font-size: 0.9rem;
        }
        .back-link {
          display: inline-block;
          margin-top: 24px;
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .service-detail {
            padding: 32px 20px;
          }
        }
      `}</style>
    </main>
  );
}

export default ServiceDetailPage;
