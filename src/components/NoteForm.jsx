import React, { useState } from 'react';

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setLoading(true);
    setError('');
    const result = await onAddNote(title.trim(), content.trim());
    if (result.success) {
      setTitle('');
      setContent('');
    } else {
      setError(result.error || 'Failed to create note');
    }
    setLoading(false);
  };

  return (
    <div className="note-form">
      <h2>Add New Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            disabled={loading}
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content..."
            rows="4"
            disabled={loading}
            maxLength="5000"
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : '➕ Add Note'}
        </button>
      </form>
      <style>{`
        .note-form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .note-form h2 {
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
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
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

export default NoteForm;