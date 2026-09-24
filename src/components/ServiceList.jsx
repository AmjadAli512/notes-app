import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, onDelete }) => {
  if (services.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No services yet. Add one above!</p>
        <style>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .empty-state p {
            font-size: 1.2rem;
            color: #666;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="service-list">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} onDelete={onDelete} />
      ))}
      <style>{`.service-list { display: flex; flex-direction: column; gap: 16px; }`}</style>
    </div>
  );
};

export default ServiceList;
