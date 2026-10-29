import React from 'react';

const LoadingSpinner = ({ message = 'Loading music data...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div className="equalizer-loader" style={{ marginBottom: '14px' }}>
        <div className="equalizer-bar" style={{ height: '14px' }}></div>
        <div className="equalizer-bar" style={{ height: '22px' }}></div>
        <div className="equalizer-bar" style={{ height: '8px' }}></div>
        <div className="equalizer-bar" style={{ height: '18px' }}></div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
