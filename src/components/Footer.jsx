import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, Disc, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Logo & Pitch */}
          <div style={{ maxWidth: '380px' }}>
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <div className="brand-icon">
                <Music size={20} />
              </div>
              <span>BandSync</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              The modern web platform connecting musicians, forming dynamic bands, coordinating rehearsals, and powering music collaboration across genres.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: '#fff' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link to="/discover" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Find Musicians
                </Link>
              </li>
              <li>
                <Link to="/bands" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Browse Bands
                </Link>
              </li>
              <li>
                <Link to="/rehearsals" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Rehearsal Manager
                </Link>
              </li>
              <li>
                <Link to="/community" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Community Jam Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: '#fff' }}>Architecture</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="badge badge-purple">
                <Sparkles size={12} /> React 18 + Vite
              </span>
              <span className="badge badge-cyan">
                <Disc size={12} /> Node.js & Express REST API
              </span>
              <span className="badge badge-emerald">
                <Disc size={12} /> MongoDB Atlas + Mongoose
              </span>
              <span className="badge badge-amber">
                <Shield size={12} /> JWT Auth + Bcryptjs
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Music Band Collaboration Portal &bull; Crafted with{' '}
            <Heart size={14} style={{ color: '#ec4899', verticalAlign: 'middle' }} /> for musicians and bands worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
