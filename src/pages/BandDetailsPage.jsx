import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  Radio,
  Users,
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  Megaphone,
  Trash2,
  Edit,
  ArrowLeft,
  Crown,
  Sparkles,
} from 'lucide-react';

const BandDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [band, setBand] = useState(null);
  const [rehearsals, setRehearsals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Announcement Modal
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [submittingAnnounce, setSubmittingAnnounce] = useState(false);

  // Schedule Rehearsal Modal
  const [isRehearsalModalOpen, setIsRehearsalModalOpen] = useState(false);
  const [newRehearsal, setNewRehearsal] = useState({
    title: '',
    description: '',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time: '19:00',
    location: '',
    isOnline: false,
    onlineLink: '',
  });
  const [schedulingRehearsal, setSchedulingRehearsal] = useState(false);

  useEffect(() => {
    fetchBandDetails();
  }, [id]);

  const fetchBandDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bands/${id}`);
      setBand(res.data.band);
      setRehearsals(res.data.rehearsals);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load band details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isCreator = user && band && band.creator?._id === user._id;
  const isMember =
    isCreator || (user && band && band.members?.some((m) => m.user?._id === user._id));

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.title || !announcement.content) {
      setNotification({ type: 'error', message: 'Title and content are required.' });
      return;
    }

    try {
      setSubmittingAnnounce(true);
      const res = await api.post(`/bands/${id}/announcements`, announcement);
      setNotification({ type: 'success', message: 'Announcement posted to band feed!' });
      setIsAnnounceModalOpen(false);
      setAnnouncement({ title: '', content: '' });
      fetchBandDetails();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to post announcement.',
      });
    } finally {
      setSubmittingAnnounce(false);
    }
  };

  const handleCreateRehearsal = async (e) => {
    e.preventDefault();
    if (!newRehearsal.title || !newRehearsal.date || !newRehearsal.time || !newRehearsal.location) {
      setNotification({ type: 'error', message: 'Please provide title, date, time, and location.' });
      return;
    }

    try {
      setSchedulingRehearsal(true);
      await api.post('/rehearsals', {
        ...newRehearsal,
        bandId: id,
      });

      setNotification({ type: 'success', message: 'Rehearsal scheduled!' });
      setIsRehearsalModalOpen(false);
      setNewRehearsal({
        title: '',
        description: '',
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        time: '19:00',
        location: '',
        isOnline: false,
        onlineLink: '',
      });
      fetchBandDetails();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to schedule rehearsal.',
      });
    } finally {
      setSchedulingRehearsal(false);
    }
  };

  const handleDeleteBand = async () => {
    if (!window.confirm(`Are you sure you want to delete "${band.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/bands/${id}`);
      navigate('/bands');
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete band.',
      });
    }
  };

  const handleJoinBand = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/bands/${id}/join`, {
        instrument: user?.instruments?.[0] || 'Musician',
      });
      setNotification({ type: 'success', message: 'You have joined the band roster!' });
      fetchBandDetails();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to join band.',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving band details and roster..." />;
  }

  if (!band) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Band not found.</h2>
        <Link to="/bands" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Bands
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/bands" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to all bands
      </Link>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Band Hero Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(23, 26, 40, 0.95) 0%, rgba(38, 30, 58, 0.95) 100%)',
          borderColor: 'rgba(139, 92, 246, 0.35)',
          padding: '36px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-purple">{band.genre}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} /> {band.location || 'Remote'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '12px' }}>{band.name}</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '1rem', lineHeight: 1.6 }}>
              {band.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isMember ? (
              <>
                <button onClick={() => setIsRehearsalModalOpen(true)} className="btn btn-primary btn-sm">
                  <Calendar size={16} /> Schedule Rehearsal
                </button>
                <button onClick={() => setIsAnnounceModalOpen(true)} className="btn btn-secondary btn-sm">
                  <Megaphone size={16} /> Post Announcement
                </button>
                {isCreator && (
                  <button onClick={handleDeleteBand} className="btn btn-danger btn-sm" title="Delete Band">
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            ) : (
              <button onClick={handleJoinBand} className="btn btn-primary">
                Join This Band
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Roster & Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Members Roster & Recruiting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Members Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem' }}>Line-up Roster ({band.members?.length || 0})</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {band.members?.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: idx !== band.members.length - 1 ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={member.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.user?.name}`}
                      alt={member.user?.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Link
                          to={`/musicians/${member.user?._id}`}
                          style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}
                        >
                          {member.user?.name}
                        </Link>
                        {band.creator?._id === member.user?._id && (
                          <Crown size={14} style={{ color: 'var(--accent-amber)' }} title="Founder" />
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {member.instrument || member.role || 'Musician'}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                    {member.role || 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Looking For Card */}
          {band.lookingFor && band.lookingFor.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: 'var(--accent-amber)' }}>
                Auditioning For
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                This band is currently looking to recruit:
              </p>
              <div>
                {band.lookingFor.map((item, idx) => (
                  <span key={idx} className="badge badge-amber" style={{ marginRight: '6px', marginBottom: '6px' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Rehearsals & Band Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Rehearsals Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} style={{ color: 'var(--secondary)' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Upcoming Rehearsals</h3>
              </div>
              {isMember && (
                <button onClick={() => setIsRehearsalModalOpen(true)} className="btn btn-outline btn-sm">
                  + Schedule
                </button>
              )}
            </div>

            {rehearsals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rehearsals.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{r.title}</h4>
                      <span className="badge badge-cyan">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '8px' }}>
                      {r.description || 'Band practice session.'}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      <span><Clock size={13} style={{ verticalAlign: 'middle' }} /> {r.time}</span>
                      <span><MapPin size={13} style={{ verticalAlign: 'middle' }} /> {r.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No rehearsals currently on the calendar for this band.
              </p>
            )}
          </div>

          {/* Announcements Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone size={20} style={{ color: 'var(--accent-pink)' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Band Announcements</h3>
              </div>
              {isMember && (
                <button onClick={() => setIsAnnounceModalOpen(true)} className="btn btn-outline btn-sm">
                  + Announcement
                </button>
              )}
            </div>

            {band.announcements && band.announcements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {band.announcements.map((ann, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1rem', color: '#fff' }}>{ann.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ann.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No announcements posted yet. Members can post rehearsals notes or setlists here.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Post Announcement Modal */}
      <Modal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
        title="Post Band Announcement"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAnnounceModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePostAnnouncement}
              className="btn btn-primary btn-sm"
              disabled={submittingAnnounce}
            >
              {submittingAnnounce ? 'Posting...' : 'Post Announcement'}
            </button>
          </>
        }
      >
        <form onSubmit={handlePostAnnouncement}>
          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              placeholder="e.g. Setlist for upcoming Friday gig"
              value={announcement.title}
              onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Details *</label>
            <textarea
              rows="4"
              placeholder="Write update for band members..."
              value={announcement.content}
              onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Schedule Rehearsal Modal */}
      <Modal
        isOpen={isRehearsalModalOpen}
        onClose={() => setIsRehearsalModalOpen(false)}
        title={`Schedule Rehearsal for ${band.name}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsRehearsalModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateRehearsal}
              className="btn btn-primary btn-sm"
              disabled={schedulingRehearsal}
            >
              {schedulingRehearsal ? 'Scheduling...' : 'Save Rehearsal'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateRehearsal}>
          <div className="form-group">
            <label className="form-label">Rehearsal Title *</label>
            <input
              type="text"
              placeholder="e.g. Studio A Pre-Production Run"
              value={newRehearsal.title}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                value={newRehearsal.date}
                onChange={(e) => setNewRehearsal({ ...newRehearsal, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                value={newRehearsal.time}
                onChange={(e) => setNewRehearsal({ ...newRehearsal, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location or Studio Address *</label>
            <input
              type="text"
              placeholder="e.g. 1240 Music Row, Room 3 or Discord Voice"
              value={newRehearsal.location}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Session Notes</label>
            <textarea
              rows="3"
              placeholder="What songs, chords, or transitions should members review beforehand?"
              value={newRehearsal.description}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BandDetailsPage;
