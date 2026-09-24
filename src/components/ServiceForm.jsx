import React, { useEffect, useState } from 'react';

const ServiceForm = ({ onAddService, initialValues = null, submitLabel = '➕ Add Service' }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [shortDescription, setShortDescription] = useState(initialValues?.shortDescription || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [icon, setIcon] = useState(initialValues?.icon || '');
  const [featured, setFeatured] = useState(Boolean(initialValues?.featured));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setShortDescription(initialValues.shortDescription || '');
      setDescription(initialValues.description || '');
      setIcon(initialValues.icon || '');
      setFeatured(Boolean(initialValues.featured));
      return;
    }

    setTitle('');
    setShortDescription('');
    setDescription('');
    setIcon('');
    setFeatured(false);
  }, [initialValues]);

  const resetForm = () => {
    setTitle('');
    setShortDescription('');
    setDescription('');
    setIcon('');
    setFeatured(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      setError('Title, short description, and description are required');
      return;
    }

    if (icon.trim().length > 10) {
      setError('Icon must be 10 characters or less');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onAddService(
      title.trim(),
      shortDescription.trim(),
      description.trim(),
      icon.trim(),
      featured
    );

    if (result.success) {
      resetForm();
    } else {
      setError(result.error || 'Failed to add service');
    }

    setLoading(false);
  };

  return (
    <div className="service-form">
      <h2>Add New Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter service title..."
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary..."
            disabled={loading}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the service..."
            rows={4}
            disabled={loading}
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label>Icon</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🌐"
            disabled={loading}
            maxLength={10}
          />
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={loading}
            />
            Featured
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : submitLabel}
        </button>
      </form>

      <style>{`
        .service-form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .service-form h2 {
          font-size: 1.4rem;
          color: #333;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #555;
          font-size: 0.9rem;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        .checkbox-group {
          margin-bottom: 16px;
        }
        .checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
        }
        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #667eea;
        }
        .form-error {
          color: #c0392b;
          font-size: 0.9rem;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: #fee;
          border-radius: 4px;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ServiceForm;
