import React, { useState } from 'react';

const NoteItem = ({ note, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    setDeleting(true);
    setError('');
    const result = await onDelete(note._id);
    if (!result.success) setError(result.error || 'Failed to delete');
    setDeleting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateString; }
  };

  return (
    <div className="note-item">
      <div className="note-content">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-text">{note.content}</p>
        <div className="note-meta">
          <span className="note-date">📅 {formatDate(note.createdAt)}</span>
        </div>
      </div>
      <div className="note-actions">
        <button onClick={handleDelete} disabled={deleting} className="delete-btn">
          {deleting ? 'Deleting...' : '🗑️ Delete'}
        </button>
      </div>
      {error && <div className="note-error">{error}</div>}
      <style>{`
        .note-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border-left: 4px solid #667eea;
        }
        .note-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .note-content { flex: 1; }
        .note-title { font-size: 1.15rem; font-weight: 600; color: #333; margin-bottom: 6px; }
        .note-text { color: #555; font-size: 0.95rem; line-height: 1.5; margin-bottom: 10px; }
        .note-meta { display: flex; gap: 12px; font-size: 0.8rem; color: #999; flex-wrap: wrap; }
        .delete-btn {
          padding: 8px 16px;
          background: #fc8181;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .delete-btn:hover:not(:disabled) { background: #f56565; }
        .delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .note-error { color: #c0392b; font-size: 0.85rem; margin-top: 8px; padding: 8px 12px; background: #fee; border-radius: 4px; }
        @media (max-width: 600px) {
          .note-item { flex-direction: column; align-items: stretch; }
          .note-actions { flex-direction: row; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
};

export default NoteItem;