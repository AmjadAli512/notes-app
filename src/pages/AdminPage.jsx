import React, { useEffect, useState } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceList from '../components/ServiceList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function AdminPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState(null);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await apiRequest('/services', { method: 'GET' }, token);

      if (!res.ok) throw new Error(res.error || 'Failed to fetch services');

      setServices(Array.isArray(res.data) ? res.data : []);
      setServicesError(null);
    } catch (err) {
      setServicesError(err.message);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const res = await apiRequest('/contact', { method: 'GET' }, token);

      if (!res.ok) throw new Error(res.error || 'Failed to fetch messages');

      setContacts(Array.isArray(res.data) ? res.data : []);
      setContactsError(null);
    } catch (err) {
      setContactsError(err.message);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  const addService = async (title, shortDescription, description, icon, featured) => {
    try {
      const res = await apiRequest(
        '/services',
        {
          method: 'POST',
          body: JSON.stringify({ title, shortDescription, description, icon, featured }),
        },
        token
      );

      if (!res.ok) return { success: false, error: res.error };

      setServices((currentServices) => [res.data, ...currentServices]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await apiRequest(`/services/${id}`, { method: 'DELETE' }, token);

      if (res.status === 404) return { success: false, error: 'Service not found' };
      if (!res.ok) return { success: false, error: res.error };

      setServices((currentServices) =>
        currentServices.filter((service) => service._id !== id)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      const res = await apiRequest(
        `/contact/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
        token
      );

      if (!res.ok) {
        setContactsError(res.error || 'Failed to update message status');
        return;
      }

      setContacts((currentContacts) =>
        currentContacts.map((contact) =>
          contact._id === id
            ? { ...contact, ...(res.data || {}), status }
            : contact
        )
      );
      setContactsError(null);
    } catch (err) {
      setContactsError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderMessages = () => {
    if (contacts.length === 0) {
      return <div className="empty-state">📭 No messages yet.</div>;
    }

    return (
      <div className="contact-list">
        {contacts.map((contact) => (
          <article className="contact-card" key={contact._id}>
            <div className="contact-header">
              <div>
                <strong>{contact.name}</strong>
                <span className="contact-email">{contact.email}</span>
              </div>
              <span className={`status-pill status-${contact.status || 'new'}`}>
                {contact.status || 'new'}
              </span>
            </div>
            <h4>{contact.subject}</h4>
            <p className="contact-message">{contact.message}</p>
            <p className="contact-date">Added on {formatDate(contact.createdAt)}</p>
            <div className="status-actions">
              <button type="button" onClick={() => updateContactStatus(contact._id, 'read')}>
                Mark read
              </button>
              <button type="button" onClick={() => updateContactStatus(contact._id, 'replied')}>
                Mark replied
              </button>
              <button type="button" onClick={() => updateContactStatus(contact._id, 'new')}>
                Mark new
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <main className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="tab-bar">
        <button
          type="button"
          className={activeTab === 'services' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          type="button"
          className={activeTab === 'messages' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      {activeTab === 'services' && (
        <section>
          <ServiceForm onAddService={addService} />
          {servicesLoading && <LoadingSpinner />}
          {servicesError && (
            <div className="error-message">
              ⚠️ {servicesError}
              <button onClick={fetchServices} className="retry-btn">Retry</button>
            </div>
          )}
          {!servicesLoading && !servicesError && (
            <ServiceList services={services} onDelete={deleteService} />
          )}
        </section>
      )}

      {activeTab === 'messages' && (
        <section>
          {contactsLoading && <LoadingSpinner />}
          {contactsError && (
            <div className="error-message">
              ⚠️ {contactsError}
              <button onClick={fetchContacts} className="retry-btn">Retry</button>
            </div>
          )}
          {!contactsLoading && !contactsError && renderMessages()}
        </section>
      )}

      <style>{`
        .admin-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 20px;
        }
        .admin-page h1 {
          margin-bottom: 24px;
          color: #333;
        }
        .tab-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tab-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 999px;
          background: #f0f0f0;
          color: #555;
          font-weight: 600;
          cursor: pointer;
        }
        .tab-btn.active {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-card,
        .empty-state {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .contact-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .contact-header strong {
          display: block;
          color: #333;
          font-size: 1.05rem;
        }
        .contact-email {
          display: block;
          margin-top: 4px;
          color: #888;
          font-size: 0.85rem;
        }
        .contact-card h4 {
          margin: 18px 0 8px;
          color: #444;
        }
        .contact-message {
          margin: 0;
          color: #555;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .contact-date {
          margin: 16px 0;
          color: #999;
          font-size: 0.82rem;
        }
        .status-pill {
          padding: 5px 10px;
          border-radius: 999px;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .status-new { background: #f59e0b; }
        .status-read { background: #3b82f6; }
        .status-replied { background: #22c55e; }
        .status-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-actions button {
          padding: 7px 10px;
          border: 1px solid #d6d9e8;
          border-radius: 6px;
          background: #f8f9ff;
          color: #4f46e5;
          cursor: pointer;
          font-size: 0.82rem;
        }
        .status-actions button:hover {
          background: #eef0ff;
        }
        .empty-state {
          padding: 60px 20px;
          color: #666;
          text-align: center;
          font-size: 1.2rem;
        }
        @media (max-width: 500px) {
          .tab-bar {
            flex-direction: column;
          }
          .tab-btn {
            width: 100%;
          }
          .contact-header {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

export default AdminPage;
