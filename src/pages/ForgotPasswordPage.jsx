import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!result.ok) {
        setError(result.error || 'Failed to send reset link');
        return;
      }

      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Check Your Inbox</h2>
          <p className="auth-subtitle">
            ✅ If that email exists, we've sent a reset link. Check your inbox.
          </p>
          <p className="auth-footer">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password?</h2>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="form-error" style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
