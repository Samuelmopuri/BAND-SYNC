import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3, ArrowLeft, Home, Music } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      className="container"
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
      }}
    >
      <div className="card" style={{ maxWidth: '520px', padding: '50px 30px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Disc3 size={44} />
        </div>

        <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '14px', color: 'var(--text-main)' }}>
          Lost in the Sound?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6 }}>
          The page or track you are looking for doesn't exist, was renamed, or has ended its live performance.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Homepage
          </Link>
          <Link to="/discover" className="btn btn-secondary">
            <Music size={16} /> Discover Music
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
