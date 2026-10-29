import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Music,
  Users,
  Radio,
  Calendar,
  MessageSquare,
  Inbox,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Poll or fetch pending received requests count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchPending = async () => {
        try {
          const res = await api.get('/collaborations/received');
          const pending = res.data.requests.filter((r) => r.status === 'pending');
          setPendingCount(pending.length);
        } catch (err) {
          // Silent fallback
        }
      };
      fetchPending();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobile}>
          <div className="brand-icon">
            <Music size={22} />
          </div>
          <span>BandSync</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/discover" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Users size={16} /> Discover
            </NavLink>
          </li>
          <li>
            <NavLink to="/bands" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Radio size={16} /> Bands
            </NavLink>
          </li>
          <li>
            <NavLink to="/rehearsals" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Calendar size={16} /> Rehearsals
            </NavLink>
          </li>
          <li>
            <NavLink to="/community" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <MessageSquare size={16} /> Community
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink to="/requests" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <Inbox size={16} /> Requests
                {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
              </NavLink>
            </li>
          )}
        </ul>

        {/* Desktop Auth Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" title="Dashboard">
                <LayoutDashboard size={16} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
              <Link to={`/musicians/${user?._id}`} className="user-menu-btn" title="My Profile">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'Musician')}`
                  }
                  alt={user?.name}
                  className="user-avatar"
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={15} /> Join Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link to="/discover" className="nav-link" onClick={closeMobile}>
            <Users size={18} /> Discover Musicians
          </Link>
          <Link to="/bands" className="nav-link" onClick={closeMobile}>
            <Radio size={18} /> Explore Bands
          </Link>
          <Link to="/rehearsals" className="nav-link" onClick={closeMobile}>
            <Calendar size={18} /> Rehearsal Schedule
          </Link>
          <Link to="/community" className="nav-link" onClick={closeMobile}>
            <MessageSquare size={18} /> Community Posts
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/requests" className="nav-link" onClick={closeMobile}>
                <Inbox size={18} /> Collaboration Requests {pendingCount > 0 && `(${pendingCount})`}
              </Link>
              <Link to="/dashboard" className="nav-link" onClick={closeMobile}>
                <LayoutDashboard size={18} /> My Dashboard
              </Link>
              <Link to={`/musicians/${user?._id}`} className="nav-link" onClick={closeMobile}>
                <UserIcon size={18} /> Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-block"
                style={{ marginTop: '8px' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-block" onClick={closeMobile}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-block" onClick={closeMobile}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
