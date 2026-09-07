import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onDeleteNote }) => {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No notes yet</p>
        <p className="empty-sub">Create your first note above!</p>
        <style>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .empty-state p { font-size: 1.2rem; color: #666; }
          .empty-sub { font-size: 0.95rem; color: #999; margin-top: 8px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} onDelete={onDeleteNote} />
      ))}
      <style>{`.note-list { display: flex; flex-direction: column; gap: 16px; }`}</style>
    </div>
  );
};

export default NoteList;