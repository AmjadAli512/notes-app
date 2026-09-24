import React, { useEffect, useState } from 'react';

const LoadingSpinner = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const wakeUpTimer = setTimeout(() => {
      setMessage('Waking up the server... ☕');
    }, 3000);
    const startupTimer = setTimeout(() => {
      setMessage('Server is starting up. This can take up to a minute. 🐢');
    }, 15000);
    const almostThereTimer = setTimeout(() => {
      setMessage('Almost there — the free-tier server is nearly ready. ⏳');
    }, 40000);

    return () => {
      clearTimeout(wakeUpTimer);
      clearTimeout(startupTimer);
      clearTimeout(almostThereTimer);
    };
  }, []);

  return (
    <div className="loading-spinner" style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8f9ff',
    borderRadius: '12px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    marginTop: '16px',
    color: '#667eea',
    fontSize: '0.95rem',
  },
};

export default LoadingSpinner;
