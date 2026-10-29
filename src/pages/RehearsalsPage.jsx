import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Check,
  X,
  HelpCircle,
  Trash2,
  Radio,
  Users,
} from 'lucide-react';

const RehearsalsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [rehearsals, setRehearsals] = useState([]);
  const [userBands, setUserBands] = useState([]);
  const [selectedBandFilter, setSelectedBandFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Create Rehearsal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRehearsal, setNewRehearsal] = useState({
    bandId: '',
    title: '',
    description: '',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '18:00',
    location: '',
    isOnline: false,
    onlineLink: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRehearsals();
    if (isAuthenticated) {
      fetchUserBands();
    }
  }, [selectedBandFilter, isAuthenticated]);

  const fetchRehearsals = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedBandFilter !== 'All') {
        params.bandId = selectedBandFilter;
      }
      const res = await api.get('/rehearsals', { params });
      setRehearsals(res.data.rehearsals);
    } catch (err) {
      console.error('Error fetching rehearsals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBands = async () => {
    try {
      const res = await api.get('/bands');
      const myBands = res.data.bands.filter(
        (b) =>
          b.creator?._id === user?._id ||
          b.members?.some((m) => m.user?._id === user?._id)
      );
      setUserBands(myBands);
      if (myBands.length > 0 && !newRehearsal.bandId) {
        setNewRehearsal((prev) => ({ ...prev, bandId: myBands[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching user bands:', err);
    }
  };

  const handleCreateRehearsal = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newRehearsal.bandId || !newRehearsal.title || !newRehearsal.date || !newRehearsal.time || !newRehearsal.location) {
      setNotification({ type: 'error', message: 'Please complete all required rehearsal fields.' });
      return;
    }

    try {
      setCreating(true);
      await api.post('/rehearsals', newRehearsal);
      setNotification({ type: 'success', message: 'Rehearsal successfully scheduled!' });
      setIsModalOpen(false);
      setNewRehearsal({
        bandId: userBands[0]?._id || '',
        title: '',
        description: '',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        time: '18:00',
        location: '',
        isOnline: false,
        onlineLink: '',
      });
      fetchRehearsals();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to schedule rehearsal.',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRSVP = async (rehearsalId, status) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/rehearsals/${rehearsalId}/rsvp`, { status });
      setNotification({ type: 'success', message: `RSVP updated to "${status}".` });
      fetchRehearsals();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update RSVP.',
      });
    }
  };

  const handleCancelRehearsal = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel rehearsal "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/rehearsals/${id}`);
      setNotification({ type: 'success', message: 'Rehearsal cancelled.' });
      fetchRehearsals();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel rehearsal.',
      });
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            Calendar & Sessions
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Rehearsal Scheduling</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Coordinate studio time, setlists, maps, and online jam links across your band rosters.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else if (userBands.length === 0) {
              setNotification({
                type: 'info',
                message: 'You must form or join a band before you can schedule a rehearsal!',
              });
            } else {
              setIsModalOpen(true);
            }
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Schedule Rehearsal
        </button>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filter by Band */}
      {userBands.length > 0 && (
        <div className="card" style={{ marginBottom: '28px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Filter by Band:
            </span>
            <select
              value={selectedBandFilter}
              onChange={(e) => setSelectedBandFilter(e.target.value)}
              style={{ maxWidth: '280px' }}
            >
              <option value="All">All Scheduled Bands</option>
              {userBands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Rehearsals List */}
      {loading ? (
        <LoadingSpinner message="Fetching rehearsal schedule..." />
      ) : rehearsals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {rehearsals.map((reh) => {
            const isCreator = user && reh.createdBy?._id === user._id;
            const myRsvp = reh.attendees?.find((a) => a.user?._id === user?._id)?.status || 'none';

            return (
              <div key={reh._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span className="badge badge-purple">{reh.band?.name || 'Band'}</span>
                      <span className="badge badge-cyan">{reh.status}</span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>{reh.title}</h3>
                  </div>

                  {isCreator && (
                    <button
                      onClick={() => handleCancelRehearsal(reh._id, reh.title)}
                      className="btn btn-danger btn-sm"
                      title="Cancel Rehearsal"
                    >
                      <Trash2 size={15} /> Cancel
                    </button>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px', lineHeight: 1.6 }}>
                  {reh.description || 'Band rehearsal session.'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} style={{ color: 'var(--primary)' }} />
                    <span>{new Date(reh.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} style={{ color: 'var(--secondary)' }} />
                    <span>{reh.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} style={{ color: 'var(--accent-pink)' }} />
                    <span>{reh.location}</span>
                  </div>
                </div>

                {/* RSVP Attendance Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    Organized by: <strong style={{ color: '#fff' }}>{reh.createdBy?.name || 'Musician'}</strong>
                  </div>

                  {isAuthenticated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>My RSVP:</span>
                      <button
                        onClick={() => handleRSVP(reh._id, 'attending')}
                        className={`btn btn-sm ${myRsvp === 'attending' ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        <Check size={14} /> Attending
                      </button>
                      <button
                        onClick={() => handleRSVP(reh._id, 'tentative')}
                        className={`btn btn-sm ${myRsvp === 'tentative' ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        <HelpCircle size={14} /> Maybe
                      </button>
                      <button
                        onClick={() => handleRSVP(reh._id, 'declined')}
                        className={`btn btn-sm ${myRsvp === 'declined' ? 'btn-danger' : 'btn-secondary'}`}
                      >
                        <X size={14} /> Can't Go
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No rehearsals found"
          description="There are currently no upcoming rehearsals scheduled on the calendar."
          actionLabel={userBands.length > 0 ? 'Schedule a Rehearsal' : 'Form a Band First'}
          onAction={() => {
            if (userBands.length > 0) setIsModalOpen(true);
            else navigate('/bands');
          }}
        />
      )}

      {/* Schedule Rehearsal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule a Band Rehearsal"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateRehearsal}
              className="btn btn-primary btn-sm"
              disabled={creating}
            >
              {creating ? 'Scheduling...' : 'Confirm Rehearsal'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateRehearsal}>
          <div className="form-group">
            <label className="form-label">Select Band *</label>
            <select
              value={newRehearsal.bandId}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, bandId: e.target.value })}
              required
            >
              {userBands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.genre})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rehearsal Title / Objective *</label>
            <input
              type="text"
              placeholder="e.g. Setlist Polish for Live Show"
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
              <label className="form-label">Time *</label>
              <input
                type="time"
                value={newRehearsal.time}
                onChange={(e) => setNewRehearsal({ ...newRehearsal, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Studio Location or Meeting Link *</label>
            <input
              type="text"
              placeholder="e.g. Studio 4, Music Row, Nashville or Discord Voice Link"
              value={newRehearsal.location}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Preparation Notes</label>
            <textarea
              rows="3"
              placeholder="Songs to review, tempo changes, what gear to bring..."
              value={newRehearsal.description}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RehearsalsPage;
