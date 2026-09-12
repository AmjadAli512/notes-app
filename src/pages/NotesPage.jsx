import React, { useState, useEffect } from 'react';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/notes', { method: 'GET' }, token);

      if (!res.ok) throw new Error(res.error || 'Failed to fetch notes');

      setNotes(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title, content) => {
    try {
      const res = await apiRequest(
        '/notes',
        { method: 'POST', body: JSON.stringify({ title, content }) },
        token
      );

      if (!res.ok) return { success: false, error: res.error };

      setNotes([res.data, ...notes]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await apiRequest(`/notes/${id}`, { method: 'DELETE' }, token);

      if (res.status === 404) return { success: false, error: 'Note not found' };
      if (!res.ok) return { success: false, error: res.error };

      setNotes(notes.filter((n) => n._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <div className="app-main">
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
        {!loading && !error && (
          <NoteList notes={notes} onDeleteNote={deleteNote} />
        )}
      </section>
    </div>
  );
}

export default NotesPage;