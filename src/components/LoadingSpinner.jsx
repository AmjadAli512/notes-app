import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner" style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading notes...</p>
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
    color: '#666',
    fontSize: '0.95rem',
  }
};

export default LoadingSpinner;