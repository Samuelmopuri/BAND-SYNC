import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  Radio,
  Search,
  PlusCircle,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const BandsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [notification, setNotification] = useState(null);

  // Modal State for New Band
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBand, setNewBand] = useState({
    name: '',
    description: '',
    genre: 'Rock',
    location: user?.location || '',
    lookingFor: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBands();
  }, [selectedGenre]);

  const fetchBands = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedGenre !== 'All') params.genre = selectedGenre;

      const res = await api.get('/bands', { params });
      setBands(res.data.bands);
    } catch (err) {
      console.error('Error fetching bands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBands();
  };

  const handleCreateBand = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!newBand.name || !newBand.description || !newBand.genre) {
      setNotification({ type: 'error', message: 'Name, description, and genre are required.' });
      return;
    }

    try {
      setCreating(true);
      const res = await api.post('/bands', newBand);
      setNotification({ type: 'success', message: 'Band founded successfully!' });
      setIsModalOpen(false);
      setNewBand({
        name: '',
        description: '',
        genre: 'Rock',
        location: user?.location || '',
        lookingFor: '',
      });
      fetchBands();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create band.',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleJoinBand = async (bandId, bandName) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/bands/${bandId}/join`, {
        instrument: user?.instruments?.[0] || 'Musician',
      });
      setNotification({
        type: 'success',
        message: `Congratulations! You have joined ${bandName}.`,
      });
      fetchBands();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to join band.',
      });
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
            Groups & Ensembles
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Active Bands</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Discover music groups looking for talent, or start your own lineup.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Form a Band
        </button>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '32px', padding: '20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '14px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search bands by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="All">All Genres</option>
            <option value="Rock">Rock</option>
            <option value="Alternative Rock">Alternative Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Synthwave">Synthwave</option>
            <option value="Indie Pop">Indie Pop</option>
            <option value="Funk">Funk</option>
            <option value="Metal">Metal</option>
          </select>

          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Filter
          </button>
        </form>
      </div>

      {/* Bands Grid */}
      {loading ? (
        <LoadingSpinner message="Loading bands list..." />
      ) : bands.length > 0 ? (
        <div className="grid-3">
          {bands.map((band) => {
            const isMember = band.members?.some((m) => m.user?._id === user?._id) || band.creator?._id === user?._id;

            return (
              <div key={band._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>{band.name}</h3>
                  <span className="badge badge-purple">{band.genre}</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {band.description}
                </p>

                {band.lookingFor && band.lookingFor.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginBottom: '4px', fontWeight: 600 }}>
                      RECRUITING FOR:
                    </div>
                    <div>
                      {band.lookingFor.map((role, idx) => (
                        <span key={idx} className="badge badge-amber" style={{ marginRight: '6px', marginBottom: '4px' }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                  <MapPin size={14} /> {band.location || 'Remote'} &bull; {band.members?.length || 1} members
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Link to={`/bands/${band._id}`} className="btn btn-secondary btn-sm">
                    View Band
                  </Link>
                  {isMember ? (
                    <span className="badge badge-emerald" style={{ justifyContent: 'center' }}>
                      Member
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinBand(band._id, band.name)}
                      className="btn btn-primary btn-sm"
                    >
                      Join Band
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Radio}
          title="No bands match your criteria"
          description="Be the first to found a band in this genre, or try resetting the search filter."
          actionLabel="Form a Band"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Create Band Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form a New Band"
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
              onClick={handleCreateBand}
              className="btn btn-primary btn-sm"
              disabled={creating}
            >
              {creating ? 'Founding Band...' : 'Create Band'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateBand}>
          <div className="form-group">
            <label className="form-label">Band Name *</label>
            <input
              type="text"
              placeholder="e.g. Electric Eclipse"
              value={newBand.name}
              onChange={(e) => setNewBand({ ...newBand, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Musical Genre *</label>
              <input
                type="text"
                placeholder="e.g. Indie Rock"
                value={newBand.genre}
                onChange={(e) => setNewBand({ ...newBand, genre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Base City</label>
              <input
                type="text"
                placeholder="e.g. Austin, TX"
                value={newBand.location}
                onChange={(e) => setNewBand({ ...newBand, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Band Bio & Sound Vision *</label>
            <textarea
              rows="3"
              placeholder="What are your goals, vibe, and planned releases?"
              value={newBand.description}
              onChange={(e) => setNewBand({ ...newBand, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Instruments / Roles Wanted</label>
            <input
              type="text"
              placeholder="e.g. Lead Guitarist, Bassist, Synth"
              value={newBand.lookingFor}
              onChange={(e) => setNewBand({ ...newBand, lookingFor: e.target.value })}
            />
            <div className="form-helper">Separate multiple with commas</div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BandsPage;
