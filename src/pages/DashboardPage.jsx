import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  Users,
  Radio,
  Calendar,
  MessageSquare,
  PlusCircle,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Music,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const [bands, setBands] = useState([]);
  const [rehearsals, setRehearsals] = useState([]);
  const [suggestedMusicians, setSuggestedMusicians] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal State for Quick Band Creation
  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
  const [newBand, setNewBand] = useState({
    name: '',
    description: '',
    genre: 'Rock',
    location: user?.location || '',
    lookingFor: 'Bassist, Drummer',
  });
  const [creatingBand, setCreatingBand] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bandsRes, rehearsalsRes, usersRes, postsRes] = await Promise.allSettled([
        api.get('/bands'),
        api.get('/rehearsals/my'),
        api.get('/users'),
        api.get('/posts'),
      ]);

      if (bandsRes.status === 'fulfilled') {
        // Filter bands where user is creator or member
        const allBands = bandsRes.value.data.bands;
        const myBandsList = allBands.filter(
          (b) =>
            b.creator?._id === user?._id ||
            b.members?.some((m) => m.user?._id === user?._id)
        );
        setBands(myBandsList);
      }

      if (rehearsalsRes.status === 'fulfilled') {
        setRehearsals(rehearsalsRes.value.data.rehearsals.slice(0, 4));
      }

      if (usersRes.status === 'fulfilled') {
        // Suggested musicians (exclude self)
        const others = usersRes.value.data.musicians.filter((u) => u._id !== user?._id);
        setSuggestedMusicians(others.slice(0, 4));
      }

      if (postsRes.status === 'fulfilled') {
        setRecentPosts(postsRes.value.data.posts.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBand = async (e) => {
    e.preventDefault();
    if (!newBand.name || !newBand.description || !newBand.genre) {
      setNotification({ type: 'error', message: 'Please fill in all required band fields.' });
      return;
    }

    try {
      setCreatingBand(true);
      const res = await api.post('/bands', newBand);
      setNotification({ type: 'success', message: 'Band created successfully!' });
      setIsBandModalOpen(false);
      setNewBand({
        name: '',
        description: '',
        genre: 'Rock',
        location: user?.location || '',
        lookingFor: '',
      });
      fetchDashboardData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create band.',
      });
    } finally {
      setCreatingBand(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Assembling your personalized dashboard..." />;
  }

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Alert Notification */}
      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.12) 100%)',
          borderColor: 'rgba(139, 92, 246, 0.35)',
          padding: '28px 32px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '4px' }}>
                {user?.experienceLevel || 'Musician'}
              </span>
              <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>Welcome back, {user?.name}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {user?.instruments?.join(', ') || 'Instrumentalist'} &bull; {user?.location || 'Local / Remote'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsBandModalOpen(true)} className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Create Band
            </button>
            <Link to="/rehearsals" className="btn btn-secondary btn-sm">
              <Calendar size={16} /> Schedule Rehearsal
            </Link>
            <Link to="/discover" className="btn btn-secondary btn-sm">
              <Users size={16} /> Find Musicians
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: My Bands & Upcoming Rehearsals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* My Bands Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>My Bands ({bands.length})</h3>
              </div>
              <button onClick={() => setIsBandModalOpen(true)} className="btn btn-outline btn-sm">
                + New Band
              </button>
            </div>

            {bands.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bands.map((band) => (
                  <div
                    key={band._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '2px' }}>
                        {band.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge badge-purple">{band.genre}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {band.members?.length || 1} members &bull;{' '}
                          {band.creator?._id === user?._id ? '👑 Founder' : 'Member'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/bands/${band._id}`} className="btn btn-secondary btn-sm">
                      Manage <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '14px' }}>You haven't formed or joined any bands yet.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => setIsBandModalOpen(true)} className="btn btn-primary btn-sm">
                    Create a Band
                  </button>
                  <Link to="/bands" className="btn btn-secondary btn-sm">
                    Browse Bands
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Rehearsals */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>Upcoming Rehearsals</h3>
              </div>
              <Link to="/rehearsals" className="btn btn-secondary btn-sm">
                View Calendar
              </Link>
            </div>

            {rehearsals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rehearsals.map((reh) => (
                  <div
                    key={reh._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-cyan">{reh.band?.name}</span>
                        <h4 style={{ fontSize: '1rem', color: '#fff' }}>{reh.title}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {new Date(reh.date).toLocaleDateString()} at {reh.time}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {reh.location}
                        </span>
                      </div>
                    </div>
                    <Link to="/rehearsals" className="btn btn-outline btn-sm">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: '12px' }}>No rehearsals scheduled for your bands.</p>
                <Link to="/rehearsals" className="btn btn-secondary btn-sm">
                  Schedule Next Rehearsal
                </Link>
              </div>
            )}
          </div>

          {/* Recent Community Posts */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} style={{ color: 'var(--accent-pink)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>Community Activity</h3>
              </div>
              <Link to="/community" className="btn btn-secondary btn-sm">
                Open Community
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <img
                        src={post.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author?.name}`}
                        alt={post.author?.name}
                        style={{ width: '26px', height: '26px', borderRadius: '50%' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        {post.author?.name}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                        {post.category}
                      </span>
                    </div>
                    <h5 style={{ fontSize: '0.96rem', marginBottom: '4px', color: 'var(--text-main)' }}>
                      {post.title}
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent community posts yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Profile Summary & Suggested Musicians */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Profile Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Artist Overview</h3>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                MY INSTRUMENTS
              </div>
              <div>
                {user?.instruments && user.instruments.length > 0 ? (
                  user.instruments.map((inst, idx) => (
                    <span key={idx} className="tag-chip">
                      {inst}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None specified</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                GENRES
              </div>
              <div>
                {user?.genres && user.genres.length > 0 ? (
                  user.genres.map((g, idx) => (
                    <span key={idx} className="tag-chip">
                      {g}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None specified</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>BIO</div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {user?.bio || 'Add a bio to attract band members and collaborations!'}
              </p>
            </div>

            <Link to={`/musicians/${user?._id}`} className="btn btn-outline btn-block btn-sm">
              View / Edit Full Profile
            </Link>
          </div>

          {/* Suggested Musicians */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Musicians to Jam With</h3>
              <Link to="/discover" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                All &rarr;
              </Link>
            </div>

            {suggestedMusicians.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {suggestedMusicians.map((m) => (
                  <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.name}`}
                        alt={m.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {m.instruments?.[0] || 'Musician'} &bull; {m.experienceLevel}
                        </div>
                      </div>
                    </div>
                    <Link to={`/musicians/${m._id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No other musicians found yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Band Modal */}
      <Modal
        isOpen={isBandModalOpen}
        onClose={() => setIsBandModalOpen(false)}
        title="Form a New Band"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsBandModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateBand}
              className="btn btn-primary btn-sm"
              disabled={creatingBand}
            >
              {creatingBand ? 'Creating...' : 'Create Band'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateBand}>
          <div className="form-group">
            <label className="form-label">Band Name *</label>
            <input
              type="text"
              placeholder="e.g. Neon Horizon"
              value={newBand.name}
              onChange={(e) => setNewBand({ ...newBand, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Musical Genre *</label>
              <input
                type="text"
                placeholder="e.g. Alternative Rock, Jazz Fusion"
                value={newBand.genre}
                onChange={(e) => setNewBand({ ...newBand, genre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / Base City</label>
              <input
                type="text"
                placeholder="e.g. Seattle, WA or Remote"
                value={newBand.location}
                onChange={(e) => setNewBand({ ...newBand, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Band Description & Sound *</label>
            <textarea
              rows="3"
              placeholder="Describe your musical style, influences, goals, and live sound..."
              value={newBand.description}
              onChange={(e) => setNewBand({ ...newBand, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Musicians / Instruments You Are Looking For</label>
            <input
              type="text"
              placeholder="e.g. Bassist, Rhythm Guitarist, Sound Engineer"
              value={newBand.lookingFor}
              onChange={(e) => setNewBand({ ...newBand, lookingFor: e.target.value })}
            />
            <div className="form-helper">Separate multiple instruments with commas</div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
