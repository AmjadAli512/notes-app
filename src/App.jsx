import React, { useState, useEffect } from 'react';
import './App.css';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import LoadingSpinner from './components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title, content) => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 404) throw new Error('Note not found');
      if (!response.ok) throw new Error('Failed to delete note');
      setNotes(notes.filter(note => note._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <p>Manage your notes with ease</p>
      </header>
      <main className="app-main">
        <NoteForm onAddNote={addNote} />
        <section className="notes-section">
          <h2>My Notes</h2>
          {loading && <LoadingSpinner />}
          {error && (
            <div className="error-message">
              ⚠️ {error}
              <button onClick={fetchNotes} className="retry-btn">Retry</button>
            </div>
          )}
          {!loading && !error && <NoteList notes={notes} onDeleteNote={deleteNote} />}
        </section>
      </main>
    </div>
  );
}

export default App;