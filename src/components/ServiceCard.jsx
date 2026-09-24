import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm('Delete this service?')) return;

    setDeleting(true);
    await onDelete(service._id);
    setDeleting(false);
  };

  return (
    <div className="service-card">
      <div className="service-icon" aria-label="Service icon">
        {service.icon || '💡'}
      </div>

      <div className="service-content">
        <div className="service-header">
          <h3>{service.title}</h3>
          {service.featured === true && <span className="featured-badge">Featured</span>}
        </div>

        <p className="service-short-description">{service.shortDescription}</p>

        <div className="service-footer">
          <Link to={`/services/${service._id}`} className="service-link">
            View Details
          </Link>
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          className="delete-btn"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${service.title}`}
          title="Delete service"
        >
          {deleting ? '...' : '🗑️'}
        </button>
      )}

      <style>{`
        .service-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-left: 4px solid #667eea;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
        }
        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .service-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          font-size: 2rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .service-content {
          flex: 1;
          min-width: 0;
        }
        .service-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }
        .service-header h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #333;
        }
        .featured-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 999px;
          background: #fef3c7;
          color: #92400e;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .service-short-description {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .service-footer {
          margin-top: 14px;
        }
        .service-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }
        .service-link:hover {
          text-decoration: underline;
        }
        .delete-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: #fca5a5;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .delete-btn:hover:not(:disabled) {
          background: #f87171;
        }
        .delete-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .service-card {
            flex-direction: column;
            align-items: stretch;
          }
          .service-icon {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.7rem;
          }
          .service-header {
            align-items: flex-start;
            flex-direction: column;
          }
          .delete-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceCard;
