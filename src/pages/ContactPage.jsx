import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        setError(res.error || 'Failed to send message');
        return;
      }

      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setError('');
    setSent(false);
  };

  if (sent) {
    return (
      <main className="contact-page">
        <section className="contact-card success-state">
          <h1>✅ Thank you, {form.name}! We'll get back to you soon.</h1>
          <button type="button" onClick={resetForm} className="submit-btn">
            Send another message
          </button>
        </section>
        <style>{styles}</style>
      </main>
    );
  }

  return (
    <main className="contact-page">
      <section className="contact-card">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} maxLength={100} disabled={loading} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} maxLength={200} disabled={loading} required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} maxLength={200} disabled={loading} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} maxLength={2000} rows={5} disabled={loading} required />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .contact-page {
    min-height: 100vh;
    padding: 48px 20px;
    background: #f8f9ff;
  }
  .contact-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 32px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .contact-card h1 {
    margin: 0 0 24px;
    color: #333;
    text-align: center;
  }
  .success-state {
    text-align: center;
  }
  .success-state h1 {
    line-height: 1.4;
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-group label {
    display: block;
    margin-bottom: 6px;
    color: #555;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .form-group input,
  .form-group textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font: inherit;
    transition: border-color 0.3s;
  }
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }
  .form-error {
    margin-bottom: 12px;
    padding: 8px 12px;
    color: #c0392b;
    background: #fee;
    border-radius: 4px;
  }
  .submit-btn {
    width: 100%;
    padding: 12px;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default ContactPage;
