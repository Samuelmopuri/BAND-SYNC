import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import {
  Users,
  Search,
  Filter,
  Send,
  MapPin,
  Sparkles,
  Music,
  CheckCircle2,
} from 'lucide-react';

const DiscoverMusiciansPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Modal State for Collaboration Request
  const [targetMusician, setTargetMusician] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [projectType, setProjectType] = useState('Jam Session');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchMusicians();
  }, [selectedGenre, selectedExperience]);

  const fetchMusicians = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedExperience !== 'All') params.experienceLevel = selectedExperience;

      const res = await api.get('/users', { params });
      setMusicians(res.data.musicians);
    } catch (err) {
      console.error('Error fetching musicians:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMusicians();
  };

  const openCollabModal = (musician) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setTargetMusician(musician);
    setRequestMessage(
      `Hey ${musician.name}! I noticed your style with ${musician.instruments?.[0] || 'music'} and would love to collaborate on a new project.`
    );
    setIsModalOpen(true);
  };

  const handleSendCollaboration = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      setNotification({ type: 'error', message: 'Please write a short collaboration message.' });
      return;
    }

    try {
      setSendingRequest(true);
      await api.post('/collaborations', {
        recipientId: targetMusician._id,
        message: requestMessage.trim(),
        projectType,
      });

      setNotification({
        type: 'success',
        message: `Collaboration request sent to ${targetMusician.name}!`,
      });
      setIsModalOpen(false);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send collaboration request.',
      });
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
          Artist Network
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Discover Musicians</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Search talented players by instrument, musical genre, and experience level.
        </p>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '32px',
          padding: '20px',
          background: 'rgba(20, 24, 38, 0.7)',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '14px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by artist name, instrument, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="All">All Genres</option>
              <option value="Rock">Rock</option>
              <option value="Alternative Rock">Alternative Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Blues">Blues</option>
              <option value="Funk">Funk</option>
              <option value="Metal">Metal</option>
              <option value="Synthwave">Synthwave</option>
              <option value="Indie Pop">Indie Pop</option>
            </select>
          </div>

          <div>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
            >
              <option value="All">All Experience Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {/* Musicians List */}
      {loading ? (
        <LoadingSpinner message="Searching for matching musicians..." />
      ) : musicians.length > 0 ? (
        <div className="grid-3">
          {musicians.map((m) => (
            <div key={m._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.name}`}
                    alt={m.name}
                    style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{m.name}</h3>
                    <span className="badge badge-purple" style={{ marginTop: '2px' }}>
                      {m.experienceLevel}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {m.bio || 'Musician ready to collaborate on original songs and cover tracks.'}
              </p>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  INSTRUMENTS
                </div>
                <div>
                  {m.instruments && m.instruments.length > 0 ? (
                    m.instruments.map((inst, idx) => (
                      <span key={idx} className="tag-chip">
                        {inst}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Not specified</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} /> {m.location || 'Remote / Local'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link to={`/musicians/${m._id}`} className="btn btn-secondary btn-sm">
                  View Profile
                </Link>
                {user?._id !== m._id ? (
                  <button onClick={() => openCollabModal(m)} className="btn btn-primary btn-sm">
                    <Send size={14} /> Request
                  </button>
                ) : (
                  <span className="badge badge-cyan" style={{ justifyContent: 'center' }}>
                    It's You
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No musicians match your search"
          description="Try broadening your search keywords or resetting genre and experience filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedGenre('All');
            setSelectedExperience('All');
            fetchMusicians();
          }}
        />
      )}

      {/* Collaboration Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Collaborate with ${targetMusician?.name}`}
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
              onClick={handleSendCollaboration}
              className="btn btn-primary btn-sm"
              disabled={sendingRequest}
            >
              {sendingRequest ? 'Sending...' : 'Send Request'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSendCollaboration}>
          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="Jam Session">Jam Session</option>
              <option value="Band Audition">Band Audition / Recruitment</option>
              <option value="Songwriting & Recording">Songwriting & Recording</option>
              <option value="Live Gig / Replacement">Live Gig / Replacement</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your Message *</label>
            <textarea
              rows="4"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Explain what kind of music you play and what you have in mind..."
              required
            ></textarea>
            <div className="form-helper">
              The musician will receive this in their Collaboration Requests inbox.
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DiscoverMusiciansPage;
